import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
    authUser: JSON.parse(localStorage.getItem("chat-user")) || null,
    isSigningUp: false,
    isLoggingIn: false,

    setAuthUser: (user) => {
        if (user) localStorage.setItem("chat-user", JSON.stringify(user));
        else localStorage.removeItem("chat-user");
        set({ authUser: user });
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/user/register", data);
            toast.success("Account created successfully");
            return res.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred");
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/user/login", data);
            set({ authUser: res.data });
            localStorage.setItem("chat-user", JSON.stringify(res.data));
            toast.success("Logged in successfully");
            return res.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred");
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.get("/user/logout");
            set({ authUser: null });
            localStorage.removeItem("chat-user");
            toast.success("Logged out successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred");
        }
    },
}));
