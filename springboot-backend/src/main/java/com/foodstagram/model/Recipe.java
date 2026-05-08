package com.foodstagram.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "recipes")
public class Recipe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @ElementCollection
    @CollectionTable(name = "recipe_ingredients", joinColumns = @JoinColumn(name = "recipe_id"))
    @Column(name = "ingredient")
    private List<String> ingredients;

    @ElementCollection
    @CollectionTable(name = "recipe_steps", joinColumns = @JoinColumn(name = "recipe_id"))
    @Column(name = "step", columnDefinition = "TEXT")
    @OrderColumn(name = "step_order")
    private List<String> steps;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private Integer cookingTime;

    private String image;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    @Column(nullable = false)
    private Double averageRating = 0.0;

    @Column(nullable = false)
    private Integer totalRatings = 0;

    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL)
    private List<Comment> comments;

    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL)
    private List<Rating> ratings;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
