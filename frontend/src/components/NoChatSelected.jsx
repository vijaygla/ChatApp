import React from "react";
import { MessageSquare } from "lucide-react";

const NoChatSelected = () => {
    return (
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-8 text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6 animate-bounce">
                <MessageSquare size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Welcome to ChatApp</h2>
            <p className="mt-2 text-gray-600 max-w-sm">
                Select a conversation from the sidebar to start messaging with your friends and colleagues.
            </p>
        </div>
    );
};

export default NoChatSelected;
