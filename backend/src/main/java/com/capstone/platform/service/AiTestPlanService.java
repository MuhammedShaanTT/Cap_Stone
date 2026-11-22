package com.capstone.platform.service;

import com.capstone.platform.dto.aiplan.AiTestPlanResponse;
import com.capstone.platform.dto.testcase.TestCaseResponse;
import com.capstone.platform.exception.ResourceNotFoundException;
import com.capstone.platform.model.AppVersion;
import com.capstone.platform.model.Artifact;
import com.capstone.platform.model.Project;
import com.capstone.platform.model.TestCase;
import com.capstone.platform.repository.AppVersionRepository;
import com.capstone.platform.repository.ArtifactRepository;
import com.capstone.platform.repository.ProjectRepository;
import com.capstone.platform.repository.TestCaseRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.File;
import java.nio.file.Paths;
import java.time.Instant;
import java.util.*;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

/**
 * Service orchestrating Gemini 2.5 Flash AI to generate comprehensive test plans,
 * candidate test cases (automatically persisted to MongoDB), and application
 * improvement recommendations upon mobile application upload.
 */
@Service
public class AiTestPlanService {

    private static final Logger log = LoggerFactory.getLogger(AiTestPlanService.class);

    private final GeminiAiService geminiAiService;
    private final ProjectRepository projectRepository;
    private final AppVersionRepository appVersionRepository;
    private final ArtifactRepository artifactRepository;
    private final TestCaseRepository testCaseRepository;
    private final ObjectMapper objectMapper;

    public AiTestPlanService(GeminiAiService geminiAiService,
                             ProjectRepository projectRepository,
                             AppVersionRepository appVersionRepository,
                             ArtifactRepository artifactRepository,
                             TestCaseRepository testCaseRepository,
                             ObjectMapper objectMapper) {
        this.geminiAiService = geminiAiService;
        this.projectRepository = projectRepository;
        this.appVersionRepository = appVersionRepository;
        this.artifactRepository = artifactRepository;
        this.testCaseRepository = testCaseRepository;
        this.objectMapper = objectMapper;
    }

    public AiTestPlanResponse generateAndSaveTestPlan(String projectId, String versionId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", projectId));

        AppVersion appVersion = appVersionRepository.findById(versionId)
                .orElseThrow(() -> new ResourceNotFoundException("AppVersion", versionId));

        String appName = project.getName() != null ? project.getName() : "Mobile App";
        String packageName = appVersion.getPackageName() != null ? appVersion.getPackageName() : "com.example.app";
        String version = appVersion.getVersion() != null ? appVersion.getVersion() : "1.0.0";
        long fileSizeBytes = appVersion.getFileSizeBytes() != null ? appVersion.getFileSizeBytes() : 0L;

        // Inspect APK file artifact if stored on disk
        String extraContext = inspectApkArtifact(appVersion);

        String rawJson = geminiAiService.generateTestPlanAndImprovements(
                appName, packageName, version, fileSizeBytes, extraContext
        );

        AiTestPlanResponse.TestPlanDetails testPlan;
        List<TestCase.TestStep> parsedSteps = new ArrayList<>();
        List<RawTestCase> rawTestCases = new ArrayList<>();
        AiTestPlanResponse.AppImprovements appImprovements;

        if (rawJson != null && !rawJson.isBlank()) {
            try {
                JsonNode root = objectMapper.readTree(rawJson);

                // 1. Parse Test Plan
                JsonNode tpNode = root.path("testPlan");
                testPlan = parseTestPlan(tpNode, appName, version);

                // 2. Parse Test Cases
                JsonNode tcArray = root.path("suggestedTestCases");
                if (tcArray.isArray()) {
                    for (JsonNode tc : tcArray) {
                        rawTestCases.add(parseRawTestCase(tc));
                    }
                }

                // 3. Parse Improvements
                JsonNode impNode = root.path("applicationImprovements");
                appImprovements = parseImprovements(impNode);

            } catch (Exception e) {
                log.warn("Failed to parse Gemini AI response JSON, switching to intelligent fallback: {}", e.getMessage());
                testPlan = buildFallbackTestPlan(appName, version);
                rawTestCases = buildFallbackTestCases(appName);
                appImprovements = buildFallbackImprovements();
            }
        } else {
            log.info("Gemini AI offline or key unavailable, generating heuristic baseline test plan & cases");
            testPlan = buildFallbackTestPlan(appName, version);
            rawTestCases = buildFallbackTestCases(appName);
            appImprovements = buildFallbackImprovements();
        }

        // Persist generated candidate test cases directly into MongoDB
        List<TestCase> entitiesToSave = new ArrayList<>();
        for (RawTestCase rtc : rawTestCases) {
            TestCase tc = TestCase.builder()
                    .projectId(projectId)
                    .appVersionId(versionId)
                    .name(rtc.name())
                    .category(rtc.category())
                    .priority(rtc.priority())
                    .preconditions(rtc.preconditions())
                    .steps(rtc.steps())
                    .expectedResults(rtc.expectedResults())
                    .generatedBy("AI_GEMINI_2.5_FLASH")
                    .modelId(geminiAiService.getModelId())
                    .promptVersion("v1.0")
                    .status("CANDIDATE")
                    .createdAt(Instant.now())
                    .build();
            entitiesToSave.add(tc);
        }

        List<TestCase> savedEntities = testCaseRepository.saveAll(entitiesToSave);
        List<TestCaseResponse> responseTestCases = savedEntities.stream()
                .map(this::toTestCaseResponse)
                .toList();

        return new AiTestPlanResponse(
                projectId,
                versionId,
                appName,
                packageName,
                version,
                testPlan,
                responseTestCases,
                appImprovements,
                geminiAiService.getModelId(),
                Instant.now(),
                savedEntities.size()
        );
    }

