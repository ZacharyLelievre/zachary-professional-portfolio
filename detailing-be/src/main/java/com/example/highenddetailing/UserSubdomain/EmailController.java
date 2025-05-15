package com.example.highenddetailing.UserSubdomain;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin // adjust if needed
public class EmailController {
    private final EmailService svc;

    public EmailController(EmailService svc) { this.svc = svc; }

    @PostMapping("/send-email")
    public ResponseEntity<Void> send(@RequestBody MailDTO dto) {
        svc.send(dto.fromEmail(), dto.subject(), dto.body());
        return ResponseEntity.ok().build();
    }
}

record MailDTO(String name, String fromEmail, String subject, String body) {}