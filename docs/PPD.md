# Project Planning Document
## AI-Driven Autonomous Mobile Application Testing, Vulnerability Assessment, and Self-Healing CI/CD Platform

**Prepared for:** 8-month, six-member B.Tech CSE capstone
**Status:** Review the scope and milestones with the project mentor before implementation

---

## 1. Project Overview

A web platform combining AI-assisted mobile test generation, Appium execution, confidence-aware test repair, security scanning, regression-test prioritization and CI/CD release assessment. It is designed for applications the team owns or is authorized to test. AI output and scanner alerts are treated as evidence to validate, not unquestioned truth.

---

## 2. Problem Statement

Mobile testing requires ongoing effort to author test cases, maintain UI locators, diagnose failures, select regression tests and interpret security scan output. The project investigates whether context-aware LLM assistance, UI models, repair verification and unified security triage can reduce maintenance effort and improve testing efficiency without increasing false repairs.

---

## 3. Objectives

- Register projects and Android app versions and manage test runs.
- Extract Android UI hierarchy and construct an application interaction graph.
- Generate structured candidate test cases with an LLM and validate them before execution.
- Execute tests through Appium using Java and JUnit 5.
- Diagnose failures, propose confidence-scored repairs and verify them through re-execution.
- Integrate mobile, static/API, dependency and container security checks.
- Prioritize regression tests and produce explainable release-risk reports.
- Automate CI/CD; add Docker and small-scale Kubernetes workers after local execution is stable.
- Evaluate against baselines and prepare a research paper and evidence-based patentability assessment.

---

## 4. Scope

### In Scope
- Android-first prototype; one primary LLM provider initially.
- Appium, test generation, locator repair proposals, repair verification and reports.
- MobSF-based mobile assessment plus selected code/API/dependency/container checks.
- Docker, CI/CD, and Kubernetes parallelism if time/resources allow.
- Controlled experiments, reproducible datasets and release-risk visualization.

### Out of Scope for First Release
- Unrestricted testing of third-party apps or systems.
- Automatic changes to production apps or infrastructure.
- Training a foundation model from scratch.
- Guaranteed vulnerability detection, guaranteed repair or guaranteed patent grant.
- Support for every mobile OS/device/CI provider.

---

## 5. Success Criteria

| Area | Acceptance Criterion | Evidence |
|------|---------------------|----------|
| MVP | Register app, run Appium test, run security scan, save results, show dashboard | End-to-end demo and logs |
| AI generation | Generate structured candidate tests and execute at least one after validation | Saved output, validation and execution record |
| Self-healing | Controlled locator change, candidate repair, confidence score and verification | Before/after evidence and audit record |
| Security | One mobile scanner plus one additional check; evidence-backed triage | Scanner reports and validation sample |
| CI/CD | Pipeline runs tests/security checks and publishes artifacts | Pipeline logs and report |
| Research | Compare against a baseline using predefined metrics | Experiment protocol, raw results and analysis |
| Deployment | Repeatable deployment and setup guide | Deployment or reproducible local guide |

---

## 6. Eight-Month Schedule

| Month | Main Work | Deliverable |
|-------|----------|-------------|
| 1 | Proposal, literature/prior-art review, architecture, repository, Spring Boot/React/MongoDB skeleton, Appium/scanner proof of concept | Proposal and architecture reviewed; components run independently |
| 2 | Connect app registration, Appium, one scanner, MongoDB, dashboard, basic LLM feature and CI | MVP demonstrated by Day 60 |
| 3 | UI hierarchy extraction, interaction graph, structured test generation and execution | UI-aware generated tests |
| 4 | Failure diagnosis, locator ranking, confidence-aware repair, verification and first prioritization | Self-healing prototype and preliminary experiment |
| 5 | Scanner orchestration, finding normalization, evidence, security regression and API/static/dependency checks | Unified security findings dashboard |
| 6 | Dockerized workers, CI/CD gates, optional Kubernetes parallelism, release-risk score and monitoring | Integrated beta |
| 7 | Baseline comparisons, controlled changes, vulnerability validation, analysis, paper draft and patent review | Results and invention disclosure |
| 8 | Bug fixes, repeatability, deployment, docs, paper submission and patent filing decision if appropriate | Final system, demo, paper status and IP status |

---

## 7. First 14 Days

| Day | Task | Owner | Definition of Done |
|-----|------|-------|-------------------|
| 1 | Kickoff, scope, roles, mentor expectations | All | Written scope and owners |
| 2 | Read papers on LLM testing, self-healing and mobile security | 1,2,3 | Shared literature tracker |
| 3 | Freeze Day-60 MVP and choose test APK/device | All | MVP checklist |
| 4 | Architecture, ER model and API boundaries | 1,4,6 | Reviewed diagrams |
| 5 | GitHub repository, issues, branch/PR rules and README | 4,5 | Repository and board ready |
| 6 | Install Android SDK/Appium and run one test | 2 | Test passes with logs |
| 7 | First demo and blocker review | All | Demo and issue list |
| 8 | Spring Boot API and MongoDB connection | 4 | Read/write works |
| 9 | React dashboard skeleton | 6 | Projects and runs pages render |
| 10 | MobSF scan of authorized APK | 3 | Scan output saved |
| 11 | Persist test and scan results | 4 | Records queryable |
| 12 | Connect UI to APIs | 4,6 | Real results displayed |
| 13 | Docker Compose and basic CI | 5 | Repeatable startup and green CI |
| 14 | Integrated demonstration | All | Appium + scan + database + UI |

