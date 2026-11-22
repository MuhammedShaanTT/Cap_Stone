package com.capstone.platform.service;

import com.capstone.platform.dto.appversion.AppVersionResponse;
import com.capstone.platform.dto.appversion.CreateAppVersionRequest;
import com.capstone.platform.exception.ApiException;
import com.capstone.platform.exception.DuplicateResourceException;
import com.capstone.platform.exception.ResourceNotFoundException;
import com.capstone.platform.model.AppVersion;
import com.capstone.platform.model.Artifact;
import com.capstone.platform.repository.AppVersionRepository;
import com.capstone.platform.repository.ArtifactRepository;
import com.capstone.platform.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.security.DigestInputStream;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.HexFormat;
import java.util.List;

/**
 * AppVersion service — register and list app versions under a project, and upload APK artifacts.
 */
@Service
public class AppVersionService {

    private final AppVersionRepository appVersionRepository;
    private final ProjectRepository projectRepository;
    private final ArtifactRepository artifactRepository;
    private final String artifactBasePath;

    public AppVersionService(AppVersionRepository appVersionRepository,
                             ProjectRepository projectRepository,
                             ArtifactRepository artifactRepository,
                             @Value("${app.artifacts.base-path:./data/artifacts}") String artifactBasePath) {
        this.appVersionRepository = appVersionRepository;
        this.projectRepository = projectRepository;
        this.artifactRepository = artifactRepository;
        this.artifactBasePath = artifactBasePath;
    }

    public AppVersionResponse createAppVersion(String projectId, CreateAppVersionRequest request) {
        // Verify project exists
        if (!projectRepository.existsById(projectId)) {
            throw new ResourceNotFoundException("Project", projectId);
        }

        // Check for duplicate version
        if (appVersionRepository.existsByProjectIdAndVersion(projectId, request.version())) {
            throw new DuplicateResourceException(
                    "Version " + request.version() + " already exists for this project");
        }

        AppVersion appVersion = AppVersion.builder()
                .projectId(projectId)
                .version(request.version())
                .platform(request.platform() != null ? request.platform() : "ANDROID")
                .packageName(request.packageName())
                .versionCode(request.versionCode())
                .build();

        appVersion = appVersionRepository.save(appVersion);
        return toResponse(appVersion);
    }

    public List<AppVersionResponse> getVersionsByProject(String projectId) {
        return appVersionRepository.findByProjectId(projectId).stream()
                .map(this::toResponse)
                .toList();
    }

    public AppVersionResponse getVersion(String versionId) {
        AppVersion appVersion = appVersionRepository.findById(versionId)
                .orElseThrow(() -> new ResourceNotFoundException("AppVersion", versionId));
        return toResponse(appVersion);
    }

    public AppVersionResponse uploadApk(String projectId, String versionId, MultipartFile file) {
        if (!projectRepository.existsById(projectId)) {
            throw new ResourceNotFoundException("Project", projectId);
        }

        AppVersion appVersion = appVersionRepository.findById(versionId)
                .orElseThrow(() -> new ResourceNotFoundException("AppVersion", versionId));

        if (file.isEmpty()) {
            throw new ApiException("Uploaded file cannot be empty", HttpStatus.BAD_REQUEST);
        }

        try {
            Path targetDir = Paths.get(artifactBasePath, projectId, versionId);
            Files.createDirectories(targetDir);

            String originalFilename = file.getOriginalFilename() != null ? file.getOriginalFilename() : "app.apk";
            Path targetFilePath = targetDir.resolve(originalFilename);

            MessageDigest md = MessageDigest.getInstance("SHA-256");
            try (InputStream is = file.getInputStream();
                 DigestInputStream dis = new DigestInputStream(is, md)) {
                Files.copy(dis, targetFilePath, StandardCopyOption.REPLACE_EXISTING);
            }

            String checksum = HexFormat.of().formatHex(md.digest());
            long fileSize = Files.size(targetFilePath);

            // Create and persist Artifact metadata record
            Artifact artifact = Artifact.builder()
                    .projectId(projectId)
                    .type("APK")
                    .storageUri(targetFilePath.toAbsolutePath().toString())
                    .checksum(checksum)
                    .sizeBytes(fileSize)
                    .createdAt(Instant.now())
                    .build();
            artifact = artifactRepository.save(artifact);

            // Update AppVersion
            appVersion.setArtifactRef(artifact.getId());
            appVersion.setChecksum(checksum);
            appVersion.setFileSizeBytes(fileSize);
            appVersion = appVersionRepository.save(appVersion);

            return toResponse(appVersion);
        } catch (NoSuchAlgorithmException | IOException e) {
            throw new ApiException("Failed to store APK artifact: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public AppVersionResponse uploadApkDirect(String projectId, String version, MultipartFile file) {
        if (!projectRepository.existsById(projectId)) {
            throw new ResourceNotFoundException("Project", projectId);
        }

        String targetVersion = version;
        if (targetVersion == null || targetVersion.isBlank()) {
            String orig = file.getOriginalFilename() != null ? file.getOriginalFilename() : "app.apk";
            String base = orig.replaceAll("(?i)\\.apk$", "");
            var existing = appVersionRepository.findByProjectId(projectId);
            targetVersion = base + "-v" + (existing.size() + 1);
        }

        final String finalVer = targetVersion;
        AppVersion appVersion = appVersionRepository.findByProjectId(projectId).stream()
                .filter(v -> finalVer.equalsIgnoreCase(v.getVersion()))
                .findFirst()
                .orElseGet(() -> appVersionRepository.save(AppVersion.builder()
                        .projectId(projectId)
                        .version(finalVer)
                        .platform("ANDROID")
                        .packageName("com.example.calculator")
                        .versionCode("1")
                        .build()));

        return uploadApk(projectId, appVersion.getId(), file);
    }

    private AppVersionResponse toResponse(AppVersion av) {
        return new AppVersionResponse(
                av.getId(),
                av.getProjectId(),
                av.getVersion(),
                av.getPlatform(),
                av.getArtifactRef(),
                av.getChecksum(),
                av.getFileSizeBytes(),
                av.getPackageName(),
                av.getVersionCode(),
                av.getCreatedAt()
        );
    }
}
