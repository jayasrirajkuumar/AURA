import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/AuthContext';
import { User, Calendar, Heart, Shield, LogOut, Edit3, Target, Award } from 'lucide-react';
import Card from '../components/Card';

const Profile = () => {
    const { user, logout, updateProfile } = useAuth();
    const [isEditing, setIsEditing] = React.useState(false);
    const [editData, setEditData] = React.useState({
        name: user?.name || '',
        bio: user?.bio || ''
    });

    if (!user) return null;

    const handleSave = () => {
        updateProfile(editData);
        setIsEditing(false);
    };

    return (
        <div className="flex-1 overflow-y-auto px-10 pb-10 space-y-8 scrollbar-hide">
            <section className="mt-10 flex items-end justify-between">
                <div className="flex items-center gap-8">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-32 h-32 rounded-[3.5rem] bg-brand-sage overflow-hidden border-4 border-white shadow-premium ring-1 ring-brand-grey/50"
                    >
                        <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                    <div className="space-y-2">
                        {isEditing ? (
                            <input
                                type="text"
                                className="text-4xl font-black tracking-tighter text-brand-brown bg-transparent border-b-2 border-brand-sage outline-none"
                                value={editData.name}
                                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                autoFocus
                            />
                        ) : (
                            <h1 className="text-4xl font-black tracking-tighter text-brand-brown">{user.name}</h1>
                        )}
                        <p className="text-brand-brown/50 font-medium flex items-center gap-2">
                            <Calendar size={16} />
                            Joined {new Date(user.joined).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    {isEditing ? (
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 px-6 py-3 bg-brand-sage text-white rounded-2xl font-black text-sm hover:scale-[1.02] transition-all active:scale-95"
                        >
                            Save Changes
                        </button>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-brand-brown/10 text-brand-brown rounded-2xl font-black text-sm hover:bg-brand-brown hover:text-white transition-all active:scale-95"
                        >
                            <Edit3 size={18} />
                            Edit Profile
                        </button>
                    )}
                    <button
                        onClick={logout}
                        className="flex items-center gap-2 px-6 py-3 bg-brand-peach/10 text-brand-peach rounded-2xl font-black text-sm hover:bg-brand-peach hover:text-white transition-all active:scale-95"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* User Bio Card */}
                <Card className="lg:col-span-2 p-10 bg-white/60 backdrop-blur-md border-brand-grey/20">
                    <div className="flex justify-between items-start mb-6">
                        <h3 className="text-xl font-black text-brand-brown flex items-center gap-2">
                            <Shield className="text-brand-sage" size={20} />
                            Your Narrative
                        </h3>
                    </div>
                    {isEditing ? (
                        <textarea
                            className="w-full h-32 text-brand-brown/70 leading-relaxed font-medium italic bg-brand-cream/30 p-4 rounded-2xl outline-none border border-brand-sage/30 focus:border-brand-sage transition-all resize-none"
                            value={editData.bio}
                            onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                        />
                    ) : (
                        <p className="text-brand-brown/70 leading-relaxed font-medium italic">
                            "{user.bio || 'Exploring the depths of mindfulness one breath at a time.'}"
                        </p>
                    )}

                    <div className="mt-8 flex flex-wrap gap-2">
                        {(user.interests || ['Mindfulness', 'Balance', 'Growth']).map((interest, i) => (
                            <span key={i} className="px-3 py-1 bg-brand-sage/10 text-brand-sage rounded-full text-[10px] font-bold uppercase tracking-widest border border-brand-sage/20">
                                {interest}
                            </span>
                        ))}
                    </div>

                    <div className="mt-10 grid grid-cols-2 gap-4">
                        <div className="p-6 rounded-[2rem] bg-brand-cream/50 border border-brand-grey/20">
                            <Target className="text-brand-peach mb-3" size={24} />
                            <h4 className="text-sm font-black text-brand-brown/40 uppercase tracking-widest mb-1">Primary Goal</h4>
                            <p className="font-bold text-brand-brown">{user.goal || 'Mindfulness'}</p>
                        </div>
                        <div className="p-6 rounded-[2rem] bg-brand-lavender/10 border border-brand-grey/20">
                            <Heart className="text-brand-purple mb-3" size={24} />
                            <h4 className="text-sm font-black text-brand-brown/40 uppercase tracking-widest mb-1">Starting Stress</h4>
                            <p className="font-bold text-brand-brown">{user.stressLevel || 'Moderate'}</p>
                        </div>
                    </div>
                </Card>

                {/* Achievements Card */}
                <Card className="p-10 bg-brand-brown text-white shadow-premium">
                    <div className="flex items-center gap-2 mb-8">
                        <Award size={24} className="text-brand-peach" />
                        <h3 className="text-xl font-black tracking-tight">Milestones</h3>
                    </div>
                    <div className="space-y-6">
                        {[
                            { label: 'Cloud Walker', date: '7 Day Streak', active: true },
                            { label: 'Deep Breather', date: '5 exercises', active: true },
                            { label: 'True Mirror', date: '30 reflections', active: false },
                        ].map((m, i) => (
                            <div key={i} className={`flex items-center gap-4 ${m.active ? 'opacity-100' : 'opacity-40'}`}>
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${m.active ? 'bg-white/10 text-brand-peach' : 'bg-white/5 text-white/20'}`}>
                                    <Target size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-sm leading-tight">{m.label}</p>
                                    <p className="text-[10px] uppercase font-black tracking-widest text-white/40">{m.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Profile;
