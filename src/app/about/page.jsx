// 'use client'
// import React from 'react';
// import { motion } from 'framer-motion';
// import { Award, Users, Target, Zap, Globe, Shield, ChevronRight, CheckCircle } from 'lucide-react';
// import Navbar from '../../Components/Navbar/Navbar';
// import Footer from '../Shared/Footer';

// const AboutPage = () => {
//   const stats = [
//     { value: '25+', label: 'Years of Excellence', icon: Award },
//     { value: '500M+', label: 'ICs Manufactured', icon: Zap },
//     { value: '150+', label: 'Patents Filed', icon: Shield },
//     { value: '80+', label: 'Countries Served', icon: Globe }
//   ];

//   const timeline = [
//     { year: '1999', title: 'Company Founded', description: 'Started with a vision to revolutionize semiconductor technology' },
//     { year: '2005', title: 'First Fab Facility', description: 'Opened our state-of-the-art manufacturing facility' },
//     { year: '2012', title: 'Global Expansion', description: 'Expanded operations to Europe and Asia' },
//     { year: '2018', title: 'Innovation Award', description: 'Received IEEE Innovation Award for breakthrough technology' },
//     { year: '2024', title: 'Next-Gen Launch', description: 'Launched revolutionary 3nm process technology' }
//   ];

//   const values = [
//     {
//       icon: Target,
//       title: 'Innovation First',
//       description: 'Pushing the boundaries of semiconductor technology with cutting-edge research and development'
//     },
//     {
//       icon: Users,
//       title: 'Customer Focus',
//       description: 'Building lasting partnerships by delivering exceptional quality and support'
//     },
//     {
//       icon: Shield,
//       title: 'Quality Assurance',
//       description: 'Maintaining the highest standards in manufacturing and testing processes'
//     },
//     {
//       icon: Globe,
//       title: 'Global Impact',
//       description: 'Contributing to technological advancement worldwide through our innovations'
//     }
//   ];

//   const team = [
//     {
//       name: 'Dr. Sadhik Basha',
//       role: 'Chief Executive Officer',
//       image: 'https://i.ibb.co/MxTW3R85/Dr-j-sadhik-Basha.jpg', 
//       bio: '20+ years in semiconductor industry'
//     },
//     {
//       name: 'Michael Rodriguez',
//       role: 'Chief Technology Officer',
//       image: 'https://i.ibb.co/SDZngnX0/rodriguze.jpg',
//       bio: 'Former Intel Senior Engineer'
//     },
//     {
//       name: 'Dr. Aisha Patel',
//       role: 'VP of Research',
//       image: 'https://i.ibb.co/vx5BWmG3/asiha-patel.jpg',
//       bio: 'MIT PhD, 50+ patents'
//     },
//     {
//       name: 'James Liu',
//       role: 'VP of Operations',
//       image: 'https://i.ibb.co/hvXfwhW/james-liu.jpg',
//       bio: '15+ years fab management'
//     }
//   ];

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1
//       }
//     }
//   };

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: {
//         type: "spring",
//         stiffness: 100
//       }
//     }
//   };

//   return (
//     <>
    
//     <Navbar></Navbar>

// <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
//       {/* Hero Section */}
//       <motion.div 
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.8 }}
//         className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-700 py-30"
//       >
//         <div className="absolute inset-0 bg-black opacity-20"></div>
//         <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <motion.h1 
//             initial={{ y: -30, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             transition={{ delay: 0.2, duration: 0.6 }}
//             className="text-6xl font-bold text-white mb-6 text-center"
//           >
//             Pioneering the Future of Silicon
//           </motion.h1>
//           <motion.p 
//             initial={{ y: -20, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             transition={{ delay: 0.4, duration: 0.6 }}
//             className="text-xl text-gray-100 max-w-3xl mx-auto text-center"
//           >
//             For over two decades, we've been at the forefront of integrated circuit innovation, 
//             delivering cutting-edge solutions that power the world's technology.
//           </motion.p>
//         </div>
//         <motion.div
//           animate={{ 
//             rotate: [0, 360],
//           }}
//           transition={{ 
//             duration: 50,
//             repeat: Infinity,
//             ease: "linear"
//           }}
//           className="absolute -bottom-20 -right-20 w-96 h-96 opacity-10"
//         >
//           <div className="w-full h-full rounded-full border-8 border-white border-dashed"></div>
//         </motion.div>
//       </motion.div>

//       {/* Stats Section */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
//         <motion.div
//           variants={containerVariants}
//           initial="hidden"
//           animate="visible"
//           className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
//         >
//           {stats.map((stat, index) => (
//             <motion.div
//               key={index}
//               variants={itemVariants}
//               whileHover={{ scale: 1.05 }}
//               className="bg-gray-800 rounded-xl p-6 text-center group"
//             >
//               <motion.div
//                 whileHover={{ rotate: 360 }}
//                 transition={{ duration: 0.5 }}
//                 className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4"
//               >
//                 <stat.icon className="w-8 h-8 text-white" />
//               </motion.div>
//               <h3 className="text-4xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
//                 {stat.value}
//               </h3>
//               <p className="text-gray-400">{stat.label}</p>
//             </motion.div>
//           ))}
//         </motion.div>
//       </div>

