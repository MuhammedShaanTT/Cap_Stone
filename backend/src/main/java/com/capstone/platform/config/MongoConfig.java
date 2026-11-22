package com.capstone.platform.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

/**
 * Enables MongoDB auditing for @CreatedDate / @LastModifiedDate annotations.
 */
@Configuration
@EnableMongoAuditing
public class MongoConfig {
}
