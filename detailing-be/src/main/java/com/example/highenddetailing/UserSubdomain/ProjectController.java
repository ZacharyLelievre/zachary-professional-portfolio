package com.example.highenddetailing.UserSubdomain;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class ProjectController {
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public ProjectController(ProjectRepository projectRepository,
                             UserRepository userRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    // Create a new Project for a given user
    @PostMapping("/user/{userId}/projects")
    public ResponseEntity<Project> createProject(@PathVariable Long userId,
                                                 @RequestBody Project project) {
        return userRepository.findById(userId)
                .map(user -> {
                    project.setUser(user);
                    Project savedProject = projectRepository.save(project);
                    return ResponseEntity.status(HttpStatus.CREATED).body(savedProject);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Update an existing Project
    @PutMapping("/projects/{projectId}")
    public ResponseEntity<Project> updateProject(@PathVariable Long projectId,
                                                 @RequestBody Project updatedProject) {
        return projectRepository.findById(projectId)
                .map(existingProject -> {
                    existingProject.setTitle(updatedProject.getTitle());
                    existingProject.setDescription(updatedProject.getDescription());
                    existingProject.setTechnologies(updatedProject.getTechnologies());
                    // Make sure user is not overwritten if you want to keep the same user
                    projectRepository.save(existingProject);
                    return ResponseEntity.ok(existingProject);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    @DeleteMapping("/projects/{projectId}")
    public ResponseEntity<?> deleteProject(@PathVariable Long projectId) {
        return projectRepository.findById(projectId)
                .map(project -> {
                    projectRepository.delete(project);
                    return ResponseEntity.noContent().build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
