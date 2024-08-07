"use client"
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from "react";
import { RiAiGenerate, RiCalendarCheckLine, RiTimeLine } from "@remixicon/react";
import appScreen from "@/assets/images/product.avif";

export const ProductShowcase: React.FC = () => {
  const appImage = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: appImage,
    offset: ["start end", "end end"]
  });

  const rotateX = useTransform(scrollYProgress, [0, 1], [15, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.3, 1]);

  return (
    <div className="bg-gradient-to-b from-black to-[#5D2CA8] py-24 sm:py-32 text-white">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-center text-5xl sm:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Intuitive AI-Powered Interface
        </motion.h2>
        <motion.div 
          className='max-w-2xl mx-auto'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p className="text-xl text-purple-200 text-center">
            Experience the future of scheduling with our AI-driven interface. Kalendar learns from your preferences and optimizes your time like never before.
          </p>
        </motion.div>
        
        <div className="flex justify-center mt-16">
          <motion.div
            style={{
              opacity: opacity,
              rotateX: rotateX,
              transformPerspective: "800px",
            }}
            ref={appImage}
          >
            <Image src={appScreen} width={800} height={450} alt="Kalendar AI Interface" className="rounded-lg shadow-2xl" />
          </motion.div>
        </div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center mt-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <FeatureItem 
            icon={<RiAiGenerate className="w-10 h-10 text-purple-400" />}
            title="AI-Powered Suggestions"
            description="Get intelligent scheduling recommendations based on your habits and preferences."
          />
          <FeatureItem 
            icon={<RiCalendarCheckLine className="w-10 h-10 text-pink-400" />}
            title="Smart Conflict Resolution"
            description="Automatically detect and resolve scheduling conflicts with ease."
          />
          <FeatureItem 
            icon={<RiTimeLine className="w-10 h-10 text-purple-400" />}
            title="Adaptive Time Blocking"
            description="Optimize your productivity with AI-generated time blocks for tasks and breaks."
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