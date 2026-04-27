import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useSocketStore } from "../store/useSocketStore";
import { Avatar } from "./ui/Avatar";
import MessageInput from "./MessageInput";
import { format } from "date-fns";

const ChatContainer = () => {
    const { messages, getMessages, isMessagesLoading, selectedUser, subscribeToMessages, unsubscribeFromMessages, typingUsers } = useChatStore();
    const { authUser } = useAuthStore();
    const { socket, onlineUsers } = useSocketStore();
    const messageEndRef = useRef(null);

    const isTyping = typingUsers.includes(selectedUser?._id);

    useEffect(() => {
        getMessages(selectedUser._id);
        subscribeToMessages(socket);
        return () => unsubscribeFromMessages(socket);
    }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages, socket]);

    useEffect(() => {
        if (messageEndRef.current && (messages || isTyping)) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isTyping]);

    return (
        <div className="flex-1 flex flex-col h-full bg-white">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Avatar 
                        src={selectedUser.profilePhoto} 
                        alt={selectedUser.fullName} 
                        online={!selectedUser.isGroup && onlineUsers.includes(selectedUser._id)}
                    />
                    <div>
                        <p className="font-bold text-gray-900">{selectedUser.fullName}</p>
                        <p className="text-xs text-gray-500">
                            {selectedUser.isGroup ? `${selectedUser.participants?.length} participants` : (onlineUsers.includes(selectedUser._id) ? "Active now" : "Offline")}
                        </p>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                {isMessagesLoading ? (
                    <div className="text-center text-gray-500 mt-10">Loading messages...</div>
                ) : messages.length === 0 ? (
                    <div className="text-center text-gray-400 mt-10 italic">No messages yet. Say hi!</div>
                ) : (
                    messages.map((message) => (
                        <div
                            key={message._id}
                            className={`flex ${message.senderId === authUser._id ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[70%] rounded-2xl px-4 py-2 shadow-sm ${
                                    message.senderId === authUser._id
                                        ? "bg-blue-600 text-white rounded-br-none"
                                        : "bg-white text-gray-900 rounded-bl-none border border-gray-100"
                                }`}
                            >
                                <p className="text-sm break-words">{message.message}</p>
                                <p
                                    className={`text-[10px] mt-1 ${
                                        message.senderId === authUser._id ? "text-blue-100" : "text-gray-400"
                                    }`}
                                >
                                    {format(new Date(message.createdAt), "HH:mm")}
                                </p>
                            </div>
                        </div>
                    ))
                )}
                
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-white text-gray-900 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm border border-gray-100 flex gap-1 items-center w-fit">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                        </div>
                    </div>
                )}

                <div ref={messageEndRef} />
            </div>

            {/* Input */}
            <MessageInput />
        </div>
    );
};

export default ChatContainer;
