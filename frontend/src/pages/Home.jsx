import { useState, useEffect } from 'react';
import { recipeAPI } from '../api';
import RecipeCard from '../components/RecipeCard';

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

  const categories = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Beverage'];

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchRecipes();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [search, category, sort]);

  // Auto-slide carousel
  useEffect(() => {
    if (recipes.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % Math.min(recipes.length, 5));
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [recipes.length]);

  const fetchRecipes = async () => {
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (category) params.category = category;
      if (sort) params.sort = sort;

      console.log('Fetching recipes with params:', params);
      const response = await recipeAPI.getRecipes(params);
      console.log('Recipes received:', response.data.length);
      setRecipes(response.data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setSort('');
  };

  const scrollToRecipes = () => {
    document.getElementById('recipes-section').scrollIntoView({
      behavior: 'smooth'
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading delicious recipes...</p>
      </div>
    );
  }

  const heroRecipes = recipes.slice(0, 5);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-carousel">
          <div
            className="hero-carousel-track"
            style={{
              transform: `translateX(-${currentSlide * 20}%)`,
              transition: 'transform 0.8s ease-in-out'
            }}
          >
            {heroRecipes.map((recipe, index) => (
              <div key={recipe._id || index} className="hero-slide">
                {recipe.image ? (
                  <img
                    src={`http://localhost:5000/uploads/${recipe.image}`}
                    alt={recipe.title}
                  />
                ) : (
                  <div className="hero-slide-placeholder">
                    🍽️
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Discover • Cook • Share</h1>
          <p className="hero-subtitle">Your culinary journey starts here</p>
          <button className="hero-cta" onClick={scrollToRecipes}>
            Explore Recipes
          </button>
        </div>
      </section>

      <div className="container">
        {/* Search and Filter Section */}
        <section className="search-section">
          <div className="search-form">
            <div className="search-input">
              <input
                type="text"
                placeholder="Search recipes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="filter-select">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-input form-select"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="filter-select">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="form-input form-select"
              >
                <option value="">Latest</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            <button
              className="clear-filters"
              onClick={clearFilters}
            >
              Clear
            </button>
          </div>
        </section>

        <section id="recipes-section">
          <h2 className="text-center mb-4">All Recipes</h2>

          <div className="recipes-grid">
            {recipes.map(recipe => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>

          {recipes.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">🍽️</div>
              <h3>No recipes found</h3>
              <p>Try adjusting your search criteria or explore different categories.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;
