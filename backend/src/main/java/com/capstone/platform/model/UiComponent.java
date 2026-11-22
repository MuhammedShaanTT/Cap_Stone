package com.capstone.platform.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

/**
 * UI component extracted from Appium page source.
 * Represents a single interactive element on a screen.
 * Sensitive field values should be redacted before storage.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "ui_components")
public class UiComponent {

    @Id
    private String id;

    @Indexed
    private String appVersionId;

    private String screenKey;
    private String type;             // Button, EditText, TextView, etc.
    private String resourceId;
    private String contentDescription;
    private String text;             // Redacted if sensitive
    private Bounds bounds;
    private String fingerprint;      // Hash for change detection
    private Boolean clickable;
    private Boolean scrollable;
    private Boolean enabled;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Bounds {
        private int x;
        private int y;
        private int width;
        private int height;
    }
}
