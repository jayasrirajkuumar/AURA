import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('aura_user');
        if (savedUser) {
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser);
            axios.defaults.headers.common['x-user-id'] = parsedUser.id;
        }
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        try {
            const response = await axios.post("http://localhost:5000/api/user/login", credentials);
            const userData = response.data;
            setUser(userData);
            axios.defaults.headers.common['x-user-id'] = userData.id;
            localStorage.setItem('aura_user', JSON.stringify(userData));
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || "Login failed" };
        }
    };

    const signup = async (userData) => {
        try {
            const response = await axios.post("http://localhost:5000/api/user/signup", userData);
            const newUser = response.data;
            setUser(newUser);
            axios.defaults.headers.common['x-user-id'] = newUser.id;
            localStorage.setItem('aura_user', JSON.stringify(newUser));
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || "Signup failed" };
        }
    };

    const logout = () => {
        setUser(null);
        delete axios.defaults.headers.common['x-user-id'];
        localStorage.removeItem('aura_user');
    };

    const updateProfile = async (updates) => {
        if (!user) return;
        try {
            const response = await axios.put(`http://localhost:5000/api/user/profile/${user.id}`, updates);
            const updatedUser = response.data;
            setUser(updatedUser);
            axios.defaults.headers.common['x-user-id'] = updatedUser.id;
            localStorage.setItem('aura_user', JSON.stringify(updatedUser));
            return { success: true };
        } catch (error) {
            return { success: false, message: "Update failed" };
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout, updateProfile }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
