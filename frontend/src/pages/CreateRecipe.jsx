import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { recipeAPI } from '../api';

const CreateRecipe = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ingredients: [''],
    steps: [''],
    category: '',
    cookingTime: '',
    image: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  const categories = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Beverage'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Submitting recipe:', formData);
      
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('ingredients', JSON.stringify(formData.ingredients.filter(i => i.trim())));
      formDataToSend.append('steps', JSON.stringify(formData.steps.filter(s => s.trim())));
      formDataToSend.append('category', formData.category);
      formDataToSend.append('cookingTime', formData.cookingTime);
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      console.log('FormData entries:');
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      const response = await recipeAPI.createRecipe(formDataToSend);
      console.log('Recipe created successfully:', response.data);
      navigate('/');
    } catch (error) {
      console.error('Recipe creation error:', error);
      setError(error.response?.data?.message || 'Failed to create recipe');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addIngredient = () => {
    setFormData({ ...formData, ingredients: [...formData.ingredients, ''] });
  };

  const removeIngredient = (index) => {
    const newIngredients = formData.ingredients.filter((_, i) => i !== index);
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const addStep = () => {
    setFormData({ ...formData, steps: [...formData.steps, ''] });
  };

  const removeStep = (index) => {
    const newSteps = formData.steps.filter((_, i) => i !== index);
    setFormData({ ...formData, steps: newSteps });
  };

  return (
    <div className="create-recipe">
      <div className="container">
        <div className="create-recipe-container">
          <div className="create-recipe-header">
            <h1 className="create-recipe-title">Create New Recipe</h1>
            <p className="create-recipe-subtitle">Share your culinary masterpiece with the world</p>
          </div>
          
          <form onSubmit={handleSubmit} className="create-recipe-form">
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <div className="form-section">
              <div className="form-group">
                <label className="form-label">
                  <span className="icon">📝</span>
                  Recipe Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="form-input"
                  placeholder="Enter a delicious recipe name..."
                />
              </div>
            </div>

            <div className="form-section">
              <div className="form-group">
                <label className="form-label">
                  <span className="icon">📖</span>
                  Description
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="form-input form-textarea"
                  placeholder="Describe your recipe and what makes it special..."
                />
              </div>
            </div>

            <div className="form-section">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">
                    <span className="icon">🏷️</span>
                    Category
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="form-input form-select"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span className="icon">⏱️</span>
                    Cooking Time (minutes)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.cookingTime}
                    onChange={(e) => setFormData({ ...formData, cookingTime: e.target.value })}
                    className="form-input"
                    placeholder="30"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="form-group">
                <label className="form-label">
                  <span className="icon">📸</span>
                  Recipe Image
                </label>
                <div className="image-upload" onClick={() => document.getElementById('image-input').click()}>
                  <input
                    id="image-input"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                  <div className="image-upload-content">
                    <div className="image-upload-icon">📷</div>
                    <p>Click to upload or drag and drop</p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--gray-text)' }}>
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
                {imagePreview && (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Recipe preview" />
                  </div>
                )}
              </div>
            </div>

            <div className="form-section">
              <div className="form-group">
                <label className="form-label">
                  <span className="icon">🥄</span>
                  Ingredients
                </label>
                <div className="dynamic-list">
                  {formData.ingredients.map((ingredient, index) => (
                    <div key={index} className="dynamic-item">
                      <div className="dynamic-item-number">{index + 1}</div>
                      <input
                        type="text"
                        required
                        value={ingredient}
                        onChange={(e) => {
                          const newIngredients = [...formData.ingredients];
                          newIngredients[index] = e.target.value;
                          setFormData({ ...formData, ingredients: newIngredients });
                        }}
                        className="form-input dynamic-item-input"
                        placeholder={`Ingredient ${index + 1}`}
                      />
                      {formData.ingredients.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeIngredient(index)}
                          className="remove-btn"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addIngredient}
                    className="add-btn"
                  >
                    Add Ingredient
                  </button>
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="form-group">
                <label className="form-label">
                  <span className="icon">👨‍🍳</span>
                  Cooking Steps
                </label>
                <div className="dynamic-list">
                  {formData.steps.map((step, index) => (
                    <div key={index} className="dynamic-item">
                      <div className="dynamic-item-number">{index + 1}</div>
                      <textarea
                        required
                        rows="3"
                        value={step}
                        onChange={(e) => {
                          const newSteps = [...formData.steps];
                          newSteps[index] = e.target.value;
                          setFormData({ ...formData, steps: newSteps });
                        }}
                        className="form-input form-textarea dynamic-item-input"
                        placeholder={`Step ${index + 1}: Describe what to do...`}
                      />
                      {formData.steps.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeStep(index)}
                          className="remove-btn"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addStep}
                    className="add-btn"
                  >
                    Add Step
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="submit-btn"
            >
              {loading ? 'Creating Recipe...' : 'Create Recipe'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRecipe;