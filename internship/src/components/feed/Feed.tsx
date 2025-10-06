import React, { useState } from 'react';
import { Filter, ChevronDown } from 'lucide-react';
import PostCard from './PostCard';
import { usePosts } from '../../hooks/usePosts';

interface FeedProps {
  isLoggedIn?: boolean;
}

const Feed: React.FC<FeedProps> = ({ isLoggedIn = true }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Recent');
  const { posts, loading } = usePosts();

  const filters = ['All', 'Article', 'Event', 'Education', 'Job'];
  const sortOptions = ['Recent', 'Popular', 'Most Liked'];

  const filteredPosts = posts.filter(post => 
    activeFilter === 'All' || post.category === activeFilter
  );

  // if (!isLoggedIn) {
  //   return (
  //     <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  //       <div className="text-center">
  //         <h2 className="text-3xl font-bold text-gray-900 mb-4">
  //           Computer Engineering
  //         </h2>
  //         <p className="text-lg text-gray-600 mb-8">
  //           142,765 Computer Engineers follow this
  //         </p>
  //         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
  //           <h3 className="text-xl font-semibold text-gray-900 mb-4">
  //             Join our community to see the latest posts
  //           </h3>
  //           <p className="text-gray-600 mb-6">
  //             Connect with fellow engineers, share knowledge, and stay updated with the latest in technology.
  //           </p>
  //           <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200">
  //             Join Group
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <main className="flex-1 lg:pl-64 xl:pr-80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Group Header */}
        <div className="mb-8 text-center lg:text-left">
          <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg mb-4 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=200&fit=crop"
              alt="Computer Engineering"
              className="w-full h-full object-cover opacity-80"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <div className="text-center text-white">
                <h1 className="text-4xl font-bold mb-2">Computer Engineering</h1>
                <p className="text-lg">142,765 Computer Engineers follow this</p>
              </div>
            </div>
            <div className="absolute top-4 right-4 flex space-x-2">
              <button className="px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors">
                Join Group
              </button>
              <button className="px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors">
                Leave Group
              </button>
            </div>
          </div>
        </div>

        {/* Filter and Sort Controls */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Filter:</span>
            </div>
            <div className="flex space-x-2">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                    activeFilter === filter
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort posts by"
                className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {sortOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          )}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <button className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
            Load More Posts
          </button>
        </div>
      </div>
    </main>
  );
};

export default Feed;