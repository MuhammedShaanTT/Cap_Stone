# Aura Quality Cloud &mdash; Modular Frontend

This directory contains the modular, component-based enterprise SaaS frontend inspired by **Sauce Labs** (`https://saucelabs.com/`).

---

## 📁 Modular Directory Structure

```
frontend/
├── index.html                   # HTML entry point with fonts & metadata
├── package.json                 # Dependencies (React 19, Lucide, Vite)
├── vite.config.js               # Dev server configuration with proxy to port 8080
├── README.md                    # This documentation file
│
└── src/
    ├── main.jsx                 # React root renderer
    ├── App.jsx                  # Main application orchestrator
    │
    ├── styles/                  # Global CSS and Design Tokens
    │   ├── tokens.css           # Sauce Labs brand colors, dark slate theme, shadows, fonts
    │   └── base.css             # Typography hierarchy, button suite, pills, resets
    │
    ├── services/                # Backend API Integration Layer
    │   ├── api.js               # Centralized fetch client with JWT token injection
    │   ├── authService.js       # Authentication, quick demo sign-in, token management
    │   ├── projectService.js    # Projects, app versions, dashboard statistics
    │   └── qualityService.js    # Automated defect scanner & APK binary uploader
    │
    └── components/              # Modular UI Components
        ├── Navbar/              # Sticky header, mega-menus, mobile navigation drawer
        │   ├── Navbar.jsx
        │   └── Navbar.css
        │
        ├── Hero/                # Hero section with interactive preview switcher
        │   ├── Hero.jsx
        │   └── Hero.css
        │
        ├── Trust/               # Customer logos, trust badges, performance metrics
        │   ├── TrustBar.jsx
        │   └── TrustBar.css
        │
        ├── Features/            # Alternating feature cards (AI Healing, AppSec SAST)
        │   ├── FeaturesSection.jsx
        │   └── Features.css
        │
        ├── Architecture/        # 5-stage interactive quality pipeline diagram
        │   ├── ArchitectureSection.jsx
        │   └── Architecture.css
        │
        ├── Integrations/        # Testing frameworks, CI/CD, issue trackers
        │   ├── IntegrationsSection.jsx
        │   └── Integrations.css
        │
        ├── Benefits/            # Quantified enterprise DevOps ROI cards
        │   ├── BenefitsSection.jsx
        │   └── Benefits.css
        │
        ├── Stories/             # Customer case studies (FinTech, Retail, Health)
        │   ├── StoriesSection.jsx
        │   └── Stories.css
        │
        ├── CTA/                 # Conversion banner with glowing Sauce Red accent
        │   ├── CtaBanner.jsx
        │   └── CTA.css
        │
        ├── Footer/              # Multi-column sitemap, legal, system status
        │   ├── Footer.jsx
        │   └── Footer.css
        │
        └── Console/             # Live Interactive Control Plane (Connected to Backend)
            ├── ControlPlaneModal.jsx  # Modal wrapper & state coordination
            ├── AuthBox.jsx            # 1-Click demo authentication
            ├── DefectScanner.jsx      # Automated SAST CWE scan & AI self-healing
            ├── ApkUploader.jsx        # Binary APK artifact upload
            └── Console.css            # Dark command-center theme styling
```

---

## 🚀 Running in Development Mode

To run the frontend with instant Hot Module Replacement (HMR):

```bash
cd frontend
npm.cmd run dev
```

The Vite dev server will start on **`http://localhost:3000`** with automatic API proxies for `/api/*` and `/actuator/*` pointing to `http://localhost:8080`.

---

## 📦 Building for Production

To compile and package the frontend into production distribution assets:

```bash
# Build standalone bundle into frontend/dist/
npm.cmd run build

# Or compile and sync directly into backend static classpath:
npm.cmd run sync-backend
```
