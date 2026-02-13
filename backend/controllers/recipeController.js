const Recipe = require('../models/Recipe');
const Rating = require('../models/Rating');

const createRecipe = async (req, res) => {
  try {
    console.log('Create recipe request:', req.body);
    console.log('File:', req.file);
    
    const { title, description, ingredients, steps, category, cookingTime } = req.body;
    
    const recipe = await Recipe.create({
      title,
      description,
      ingredients: JSON.parse(ingredients),
      steps: JSON.parse(steps),
      category,
      cookingTime,
      image: req.file ? req.file.filename : '',
      author: req.user._id
    });

    await recipe.populate('author', 'name');
    console.log('Recipe created:', recipe);
    res.status(201).json(recipe);
  } catch (error) {
    console.error('Create recipe error:', error);
    res.status(400).json({ message: error.message });
  }
};

const getRecipes = async (req, res) => {
  try {
    console.log('Search query params:', req.query);
    const { search, category, sort } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { ingredients: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      query.category = category;
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'rating') {
      sortOption = { averageRating: -1 };
    }

    console.log('MongoDB query:', query);
    const recipes = await Recipe.find(query)
      .populate('author', 'name')
      .sort(sortOption);

    console.log('Found recipes:', recipes.length);
    res.json(recipes);
  } catch (error) {
    console.error('Search error:', error);
    res.status(400).json({ message: error.message });
  }
};

const getRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate('author', 'name');
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    if (recipe.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { title, description, ingredients, steps, category, cookingTime } = req.body;
    
    recipe.title = title || recipe.title;
    recipe.description = description || recipe.description;
    recipe.ingredients = ingredients ? JSON.parse(ingredients) : recipe.ingredients;
    recipe.steps = steps ? JSON.parse(steps) : recipe.steps;
    recipe.category = category || recipe.category;
    recipe.cookingTime = cookingTime || recipe.cookingTime;
    
    if (req.file) {
      recipe.image = req.file.filename;
    }

    await recipe.save();
    await recipe.populate('author', 'name');
    
    res.json(recipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    if (recipe.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Recipe.findByIdAndDelete(req.params.id);
    res.json({ message: 'Recipe deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getUserRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ author: req.user._id })
      .populate('author', 'name')
      .sort({ createdAt: -1 });
    
    res.json(recipes);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createRecipe,
  getRecipes,
  getRecipe,
  updateRecipe,
  deleteRecipe,
  getUserRecipes
};