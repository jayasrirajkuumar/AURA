import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [registeredUsers, setRegisteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock session check
        const savedUser = localStorage.getItem('aura_user');
        const savedUsers = localStorage.getItem('aura_registered_users');

        if (savedUsers) {
            setRegisteredUsers(JSON.parse(savedUsers));
        }

        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('aura_user', JSON.stringify(userData));
    };

    const signup = (userData) => {
        // Update local user state
        setUser(userData);
        localStorage.setItem('aura_user', JSON.stringify(userData));

        // Update registered users list
        const updatedUsers = [...registeredUsers, userData];
        setRegisteredUsers(updatedUsers);
        localStorage.setItem('aura_registered_users', JSON.stringify(updatedUsers));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('aura_user');
    };

    const updateProfile = (updates) => {
        const newUser = { ...user, ...updates };
        setUser(newUser);
        localStorage.setItem('aura_user', JSON.stringify(newUser));
    };

    return (
        <AuthContext.Provider value={{ user, registeredUsers, loading, login, signup, logout, updateProfile }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
