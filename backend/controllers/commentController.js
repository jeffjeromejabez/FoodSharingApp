const Comment = require('../models/Comment');

const createComment = async (req, res) => {
  try {
    const { content } = req.body;
    const { recipeId } = req.params;

    const comment = await Comment.create({
      content,
      author: req.user._id,
      recipe: recipeId
    });

    await comment.populate('author', 'name');
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getComments = async (req, res) => {
  try {
    const { recipeId } = req.params;
    
    const comments = await Comment.find({ recipe: recipeId })
      .populate('author', 'name')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { createComment, getComments, deleteComment };