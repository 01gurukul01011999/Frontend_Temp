'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, DollarSign, Star, ArrowUpRight, CheckCircle } from 'lucide-react';

export function HeroSection(): React.JSX.Element {
  const stats = [
    { icon: TrendingUp, value: '₹2.3L', label: 'This month', color: 'text-emerald-500' },
    { icon: Users, value: '15K+', label: 'Active sellers', color: 'text-blue-500' },
    { icon: DollarSign, value: '₹45L+', label: 'Total earnings', color: 'text-amber-500' },
    { icon: Star, value: '4.8★', label: 'Seller rating', color: 'text-violet-500' },
  ];

  const features = [
    'Zero commission on first ₹50K',
    'Instant payment processing',
    '24/7 seller support',
    'Advanced analytics dashboard',
    'Multi-channel selling',
    'Automated inventory management'
  ];

  return (
    <div className="relative h-full flex flex-col justify-center items-center text-center p-8 lg:p-12">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 60, 0],
            y: [0, -80, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/2 left-1/2 w-24 h-24 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
        />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] opacity-20" />

      {/* Main content */}
      <div className="relative z-10 max-w-2xl">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-8"
        >
                      <img 
              src="/techpotli-logo.svg" 
              alt="Techpotli" 
              className="h-20 w-auto mx-auto"
            />
        </motion.div>

                 {/* Main heading */}
         <motion.h1
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, delay: 0.5 }}
           className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-800 mb-6 leading-tight"
         >
           Welcome to{' '}
           <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
             Techpotli
           </span>
         </motion.h1>

         {/* Subheading */}
         <motion.p
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, delay: 0.7 }}
           className="text-xl lg:text-2xl text-gray-600 mb-8 leading-relaxed"
         >
           Grow faster. Sellers on Techpotli earn{' '}
           <span className="text-blue-600 font-semibold">more</span>.
         </motion.p>

                 {/* Stats grid */}
         <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, delay: 0.9 }}
           className="grid grid-cols-2 gap-4 mb-12"
         >
           {stats.map((stat, index) => (
             <motion.div
               key={stat.label}
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.5, delay: 1.1 + index * 0.1 }}
               className="bg-white/70 backdrop-blur-xl border border-blue-200/50 rounded-2xl p-4 hover:bg-white/90 hover:scale-105 hover:shadow-xl transition-all duration-300 shadow-lg"
               whileHover={{ y: -5 }}
             >
               <div className={`${stat.color} mb-2`}>
                 <stat.icon className="h-6 w-6 mx-auto" />
               </div>
               <div className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
               <div className="text-sm text-gray-600">{stat.label}</div>
             </motion.div>
           ))}
         </motion.div>

                 {/* Features list */}
         <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, delay: 1.3 }}
           className="space-y-3 mb-8"
         >
           {features.map((feature, index) => (
             <motion.div
               key={feature}
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.5, delay: 1.5 + index * 0.1 }}
               className="flex items-center gap-3 text-gray-700 hover:text-gray-800 transition-colors duration-200"
               whileHover={{ x: 5 }}
             >
               <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0" />
               <span className="text-lg font-medium">{feature}</span>
             </motion.div>
           ))}
         </motion.div>

                 {/* CTA section */}
         <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, delay: 1.8 }}
           className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 backdrop-blur-xl border border-blue-300/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300"
           whileHover={{ scale: 1.02 }}
         >
           <div className="flex items-center justify-between">
             <div>
               <h3 className="text-xl font-semibold text-gray-800 mb-2">
                 Ready to start earning?
               </h3>
               <p className="text-gray-600">
                 Join thousands of successful sellers on Techpotli
               </p>
             </div>
             <ArrowUpRight className="h-8 w-8 text-blue-500" />
           </div>
         </motion.div>

                 {/* Floating earning badge */}
         <motion.div
           animate={{
             y: [0, -15, 0],
             scale: [1, 1.05, 1],
           }}
           transition={{
             duration: 3,
             repeat: Infinity,
             ease: "easeInOut"
           }}
           className="absolute top-20 right-8 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300"
           whileHover={{ scale: 1.1 }}
         >
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
             <span className="font-semibold">₹2.3L this month</span>
           </div>
         </motion.div>
      </div>
    </div>
  );
}
