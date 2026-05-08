package com.foodstagram.controller;

import com.foodstagram.model.Comment;
import com.foodstagram.model.Recipe;
import com.foodstagram.model.User;
import com.foodstagram.repository.CommentRepository;
import com.foodstagram.repository.RecipeRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/comments")
public class CommentController {
    private final CommentRepository commentRepository;
    private final RecipeRepository recipeRepository;

    public CommentController(CommentRepository commentRepository, RecipeRepository recipeRepository) {
        this.commentRepository = commentRepository;
        this.recipeRepository = recipeRepository;
    }

    @GetMapping("/{recipeId}")
    public ResponseEntity<?> getComments(@PathVariable Long recipeId) {
        Recipe recipe = recipeRepository.findById(recipeId).orElse(null);
        if (recipe == null) return ResponseEntity.notFound().build();
        List<Comment> comments = commentRepository.findByRecipeOrderByCreatedAtDesc(recipe);
        return ResponseEntity.ok(comments.stream().map(this::toMap).toList());
    }

    @PostMapping("/{recipeId}")
    public ResponseEntity<?> createComment(@PathVariable Long recipeId,
                                            @RequestBody Map<String, String> body,
                                            @AuthenticationPrincipal User user) {
        Recipe recipe = recipeRepository.findById(recipeId).orElse(null);
        if (recipe == null) return ResponseEntity.notFound().build();

        Comment comment = new Comment();
        comment.setContent(body.get("content"));
        comment.setAuthor(user);
        comment.setRecipe(recipe);
        commentRepository.save(comment);
        return ResponseEntity.status(201).body(toMap(comment));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteComment(@PathVariable Long id, @AuthenticationPrincipal User user) {
        Comment comment = commentRepository.findById(id).orElse(null);
        if (comment == null) return ResponseEntity.notFound().build();
        if (!comment.getAuthor().getId().equals(user.getId()))
            return ResponseEntity.status(403).body(Map.of("message", "Not authorized"));
        commentRepository.delete(comment);
        return ResponseEntity.ok(Map.of("message", "Comment deleted"));
    }

    private Map<String, Object> toMap(Comment c) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("_id", c.getId());
        map.put("id", c.getId());
        map.put("content", c.getContent());
        map.put("createdAt", c.getCreatedAt());
        map.put("author", Map.of("_id", c.getAuthor().getId(), "id", c.getAuthor().getId(), "name", c.getAuthor().getName()));
        return map;
    }
}
