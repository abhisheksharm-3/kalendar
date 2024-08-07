"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSession, signIn } from "next-auth/react";
import axios from 'axios';
import KalendarApp from './KalendarApp';
import { motion } from 'framer-motion';
import { RiRocketLine, RiEmotionLaughLine, RiRefreshLine } from "@remixicon/react";
import { Button } from '@nextui-org/react';
import { Event } from '@/lib/types';
import { storeAccessToken, getLoggedInUser, getAccessToken } from '@/lib/server/appwrite';

export default function KalendarPage() {
  const { data: session, status } = useSession();
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchAndStoreUser = async () => {
      try {
        const user = await getLoggedInUser();
        if (user?.$id && session?.accessToken) {
          await storeAccessToken(user.$id, session.accessToken);
          console.log('Access token stored');
        }
      } catch (error) {
        console.error('Error storing access token:', error);
      }
    };

    fetchAndStoreUser();
  }, [session]);

  const fetchEvents = useCallback(async () => {
    if (!session?.accessToken) {
      console.error('No access token available');
      return;
    }
    try {
      const response = await axios.get('/api/user/calendar/googlecalendar/userevents', {
        headers: { Authorization: `Bearer ${session.accessToken}` }
      });
      setEvents(response.data);
      console.log('Events fetched:', response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  }, [session]);

  const setupWebhook = useCallback(async () => {
    if (!session?.accessToken) {
      console.error('No access token available');
      return;
    }
    try {
      const response = await fetch('/api/webhooks/setupgooglecalendarwebhook', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ accessToken: session.accessToken })
      });
      const data = await response.json();
      console.log('Webhook set up successfully:', data);
    } catch (error) {
      console.error('Error setting up webhook:', error);
    }
  }, [session]);

  useEffect(() => {
    if (session?.accessToken) {
      fetchEvents();
      setupWebhook();
    }
  }, [session, setupWebhook, fetchEvents]);

  useEffect(() => {
    if (!session?.accessToken) return;

    const eventSource = new EventSource('/api/sse');

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'calendar-update') {
        console.log('Received calendar update');
        fetchEvents();
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [session, fetchEvents]);

  useEffect(() => {
    const handleWebhookUpdate = () => {
      if (session?.accessToken) {
        fetchEvents();
      }
    };

    // Listen for webhook updates
    window.addEventListener('calendar-update', handleWebhookUpdate);

    return () => {
      window.removeEventListener('calendar-update', handleWebhookUpdate);
    };
  }, [session, fetchEvents]);
  if (status === "loading") {
    return <div className="h-screen w-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
    </div>;
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
  // const events: Event[] = [
  //   {
  //     kind: "calendar#event",
  //     etag: "\"3375461728374000\"",
  //     id: "1h3k5m7n9p2r4t6v",
  //     status: "confirmed",
  //     htmlLink: "https://www.google.com/calendar/event?eid=1h3k5m7n9p2r4t6v",
  //     created: "2024-07-25T09:00:00.000Z",
  //     updated: "2024-07-25T09:00:00.000Z",
  //     summary: "Team Standup",
  //     description: "Daily team standup meeting",
  //     creator: {
  //       email: "user@example.com",
  //       self: true
  //     },
  //     organizer: {
  //       email: "user@example.com",
  //       self: true
  //     },
  //     start: {
  //       dateTime: "2024-08-04T09:00:00+00:00",
  //       timeZone: "UTC"
  //     },
  //     end: {
  //       dateTime: "2024-08-04T09:30:00+00:00",
  //       timeZone: "UTC"
  //     },
  //     iCalUID: "1h3k5m7n9p2r4t6v@google.com",
  //     sequence: 0,
  //     reminders: {
  //       useDefault: true
  //     },
  //     eventType: "default"
  //   },
  //   {
  //     kind: "calendar#event",
  //     etag: "\"3375461728374001\"",
  //     id: "2i4l6o8q1s3u5w7y",
  //     status: "confirmed",
  //     htmlLink: "https://www.google.com/calendar/event?eid=2i4l6o8q1s3u5w7y",
  //     created: "2024-07-26T10:00:00.000Z",
  //     updated: "2024-07-26T10:00:00.000Z",
  //     summary: "Project Review",
  //     description: "Monthly project review meeting",
  //     creator: {
  //       email: "manager@example.com",
  //       self: false
  //     },
  //     organizer: {
  //       email: "manager@example.com",
  //       self: false
  //     },
  //     start: {
  //       dateTime: "2024-08-04T14:00:00+00:00",
  //       timeZone: "UTC"
  //     },
  //     end: {
  //       dateTime: "2024-08-04T15:30:00+00:00",
  //       timeZone: "UTC"
  //     },
  //     iCalUID: "2i4l6o8q1s3u5w7y@google.com",
  //     sequence: 0,
  //     reminders: {
  //       useDefault: false,
  //       overrides: [
  //         {
  //           method: "email",
  //           minutes: 30
  //         }
  //       ]
  //     },
  //     eventType: "default"
  //   },
  //   {
  //     kind: "calendar#event",
  //     etag: "\"3375461728374002\"",
  //     id: "3j5m7o9q1s3u5w7y",
  //     status: "confirmed",
  //     htmlLink: "https://www.google.com/calendar/event?eid=3j5m7o9q1s3u5w7y",
  //     created: "2024-07-27T11:00:00.000Z",
  //     updated: "2024-07-27T11:00:00.000Z",
  //     summary: "Lunch with Client",
  //     description: "Lunch meeting with potential client",
  //     creator: {
  //       email: "user@example.com",
  //       self: true
  //     },
  //     organizer: {
  //       email: "user@example.com",
  //       self: true
  //     },
  //     start: {
  //       dateTime: "2024-08-01T12:00:00+00:00",
  //       timeZone: "UTC"
  //     },
  //     end: {
  //       dateTime: "2024-08-01T13:30:00+00:00",
  //       timeZone: "UTC"
  //     },
  //     iCalUID: "3j5m7o9q1s3u5w7y@google.com",
  //     sequence: 0,
  //     reminders: {
  //       useDefault: true
  //     },
  //     eventType: "default"
  //   },
  //   {
  //     kind: "calendar#event",
  //     etag: "\"3375461728374003\"",
  //     id: "4k6n8p0r2t4v6x8z",
  //     status: "confirmed",
  //     htmlLink: "https://www.google.com/calendar/event?eid=4k6n8p0r2t4v6x8z",
  //     created: "2024-07-28T12:00:00.000Z",
  //     updated: "2024-07-28T12:00:00.000Z",
  //     summary: "Team Building Workshop",
  //     description: "Annual team building workshop",
  //     creator: {
  //       email: "hr@example.com",
  //       self: false
  //     },
  //     organizer: {
  //       email: "hr@example.com",
  //       self: false
  //     },
  //     start: {
  //       dateTime: "2024-08-02T09:00:00+00:00",
  //       timeZone: "UTC"
  //     },
  //     end: {
  //       dateTime: "2024-08-02T17:00:00+00:00",
  //       timeZone: "UTC"
  //     },
  //     iCalUID: "4k6n8p0r2t4v6x8z@google.com",
  //     sequence: 0,
  //     reminders: {
  //       useDefault: false,
  //       overrides: [
  //         {
  //           method: "popup",
  //           minutes: 60
  //         }
  //       ]
  //     },
  //     eventType: "default"
  //   },
  //   {
  //     kind: "calendar#event",
  //     etag: "\"3375461728374004\"",
  //     id: "5l7n9p1r3t5v7x9z",
  //     status: "confirmed",
  //     htmlLink: "https://www.google.com/calendar/event?eid=5l7n9p1r3t5v7x9z",
  //     created: "2024-07-29T13:00:00.000Z",
  //     updated: "2024-07-29T13:00:00.000Z",
  //     summary: "Product Demo",
  //     description: "Demo of new product features",
  //     creator: {
  //       email: "product@example.com",
  //       self: false
  //     },
  //     organizer: {
  //       email: "product@example.com",
  //       self: false
  //     },
  //     start: {
  //       dateTime: "2024-08-02T15:00:00+00:00",
  //       timeZone: "UTC"
  //     },
  //     end: {
  //       dateTime: "2024-08-02T16:00:00+00:00",
  //       timeZone: "UTC"
  //     },
  //     iCalUID: "5l7n9p1r3t5v7x9z@google.com",
  //     sequence: 0,
  //     reminders: {
  //       useDefault: true
  //     },
  //     eventType: "default"
  //   }
  // ];

  return <KalendarApp events={events} />;
}