    private String inspectApkArtifact(AppVersion appVersion) {
        if (appVersion.getArtifactRef() == null) {
            return "";
        }
        Optional<Artifact> artifactOpt = artifactRepository.findById(appVersion.getArtifactRef());
        if (artifactOpt.isEmpty() || artifactOpt.get().getStorageUri() == null) {
            return "";
        }

        File file = new File(artifactOpt.get().getStorageUri());
        if (!file.exists() || !file.canRead() || file.length() < 1000) {
            return "";
        }

        try (ZipFile zipFile = new ZipFile(file)) {
            int dexCount = 0;
            boolean hasNativeLibs = false;
            boolean isFlutter = false;
            boolean isReactNative = false;
            List<String> detectedArchs = new ArrayList<>();

            Enumeration<? extends ZipEntry> entries = zipFile.entries();
            while (entries.hasMoreElements()) {
                ZipEntry entry = entries.nextElement();
                String name = entry.getName();
                if (name.endsWith(".dex")) dexCount++;
                if (name.startsWith("lib/")) {
                    hasNativeLibs = true;
                    String[] parts = name.split("/");
                    if (parts.length > 1 && !detectedArchs.contains(parts[1])) {
                        detectedArchs.add(parts[1]);
                    }
                }
                if (name.contains("flutter_assets")) isFlutter = true;
                if (name.contains("index.android.bundle")) isReactNative = true;
            }

            StringBuilder sb = new StringBuilder();
            sb.append(String.format("DEX files detected: %d. ", dexCount));
            if (hasNativeLibs) {
                sb.append("Native architectures: ").append(String.join(", ", detectedArchs)).append(". ");
            }
            if (isFlutter) sb.append("Framework: Flutter detected. ");
            if (isReactNative) sb.append("Framework: React Native detected. ");
            return sb.toString();
        } catch (Exception e) {
            log.debug("APK zip inspection skipped: {}", e.getMessage());
            return "";
        }
    }

