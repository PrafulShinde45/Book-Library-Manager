import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '../utils/api';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const EditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // Fetch book data
  const { data: book, isLoading, error } = useQuery(
    ['book', id],
    async () => {
      const response = await api.get(`/api/books/${id}`);
      return response.data.data;
    },
    {
      onSuccess: (data) => {
        reset(data);
      },
    }
  );

  // Update book mutation
  const updateBookMutation = useMutation(
    async (bookData) => {
      const response = await api.put(`/api/books/${id}`, bookData);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('books');
        queryClient.invalidateQueries(['book', id]);
        queryClient.invalidateQueries('dashboard-stats');
        toast.success('Book updated successfully!');
        navigate('/books');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update book');
      },
    }
  );

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await updateBookMutation.mutateAsync(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

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
        <p className="text-red-600">Failed to load book data</p>
        <Link to="/books" className="btn-primary mt-4">
          Back to Books
        </Link>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Book not found</p>
        <Link to="/books" className="btn-primary mt-4">
          Back to Books
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <Link
          to="/books"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Book</h1>
          <p className="text-gray-600">Update book information</p>
        </div>
      </div>

      {/* Form */}
      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Book Title *
            </label>
            <input
              {...register('title', {
                required: 'Book title is required',
                minLength: {
                  value: 1,
                  message: 'Title must be at least 1 character',
                },
                maxLength: {
                  value: 200,
                  message: 'Title cannot exceed 200 characters',
                },
              })}
              type="text"
              className={`input-field ${errors.title ? 'border-red-300 focus:ring-red-500' : ''}`}
              placeholder="Enter the book title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          {/* Author */}
          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
              Author *
            </label>
            <input
              {...register('author', {
                required: 'Author is required',
                minLength: {
                  value: 1,
                  message: 'Author name must be at least 1 character',
                },
                maxLength: {
                  value: 100,
                  message: 'Author name cannot exceed 100 characters',
                },
              })}
              type="text"
              className={`input-field ${errors.author ? 'border-red-300 focus:ring-red-500' : ''}`}
              placeholder="Enter the author's name"
            />
            {errors.author && (
              <p className="mt-1 text-sm text-red-600">{errors.author.message}</p>
            )}
          </div>

          {/* Genre */}
          <div>
            <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-2">
              Genre *
            </label>
            <input
              {...register('genre', {
                required: 'Genre is required',
                minLength: {
                  value: 1,
                  message: 'Genre must be at least 1 character',
                },
                maxLength: {
                  value: 50,
                  message: 'Genre cannot exceed 50 characters',
                },
              })}
              type="text"
              className={`input-field ${errors.genre ? 'border-red-300 focus:ring-red-500' : ''}`}
              placeholder="e.g., Fiction, Non-fiction, Science, History"
            />
            {errors.genre && (
              <p className="mt-1 text-sm text-red-600">{errors.genre.message}</p>
            )}
          </div>

          {/* Published Year */}
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
              Published Year *
            </label>
            <select
              {...register('year', {
                required: 'Published year is required',
                setValueAs: (value) => parseInt(value),
              })}
              className={`input-field ${errors.year ? 'border-red-300 focus:ring-red-500' : ''}`}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            {errors.year && (
              <p className="mt-1 text-sm text-red-600">{errors.year.message}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Reading Status *
            </label>
            <select
              {...register('status', {
                required: 'Status is required',
              })}
              className={`input-field ${errors.status ? 'border-red-300 focus:ring-red-500' : ''}`}
            >
              <option value="Wishlist">Wishlist</option>
              <option value="Reading">Currently Reading</option>
              <option value="Completed">Completed</option>
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
            )}
          </div>

          {/* Rating */}
          <div>
            <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
              Rating (Optional)
            </label>
            <select
              {...register('rating', {
                setValueAs: (value) => value === '' ? null : parseInt(value),
              })}
              className="input-field"
            >
              <option value="">No rating</option>
              <option value="1">1 Star</option>
              <option value="2">2 Stars</option>
              <option value="3">3 Stars</option>
              <option value="4">4 Stars</option>
              <option value="5">5 Stars</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              {...register('notes', {
                maxLength: {
                  value: 1000,
                  message: 'Notes cannot exceed 1000 characters',
                },
              })}
              rows={4}
              className={`input-field ${errors.notes ? 'border-red-300 focus:ring-red-500' : ''}`}
              placeholder="Add any notes about this book..."
            />
            {errors.notes && (
              <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Updating Book...</span>
                </div>
              ) : (
                'Update Book'
              )}
            </button>
            <Link
              to="/books"
              className="flex-1 btn-secondary text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBook;
