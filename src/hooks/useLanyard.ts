import { useEffect, useState } from 'react';

export type DiscordStatus = 'online' | 'idle' | 'dnd' | 'offline';

export interface DiscordPresence {
  status: DiscordStatus;
  userId: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
}

interface LanyardData {
  discord_status: DiscordStatus;
  discord_user: {
    id: string;
    username: string;
    global_name: string | null;
    display_name?: string | null;
    avatar: string | null;
  };
}

function toPresence(d: LanyardData): DiscordPresence {
  const u = d.discord_user;
  const avatarUrl = u.avatar
    ? `https://cdn.discordapp.com/avatars/${u.id}/${u.avatar}.${
        u.avatar.startsWith('a_') ? 'gif' : 'png'
      }?size=128`
    : null;
  return {
    status: d.discord_status,
    userId: u.id,
    username: u.username,
    displayName: u.global_name || u.display_name || u.username,
    avatarUrl,
  };
}

/**
 * Live Discord presence via Lanyard.
 * Loads once over HTTP, then keeps it updated over a WebSocket.
 * Returns null while loading or if Lanyard can't be reached (the dot shows gray).
 */
export function useLanyard(userId: string): DiscordPresence | null {
  const [presence, setPresence] = useState<DiscordPresence | null>(null);

  useEffect(() => {
    let stopped = false;
    let socket: WebSocket | null = null;
    let heartbeat: number | undefined;
    let reconnect: number | undefined;
    let retryDelay = 2000;

    fetch(`https://api.lanyard.rest/v1/users/${userId}`)
      .then((r) => r.json())
      .then((json: { success: boolean; data?: LanyardData }) => {
        if (!stopped && json.success && json.data) setPresence(toPresence(json.data));
      })
      .catch(() => {});

    const connect = () => {
      if (stopped) return;
      socket = new WebSocket('wss://api.lanyard.rest/socket');

      socket.onmessage = (event) => {
        let msg: { op: number; t?: string; d?: unknown };
        try {
          msg = JSON.parse(event.data as string);
        } catch {
          return;
        }
        if (msg.op === 1) {
          // Hello: start heartbeats and subscribe to this user.
          const interval = (msg.d as { heartbeat_interval: number }).heartbeat_interval;
          window.clearInterval(heartbeat);
          heartbeat = window.setInterval(() => socket?.send(JSON.stringify({ op: 3 })), interval);
          socket?.send(JSON.stringify({ op: 2, d: { subscribe_to_id: userId } }));
          retryDelay = 2000;
        } else if (msg.op === 0 && (msg.t === 'INIT_STATE' || msg.t === 'PRESENCE_UPDATE')) {
          setPresence(toPresence(msg.d as LanyardData));
        }
      };

      socket.onclose = () => {
        window.clearInterval(heartbeat);
        if (stopped) return;
        reconnect = window.setTimeout(connect, retryDelay);
        retryDelay = Math.min(retryDelay * 2, 60000);
      };
    };

    connect();

    return () => {
      stopped = true;
      window.clearInterval(heartbeat);
      window.clearTimeout(reconnect);
      socket?.close();
    };
  }, [userId]);

  return presence;
}
