import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Calendar } from 'lucide-react';
import Card from '../components/Card';
import MetricCard from '../components/MetricCard';

const MoodAnalytics = () => {
    const [moodHistory, setMoodHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMoods = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/mood/history');
                setMoodHistory(response.data);
            } catch (error) {
                console.error("Failed to fetch mood history:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMoods();
    }, []);

    const moodMap = {
        'Awesome': 5,
        'Great': 4,
        'Good': 3,
        'Meh': 2,
        'Sad': 1
    };

    const getAverageMood = () => {
        if (moodHistory.length === 0) return 0;
        const sum = moodHistory.reduce((acc, curr) => acc + (moodMap[curr.mood] || 0), 0);
        return (sum / moodHistory.length).toFixed(1);
    };

    return (
        <div className="flex-1 overflow-y-auto px-10 pb-10 space-y-8 scrollbar-hide">
            <section className="flex flex-col gap-1 mt-8">
                <div className="flex items-center gap-2 text-brand-brown/40 text-xs font-medium uppercase tracking-widest">
                    <BarChart3 size={14} />
                    Emotional Intelligence Insights
                </div>
                <h1 className="text-3xl font-bold">Mood Analytics</h1>
                <p className="text-brand-brown/60 text-sm">Visualize your emotional journey over time.</p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <MetricCard
                    title="Average Mood"
                    value={parseFloat(getAverageMood()) * 20}
                    label={getAverageMood() >= 4 ? "Excellent" : getAverageMood() >= 3 ? "Positive" : "Stable"}
                    icon={TrendingUp}
                    color="sage"
                    delay={0.1}
                />
                <MetricCard
                    title="Total Logs"
                    value={moodHistory.length}
                    label="Logs recorded"
                    icon={Calendar}
                    color="lavender"
                    delay={0.2}
                />
            </div>

            <section>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold">Recent Emotional Logs</h2>
                </div>

                {loading ? (
                    <div className="p-10 text-center text-brand-brown/40">Loading your history...</div>
                ) : moodHistory.length === 0 ? (
                    <Card className="p-10 text-center text-brand-brown/40 bg-white/40">
                        No mood data recorded yet. Head over to the Dashboard to log your first mood!
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {Array.isArray(moodHistory) && moodHistory.slice().reverse().map((log, index) => (
                            <motion.div
                                key={log.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-brand-grey/20 flex items-center gap-6"
                            >
                                <div className="text-4xl">{log.mood === 'Awesome' ? '🔥' : log.mood === 'Great' ? '🌟' : log.mood === 'Good' ? '😊' : log.mood === 'Meh' ? '😐' : '😔'}</div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-brand-brown">{log.mood}</h4>
                                        <span className="text-[10px] font-bold text-brand-brown/30 uppercase tracking-widest">
                                            {new Date(log.date).toLocaleDateString()} at {new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    {log.note && <p className="text-sm text-brand-brown/60 mt-1 italic">"{log.note}"</p>}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default MoodAnalytics;
