import { useState, useRef } from "react";
import { Send, Smile } from "lucide-react";
import { Button } from "./ui/Button";
import { useChatStore } from "../store/useChatStore";
import { useSocketStore } from "../store/useSocketStore";
import { useAuthStore } from "../store/useAuthStore";

const MessageInput = () => {
    const [message, setMessage] = useState("");
    const { sendMessage, selectedUser } = useChatStore();
    const { socket } = useSocketStore();
    const { authUser } = useAuthStore();
    const typingTimeoutRef = useRef(null);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        await sendMessage({ message: message.trim() });
        setMessage("");
        
        if (socket && selectedUser && !selectedUser.isGroup) {
            socket.emit("stopTyping", { senderId: authUser._id, receiverId: selectedUser._id });
        }
    };

    const handleTyping = (e) => {
        setMessage(e.target.value);

        if (!socket || !selectedUser || selectedUser.isGroup) return;

        socket.emit("typing", { senderId: authUser._id, receiverId: selectedUser._id });

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            socket.emit("stopTyping", { senderId: authUser._id, receiverId: selectedUser._id });
        }, 2000);
    };

    return (
        <div className="p-4 border-t border-gray-200">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <Button type="button" variant="ghost" size="icon" className="text-gray-400">
                    <Smile size={22} />
                </Button>
                <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 bg-gray-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 text-gray-900"
                    value={message}
                    onChange={handleTyping}
                />
                <Button
                    type="submit"
                    size="icon"
                    className="rounded-xl shadow-md"
                    disabled={!message.trim()}
                >
                    <Send size={18} />
                </Button>
            </form>
        </div>
    );
};

export default MessageInput;
