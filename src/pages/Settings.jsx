import React from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Bell, Shield, User, Globe, Moon, Save } from 'lucide-react';
import Card from '../components/Card';
import { useAuth } from '../hooks/AuthContext';

const Settings = () => {
    const { user, updateProfile } = useAuth();

    return (
        <div className="flex-1 overflow-y-auto px-10 pb-10 space-y-8 scrollbar-hide">
            <section className="flex flex-col gap-1 mt-8">
                <div className="flex items-center gap-2 text-brand-brown/40 text-xs font-medium uppercase tracking-widest">
                    <SettingsIcon size={14} />
                    App Preferences
                </div>
                <h1 className="text-4xl font-black tracking-tighter text-brand-brown">Settings</h1>
            </section>

            <div className="max-w-4xl space-y-6">
                <Card className="p-0 overflow-hidden bg-white/60 backdrop-blur-md border-brand-grey/20 shadow-premium">
                    <div className="p-8 border-b border-brand-grey/10 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-brand-sage/10 text-brand-sage rounded-2xl">
                                <User size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-brand-brown">Account Identity</h3>
                                <p className="text-xs font-bold text-brand-brown/40 uppercase tracking-widest">Profile details & visuals</p>
                            </div>
                        </div>
                        <button className="px-6 py-2.5 bg-brand-brown text-white rounded-full text-xs font-black shadow-soft hover:scale-105 transition-transform flex items-center gap-2">
                            <Save size={14} />
                            Update
                        </button>
                    </div>

                    <div className="p-8 space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-brand-brown/60 uppercase tracking-widest ml-1">Nickname</label>
                                <input
                                    type="text"
                                    defaultValue={user?.name}
                                    className="w-full bg-white border border-brand-grey/30 px-6 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-brand-sage/20 transition-all font-bold text-brand-brown"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-brand-brown/60 uppercase tracking-widest ml-1">Email</label>
                                <input
                                    type="email"
                                    disabled
                                    defaultValue={user?.email}
                                    className="w-full bg-brand-grey/10 border border-brand-grey/30 px-6 py-3 rounded-2xl outline-none font-bold text-brand-brown/40 cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SettingsToggle
                        icon={Bell}
                        title="Notifications"
                        desc="Daily reminders & wellness pings"
                        color="text-brand-peach"
                        bg="bg-brand-peach/10"
                        enabled={true}
                    />
                    <SettingsToggle
                        icon={Moon}
                        title="Dark Narrative"
                        desc="Coming soon to your dashboard"
                        color="text-brand-purple"
                        bg="bg-brand-purple/10"
                        enabled={false}
                    />
                    <SettingsToggle
                        icon={Globe}
                        title="Voice Audio"
                        desc="Hear Aura read responses aloud"
                        color="text-brand-sage"
                        bg="bg-brand-sage/10"
                        enabled={true}
                    />
                    <SettingsToggle
                        icon={Shield}
                        title="Privacy Mode"
                        desc="Hide metrics from preview cards"
                        color="text-brand-brown"
                        bg="bg-brand-brown/10"
                        enabled={false}
                    />
                </div>
            </div>
        </div>
    );
};

const SettingsToggle = ({ icon: Icon, title, desc, color, bg, enabled }) => (
    <Card className="p-6 bg-white/60 backdrop-blur-md border-brand-grey/20 flex items-center justify-between group hover:border-brand-grey/40 transition-colors">
        <div className="flex items-center gap-4">
            <div className={`p-3 ${bg} ${color} rounded-2xl group-hover:scale-110 transition-transform`}>
                <Icon size={20} />
            </div>
            <div>
                <h4 className="font-black text-brand-brown leading-tight">{title}</h4>
                <p className="text-[10px] text-brand-brown/40 font-bold uppercase tracking-widest mt-1">{desc}</p>
            </div>
        </div>
        <div className={`w-12 h-6 rounded-full p-1 transition-colors ${enabled ? 'bg-brand-sage' : 'bg-brand-grey/50'}`}>
            <div className={`w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${enabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
        </div>
    </Card>
);

export default Settings;
