package com.capstone.platform.controller;

import com.capstone.platform.dto.auth.AuthResponse;
import com.capstone.platform.dto.auth.LoginRequest;
import com.capstone.platform.dto.auth.RegisterRequest;
import com.capstone.platform.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

class AuthControllerTest {

    @Mock
    private AuthService authService;

    @InjectMocks
    private AuthController authController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void register_shouldReturnCreated() {
        RegisterRequest request = new RegisterRequest("test@example.com", "Test User", "password123");
        AuthResponse.UserInfo userInfo = new AuthResponse.UserInfo("user-1", "test@example.com", "Test User", "MEMBER");
        AuthResponse mockResponse = new AuthResponse("access-token-123", "refresh-token-456", userInfo);

        when(authService.register(any(RegisterRequest.class))).thenReturn(mockResponse);

        ResponseEntity<AuthResponse> response = authController.register(request);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("access-token-123", response.getBody().accessToken());
        assertEquals("test@example.com", response.getBody().user().email());
    }

    @Test
    void login_shouldReturnOk() {
        LoginRequest request = new LoginRequest("test@example.com", "password123");
        AuthResponse.UserInfo userInfo = new AuthResponse.UserInfo("user-1", "test@example.com", "Test User", "MEMBER");
        AuthResponse mockResponse = new AuthResponse("access-token-123", "refresh-token-456", userInfo);

        when(authService.login(any(LoginRequest.class))).thenReturn(mockResponse);

        ResponseEntity<AuthResponse> response = authController.login(request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("access-token-123", response.getBody().accessToken());
    }
}
