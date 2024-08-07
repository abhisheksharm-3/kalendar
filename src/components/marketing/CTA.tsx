"use client"
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { RiRocketLine, RiRobot3Line } from "@remixicon/react";

// Assume these images are available in your project
import HelixImage from '@/assets/images/helix2.png';
import EmojiImage from '@/assets/images/emojistar.png'

export const CallToAction = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const translateY = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);

  return (
    <div className="bg-gradient-to-b from-[#200D42] to-black text-white py-24 sm:py-32 overflow-hidden" ref={containerRef}>
      <div className="container max-w-4xl mx-auto px-4 relative">
        <motion.div style={{ translateY, opacity }} className="absolute top-0 left-[calc(100%-50px)] hidden lg:block">
          <Image src={HelixImage} alt="AI Helix" className="w-40 h-auto" />
        </motion.div>
        <motion.div style={{ translateY: useTransform(scrollYProgress, [0, 1], [-50, 50]), opacity }} className="absolute -top-20 -left-20 hidden lg:block">
          <Image src={EmojiImage} alt="AI Assistant" className="w-32 h-auto" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="font-bold text-5xl sm:text-6xl tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Revolutionize Your Schedule
          </h2>
          <p className="text-xl text-purple-200 mb-10 max-w-2xl mx-auto">
            Experience the power of AI-driven scheduling. Optimize your time, boost productivity, and never miss an important appointment again.
          </p>
          <form className="flex flex-col gap-4 max-w-md mx-auto sm:flex-row sm:gap-0">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-grow h-14 bg-white/10 rounded-l-lg px-5 font-medium placeholder:text-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 sm:rounded-r-none"
            />
            <button className="h-14 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg px-6 font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center gap-2 sm:rounded-l-none">
              <RiRocketLine className="w-5 h-5" />
              <span>Get Started</span>
            </button>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-center sm:text-left"
        >
          <div className="flex items-center gap-4">
            <div className="bg-purple-600 rounded-full p-3">
              <RiRobot3Line className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">AI-Powered</h3>
              <p className="text-purple-200">Smart scheduling tailored to you</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-pink-600 rounded-full p-3">
              <RiRocketLine className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Boost Productivity</h3>
              <p className="text-purple-200">Optimize your time effortlessly</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
};