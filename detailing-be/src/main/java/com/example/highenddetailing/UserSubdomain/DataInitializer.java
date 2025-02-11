//package com.example.highenddetailing.UserSubdomain;
//
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.stereotype.Component;
//
//@Component
//public class DataInitializer implements CommandLineRunner {
//
//    private final UserRepository userRepository;
//
//    public DataInitializer(UserRepository userRepository) {
//        this.userRepository = userRepository;
//    }
//
//    @Override
//    public void run(String... args) throws Exception {
//        // Check if a user with id=1 exists
//        if (!userRepository.findById(1L).isPresent()) {
//            // Insert the user
//            User user = new User();
//            user.setName("Zachary Lelièvre");
//            user.setTitle("Software Developer");
//            user.setBio("Passionate full-stack developer with expertise in modern web technologies. I love creating efficient, scalable solutions with beautiful user interfaces.");
//            user.setSkills("Java, Spring Boot, React, TypeScript, Docker, MySQL");
//            userRepository.save(user);
//            System.out.println("Inserted default user with id=1");
//        }
//    }
//}