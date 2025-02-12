package com.example.highenddetailing.UserSubdomain;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3000", "https://zachary-lelievre.com"})
public class UserController {
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final ExperienceRepository experienceRepository;

    public UserController(UserRepository userRepository,
                          ProjectRepository projectRepository,
                          ExperienceRepository experienceRepository) {
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
        this.experienceRepository = experienceRepository;
    }

    // Fetch user + projects + experiences
    @GetMapping("/user/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        Optional<User> userWithProjects = userRepository.findByIdWithProjects(id);
        Optional<User> userWithExperiences = userRepository.findByIdWithExperiences(id);

        if (userWithProjects.isPresent() && userWithExperiences.isPresent()) {
            User user = userWithProjects.get();
            user.setExperiences(userWithExperiences.get().getExperiences());
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }

    // Update basic user details
    @PutMapping("/user/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        return userRepository.findById(id)
                .map(existingUser -> {
                    existingUser.setName(updatedUser.getName());
                    existingUser.setTitle(updatedUser.getTitle());
                    existingUser.setBio(updatedUser.getBio());
                    existingUser.setSkills(updatedUser.getSkills());
                    userRepository.save(existingUser);
                    return ResponseEntity.ok(existingUser);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}