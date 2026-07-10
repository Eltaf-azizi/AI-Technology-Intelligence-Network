import { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';

export default function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);
  const subscriptionsRef = useRef(new Set());

  useEffect(() => {
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:5000';
    const socket = io(wsUrl, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      subscriptionsRef.current.forEach((channel) => {
        socket.emit('subscribe', channel);
      });
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('connect_error', () => {
      setIsConnected(false);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  const subscribe = useCallback((channel) => {
    subscriptionsRef.current.add(channel);
    if (socketRef.current?.connected) {
      socketRef.current.emit('subscribe', channel);
    }
  }, []);

  const unsubscribe = useCallback((channel) => {
    subscriptionsRef.current.delete(channel);
    if (socketRef.current?.connected) {
      socketRef.current.emit('unsubscribe', channel);
    }
  }, []);

  return {
    socket: socketRef.current,
    isConnected,
    subscribe,
    unsubscribe,
  };
}
