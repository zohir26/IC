'use client'
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Zap, 
  Users, 
  BarChart3, 
  Cloud, 
  Lock,
  ArrowRight,
  Check
} from 'lucide-react';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../Shared/Footer';

const solutions = () => {
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

  const solutions = [
    {
      icon: Shield,
      title: "Security Solutions",
      description: "Enterprise-grade security infrastructure to protect your digital assets and ensure compliance.",
      features: [
        "End-to-end encryption",
        "Multi-factor authentication",
        "Real-time threat monitoring",
        "Compliance management"
      ],
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Zap,
      title: "Performance Optimization",
      description: "Accelerate your applications with our cutting-edge performance solutions.",
      features: [
        "CDN integration",
        "Load balancing",
        "Caching strategies",
        "Database optimization"
      ],
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Cloud,
      title: "Cloud Infrastructure",
      description: "Scalable cloud solutions that grow with your business needs.",
      features: [
        "Auto-scaling",
        "Container orchestration",
        "Serverless architecture",
        "Multi-cloud support"
      ],
      color: "from-cyan-500 to-cyan-600"
    },
    {
      icon: BarChart3,
      title: "Analytics & Insights",
      description: "Data-driven insights to make informed business decisions.",
      features: [
        "Real-time analytics",
        "Custom dashboards",
        "Predictive modeling",
        "Data visualization"
      ],
      color: "from-green-500 to-green-600"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Enhanced collaboration tools for distributed teams.",
      features: [
        "Real-time communication",
        "Project management",
        "Document sharing",
        "Video conferencing"
      ],
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: Lock,
      title: "Compliance & Governance",
      description: "Stay compliant with industry regulations and standards.",
      features: [
        "GDPR compliance",
        "SOC 2 certification",
        "Audit trails",
        "Policy management"
      ],
      color: "from-red-500 to-red-600"
    }
  ];

  return (
  <>
  <Navbar></Navbar>
    <div className=" bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 opacity-70"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-30 pb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Innovative Solutions for
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Modern Challenges
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Discover our comprehensive suite of solutions designed to transform your business 
              and drive growth in the digital age.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              Get Started Today
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Solutions Grid */}
      {/* <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {solutions.map((solution, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-10 rounded-bl-full"
                  style={{
                    backgroundImage: `linear-gradient(to bottom right, ${solution.color.split(' ')[1].replace('to-', '')}, ${solution.color.split(' ')[3]})`
                  }}
                ></div>
                
                <div className="p-8">
                  <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${solution.color} text-white mb-4`}>
                    <solution.icon size={24} />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {solution.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6">
                    {solution.description}
                  </p>
                  
                  <ul className="space-y-2 mb-6">
                    {solution.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-700">
                        <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <motion.a
                    href="#"
                    className="inline-flex items-center text-blue-600 font-semibold group-hover:text-blue-700"
                    whileHover={{ x: 5 }}
                  >
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </motion.a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section> */}

      {/* CTA Section */}
      {/* <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of companies that trust our solutions to power their success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                Schedule a Demo
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300"
              >
                Contact Sales
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section> */}

      {/* Features Comparison */}
      {/* <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Solutions?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide comprehensive features that set us apart from the competition.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                title: "24/7 Support",
                description: "Round-the-clock assistance from our expert team",
                icon: "🎯"
              },
              {
                title: "99.9% Uptime",
                description: "Industry-leading reliability you can count on",
                icon: "⚡"
              },
              {
                title: "Global Scale",
                description: "Solutions that grow with your business worldwide",
                icon: "🌍"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="text-center p-8 bg-gray-50 rounded-2xl"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section> */}
    </div>
    <Footer></Footer>
    </>
  );
};

export default solutions;