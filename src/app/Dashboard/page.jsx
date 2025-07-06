'use client'
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import {
  Home, Users, ShoppingCart, TrendingUp, Settings, Bell, Search,
  Menu, X, ChevronDown, User, LogOut, Mail, Calendar, DollarSign,
  Activity, Eye, Download, Filter, MoreVertical, Edit, Trash2,
  Plus, ArrowUp, ArrowDown, Star, Heart, MessageSquare, Cpu,
  Zap, BarChart3, Package, Layers, Shield, AlertTriangle
} from 'lucide-react';

// Sample Data for IC Business
const salesData = [
  { name: 'Jan', revenue: 45000, orders: 120, chips: 2400 },
  { name: 'Feb', revenue: 52000, orders: 140, chips: 2800 },
  { name: 'Mar', revenue: 48000, orders: 130, chips: 2600 },
  { name: 'Apr', revenue: 61000, orders: 165, chips: 3300 },
  { name: 'May', revenue: 55000, orders: 150, chips: 3000 },
  { name: 'Jun', revenue: 67000, orders: 180, chips: 3600 },
];

const chipCategories = [
  { name: 'Microprocessors', value: 400, color: '#8884d8', percentage: 35 },
  { name: 'Memory Chips', value: 300, color: '#82ca9d', percentage: 26 },
  { name: 'Power Management', value: 200, color: '#ffc658', percentage: 18 },
  { name: 'RF/Wireless', value: 150, color: '#ff7300', percentage: 13 },
  { name: 'Others', value: 100, color: '#8dd1e1', percentage: 8 },
];

const recentOrders = [
  { 
    id: 1, 
    customer: 'TechCorp Industries', 
    product: 'ARM Cortex-M4 MCU', 
    quantity: 1000,
    amount: '$12,500', 
    status: 'Completed', 
    date: '2024-01-15',
    chipType: 'Microprocessor'
  },
  { 
    id: 2, 
    customer: 'IoT Solutions Ltd', 
    product: 'ESP32-S3 WiFi Module', 
    quantity: 500,
    amount: '$3,750', 
    status: 'Processing', 
    date: '2024-01-14',
    chipType: 'RF/Wireless'
  },
  { 
    id: 3, 
    customer: 'Automotive Systems', 
    product: 'CAN Controller IC', 
    quantity: 2000,
    amount: '$8,000', 
    status: 'Shipped', 
    date: '2024-01-13',
    chipType: 'Automotive'
  },
  { 
    id: 4, 
    customer: 'Mobile Tech Corp', 
    product: 'LPDDR5 Memory', 
    quantity: 300,
    amount: '$15,600', 
    status: 'Pending', 
    date: '2024-01-12',
    chipType: 'Memory'
  },
  { 
    id: 5, 
    customer: 'Power Electronics', 
    product: 'DC-DC Converter IC', 
    quantity: 800,
    amount: '$4,200', 
    status: 'Cancelled', 
    date: '2024-01-11',
    chipType: 'Power Management'
  },
];

