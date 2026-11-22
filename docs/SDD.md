# Software Design Document
## AI-Driven Autonomous Mobile Application Testing, Vulnerability Assessment, and Self-Healing CI/CD Platform

**Prepared for:** 8-month, six-member B.Tech CSE capstone
**Status:** Review with project mentor before implementation

---

## 1. Purpose and Design Principles

This is an initial architecture for an eight-month capstone. Use a modular Spring Boot control plane with separate AI and scanning workers. Avoid splitting into many microservices before the MVP is stable.

- **Human approval** for uncertain repairs and high-impact release/security actions.
- **AI outputs are proposals** until validated; never execute generated code/commands directly.
- **Persist evidence**, model/prompt version, confidence, decisions and verification outcomes.
- **Separate control APIs** from isolated test/scanner workers.
- **Treat APKs, logs, screenshots and source code** as potentially sensitive.
- **Use least privilege**, scoped credentials, allowlisted targets and audit trails.

---

## 2. Logical Architecture

| Layer | Components | Responsibilities |
|-------|-----------|-----------------|
| Presentation | React + TypeScript + Vite | Projects, run controls, status, findings, repair approvals, reports and analytics |
| Control plane | Java 21 LTS, Spring Boot, Spring Security | Authentication, project/app APIs, job orchestration, permissions, audit and release decisions |
| AI service | Python, FastAPI, Pydantic, Gemini/OpenAI API, scikit-learn | Structured test generation, failure classification, repair ranking, summaries and experiments |
| Mobile execution | Appium 2, UiAutomator2, Java, JUnit 5 | Android UI extraction, execution, screenshots, logs and repair verification |
| Security workers | MobSF, Semgrep, OWASP ZAP, Trivy | Mobile analysis, code/API checks, dependency and container scanning |
| Data | MongoDB; optional Redis/queue; artifact storage | Metadata, test histories, findings, proposals, verification and reports |
| Delivery | Docker, Compose, GitHub Actions; optional Kubernetes | Repeatable builds, CI, worker isolation, deployment and parallelism |
| Observability | Structured logs; optional Prometheus/Grafana | Service health, worker capacity, latency, errors and resources |

---

## 3. Deployment Architecture

Start with Docker Compose for React, Spring Boot, MongoDB, AI and scanner services. Initially run Appium on a machine with Android SDK/emulator access. Emulator-in-container setups can be resource-intensive and require host configuration. Containerize stateless AI/scanner workers first; add Kubernetes only after local end-to-end execution is reliable.

---

## 4. Modules

| Module | Input → Output | Controls |
|--------|---------------|----------|
| Project/app registry | Metadata/APK → project and version records | Auth, file size/type checks, checksum, version history |
| UI analyzer | Appium page source → UI components/interaction graph | Redact sensitive values; version graph snapshots |
| Test generator | UI graph/requirements → structured test candidates | Schema validation; no raw LLM code execution |
| Test runner | Approved test definition → run status/logs/screenshots | Sandbox, timeouts, restricted network, artifact limits |
| Failure analyzer | Exception/log/UI state → hypotheses and evidence | Treat logs as untrusted; redact secrets before LLM calls |
| Repair engine | Failure + old/new UI → candidate patch and confidence | Allowlisted patch types, diff and approval path |
| Repair verifier | Candidate + test → verification result | Re-run test and relevant regression checks |
| Security orchestrator | Authorized APK/source/API → normalized findings | Target allowlist, safe profile and timeout |
| Regression selector | Changes/history/dependencies → ranked test list | Record rationale and compare with full-suite baseline |
| Release-risk engine | Test/security evidence → score and recommendation | Explain factors; policy-based gates; no unsupported certainty |
| Reporting | Runs/findings/repairs → dashboard/report | RBAC, pagination and redaction |

---

## 5. MongoDB Collections / Data Model

