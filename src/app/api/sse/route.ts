// app/api/sse/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sseManager } from '@/lib/server/sseManager';

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const send = (event: { type: string; data?: any }) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
      };

      sseManager.addConnection(send);

      const pingInterval = setInterval(() => {
        send({ type: 'ping' });
      }, 15000);

      req.signal.addEventListener('abort', () => {
        clearInterval(pingInterval);
        sseManager.removeConnection(send);
        controller.close();
      });
    }
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
}