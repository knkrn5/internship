import React from "react";
import {
  Users,
  Calendar,
  BookOpen,
  Briefcase,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { Link } from "react-router-dom";

interface SidebarProps {
  isLoggedIn?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isLoggedIn = true }) => {
  const menuItems = [
    { icon: Users, label: "Groups", count: 5, active: true },
    { icon: Calendar, label: "Events", count: 3 },
    { icon: BookOpen, label: "Education", count: 8 },
    { icon: Briefcase, label: "Jobs", count: 12 },
  ];

  const accountItems = [
    { icon: User, label: "Profile" },
    { icon: Settings, label: "Settings" },
    { icon: LogOut, label: "Logout" },
  ];

  // if (!isLoggedIn) {
  //   return null;
  // }

  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:pt-16 lg:bg-white lg:border-r lg:border-gray-200">
      <div className="flex-1 flex flex-col min-h-0 pt-4">
        <div className="flex-1 flex flex-col pb-4 overflow-y-auto">
          <nav className="mt-5 flex-1 px-4 space-y-1">
            {/* Main Navigation */}
            <div className="space-y-1">
              {menuItems.map((item) => (
                <a
                  key={item.label}
                  href="#"
                  className={`${
                    item.active
                      ? "bg-blue-50 border-r-2 border-blue-500 text-blue-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  } group flex items-center px-4 py-3 text-sm font-medium rounded-l-lg transition-colors duration-200`}
                >
                  <item.icon
                    className={`${
                      item.active
                        ? "text-blue-500"
                        : "text-gray-400 group-hover:text-gray-500"
                    } mr-3 h-6 w-6`}
                  />
                  <span className="flex-1">{item.label}</span>
                  {item.count && (
                    <span
                      className={`${
                        item.active
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-100 text-gray-600"
                      } ml-3 inline-block py-0.5 px-3 text-xs font-medium rounded-full`}
                    >
                      {item.count}
                    </span>
                  )}
                </a>
              ))}
            </div>

            {/* Separator */}
            <div className="border-t border-gray-200 my-4"></div>

            {/* Account Section */}
            <div className="space-y-1">
              <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Account
              </h3>
              {accountItems.map((item) => (
                <a
                  key={item.label}
                  href="#"
                  className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
                >
                  <item.icon className="text-gray-400 group-hover:text-gray-500 mr-3 h-5 w-5" />
                  {item.label}
                </a>
              ))}
            </div>
          </nav>
        </div>

        {/* User Profile Card */}
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <div className="flex items-center">
            <div>
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-gray-600" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">
                {isLoggedIn ? "John Doe" : "Guest"}
              </p>
              {isLoggedIn ? (
                <button
                  type="button"
                  className="text-xs font-medium text-gray-500"
                >
                  View profile
                </button>
              ) : (
                <Link
                  to="/signup"
                  className=" text-blue-500 hover:bg-gray-300 font-medium  rounded-lg transition-colors duration-200 cursor-pointer"
                >
                  Create Account
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