| Collection | Illustrative Fields | Notes |
|-----------|-------------------|-------|
| users | _id, email, displayName, role, createdAt | Never store plaintext passwords |
| projects | _id, name, ownerId, members[], createdAt | Project-level access control |
| app_versions | _id, projectId, version, platform, artifactRef, checksum | Store APK in artifact storage, not a large document |
| ui_components | _id, appVersionId, screenKey, type, resourceId, contentDescription, bounds, fingerprint | Redact sensitive field values |
| interaction_graphs | _id, appVersionId, nodes[], edges[], analyzerVersion | Version snapshots; split if graph becomes large |
| test_cases | _id, projectId, appVersionId, name, category, preconditions, steps[], expectedResults[], priority, generatedBy | Structured steps preferred to arbitrary scripts |
| test_runs | _id, testCaseId, appVersionId, pipelineRunId, status, startedAt, durationMs, artifactRefs[] | Index common query fields |
| failure_analyses | _id, testRunId, category, evidenceRefs[], hypotheses[], modelId, promptVersion | Separate hypotheses from confirmed causes |
| healing_proposals | _id, analysisId, oldLocator, candidates[], confidence, patchRef, status | Audit acceptance/rejection and approver |
| repair_verifications | _id, proposalId, verificationRunIds[], result, verifiedAt | Define success as passing verification |
| security_scans | _id, projectId, appVersionId, scanner, scannerVersion, status, reportRef | Preserve original report |
| security_findings | _id, scanId, ruleId, title, severity, evidenceRef, confidence, validationStatus, remediation | Deduplicate and track validation status |
| pipeline_runs | _id, projectId, commitSha, branch, status, startedAt, completedAt | No secrets in metadata |
| release_assessments | _id, pipelineRunId, riskScore, riskLevel, factors[], recommendation, policyVersion | Explain score factors |
| artifacts | _id, projectId, type, storageUri, checksum, sizeBytes, retentionUntil | Screenshots, APKs, logs and reports in object/file storage |

> **Note:** These are conceptual collections, not a requirement to create one collection per ER entity. Embed small bounded arrays such as test steps; reference large histories and artifacts. Choose indexes after observing actual query patterns.

---

## 6. Relationships

- A **project** has many app versions, test cases, scans and pipeline runs.
- An **app version** has many UI components and graph snapshots.
- A **test case** has many runs; a run may have failure analyses.
- A **failure analysis** can produce multiple healing proposals; a proposal can have multiple verification attempts.
- A **security scan** has many normalized findings.
- A **pipeline run** can trigger tests/scans and have release assessments.
- **Artifacts** are referenced by runs/scans rather than duplicating large binaries.

---

## 7. Initial REST API Contract

| Method / Endpoint | Purpose | Validation/Access |
|-------------------|---------|-------------------|
| `POST /api/v1/projects` | Create project | Authenticated; validate owner and fields |
| `GET /api/v1/projects` | List user's projects | Project authorization |
| `POST /api/v1/projects/{projectId}/app-versions` | Register app version | Validate file, checksum, size and access |
| `POST /api/v1/app-versions/{versionId}/test-runs` | Queue test run | Approved version and bounded parameters |
| `GET /api/v1/test-runs/{runId}` | Read run status | Project authorization |
| `POST /api/v1/app-versions/{versionId}/test-generation` | Request test candidates | Rate limit; validate schema and record model/prompt |
| `POST /api/v1/test-runs/{runId}/failure-analysis` | Analyze failed run | Redact secrets; limit payload size |
| `POST /api/v1/healing-proposals/{proposalId}/approve` | Approve repair | Authorized reviewer and audit event |
| `POST /api/v1/healing-proposals/{proposalId}/verify` | Verify repair | Isolated test environment |
| `POST /api/v1/app-versions/{versionId}/security-scans` | Start authorized scan | Allowlist, profile and timeout |
| `GET /api/v1/security-scans/{scanId}/findings` | List findings | Authorization and pagination |
| `POST /api/v1/pipeline-runs` | Record/trigger pipeline | Signed webhook/token and replay protection |
| `GET /api/v1/release-assessments/{assessmentId}` | Read release assessment | Show factors and policy version |

> Endpoint names are proposed examples. Freeze the contract before parallel implementation. Use OpenAPI/Swagger to align frontend/backend.

---

## 8. AI Safeguards

- Use a **provider adapter** so Gemini/OpenAI can be swapped for experiments.
- Require **structured JSON output** and validate with Pydantic or an equivalent schema validator.
- Treat UI text, app content, logs and scanner output as **untrusted data, not instructions**.
- **Never execute** raw LLM-generated shell commands or arbitrary code; convert output to approved test steps.
- Confidence is a **routing signal, not proof**; verify every repair through re-execution and regression checks.
- **Log** model/version, prompt version, latency, token use, validation and outcomes.
- **Redact** credentials, personal data and sensitive screenshots before external API calls.