//       {/* Mission Section */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         whileInView={{ opacity: 1 }}
//         transition={{ duration: 0.8 }}
//         viewport={{ once: true }}
//         className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
//       >
//         <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-3xl p-12 relative overflow-hidden">
//           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full filter blur-3xl opacity-20"></div>
//           <div className="relative z-10">
//             <h2 className="text-4xl font-bold text-white mb-6">Our Mission</h2>
//             <p className="text-xl text-gray-300 leading-relaxed mb-8">
//               To accelerate human progress by creating the world's most advanced integrated circuits, 
//               enabling breakthrough innovations in computing, communications, and beyond. We believe 
//               in the power of silicon to transform industries and improve lives globally.
//             </p>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               {['Sustainable Manufacturing', 'Ethical Innovation', 'Global Collaboration'].map((item, index) => (
//                 <motion.div
//                   key={index}
//                   initial={{ x: -20, opacity: 0 }}
//                   whileInView={{ x: 0, opacity: 1 }}
//                   transition={{ delay: index * 0.1 }}
//                   className="flex items-center gap-3"
//                 >
//                   <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
//                   <span className="text-gray-200">{item}</span>
//                 </motion.div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </motion.div>

//       {/* Values Section */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         whileInView={{ opacity: 1 }}
//         transition={{ duration: 0.8 }}
//         viewport={{ once: true }}
//         className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
//       >
//         <h2 className="text-4xl font-bold text-white text-center mb-12">Our Core Values</h2>
//         <motion.div
//           variants={containerVariants}
//           initial="hidden"
//           animate="visible"
//           className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
//         >
//           {values.map((value, index) => (
//             <motion.div
//               key={index}
//               variants={itemVariants}
//               whileHover={{ y: -10 }}
//               className="bg-gray-800 rounded-xl p-6 text-center group"
//             >
//               <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl mb-4 group-hover:scale-110 transition-transform">
//                 <value.icon className="w-8 h-8 text-white" />
//               </div>
//               <h3 className="text-xl font-semibold text-white mb-3">{value.title}</h3>
//               <p className="text-gray-400 text-sm">{value.description}</p>
//             </motion.div>
//           ))}
//         </motion.div>
//       </motion.div>

//       {/* Timeline Section */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         whileInView={{ opacity: 1 }}
//         transition={{ duration: 0.8 }}
//         viewport={{ once: true }}
//         className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
//       >
//         <h2 className="text-4xl font-bold text-white text-center mb-12">Our Journey</h2>
//         <div className="relative">
//           <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-600 to-purple-600"></div>
//           {timeline.map((event, index) => (
//             <motion.div
//               key={index}
//               initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               transition={{ delay: index * 0.1 }}
//               viewport={{ once: true }}
//               className={`relative flex items-center mb-8 ${
//                 index % 2 === 0 ? 'justify-start' : 'justify-end'
//               }`}
//             >
//               <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
//                 <div className="bg-gray-800 rounded-xl p-6 hover:shadow-xl transition-shadow">
//                   <span className="text-blue-400 font-bold text-lg">{event.year}</span>
//                   <h3 className="text-xl font-semibold text-white mt-2 mb-2">{event.title}</h3>
//                   <p className="text-gray-400 text-sm">{event.description}</p>
//                 </div>
//               </div>
//               <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rounded-full border-4 border-blue-600"></div>
//             </motion.div>
//           ))}
//         </div>
//       </motion.div>

//       {/* Team Section */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         whileInView={{ opacity: 1 }}
//         transition={{ duration: 0.8 }}
//         viewport={{ once: true }}
//         className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
//       >
//         <h2 className="text-4xl font-bold text-white text-center mb-12">Leadership Team</h2>
//         <motion.div
//           variants={containerVariants}
//           initial="hidden"
//           animate="visible"
//           className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
//         >
//           {team.map((member, index) => (
//             <motion.div
//               key={index}
//               variants={itemVariants}
//               whileHover={{ y: -10 }}
//               className="bg-gray-800 rounded-xl overflow-hidden group"
//             >
//               <div className="relative h-48 overflow-hidden">
//                 <img 
//                   src={member.image} 
//                   alt={member.name}
//                   className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
//               </div>
//               <div className="p-6">
//                 <h3 className="text-xl font-semibold text-white mb-1">{member.name}</h3>
//                 <p className="text-blue-400 text-sm mb-2">{member.role}</p>
//                 <p className="text-gray-400 text-sm">{member.bio}</p>
//               </div>
//             </motion.div>
//           ))}
//         </motion.div>
//       </motion.div>

//       {/* CTA Section */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8 }}
//         viewport={{ once: true }}
//         className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
//       >
//         <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-3xl p-12 text-center">
//           <h2 className="text-4xl font-bold text-white mb-4">Join Our Innovation Journey</h2>
//           <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto">
//             Whether you're looking for cutting-edge IC solutions or want to be part of our team, 
//             we're here to help you succeed.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => window.location.href = '/'}
//               className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
//             >
//               Explore Products
//               <ChevronRight className="w-5 h-5" />
//             </motion.button>
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => window.location.href = '/careers'}
//               className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors inline-flex items-center gap-2"
//             >
//               View Careers
//               <ChevronRight className="w-5 h-5" />
//             </motion.button>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//     <Footer></Footer>
//     </>
//   );
// };

// export default AboutPage;
import Navbar from '@/Components/Navbar/Navbar';
import React from 'react';
import Footer from '../Shared/Footer';

const About = () => {
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
          <button className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-8 py-4 rounded-lg transition-colors text-lg">
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