package com.capstone.platform;

import de.bwaldvogel.mongo.MongoServer;
import de.bwaldvogel.mongo.backend.memory.MemoryBackend;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.net.Socket;

@SpringBootApplication
public class PlatformApplication {

    private static MongoServer inMemoryMongoServer;

    public static void main(String[] args) {
        // Automatically start a pure-Java in-memory MongoDB server if no external MongoDB is running
        if (!isMongoRunning("127.0.0.1", 27017)) {
            try {
                inMemoryMongoServer = new MongoServer(new MemoryBackend());
                inMemoryMongoServer.bind("localhost", 27017);
                System.out.println("=================================================================");
                System.out.println(">>> [MAQP] Started Pure-Java In-Memory MongoDB on localhost:27017");
                System.out.println("=================================================================");
            } catch (Exception e) {
                System.err.println(">>> [MAQP] In-Memory MongoDB startup note: " + e.getMessage());
            }
        } else {
            System.out.println(">>> [MAQP] Detected external MongoDB server running on localhost:27017");
        }

        SpringApplication.run(PlatformApplication.class, args);
    }

    private static boolean isMongoRunning(String host, int port) {
        try (Socket socket = new Socket(host, port)) {
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
