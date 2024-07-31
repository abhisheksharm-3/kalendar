"use client";

import { useState, useEffect } from 'react';
import { useSession, signIn } from "next-auth/react";
import axios from 'axios';
import KalendarApp from './KalendarApp';

export default function KalendarPage() {
  const { data: session, status } = useSession();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (session?.accessToken) {
      fetchEvents(session.accessToken);
    }
  }, [session]);

  const fetchEvents = async (accessToken: string) => {
    try {
      const response = await axios.get('/api/user/calendar/googlecalendar/userevents', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setEvents(response.data);
      console.log(response);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {!session ? (
        <div className="h-screen w-screen flex items-center justify-center">
          <button onClick={() => signIn("google")}>Connect Google Calendar</button>
        </div>
      ) : (
        <KalendarApp events={events} />
      )}
    </div>
  );
}
