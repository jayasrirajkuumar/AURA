import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Play, Pause, ChevronLeft, Headphones, Sparkles, Wind, Brain, Heart, Zap, CloudRain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import YouTubePlayer from '../components/YouTubePlayer';
import axios from 'axios';

const moodConfig = {
    'Calm': { icon: Wind, color: 'text-brand-sage', bg: 'bg-brand-sage/10', fallbackId: 'ovnE1DE5XZI' },
    'Stressed': { icon: CloudRain, color: 'text-brand-purple', bg: 'bg-brand-purple/10', fallbackId: 'BAvrJ5MiJxE' },
    'Energetic': { icon: Zap, color: 'text-brand-yellow', bg: 'bg-brand-yellow/10', fallbackId: '5qap5aO4i9A' },
    'Sad': { icon: Heart, color: 'text-brand-peach', bg: 'bg-brand-peach/10', fallbackId: '9Q634yb8kQY' },
    'Focused': { icon: Brain, color: 'text-brand-brown', bg: 'bg-brand-brown/10', fallbackId: 'jfKfPfyJRdk' }
};

const MusicRecommendations = () => {
    const navigate = useNavigate();
    const [mood, setMood] = useState('Calm');
    const [aiResponse, setAiResponse] = useState('');
    const [videoId, setVideoId] = useState(moodConfig['Calm'].fallbackId);
    const [loading, setLoading] = useState(false);
    const hasFetchedRef = useRef(null);

    const moods = Object.keys(moodConfig);

    const fetchMusic = async (selectedMood) => {
        if (loading) return;
        setLoading(true);
        hasFetchedRef.current = selectedMood;

        try {
            const response = await axios.post('http://localhost:5000/api/chat', {
                message: `I'm feeling ${selectedMood}. As Aura, a professional mental health guide, recommend one specific YouTube video for music therapy. 
                Focus on WHY this music helps with being ${selectedMood}. 
                CRITICAL INSTRUCTION: Your response MUST end with the YouTube Video ID in this exact format on a new line: [VIDEO_ID: xxxxxxxx]. 
                If you don't have a specific ID, you MUST use this fallback: ${moodConfig[selectedMood].fallbackId}.`,
                provider: "gemini",
                saveHistory: false
            });

            const content = response.data.response;
            setAiResponse(content);

            // Extract Video ID with more robust regex (case-insensitive, handling potential extra characters)
            const idMatch = content.match(/\[VIDEO_ID:\s*([a-zA-Z0-9_-]+)\]/i);
            if (idMatch && idMatch[1]) {
                setVideoId(idMatch[1].trim());
            } else {
                setVideoId(moodConfig[selectedMood].fallbackId);
            }
        } catch (error) {
            console.error("Music fetch error:", error);
            setAiResponse("I'm having a little trouble connecting to my musical library, but I've selected a peaceful ambient track for you to help find your balance.");
            setVideoId(moodConfig[selectedMood].fallbackId);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (hasFetchedRef.current !== mood) {
            fetchMusic(mood);
        }
    }, [mood]);

    return (
        <div className="flex-1 flex flex-col h-full bg-brand-cream/30 overflow-hidden">
            <div className="px-10 py-6 border-b border-brand-grey/30 flex items-center justify-between bg-white/40 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/')}
                        className="p-2 hover:bg-brand-grey/20 rounded-full transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-brand-brown">Music Therapy</h1>
                        <p className="text-xs text-brand-brown/50 font-medium tracking-tight uppercase tracking-widest">AI-Curated Healing Sounds</p>
                    </div>
                </div>
                <button
                    onClick={() => fetchMusic(mood)}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-brand-purple hover:bg-brand-purple/10 rounded-xl transition-colors disabled:opacity-50"
                >
                    <Sparkles size={14} />
                    Try Another Track
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10 pb-20">
                <section className="space-y-6">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-brand-brown/40">Current Vibe</h2>
                        <p className="text-3xl font-black text-brand-brown">How is your heart feeling?</p>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        {moods.map((m) => {
                            const Config = moodConfig[m];
                            const Icon = Config.icon;
                            return (
                                <button
                                    key={m}
                                    onClick={() => setMood(m)}
                                    className={`group flex items-center gap-3 px-6 py-4 rounded-3xl text-sm font-bold border transition-all duration-300 ${mood === m
                                        ? 'bg-brand-brown text-white border-brand-brown shadow-premium scale-105'
                                        : 'bg-white text-brand-brown/60 border-brand-grey/20 hover:border-brand-brown/40 hover:shadow-soft'
                                        }`}
                                >
                                    <div className={`p-2 rounded-xl transition-colors ${mood === m ? 'bg-white/20' : Config.bg + ' ' + Config.color}`}>
                                        <Icon size={18} />
                                    </div>
                                    {m}
                                </button>
                            );
                        })}
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                    <div className="lg:col-span-3 space-y-6">
                        <div className="flex items-center gap-2">
                            <Play className="text-brand-purple fill-brand-purple" size={18} />
                            <h2 className="text-xl font-black text-brand-brown">Therapeutic Player</h2>
                        </div>

                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-brand-purple/20 to-brand-peach/20 rounded-[2.5rem] blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                            <YouTubePlayer videoId={videoId} title={`Music therapy for ${mood}`} />
                        </div>

                        <Card className="p-8 bg-brand-brown/5 border-none shadow-none rounded-[2.5rem] flex items-center gap-6">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-brand-purple shadow-soft shrink-0">
                                <Headphones size={28} />
                            </div>
                            <div>
                                <h4 className="font-black text-brand-brown text-lg">Sound Science</h4>
                                <p className="text-sm text-brand-brown/70 leading-relaxed font-medium">
                                    This track has been selected based on your <span className="text-brand-purple font-bold">{mood}</span> mood to help regulate your nervous system and promote emotional balance.
                                </p>
                            </div>
                        </Card>
                    </div>

                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center gap-2">
                            <Sparkles className="text-brand-purple" size={18} />
                            <h2 className="text-xl font-black text-brand-brown">Aura's Insights</h2>
                        </div>

                        <Card className="p-8 bg-white/80 backdrop-blur-md border border-brand-grey/20 shadow-premium min-h-[400px] rounded-[2.5rem] flex flex-col relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <Music size={120} />
                            </div>

                            <AnimatePresence mode="wait">
                                {loading ? (
                                    <motion.div
                                        key="loading"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex-1 flex flex-col items-center justify-center gap-6"
                                    >
                                        <div className="relative">
                                            <div className="w-16 h-16 border-4 border-brand-purple/10 border-t-brand-purple rounded-full animate-spin"></div>
                                            <Music className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-brand-purple/30 animate-pulse" size={24} />
                                        </div>
                                        <div className="text-center space-y-2">
                                            <p className="text-brand-brown font-black text-xs uppercase tracking-[0.3em]">Curating Therapy</p>
                                            <p className="text-brand-brown/40 text-[10px] font-bold uppercase tracking-widest animate-pulse">Scanning healing frequencies...</p>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="content"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex-1 flex flex-col"
                                    >
                                        <div className="prose prose-sm max-w-none text-brand-brown/80 font-medium leading-relaxed italic border-l-4 border-brand-purple/20 pl-6 mb-8 py-2">
                                            {aiResponse.replace(/\[VIDEO_ID:.*?\]/g, '').trim()}
                                        </div>

                                        <div className="mt-auto space-y-4">
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-brown/30">Session Focus</p>
                                            <div className="flex flex-wrap gap-2">
                                                <span className="px-3 py-1 bg-brand-purple/5 text-brand-purple text-[10px] font-bold rounded-full border border-brand-purple/10 capitalize">{mood} Relief</span>
                                                <span className="px-3 py-1 bg-brand-sage/5 text-brand-sage text-[10px] font-bold rounded-full border border-brand-sage/10">Sonic Healing</span>
                                                <span className="px-3 py-1 bg-brand-peach/5 text-brand-peach text-[10px] font-bold rounded-full border border-brand-peach/10">Aura Guiding</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MusicRecommendations;

