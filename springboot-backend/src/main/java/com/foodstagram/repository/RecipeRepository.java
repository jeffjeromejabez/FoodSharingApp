package com.foodstagram.repository;

import com.foodstagram.model.Recipe;
import com.foodstagram.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface RecipeRepository extends JpaRepository<Recipe, Long> {
    List<Recipe> findByAuthorOrderByCreatedAtDesc(User author);

    @Query("SELECT r FROM Recipe r WHERE " +
           "(:search IS NULL OR LOWER(r.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(r.description) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:category IS NULL OR r.category = :category) " +
           "ORDER BY r.createdAt DESC")
    List<Recipe> searchRecipes(@Param("search") String search, @Param("category") String category);

    @Query("SELECT r FROM Recipe r WHERE " +
           "(:search IS NULL OR LOWER(r.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(r.description) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:category IS NULL OR r.category = :category) " +
           "ORDER BY r.averageRating DESC")
    List<Recipe> searchRecipesByRating(@Param("search") String search, @Param("category") String category);
}
