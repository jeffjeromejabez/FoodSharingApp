import { useState, useEffect } from 'react';

const Carousel = ({ recipes }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Auto-slide every 4 seconds
  useEffect(() => {
    if (recipes.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % recipes.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [recipes.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + recipes.length) % recipes.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % recipes.length);
  };

  if (!recipes || recipes.length === 0) {
    return null;
  }

  return (
    <div className="featured-section">
      <h2 className="text-center mb-3">Featured Recipes</h2>
      <div className="carousel-container">
        <div 
          className="carousel-track"
          style={{
            transform: `translateX(-${currentSlide * 100}%)`
          }}
        >
          {recipes.map((recipe, index) => (
            <div key={recipe._id} className="carousel-slide">
              {recipe.image ? (
                <img
                  src={`http://localhost:5000/uploads/${recipe.image}`}
                  alt={recipe.title}
                  className="carousel-image"
                />
              ) : (
                <div 
                  className="carousel-image"
                  style={{
                    background: 'linear-gradient(135deg, #ff6b35, #e74c3c)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '4rem',
                    color: 'white'
                  }}
                >
                  🍽️
                </div>
              )}
              <div className="carousel-content">
                <h3>{recipe.title}</h3>
                <p>{recipe.description}</p>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <span>⭐ {recipe.averageRating?.toFixed(1) || '0.0'}</span>
                  <span>⏱️ {recipe.cookingTime} mins</span>
                  <span>👨‍🍳 {recipe.author?.name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {recipes.length > 1 && (
          <>
            <button 
              className="carousel-nav carousel-prev"
              onClick={goToPrevious}
            >
              ‹
            </button>
            <button 
              className="carousel-nav carousel-next"
              onClick={goToNext}
            >
              ›
            </button>
          </>
        )}
      </div>
      
      {recipes.length > 1 && (
        <div className="carousel-indicators">
          {recipes.map((_, index) => (
            <button
              key={index}
              className={`carousel-dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;