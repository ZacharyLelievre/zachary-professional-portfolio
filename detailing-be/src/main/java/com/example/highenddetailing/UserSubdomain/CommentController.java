package com.example.highenddetailing.UserSubdomain;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = {"http://localhost:3000", "https://zachary-lelievre.com"})
public class CommentController {

    private final CommentRepository commentRepository;

    public CommentController(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    // 1) Get all APPROVED comments
    @GetMapping
    public List<Comment> getApprovedComments() {
        return commentRepository.findByStatus(CommentStatus.APPROVED);
    }

    // 2) Get all PENDING comments (for admin)
    @GetMapping("/pending")
    public List<Comment> getPendingComments() {
        return commentRepository.findByStatus(CommentStatus.PENDING);
    }

    // 3) Create new comment (defaults to PENDING)
    @PostMapping
    public ResponseEntity<Comment> createComment(@RequestBody Comment comment) {
        // Ensure new comments start with PENDING status
        comment.setStatus(CommentStatus.PENDING);
        Comment saved = commentRepository.save(comment);
        return ResponseEntity.ok(saved);
    }

    // 4) Approve a comment
    @PutMapping("/{id}/approve")
    public ResponseEntity<Comment> approveComment(@PathVariable Long id) {
        return commentRepository.findById(id)
                .map(c -> {
                    c.setStatus(CommentStatus.APPROVED);
                    return ResponseEntity.ok(commentRepository.save(c));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // 5) Delete a comment
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id) {
        if (commentRepository.existsById(id)) {
            commentRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
    // ...
// 6) Get all comments, regardless of status
    @GetMapping("/all")
    public List<Comment> getAllComments() {
        return commentRepository.findAll();
    }
}