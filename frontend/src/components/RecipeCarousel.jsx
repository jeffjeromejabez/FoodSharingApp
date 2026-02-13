import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const RecipeCarousel = ({ recipes, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);

  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 480) setItemsPerView(1);
      else if (window.innerWidth < 768) setItemsPerView(2);
      else setItemsPerView(3);
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      prev + itemsPerView >= recipes.length ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? Math.max(0, recipes.length - itemsPerView) : prev - 1
    );
  };

  if (!recipes || recipes.length === 0) return null;

  return (
    <div className="recipe-carousel">
      <h2 className="carousel-title">{title}</h2>
      <div className="carousel-wrapper">
        <button className="carousel-btn carousel-btn-prev" onClick={prevSlide}>
          ‹
        </button>
        
        <div className="carousel-container">
          <div 
            className="carousel-track"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
              width: `${(recipes.length / itemsPerView) * 100}%`
            }}
          >
            {recipes.map((recipe) => (
              <div key={recipe._id} className="carousel-item">
                <Link to={`/recipe/${recipe._id}`} className="carousel-card">
                  <div className="carousel-image-container">
                    {recipe.image ? (
                      <img
                        src={`http://localhost:5001/uploads/${recipe.image}`}
                        alt={recipe.title}
                        className="carousel-image"
                      />
                    ) : (
                      <div className="carousel-image-placeholder">
                        🍽️
                      </div>
                    )}
                    <div className="carousel-category">{recipe.category}</div>
                  </div>
                  <div className="carousel-content">
                    <h3 className="carousel-recipe-title">{recipe.title}</h3>
                    <div className="carousel-meta">
                      <span>⭐ {recipe.averageRating?.toFixed(1) || '0.0'}</span>
                      <span>⏱️ {recipe.cookingTime}min</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
        
        <button className="carousel-btn carousel-btn-next" onClick={nextSlide}>
          ›
        </button>
      </div>
      
      <div className="carousel-dots">
        {Array.from({ length: Math.ceil(recipes.length / itemsPerView) }).map((_, index) => (
          <button
            key={index}
            className={`carousel-dot ${index === Math.floor(currentIndex / itemsPerView) ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index * itemsPerView)}
          />
        ))}
      </div>
    </div>
  );
};

export default RecipeCarousel;