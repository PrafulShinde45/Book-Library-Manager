import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import {
  BookOpenIcon,
  ClockIcon,
  CheckCircleIcon,
  HeartIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const Dashboard = () => {
  const { data: stats, isLoading, error } = useQuery(
    'dashboard-stats',
    async () => {
      const response = await api.get('/api/dashboard/stats');
      return response.data.data;
    },
    {
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  );

  const { data: analytics } = useQuery(
    'dashboard-analytics',
    async () => {
      const response = await api.get('/api/dashboard/analytics');
      return response.data.data;
    }
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Failed to load dashboard data</p>
      </div>
    );
  }

  const statusData = [
    { name: 'Reading', value: stats?.booksByStatus?.Reading || 0, color: '#3B82F6' },
    { name: 'Completed', value: stats?.booksByStatus?.Completed || 0, color: '#10B981' },
    { name: 'Wishlist', value: stats?.booksByStatus?.Wishlist || 0, color: '#F59E0B' },
  ];

  const genreData = stats?.topGenres?.slice(0, 5).map((genre, index) => ({
    name: genre.genre,
    count: genre.count,
  })) || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex-1 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your reading overview.</p>
        </div>
        <Link
          to="/books/add"
          className="btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Book</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BookOpenIcon className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Books</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats?.totalBooks || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ClockIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Currently Reading</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats?.booksByStatus?.Reading || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Completed</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats?.booksByStatus?.Completed || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <HeartIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Wishlist</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats?.booksByStatus?.Wishlist || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Books by Status */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Books by Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Genres */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Genres</h3>
          {genreData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={genreData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No genre data available
            </div>
          )}
        </div>
      </div>

      {/* Reading Progress */}
      {stats?.readingProgress?.totalRatedBooks > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Reading Progress</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500">Average Rating</p>
              <p className="text-3xl font-bold text-primary-600">
                {stats.readingProgress.averageRating}
              </p>
              <p className="text-sm text-gray-400">out of 5</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500">Books Rated</p>
              <p className="text-3xl font-bold text-green-600">
                {stats.readingProgress.totalRatedBooks}
              </p>
              <p className="text-sm text-gray-400">with ratings</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500">Completion Rate</p>
              <p className="text-3xl font-bold text-blue-600">
                {stats.totalBooks > 0 
                  ? Math.round((stats.booksByStatus.Completed / stats.totalBooks) * 100)
                  : 0}%
              </p>
              <p className="text-sm text-gray-400">books completed</p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Books */}
      {stats?.recentBooks && stats.recentBooks.length > 0 && (
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Books</h3>
            <Link
              to="/books"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View all books
            </Link>
          </div>
          <div className="space-y-3">
            {stats.recentBooks.map((book) => (
              <div
                key={book._id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">{book.title}</p>
                  <p className="text-sm text-gray-500">by {book.author}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  book.status === 'Completed' ? 'bg-green-100 text-green-800' :
                  book.status === 'Reading' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {book.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
