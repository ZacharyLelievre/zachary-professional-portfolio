package com.example.highenddetailing.UserSubdomain;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ExperienceRepository extends JpaRepository<Experience, Long> {
    List<Experience> findByUser_Id(Long userId);
}