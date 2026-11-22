package com.capstone.platform.config;

import com.capstone.platform.model.*;
import com.capstone.platform.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.List;
import java.util.Set;

/**
 * Seeds initial demo data on application startup so the prototype is ready for immediate testing.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final AppVersionRepository appVersionRepository;
    private final TestCaseRepository testCaseRepository;
    private final TestRunRepository testRunRepository;
    private final PipelineRunRepository pipelineRunRepository;
    private final SecurityScanRepository securityScanRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           ProjectRepository projectRepository,
                           AppVersionRepository appVersionRepository,
                           TestCaseRepository testCaseRepository,
                           TestRunRepository testRunRepository,
                           PipelineRunRepository pipelineRunRepository,
                           SecurityScanRepository securityScanRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
        this.appVersionRepository = appVersionRepository;
        this.testCaseRepository = testCaseRepository;
        this.testRunRepository = testRunRepository;
        this.pipelineRunRepository = pipelineRunRepository;
        this.securityScanRepository = securityScanRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already contains data; skipping initial demo seeding.");
            return;
        }

        log.info("Seeding initial prototype demo data...");

        // 1. Users
        User admin = User.builder()
                .email("admin@example.com")
                .displayName("System Administrator")
                .passwordHash(passwordEncoder.encode("password123"))
                .role("ADMIN")
                .permissions(Set.of("ALL"))
                .createdAt(Instant.now())
                .build();
        admin = userRepository.save(admin);

        User dev = User.builder()
                .email("developer@example.com")
                .displayName("Mobile Developer")
                .passwordHash(passwordEncoder.encode("password123"))
                .role("MEMBER")
                .permissions(Set.of("READ", "WRITE"))
                .createdAt(Instant.now())
                .build();
        dev = userRepository.save(dev);

        // 2. Demo Project
        Project project = Project.builder()
                .name("Calculator Android App")
                .description("Production Android Calculator App with Automated UI and Security Pipelines")
                .ownerId(admin.getId())
                .members(List.of(
                        Project.ProjectMember.builder().userId(admin.getId()).role("OWNER").build(),
                        Project.ProjectMember.builder().userId(dev.getId()).role("DEVELOPER").build()
                ))
                .createdAt(Instant.now())
                .build();
        project = projectRepository.save(project);

        // 3. App Versions
        AppVersion v1 = AppVersion.builder()
                .projectId(project.getId())
                .version("1.0.0")
                .platform("ANDROID")
                .packageName("com.example.calculator")
                .versionCode("1")
                .createdAt(Instant.now())
                .build();
        v1 = appVersionRepository.save(v1);

        AppVersion v2 = AppVersion.builder()
                .projectId(project.getId())
                .version("2.0.0")
                .platform("ANDROID")
                .packageName("com.example.calculator")
                .versionCode("2")
                .createdAt(Instant.now())
                .build();
        v2 = appVersionRepository.save(v2);

        // 4. Test Cases
        TestCase tc1 = TestCase.builder()
                .projectId(project.getId())
                .appVersionId(v1.getId())
                .name("Login Flow Test")
                .category("FUNCTIONAL")
                .priority("HIGH")
                .preconditions(List.of("App installed", "User on login screen"))
                .steps(List.of(
                        TestCase.TestStep.builder().order(1).action("TYPE").target("email_input").value("admin@example.com").description("Enter email").build(),
                        TestCase.TestStep.builder().order(2).action("TYPE").target("password_input").value("password123").description("Enter password").build(),
                        TestCase.TestStep.builder().order(3).action("CLICK").target("login_btn").description("Tap Login").build()
                ))
                .expectedResults(List.of("User lands on Dashboard"))
                .generatedBy("AI_AGENT")
                .status("APPROVED")
                .createdAt(Instant.now())
                .build();
        tc1 = testCaseRepository.save(tc1);

        TestCase tc2 = TestCase.builder()
                .projectId(project.getId())
                .appVersionId(v1.getId())
                .name("Basic Addition Test")
                .category("FUNCTIONAL")
                .priority("HIGH")
                .preconditions(List.of("App on calculator screen"))
                .steps(List.of(
                        TestCase.TestStep.builder().order(1).action("CLICK").target("btn_5").description("Press 5").build(),
                        TestCase.TestStep.builder().order(2).action("CLICK").target("btn_plus").description("Press +").build(),
                        TestCase.TestStep.builder().order(3).action("CLICK").target("btn_3").description("Press 3").build(),
                        TestCase.TestStep.builder().order(4).action("CLICK").target("btn_equals").description("Press =").build()
                ))
                .expectedResults(List.of("Display shows 8"))
                .generatedBy("MANUAL")
                .status("APPROVED")
                .createdAt(Instant.now())
                .build();
        tc2 = testCaseRepository.save(tc2);

        TestCase tc3 = TestCase.builder()
                .projectId(project.getId())
                .appVersionId(v1.getId())
                .name("Division By Zero Error Handling")
                .category("ERROR_HANDLING")
                .priority("CRITICAL")
                .preconditions(List.of("App on calculator screen"))
                .steps(List.of(
                        TestCase.TestStep.builder().order(1).action("CLICK").target("btn_9").description("Press 9").build(),
                        TestCase.TestStep.builder().order(2).action("CLICK").target("btn_divide").description("Press /").build(),
                        TestCase.TestStep.builder().order(3).action("CLICK").target("btn_0").description("Press 0").build(),
                        TestCase.TestStep.builder().order(4).action("CLICK").target("btn_equals").description("Press =").build()
                ))
                .expectedResults(List.of("Error message shown without app crash"))
                .generatedBy("AI_AGENT")
                .status("APPROVED")
                .createdAt(Instant.now())
                .build();
        tc3 = testCaseRepository.save(tc3);

        // 5. Test Runs
        TestRun run1 = TestRun.builder()
                .testCaseId(tc2.getId())
                .appVersionId(v1.getId())
                .status("PASSED")
                .startedAt(Instant.now().minusSeconds(120))
                .completedAt(Instant.now().minusSeconds(115))
                .durationMs(5000L)
                .executedBy("Appium-UiAutomator2-Worker")
                .environment("Pixel_7_Android_14")
                .build();
        testRunRepository.save(run1);

        // 6. Pipeline Run
        PipelineRun pipelineRun = PipelineRun.builder()
                .projectId(project.getId())
                .commitSha("a7f83b2e9c1d045")
                .branch("main")
                .triggerType("MANUAL")
                .status("SUCCESS")
                .testRunCount(2)
                .testPassCount(2)
                .scanCount(1)
                .criticalFindings(0)
                .startedAt(Instant.now().minusSeconds(300))
                .completedAt(Instant.now().minusSeconds(100))
                .durationMs(200000L)
                .build();
        pipelineRunRepository.save(pipelineRun);

        // 7. Security Scan
        SecurityScan scan = SecurityScan.builder()
                .projectId(project.getId())
                .appVersionId(v1.getId())
                .scanner("MOBSF")
                .scannerVersion("3.9.0")
                .profile("FULL")
                .status("COMPLETED")
                .findingsCount(3)
                .criticalCount(0)
                .highCount(1)
                .startedAt(Instant.now().minusSeconds(400))
                .completedAt(Instant.now().minusSeconds(310))
                .durationMs(90000L)
                .createdAt(Instant.now())
                .build();
        securityScanRepository.save(scan);

        log.info("Demo data initialized successfully:");
        log.info("  User: admin@example.com / password123 (ADMIN)");
        log.info("  User: developer@example.com / password123 (MEMBER)");
        log.info("  Project ID: {}", project.getId());
    }
}
