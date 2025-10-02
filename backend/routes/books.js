const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Book = require('../models/Book');
const auth = require('../middleware/auth');
const emailService = require('../utils/emailService');

const router = express.Router();

// @route   GET /api/books
// @desc    Get all books for authenticated user with search and filter
// @access  Private
router.get('/', auth, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('search').optional().isString().withMessage('Search must be a string'),
  query('genre').optional().isString().withMessage('Genre must be a string'),
  query('status').optional().isIn(['Reading', 'Completed', 'Wishlist']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { search, genre, status, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    // Build query
    let query = { userId: req.user._id };

    // Add search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { genre: { $regex: search, $options: 'i' } }
      ];
    }

    // Add genre filter
    if (genre) {
      query.genre = { $regex: genre, $options: 'i' };
    }

    // Add status filter
    if (status) {
      query.status = status;
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Get books with pagination
    const books = await Book.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await Book.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: books,
      pagination: {
        currentPage: page,
        totalPages,
        totalBooks: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching books'
    });
  }
});

// @route   GET /api/books/:id
// @desc    Get a single book by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const book = await Book.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    res.json({
      success: true,
      data: book
    });
  } catch (error) {
    console.error('Get book error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching book'
    });
  }
});

// @route   POST /api/books
// @desc    Add a new book
// @access  Private
router.post('/', auth, [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('author')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Author must be between 1 and 100 characters'),
  body('genre')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Genre must be between 1 and 50 characters'),
  body('year')
    .isInt({ min: 1000, max: new Date().getFullYear() })
    .withMessage('Year must be a valid year'),
  body('status')
    .optional()
    .isIn(['Reading', 'Completed', 'Wishlist'])
    .withMessage('Status must be Reading, Completed, or Wishlist'),
  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('notes')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { title, author, genre, year, status = 'Wishlist', rating, notes = '' } = req.body;

    // Check if book already exists for this user
    const existingBook = await Book.findOne({
      title: { $regex: new RegExp(`^${title}$`, 'i') },
      author: { $regex: new RegExp(`^${author}$`, 'i') },
      userId: req.user._id
    });

    if (existingBook) {
      return res.status(400).json({
        success: false,
        message: 'This book already exists in your library'
      });
    }

    // Create new book
    const book = new Book({
      title,
      author,
      genre,
      year,
      status,
      rating,
      notes,
      userId: req.user._id
    });

    await book.save();

    // Send email notification (async, don't wait for it)
    emailService.sendBookAddedEmail(req.user.email, req.user.name, book.title).catch(error => {
      console.error('Failed to send book added email:', error);
    });

    res.status(201).json({
      success: true,
      message: 'Book added successfully',
      data: book
    });
  } catch (error) {
    console.error('Add book error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding book'
    });
  }
});

// @route   PUT /api/books/:id
// @desc    Update a book
// @access  Private
router.put('/:id', auth, [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('author')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Author must be between 1 and 100 characters'),
  body('genre')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Genre must be between 1 and 50 characters'),
  body('year')
    .optional()
    .isInt({ min: 1000, max: new Date().getFullYear() })
    .withMessage('Year must be a valid year'),
  body('status')
    .optional()
    .isIn(['Reading', 'Completed', 'Wishlist'])
    .withMessage('Status must be Reading, Completed, or Wishlist'),
  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('notes')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const book = await Book.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    // Update book fields
    const updateFields = {};
    const allowedFields = ['title', 'author', 'genre', 'year', 'status', 'rating', 'notes'];
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateFields[field] = req.body[field];
      }
    });

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Book updated successfully',
      data: updatedBook
    });
  } catch (error) {
    console.error('Update book error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating book'
    });
  }
});

// @route   DELETE /api/books/:id
// @desc    Delete a book
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const book = await Book.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    res.json({
      success: true,
      message: 'Book deleted successfully',
      data: { id: book._id, title: book.title }
    });
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting book'
    });
  }
});

module.exports = router;
