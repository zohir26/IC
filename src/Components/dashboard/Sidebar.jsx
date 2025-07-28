import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, X, Home, Package, Layers, Building2, BookOpen, 
  Plus, Settings 
} from 'lucide-react';

const iconMap = {
  Home,
  Package,
  Layers,
  Building2,
  BookOpen,
  Plus,
  Settings,
};

const Sidebar = ({ 
  sidebarOpen, 
  setSidebarOpen, 
  navigation, 
  activeTab, 
  onTabChange, 
  session 
}) => {
  return (
    <AnimatePresence>
      {sidebarOpen && (
        <motion.div
          initial={{ x: -250 }}
          animate={{ x: 0 }}
          exit={{ x: -250 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl lg:static lg:inset-0 border-r border-gray-200"
        >
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <div className="flex items-center">
              <Cpu className="h-8 w-8 text-blue-600 mr-2" />
              <h1 className="text-xl font-bold text-gray-800">IC Dashboard</h1>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>
          
          <nav className="mt-8 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 300px)' }}>
            {navigation.map((item) => {
              const IconComponent = iconMap[item.icon];
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {IconComponent && <IconComponent size={20} className="mr-3" />}
                  {item.name}
                </button>
              );
            })}
          </nav>

          {/* Admin User Info - Fixed at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 bg-white">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                {session?.user?.name?.charAt(0) || 'A'}
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 truncate">{session?.user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{session?.user?.email}</p>
                <p className="text-xs text-blue-600 font-medium">Admin</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;