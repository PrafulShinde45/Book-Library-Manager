import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import api from '../utils/api';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Books = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const { data: booksData, isLoading, error, refetch } = useQuery(
    ['books', searchTerm, selectedGenre, selectedStatus, currentPage],
    async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedGenre) params.append('genre', selectedGenre);
      if (selectedStatus) params.append('status', selectedStatus);
      params.append('page', currentPage);
      params.append('limit', 12);

      const response = await api.get(`/api/books?${params}`);
      return response.data;
    }
  );

  const handleDeleteBook = async (bookId, bookTitle) => {
    if (window.confirm(`Are you sure you want to delete "${bookTitle}"?`)) {
      try {
        await api.delete(`/api/books/${bookId}`);
        toast.success('Book deleted successfully');
        refetch();
      } catch (error) {
        toast.error('Failed to delete book');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Reading':
        return 'bg-blue-100 text-blue-800';
      case 'Wishlist':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedGenre('');
    setSelectedStatus('');
    setCurrentPage(1);
  };

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
        <p className="text-red-600">Failed to load books</p>
      </div>
    );
  }

  const books = booksData?.data || [];
  const pagination = booksData?.pagination || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex-1 text-center">
          <h1 className="text-3xl font-bold text-gray-900">My Books</h1>
          <p className="text-gray-600">
            {pagination.totalBooks || 0} books in your library
          </p>
        </div>
        <Link
          to="/books/add"
          className="btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Book</span>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search books by title, author, or genre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary flex items-center space-x-2"
          >
            <FunnelIcon className="h-5 w-5" />
            <span>Filters</span>
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Genre
                </label>
                <input
                  type="text"
                  placeholder="Filter by genre"
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="input-field"
                >
                  <option value="">All Status</option>
                  <option value="Reading">Reading</option>
                  <option value="Completed">Completed</option>
                  <option value="Wishlist">Wishlist</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="btn-secondary w-full"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Books Grid */}
      {books.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map((book) => (
              <div key={book._id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <BookOpenIcon className="h-8 w-8 text-primary-600 flex-shrink-0" />
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(book.status)}`}>
                    {book.status}
                  </span>
                </div>

                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-1">by {book.author}</p>
                  <p className="text-gray-500 text-sm">{book.genre} • {book.year}</p>
                  {book.rating && (
                    <div className="flex items-center mt-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < book.rating ? 'text-yellow-400' : 'text-gray-300'}>
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="ml-1 text-sm text-gray-600">({book.rating}/5)</span>
                    </div>
                  )}
                </div>

                {book.notes && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {book.notes}
                    </p>
                  </div>
                )}

                <div className="flex space-x-2">
                  <Link
                    to={`/books/${book._id}/edit`}
                    className="flex-1 btn-secondary text-center text-sm"
                  >
                    <PencilIcon className="h-4 w-4 mx-auto" />
                  </Link>
                  <button
                    onClick={() => handleDeleteBook(book._id, book.title)}
                    className="btn-danger text-sm"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <span className="text-sm text-gray-600">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <BookOpenIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || selectedGenre || selectedStatus
              ? 'Try adjusting your search or filters'
              : 'Start building your library by adding your first book'
            }
          </p>
          <Link to="/books/add" className="btn-primary">
            Add Your First Book
          </Link>
        </div>
      )}
    </div>
  );
};

export default Books;
