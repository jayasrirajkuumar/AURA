import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const moods = [
    { emoji: '😔', label: 'Sad', value: 1, color: 'bg-blue-100 text-blue-600' },
    { emoji: '😐', label: 'Meh', value: 2, color: 'bg-gray-100 text-gray-600' },
    { emoji: '😊', label: 'Good', value: 3, color: 'bg-green-100 text-green-600' },
    { emoji: '🌟', label: 'Great', value: 4, color: 'bg-yellow-100 text-yellow-600' },
    { emoji: '🔥', label: 'Awesome', value: 5, color: 'bg-orange-100 text-orange-600' },
];

const activities = [
    { id: 'work', label: 'Work', emoji: '💼' },
    { id: 'exercise', label: 'Exercise', emoji: '🏃' },
    { id: 'social', label: 'Social', emoji: '🫂' },
    { id: 'relaxation', label: 'Relaxation', emoji: '🧘' },
    { id: 'sleep', label: 'Sleep', emoji: '😴' },
    { id: 'food', label: 'Food', emoji: '🍱' },
];

const MoodTracker = ({ onMoodLogged }) => {
    const [selectedMood, setSelectedMood] = useState(null);
    const [selectedActivities, setSelectedActivities] = useState([]);
    const [note, setNote] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLogged, setIsLogged] = useState(false);

    const toggleActivity = (id) => {
        setSelectedActivities(prev =>
            prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
        );
    };

    const handleSubmit = async () => {
        if (!selectedMood) return;
        setIsSubmitting(true);
        try {
            await axios.post('http://localhost:5000/api/mood', {
                mood: selectedMood.label,
                note: note,
                activities: selectedActivities
            });
            setIsLogged(true);
            if (onMoodLogged) onMoodLogged();
        } catch (error) {
            console.error('Failed to log mood:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] p-10 border border-white/40 shadow-premium">
            <h2 className="text-2xl font-black text-brand-brown mb-2 tracking-tight">How are you feeling today?</h2>
            <p className="text-brand-brown/70 text-sm mb-8 font-medium">Tracking your daily mood helps Aura provide better support.</p>

            {!isLogged ? (
                <div className="space-y-8">
                    <div className="flex justify-between items-center gap-3">
                        {moods.map((mood) => (
                            <button
                                key={mood.label}
                                onClick={() => setSelectedMood(mood)}
                                className={`flex flex-col items-center p-4 rounded-3xl transition-all duration-500 ${selectedMood?.label === mood.label
                                    ? `${mood.color} scale-110 shadow-premium ring-2 ring-current`
                                    : 'bg-white border border-brand-grey/30 grayscale opacity-40 hover:opacity-100 hover:grayscale-0'
                                    }`}
                            >
                                <span className="text-4xl mb-2">{mood.emoji}</span>
                                <span className="text-[10px] font-black uppercase tracking-widest">{mood.label}</span>
                            </button>
                        ))}
                    </div>

                    <AnimatePresence>
                        {selectedMood && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-6 overflow-hidden"
                            >
                                <div className="space-y-4 pt-4 border-t border-brand-grey/20">
                                    <span className="text-xs font-black text-brand-brown/40 uppercase tracking-widest block">What have you been up to?</span>
                                    <div className="flex flex-wrap gap-2">
                                        {activities.map((activity) => {
                                            const active = selectedActivities.includes(activity.id);
                                            return (
                                                <button
                                                    key={activity.id}
                                                    onClick={() => toggleActivity(activity.id)}
                                                    className={`px-5 py-2.5 rounded-full text-xs font-black transition-all duration-300 flex items-center gap-2 border ${active
                                                        ? 'bg-brand-sage text-white border-brand-sage shadow-soft'
                                                        : 'bg-white border-brand-grey/30 text-brand-brown/60 hover:bg-brand-grey/10'
                                                        }`}
                                                >
                                                    <span className="text-base">{activity.emoji}</span>
                                                    {activity.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <span className="text-xs font-black text-brand-brown/40 uppercase tracking-widest block">Daily Note</span>
                                    <textarea
                                        placeholder="Any notes on why you're feeling this way? (Optional)"
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        className="w-full h-32 p-5 bg-white border border-brand-grey/30 rounded-3xl focus:outline-none focus:ring-4 focus:ring-brand-sage/10 transition-all resize-none text-sm text-brand-brown font-medium placeholder:text-brand-brown/20"
                                    />
                                </div>
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="w-full py-5 bg-brand-brown text-white rounded-[2rem] font-black text-sm tracking-widest uppercase shadow-premium hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Syncing...' : 'Log My Narrative'}
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ) : (
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="py-16 text-center"
                >
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-brand-sage/10 text-brand-sage rounded-full mb-6 border-4 border-white shadow-soft">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-black text-brand-brown tracking-tight">Narrative Logged.</h3>
                    <p className="text-brand-brown/60 text-sm font-medium mt-2">Come back tomorrow to continue your reflection.</p>
                </motion.div>
            )}
        </div>
    );
};

export default MoodTracker;