    private AiTestPlanResponse.TestPlanDetails parseTestPlan(JsonNode tpNode, String appName, String version) {
        String title = tpNode.path("title").asText("Autonomous Test Plan for " + appName);
        String summary = tpNode.path("executiveSummary").asText("Automated quality verification test strategy for " + appName + " v" + version);

        JsonNode scopeNode = tpNode.path("scope");
        List<String> inScope = jsonArrayToStringList(scopeNode.path("inScope"));
        List<String> outOfScope = jsonArrayToStringList(scopeNode.path("outOfScope"));
        if (inScope.isEmpty()) {
            inScope = List.of("Core UI Workflows", "Vulnerability Assessment", "Regression Validation", "Memory & Performance Sanity");
        }

        List<String> devices = jsonArrayToStringList(tpNode.path("deviceMatrix"));
        if (devices.isEmpty()) {
            devices = List.of(
                    "Google Pixel 8 (Android 14, API 34) - Reference device",
                    "Samsung Galaxy S23 (Android 14, OneUI 6) - High market share OEM",
                    "Xiaomi Redmi Note 12 (Android 13, MIUI 14) - Resource constrained profile"
            );
        }

        List<AiTestPlanResponse.TestingPhase> phases = new ArrayList<>();
        JsonNode phasesNode = tpNode.path("testingPhases");
        if (phasesNode.isArray()) {
            for (JsonNode ph : phasesNode) {
                phases.add(new AiTestPlanResponse.TestingPhase(
                        ph.path("phase").asText("Testing Phase"),
                        ph.path("description").asText("Phase execution scope")
                ));
            }
        }
        if (phases.isEmpty()) {
            phases.add(new AiTestPlanResponse.TestingPhase("Phase 1: Installation & Smoke Test", "Validate APK installation, launch time, and basic navigation without ANR/crash."));
            phases.add(new AiTestPlanResponse.TestingPhase("Phase 2: Functional & Boundary Testing", "Exhaustive user interaction verification and input boundary handling."));
            phases.add(new AiTestPlanResponse.TestingPhase("Phase 3: Security & MASVS Audit", "SAST analysis for insecure communications, hardcoded secrets, and component exposure."));
        }

        List<String> exitCriteria = jsonArrayToStringList(tpNode.path("exitCriteria"));
        if (exitCriteria.isEmpty()) {
            exitCriteria = List.of(
                    "Zero Critical or High severity vulnerabilities detected.",
                    "100% of P0 smoke test cases passing without failure.",
                    "App cold startup under 2000ms on standard device profile."
            );
        }

        return new AiTestPlanResponse.TestPlanDetails(
                title, summary,
                new AiTestPlanResponse.ScopeDetails(inScope, outOfScope),
                devices, phases, exitCriteria
        );
    }

    private RawTestCase parseRawTestCase(JsonNode tc) {
        String name = tc.path("name").asText("Automated Mobile Test Case");
        String category = tc.path("category").asText("FUNCTIONAL");
        String priority = tc.path("priority").asText("HIGH");

        List<String> preconditions = jsonArrayToStringList(tc.path("preconditions"));
        List<String> expectedResults = jsonArrayToStringList(tc.path("expectedResults"));

        List<TestCase.TestStep> steps = new ArrayList<>();
        JsonNode stepsArray = tc.path("steps");
        if (stepsArray.isArray()) {
            int idx = 1;
            for (JsonNode st : stepsArray) {
                steps.add(TestCase.TestStep.builder()
                        .order(st.path("order").asInt(idx++))
                        .action(st.path("action").asText("CLICK"))
                        .target(st.path("target").asText("element"))
                        .value(st.path("value").asText(""))
                        .description(st.path("description").asText("Execute test step"))
                        .build());
            }
        }

        return new RawTestCase(name, category, priority, preconditions, steps, expectedResults);
    }

    private AiTestPlanResponse.AppImprovements parseImprovements(JsonNode impNode) {
        List<String> security = jsonArrayToStringList(impNode.path("security"));
        List<String> performance = jsonArrayToStringList(impNode.path("performance"));
        List<String> uiUx = jsonArrayToStringList(impNode.path("uiUx"));
        List<String> architecture = jsonArrayToStringList(impNode.path("architecture"));

        if (security.isEmpty()) {
            security = List.of(
                    "Enable ProGuard / R8 code obfuscation with aggressive minification to protect proprietary logic.",
                    "Enforce strict Android Network Security Configuration (cleartextTrafficPermitted=false).",
                    "Migrate sensitive credentials and tokens to Android Keystore / EncryptedSharedPreferences."
            );
        }
        if (performance.isEmpty()) {
            performance = List.of(
                    "Generate Android Baseline Profiles to accelerate runtime DEX pre-compilation by up to 30%.",
                    "Optimize image assets by migrating PNGs to WebP and vector drawables to reduce binary size.",
                    "Audit background execution and alarms to adhere to Android 14 power-saving restrictions."
            );
        }
        if (uiUx.isEmpty()) {
            uiUx = List.of(
                    "Ensure interactive touch targets satisfy the 48x48dp minimum required for WCAG 2.1 accessibility.",
                    "Adopt edge-to-edge system bar padding for seamless Android 14+ navigation bars.",
                    "Provide explicit offline state views and graceful error retries across all network views."
            );
        }
        if (architecture.isEmpty()) {
            architecture = List.of(
                    "Adopt Clean Architecture with MVVM/MVI to strictly decouple business rules from Android UI components.",
                    "Implement an ANR watchdog and structured crash reporting pipeline (e.g. Sentry / Firebase Crashlytics).",
                    "Incorporate dependency injection (Hilt) to simplify mock injection for automated unit & UI tests."
            );
        }

        return new AiTestPlanResponse.AppImprovements(security, performance, uiUx, architecture);
    }

