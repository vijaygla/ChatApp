import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useSocketStore } from "../store/useSocketStore";
import { Avatar } from "./ui/Avatar";
import { Search, LogOut, Users, MessageCircle } from "lucide-react";
import { Button } from "./ui/Button";
import { format } from "date-fns";

const Sidebar = () => {
    const { users, getUsers, selectedUser, setSelectedUser, isUsersLoading, typingUsers } = useChatStore();
    const { authUser, logout } = useAuthStore();
    const { onlineUsers } = useSocketStore();
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        getUsers();
    }, [getUsers]);

    const filteredUsers = users.filter((user) =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-80 h-full border-r border-slate-200 flex flex-col bg-white shrink-0">
            {/* User Profile Header */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Avatar src={authUser.profilePhoto} alt={authUser.fullName} online={true} className="border-2 border-white shadow-sm" />
                    <div className="flex flex-col">
                        <p className="font-bold text-slate-900 text-sm truncate max-w-[120px]">
                            {authUser.fullName}
                        </p>
                        <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider">Online</p>
                    </div>
                </div>
                <Button variant="ghost" size="icon" onClick={logout} className="text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all rounded-full">
                    <LogOut size={18} />
                </Button>
            </div>

            {/* Search Bar */}
            <div className="p-4">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-transparent border-2 focus:border-blue-500 focus:bg-white rounded-xl text-sm transition-all focus:outline-none text-slate-900 font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="px-5 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
                    <span>Recent Chats</span>
                    <MessageCircle size={12} />
                </div>
                
                {isUsersLoading ? (
                    <div className="flex flex-col items-center justify-center p-8 gap-3">
                        <div className="w-8 h-8 border-4 border-slate-100 border-t-blue-500 rounded-full animate-spin" />
                        <p className="text-xs text-slate-400 font-medium">Loading chats...</p>
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="p-8 text-center">
                        <p className="text-sm text-slate-400">No conversations found</p>
                    </div>
                ) : (
                    filteredUsers.map((user) => {
                        const isTyping = typingUsers.includes(user._id);
                        
                        return (
                            <button
                                key={user._id}
                                onClick={() => setSelectedUser(user)}
                                className={`w-full px-4 py-3.5 flex items-center gap-3 transition-all relative group ${
                                    selectedUser?._id === user._id 
                                        ? "bg-blue-50/80" 
                                        : "hover:bg-slate-50"
                                }`}
                            >
                                {selectedUser?._id === user._id && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-full" />
                                )}
                                
                                <div className="relative">
                                    <Avatar
                                        src={user.profilePhoto}
                                        alt={user.fullName}
                                        online={!user.isGroup && onlineUsers.includes(user._id)}
                                        className="w-11 h-11 shadow-sm"
                                    />
                                    {user.isGroup && (
                                        <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-0.5 rounded-full border-2 border-white">
                                            <Users size={10} />
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 text-left overflow-hidden">
                                    <div className="flex items-center justify-between gap-2">
                                        <p className={`text-sm font-bold truncate ${selectedUser?._id === user._id ? "text-blue-700" : "text-slate-800"}`}>
                                            {user.fullName}
                                        </p>
                                        <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                                            {user.lastMessage ? format(new Date(user.lastMessage.createdAt), "HH:mm") : ""}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between gap-1">
                                        {isTyping ? (
                                            <p className="text-[11px] text-blue-500 font-bold truncate flex-1 animate-pulse">
                                                typing...
                                            </p>
                                        ) : (
                                            <p className="text-[11px] text-slate-500 font-medium truncate flex-1">
                                                {user.lastMessage ? user.lastMessage.message : (user.isGroup ? "Group Chat" : (onlineUsers.includes(user._id) ? "Active now" : "Offline"))}
                                            </p>
                                        )}
                                        {!user.isGroup && onlineUsers.includes(user._id) && !isTyping && (
                                            <span className="flex h-1.5 w-1.5 rounded-full bg-green-500 shadow-sm shadow-green-200" />
                                        )}
                                    </div>
                                </div>
                            </button>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default Sidebar;
