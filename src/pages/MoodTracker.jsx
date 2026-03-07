import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, History, ArrowRight, MessageCircle } from 'lucide-react';
import MoodTrackerComponent from '../components/MoodTracker';

const MoodTracker = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchHistory = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/mood/history');
            setHistory(response.data);
        } catch (error) {
            console.error('Failed to fetch mood history:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 17) return "Good Afternoon";
        return "Good Evening";
    };

    return (
        <div className="flex-1 overflow-y-auto px-10 pb-10 space-y-10 scrollbar-hide">
            {/* Header Section */}
            <section className="flex flex-col gap-1 mt-8">
                <div className="flex items-center gap-2 text-brand-brown/70 text-xs font-black uppercase tracking-widest">
                    <Heart size={14} className="text-brand-peach" />
                    Emotional Wellbeing
                </div>
                <h1 className="text-4xl font-black tracking-tight text-brand-brown">
                    {getGreeting()}, <span className="text-brand-sage">Ready to Reflect?</span>
                </h1>
                <p className="text-brand-brown/70 text-sm max-w-xl font-medium">
                    Logging your mood creates a map of your emotional landscape. It helps AURA understand the patterns in your life.
                </p>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Tracker Main */}
                <div className="lg:col-span-7">
                    <MoodTrackerComponent onMoodLogged={fetchHistory} />
                </div>

                {/* Quick History / Guidance */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-white/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/40 shadow-soft">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-brand-sage/20 p-2 rounded-xl text-brand-sage">
                                <History size={20} />
                            </div>
                            <h3 className="font-bold text-brand-brown">Recent Reflections</h3>
                        </div>

                        {loading ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-16 bg-brand-grey/10 rounded-2xl animate-pulse"></div>
                                ))}
                            </div>
                        ) : history.length === 0 ? (
                            <div className="py-10 text-center space-y-3">
                                <div className="text-4xl">🌱</div>
                                <p className="text-sm text-brand-brown/40 font-medium italic">
                                    Your emotional seed is waiting to be planted. Log your first mood to see progress.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {history.slice(-3).reverse().map((log, index) => (
                                    <motion.div
                                        key={log.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-center gap-4 bg-white/60 p-4 rounded-2xl border border-brand-grey/10"
                                    >
                                        <div className="text-2xl">
                                            {log.mood === 'Awesome' ? '🔥' : log.mood === 'Great' ? '🌟' : log.mood === 'Good' ? '😊' : log.mood === 'Meh' ? '😐' : '😔'}
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-[10px] font-black uppercase tracking-widest text-brand-brown/50">
                                                {new Date(log.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                            </div>
                                            <div className="text-sm font-black text-brand-brown">{log.mood}</div>
                                        </div>
                                    </motion.div>
                                ))}
                                <button
                                    onClick={() => window.location.href = '/mood-analytics'}
                                    className="w-full py-3 text-xs font-black uppercase tracking-widest text-brand-brown/60 hover:text-brand-sage transition-colors flex items-center justify-center gap-2"
                                >
                                    View Full Analytics <ArrowRight size={14} />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="bg-brand-sage text-white p-8 rounded-[2.5rem] shadow-premium relative overflow-hidden group">
                        <div className="relative z-10 space-y-4">
                            <div className="bg-white/20 w-fit p-2 rounded-xl">
                                <Sparkles size={20} />
                            </div>
                            <h3 className="text-xl font-black uppercase tracking-tight">AURA Guidance</h3>
                            <p className="text-white text-sm leading-relaxed font-semibold">
                                "Emotions are data, not directives. By naming your feeling, you decrease the activity in the amygdala, helping you stay grounded."
                            </p>
                            <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest mt-4 group-hover:gap-3 transition-all">
                                Learn More <ArrowRight size={14} />
                            </button>
                        </div>
                        {/* Decorative background element */}
                        <div className="absolute top-[-20%] right-[-20%] w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MoodTracker;
