package com.example.highenddetailing.UserSubdomain;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "comments")
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String authorName;
    private String content;

    @Enumerated(EnumType.STRING)
    private CommentStatus status;

    private LocalDateTime createdAt;

    // Constructors
    public Comment() {
        this.status = CommentStatus.PENDING;
        this.createdAt = LocalDateTime.now();
    }

    // Getters/Setters
    public Long getId() { return id; }
    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public CommentStatus getStatus() { return status; }
    public void setStatus(CommentStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}