import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { MessageSquare, User, Lock, UserCircle, Users } from "lucide-react";

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        username: "",
        password: "",
        confirmPassword: "",
        gender: "male",
    });

    const { signup, isSigningUp } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await signup(formData);
        if (success) {
            navigate("/login");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 py-12">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center p-4 bg-blue-600 rounded-2xl text-white mb-4 shadow-lg shadow-blue-200">
                        <MessageSquare size={32} />
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create Account</h2>
                    <p className="mt-2 text-slate-500 font-medium">Join our secure messaging platform</p>
                </div>

                <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700 ml-1">Full Name</label>
                            <Input
                                type="text"
                                icon={UserCircle}
                                placeholder="John Doe"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700 ml-1">Username</label>
                            <Input
                                type="text"
                                icon={User}
                                placeholder="johndoe123"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
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
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700 ml-1">Confirm</label>
                                <Input
                                    type="password"
                                    icon={Lock}
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700 ml-1 flex items-center gap-2">
                                <Users size={16} /> Gender
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, gender: "male" })}
                                    className={`py-2 text-sm font-medium rounded-lg border transition-all ${
                                        formData.gender === "male"
                                            ? "bg-blue-50 border-blue-500 text-blue-700"
                                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                                    }`}
                                >
                                    Male
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, gender: "female" })}
                                    className={`py-2 text-sm font-medium rounded-lg border transition-all ${
                                        formData.gender === "female"
                                            ? "bg-blue-50 border-blue-500 text-blue-700"
                                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                                    }`}
                                >
                                    Female
                                </button>
                            </div>
                        </div>
                    </div>

                    <Button type="submit" className="w-full h-11 text-base font-semibold shadow-lg shadow-blue-100" disabled={isSigningUp}>
                        {isSigningUp ? (
                             <div className="flex items-center gap-2">
                                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Creating...
                            </div>
                        ) : "Sign Up"}
                    </Button>

                    <div className="text-center pt-2">
                        <p className="text-sm text-slate-600 font-medium">
                            Already have an account?{" "}
                            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-bold transition-colors">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
