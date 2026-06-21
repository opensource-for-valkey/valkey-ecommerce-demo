import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { SOCKET_URL } from "../api/shopmindClient";

export const useShopMindSocket = (userId) => {
  const [events, setEvents] = useState([]);
  const socket = useMemo(() => io(SOCKET_URL, { autoConnect: false }), []);

  useEffect(() => {
    socket.connect();
    if (userId) socket.emit("notifications:subscribe", { userId });
    const push = (type) => (payload) => setEvents((items) => [{ id: `${type}-${Date.now()}`, type, payload }, ...items].slice(0, 20));
    socket.on("inventory:update", push("inventory"));
    socket.on("notification:new", push("notification"));
    socket.on("trending:update", push("trending"));
    socket.on("order:update", push("order"));
    return () => {
      socket.off();
      socket.disconnect();
    };
  }, [socket, userId]);

  return { socket, events };
};
