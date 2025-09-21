package com.javaprogramming.javaproject03;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {
	
	@GetMapping("/hello")
	public String getHello() {
		return "Hello, World!";
	}
	
    @PostMapping("/hello")
    public String postHello(@RequestBody String message) {
        return "You sent: " + message;
    }
}
