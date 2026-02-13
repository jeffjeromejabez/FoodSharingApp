const express = require('express');
const { createComment, getComments, deleteComment } = require('../controllers/commentController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/:recipeId', getComments);
router.post('/:recipeId', auth, createComment);
router.delete('/:id', auth, deleteComment);

module.exports = router;