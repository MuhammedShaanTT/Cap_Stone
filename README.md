# Mobile AI Quality Platform (MAQP)
### AI-Driven Autonomous Mobile Application Testing, Vulnerability Assessment, and Self-Healing CI/CD Platform

---

## 🚀 Quick Start Guide (Exact Steps to Run)

### Zero-Friction Setup
The platform is equipped with an **autonomous in-memory MongoDB engine**. If no local or Docker MongoDB instance is running on port `27017`, the platform will **automatically initialize an embedded in-memory MongoDB instance on port 27017**. No installation or external services required!

### Prerequisites
1. **Java 17+** (Installed: Temurin 17.0.17)
2. **Maven 3.9+** (Installed: Apache Maven)
3. *(Optional)* Docker Desktop or external MongoDB if you want persistent disk database storage.

---

### Step 1: Start the Platform
You can start the platform with a single command:

#### Option A: One-Click Startup Script (Recommended)
In PowerShell or Command Prompt:
```powershell
# PowerShell:
.\start.ps1

# Or in Windows CMD:
start.bat
```

#### Option B: Run Executable Fat JAR Directly
The fat JAR with the complete Sauce Labs-inspired UI is pre-compiled:
```powershell
java -jar backend/target/platform-0.1.0-SNAPSHOT.jar
```

#### Option C: Run via Maven
```powershell
cd backend
mvn spring-boot:run
```

Once running, the application pre-seeds:
- **Admin Account**: `admin@example.com` / `password123`
- **Developer Account**: `developer@example.com` / `password123`
- **Pre-loaded Demo Project**: "Calculator Android App"
- **App Versions**: v1.0.0 and v2.0.0
- **Pre-configured Test Cases & Execution History**

---

### Step 2: Open the Website in Your Browser

