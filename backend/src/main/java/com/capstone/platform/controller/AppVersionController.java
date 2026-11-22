package com.capstone.platform.controller;

import com.capstone.platform.dto.appversion.AppVersionResponse;
import com.capstone.platform.dto.appversion.CreateAppVersionRequest;
import com.capstone.platform.service.AppVersionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * App version endpoints — register and list versions under a project.
 */
@RestController
@RequestMapping("/api/v1/projects/{projectId}/app-versions")
@Tag(name = "App Versions", description = "Android app version management")
@SecurityRequirement(name = "bearerAuth")
public class AppVersionController {

    private final AppVersionService appVersionService;

    public AppVersionController(AppVersionService appVersionService) {
        this.appVersionService = appVersionService;
    }

    @PostMapping
    @Operation(summary = "Register a new app version")
    public ResponseEntity<AppVersionResponse> createAppVersion(
            @PathVariable String projectId,
            @Valid @RequestBody CreateAppVersionRequest request) {
        AppVersionResponse response = appVersionService.createAppVersion(projectId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @Operation(summary = "List app versions for a project")
    public ResponseEntity<List<AppVersionResponse>> getAppVersions(@PathVariable String projectId) {
        return ResponseEntity.ok(appVersionService.getVersionsByProject(projectId));
    }

    @GetMapping("/{versionId}")
    @Operation(summary = "Get an app version by ID")
    public ResponseEntity<AppVersionResponse> getAppVersion(@PathVariable String versionId) {
        return ResponseEntity.ok(appVersionService.getVersion(versionId));
    }

    @PostMapping(value = "/{versionId}/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload an APK binary artifact for this app version")
    public ResponseEntity<AppVersionResponse> uploadApk(
            @PathVariable String projectId,
            @PathVariable String versionId,
            @RequestParam("file") MultipartFile file) {
        AppVersionResponse response = appVersionService.uploadApk(projectId, versionId, file);
        return ResponseEntity.ok(response);
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Directly upload an APK binary to a project (auto-creates or links to version)")
    public ResponseEntity<AppVersionResponse> uploadApkDirect(
            @PathVariable String projectId,
            @RequestParam(value = "version", required = false) String version,
            @RequestParam("file") MultipartFile file) {
        AppVersionResponse response = appVersionService.uploadApkDirect(projectId, version, file);
        return ResponseEntity.ok(response);
    }
}
