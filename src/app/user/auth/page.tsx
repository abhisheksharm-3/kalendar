"use client";
import React, { useState } from "react";
import { SiGooglecalendar, SiMicrosoftoutlook } from "react-icons/si";
import { motion } from 'framer-motion';
import Layout from "@/components/Layout";
import { signUpWithGoogle } from "@/lib/server/oauth";
import { Tooltip } from "@nextui-org/react";
import { getLoggedInUser } from "@/lib/server/appwrite";

const SignupForm: React.FC = () => {
  const [error, setError] = useState<string>("");

  const handleGoogleLogin = async () => {
    try {
      await signUpWithGoogle();
      const res = await getLoggedInUser();
      console.log(res);
    } catch (error: any) {
      console.error("Google login error:", error);
      setError(error.message);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-[linear-gradient(to_bottom,#000,#200D42_34%,#4F21A1_65%,#A46EDB_82%)] py-12 sm:py-20 relative overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="absolute h-[375px] w-[750px] sm:w-[1536px] sm:h-[768px] lg:w-[2400px] lg:h-[800px] rounded-[100%] bg-black left-1/2 -translate-x-1/2 border border-[#B48CDE] bg-[radial-gradient(closest-side,#000_82%,#9560EB)] top-[calc(100%-96px)] sm:top-[calc(100%-120px)]"></div>
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

          {error && (
            <p className="text-red-400 text-sm mb-4">{error}</p>
          )}

          <div className="flex flex-col space-y-4">
            <motion.button
              className="flex items-center justify-center space-x-2 w-full text-white rounded-full py-3 px-4 sm:px-8 font-medium bg-purple-900 bg-opacity-50 text-sm sm:text-base"
              whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgb(255,255,255)" }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGoogleLogin}
              type="button"
            >
              <SiGooglecalendar className="h-5 w-5" />
              <span>Get started with Google Calendar</span>
            </motion.button>
            <Tooltip content="Coming soon...">
              <motion.button
                className="flex items-center justify-center space-x-2 w-full text-white rounded-full py-3 px-4 sm:px-8 font-medium bg-purple-900 bg-opacity-50 cursor-not-allowed text-sm sm:text-base"
                whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgb(255,255,255)" }}
                whileTap={{ scale: 0.95 }}
                type="button"
                disabled
              >
                <SiMicrosoftoutlook className="h-5 w-5" />
                <span>Get started with Outlook Calendar</span>
              </motion.button>
            </Tooltip>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default SignupForm;