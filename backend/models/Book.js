const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Book title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  author: {
    type: String,
    required: [true, 'Author name is required'],
    trim: true,
    maxlength: [100, 'Author name cannot be more than 100 characters']
  },
  genre: {
    type: String,
    required: [true, 'Genre is required'],
    trim: true,
    maxlength: [50, 'Genre cannot be more than 50 characters']
  },
  year: {
    type: Number,
    required: [true, 'Published year is required'],
    min: [1000, 'Year must be a valid year'],
    max: [new Date().getFullYear(), 'Year cannot be in the future']
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: {
      values: ['Reading', 'Completed', 'Wishlist'],
      message: 'Status must be Reading, Completed, or Wishlist'
    },
    default: 'Wishlist'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5'],
    default: null
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot be more than 1000 characters'],
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update updatedAt field
bookSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for better query performance
bookSchema.index({ userId: 1, title: 1 });
bookSchema.index({ userId: 1, author: 1 });
bookSchema.index({ userId: 1, genre: 1 });
bookSchema.index({ userId: 1, status: 1 });

// Text search index
bookSchema.index({
  title: 'text',
  author: 'text',
  genre: 'text'
});

module.exports = mongoose.model('Book', bookSchema);
