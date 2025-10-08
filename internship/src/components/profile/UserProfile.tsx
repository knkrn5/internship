import React from "react";
import { User, Mail, Calendar, Shield, Edit } from "lucide-react";

interface UserProfileProps {
  userData: {
    firstName: string;
    lastName: string;
    email: string;
  };
  isLoggedIn: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({ userData, isLoggedIn }) => {
  if (!isLoggedIn) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto mt-8">
        <div className="text-center py-12">
          <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Not Logged In
          </h3>
          <p className="text-gray-500">
            Please log in to view your profile
          </p>
        </div>
      </div>
    );
  }

  const { firstName, lastName, email } = userData;
  const fullName = `${firstName} ${lastName ? lastName : ""}`.trim() || "User";
  const initials = `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "U";

  return (
    <div className="bg-white rounded-2xl shadow-lg max-w-2xl mx-auto mt-8 overflow-hidden">
      {/* Header Section with Gradient Background */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32"></div>

      {/* Profile Content */}
      <div className="px-8 pb-8">
        {/* Avatar and Edit Button */}
        <div className="flex items-end justify-between -mt-16 mb-6">
          <div className="flex items-end space-x-4">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">
                    {initials}
                  </span>
                </div>
              </div>
              <div className="absolute bottom-2 right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-white"></div>
            </div>
          </div>

          {/* Edit Profile Button */}
          <button className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 flex items-center space-x-2">
            <Edit className="h-4 w-4" />
            <span>Edit Profile</span>
          </button>
        </div>

        {/* User Info */}
        <div className="space-y-4">
          {/* Name */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{fullName}</h1>
            <p className="text-gray-500 mt-1">Welcome back!</p>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-6"></div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div className="flex items-start space-x-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Mail className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 font-medium">Email</p>
                <p className="text-gray-900 font-medium break-all">{email}</p>
              </div>
            </div>

            {/* First Name */}
            <div className="flex items-start space-x-3">
              <div className="bg-purple-100 p-3 rounded-lg">
                <User className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 font-medium">First Name</p>
                <p className="text-gray-900 font-medium">
                  {firstName || "Not set"}
                </p>
              </div>
            </div>

            {/* Last Name */}
            <div className="flex items-start space-x-3">
              <div className="bg-green-100 p-3 rounded-lg">
                <User className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 font-medium">Last Name</p>
                <p className="text-gray-900 font-medium">
                  {lastName || "Not set"}
                </p>
              </div>
            </div>

            {/* Account Status */}
            <div className="flex items-start space-x-3">
              <div className="bg-green-100 p-3 rounded-lg">
                <Shield className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 font-medium">Status</p>
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Member Since */}
            <div className="flex items-start space-x-3">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Calendar className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 font-medium">Member Since</p>
                <p className="text-gray-900 font-medium">
                  {new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="border-t border-gray-200 mt-8 pt-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-2xl font-bold text-gray-900">0</p>
                <p className="text-sm text-gray-500 mt-1">Posts</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-2xl font-bold text-gray-900">0</p>
                <p className="text-sm text-gray-500 mt-1">Followers</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-2xl font-bold text-gray-900">0</p>
                <p className="text-sm text-gray-500 mt-1">Following</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
