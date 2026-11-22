package com.capstone.platform.service;

import com.capstone.platform.dto.aiplan.AiTestPlanResponse;
import com.capstone.platform.model.AppVersion;
import com.capstone.platform.model.Project;
import com.capstone.platform.model.TestCase;
import com.capstone.platform.repository.AppVersionRepository;
import com.capstone.platform.repository.ArtifactRepository;
import com.capstone.platform.repository.ProjectRepository;
import com.capstone.platform.repository.TestCaseRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

class AiTestPlanServiceTest {

    @Mock
    private GeminiAiService geminiAiService;

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private AppVersionRepository appVersionRepository;

    @Mock
    private ArtifactRepository artifactRepository;

    @Mock
    private TestCaseRepository testCaseRepository;

    private ObjectMapper objectMapper;
    private AiTestPlanService aiTestPlanService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        objectMapper = new ObjectMapper();
        aiTestPlanService = new AiTestPlanService(
                geminiAiService,
                projectRepository,
                appVersionRepository,
                artifactRepository,
                testCaseRepository,
                objectMapper
        );
    }

    @Test
    void generateAndSaveTestPlan_withValidGeminiJson_shouldParseAndPersistTestCases() {
        String projectId = "proj-1";
        String versionId = "ver-1";

        Project project = Project.builder().id(projectId).name("Calculator App").build();
        AppVersion appVersion = AppVersion.builder()
                .id(versionId)
                .projectId(projectId)
                .version("1.0.0")
                .packageName("com.example.calculator")
                .fileSizeBytes(5000000L)
                .build();

        when(projectRepository.findById(projectId)).thenReturn(Optional.of(project));
        when(appVersionRepository.findById(versionId)).thenReturn(Optional.of(appVersion));
        when(geminiAiService.getModelId()).thenReturn("gemini-2.5-flash");

        String fakeJson = """
            {
              "testPlan": {
                "title": "Calculator Test Plan",
                "executiveSummary": "Test plan for calculator app",
                "scope": {
                  "inScope": ["Basic Arithmetic", "Division by zero"],
                  "outOfScope": ["Third party ads"]
                },
                "deviceMatrix": ["Pixel 8 (Android 14)"],
                "testingPhases": [
                  {"phase": "Smoke", "description": "Launch sanity"}
                ],
                "exitCriteria": ["Zero crashes"]
              },
              "suggestedTestCases": [
                {
                  "name": "Verify Addition",
                  "category": "FUNCTIONAL",
                  "priority": "HIGH",
                  "preconditions": ["App open"],
                  "steps": [
                    {"order": 1, "action": "CLICK", "target": "btn_2", "value": "", "description": "Tap 2"},
                    {"order": 2, "action": "CLICK", "target": "btn_plus", "value": "", "description": "Tap +"}
                  ],
                  "expectedResults": ["Result shows 2"]
                }
              ],
              "applicationImprovements": {
                "security": ["Obfuscate with R8"],
                "performance": ["Use baseline profiles"],
                "uiUx": ["Improve touch targets"],
                "architecture": ["Adopt MVVM"]
              }
            }
            """;

        when(geminiAiService.generateTestPlanAndImprovements(anyString(), anyString(), anyString(), anyLong(), anyString()))
                .thenReturn(fakeJson);

        when(testCaseRepository.saveAll(anyList())).thenAnswer(invocation -> {
            List<TestCase> list = invocation.getArgument(0);
            return list.stream().peek(tc -> tc.setId("tc-saved-1")).toList();
        });

        AiTestPlanResponse response = aiTestPlanService.generateAndSaveTestPlan(projectId, versionId);

        assertNotNull(response);
        assertEquals(projectId, response.projectId());
        assertEquals("Calculator App", response.appName());
        assertEquals(1, response.persistedTestCasesCount());
        assertEquals("Calculator Test Plan", response.testPlan().title());
        assertEquals(1, response.generatedTestCases().size());
        assertEquals("Verify Addition", response.generatedTestCases().get(0).name());
        assertEquals(1, response.applicationImprovements().security().size());
        assertEquals("Obfuscate with R8", response.applicationImprovements().security().get(0));
    }

    @Test
    void generateAndSaveTestPlan_whenGeminiUnavailable_shouldUseHeuristicFallback() {
        String projectId = "proj-1";
        String versionId = "ver-1";

        Project project = Project.builder().id(projectId).name("Demo App").build();
        AppVersion appVersion = AppVersion.builder()
                .id(versionId)
                .projectId(projectId)
                .version("1.0.0")
                .packageName("com.example.demo")
                .build();

        when(projectRepository.findById(projectId)).thenReturn(Optional.of(project));
        when(appVersionRepository.findById(versionId)).thenReturn(Optional.of(appVersion));
        when(geminiAiService.getModelId()).thenReturn("gemini-2.5-flash");
        when(geminiAiService.generateTestPlanAndImprovements(anyString(), anyString(), anyString(), anyLong(), anyString()))
                .thenReturn(null);

        when(testCaseRepository.saveAll(anyList())).thenAnswer(invocation -> {
            List<TestCase> list = invocation.getArgument(0);
            return list.stream().peek(tc -> tc.setId("tc-fallback")).toList();
        });

        AiTestPlanResponse response = aiTestPlanService.generateAndSaveTestPlan(projectId, versionId);

        assertNotNull(response);
        assertTrue(response.persistedTestCasesCount() > 0);
        assertNotNull(response.testPlan());
        assertNotNull(response.applicationImprovements());
        assertFalse(response.applicationImprovements().security().isEmpty());
    }
}
