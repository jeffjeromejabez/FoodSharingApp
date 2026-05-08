package com.foodstagram.controller;

import com.foodstagram.model.Rating;
import com.foodstagram.model.Recipe;
import com.foodstagram.model.User;
import com.foodstagram.repository.RatingRepository;
import com.foodstagram.repository.RecipeRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/ratings")
public class RatingController {
    private final RatingRepository ratingRepository;
    private final RecipeRepository recipeRepository;

    public RatingController(RatingRepository ratingRepository, RecipeRepository recipeRepository) {
        this.ratingRepository = ratingRepository;
        this.recipeRepository = recipeRepository;
    }

    @PostMapping("/{recipeId}")
    public ResponseEntity<?> createRating(@PathVariable Long recipeId,
                                           @RequestBody Map<String, Integer> body,
                                           @AuthenticationPrincipal User user) {
        Recipe recipe = recipeRepository.findById(recipeId).orElse(null);
        if (recipe == null) return ResponseEntity.notFound().build();

        Optional<Rating> existing = ratingRepository.findByAuthorAndRecipe(user, recipe);
        Rating rating;
        if (existing.isPresent()) {
            rating = existing.get();
            rating.setRating(body.get("rating"));
        } else {
            rating = new Rating();
            rating.setRating(body.get("rating"));
            rating.setAuthor(user);
            rating.setRecipe(recipe);
        }
        ratingRepository.save(rating);

        List<Rating> ratings = ratingRepository.findByRecipe(recipe);
        double avg = ratings.stream().mapToInt(Rating::getRating).average().orElse(0.0);
        recipe.setAverageRating(avg);
        recipe.setTotalRatings(ratings.size());
        recipeRepository.save(recipe);

        return ResponseEntity.ok(Map.of("message", "Rating saved", "averageRating", avg));
    }

    @GetMapping("/{recipeId}")
    public ResponseEntity<?> getUserRating(@PathVariable Long recipeId, @AuthenticationPrincipal User user) {
        Recipe recipe = recipeRepository.findById(recipeId).orElse(null);
        if (recipe == null) return ResponseEntity.notFound().build();
        Optional<Rating> rating = ratingRepository.findByAuthorAndRecipe(user, recipe);
        return ResponseEntity.ok(Map.of("rating", rating.map(Rating::getRating).orElse(null)));
    }
}
