'use client'
import Navbar from '@/Components/Navbar/Navbar';
import React from 'react';
import Footer from '../Shared/Footer';
import { useRouter } from 'next/navigation';

const About = () => {
  const router = useRouter();

  const handlePartnerWithUs = () => {
   router.push('/solution#submit-ticket');
    // Small delay to ensure page loads before scrolling
    // setTimeout(() => {
    //   const element = document.getElementById('submit-ticket');
    //   if (element) {
    //     element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    //   }
    // }, 100);
  };

  return (
 <>
 <Navbar></Navbar>
   <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-slate-900/40"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              REDWOOD
              <span className="block text-emerald-400 text-3xl md:text-4xl font-light tracking-widest mt-2">
                Analytics and Intelligence
              </span>
            </h1>
            <div className="relative">
              <div className="text-6xl text-emerald-400/30 font-serif absolute -top-8 -left-4">"</div>
              <p className="text-2xl md:text-3xl text-slate-300 italic font-light max-w-4xl mx-auto leading-relaxed">
                Connecting Innovators, Empowering Decisions
              </p>
              <div className="text-6xl text-emerald-400/30 font-serif absolute -bottom-8 -right-4">"</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-20">
        
        {/* Introduction */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-lg text-slate-300 leading-relaxed">
              Redwood Analytics and Intelligence is a knowledge hub dedicated to the global semiconductor 
              industry. We feature a comprehensive collection of components — from ICs and memory chips to 
              microcontrollers and next-gen semiconductor technologies — sourced from world-leading 
              manufacturers.
            </p>
            <div className="mt-8 p-6 bg-emerald-900/30 rounded-xl border border-emerald-700/50">
              <p className="text-xl text-emerald-200 font-medium">
                We do not sell components; we create visibility, trust, and understanding.
              </p>
            </div>
          </div>
        </div>

        {/* Who We Are Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-white mb-6 flex items-center">
              <span className="text-emerald-400 mr-4">Who</span>
              <span>We Are?</span>
            </h2>
            <div className="space-y-6">
              <p className="text-lg text-slate-300 leading-relaxed">
                We are the bridge between manufacturers and innovators, delivering 
                technical clarity and expert insights.
              </p>
              <p className="text-lg text-slate-300 leading-relaxed">
                Through strategic partnerships with global semiconductor brands, we 
                amplify the presence of their components in the global market. Our expert 
                team transforms complex technical data into clear meaningful insights, 
                enabling engineers and businesses to choose the right solution with 
                confidence.
              </p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-emerald-900/40 to-slate-800/40 backdrop-blur-sm rounded-2xl p-8 border border-emerald-700/30">
            <div className="text-center">
              <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p className="text-emerald-200 font-medium text-lg">
                We highlight your innovation, build trust with your audience, 
                and ensure your brand stands out in a competitive industry.
              </p>
            </div>
          </div>
        </div>

        {/* What We Do Section */}
        <div>
          <h2 className="text-4xl font-bold text-white mb-12 text-center">
            <span className="text-emerald-400">What</span> We Do
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

        {/* Why Partner With Us Section */}
        <div className="bg-gradient-to-r from-slate-800/80 to-emerald-900/40 backdrop-blur-sm rounded-2xl p-12 border border-slate-700/50">
          <h2 className="text-4xl font-bold text-white mb-6 text-center">
            <span className="text-emerald-400">Why</span> Partner With Us
          </h2>
          <p className="text-xl text-slate-300 text-center mb-12 max-w-3xl mx-auto">
            World-class brands trust us because we provide more than 
            visibility, we provide credibility
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "An Expert Voice for Your Brand",
                description: "We ensure your products are represented with technical accuracy and market insight."
              },
              {
                title: "High-Value Audience Reach",
                description: "Our visitors are engineers, businesses, and innovators who are actively seeking truthful solutions."
              },
              {
                title: "Strategic Storytelling",
                description: "We turn technical data into a powerful narrative that influences decisions."
              },
              {
                title: "A Dedicated Platform for Semiconductor Excellence",
                description: "Focused exclusively on technology and innovation."
              }
            ].map((benefit, index) => (
              <div key={index} className="flex space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                    <div className="w-6 h-6 bg-emerald-400 rounded-full"></div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-emerald-200 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-emerald-900/30 backdrop-blur-sm rounded-2xl p-12 border border-emerald-700/50">
          <h3 className="text-3xl font-bold text-white mb-6">
            Ready to Amplify Your Semiconductor Innovation?
          </h3>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Join world-leading manufacturers who trust us to showcase their technology 
            and connect with the right audience.
          </p>
          <button 
            onClick={handlePartnerWithUs}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-8 py-4 rounded-lg transition-colors text-lg hover:scale-105 transform duration-200"
          >
            Partner With Us
          </button>
        </div>
      </div>
    </div>
 <Footer></Footer>
 </>
  );
};

export default About;