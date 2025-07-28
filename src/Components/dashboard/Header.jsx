import React from 'react';
import Link from 'next/link';
import { 
  Menu, Search, Bell, ChevronDown, User, LogOut, Home 
} from 'lucide-react';

const Header = ({ 
  sidebarOpen, 
  setSidebarOpen, 
  dropdownOpen, 
  setDropdownOpen, 
  session, 
  signOut 
}) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md hover:bg-gray-100 lg:hidden"
          >
            <Menu size={20} />
          </button>
          
          <div className="ml-4 flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products, categories, blogs..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-400 hover:text-gray-600 relative">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>
          
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                {session?.user?.name?.charAt(0) || 'A'}
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">
                {session?.user?.name}
              </span>
              <ChevronDown size={16} />
            </button>
            
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white text-sm rounded-lg shadow-xl z-50 p-4 space-y-2">
                <p className="text-gray-800 font-semibold">{session?.user?.name}</p>
                <p className="text-gray-600">{session?.user?.email}</p>
                <p className="text-blue-600 font-medium">Administrator</p>
                <hr className="my-2" />
                <Link href="/profile" className="block text-gray-700 hover:text-blue-600 hover:underline py-1">
                  <User size={14} className="inline mr-2" />
                  Profile Settings
                </Link>
                <Link href="/dashboard" className="block text-blue-600 hover:underline py-1">
                  <Home size={14} className="inline mr-2" />
                  Dashboard Home
                </Link>
                <hr className="my-2" />
                <button
                  onClick={() => signOut()}
                  className="w-full text-left text-red-600 hover:text-red-800 py-1"
                >
                  <LogOut size={14} className="inline mr-2" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;