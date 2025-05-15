package com.example.highenddetailing.UserSubdomain;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private final JavaMailSender mail;
    @Value("${app.mail.to}") private String to;

    public EmailService(JavaMailSender mail) { this.mail = mail; }

    public void send(String from, String subject, String body) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(to);
        msg.setReplyTo(from);
        msg.setSubject(subject);
        msg.setText(body + "\n\n--\nSent by: " + from);
        mail.send(msg);
    }
}