---

## 9. Security Design

- Authentication and role-based project access.
- Least-privilege worker identities; AI services must not have unrestricted Kubernetes credentials.
- Store keys in environment secrets or a managed secrets service; never commit them.
- Use TLS for hosted endpoints and restrict MongoDB network access.
- Validate uploads, limit size/type, and scan uploads before processing.
- Allowlist authorized targets and isolate scanners/test jobs from production.
- Use timeouts, resource limits, queue limits and cleanup policies.
- Audit scans, repair approvals, policy changes and release decisions.
- Run dependency/container/secret scans in CI and keep dependencies updated.
- Define retention and deletion policies for APKs, screenshots, logs and source code.

---

## 10. CI/CD Pipeline

| Stage | Action | Gate |
|-------|--------|------|
| Checkout | Fetch commit and verify trigger/branch permissions | Reject untrusted triggers where required |
| Build/test | Build services and run unit tests | Fail on build/test failure |
| Static checks | Run SAST, dependency and secret scans | Policy-based severity thresholds |
| Container build | Build and scan images with Trivy | Gate on defined critical findings |
| Deploy test env | Deploy isolated staging environment | No production credentials |
| Mobile tests | Run selected Appium tests and collect evidence | Record failures and coverage |
| Security scan | Run approved mobile/API scan profile | Triage and validate findings |
| AI analysis | Diagnose failures and propose repair; verify approved candidates | AI cannot bypass test gates alone |
| Release assessment | Compute explainable score from verified evidence | Policy/human approval |
| Publish | Store artifacts and report | Redact secrets and enforce retention |

---

## 11. Test Strategy and Tools

| Test Level | Tools | Examples |
|-----------|-------|---------|
| Unit | JUnit 5, Mockito; pytest | Scoring logic, schemas, finding normalization |
| API integration | RestAssured or Spring MockMvc; Postman | Auth, project APIs, job status and findings |
| Mobile UI | Appium + UiAutomator2 | Login, navigation, changed locator and repair |
| Security | MobSF, Semgrep, OWASP ZAP, Trivy | Known vulnerable app, API checks, dependency/image scans |
| Reliability | Controlled fault injection and repeated runs | Timeouts, worker crash, network failure, flaky tests |
| Performance (optional) | k6 or JMeter | API latency and queue load |
| Research analysis | Jupyter, pandas, SciPy/scikit-learn, Matplotlib | Baselines, metrics, statistical analysis and plots |

---

## 12. Research Metrics

| Metric | Definition / Caution |
|--------|---------------------|
| Test validity | Fraction of generated cases that parse, meet constraints and execute |
| Screen/transition coverage | Visited screens/transitions divided by known graph screens/transitions |
| Repair success | Repairs passing defined verification divided by attempted repairs; report false repairs separately |
| False-repair rate | Accepted repairs that change intended behavior or pass the wrong condition, based on controlled validation |
| Regression time reduction | Selected-suite duration vs full-suite duration under comparable conditions |
| Fault detection / mutation score | Detected seeded faults or killed mutants divided by valid seeded faults/mutants |
| Security precision/recall | Use a known, manually validated set; distinguish alerts from confirmed vulnerabilities |
| Human intervention | Manual approvals or edits per test run |
| Infrastructure cost | Worker time, CPU/memory and measured cloud spend where available |

---

## 13. Official Documentation Links

- [Spring Boot](https://docs.spring.io/spring-boot/)
- [React](https://react.dev/)
- [MongoDB](https://www.mongodb.com/docs/)
- [Appium](https://appium.io/docs/)
- [Android](https://developer.android.com/)
- [Docker](https://docs.docker.com/)
- [Kubernetes](https://kubernetes.io/docs/)
- [OWASP MASVS](https://mas.owasp.org/MASVS/)
- [OWASP MASTG](https://mas.owasp.org/MASTG/)
- [OWASP ZAP](https://www.zaproxy.org/)
- [MobSF](https://github.com/MobSF/Mobile-Security-Framework-MobSF)
- [Trivy](https://trivy.dev/)
- [Semgrep](https://semgrep.dev/docs/)
- [Google Patents](https://patents.google.com/)
- [Google Scholar](https://scholar.google.com/)
