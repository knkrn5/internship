import { useState, useEffect } from 'react';
import type { Post, User } from '../types';

// Mock users
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarthak Kamra',
    email: 'sarthak@example.com',
    avatar: '',
    bio: "I've worked in UX for the better part of a decade. From being a beginner to now leading design teams, I've seen the industry evolve and change.",
    followers: 1400,
    following: 500,
    posts: 25,
  },
  {
    id: '2',
    name: 'Sarah West',
    email: 'sarah@example.com',
    avatar: '',
    bio: 'Financial advisor specializing in investment strategies and pension planning.',
    followers: 850,
    following: 320,
    posts: 18,
  },
  {
    id: '3',
    name: 'Ronal Jones',
    email: 'ronal@example.com',
    avatar: '',
    bio: 'Event organizer and networking enthusiast in the finance sector.',
    followers: 2100,
    following: 180,
    posts: 42,
  },
  {
    id: '4',
    name: 'Joseph Gray',
    email: 'joseph@example.com',
    avatar: '',
    bio: 'HR Manager at tech companies, helping connect talent with opportunities.',
    followers: 650,
    following: 290,
    posts: 15,
  },
];

// Mock posts
const generateMockPosts = (): Post[] => [
  {
    id: '1',
    author: mockUsers[0],
    content: 'What if famous brands had regular fonts? Meet RegulaBrands!',
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=300&fit=crop',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    likes: 42,
    comments: 8,
    shares: 3,
    category: 'Article',
    isLiked: false,
  },
  {
    id: '2',
    author: mockUsers[1],
    content: 'Tax Benefits for Investment under National Pension Scheme launched by Government',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=300&fit=crop',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    likes: 128,
    comments: 24,
    shares: 15,
    category: 'Education',
    isLiked: true,
  },
  {
    id: '3',
    author: mockUsers[2],
    content: 'Finance & Investment Elite Social Mixer @Lujazui',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    likes: 89,
    comments: 12,
    shares: 6,
    category: 'Meetup',
    isLiked: false,
  },
  {
    id: '4',
    author: mockUsers[3],
    content: 'Software Developer - II position available at Innovation Analytics. Great opportunity for experienced developers!',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    likes: 34,
    comments: 5,
    shares: 2,
    category: 'Job',
    isLiked: false,
  },
];

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchPosts = () => {
      setTimeout(() => {
        setPosts(generateMockPosts());
        setLoading(false);
      }, 500);
    };

    fetchPosts();
  }, []);

  const toggleLike = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  return { posts, loading, toggleLike };
};