package com.example.highenddetailing.UserSubdomain;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class ExperienceController {
    private final ExperienceRepository experienceRepository;
    private final UserRepository userRepository;

    public ExperienceController(ExperienceRepository experienceRepository,
                                UserRepository userRepository) {
        this.experienceRepository = experienceRepository;
        this.userRepository = userRepository;
    }

    // Create a new Experience
    @PostMapping("/user/{userId}/experiences")
    public ResponseEntity<Experience> createExperience(@PathVariable Long userId,
                                                       @RequestBody Experience experience) {
        return userRepository.findById(userId)
                .map(user -> {
                    experience.setUser(user);
                    Experience saved = experienceRepository.save(experience);
                    return ResponseEntity.status(HttpStatus.CREATED).body(saved);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Update an existing Experience
    @PutMapping("/experiences/{expId}")
    public ResponseEntity<Experience> updateExperience(@PathVariable Long expId,
                                                       @RequestBody Experience updated) {
        return experienceRepository.findById(expId)
                .map(existing -> {
                    existing.setCompany(updated.getCompany());
                    existing.setRole(updated.getRole());
                    existing.setDuration(updated.getDuration());
                    existing.setDescription(updated.getDescription());
                    experienceRepository.save(existing);
                    return ResponseEntity.ok(existing);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    @DeleteMapping("/experiences/{expId}")
    public ResponseEntity<?> deleteExperience(@PathVariable Long expId) {
        return experienceRepository.findById(expId)
                .map(exp -> {
                    experienceRepository.delete(exp);
                    return ResponseEntity.noContent().build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
