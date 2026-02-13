import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { recipeAPI, commentAPI, ratingAPI } from '../api';
import { useAuth } from '../context/AuthContext';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipe();
    fetchComments();
    if (isAuthenticated) {
      fetchUserRating();
    }
  }, [id, isAuthenticated]);

  const fetchRecipe = async () => {
    try {
      const response = await recipeAPI.getRecipe(id);
      setRecipe(response.data);
    } catch (error) {
      console.error('Error fetching recipe:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await commentAPI.getComments(id);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const fetchUserRating = async () => {
    try {
      const response = await ratingAPI.getUserRating(id);
      setUserRating(response.data.rating || 0);
    } catch (error) {
      console.error('Error fetching user rating:', error);
    }
  };

  const handleRating = async (rating) => {
    if (!isAuthenticated) return;
    
    try {
      await ratingAPI.createRating(id, rating);
      setUserRating(rating);
      fetchRecipe();
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await commentAPI.createComment(id, newComment);
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await commentAPI.deleteComment(commentId);
      fetchComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await recipeAPI.deleteRecipe(id);
        navigate('/');
      } catch (error) {
        console.error('Error deleting recipe:', error);
      }
    }
  };

  const renderStars = (rating, interactive = false) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          className={`${
            interactive ? 'interactive-star' : 'recipe-rating-star'
          } ${
            i <= (interactive ? (hoverRating || userRating) : rating)
              ? 'active'
              : 'empty'
          }`}
          onClick={interactive ? () => handleRating(i) : undefined}
          onMouseEnter={interactive ? () => setHoverRating(i) : undefined}
          onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
          disabled={!interactive || !isAuthenticated}
        >
          ★
        </button>
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading recipe...</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="container">
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <h3>Recipe not found</h3>
          <p>The recipe you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const isOwner = user && recipe.author._id === user.id;

  return (
    <div className="recipe-detail">
      <div className="container">
        <div className="recipe-detail-container">
          <div className="recipe-hero">
            {recipe.image ? (
              <img
                src={`http://localhost:5000/uploads/${recipe.image}`}
                alt={recipe.title}
                className="recipe-hero-image"
              />
            ) : (
              <div 
                className="recipe-hero-image"
                style={{
                  background: 'linear-gradient(135deg, #ff6b35, #e74c3c)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '6rem',
                  color: 'white'
                }}
              >
                🍽️
              </div>
            )}
            
            <div className="recipe-hero-overlay">
              <h1 className="recipe-hero-title">{recipe.title}</h1>
              <div className="recipe-hero-meta">
                <div className="recipe-meta-item">
                  <span className="icon">👨🍳</span>
                  <span>By {recipe.author.name}</span>
                </div>
                <div className="recipe-meta-item">
                  <span className="icon">⏱️</span>
                  <span>{recipe.cookingTime} minutes</span>
                </div>
                <div className="recipe-meta-item">
                  <span className="icon">🏷️</span>
                  <span>{recipe.category}</span>
                </div>
              </div>
            </div>

            {isOwner && (
              <div className="recipe-actions">
                <button
                  onClick={() => navigate(`/edit/${recipe._id}`)}
                  className="recipe-action-btn edit"
                  title="Edit Recipe"
                >
                  ✏️
                </button>
                <button
                  onClick={handleDelete}
                  className="recipe-action-btn delete"
                  title="Delete Recipe"
                >
                  🗑️
                </button>
              </div>
            )}
          </div>
          
          <div className="recipe-content">
            <p className="recipe-description">{recipe.description}</p>

            <div className="recipe-rating-section">
              <div className="recipe-rating-display">
                <div className="recipe-rating-stars">
                  {renderStars(recipe.averageRating || 0)}
                </div>
                <span className="recipe-rating-text">
                  {recipe.averageRating?.toFixed(1) || '0.0'} ({recipe.totalRatings || 0} ratings)
                </span>
              </div>

              {isAuthenticated && (
                <div className="recipe-rating-interactive">
                  <h4>Rate this recipe</h4>
                  <div className="interactive-stars">
                    {renderStars(userRating, true)}
                  </div>
                </div>
              )}
            </div>

            <div className="recipe-sections">
              <div className="recipe-section">
                <h3>Ingredients</h3>
                <ul className="ingredients-list">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="ingredient-item">
                      {ingredient}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="recipe-section">
                <h3>Instructions</h3>
                <ol className="instructions-list">
                  {recipe.steps.map((step, index) => (
                    <li key={index} className="instruction-item">
                      <div className="instruction-number">{index + 1}</div>
                      <div className="instruction-text">{step}</div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="comments-section">
              <h3>Comments</h3>
              
              {isAuthenticated && (
                <form onSubmit={handleComment} className="comment-form">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts about this recipe..."
                    className="comment-textarea"
                  />
                  <button
                    type="submit"
                    className="btn btn-primary comment-submit"
                  >
                    Add Comment
                  </button>
                </form>
              )}

              <div className="comments-list">
                {comments.map((comment) => (
                  <div key={comment._id} className="comment-item">
                    <div className="comment-header">
                      <span className="comment-author">{comment.author.name}</span>
                      <span className="comment-date">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="comment-content">{comment.content}</p>
                    {user && comment.author._id === user.id && (
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="comment-delete"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {comments.length === 0 && (
                <div className="no-comments">
                  <p>No comments yet. Be the first to share your thoughts!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;