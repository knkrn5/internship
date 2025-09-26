import React from 'react';
import { Users, User, MapPin, Calendar } from 'lucide-react';

interface RightSidebarProps {
  isLoggedIn?: boolean;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ isLoggedIn = false }) => {
  const recommendations = [
    {
      id: '1',
      name: 'Sarah West',
      title: 'UI/UX Designer',
      company: 'Tech Corp',
      mutualConnections: 12,
      avatar: null,
    },
    {
      id: '2',
      name: 'John Smith',
      title: 'Software Developer',
      company: 'StartupXYZ',
      mutualConnections: 8,
      avatar: null,
    },
    {
      id: '3',
      name: 'Maria Garcia',
      title: 'Product Manager',
      company: 'Innovation Labs',
      mutualConnections: 15,
      avatar: null,
    },
  ];

  const upcomingEvents = [
    {
      id: '1',
      title: 'Tax Benefits for Investment under National Pension Scheme launched by Government',
      date: '2024-09-28',
      attendees: 45,
      location: 'Virtual',
    },
    {
      id: '2',
      title: 'Finance & Investment Elite Social Mixer @Lujazui',
      date: '2024-10-02',
      attendees: 120,
      location: 'Ahmedabad, India',
    },
  ];

  const jobs = [
    {
      id: '1',
      title: 'Software Developer - II',
      company: 'Innovation Analytics',
      location: 'Noida, India',
      type: 'Full-time',
      applicants: 89,
    },
  ];

  if (!isLoggedIn) {
    return null;
  }

  return (
    <aside className="hidden xl:flex xl:w-80 xl:flex-col xl:fixed xl:right-0 xl:inset-y-0 xl:pt-16">
      <div className="flex-1 flex flex-col min-h-0 pt-4 pr-4">
        <div className="flex-1 flex flex-col pb-4 overflow-y-auto space-y-6">
          
          {/* People You May Know */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Add to your feed</h3>
            </div>
            <div className="p-4 space-y-4">
              {recommendations.map((person) => (
                <div key={person.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {person.avatar ? (
                      <img
                        src={person.avatar}
                        alt={person.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-600" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{person.name}</p>
                    <p className="text-xs text-gray-500">{person.title}</p>
                    <p className="text-xs text-gray-500">{person.company}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {person.mutualConnections} mutual connections
                    </p>
                    <div className="mt-2 flex space-x-2">
                      <button className="px-3 py-1 text-xs font-medium text-blue-600 border border-blue-600 rounded-full hover:bg-blue-50 transition-colors">
                        Follow
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <button className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium py-2">
                View all recommendations
              </button>
            </div>
          </div>

          {/* Recent Events */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            </div>
            <div className="p-4 space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="space-y-2">
                  <div className="flex items-center space-x-2 text-xs text-blue-600">
                    <span className="font-medium">📋 Education</span>
                  </div>
                  <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                    {event.title}
                  </h4>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Users className="w-3 h-3" />
                    <span>{event.attendees} attendees</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Jobs */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Jobs for you</h3>
            </div>
            <div className="p-4 space-y-4">
              {jobs.map((job) => (
                <div key={job.id} className="space-y-2">
                  <div className="flex items-center space-x-2 text-xs text-green-600">
                    <span className="font-medium">💼 Job</span>
                  </div>
                  <h4 className="text-sm font-medium text-gray-900">{job.title}</h4>
                  <p className="text-xs text-gray-600">{job.company}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>{job.location}</span>
                    </div>
                    <span>{job.type}</span>
                  </div>
                  <p className="text-xs text-gray-500">{job.applicants} applicants</p>
                  <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                    Apply on Timesjobs
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;