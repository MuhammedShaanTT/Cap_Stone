package com.capstone.platform.exception;

import org.springframework.http.HttpStatus;

/**
 * Thrown when user is not authorized to access a resource.
 */
public class AccessDeniedException extends ApiException {

    public AccessDeniedException(String message) {
        super(message, HttpStatus.FORBIDDEN);
    }
}
