import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ArrowRight, Mail, Lock, User, Sparkles, Heart, Target, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../hooks/AuthContext';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [step, setStep] = useState(1);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login, signup } = useAuth();
    const navigate = useNavigate();

    const getPasswordStrength = (pass) => {
        if (!pass) return { score: 0, label: '', color: 'bg-gray-200' };
        let score = 0;
        if (pass.length > 8) score++;
        if (/[A-Z]/.test(pass)) score++;
        if (/[0-9]/.test(pass)) score++;
        if (/[^A-Za-z0-9]/.test(pass)) score++;

        if (score < 2) return { score: 1, label: 'Weak', color: 'bg-red-400' };
        if (score < 4) return { score: 2, label: 'Medium', color: 'bg-yellow-400' };
        return { score: 3, label: 'Strong', color: 'bg-brand-sage' };
    };

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        stressLevel: 'Moderate',
        goal: 'Mindfulness',
        interests: []
    });

    const strength = getPasswordStrength(formData.password);

    const handleAction = async (e) => {
        e.preventDefault();
        setError('');

        if (isLogin) {
            const result = await login({ email: formData.email, password: formData.password });
            if (result.success) {
                navigate('/');
            } else {
                setError(result.message);
            }
        } else {
            if (step < 2) {
                setStep(2);
            } else {
                const result = await signup({
                    ...formData,
                    joined: new Date().toISOString(),
                    bio: 'Exploring the internal narrative.'
                });
                if (result.success) {
                    navigate('/');
                } else {
                    setError(result.message);
                }
            }
        }
    };

    return (
        <div className="min-h-screen bg-brand-cream flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Aesthetics */}
            <div className="absolute top-0 left-0 w-full h-full -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-sage/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-peach/20 rounded-full blur-[120px]"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white/70 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-premium border border-white/40"
            >
                <div className="flex flex-col items-center mb-10">
                    <div className="bg-brand-sage p-3 rounded-2xl text-white mb-4 shadow-soft">
                        <Brain size={32} />
                    </div>
                    <h1 className="text-3xl font-black tracking-tighter text-brand-brown">AURA</h1>
                    <p className="text-brand-brown/40 text-sm font-bold uppercase tracking-widest mt-1">
                        {isLogin ? 'Welcome Back' : 'Join the Narrative'}
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-500 text-xs font-bold rounded-2xl border border-red-100 flex items-center gap-2">
                        <Sparkles size={14} className="flex-shrink-0" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleAction} className="space-y-6">
                    <AnimatePresence mode="wait">
                        {isLogin || step === 1 ? (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                {!isLogin && (
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-brown/30" size={18} />
                                        <input
                                            type="text"
                                            placeholder="What should we call you?"
                                            required
                                            className="w-full bg-white border border-brand-grey/30 px-12 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-sage/20 transition-all font-medium text-brand-brown placeholder:text-brand-brown/20"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                )}
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-brown/30" size={18} />
                                    <input
                                        type="email"
                                        placeholder="Email Address"
                                        required
                                        className="w-full bg-white border border-brand-grey/30 px-12 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-sage/20 transition-all font-medium text-brand-brown placeholder:text-brand-brown/20"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-brown/30 group-focus-within:text-brand-sage transition-colors" size={18} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        required
                                        className="w-full bg-white border border-brand-grey/30 px-12 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-sage/20 transition-all font-medium text-brand-brown placeholder:text-brand-brown/20"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-brown/30 hover:text-brand-sage transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>

                                {!isLogin && formData.password && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="space-y-2 px-1"
                                    >
                                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                            <span className="text-brand-brown/40">Password Strength</span>
                                            <span className={strength.label === 'Strong' ? 'text-brand-sage' : strength.label === 'Medium' ? 'text-yellow-500' : 'text-red-400'}>
                                                {strength.label}
                                            </span>
                                        </div>
                                        <div className="h-1 w-full bg-brand-grey/20 rounded-full overflow-hidden flex gap-1">
                                            <div className={`h-full transition-all duration-500 ${strength.color} ${strength.score >= 1 ? 'flex-1' : 'w-0'}`}></div>
                                            <div className={`h-full transition-all duration-500 ${strength.color} ${strength.score >= 2 ? 'flex-1' : 'w-0'}`}></div>
                                            <div className={`h-full transition-all duration-500 ${strength.color} ${strength.score >= 3 ? 'flex-1' : 'w-0'}`}></div>
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div>
                                    <label className="text-xs font-black text-brand-brown/40 uppercase tracking-widest mb-3 block">Wellness Goal</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['Mindfulness', 'Stress Relief', 'Better Sleep', 'Focus'].map(g => (
                                            <button
                                                key={g}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, goal: g })}
                                                className={`p-3 rounded-2xl border text-sm font-bold transition-all ${formData.goal === g ? 'bg-brand-sage text-white border-brand-sage shadow-soft' : 'bg-white border-brand-grey/30 text-brand-brown/60'
                                                    }`}
                                            >
                                                {g}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-black text-brand-brown/40 uppercase tracking-widest mb-3 block">Current Mood Intensity</label>
                                    <input
                                        type="range" min="1" max="5"
                                        className="w-full accent-brand-peach"
                                        value={formData.stressLevel === 'Low' ? 1 : formData.stressLevel === 'High' ? 5 : 3}
                                        onChange={(e) => {
                                            const v = parseInt(e.target.value);
                                            setFormData({ ...formData, stressLevel: v < 3 ? 'Low' : v > 3 ? 'High' : 'Moderate' });
                                        }}
                                    />
                                    <div className="flex justify-between text-[10px] font-bold text-brand-brown/30 uppercase mt-2">
                                        <span>Very Low</span>
                                        <span>Moderate</span>
                                        <span>Very Intense</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button
                        type="submit"
                        className="w-full bg-brand-brown text-white py-4 rounded-2xl font-black tracking-tight flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-premium"
                    >
                        {isLogin ? 'Enter Workspace' : step === 1 ? 'Next Step' : 'Create My Narrative'}
                        <ArrowRight size={20} />
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <button
                        onClick={() => { setIsLogin(!isLogin); setStep(1); }}
                        className="text-sm font-bold text-brand-brown/40 hover:text-brand-brown transition-colors"
                    >
                        {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default Auth;
