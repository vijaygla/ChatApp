import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    typingUsers: [],

    setUsers: (users) => set({ users }),
    setSelectedUser: (selectedUser) => set({ selectedUser }),

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/user/");
            set({ users: res.data });
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred");
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessages: async (targetId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/message/${targetId}`);
            set({ messages: res.data });
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred");
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        try {
            const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData);
            // The API returns { newMessage }. We append it.
            set({ messages: [...messages, res.data.newMessage] });
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred");
        }
    },

    subscribeToMessages: (socket) => {
        if (!socket) return;
        
        socket.off("newMessage");
        socket.off("typing");
        socket.off("stopTyping");
        
        socket.on("newMessage", (newMessage) => {
            const { selectedUser, messages, users } = get();
            
            // 1. Update users list with the new last message and reorder
            const updatedUsers = users.map(user => {
                // Check if this message belongs to this user's conversation
                // For groups, check conversationId. For 1-on-1, check senderId or receiverId.
                const isMatch = user.isGroup 
                    ? user._id === newMessage.conversationId
                    : (user._id === newMessage.senderId || user._id === newMessage.receiverId);
                
                if (isMatch) {
                    return { ...user, lastMessage: newMessage };
                }
                return user;
            });

            // Sort by last message time
            updatedUsers.sort((a, b) => {
                const timeA = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt) : new Date(0);
                const timeB = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt) : new Date(0);
                return timeB - timeA;
            });

            set({ users: updatedUsers });

            // 2. If it's the current chat, add to messages list
            if (!selectedUser) return;
            
            const isMessageFromSelectedChat = 
                (selectedUser.isGroup && newMessage.conversationId === selectedUser._id) ||
                (!selectedUser.isGroup && (newMessage.senderId === selectedUser._id || newMessage.receiverId === selectedUser._id));

            if (isMessageFromSelectedChat) {
                const isDuplicate = messages.some(m => m._id === newMessage._id);
                if (!isDuplicate) {
                    set({ messages: [...messages, newMessage] });
                }
            }
        });

        socket.on("typing", ({ senderId }) => {
            const { typingUsers } = get();
            if (!typingUsers.includes(senderId)) {
                set({ typingUsers: [...typingUsers, senderId] });
            }
        });

        socket.on("stopTyping", ({ senderId }) => {
            const { typingUsers } = get();
            set({ typingUsers: typingUsers.filter(id => id !== senderId) });
        });
    },

    unsubscribeFromMessages: (socket) => {
        if (!socket) return;
        socket.off("newMessage");
        socket.off("typing");
        socket.off("stopTyping");
    },
}));
