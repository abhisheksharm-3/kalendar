// app/api/sse/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      const send = (data: string) => {
        controller.enqueue(encoder.encode(`data: ${data}\n\n`));
      };

      const timer = setInterval(() => {
        send(JSON.stringify({ type: 'ping' }));
      }, 15000);

      // Function to send calendar update
      const sendCalendarUpdate = () => {
        send(JSON.stringify({ type: 'calendar-update' }));
      };

      // Store the sendCalendarUpdate function globally so it can be called from other parts of your application
      (global as any).sendCalendarUpdate = sendCalendarUpdate;

      req.signal.addEventListener('abort', () => {
        clearInterval(timer);
        controller.close();
      });
    }
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}