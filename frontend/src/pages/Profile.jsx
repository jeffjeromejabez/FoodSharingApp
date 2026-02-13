import { useState, useEffect } from 'react';
import { recipeAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import RecipeCard from '../components/RecipeCard';

const Profile = () => {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserRecipes();
  }, []);

  const fetchUserRecipes = async () => {
    try {
      const response = await recipeAPI.getUserRecipes();
      setRecipes(response.data);
    } catch (error) {
      console.error('Error fetching user recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Profile</h1>
        <p className="text-gray-600">Welcome back, {user?.name}!</p>
        <p className="text-sm text-gray-500">{user?.email}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">My Recipes ({recipes.length})</h2>
      </div>

      {recipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map(recipe => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">You haven't created any recipes yet.</p>
          <a
            href="/create"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Create Your First Recipe
          </a>
        </div>
      )}
    </div>
  );
};

export default Profile;