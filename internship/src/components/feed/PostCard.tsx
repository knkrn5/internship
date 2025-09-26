import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Eye } from 'lucide-react';
import type { Post } from '../../types';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <article className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6 overflow-hidden">
      {/* Header */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              {post.author.avatar ? (
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {post.author.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900">
                {post.author.name}
              </p>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span>{formatTimeAgo(post.timestamp)}</span>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <Eye className="w-3 h-3" />
                  <span>1.4k views</span>
                </div>
              </div>
            </div>
          </div>
          <button 
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="More options"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Category Badge */}
        <div className="mt-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            ⚡ {post.category}
          </span>
        </div>

        {/* Content */}
        <div className="mt-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {post.content}
          </h3>
          {post.author.bio && (
            <p className="mt-2 text-sm text-gray-600 line-clamp-2">
              {post.author.bio}
            </p>
          )}
        </div>
      </div>

      {/* Image */}
      {post.image && (
        <div className="relative">
          <img
            src={post.image}
            alt="Post content"
            className="w-full h-64 object-cover"
            onError={(e) => {
              // Fallback to a placeholder if image fails to load
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x300/f3f4f6/9ca3af?text=Image+Not+Available';
            }}
          />
        </div>
      )}

      {/* Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 text-sm font-medium transition-colors ${
                isLiked
                  ? 'text-red-600 hover:text-red-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Heart
                className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`}
              />
              <span>{likesCount}</span>
            </button>

            <button className="flex items-center space-x-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">
              <MessageCircle className="w-5 h-5" />
              <span>{post.comments}</span>
            </button>

            <button className="flex items-center space-x-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">
              <Share2 className="w-5 h-5" />
              <span>Share</span>
            </button>
          </div>

          <button 
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Bookmark post"
          >
            <Bookmark className="w-5 h-5" />
          </button>
        </div>
      </div>
    </article>
  );
};

export default PostCard;