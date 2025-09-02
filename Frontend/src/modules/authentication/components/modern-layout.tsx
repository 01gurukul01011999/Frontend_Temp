
'use client';
import * as React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { HeroSection } from './hero-section';

export interface ModernLayoutProps {
  children: React.ReactNode;
}

export function ModernLayout({ children }: ModernLayoutProps): React.JSX.Element {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-50 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-indigo-300/20 to-purple-400/20 animate-pulse" />
      
      {/* Enhanced grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:50px_50px] opacity-40" />
      
      {/* Floating particles with better colors */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${
              i % 3 === 0 ? 'bg-blue-400/30' : i % 3 === 1 ? 'bg-indigo-400/30' : 'bg-purple-400/30'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
            }}
            animate={{
              y: [0, -150, 0],
              x: [0, Math.random() * 100 - 50, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 15 + 15,
              repeat: Infinity,
              delay: Math.random() * 8,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      {/* Animated orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [360, 180, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"
      />

      {/* Main layout */}
      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        {/* Left Panel - Sign In Form */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 flex items-center justify-center p-6 lg:p-12 order-2 lg:order-1"
        >
          <div className="w-full max-w-md">
            {children}
          </div>
        </motion.div>

        {/* Right Panel - Hero Section */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-1 bg-gradient-to-br from-white/80 via-blue-50/90 to-indigo-100/80 backdrop-blur-xl border-l border-blue-200/50 shadow-2xl order-1 lg:order-2 block"
        >
          <HeroSection />
        </motion.div>
      </div>

      {/* Mobile hero section (shown below form on mobile) */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="bg-gradient-to-br from-white/80 via-blue-50/90 to-indigo-100/80 backdrop-blur-xl border-t border-blue-200/50 shadow-xl p-8"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-6"
          >
            <Image 
              src="/techpotli-logo.svg" 
              alt="Techpotli" 
              height={64}
              width={256}
              className="h-16 w-auto mx-auto"
              priority
            />
          </motion.div>
          
                     <motion.h2
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.8 }}
             className="text-3xl font-bold text-gray-800 mb-4"
           >
             Welcome to{' '}
             <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
               Techpotli
             </span>
           </motion.h2>
           
           <motion.p
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 1 }}
             className="text-lg text-gray-600 mb-6"
           >
             Grow faster. Sellers on Techpotli earn{' '}
             <span className="text-blue-600 font-semibold">more</span>.
           </motion.p>

                     {/* Mobile stats */}
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 1.2 }}
             className="grid grid-cols-2 gap-4 max-w-sm mx-auto"
           >
             <div className="bg-white/60 backdrop-blur-sm border border-blue-200/50 rounded-xl p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
               <div className="text-blue-600 text-sm font-semibold mb-1">₹2.3L</div>
               <div className="text-xs text-gray-600">This month</div>
             </div>
             <div className="bg-white/60 backdrop-blur-sm border border-indigo-200/50 rounded-xl p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
               <div className="text-indigo-600 text-sm font-semibold mb-1">15K+</div>
               <div className="text-xs text-gray-600">Active sellers</div>
             </div>
           </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
