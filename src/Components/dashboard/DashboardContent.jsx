import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  Calendar, Download, DollarSign, Cpu, Package, Shield, 
  ArrowUp, ArrowDown 
} from 'lucide-react';

// Sample Data
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

const DashboardContent = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">IC Manufacturing Overview</h1>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm flex items-center">
            <Calendar size={16} className="mr-2" />
            Last 30 days
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm flex items-center">
            <Download size={16} className="mr-2" />
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} stat={stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue & Orders</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={salesData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: 'transparent' }} />
              <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#8884d8" fillOpacity={1} fill="url(#colorRevenue)" />
              <Area yAxisId="right" type="monotone" dataKey="orders" stroke="#82ca9d" fillOpacity={1} fill="url(#colorOrders)" />
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Chips by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chipCategories}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percentage }) => `${name} (${percentage}%)`}
              >
                {chipCategories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name, props) => [`${value} units`, props.payload.name]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Chips Produced</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="chips" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Engagement</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="orders" stroke="#ffc658" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;