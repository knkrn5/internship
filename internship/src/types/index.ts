export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  followers: number;
  following: number;
  posts: number;
}

export interface Post {
  id: string;
  author: User;
  content: string;
  image?: string;
  timestamp: Date;
  likes: number;
  comments: number;
  shares: number;
  category: string;
  tags?: string[];
  isLiked?: boolean;
}

export interface Comment {
  id: string;
  author: User;
  content: string;
  timestamp: Date;
  likes: number;
  replies?: Comment[];
}

export interface Group {
  id: string;
  name: string;
  description: string;
  members: number;
  image: string;
  category: string;
  isJoined?: boolean;
}