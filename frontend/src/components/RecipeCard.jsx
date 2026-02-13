import { Link } from 'react-router-dom';
import { useState } from 'react';

const RecipeCard = ({ recipe }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 !== 0;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className="recipe-card-star">★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} className="recipe-card-star">★</span>);
      } else {
        stars.push(<span key={i} className="recipe-card-star empty">★</span>);
      }
    }
    return stars;
  };

  const toggleFavorite = (e) => {
    e.preventDefault();
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="recipe-card">
      <div className="recipe-card-image-container">
        {recipe.image ? (
          <img
            src={`http://localhost:5000/uploads/${recipe.image}`}
            alt={recipe.title}
            className="recipe-card-image"
          />
        ) : (
          <div className="recipe-card-image" style={{
            background: 'linear-gradient(135deg, #ff6b35, #e74c3c)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3rem',
            color: 'white'
          }}>
            🍽️
          </div>
        )}
        
        <div className="recipe-card-category">
          {recipe.category}
        </div>
        
        <button 
          className={`recipe-card-favorite ${isFavorite ? 'active' : ''}`}
          onClick={toggleFavorite}
        >
          ♥
        </button>
      </div>
      
      <div className="recipe-card-content">
        <h3 className="recipe-card-title">{recipe.title}</h3>
        <p className="recipe-card-description">{recipe.description}</p>
        
        <div className="recipe-card-meta">
          <span className="recipe-card-author">
            {recipe.author?.name}
          </span>
          <span className="recipe-card-time">
            {recipe.cookingTime} mins
          </span>
        </div>
        
        <div className="recipe-card-rating">
          <div className="recipe-card-stars">
            {renderStars(recipe.averageRating)}
          </div>
          <span className="recipe-card-rating-text">
            {recipe.averageRating?.toFixed(1) || '0.0'} ({recipe.totalRatings || 0})
          </span>
        </div>
        
        <Link
          to={`/recipe/${recipe._id}`}
          className="recipe-card-button"
        >
          View Recipe
        </Link>
      </div>
    </div>
  );
};

export default RecipeCard;