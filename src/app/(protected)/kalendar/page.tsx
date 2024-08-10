"use client";

import { useState, useEffect, useCallback } from 'react';
import { useSession, signIn } from "next-auth/react";
import KalendarApp from './KalendarApp';
import { motion } from 'framer-motion';
import { RiRocketLine, RiEmotionLaughLine, RiRefreshLine } from "@remixicon/react";
import { Button } from '@nextui-org/react';
import { storeTokens, getLoggedInUser } from '@/lib/server/appwrite';

export default function KalendarPage() {
  const { data: session, status } = useSession();
  const [webhookSetup, setWebhookSetup] = useState(false);

  useEffect(() => {
    const fetchAndStoreUser = async () => {
      try {
        const user = await getLoggedInUser();
        if (user?.$id && session?.accessToken && session?.refreshToken) {
          await storeTokens(user.$id, session.accessToken, session.refreshToken);
          console.log('Tokens stored');
        }
      } catch (error) {
        console.error('Error storing access token:', error);
      }
    };

    if (session?.accessToken && session?.refreshToken) {
      fetchAndStoreUser();
    }
  }, [session]);

  const setupWebhook = useCallback(async () => {
    if (!session?.accessToken) {
      console.error('No access token available');
      return;
    }
    try {
      const response = await fetch('/api/webhooks/setupWebhook', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ accessToken: session.accessToken })
      });
      const data = await response.json();
      console.log('Webhook set up successfully:', data);
      setWebhookSetup(true);
    } catch (error) {
      console.error('Error setting up webhook:', error);
    }
  }, [session]);

  useEffect(() => {
    if (session?.accessToken && !webhookSetup) {
      setupWebhook();
    }
  }, [session, setupWebhook, webhookSetup]);

  if (status === "loading") {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#200D42] to-black text-white flex items-center justify-center px-4">
        <div className="max-w-2xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Connect Your Calendar
            </h1>
            <p className="text-xl text-purple-200 mb-8">
              Let&apos;s supercharge your schedule with AI magic! ✨
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white/10 rounded-lg p-8 mb-8"
          >
            <div className="flex items-center mb-4 text-purple-300">
              <RiEmotionLaughLine className="w-6 h-6 mr-2" />
              <h2 className="text-xl font-semibold">Our Little Secret</h2>
            </div>
            <p className="text-purple-200 mb-4">
              Psst! Here&apos;s the deal: Our dev got a bit tangled up in the whole &quot;how to store user tokens&quot; dilemma. 
              So, we&apos;re going old school - no storage, just pure, unadulterated, daily reconnects! 
              It&apos;s not a bug, it&apos;s a feature! 😉
            </p>
            <div className="flex items-center text-purple-300">
              <RiRefreshLine className="w-6 h-6 mr-2" />
              <p>Daily logins: It&apos;s like a fun ritual, but for your calendar!</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center"
          >
            <Button 
              onClick={() => signIn("google")} 
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-8 rounded-full text-lg font-semibold shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center mx-auto"
            >
              <RiRocketLine className="w-5 h-5 mr-2" />
              <span>Blast Off with Google Calendar!</span>
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return <KalendarApp />;
}