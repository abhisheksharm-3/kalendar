"use client"
import React from 'react';
import { motion } from 'framer-motion';
import { RiRobot3Line, RiCalendarLine, RiRocketLine } from "@remixicon/react";

const Hero: React.FC = () => {
  return (
    <div className="bg-black text-white bg-[linear-gradient(to_bottom,#000,#200D42_34%,#4F21A1_65%,#A46EDB_82%)] py-20 sm:py-32 relative overflow-hidden">
      <div className="absolute h-[375px] w-[750px] sm:w-[1536px] sm:h-[768px] lg:w-[2400px] lg:h-[800px] rounded-[100%] bg-black left-1/2 -translate-x-1/2 border border-[#B48CDE] bg-[radial-gradient(closest-side,#000_82%,#9560EB)] top-[calc(100%-96px)] sm:top-[calc(100%-120px)]"></div>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl sm:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            AI-Powered Scheduling<br />for the Future
          </h1>
          <p className="text-xl sm:text-2xl max-w-2xl mx-auto text-purple-200">
            Kalendar uses advanced AI to revolutionize how you manage your time. Effortless scheduling, intelligent predictions, and seamless integration.
          </p>
        </motion.div>

        <motion.div 
          className="flex justify-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.button 
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-8 rounded-full text-lg font-semibold shadow-lg"
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgb(255,255,255)" }}
            whileTap={{ scale: 0.95 }}
          >
            Experience AI Scheduling
          </motion.button>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <FeatureItem 
            icon={<RiRobot3Line className="w-10 h-10 text-purple-400" />}
            title="AI-Driven Insights"
            description="Optimize your schedule with machine learning algorithms."
          />
          <FeatureItem 
            icon={<RiCalendarLine className="w-10 h-10 text-pink-400" />}
            title="Smart Scheduling"
            description="Automatically find the best times for your meetings and tasks."
          />
          <FeatureItem 
            icon={<RiRocketLine className="w-10 h-10 text-purple-400" />}
            title="Productivity Boost"
            description="Enhance your efficiency with AI-powered time management."
          />
        </motion.div>
      </div>
    </div>
  )
};

interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, title, description }) => (
  <div className="flex flex-col items-center">
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-purple-200">{description}</p>
  </div>
);

export default Hero;