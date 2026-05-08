package com.foodstagram.repository;

import com.foodstagram.model.Rating;
import com.foodstagram.model.Recipe;
import com.foodstagram.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface RatingRepository extends JpaRepository<Rating, Long> {
    Optional<Rating> findByAuthorAndRecipe(User author, Recipe recipe);
    List<Rating> findByRecipe(Recipe recipe);
}
