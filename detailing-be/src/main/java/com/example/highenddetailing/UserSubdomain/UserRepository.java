package com.example.highenddetailing.UserSubdomain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

// UserRepository.java
public interface UserRepository extends JpaRepository<User, Long> {
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.projects WHERE u.id = :id")
    Optional<User> findByIdWithProjects(@Param("id") Long id);

    @Query("SELECT u FROM User u LEFT JOIN FETCH u.experiences WHERE u.id = :id")
    Optional<User> findByIdWithExperiences(@Param("id") Long id);
}
