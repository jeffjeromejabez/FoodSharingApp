package com.foodstagram.repository;

import com.foodstagram.model.Comment;
import com.foodstagram.model.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByRecipeOrderByCreatedAtDesc(Recipe recipe);
}
