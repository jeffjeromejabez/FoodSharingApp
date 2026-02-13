const Rating = require('../models/Rating');
const Recipe = require('../models/Recipe');

const createRating = async (req, res) => {
  try {
    const { rating } = req.body;
    const { recipeId } = req.params;

    const existingRating = await Rating.findOne({
      author: req.user._id,
      recipe: recipeId
    });

    if (existingRating) {
      existingRating.rating = rating;
      await existingRating.save();
    } else {
      await Rating.create({
        rating,
        author: req.user._id,
        recipe: recipeId
      });
    }

    // Update recipe average rating
    const ratings = await Rating.find({ recipe: recipeId });
    const avgRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
    
    await Recipe.findByIdAndUpdate(recipeId, {
      averageRating: avgRating,
      totalRatings: ratings.length
    });

    res.json({ message: 'Rating saved', averageRating: avgRating });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getUserRating = async (req, res) => {
  try {
    const { recipeId } = req.params;
    
    const rating = await Rating.findOne({
      author: req.user._id,
      recipe: recipeId
    });

    res.json({ rating: rating ? rating.rating : null });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { createRating, getUserRating };