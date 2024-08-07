type SSEEvent = {
    type: 'ping' | 'calendar-update';
    data?: any;
  };
  
  class SSEManager {
    private static instance: SSEManager;
    private connections: Set<(event: SSEEvent) => void>;
  
    private constructor() {
      this.connections = new Set();
    }
  
    static getInstance(): SSEManager {
      if (!SSEManager.instance) {
        SSEManager.instance = new SSEManager();
      }
      return SSEManager.instance;
    }
  
    addConnection(send: (event: SSEEvent) => void) {
      this.connections.add(send);
    }
  
    removeConnection(send: (event: SSEEvent) => void) {
      this.connections.delete(send);
    }
  
    broadcast(event: SSEEvent) {
      this.connections.forEach(send => send(event));
    }
  }
  
  export const sseManager = SSEManager.getInstance();
  
  export function sendCalendarUpdate(data?: any) {
    sseManager.broadcast({ type: 'calendar-update', data });
  }
  
  // Make sendCalendarUpdate available globally (if necessary)
  if (typeof global !== 'undefined') {
    (global as any).sendCalendarUpdate = sendCalendarUpdate;
  }