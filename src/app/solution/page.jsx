"use client"
import Navbar from '@/Components/Navbar/Navbar';
import React, { useState, useRef } from 'react';
import Footer from '../Shared/Footer';
import emailjs from '@emailjs/browser';
import Swal from 'sweetalert2';

const solutions = () => {
  const form = useRef();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.message) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please fill in all required fields (Name, Email, and Message)',
        confirmButtonColor: '#10b981'
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Email',
        text: 'Please enter a valid email address',
        confirmButtonColor: '#10b981'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare template parameters to match EmailJS template structure
      const templateParams = {
        from_name: formData.name,        // EmailJS service field (who the email is from)
        reply_to: formData.email,        // EmailJS service field (reply-to address)  
        name: formData.name,             // Template variable {{name}}
        email: formData.email,           // Template variable {{email}}
        company: formData.organization || 'Not specified', // Template variable {{company}}
        message: formData.message,       // Template variable {{message}}
        time: new Date().toLocaleString(), // Template variable {{time}}
        subject: `Contact Form Submission from ${formData.name}` // Template variable {{subject}}
      };

      // Send email using EmailJS
      const result = await emailjs.send(
        'service_pqlqfv6',        // Your service ID
        'template_t5wmrsl',       // Your template ID
        templateParams,
        'HOzdPc1wp7Jfl8nCj'    // Replace with your EmailJS public key
      );

      console.log('Email sent successfully:', result);

      // Show success alert
      Swal.fire({
        icon: 'success',
        title: 'Ticket Submitted Successfully!',
        text: 'Thank you for contacting us. We\'ll get back to you within 24 hours.',
        confirmButtonColor: '#10b981',
        timer: 5000,
        timerProgressBar: true
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        organization: '',
        message: ''
      });

    } catch (error) {
      console.error('Failed to send email:', error);
      
      // Show error alert
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: 'There was an error submitting your ticket. Please try again or contact us directly.',
        confirmButtonColor: '#10b981',
        footer: 'If the problem persists, please email us directly.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
   <>
   <Navbar></Navbar>
     <div id='solutions' className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-slate-900/40"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            {/* We Offer Badge */}
            <div className="inline-flex items-center mb-8">
              <div className="relative">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-full font-bold text-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 animate-pulse"></div>
                  <span className="relative z-10">WE OFFER</span>
                  {/* Decorative bubbles */}
                  <div className="absolute -top-2 -left-2 w-4 h-4 bg-cyan-300 rounded-full opacity-60"></div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-300 rounded-full opacity-40"></div>
                  <div className="absolute top-1 -right-3 w-2 h-2 bg-cyan-200 rounded-full opacity-50"></div>
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
              Custom Solutions to Amplify Your Brand Reach and Build an 
              <span className="text-emerald-400 block mt-2">Industry-Leading Global Presence</span>
            </h1>
            
            <div className="bg-emerald-900/40 backdrop-blur-sm rounded-2xl p-8 border border-emerald-700/50 max-w-5xl mx-auto">
              <p className="text-xl md:text-2xl text-slate-200 leading-relaxed">
                We amplify your product's visibility, simplify technical complexity, and connect 
                you with the innovators, engineers, decision-makers and business worldwide.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-20">
        
        {/* Why Leading Brands Choose Us */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              <span className="text-emerald-400">Why</span> Leading Brands Choose Us?
            </h2>
            
            <div className="relative">
              <div className="text-4xl text-emerald-400/30 font-serif absolute -top-4 -left-2">"</div>
              <div className="pl-8 pr-4">
                <p className="text-lg text-slate-300 leading-relaxed italic">
                  Our expertise lies in turning complex technical data into meaningful 
                  insights. By blending marketing strategy with deep semiconductor 
                  knowledge, we ensure that your products stand out as the benchmark of 
                  innovation. We act as your voice in a crowded marketplace, connecting 
                  your brand with an audience actively seeking cutting-edge solutions.
                </p>
              </div>
              <div className="text-4xl text-emerald-400/30 font-serif absolute -bottom-4 -right-2">"</div>
            </div>
            
            {/* Process Timeline */}
            <div className="mt-12">
              <div className="flex flex-wrap justify-center items-center gap-4 text-center">
                {[
                  { step: "Research", icon: "🔍" },
                  { step: "Storytelling", icon: "📖" },
                  { step: "Market Insight", icon: "📊" },
                  { step: "Consumer Guidance", icon: "🎯" }
                ].map((item, index) => (
                  <React.Fragment key={index}>
                    <div className="bg-emerald-900/30 rounded-xl p-4 border border-emerald-700/50 min-w-[140px]">
                      <div className="text-2xl mb-2">{item.icon}</div>
                      <div className="text-emerald-200 font-semibold">{item.step}</div>
                    </div>
                    {index < 3 && (
                      <div className="hidden md:block text-emerald-400 text-2xl">→</div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* How We Add Value Section */}
        <div>
          <h2 className="text-4xl font-bold text-white mb-12 text-center">
            <span className="text-emerald-400">How</span> We Add Value
          </h2>
          <div className="text-center mb-8">
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              We deliver world-class marketing solutions designed to 
              showcase semiconductor products with precision:
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                ),
                title: "Product Highlighting",
                description: "Presenting each component's unique strengths and applications."
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                ),
                title: "Expert Analysis & Opinion",
                description: "Providing unbiased technical reviews that position products as industry benchmarks."
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                title: "Comparison & Evaluation Tools",
                description: "Helping engineers and companies identify the best-fit solutions through side-by-side analysis."
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: "Brand Positioning & Visibility",
                description: "Ensuring partner brands become recognized to innovators and become global market leaders."
              }
            ].map((service, index) => (
              <div key={index} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-emerald-500/50 transition-colors group">
                <div className="text-emerald-400 mb-4 group-hover:text-emerald-300 transition-colors">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-emerald-100 transition-colors">
                  {service.title}
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* What You Gain With Us Section */}
        <div className="bg-gradient-to-r from-slate-800/80 to-emerald-900/40 backdrop-blur-sm rounded-2xl p-12 border border-slate-700/50">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-6">
              <span className="text-emerald-400">What You Gain</span> With Us
            </h2>
            <p className="text-2xl text-emerald-200 font-medium">
              Your Innovation Deserves the Spotlight
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                ),
                title: "Expert-driven product recommendations that build trust"
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ),
                title: "Increased visibility among engineers and tech decision-makers"
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                ),
                title: "A platform dedicated exclusively to semiconductor innovation"
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                title: "In-depth market comparisons highlighting product advantages"
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                ),
                title: "Stronger engagement through expert reviews and analysis"
              }
            ].map((benefit, index) => (
              <div key={index} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-emerald-500/50 transition-colors group">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400 group-hover:text-emerald-300 transition-colors">
                      {benefit.icon}
                    </div>
                  </div>
                  <div>
                    <p className="text-slate-300 leading-relaxed group-hover:text-slate-200 transition-colors">
                      {benefit.title}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Connect With Us - Call to Action */}
        <div className="text-center bg-emerald-900/30 backdrop-blur-sm rounded-2xl p-12 border border-emerald-700/50">
          <h3 className="text-3xl font-bold text-white mb-6">
            Connect With Us - <span className="text-emerald-400">"Discover Our Approach"</span>
          </h3>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Ready to amplify your semiconductor innovation and build an industry-leading global presence?
          </p>
          
          {/* Contact Form Section */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 max-w-2xl mx-auto border border-slate-700/50">
            <h4 className="text-xl font-semibold text-white mb-6">Submit a Ticket</h4>
            
            <form ref={form} onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your Name *"
                  className="bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none transition-colors"
                  required
                />
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email Address *"
                  className="bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none transition-colors"
                  required
                />
              </div>
              
              <select 
                name="organization"
                value={formData.organization}
                onChange={handleInputChange}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-emerald-500 focus:outline-none transition-colors"
              >
                <option value="">Select Your Organization Type</option>
                <option value="Semiconductor Manufacturer">Semiconductor Manufacturer</option>
                <option value="Tech Startup">Tech Startup</option>
                <option value="Enterprise Company">Enterprise Company</option>
                <option value="Research Institution">Research Institution</option>
                <option value="Other">Other</option>
              </select>
              
              <textarea 
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows="4"
                placeholder="Tell us about your project or how we can help... *"
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none transition-colors resize-none"
                required
              ></textarea>
              
              <button 
                type="submit"
                disabled={isSubmitting}
                className={`w-full font-semibold px-8 py-4 rounded-lg transition-all text-lg relative overflow-hidden ${
                  isSubmitting 
                    ? 'bg-emerald-700 cursor-not-allowed' 
                    : 'bg-emerald-600 hover:bg-emerald-500 hover:scale-105'
                } text-white`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </div>
                ) : (
                  'Submit Ticket'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
   <Footer></Footer>
   </>
  );
};

export default solutions;