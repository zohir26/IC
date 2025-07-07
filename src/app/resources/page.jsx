'use client'
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Video, Book, ExternalLink, Search, Filter, ChevronRight, Link } from 'lucide-react';
import Footer from '../Shared/Footer';
import Navbar from '../Shared/Navbar';

const ResourcesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Resources', icon: Filter },
    { id: 'datasheets', name: 'Datasheets', icon: FileText },
    { id: 'appnotes', name: 'Application Notes', icon: Book },
    { id: 'videos', name: 'Video Tutorials', icon: Video },
    { id: 'tools', name: 'Design Tools', icon: Download }
  ];

  const resources = [
    {
      id: 1,
      category: 'datasheets',
      title: 'IC74HC595 8-Bit Shift Register',
      description: 'Complete datasheet with electrical characteristics, timing diagrams, and package information',
      fileSize: '2.4 MB',
      date: '2024-12-15',
      downloadUrl: '#',
      type: 'PDF'
    },
    {
      id: 2,
      category: 'datasheets',
      title: 'LM358 Dual Operational Amplifier',
      description: 'Low-power dual operational amplifiers with internal frequency compensation',
      fileSize: '1.8 MB',
      date: '2024-11-20',
      downloadUrl: '#',
      type: 'PDF'
    },
    {
      id: 3,
      category: 'appnotes',
      title: 'Power Supply Design Guidelines',
      description: 'Best practices for designing efficient and reliable power supply circuits',
      fileSize: '3.2 MB',
      date: '2024-12-01',
      downloadUrl: '#',
      type: 'PDF'
    },
    {
      id: 4,
      category: 'appnotes',
      title: 'EMI/EMC Considerations in PCB Layout',
      description: 'Techniques for minimizing electromagnetic interference in circuit board designs',
      fileSize: '4.1 MB',
      date: '2024-10-28',
      downloadUrl: '#',
      type: 'PDF'
    },
    {
      id: 5,
      category: 'videos',
      title: 'Introduction to MOSFET Operation',
      description: 'Comprehensive video tutorial explaining MOSFET principles and applications',
      duration: '15:30',
      date: '2024-12-10',
      videoUrl: '#',
      type: 'Video'
    },
    {
      id: 6,
      category: 'videos',
      title: 'Signal Integrity Fundamentals',
      description: 'Learn about signal integrity challenges and solutions in high-speed designs',
      duration: '22:45',
      date: '2024-11-15',
      videoUrl: '#',
      type: 'Video'
    },
    {
      id: 7,
      category: 'tools',
      title: 'SPICE Simulator - Free Edition',
      description: 'Professional circuit simulation software for analog and mixed-signal designs',
      fileSize: '156 MB',
      version: 'v2.5.1',
      date: '2024-12-05',
      downloadUrl: '#',
      type: 'Software'
    },
    {
      id: 8,
      category: 'tools',
      title: 'PCB Design Calculator Suite',
      description: 'Collection of calculators for trace width, impedance, and thermal analysis',
      fileSize: '45 MB',
      version: 'v1.3.0',
      date: '2024-11-25',
      downloadUrl: '#',
      type: 'Software'
    }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const getIcon = (category) => {
    switch(category) {
      case 'datasheets': return <FileText className="w-5 h-5" />;
      case 'appnotes': return <Book className="w-5 h-5" />;
      case 'videos': return <Video className="w-5 h-5" />;
      case 'tools': return <Download className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <>
    <Navbar></Navbar>
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-700 py-20"
      >
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-5xl font-bold text-white mb-4">Technical Resources</h1>
          <p className="text-xl text-gray-100 max-w-3xl">
            Access our comprehensive library of datasheets, application notes, video tutorials, and design tools
          </p>
        </div>
        <motion.div
          animate={{ 
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            backgroundSize: '60px 60px'
          }}
        />
      </motion.div>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800 rounded-xl shadow-xl p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <category.icon className="w-4 h-4" />
                  {category.name}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Resources Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredResources.map((resource) => (
            <motion.div
              key={resource.id}
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-gray-800 rounded-xl shadow-lg overflow-hidden group"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${
                    resource.category === 'datasheets' ? 'bg-blue-600' :
                    resource.category === 'appnotes' ? 'bg-purple-600' :
                    resource.category === 'videos' ? 'bg-red-600' :
                    'bg-green-600'
                  } bg-opacity-20`}>
                    {getIcon(resource.category)}
                  </div>
                  <span className="text-xs text-gray-400">{resource.date}</span>
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {resource.title}
                </h3>
                
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {resource.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    {resource.type === 'Video' ? (
                      <span>Duration: {resource.duration}</span>
                    ) : (
                      <span>Size: {resource.fileSize}</span>
                    )}
                    {resource.version && <span className="ml-2">• {resource.version}</span>}
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
                    {resource.type === 'Video' ? (
                      <ExternalLink className="w-4 h-4" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                  </motion.button>
                </div>
              </div>
              
              <motion.div 
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-1"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
                style={{ transformOrigin: 'left' }}
              />
            </motion.div>
          ))}
        </motion.div>

        {filteredResources.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-gray-400 text-lg">No resources found matching your criteria.</p>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-8 text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-4">Need Custom Support?</h2>
          <p className="text-gray-100 mb-6 max-w-2xl mx-auto">
            Our engineering team is ready to help you with your specific design challenges
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/support'}
            className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2 cursor-pointer"
          >
            Contact Technical Support 
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </div>
    <Footer></Footer>
    </>
  );
};

export default ResourcesPage;