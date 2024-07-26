"use client"
import React from 'react';
import { motion } from 'framer-motion';
import Bentodemo from './bentogrid';

export const Features: React.FC = () => {
  return (
    <div className="bg-black text-white py-20 sm:py-32 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-bold text-5xl sm:text-6xl tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Everything you need
          </h2>
          <motion.p 
            className="text-xl text-white/70 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Kalendar brings together all the tools you need for efficient AI-powered scheduling and time management in one intuitive platform.
          </motion.p>
        </motion.div>

        <motion.div 
          className="mt-16 sm:mt-24"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Bentodemo />
        </motion.div>

        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <a 
            href="#" 
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-8 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Explore All Features
          </a>
        </motion.div>
      </div>
    </div>
  );
};