---

## 8. Six-Member Allocation

| Member | Ownership | Month-2 Deliverable | Final Deliverable |
|--------|----------|--------------------|--------------------|
| 1 — AI/LLM | Test generation, diagnosis, prioritization, repair confidence and evaluation | Structured test or failure summary | AI modules and evaluation |
| 2 — Mobile | Android app, Appium, UI hierarchy, locator repair and verification | One repeatable Appium test | Mobile execution/self-healing |
| 3 — Security | MobSF, Semgrep/ZAP/Trivy adapters, finding evidence and validation | One mobile scan and normalized findings | Security orchestration and evaluation |
| 4 — Backend | Spring Boot, auth, MongoDB, APIs and orchestration | Persist/retrieve test and scan results | Stable control plane |
| 5 — DevOps | Docker, CI/CD, secrets, deployment, Kubernetes and monitoring | Docker setup and CI build | Deployment and worker orchestration |
| 6 — Frontend/research | React dashboard, reports, experiment tracking, charts and documentation coordination | Dashboard shows real results | Analytics, reproducibility and demo |

---

## 9. Team Workflow

- Use two-week sprints and weekly demos; short daily stand-ups when schedules permit.
- Every issue has one owner, acceptance criteria, due date and test evidence.
- Use feature branches, pull requests, one review and automated checks before merging.
- Keep a research log with paper, question, baseline, parameters, results and limitations.
- Hold weekly integration sessions and freeze API contracts early.
- Keep a known-good demo tag and recorded backup.
- Never commit API keys, tokens or sensitive APK/log data.
- Coordinate research protocol and IP disclosure with mentor/institution.

---

## 10. Research-Paper Plan

**Working title:** An LLM-Driven Framework for Autonomous Mobile Application Testing, Confidence-Aware Self-Healing, and Security-Aware Release Assessment.

| Experiment | Baseline | Metrics |
|-----------|----------|---------|
| Test generation | Manual or template tests | Validity, coverage, generation time, execution success |
| Self-healing | Static locator/manual repair | Repair success, false-repair rate, repair time, human intervention |
| Regression selection | Full suite or conventional selection | Execution time, detected faults, coverage retained |
| Security triage | Raw scanner findings/manual triage | Precision, recall on controlled known findings, false positives, triage time |
| Deployment | Sequential execution | Completion time, worker utilization and cost |

- Predefine metrics before tuning the method.
- Use controlled UI changes and intentionally vulnerable test apps; manually validate a sample of findings.
- Report negative results, limitations and model/prompt versions.
- Draft from Month 5; complete experiments by Month 7 and submit in Month 8 if ready. Acceptance is not guaranteed.

---

## 11. Patent/IP Plan

- **Months 1–2:** Search Google Patents, papers and products; record closest prior art.
- **Months 3–4:** Define exact technical mechanism beyond ordinary LLM integration.
- **Months 5–6:** Maintain invention notes, diagrams, evidence and contribution records.
- **Month 7:** Review novelty/inventive step with mentor and LPU IP support or a registered patent professional.
- **Month 8:** Decide whether to file; coordinate before public disclosure.
- Track filed, published, examined and granted separately; grant cannot be guaranteed.

---

## 12. Risk Register

| Risk | Mitigation |
|------|-----------|
| MVP late | Limit to one Android app, one test, one scanner and simple dashboard |
| Unsafe/invalid LLM output | Schema validation, sandboxing, action allowlists and human approval |
| False repair | Confidence routing, evidence, re-execution, regression check and audit trail |
| Scanner noise | Normalize/deduplicate findings and validate sample manually |
| Kubernetes/emulator resource load | Start locally; add parallel workers after single-run workflow is stable |
| Cloud/API cost | Set limits, use student credits, local development and auto-shutdown |
| No patentable novelty | Prior-art search early; do not assume patentability |
| Paper delayed | Begin experiments early and document submission status accurately |
| Integration issues | API contracts, weekly demos, small PRs and stable demo tag |

---

## 13. Final Completion Checklist

- [ ] Working deployed or repeatably deployable app and setup guide
- [ ] Demo: register app → test → scan → diagnosis/repair proposal → verification → release assessment
- [ ] Security controls and evidence-backed findings with limitations documented
- [ ] Tests, sample data, CI workflow and reproducible experiment scripts
- [ ] Paper submitted or ready with actual results
- [ ] Patent prior-art review and filing decision documented
- [ ] Architecture, ERD, API docs, user guide, test plan and viva slides
