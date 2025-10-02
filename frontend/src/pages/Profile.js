import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserIcon, EnvelopeIcon, CalendarIcon } from '@heroicons/react/24/outline';

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">User data not available</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600">Your account information</p>
      </div>

      {/* Profile Card */}
      <div className="card">
        <div className="flex items-center space-x-6 mb-8">
          <div className="flex-shrink-0">
            <div className="h-20 w-20 bg-primary-100 rounded-full flex items-center justify-center">
              <UserIcon className="h-10 w-10 text-primary-600" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>

        {/* User Information */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-3">
              <UserIcon className="h-6 w-6 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">Full Name</p>
                <p className="text-lg text-gray-900">{user.name}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <EnvelopeIcon className="h-6 w-6 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">Email Address</p>
                <p className="text-lg text-gray-900">{user.email}</p>
              </div>
            </div>
          </div>

          {user.createdAt && (
            <div className="flex items-center space-x-3">
              <CalendarIcon className="h-6 w-6 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">Member Since</p>
                <p className="text-lg text-gray-900">
                  {formatDate(user.createdAt)}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-3">
            <div className="h-6 w-6 flex items-center justify-center">
              <div className={`h-3 w-3 rounded-full ${
                user.isEmailVerified ? 'bg-green-500' : 'bg-yellow-500'
              }`}></div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email Status</p>
              <p className="text-lg text-gray-900">
                {user.isEmailVerified ? 'Verified' : 'Unverified'}
              </p>
            </div>
          </div>
        </div>

        {/* Account Stats */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-primary-600">
                {user.createdAt ? Math.floor((new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24)) : 0}
              </p>
              <p className="text-sm text-gray-600">Days Active</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">Free</p>
              <p className="text-sm text-gray-600">Account Type</p>
            </div>
          </div>
        </div>
      </div>

      {/* App Information */}
      <div className="card mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">About Book Library Manager</h3>
        <div className="space-y-4 text-gray-600">
          <p>
            Welcome to your personal book library management system! Here you can:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Add and organize your book collection</li>
            <li>Track your reading progress</li>
            <li>Rate and review books</li>
            <li>Search and filter your library</li>
            <li>View reading statistics and analytics</li>
            <li>Get email notifications for new books</li>
          </ul>
          <p>
            Your data is securely stored and only accessible to you. 
            Start building your digital library today!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
