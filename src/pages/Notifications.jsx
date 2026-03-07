import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, Trash2, BellOff, Info, AlertTriangle, Star, Clock, ChevronRight } from 'lucide-react';
import axios from 'axios';
import Card from '../components/Card';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/notifications');
            setNotifications(response.data);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await axios.put(`http://localhost:5000/api/notifications/${id}/read`);
            setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
        }
    };

    const handleClearAll = async () => {
        if (!window.confirm("Are you sure you want to clear all notifications?")) return;
        try {
            await axios.delete('http://localhost:5000/api/notifications');
            setNotifications([]);
        } catch (error) {
            console.error("Failed to clear notifications:", error);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'insight': return <Info className="text-blue-500" size={18} />;
            case 'warning': return <AlertTriangle className="text-amber-500" size={18} />;
            case 'achievement': return <Star className="text-yellow-500" size={18} />;
            default: return <Bell className="text-brand-purple" size={18} />;
        }
    };

    const filteredNotifications = notifications.filter(n => {
        if (filter === 'all') return true;
        if (filter === 'unread') return !n.read;
        return n.type === filter;
    });

    return (
        <div className="flex-1 flex flex-col h-full bg-brand-cream/30 overflow-hidden">
            <div className="px-10 py-6 border-b border-brand-grey/30 flex items-center justify-between bg-white/40 backdrop-blur-md sticky top-0 z-10">
                <div>
                    <h1 className="text-xl font-bold text-brand-brown">Notification Center</h1>
                    <p className="text-xs text-brand-brown/50 font-medium tracking-tight uppercase tracking-widest">Your journey updates and insights</p>
                </div>
                <button
                    onClick={handleClearAll}
                    disabled={notifications.length === 0}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-brand-brown/40 hover:text-red-500 transition-colors disabled:opacity-30"
                >
                    <Trash2 size={14} />
                    Clear All
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-10 pb-20 scrollbar-hide">
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Filters */}
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {['all', 'unread', 'insight', 'achievement', 'system'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${filter === f
                                    ? 'bg-brand-brown text-white border-brand-brown shadow-premium'
                                    : 'bg-white/60 text-brand-brown/40 border-brand-grey/10 hover:border-brand-brown/20'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-4">
                        <AnimatePresence mode="popLayout">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-20 gap-4">
                                    <div className="w-10 h-10 border-4 border-brand-purple/10 border-t-brand-purple rounded-full animate-spin"></div>
                                    <p className="text-xs font-black uppercase tracking-widest text-brand-brown/30">Loading alerts...</p>
                                </div>
                            ) : filteredNotifications.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-center py-20 space-y-4"
                                >
                                    <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto text-brand-brown/10 border border-brand-grey/10">
                                        <BellOff size={40} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-brand-brown">All caught up!</h3>
                                        <p className="text-sm text-brand-brown/40">No notifications to show in this category.</p>
                                    </div>
                                </motion.div>
                            ) : (
                                filteredNotifications.map((n) => (
                                    <motion.div
                                        key={n.id}
                                        layout
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className={`group relative overflow-hidden bg-white rounded-3xl border border-brand-grey/10 transition-all ${!n.read ? 'shadow-premium ring-1 ring-brand-purple/5' : 'opacity-60 grayscale-[0.5]'
                                            }`}
                                    >
                                        <div className="flex items-start gap-6 p-6">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-soft shrink-0 ${!n.read ? 'bg-brand-cream' : 'bg-brand-grey/10'
                                                }`}>
                                                {getIcon(n.type)}
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <h4 className={`text-sm font-black text-brand-brown ${!n.read ? '' : 'text-brand-brown/60'}`}>
                                                        {n.title}
                                                    </h4>
                                                    <div className="flex items-center gap-2 text-[10px] font-bold text-brand-brown/30">
                                                        <Clock size={10} />
                                                        {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>
                                                <p className="text-sm text-brand-brown/60 leading-relaxed">
                                                    {n.message}
                                                </p>
                                            </div>
                                            {!n.read && (
                                                <button
                                                    onClick={() => handleMarkAsRead(n.id)}
                                                    className="p-2 hover:bg-brand-sage/10 rounded-xl text-brand-sage transition-colors"
                                                    title="Mark as read"
                                                >
                                                    <Check size={18} />
                                                </button>
                                            )}
                                        </div>
                                        {!n.read && (
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-purple"></div>
                                        )}
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notifications;
