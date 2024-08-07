"use client";
import React from "react";
import { motion } from 'framer-motion';
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/hooks/useOAuth";
import { RiGoogleFill } from "@remixicon/react";
import { Button } from "@nextui-org/react";

const SignupForm: React.FC = () => {
  const { signUpWithGoogle, error } = useAuth();

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-purple-900 to-purple-400 py-12 sm:py-20 relative overflow-hidden px-4 sm:px-6 lg:px-8">
        <BackgroundCircle />
        <SignupCard error={error} onGoogleSignUp={signUpWithGoogle} />
      </div>
    </Layout>
  );
};

const BackgroundCircle: React.FC = () => (
  <div className="absolute h-[375px] w-[750px] sm:w-[1536px] sm:h-[768px] lg:w-[2400px] lg:h-[800px] rounded-[100%] bg-black left-1/2 -translate-x-1/2 border border-[#B48CDE] bg-[radial-gradient(closest-side,#000_82%,#9560EB)] top-[calc(100%-96px)] sm:top-[calc(100%-120px)]" />
);

interface SignupCardProps {
  error: string;
  onGoogleSignUp: () => void;
}

const SignupCard: React.FC<SignupCardProps> = ({ error, onGoogleSignUp }) => (
  <motion.div
    className="w-full max-w-sm sm:max-w-md mx-auto rounded-2xl p-6 sm:p-8 shadow-lg bg-black bg-opacity-50 backdrop-blur-md relative z-10"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
  >
    <h2 className="font-bold text-2xl sm:text-3xl text-white mb-2">
      Welcome to Kalendar
    </h2>
    <p className="text-purple-200 text-sm max-w-sm mb-6 sm:mb-8">
      Get started with your favourite Calendar app and optimize your daily routine with AI-powered insights
    </p>

    {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

    <div className="flex flex-col space-y-4">
      <Button
        onClick={onGoogleSignUp}
        className="bg-purple-900 bg-opacity-50 text-white"
        startContent={<RiGoogleFill className="h-5 w-5" />}
      >
        Get started with Google
      </Button>
    </div>
  </motion.div>
);

export default SignupForm;