const express = require('express');
const multer = require('multer');
const path = require('path');
const {
  createRecipe,
  getRecipes,
  getRecipe,
  updateRecipe,
  deleteRecipe,
  getUserRecipes
} = require('../controllers/recipeController');
const auth = require('../middleware/auth');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.get('/', getRecipes);
router.get('/my-recipes', auth, getUserRecipes);
router.get('/:id', getRecipe);
router.post('/', auth, upload.single('image'), createRecipe);
router.put('/:id', auth, upload.single('image'), updateRecipe);
router.delete('/:id', auth, deleteRecipe);

module.exports = router;