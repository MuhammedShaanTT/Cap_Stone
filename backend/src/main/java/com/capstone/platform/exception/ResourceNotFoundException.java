package com.capstone.platform.exception;

import org.springframework.http.HttpStatus;

/**
 * Thrown when a requested resource is not found.
 */
public class ResourceNotFoundException extends ApiException {

    public ResourceNotFoundException(String resource, String id) {
        super(resource + " not found with id: " + id, HttpStatus.NOT_FOUND);
    }
}
