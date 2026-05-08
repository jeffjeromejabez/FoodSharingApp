package com.foodstagram.controller;

import com.foodstagram.model.Recipe;
import com.foodstagram.model.User;
import com.foodstagram.repository.RecipeRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@RestController
@RequestMapping("/api/recipes")
public class RecipeController {
    private final RecipeRepository recipeRepository;
    private final ObjectMapper objectMapper;

    @Value("${upload.dir}")
    private String uploadDir;

    public RecipeController(RecipeRepository recipeRepository, ObjectMapper objectMapper) {
        this.recipeRepository = recipeRepository;
        this.objectMapper = objectMapper;
    }

    @GetMapping
    public ResponseEntity<?> getRecipes(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String sort) {
        List<Recipe> recipes;
        if ("rating".equals(sort)) {
            recipes = recipeRepository.searchRecipesByRating(search, category);
        } else {
            recipes = recipeRepository.searchRecipes(search, category);
        }
        return ResponseEntity.ok(recipes.stream().map(this::toMap).toList());
    }

    @GetMapping("/my-recipes")
    public ResponseEntity<?> getMyRecipes(@AuthenticationPrincipal User user) {
        List<Recipe> recipes = recipeRepository.findByAuthorOrderByCreatedAtDesc(user);
        return ResponseEntity.ok(recipes.stream().map(this::toMap).toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRecipe(@PathVariable Long id) {
        return recipeRepository.findById(id)
                .map(r -> ResponseEntity.ok(toMap(r)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createRecipe(
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam String ingredients,
            @RequestParam String steps,
            @RequestParam String category,
            @RequestParam Integer cookingTime,
            @RequestParam(required = false) MultipartFile image,
            @AuthenticationPrincipal User user) {
        try {
            Recipe recipe = new Recipe();
            recipe.setTitle(title);
            recipe.setDescription(description);
            recipe.setIngredients(objectMapper.readValue(ingredients, List.class));
            recipe.setSteps(objectMapper.readValue(steps, List.class));
            recipe.setCategory(category);
            recipe.setCookingTime(cookingTime);
            recipe.setAuthor(user);
            recipe.setAverageRating(0.0);
            recipe.setTotalRatings(0);

            if (image != null && !image.isEmpty()) {
                recipe.setImage(saveImage(image));
            }

            recipeRepository.save(recipe);
            return ResponseEntity.status(201).body(toMap(recipe));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateRecipe(
            @PathVariable Long id,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) String ingredients,
            @RequestParam(required = false) String steps,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Integer cookingTime,
            @RequestParam(required = false) MultipartFile image,
            @AuthenticationPrincipal User user) {
        try {
            Recipe recipe = recipeRepository.findById(id).orElse(null);
            if (recipe == null) return ResponseEntity.notFound().build();
            if (!recipe.getAuthor().getId().equals(user.getId()))
                return ResponseEntity.status(403).body(Map.of("message", "Not authorized"));

            if (title != null) recipe.setTitle(title);
            if (description != null) recipe.setDescription(description);
            if (ingredients != null) recipe.setIngredients(objectMapper.readValue(ingredients, List.class));
            if (steps != null) recipe.setSteps(objectMapper.readValue(steps, List.class));
            if (category != null) recipe.setCategory(category);
            if (cookingTime != null) recipe.setCookingTime(cookingTime);
            if (image != null && !image.isEmpty()) recipe.setImage(saveImage(image));

            recipeRepository.save(recipe);
            return ResponseEntity.ok(toMap(recipe));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRecipe(@PathVariable Long id, @AuthenticationPrincipal User user) {
        Recipe recipe = recipeRepository.findById(id).orElse(null);
        if (recipe == null) return ResponseEntity.notFound().build();
        if (!recipe.getAuthor().getId().equals(user.getId()))
            return ResponseEntity.status(403).body(Map.of("message", "Not authorized"));
        recipeRepository.delete(recipe);
        return ResponseEntity.ok(Map.of("message", "Recipe deleted"));
    }

    private String saveImage(MultipartFile file) throws Exception {
        File dir = new File(uploadDir);
        if (!dir.exists()) dir.mkdirs();
        String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path path = Paths.get(uploadDir + filename);
        Files.write(path, file.getBytes());
        return filename;
    }

    private Map<String, Object> toMap(Recipe r) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("_id", r.getId());
        map.put("id", r.getId());
        map.put("title", r.getTitle());
        map.put("description", r.getDescription());
        map.put("ingredients", r.getIngredients());
        map.put("steps", r.getSteps());
        map.put("category", r.getCategory());
        map.put("cookingTime", r.getCookingTime());
        map.put("image", r.getImage());
        map.put("averageRating", r.getAverageRating());
        map.put("totalRatings", r.getTotalRatings());
        map.put("createdAt", r.getCreatedAt());
        map.put("author", Map.of("_id", r.getAuthor().getId(), "id", r.getAuthor().getId(), "name", r.getAuthor().getName()));
        return map;
    }
}
