import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/useAuthStore";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

const App = () => {
    const { authUser } = useAuthStore();

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={authUser ? <Home /> : <Navigate to="/login" />}
                />
                <Route
                    path="/login"
                    element={!authUser ? <Login /> : <Navigate to="/" />}
                />
                <Route
                    path="/register"
                    element={!authUser ? <Register /> : <Navigate to="/" />}
                />
            </Routes>
            <Toaster position="top-center" reverseOrder={false} />
        </BrowserRouter>
    );
};

export default App;
