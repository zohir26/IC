"use client"
import Link from 'next/link';
import { FiFacebook, FiLinkedin, FiPhone, FiMapPin, FiMail, FiArrowUp } from 'react-icons/fi';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-100 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
                <span className="text-white font-bold text-lg">NS</span>
              </div>
              <span className="text-lg font-bold text-gray-800 leading-tight">
                NEURAL SEMICONDUCTOR
              </span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Neural Semiconductor Limited is one of the fastest growing semiconductor 
              companies in Bangladesh by providing VLSI Design and Software Services 
              to several Global Semiconductor Manufacturing companies.
            </p>
            
            {/* Social Media */}
            <div className="mb-6">
              <h4 className="text-blue-600 font-bold text-sm uppercase tracking-wide mb-4">
                SOCIAL MEDIA
              </h4>
              <div className="flex space-x-3">
                <Link 
                  href="#" 
                  className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
                  aria-label="Facebook"
                >
                  <FiFacebook size={18} />
                </Link>
                <Link 
                  href="#" 
                  className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
                  aria-label="LinkedIn"
                >
                  <FiLinkedin size={18} />
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1">
            <h3 className="text-blue-600 font-bold text-sm uppercase tracking-wide mb-6">
              QUICK LINKS
            </h3>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={scrollToTop}
                  className="text-blue-600 hover:text-blue-700 transition-colors duration-200 flex items-center text-sm font-medium"
                >
                  <FiArrowUp className="mr-2" size={14} />
                  BACK TO TOP
                </button>
              </li>
              <li>
                <Link 
                  href="#" 
                  className="text-blue-600 hover:text-blue-700 transition-colors duration-200 text-sm font-medium block"
                >
                  HOME
                </Link>
              </li>
              <li>
                <Link 
                  href="#" 
                  className="text-blue-600 hover:text-blue-700 transition-colors duration-200 text-sm font-medium block"
                >
                  SEMICONDUCTOR
                </Link>
              </li>
              <li>
                <Link 
                  href="#" 
                  className="text-blue-600 hover:text-blue-700 transition-colors duration-200 text-sm font-medium block"
                >
                  SOFTWARE
                </Link>
              </li>
            </ul>
          </div>

          {/* Others */}
          <div className="lg:col-span-1">
            <h3 className="text-blue-600 font-bold text-sm uppercase tracking-wide mb-6">
              OTHERS
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="#" 
                  className="text-blue-600 hover:text-blue-700 transition-colors duration-200 text-sm font-medium block"
                >
                  ABOUT US
                </Link>
              </li>
              <li>
                <Link 
                  href="#" 
                  className="text-blue-600 hover:text-blue-700 transition-colors duration-200 text-sm font-medium block"
                >
                  WE ARE HIRING!
                </Link>
              </li>
              <li>
                <Link 
                  href="#" 
                  className="text-blue-600 hover:text-blue-700 transition-colors duration-200 text-sm font-medium block"
                >
                  EVENTS
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="lg:col-span-1">
            <h3 className="text-blue-600 font-bold text-sm uppercase tracking-wide mb-6">
              CONTACT INFORMATION
            </h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                  <FiPhone className="text-white" size={14} />
                </div>
                <Link 
                  href="tel:+8801708151698" 
                  className="text-gray-700 hover:text-blue-600 transition-colors duration-200 text-sm"
                >
                  +8801708151698
                </Link>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                  <FiMapPin className="text-white" size={14} />
                </div>
                <span className="text-gray-700 text-sm leading-relaxed">
                  House 5/B, Sector-3, Road-13,Uttara
                </span>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                  <FiMail className="text-white" size={14} />
                </div>
                <div className="space-y-2">
                  <Link 
                    href="mailto:info@neural-semiconductor.com" 
                    className="text-gray-700 hover:text-blue-600 transition-colors duration-200 text-sm block"
                  >
                    info@neural-semiconductor.com
                  </Link>
                  <Link 
                    href="mailto:sales.global@neural-semiconductor.com" 
                    className="text-gray-700 hover:text-blue-600 transition-colors duration-200 text-sm block"
                  >
                    sales.global@neural-semiconductor.com
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-300">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm mb-4 md:mb-0">
              © 2024 Neural Semiconductor Limited. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link 
                href="#" 
                className="text-gray-600 hover:text-blue-600 transition-colors duration-200 text-sm"
              >
                Privacy Policy
              </Link>
              <Link 
                href="#" 
                className="text-gray-600 hover:text-blue-600 transition-colors duration-200 text-sm"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}