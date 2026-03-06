import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Brain,
    Calendar as CalendarIcon,
    Smile,
    Moon,
    Wind
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid
} from 'recharts';
import MetricCard from '../components/MetricCard';
import Card from '../components/Card';
import MoodTracker from '../components/MoodTracker';

import { useAuth } from '../hooks/AuthContext';

const Dashboard = () => {
    const { user } = useAuth();
    const userName = user?.name || "Guest";
    const [moodData, setMoodData] = useState([]);
    const [sleepData, setSleepData] = useState([]);
    const [insight, setInsight] = useState("Loading your personalized insights...");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [moodRes, sleepRes, insightRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/mood/history'),
                    axios.get('http://localhost:5000/api/sleep/history'),
                    axios.get('http://localhost:5000/api/insights/summary')
                ]);
                setMoodData(moodRes.data);
                setSleepData(sleepRes.data);
                setInsight(insightRes.data.insight);
            } catch (error) {
                console.error("Dashboard Data Fetch Error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const latestMood = moodData.length > 0 ? moodData[moodData.length - 1].mood : "Positive";
    const latestSleep = sleepData.length > 0 ? sleepData[sleepData.length - 1] : { hours: 0, quality: "None" };
    const moodMap = { 'Awesome': 5, 'Great': 4, 'Good': 3, 'Meh': 2, 'Sad': 1 };
    const avgMoodValue = moodData.length > 0
        ? (moodData.reduce((acc, curr) => acc + (moodMap[curr.mood] || 3), 0) / moodData.length) * 20
        : 80;

    const getRecommendations = () => {
        if (latestMood === "Sad" || latestMood === "Meh") {
            return [
                { title: "Quick Focus Meditation", time: "5 min", icon: Wind, color: "bg-brand-lavender" },
                { title: "Hydration Check", time: "Just now", icon: Coffee, color: "bg-brand-peach" },
            ];
        } else {
            return [
                { title: "Deep Breathing Section", time: "10 min", icon: Wind, color: "bg-brand-sage" },
                { title: "Reflective Journaling", time: "15 min", icon: Brain, color: "bg-brand-lavender" },
            ];
        }
    };

    return (
        <div className="flex-1 overflow-y-auto px-10 pb-10 space-y-8 scrollbar-hide">
            <section className="flex flex-col gap-1 mt-8">
                <div className="flex items-center gap-2 text-brand-brown/40 text-xs font-medium uppercase tracking-widest">
                    <CalendarIcon size={14} />
                    {new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
                <h1 className="text-3xl font-bold">Hi, {userName}!</h1>
                <div className="flex gap-4 mt-2">
                    <Badge color="bg-brand-sage" text="Pro Member" />
                    <Badge color="bg-brand-lavender" text={user?.goal || "Exploring"} />
                    <Badge color="bg-brand-peach" text={`Feeling ${latestMood}`} />
                </div>
            </section>

            {/* Metrics Grid */}
            <section>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold">Mental Health Metrics</h2>
                    <button className="text-xs font-bold text-brand-brown/40 hover:text-brand-brown transition-colors">SEE ALL</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <MetricCard
                        title="Aura Score"
                        value={avgMoodValue}
                        label={avgMoodValue > 70 ? "Healthy" : "Stable"}
                        icon={Brain}
                        color="sage"
                        delay={0.1}
                    />
                    <MetricCard
                        title="Current Mood"
                        value={moodMap[latestMood] * 20 || 60}
                        label={latestMood}
                        icon={Smile}
                        color="peach"
                        delay={0.2}
                    />
                    <Card className="p-6 flex flex-col gap-4 bg-brand-lavender relative overflow-hidden group cursor-pointer" delay={0.3} onClick={() => window.location.href = '/sleep-quality'}>
                        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full group-hover:scale-110 transition-transform duration-700"></div>
                        <div className="z-10 bg-white/20 w-fit p-3 rounded-2xl text-white">
                            <Moon size={24} />
                        </div>
                        <div className="z-10 flex-1">
                            <h3 className="text-white/80 text-sm font-medium uppercase tracking-wider mb-1">Sleep Quality</h3>
                            <p className="text-white text-3xl font-bold">{latestSleep.hours}h</p>
                            <p className="text-white/60 text-xs mt-1">{latestSleep.quality} sleep last night.</p>
                        </div>
                        <div className="mt-4 grid grid-cols-7 gap-1">
                            {[...Array(21)].map((_, i) => (
                                <div key={i} className={`h-2 rounded-full ${i < (sleepData.length % 21) ? 'bg-white' : 'bg-white/20'}`}></div>
                            ))}
                        </div>
                    </Card>
                </div>
            </section>

            {/* Mood Trend Chart */}
            <section>
                <Card className="p-8 bg-white/40 backdrop-blur-md">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-lg font-bold">Mood Trend</h2>
                            <p className="text-xs text-brand-brown/40">Weekly emotional flow analysis</p>
                        </div>
                        <div className="flex gap-2">
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-brand-purple"></div>
                                <span className="text-[10px] font-bold text-brand-brown/40 uppercase tracking-widest">Sentiment</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={moodData.slice(-7).map(m => ({
                                name: new Date(m.date).toLocaleDateString('en-US', { weekday: 'short' }),
                                score: moodMap[m.mood] || 3
                            }))}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 600 }}
                                    dy={10}
                                />
                                <YAxis
                                    hide={true}
                                    domain={[0, 6]}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '16px',
                                        border: 'none',
                                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                        fontSize: '12px',
                                        fontWeight: '600'
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="score"
                                    stroke="#8B5CF6"
                                    strokeWidth={4}
                                    dot={{ fill: '#8B5CF6', r: 6, strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 8, strokeWidth: 0 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <MoodTracker onMoodLogged={() => window.location.reload()} />

                <Card className="p-0 overflow-hidden bg-brand-brown text-white" delay={0.5}>
                    <div className="p-8 flex flex-col h-full justify-between">
                        <div>
                            <h3 className="text-lg font-bold mb-2">AI Insights</h3>
                            <p className="text-white/60 text-sm leading-relaxed">
                                {insight || "Aura is analyzing your logs. Keep tracking to see your personalized emotional and sleep patterns here."}
                            </p>
                        </div>
                        <button
                            onClick={() => window.location.href = '/mood-analytics'}
                            className="mt-6 bg-white text-brand-brown py-3 rounded-2xl text-sm font-bold hover:bg-brand-off-white transition-colors"
                        >
                            View Detailed Report
                        </button>
                    </div>
                </Card>
            </section>

            {/* Recommendations */}
            <section className="pb-10">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold">Recommended for You</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {getRecommendations().map((item, idx) => (
                        <RecommendationItem
                            key={idx}
                            title={item.title}
                            time={item.time}
                            icon={item.icon}
                            color={item.color}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
};

function Badge({ color, text }) {
    return (
        <span className={`${color}/10 ${color.replace('bg-', 'text-')} px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-${color.replace('bg-', '')}/20`}>
            {text}
        </span>
    );
}

function RecommendationItem({ title, time, icon: Icon, color }) {
    return (
        <div className="flex items-center gap-4 p-4 rounded-3xl bg-brand-off-white border border-brand-grey/30 hover:shadow-soft hover:-translate-y-1 transition-all duration-300 cursor-pointer">
            <div className={`p-3 rounded-2xl ${color} text-white`}>
                <Icon size={20} />
            </div>
            <div className="flex-1">
                <h4 className="text-sm font-bold">{title}</h4>
                <p className="text-brand-brown/40 text-xs">{time}</p>
            </div>
        </div>
    );
}

export default Dashboard;
