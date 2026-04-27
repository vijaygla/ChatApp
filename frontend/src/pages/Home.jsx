import React, { useEffect } from "react";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useSocketStore } from "../store/useSocketStore";

const Home = () => {
    const { selectedUser } = useChatStore();
    const { authUser } = useAuthStore();
    const { connectSocket, disconnectSocket } = useSocketStore();

    useEffect(() => {
        if (authUser) {
            connectSocket(authUser._id);
        }
        return () => disconnectSocket();
    }, [authUser, connectSocket, disconnectSocket]);

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            <div className="flex w-full max-w-7xl mx-auto my-4 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
                <Sidebar />
                {selectedUser ? <ChatContainer /> : <NoChatSelected />}
            </div>
        </div>
    );
};

export default Home;
