package com.foodstagram.controller;

import com.foodstagram.model.User;
import com.foodstagram.repository.UserRepository;
import com.foodstagram.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String name = body.get("name");
        String email = body.get("email");
        String password = body.get("password");

        if (name == null || email == null || password == null)
            return ResponseEntity.badRequest().body(Map.of("message", "All fields are required"));
        if (password.length() < 6)
            return ResponseEntity.badRequest().body(Map.of("message", "Password must be at least 6 characters"));
        if (userRepository.existsByEmail(email))
            return ResponseEntity.badRequest().body(Map.of("message", "User already exists"));

        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getId());
        return ResponseEntity.status(201).body(Map.of(
            "token", token,
            "user", Map.of("id", user.getId(), "name", user.getName(), "email", user.getEmail())
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");

        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null || !passwordEncoder.matches(password, user.getPassword()))
            return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));

        String token = jwtUtil.generateToken(user.getId());
        return ResponseEntity.ok(Map.of(
            "token", token,
            "user", Map.of("id", user.getId(), "name", user.getName(), "email", user.getEmail())
        ));
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(Map.of("id", user.getId(), "name", user.getName(), "email", user.getEmail()));
    }
}
