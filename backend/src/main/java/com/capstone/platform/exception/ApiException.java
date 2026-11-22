package com.capstone.platform.exception;

import org.springframework.http.HttpStatus;

/**
 * Generic API exception with HTTP status code.
 */
public class ApiException extends RuntimeException {

    private final HttpStatus status;

    public ApiException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
