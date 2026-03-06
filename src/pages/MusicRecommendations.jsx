import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Music, Play, Pause, ChevronLeft, Headphones, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import axios from 'axios';

const MusicRecommendations = () => {
    const navigate = useNavigate();
    const [mood, setMood] = useState('Calm');
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);

    // Mock moods for selection
    const moods = ['Calm', 'Stressed', 'Energetic', 'Sad', 'Focused'];

    const fetchMusic = async (selectedMood) => {
        setLoading(true);
        try {
            // Re-using the chat logic but with a specific music prompt
            const response = await axios.post('http://localhost:5000/api/chat', {
                message: `I'm feeling ${selectedMood}. Can you recommend 3 specific music tracks or styles? Format as a JSON-like list but in your supportive tone.`,
                provider: "huggingface"
            });
            // Simple parsing of AI response (this is a bit naive but works for the demo)
            // In a real app, we'd have a structured output model
            setRecommendations(response.data.response);
        } catch (error) {
            console.error("Music fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMusic(mood);
    }, [mood]);

    return (
        <div className="flex-1 flex flex-col h-full bg-brand-cream/30 overflow-hidden">
            <div className="px-10 py-6 border-b border-brand-grey/30 flex items-center gap-4 bg-white/40">
                <button
                    onClick={() => navigate('/')}
                    className="p-2 hover:bg-brand-grey/20 rounded-full transition-colors"
                >
                    <ChevronLeft size={20} />
                </button>
                <div>
                    <h1 className="text-xl font-bold text-brand-brown">Music Therapy</h1>
                    <p className="text-xs text-brand-brown/50 font-medium tracking-tight">AI-curated sounds for your soul</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-10">
                <section className="space-y-4">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-brand-brown/40">How are you feeling?</h2>
                    <div className="flex flex-wrap gap-3">
                        {moods.map((m) => (
                            <button
                                key={m}
                                onClick={() => setMood(m)}
                                className={`px-6 py-2.5 rounded-full text-sm font-bold border transition-all ${mood === m
                                    ? 'bg-brand-brown text-white border-brand-brown shadow-soft'
                                    : 'bg-white text-brand-brown/60 border-brand-grey/20 hover:border-brand-brown/40'
                                    }`}
                            >
                                {m}
                            </button>
                        ))}
                    </div>
                </section>

                <section className="space-y-6">
                    <div className="flex items-center gap-2">
                        <Sparkles className="text-brand-purple" size={20} />
                        <h2 className="text-xl font-bold text-brand-brown">Aura's Suggestions</h2>
                    </div>

                    <Card className="p-8 bg-white/80 backdrop-blur-md border-brand-grey/20 shadow-premium min-h-[300px] flex flex-col">
                        {loading ? (
                            <div className="flex-1 flex flex-col items-center justify-center gap-4">
                                <div className="w-12 h-12 border-4 border-brand-purple/20 border-t-brand-purple rounded-full animate-spin"></div>
                                <p className="text-brand-brown/40 font-bold text-sm tracking-widest animate-pulse">CURATING SOUNDS...</p>
                            </div>
                        ) : (
                            <div className="prose prose-sm max-w-none text-brand-brown whitespace-pre-wrap">
                                {recommendations}
                            </div>
                        )}

                        <div className="mt-8 pt-6 border-t border-brand-grey/10 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-brand-purple/10 rounded-full flex items-center justify-center text-brand-purple">
                                    <Headphones size={20} />
                                </div>
                                <p className="text-xs font-bold text-brand-brown/60 uppercase tracking-widest">Personalized set for {mood}</p>
                            </div>
                            <button className="flex items-center gap-2 px-6 py-2.5 bg-brand-brown text-white rounded-full text-xs font-bold hover:scale-105 transition-transform active:scale-95">
                                <Play size={14} fill="currentColor" />
                                Listen Now
                            </button>
                        </div>
                    </Card>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-[2.5rem] bg-brand-sage/10 border border-brand-sage/20 flex gap-5 items-center">
                        <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-brand-sage shadow-soft">
                            <Music size={28} />
                        </div>
                        <div>
                            <h4 className="font-black text-brand-brown leading-tight">Binaural Beats</h4>
                            <p className="text-xs text-brand-brown/60 font-medium">Deep focus & cognitive flow</p>
                        </div>
                    </div>
                    <div className="p-6 rounded-[2.5rem] bg-brand-peach/10 border border-brand-peach/20 flex gap-5 items-center">
                        <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-brand-peach shadow-soft">
                            <Sparkles size={28} />
                        </div>
                        <div>
                            <h4 className="font-black text-brand-brown leading-tight">Nature Ambience</h4>
                            <p className="text-xs text-brand-brown/60 font-medium">Stress reduction & calm</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default MusicRecommendations;