const ICDashboard = () => {
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Admin email check
  const isAdmin = session?.user?.email === "tanvir@gmail.com";

  // Redirect if not admin
  useEffect(() => {
    if (status === 'loading') return; // Still loading
    if (!session) {
      signIn(); // Redirect to sign in
      return;
    }
    if (!isAdmin) {
      // Redirect non-admin users
      window.location.href = '/unauthorized';
      return;
    }
  }, [session, status, isAdmin]);

  // Loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md">
          <Cpu className="mx-auto h-12 w-12 text-blue-600 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">IC Dashboard Access</h2>
          <p className="text-gray-600 mb-6">Please sign in to access the integrated circuits dashboard.</p>
          <button
            onClick={() => signIn()}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  // Not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md">
          <Shield className="mx-auto h-12 w-12 text-red-600 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">You don't have permission to access this dashboard.</p>
          <div className="space-y-3">
            <Link href="/" className="block w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Go to Homepage
            </Link>
            <button
              onClick={() => signOut()}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Navigation items for IC business
  const navigation = [
    { name: 'Dashboard', icon: Home, id: 'dashboard' },
    { name: 'Analytics', icon: BarChart3, id: 'analytics' },
    { name: 'Chip Inventory', icon: Cpu, id: 'inventory' },
    { name: 'Orders', icon: Package, id: 'orders' },
    { name: 'Customers', icon: Users, id: 'customers' },
    { name: 'Quality Control', icon: Shield, id: 'quality' },
    { name: 'Settings', icon: Settings, id: 'settings' },
  ];

  // Stats for IC business
  const stats = [
    {
      title: 'Total Revenue',
      value: '$328,450',
      change: '+22.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'bg-emerald-500',
      description: 'Monthly revenue from IC sales'
    },
    {
      title: 'Chips Manufactured',
      value: '18,250',
      change: '+15.3%',
      trend: 'up',
      icon: Cpu,
      color: 'bg-blue-500',
      description: 'Total chips produced this month'
    },
    {
      title: 'Active Orders',
      value: '1,847',
      change: '+8.2%',
      trend: 'up',
      icon: Package,
      color: 'bg-purple-500',
      description: 'Orders in processing/shipping'
    },
    {
      title: 'Quality Score',
      value: '99.2%',
      change: '+0.8%',
      trend: 'up',
      icon: Shield,
      color: 'bg-orange-500',
      description: 'Average quality control rating'
    },
  ];

  // Sidebar Component
  const Sidebar = () => (
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
          
          <nav className="mt-8">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon size={20} className="mr-3" />
                {item.name}
              </button>
            ))}
          </nav>

          {/* Admin User Info */}
          <div className="absolute bottom-0 w-full p-6 border-t border-gray-200">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                {session.user.name?.charAt(0) || 'A'}
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-700 truncate">{session.user.name}</p>
                <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
                <p className="text-xs text-blue-600 font-medium">Admin</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Header Component
  const Header = () => (
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
                placeholder="Search chips, orders, customers..."
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
                {session.user.name?.charAt(0) || 'A'}
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">
                {session.user.name}
              </span>
              <ChevronDown size={16} />
            </button>
            
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white text-sm rounded-lg shadow-xl z-50 p-4 space-y-2">
                <p className="text-gray-800 font-semibold">{session.user.name}</p>
                <p className="text-gray-600">{session.user.email}</p>
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

  // Stats Card Component
  const StatsCard = ({ stat }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{stat.title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
          <div className="flex items-center mt-2">
            {stat.trend === 'up' ? (
              <ArrowUp className="text-emerald-500" size={16} />
            ) : (
              <ArrowDown className="text-red-500" size={16} />
            )}
            <span className={`text-sm ml-1 font-medium ${
              stat.trend === 'up' ? 'text-emerald-500' : 'text-red-500'
            }`}>
              {stat.change}
            </span>
            <span className="text-sm text-gray-500 ml-2">vs last month</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
        </div>
        <div className={`p-3 rounded-full ${stat.color}`}>
          <stat.icon className="text-white" size={24} />
        </div>
      </div>
    </motion.div>
  );

  // Dashboard Content
  const DashboardContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">IC Manufacturing Overview</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} stat={stat} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue & Production Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Revenue & Production</h3>
            <div className="flex space-x-2 text-xs">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                <span>Revenue</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-emerald-500 rounded-full mr-1"></div>
                <span>Chips Produced</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} />
              <Area type="monotone" dataKey="chips" stroke="#10B981" fill="#10B981" fillOpacity={0.1} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Chip Categories Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Chip Categories</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chipCategories}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                dataKey="value"
              >
                {chipCategories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {chipCategories.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2`} style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent IC Orders</h3>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                <Filter size={14} className="inline mr-1" />
                Filter
              </button>
              <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                <Download size={14} className="inline mr-1" />
                Export
              </button>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Cpu size={16} className="text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{order.customer}</div>
                        <div className="text-xs text-gray-500">{order.chipType}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.product}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.quantity.toLocaleString()} units
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      order.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                      order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'Shipped' ? 'bg-purple-100 text-purple-800' :
                      order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye size={16} />
                      </button>
                      <button className="text-emerald-600 hover:text-emerald-900">
                        <Edit size={16} />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Other content components remain similar but with IC-specific data...
  const AnalyticsContent = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">IC Manufacturing Analytics</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Production Trends</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="chips" stroke="#3B82F6" strokeWidth={3} name="Chips Produced" />
            <Line type="monotone" dataKey="orders" stroke="#10B981" strokeWidth={3} name="Orders" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="text-md font-semibold text-gray-900 mb-2">Production Efficiency</h4>
          <p className="text-2xl font-bold text-blue-600">94.7%</p>
          <p className="text-sm text-gray-500">+3.2% from last month</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="text-md font-semibold text-gray-900 mb-2">Defect Rate</h4>
          <p className="text-2xl font-bold text-red-600">0.8%</p>
          <p className="text-sm text-gray-500">-0.3% from last month</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="text-md font-semibold text-gray-900 mb-2">Time to Market</h4>
          <p className="text-2xl font-bold text-emerald-600">14.2 days</p>
          <p className="text-sm text-gray-500">-1.8 days from last month</p>
        </div>
      </div>
    </div>
  );

  // Render Content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent />;
      case 'analytics':
        return <AnalyticsContent />;
      case 'inventory':
        return <div className="text-center py-20"><Cpu className="mx-auto h-16 w-16 text-gray-400 mb-4" /><p className="text-gray-500">Chip Inventory Management - Coming Soon</p></div>;
      case 'orders':
        return <div className="text-center py-20"><Package className="mx-auto h-16 w-16 text-gray-400 mb-4" /><p className="text-gray-500">Order Management - Coming Soon</p></div>;
      case 'customers':
        return <div className="text-center py-20"><Users className="mx-auto h-16 w-16 text-gray-400 mb-4" /><p className="text-gray-500">Customer Management - Coming Soon</p></div>;
      case 'quality':
        return <div className="text-center py-20"><Shield className="mx-auto h-16 w-16 text-gray-400 mb-4" /><p className="text-gray-500">Quality Control - Coming Soon</p></div>;
      case 'settings':
        return <div className="text-center py-20"><Settings className="mx-auto h-16 w-16 text-gray-400 mb-4" /><p className="text-gray-500">Settings - Coming Soon</p></div>;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-6 py-8">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ICDashboard;