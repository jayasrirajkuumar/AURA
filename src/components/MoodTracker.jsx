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
        <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 border border-brand-grey/20 shadow-sm">
            <h2 className="text-xl font-bold text-brand-brown mb-2">How are you feeling today?</h2>
            <p className="text-brand-brown/60 text-sm mb-6">Tracking your daily mood helps Aura provide better support.</p>

            {!isLogged ? (
                <div className="space-y-6">
                    <div className="flex justify-between items-center gap-2">
                        {moods.map((mood) => (
                            <button
                                key={mood.label}
                                onClick={() => setSelectedMood(mood)}
                                className={`flex flex-col items-center p-3 rounded-2xl transition-all duration-300 ${selectedMood?.label === mood.label
                                    ? `${mood.color} scale-110 shadow-md ring-2 ring-current`
                                    : 'bg-white/40 hover:bg-white/80 grayscale opacity-60 hover:opacity-100 hover:grayscale-0'
                                    }`}
                            >
                                <span className="text-3xl mb-1">{mood.emoji}</span>
                                <span className="text-[10px] font-bold uppercase tracking-wider">{mood.label}</span>
                            </button>
                        ))}
                    </div>

                    <AnimatePresence>
                        {selectedMood && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-4"
                            >
                                <div className="space-y-4 pt-2">
                                    <span className="text-sm font-bold text-brand-brown/60 block">What have you been up to?</span>
                                    <div className="flex flex-wrap gap-2">
                                        {activities.map((activity) => {
                                            const active = selectedActivities.includes(activity.id);
                                            return (
                                                <button
                                                    key={activity.id}
                                                    onClick={() => toggleActivity(activity.id)}
                                                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-2 ${active
                                                        ? 'bg-brand-purple text-white shadow-md'
                                                        : 'bg-white/40 text-brand-brown/50 hover:bg-white/80'
                                                        }`}
                                                >
                                                    <span>{activity.emoji}</span>
                                                    {activity.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <textarea
                                    placeholder="Any notes on why you're feeling this way? (Optional)"
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    className="w-full h-24 p-4 bg-white/40 border border-brand-grey/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-purple/30 resize-none text-sm text-brand-brown"
                                />
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="w-full py-4 bg-brand-purple text-white rounded-2xl font-bold text-sm shadow-lg shadow-brand-purple/20 hover:bg-brand-purple/90 transition-all active:scale-[0.98] disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Logging...' : 'Log Daily Mood'}
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ) : (
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="py-10 text-center"
                >
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-4">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-brand-brown">Mood logged for today!</h3>
                    <p className="text-sm text-brand-brown/60">Come back tomorrow to keep your streak going.</p>
                </motion.div>
            )}
        </div>
    );
};

export default MoodTracker;
