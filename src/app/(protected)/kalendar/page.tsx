'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession, signIn } from 'next-auth/react';
import KalendarApp from './KalendarApp';
import { motion } from 'framer-motion';
import { RiRocketLine, RiCalendarLine } from '@remixicon/react';
import { Button } from '@nextui-org/react';

/**
 * Main Kalendar page that handles authentication state and renders the app.
 */
export default function KalendarPage() {
  const { data: session, status } = useSession();
  const [isWebhookSetup, setIsWebhookSetup] = useState(false);

  const setupWebhook = useCallback(async () => {
    if (!session?.accessToken) return;

    try {
      const response = await fetch('/api/webhooks/setupWebhook', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accessToken: session.accessToken }),
      });

      if (response.ok) {
        setIsWebhookSetup(true);
      }
    } catch {
      // Webhook setup is optional, continue without it
    }
  }, [session?.accessToken]);

  useEffect(() => {
    if (session?.accessToken && !isWebhookSetup) {
      setupWebhook();
    }
  }, [session?.accessToken, isWebhookSetup, setupWebhook]);

  if (status === 'loading') {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-b from-[#200D42] to-black">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500" />
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
            <RiCalendarLine className="w-20 h-20 mx-auto mb-6 text-purple-400" />
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Connect Your Calendar
            </h1>
            <p className="text-xl text-purple-200 mb-8">
              Let&apos;s supercharge your schedule with AI magic!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center"
          >
            <Button
              onClick={() => signIn('google', { callbackUrl: '/kalendar' })}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-8 rounded-full text-lg font-semibold shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center mx-auto"
            >
              <RiRocketLine className="w-5 h-5 mr-2" />
              <span>Connect with Google Calendar</span>
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return <KalendarApp />;
}