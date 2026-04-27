import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { MessageSquare, User, Lock } from "lucide-react";

const Login = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const { login, isLoggingIn } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(formData);
        if (success) {
            navigate("/");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center p-4 bg-blue-600 rounded-2xl text-white mb-4 shadow-lg shadow-blue-200">
                        <MessageSquare size={32} />
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h2>
                    <p className="mt-2 text-slate-500 font-medium">Sign in to continue your conversations</p>
                </div>

                <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700 ml-1">Username</label>
                            <Input
                                type="text"
                                icon={User}
                                placeholder="Enter your username"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
                            <Input
                                type="password"
                                icon={Lock}
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full h-11 text-base font-semibold shadow-lg shadow-blue-100" disabled={isLoggingIn}>
                        {isLoggingIn ? (
                            <div className="flex items-center gap-2">
                                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Signing In...
                            </div>
                        ) : "Sign In"}
                    </Button>

                    <div className="text-center pt-2">
                        <p className="text-sm text-slate-600 font-medium">
                            Don't have an account?{" "}
                            <Link to="/register" className="text-blue-600 hover:text-blue-700 font-bold transition-colors">
                                Create one
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
