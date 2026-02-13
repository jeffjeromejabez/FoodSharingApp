const express = require('express');
const { createRating, getUserRating } = require('../controllers/ratingController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/:recipeId', auth, createRating);
router.get('/:recipeId', auth, getUserRating);

module.exports = router;