1. **Aura Quality Cloud Enterprise Website (Sauce Labs Inspired)**:
   👉 **[http://localhost:8080](http://localhost:8080)**
   - **Enterprise SaaS Aesthetic**: Inspired by **Sauce Labs** (`https://saucelabs.com/`) featuring deep slate charcoal (`#0f172a`), vibrant red accents (`#eb144c`), clean typography, mega-menus, customer credibility stats, alternating feature showcases, 5-stage architecture pipeline, and developer integrations.
   - **Interactive Live Control Plane**: Click **"⚡ Launch Live Platform"** or **"🔍 Run Automated Defect Scan"** in the top navigation or hero section to open the live console connected directly to the running backend.
   - **1-Click Authentication**: Instant sign-in as Demo Admin or Demo Developer.
   - **Automated Defect & Vulnerability Scanner**: 1-click trigger to inspect 5 mobile vulnerabilities (CWE-798, CWE-319, CWE-489, CWE-328, CWE-926) and generate AI self-healing locator patch diffs.
   - **Direct APK Upload**: Visual drag-and-drop or file selector to upload mobile APK binaries.

2. **Interactive Swagger / OpenAPI 3.0 UI**:
   👉 **[http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)**
   - Test all 16+ REST endpoints with interactive JWT authorization.

3. **Actuator Health Endpoint**:
   👉 **[http://localhost:8080/actuator/health](http://localhost:8080/actuator/health)**
   - Returns `{"status":"UP"}` confirming all components are healthy.

---

## 🎨 Modular Frontend (`frontend/`)

The frontend is organized into its own dedicated [`frontend`](file:///c:/Users/shaha/capstone/frontend) directory, broken down **module-by-module** with a component-based React architecture:

- **`frontend/src/components/Navbar/`**: Sticky enterprise header, mega-menus, mobile navigation drawer.
- **`frontend/src/components/Hero/`**: Hero section with live preview tab switcher and telemetry mockups.
- **`frontend/src/components/Trust/`**: Customer trust bar, performance metrics, compliance badges.
- **`frontend/src/components/Features/`**: Alternating feature rows with unified patch diffs and CWE cards.
- **`frontend/src/components/Architecture/`**: 5-phase connected pipeline diagram.
- **`frontend/src/components/Integrations/`**: Testing frameworks, CI/CD, issue trackers, observability tools.
- **`frontend/src/components/Benefits/`**: Quantified enterprise outcomes and ROI cards.
- **`frontend/src/components/Stories/`**: Detailed enterprise customer case studies.
- **`frontend/src/components/CTA/`**: High-conversion dark banner with Sauce Red radial glow.
- **`frontend/src/components/Footer/`**: Comprehensive multi-column SaaS sitemap.
- **`frontend/src/components/Console/`**: Interactive Live Control Plane modal with 1-click auth, automated defect scan, and APK upload.
- **`frontend/src/services/`**: Modular API client (`api.js`), auth (`authService.js`), projects (`projectService.js`), and defect analysis (`qualityService.js`).
- **`frontend/src/styles/`**: Sauce Labs design tokens (`tokens.css`) and global base styles (`base.css`).

### Running the Frontend in Dev Mode (Hot Reloading)
```powershell
cd frontend
npm.cmd run dev
```
Starts Vite on **`http://localhost:3000`** with automatic API reverse-proxy to `http://localhost:8080`.

### Syncing Builds to Spring Boot
```powershell
cd frontend
npm.cmd run sync-backend
```

---

## 🧪 Testing the Program with Dummy Files

We have created ready-to-use dummy files in the [`test-data`](file:///c:/Users/shaha/capstone/test-data) directory:

| Dummy File | Purpose | What It Tests |
|---|---|---|
| `test-data/defect-test-app.apk` | Target Mobile App Binary | APK binary upload, SHA-256 integrity calculation, SAST security vulnerability scan |
| `test-data/defect-test-log.txt` | Appium & Crash Execution Log | AI root cause analysis, stack trace parsing, failure classification |
| `test-data/sample-app-v1.0.0.apk` | Baseline App Version | Version registration and artifact linking |
| `test-data/sample-app-v2.0.0.apk` | Upgraded App Version | Locator change detection and AI self-healing proposal |
| `test-data/sample-test-cases.json` | 5 Mobile Test Cases | Structured test authoring (preconditions, steps, expected results) |
| `test-data/sample-security-report.json` | MobSF Static Audit | CWE vulnerability categorization and risk scoring |

### Automated Test Execution
Run the automated prototype verification script:

```powershell
# In PowerShell:
.\test-api.ps1

# Or in Command Prompt:
test-api.bat
```

This runs 11 automated verification checks and asserts that every subsystem is operating at 100% capacity.

### VS Code REST Client / IntelliJ HTTP Client
You can also use [`test-api.http`](file:///c:/Users/shaha/capstone/test-api.http) to click-and-run individual API requests directly in your IDE.

---

## 📐 REST API Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/auth/register` | Register new user account |
| `POST` | `/api/v1/auth/login` | Authenticate and get JWT Bearer token |
| `GET`  | `/api/v1/projects` | List projects accessible to current user |
| `POST` | `/api/v1/projects` | Create a new project |
| `GET`  | `/api/v1/projects/{id}` | Get project details |
| `GET`  | `/api/v1/projects/{id}/app-versions` | List app versions for a project |
| `POST` | `/api/v1/projects/{id}/app-versions` | Register new Android app version |
| `POST` | `/api/v1/projects/{id}/app-versions/{vId}/upload` | **Upload APK binary file** |
| `GET`  | `/api/v1/projects/{id}/test-cases` | List all test cases for a project |
| `POST` | `/api/v1/projects/{id}/test-cases` | Create a structured test case |
| `GET`  | `/api/v1/test-cases/{id}` | Get test case by ID |
| `POST` | `/api/v1/test-cases/{id}/test-runs` | Queue a test execution run |
| `GET`  | `/api/v1/test-cases/{id}/test-runs` | List execution history for test case |
| `GET`  | `/api/v1/test-runs/{id}` | Get detailed test run status |
| `POST` | `/api/v1/projects/{id}/pipeline-runs` | Trigger CI/CD automated pipeline run |
| `GET`  | `/api/v1/projects/{id}/pipeline-runs` | List CI/CD pipeline runs |
| `POST` | `/api/v1/projects/{id}/security-scans` | Queue security vulnerability scan |
| `GET`  | `/api/v1/projects/{id}/security-scans` | List security scans |
| `POST` | `/api/v1/projects/{id}/run-quality-analysis` | **Automated Defect & Self-Healing Analysis** (Scans CWEs & generates locator fix) |
| `GET`  | `/api/v1/projects/{id}/dashboard` | Aggregated metrics & quality analytics |
| `GET`  | `/swagger-ui.html` | Swagger UI documentation |
| `GET`  | `/actuator/health` | Spring Boot Actuator Health Check |
