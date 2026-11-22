# Test Data & Artifacts for Prototype Testing

This directory contains test assets to verify the working of the **Mobile AI Quality Platform (MAQP)**:

| File | Purpose | Description |
|------|---------|-------------|
| `sample-app-v1.0.0.apk` | Dummy Android APK (v1.0.0) | Dummy application package used to test APK upload, SHA-256 calculation, and artifact storage. |
| `sample-app-v2.0.0.apk` | Dummy Android APK (v2.0.0) | Updated version for testing multi-version regression diffs and upgrade verification. |
| `sample-test-cases.json` | Sample Test Suite | 5 structured test cases (Login, Addition, Division by zero, Navigation, Rotation) with actions and expectations. |
| `sample-security-report.json` | Security Scan Results | Sample MobSF scan findings (CWE-319 cleartext traffic, CWE-489 debuggable, CWE-798 hardcoded secret). |
