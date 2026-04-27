import { create } from "zustand";
import { io } from "socket.io-client";

export const useSocketStore = create((set, get) => ({
    socket: null,
    onlineUsers: [],

    connectSocket: (userId) => {
        const { socket } = get();
        if (socket?.connected) return;

        const newSocket = io("http://localhost:8000", {
            query: {
                userId: userId,
            },
        });

        newSocket.on("connect", () => {
            set({ socket: newSocket });
        });

        newSocket.on("getOnlineUsers", (users) => {
            set({ onlineUsers: users });
        });

        return newSocket;
    },

    disconnectSocket: () => {
        const { socket } = get();
        if (socket?.connected) {
            socket.disconnect();
            set({ socket: null });
        }
    },
}));
