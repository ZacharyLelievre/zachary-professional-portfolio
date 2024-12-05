package com.example.highenddetailing;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.core.io.ClassPathResource;
import org.springframework.web.reactive.config.EnableWebFlux;


@SpringBootApplication
public class HighEndDetailingApplication {


	public static void main(String[] args) {
		SpringApplication.run(HighEndDetailingApplication.class, args);
	}

}