    private List<String> jsonArrayToStringList(JsonNode node) {
        List<String> list = new ArrayList<>();
        if (node != null && node.isArray()) {
            for (JsonNode item : node) {
                list.add(item.asText());
            }
        }
        return list;
    }

    private TestCaseResponse toTestCaseResponse(TestCase tc) {
        List<TestCaseResponse.StepInfo> stepInfos = tc.getSteps() == null ? List.of() :
                tc.getSteps().stream()
                        .map(s -> new TestCaseResponse.StepInfo(
                                s.getOrder(),
                                s.getAction(),
                                s.getTarget(),
                                s.getValue(),
                                s.getDescription()
                        ))
                        .toList();

        return new TestCaseResponse(
                tc.getId(),
                tc.getProjectId(),
                tc.getAppVersionId(),
                tc.getName(),
                tc.getCategory(),
                tc.getPreconditions(),
                stepInfos,
                tc.getExpectedResults(),
                tc.getPriority(),
                tc.getGeneratedBy(),
                tc.getStatus(),
                tc.getCreatedAt()
        );
    }

    private AiTestPlanResponse.TestPlanDetails buildFallbackTestPlan(String appName, String version) {
        return new AiTestPlanResponse.TestPlanDetails(
                "Autonomous Mobile Quality & Verification Test Plan for " + appName,
                "Comprehensive automated test strategy and verification plan for " + appName + " v" + version + ", establishing quality gates for production release readiness.",
                new AiTestPlanResponse.ScopeDetails(
                        List.of("APK Binary Launch & Smoke Testing", "User Interaction Workflows", "Security SAST/DAST Audit", "Performance & Memory Sanity"),
                        List.of("Third-party payment gateways in sandbox", "Hardware-specific peripheral sensors")
                ),
                List.of(
                        "Google Pixel 8 (Android 14, API 34) - Reference stock Android device",
                        "Samsung Galaxy S23 (Android 14, OneUI 6) - Global OEM market leader",
                        "Xiaomi Redmi Note 12 (Android 13, MIUI 14) - Mid-range memory constrained profile"
                ),
                List.of(
                        new AiTestPlanResponse.TestingPhase("Phase 1: Installation & Cold Launch", "Verify APK installation integrity, SHA-256 signature, launch latency under 2000ms."),
                        new AiTestPlanResponse.TestingPhase("Phase 2: Core User Interaction Workflows", "Execute Appium UI Automator2 tests across primary views and input boundaries."),
                        new AiTestPlanResponse.TestingPhase("Phase 3: OWASP Mobile Security & CWE Verification", "Scan for hardcoded secrets, cleartext traffic, and exported intent vulnerabilities."),
                        new AiTestPlanResponse.TestingPhase("Phase 4: Non-Functional Sanity & Release Gate", "Assess memory usage, ANR frequency, and verify self-healing locator patches.")
                ),
                List.of(
                        "Zero Critical or High severity security vulnerabilities (OWASP MASVS L1).",
                        "100% of P0 smoke test cases passing.",
                        "No unhandled crashes or ANRs detected during execution."
                )
        );
    }

