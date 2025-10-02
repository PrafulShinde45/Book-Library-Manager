const express = require('express');
const Book = require('../models/Book');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/dashboard/stats
// @desc    Get dashboard statistics for authenticated user
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get total books count
    const totalBooks = await Book.countDocuments({ userId });

    // Get books count by status
    const booksByStatus = await Book.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get books count by genre
    const booksByGenre = await Book.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$genre',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 } // Top 10 genres
    ]);

    // Get books count by year (last 10 years)
    const currentYear = new Date().getFullYear();
    const booksByYear = await Book.aggregate([
      { $match: { userId } },
      {
        $match: {
          year: { $gte: currentYear - 9, $lte: currentYear }
        }
      },
      {
        $group: {
          _id: '$year',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get recent books (last 5)
    const recentBooks = await Book.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title author status createdAt')
      .lean();

    // Get reading progress (books with ratings)
    const readingProgress = await Book.aggregate([
      { $match: { userId, rating: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalRatedBooks: { $sum: 1 }
        }
      }
    ]);

    // Get books by rating distribution
    const ratingDistribution = await Book.aggregate([
      { $match: { userId, rating: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Format the response
    const statusStats = {};
    booksByStatus.forEach(item => {
      statusStats[item._id] = item.count;
    });

    const genreStats = booksByGenre.map(item => ({
      genre: item._id,
      count: item.count
    }));

    const yearStats = booksByYear.map(item => ({
      year: item._id,
      count: item.count
    }));

    const ratingStats = ratingDistribution.map(item => ({
      rating: item._id,
      count: item.count
    }));

    const progressData = readingProgress.length > 0 ? {
      averageRating: Math.round(readingProgress[0].averageRating * 10) / 10,
      totalRatedBooks: readingProgress[0].totalRatedBooks
    } : {
      averageRating: 0,
      totalRatedBooks: 0
    };

    res.json({
      success: true,
      data: {
        totalBooks,
        booksByStatus: {
          Reading: statusStats.Reading || 0,
          Completed: statusStats.Completed || 0,
          Wishlist: statusStats.Wishlist || 0
        },
        topGenres: genreStats,
        booksByYear: yearStats,
        recentBooks,
        readingProgress: progressData,
        ratingDistribution: ratingStats
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard statistics'
    });
  }
});

// @route   GET /api/dashboard/analytics
// @desc    Get detailed analytics for authenticated user
// @access  Private
router.get('/analytics', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { period = 'year' } = req.query; // year, month, week

    let dateFilter = {};
    const now = new Date();
    
    switch (period) {
      case 'week':
        dateFilter = {
          createdAt: {
            $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          }
        };
        break;
      case 'month':
        dateFilter = {
          createdAt: {
            $gte: new Date(now.getFullYear(), now.getMonth(), 1)
          }
        };
        break;
      case 'year':
      default:
        dateFilter = {
          createdAt: {
            $gte: new Date(now.getFullYear(), 0, 1)
          }
        };
        break;
    }

    // Books added in the selected period
    const booksAddedInPeriod = await Book.countDocuments({
      userId,
      ...dateFilter
    });

    // Books completed in the selected period
    const booksCompletedInPeriod = await Book.countDocuments({
      userId,
      status: 'Completed',
      updatedAt: {
        $gte: dateFilter.createdAt?.$gte || new Date(now.getFullYear(), 0, 1)
      }
    });

    // Monthly reading activity (last 12 months)
    const monthlyActivity = await Book.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          booksAdded: { $sum: 1 },
          booksCompleted: {
            $sum: {
              $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0]
            }
          }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 }
    ]);

    // Author statistics
    const authorStats = await Book.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$author',
          bookCount: { $sum: 1 },
          completedCount: {
            $sum: {
              $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0]
            }
          }
        }
      },
      { $sort: { bookCount: -1 } },
      { $limit: 10 }
    ]);

    // Genre preferences
    const genrePreferences = await Book.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$genre',
          bookCount: { $sum: 1 },
          avgRating: { $avg: '$rating' }
        }
      },
      { $sort: { bookCount: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: {
        period,
        booksAddedInPeriod,
        booksCompletedInPeriod,
        monthlyActivity: monthlyActivity.map(item => ({
          year: item._id.year,
          month: item._id.month,
          booksAdded: item.booksAdded,
          booksCompleted: item.booksCompleted
        })),
        topAuthors: authorStats.map(item => ({
          author: item._id,
          bookCount: item.bookCount,
          completedCount: item.completedCount,
          completionRate: item.bookCount > 0 
            ? Math.round((item.completedCount / item.bookCount) * 100) 
            : 0
        })),
        genrePreferences: genrePreferences.map(item => ({
          genre: item._id,
          bookCount: item.bookCount,
          averageRating: item.avgRating ? Math.round(item.avgRating * 10) / 10 : null
        }))
      }
    });
  } catch (error) {
    console.error('Dashboard analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching analytics'
    });
  }
});

module.exports = router;
