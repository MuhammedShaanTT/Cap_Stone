package com.capstone.platform.exception;

import org.springframework.http.HttpStatus;

/**
 * Thrown when a duplicate resource creation is attempted.
 */
public class DuplicateResourceException extends ApiException {

    public DuplicateResourceException(String message) {
        super(message, HttpStatus.CONFLICT);
    }
}
