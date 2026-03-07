import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, Coffee, Zap, Battery, Save, ChevronLeft, Sparkles, TrendingUp, Calendar, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';

const sleepQualities = [
    { label: 'Exhausted', icon: Battery, color: 'text-red-500', bg: 'bg-red-500/10' },
    { label: 'Tired', icon: Coffee, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { label: 'Fair', icon: Sun, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { label: 'Resting', icon: Zap, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Restorative', icon: Moon, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
];

const SleepQuality = () => {
    const navigate = useNavigate();
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

    const averageSleep = history.length > 0
        ? (history.reduce((a, b) => a + b.hours, 0) / history.length).toFixed(1)
        : '0';

    return (
        <div className="flex-1 flex flex-col h-full bg-brand-cream/30 overflow-hidden">
            <div className="px-10 py-6 border-b border-brand-grey/30 flex items-center gap-4 bg-white/40 backdrop-blur-md sticky top-0 z-10">
                <button
                    onClick={() => navigate('/')}
                    className="p-2 hover:bg-brand-grey/20 rounded-full transition-colors"
                >
                    <ChevronLeft size={20} />
                </button>
                <div>
                    <h1 className="text-xl font-bold text-brand-brown">Sleep Quality</h1>
                    <p className="text-xs text-brand-brown/50 font-medium tracking-tight uppercase tracking-widest">Rest & Recovery Insights</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10 pb-20">
                <section className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Log Sleep Section */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="flex items-center gap-2">
                            <Clock className="text-brand-purple" size={18} />
                            <h2 className="text-xl font-black text-brand-brown">Log Last Night</h2>
                        </div>

                        <Card className="p-10 bg-white/80 backdrop-blur-md border border-brand-grey/20 shadow-premium rounded-[2.5rem]">
                            {!isLogged ? (
                                <div className="space-y-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                                        <div className="relative flex items-center justify-center">
                                            {/* Circular Progress Placeholder Visual */}
                                            <svg className="w-48 h-48 transform -rotate-90">
                                                <circle
                                                    cx="96"
                                                    cy="96"
                                                    r="80"
                                                    stroke="currentColor"
                                                    strokeWidth="12"
                                                    fill="transparent"
                                                    className="text-brand-grey/20"
                                                />
                                                <motion.circle
                                                    cx="96"
                                                    cy="96"
                                                    r="80"
                                                    stroke="currentColor"
                                                    strokeWidth="12"
                                                    strokeDasharray={502}
                                                    initial={{ strokeDashoffset: 502 }}
                                                    animate={{ strokeDashoffset: 502 - (502 * (hours / 14)) }}
                                                    fill="transparent"
                                                    strokeLinecap="round"
                                                    className="text-brand-purple"
                                                />
                                            </svg>
                                            <div className="absolute flex flex-col items-center">
                                                <span className="text-4xl font-black text-brand-brown">{hours}</span>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-brand-brown/40">Hours</span>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-black uppercase tracking-widest text-brand-brown/40">Duration</span>
                                                <div className="px-3 py-1 bg-brand-purple/10 text-brand-purple text-xs font-bold rounded-full border border-brand-purple/20">
                                                    {hours >= 7 && hours <= 9 ? 'Optimal' : hours < 7 ? 'Needs More' : 'Extended'}
                                                </div>
                                            </div>
                                            <input
                                                type="range"
                                                min="1"
                                                max="14"
                                                step="0.5"
                                                value={hours}
                                                onChange={(e) => setHours(parseFloat(e.target.value))}
                                                className="w-full h-3 bg-brand-grey/20 rounded-full appearance-none cursor-pointer accent-brand-purple"
                                            />
                                            <div className="flex justify-between text-[10px] text-brand-brown/30 font-bold uppercase tracking-widest">
                                                <span>1h</span>
                                                <span>8h Target</span>
                                                <span>14h</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <h3 className="text-sm font-black uppercase tracking-widest text-brand-brown/40">How revitalized do you feel?</h3>
                                        <div className="grid grid-cols-5 gap-3">
                                            {sleepQualities.map((q) => {
                                                const Icon = q.icon;
                                                const active = selectedQuality?.label === q.label;
                                                return (
                                                    <button
                                                        key={q.label}
                                                        onClick={() => setSelectedQuality(q)}
                                                        className={`group flex flex-col items-center gap-3 p-4 rounded-3xl transition-all duration-300 ${active
                                                            ? `${q.bg} ${q.color} ring-2 ring-current shadow-soft scale-105`
                                                            : 'bg-white/40 grayscale opacity-40 hover:opacity-100 hover:grayscale-0 hover:bg-white hover:shadow-soft'
                                                            }`}
                                                    >
                                                        <Icon size={28} />
                                                        <span className="text-[10px] font-black uppercase tracking-tighter text-center leading-tight">{q.label}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleLogSleep}
                                        disabled={isSubmitting || !selectedQuality}
                                        className="w-full group flex items-center justify-center gap-3 py-5 bg-brand-brown text-white rounded-[2rem] font-black text-sm shadow-premium hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-[0.98] disabled:opacity-50"
                                    >
                                        <AnimatePresence mode="wait">
                                            {isSubmitting ? (
                                                <motion.div
                                                    key="loading"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
                                                />
                                            ) : (
                                                <motion.div
                                                    key="ready"
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="flex items-center gap-3"
                                                >
                                                    <Save size={18} className="group-hover:scale-110 transition-transform" />
                                                    RECORD SLEEP DATA
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </button>
                                </div>
                            ) : (
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="py-10 text-center space-y-6"
                                >
                                    <div className="inline-flex items-center justify-center w-20 h-20 bg-brand-sage/10 text-brand-sage rounded-[2rem] mb-2">
                                        <Sparkles size={32} />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-black text-brand-brown">Data Synchronized!</h3>
                                        <p className="text-sm text-brand-brown/60 px-10">Aura is now analyzing your rest patterns to optimize your daily wellness plan.</p>
                                    </div>
                                    <button
                                        onClick={() => setIsLogged(false)}
                                        className="px-8 py-3 rounded-full border border-brand-grey/30 text-xs font-black text-brand-brown/40 hover:bg-brand-grey/10 transition-colors uppercase tracking-widest"
                                    >
                                        Edit Entry
                                    </button>
                                </motion.div>
                            )}
                        </Card>
                    </div>

                    {/* Stats & Insights Section */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="text-brand-purple" size={18} />
                            <h2 className="text-xl font-black text-brand-brown">Sleep Stats</h2>
                        </div>

                        <div className="grid gap-6">
                            <Card className="p-8 bg-brand-brown text-white relative overflow-hidden rounded-[2.5rem] shadow-premium">
                                <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                                <div className="relative z-10 space-y-6">
                                    <div className="flex justify-between items-start">
                                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                                            <Moon size={24} className="text-brand-sage" />
                                        </div>
                                        <div className="text-right">
                                            <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Stability</p>
                                            <p className="text-xl font-black">85%</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Weekly Average</p>
                                        <h3 className="text-5xl font-black tracking-tighter">{averageSleep}h</h3>
                                    </div>
                                    <p className="text-white/60 text-xs leading-relaxed font-bold italic border-l-2 border-white/20 pl-4">
                                        "Consistency is the foundation of quality rest. Try to keep your wake-up time within a 30-minute window."
                                    </p>
                                </div>
                            </Card>

                            <Card className="p-8 bg-white border border-brand-grey/20 rounded-[2.5rem] shadow-soft">
                                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-brand-brown/40 mb-6">Recent Trends</h4>
                                <div className="space-y-4">
                                    {history.slice(-3).reverse().map((log, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-brand-cream/40 border border-brand-grey/10">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-brand-purple shadow-sm">
                                                    <Calendar size={14} />
                                                </div>
                                                <p className="text-[10px] font-black text-brand-brown/60 uppercase tracking-widest">{new Date(log.date).toLocaleDateString(undefined, { weekday: 'short' })}</p>
                                            </div>
                                            <span className="text-xs font-black text-brand-brown">{log.hours}h</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* History Section */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Calendar className="text-brand-purple" size={18} />
                            <h2 className="text-xl font-black text-brand-brown">Logging History</h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {Array.isArray(history) && history.slice().reverse().map((log, index) => (
                                <motion.div
                                    key={log.id || index}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group bg-white/60 hover:bg-white backdrop-blur-md p-6 rounded-[2rem] border border-brand-grey/20 flex flex-col gap-6 transition-all duration-300 hover:shadow-premium hover:-translate-y-1"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="p-3 bg-brand-purple/10 text-brand-purple rounded-2xl group-hover:scale-110 transition-transform">
                                            <Moon size={20} />
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-brand-brown/40 font-black uppercase tracking-widest leading-none mb-1">{new Date(log.date).toLocaleDateString()}</p>
                                            <p className="text-lg font-black text-brand-brown leading-none">{log.hours}<span className="text-[10px] ml-0.5">hrs</span></p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-brand-grey/10">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-brand-brown/30">Quality</span>
                                        <div className="text-[10px] font-black px-4 py-1.5 rounded-full bg-brand-brown text-white shadow-soft">
                                            {log.quality}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default SleepQuality;