    private List<RawTestCase> buildFallbackTestCases(String appName) {
        List<RawTestCase> list = new ArrayList<>();
        list.add(new RawTestCase(
                "Verify Application Cold Startup & Main Container Rendering",
                "SMOKE", "CRITICAL",
                List.of("Application is installed", "Device screen is unlocked"),
                List.of(
                        TestCase.TestStep.builder().order(1).action("CLICK").target("id/app_icon").value("").description("Launch application from home screen").build(),
                        TestCase.TestStep.builder().order(2).action("WAIT").target("id/main_content").value("2000").description("Wait for main activity content container").build(),
                        TestCase.TestStep.builder().order(3).action("ASSERT").target("id/main_content").value("visible").description("Assert main layout is rendered").build()
                ),
                List.of("Application launches cleanly within 2 seconds", "No crash or ANR dialog")
        ));

        list.add(new RawTestCase(
                "Verify Primary User Interaction and Action Response",
                "FUNCTIONAL", "HIGH",
                List.of("Application is in foreground on home screen"),
                List.of(
                        TestCase.TestStep.builder().order(1).action("CLICK").target("id/btn_action_primary").value("").description("Tap primary action button").build(),
                        TestCase.TestStep.builder().order(2).action("ASSERT").target("id/view_result").value("displayed").description("Assert response view is displayed").build()
                ),
                List.of("UI transitions smoothly without flickering", "Expected state change is observed")
        ));

        list.add(new RawTestCase(
                "Verify Input Validation and Boundary Character Handling",
                "FUNCTIONAL", "HIGH",
                List.of("Target input view is accessible"),
                List.of(
                        TestCase.TestStep.builder().order(1).action("TYPE").target("id/input_field").value("<script>alert(1)</script>").description("Inject boundary/special characters").build(),
                        TestCase.TestStep.builder().order(2).action("CLICK").target("id/btn_submit").value("").description("Submit input").build(),
                        TestCase.TestStep.builder().order(3).action("ASSERT").target("id/txt_status").value("valid").description("Assert application handles input gracefully").build()
                ),
                List.of("Special characters handled without unhandled exception", "Input sanitization verified")
        ));

        list.add(new RawTestCase(
                "Verify Network Interruption & Offline Graceful Degradation",
                "EDGE_CASE", "MEDIUM",
                List.of("Application active in foreground"),
                List.of(
                        TestCase.TestStep.builder().order(1).action("SWIPE").target("screen").value("down").description("Pull to refresh content").build(),
                        TestCase.TestStep.builder().order(2).action("ASSERT").target("id/error_banner").value("offline_notice").description("Assert friendly offline banner appears").build()
                ),
                List.of("No NullPointerException or crash occurs", "Graceful offline state displayed")
        ));

        list.add(new RawTestCase(
                "Verify Insecure Storage & Manifest Permissions Audit",
                "SECURITY", "CRITICAL",
                List.of("APK binary available for static inspection"),
                List.of(
                        TestCase.TestStep.builder().order(1).action("ASSERT").target("manifest/uses-permission").value("no_dangerous_overreach").description("Audit requested permissions").build(),
                        TestCase.TestStep.builder().order(2).action("ASSERT").target("data/shared_prefs").value("encrypted").description("Verify sensitive files are encrypted").build()
                ),
                List.of("Zero world-readable shared preferences files", "No dangerous unneeded permissions requested")
        ));

        return list;
    }

    private AiTestPlanResponse.AppImprovements buildFallbackImprovements() {
        return new AiTestPlanResponse.AppImprovements(
                List.of(
                        "Enable ProGuard / R8 bytecode obfuscation and resource shrinking in build.gradle.",
                        "Enforce Android Network Security Configuration (res/xml/network_security_config.xml) with cleartextTrafficPermitted=false.",
                        "Migrate local credentials and auth tokens to Android Keystore / EncryptedSharedPreferences."
                ),
                List.of(
                        "Generate Android Baseline Profiles to speed up cold startup launch time by 20–30%.",
                        "Convert image resources to WebP and vector drawables to compress overall APK download size.",
                        "Audit long-running background tasks and migrate to WorkManager with battery-aware constraints."
                ),
                List.of(
                        "Ensure interactive buttons meet the WCAG 2.1 48x48dp minimum touch target requirement.",
                        "Implement edge-to-edge system bar rendering for seamless modern Android 14 navigation bars.",
                        "Provide responsive loading skeletons and offline placeholder states for enhanced perceived latency."
                ),
                List.of(
                        "Adopt Clean Architecture with MVVM/MVI to decouple presentation state from data repositories.",
                        "Integrate an automated ANR watchdog and crash reporting SDK (Sentry / Firebase Crashlytics).",
                        "Implement dependency injection with Hilt to facilitate isolated mock-based test automation."
                )
        );
    }

    private record RawTestCase(
            String name,
            String category,
            String priority,
            List<String> preconditions,
            List<TestCase.TestStep> steps,
            List<String> expectedResults
    ) {}
}
