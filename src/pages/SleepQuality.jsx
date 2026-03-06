import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, Coffee, Zap, Battery } from 'lucide-react';
import Card from '../components/Card';

const sleepQualities = [
    { label: 'Exhausted', icon: Battery, color: 'text-red-500 bg-red-50' },
    { label: 'Tired', icon: Coffee, color: 'text-orange-500 bg-orange-50' },
    { label: 'Fair', icon: Sun, color: 'text-yellow-500 bg-yellow-50' },
    { label: 'Resting', icon: Zap, color: 'text-blue-500 bg-blue-50' },
    { label: 'Restorative', icon: Moon, color: 'text-indigo-500 bg-indigo-50' },
];

const SleepQuality = () => {
    const [hours, setHours] = useState(7);
    const [selectedQuality, setSelectedQuality] = useState(null);
    const [history, setHistory] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLogged, setIsLogged] = useState(false);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/sleep/history');
            setHistory(response.data);
        } catch (error) {
            console.error("Failed to fetch sleep history:", error);
        }
    };

    const handleLogSleep = async () => {
        if (!selectedQuality) return;
        setIsSubmitting(true);
        try {
            await axios.post('http://localhost:5000/api/sleep', {
                hours,
                quality: selectedQuality.label
            });
            setIsLogged(true);
            fetchHistory();
        } catch (error) {
            console.error("Failed to log sleep:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex-1 overflow-y-auto px-10 pb-10 space-y-8 scrollbar-hide">
            <section className="flex flex-col gap-1 mt-8">
                <div className="flex items-center gap-2 text-brand-brown/40 text-xs font-medium uppercase tracking-widest">
                    <Moon size={14} />
                    Rest & Recovery
                </div>
                <h1 className="text-3xl font-bold">Sleep Quality</h1>
                <p className="text-brand-brown/60 text-sm">Understand how rest affects your daily energy and mood.</p>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Log Sleep Card */}
                <Card className="p-8 bg-white/60 backdrop-blur-md">
                    <h2 className="text-xl font-bold mb-6">How was your sleep?</h2>

                    {!isLogged ? (
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-brand-brown/60">Duration</span>
                                    <span className="text-2xl font-bold text-brand-purple">{hours}h</span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="14"
                                    step="0.5"
                                    value={hours}
                                    onChange={(e) => setHours(parseFloat(e.target.value))}
                                    className="w-full h-2 bg-brand-grey/30 rounded-full appearance-none cursor-pointer accent-brand-purple"
                                />
                                <div className="flex justify-between text-[10px] text-brand-brown/30 font-bold uppercase tracking-widest">
                                    <span>Minimal (1h)</span>
                                    <span>Optimal (8h)</span>
                                    <span>Maximal (14h)</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <span className="text-sm font-bold text-brand-brown/60 block">Quality</span>
                                <div className="grid grid-cols-5 gap-2">
                                    {sleepQualities.map((q) => {
                                        const Icon = q.icon;
                                        const active = selectedQuality?.label === q.label;
                                        return (
                                            <button
                                                key={q.label}
                                                onClick={() => setSelectedQuality(q)}
                                                className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-300 ${active ? `${q.color} ring-2 ring-current scale-105 shadow-md` : 'bg-white/40 grayscale opacity-40 hover:opacity-100 hover:grayscale-0'
                                                    }`}
                                            >
                                                <Icon size={24} />
                                                <span className="text-[10px] font-bold uppercase tracking-wider">{q.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <button
                                onClick={handleLogSleep}
                                disabled={isSubmitting || !selectedQuality}
                                className="w-full py-4 bg-brand-purple text-white rounded-2xl font-bold text-sm shadow-lg shadow-brand-purple/20 hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-[0.98] disabled:opacity-50"
                            >
                                {isSubmitting ? 'Recording...' : 'Record Last Night\'s Sleep'}
                            </button>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="py-10 text-center"
                        >
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold">Good morning!</h3>
                            <p className="text-sm text-brand-brown/60">Sleep data recorded. Aura will analyze this for your daily insights.</p>
                            <button
                                onClick={() => setIsLogged(false)}
                                className="mt-6 text-xs text-brand-purple font-bold hover:underline"
                            >
                                Edit Entry
                            </button>
                        </motion.div>
                    )}
                </Card>

                {/* Sleep Summary Card */}
                <Card className="p-8 bg-brand-brown text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                    <div className="relative z-10 space-y-6">
                        <h2 className="text-xl font-bold">Sleep Insights</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-md border border-white/10">
                                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Weekly Avg</p>
                                <p className="text-2xl font-bold">
                                    {history.length > 0
                                        ? (history.reduce((a, b) => a + b.hours, 0) / history.length).toFixed(1)
                                        : '0'}h
                                </p>
                            </div>
                            <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-md border border-white/10">
                                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Stability</p>
                                <p className="text-2xl font-bold">85%</p>
                            </div>
                        </div>
                        <p className="text-white/60 text-sm leading-relaxed italic">
                            "Consistent sleep schedules help regulate your circadian rhythm, leading to 23% better mood stability over time."
                        </p>
                    </div>
                </Card>
            </section>

            {/* History Table */}
            <section>
                <h3 className="text-lg font-bold mb-6">Past Logs</h3>
                <div className="space-y-4">
                    {Array.isArray(history) && history.slice().reverse().map((log, index) => (
                        <motion.div
                            key={log.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white/40 backdrop-blur-md p-4 rounded-2xl border border-brand-grey/20 flex items-center justify-between"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-brand-purple/10 text-brand-purple rounded-xl">
                                    <Moon size={18} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-brand-brown">{log.hours} hours slept</p>
                                    <p className="text-[10px] text-brand-brown/40 uppercase tracking-widest">{new Date(log.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="text-xs font-bold px-3 py-1 rounded-full bg-brand-cream border border-brand-grey/30">
                                {log.quality}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default SleepQuality;
