'use client'
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  Mail,
  Phone,
  FileText,
  Search,
  ChevronDown,
  ChevronRight,
  Book,
  Users,
  Zap,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Headphones,
  Globe,
  Video,
  Send
} from 'lucide-react';
import Footer from '../Shared/Footer';
import Navbar from '../Shared/Navbar';

const Support = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedFaq, setExpandedFaq] = useState(null);

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
        duration: 0.5
      }
    }
  };

  const supportChannels = [
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat with our support team in real-time",
      availability: "Available 24/7",
      action: "Start Chat",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Get help via email within 24 hours",
      availability: "Response within 24h",
      action: "Send Email",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak directly with our experts",
      availability: "Mon-Fri 9AM-6PM EST",
      action: "Call Now",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Video,
      title: "Video Support",
      description: "Screen share with our technicians",
      availability: "By appointment",
      action: "Schedule Call",
      color: "from-orange-500 to-orange-600"
    }
  ];

  const knowledgeBaseCategories = [
    {
      icon: Zap,
      title: "Getting Started",
      articles: 42,
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: Shield,
      title: "Security & Compliance",
      articles: 38,
      color: "bg-purple-100 text-purple-600"
    },
    {
      icon: Users,
      title: "Account Management",
      articles: 27,
      color: "bg-green-100 text-green-600"
    },
    {
      icon: FileText,
      title: "API Documentation",
      articles: 64,
      color: "bg-orange-100 text-orange-600"
    },
    {
      icon: Globe,
      title: "Integration Guides",
      articles: 31,
      color: "bg-pink-100 text-pink-600"
    },
    {
      icon: HelpCircle,
      title: "Troubleshooting",
      articles: 45,
      color: "bg-red-100 text-red-600"
    }
  ];

  const faqs = [
    {
      category: "general",
      question: "What is IC and how does it work?",
      answer: "IC (Integrated Circuit) solutions provide comprehensive infrastructure management for modern businesses. Our platform integrates security, performance optimization, and cloud infrastructure to deliver seamless digital experiences."
    },
    {
      category: "billing",
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, wire transfers, and ACH payments. Enterprise customers can also request custom billing arrangements."
    },
    {
      category: "technical",
      question: "How do I integrate IC solutions with my existing infrastructure?",
      answer: "Our solutions offer flexible integration options including REST APIs, SDKs for major programming languages, and pre-built connectors for popular platforms. Our technical team can assist with custom integrations."
    },
    {
      category: "security",
      question: "How secure is the IC platform?",
      answer: "We implement enterprise-grade security with end-to-end encryption, SOC 2 Type II compliance, regular security audits, and 24/7 monitoring. All data is encrypted at rest and in transit."
    },
    {
      category: "general",
      question: "What kind of support is included with my plan?",
      answer: "All plans include 24/7 email support and access to our knowledge base. Premium plans add live chat and phone support, while Enterprise plans include dedicated account managers and priority support."
    },
    {
      category: "technical",
      question: "What are the system requirements?",
      answer: "IC solutions are cloud-based and work with any modern web browser. For API integration, we support all major programming languages and frameworks. Mobile apps are available for iOS and Android."
    }
  ];

  const ticketPriorities = [
    { level: "Low", icon: AlertCircle, color: "text-gray-500" },
    { level: "Medium", icon: AlertCircle, color: "text-yellow-500" },
    { level: "High", icon: AlertCircle, color: "text-orange-500" },
    { level: "Critical", icon: AlertCircle, color: "text-red-500" }
  ];

  const filteredFaqs = faqs.filter(faq => 
    activeCategory === 'all' || faq.category === activeCategory
  );

  return (
   <>
   <Navbar></Navbar>
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              How Can We Help You?
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto mb-8">
              Get instant answers, browse our knowledge base, or contact our support team
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative"
              >
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for help articles, documentation, or FAQs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 placeholder-gray-500 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Support Channels */}
      <section className="py-16 -mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {supportChannels.map((channel, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6"
              >
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${channel.color} text-white mb-4`}>
                  <channel.icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{channel.title}</h3>
                <p className="text-gray-600 mb-2">{channel.description}</p>
                <p className="text-sm text-gray-500 mb-4">{channel.availability}</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full py-2 px-4 rounded-lg bg-gradient-to-r ${channel.color} text-white font-semibold hover:shadow-md transition-shadow`}
                >
                  {channel.action}
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Knowledge Base */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Browse Our Knowledge Base
            </h2>
            <p className="text-xl text-gray-600">
              Find detailed guides and documentation to help you get started
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {knowledgeBaseCategories.map((category, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${category.color}`}>
                    <category.icon size={24} />
                  </div>
                  <span className="text-sm text-gray-500">{category.articles} articles</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{category.title}</h3>
                <div className="flex items-center text-blue-600 font-semibold">
                  Browse Articles
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Quick answers to common questions
            </p>

            {/* FAQ Categories */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {['all', 'general', 'billing', 'technical', 'security'].map((category) => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    activeCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </motion.button>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-4"
          >
            <AnimatePresence>
              {filteredFaqs.map((faq, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  layout
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold text-gray-900">{faq.question}</span>
                    <motion.div
                      animate={{ rotate: expandedFaq === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {expandedFaq === index && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-4 text-gray-600">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Submit Ticket */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-2xl p-8 md:p-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Still Need Help? Submit a Ticket
            </h2>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief description of your issue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {ticketPriorities.map((priority, index) => (
                    <label key={index} className="cursor-pointer">
                      <input type="radio" name="priority" className="sr-only" />
                      <div className="flex items-center justify-center p-3 border-2 border-gray-300 rounded-lg hover:border-blue-500 transition-colors">
                        <priority.icon className={`w-5 h-5 mr-2 ${priority.color}`} />
                        <span className="font-medium">{priority.level}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Please describe your issue in detail..."
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center justify-center"
              >
                <Send className="w-5 h-5 mr-2" />
                Submit Ticket
              </motion.button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Status Banner */}
      <section className="py-8 bg-green-50 border-t border-green-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <p className="text-green-800 font-medium">
              All systems operational • Average response time: &lt;2 hours
            </p>
          </div>
        </div>
      </section>
    </div>
   <Footer></Footer>
   </>
  );
};

export default Support;