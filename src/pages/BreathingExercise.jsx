import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Play, Pause, RotateCcw, Wind } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const techniques = {
    box: {
        name: 'Box Breathing',
        inhale: 4,
        hold1: 4,
        exhale: 4,
        hold2: 4,
        desc: 'Standard for focus and stress relief.'
    },
    calm: {
        name: '4-7-8 Technique',
        inhale: 4,
        hold1: 7,
        exhale: 8,
        hold2: 0,
        desc: 'Best for deep relaxation and sleep.'
    },
    quick: {
        name: 'Quick Reset',
        inhale: 2,
        hold1: 0,
        exhale: 4,
        hold2: 0,
        desc: 'Fast relief during intense moments.'
    }
};

const BreathingExercise = () => {
    const navigate = useNavigate();
    const [selected, setSelected] = useState('box');
    const [isActive, setIsActive] = useState(false);
    const [phase, setPhase] = useState('Ready'); // Inhale, Hold, Exhale, Pause
    const [timer, setTimer] = useState(0);

    const tech = techniques[selected];

    useEffect(() => {
        let interval = null;
        if (isActive) {
            interval = setInterval(() => {
                setTimer((t) => {
                    const next = t + 1;

                    // Logic to switch phases
                    if (phase === 'Inhale' && next >= tech.inhale) {
                        if (tech.hold1 > 0) setPhase('Hold');
                        else setPhase('Exhale');
                        return 0;
                    }
                    if (phase === 'Hold' && next >= tech.hold1) {
                        setPhase('Exhale');
                        return 0;
                    }
                    if (phase === 'Exhale' && next >= tech.exhale) {
                        if (tech.hold2 > 0) setPhase('Pause');
                        else setPhase('Inhale');
                        return 0;
                    }
                    if (phase === 'Pause' && next >= tech.hold2) {
                        setPhase('Inhale');
                        return 0;
                    }
                    if (phase === 'Ready') {
                        setPhase('Inhale');
                        return 0;
                    }

                    return next;
                });
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, phase, tech]);

    const toggle = () => {
        if (!isActive) setPhase('Inhale');
        setIsActive(!isActive);
        setTimer(0);
    };

    const reset = () => {
        setIsActive(false);
        setPhase('Ready');
        setTimer(0);
    };

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
                    <h1 className="text-xl font-bold text-brand-brown">Guided Breathing</h1>
                    <p className="text-xs text-brand-brown/50 font-medium tracking-tight">Regulate your rhythm, quiet your mind</p>
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-10 relative">
                {/* Breathing Circle */}
                <div className="relative flex items-center justify-center w-80 h-80">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={phase}
                            className={`absolute inset-0 rounded-full blur-3xl opacity-20 ${phase === 'Inhale' ? 'bg-brand-sage' :
                                phase === 'Exhale' ? 'bg-brand-peach' : 'bg-brand-purple'
                                }`}
                            initial={{ scale: 0.8 }}
                            animate={{ scale: phase === 'Inhale' ? 1.2 : 0.8 }}
                            transition={{ duration: phase === 'Inhale' ? tech.inhale : tech.exhale, ease: "easeInOut" }}
                        />
                    </AnimatePresence>

                    <motion.div
                        className="w-64 h-64 rounded-full border-4 border-white shadow-premium flex flex-col items-center justify-center z-10 bg-white/40 backdrop-blur-md"
                        animate={{
                            scale: phase === 'Inhale' ? 1.2 :
                                phase === 'Exhale' ? 0.9 :
                                    phase === 'Hold' ? 1.2 : 0.9
                        }}
                        transition={{
                            duration: phase === 'Inhale' ? tech.inhale :
                                phase === 'Exhale' ? tech.exhale : 0.5,
                            ease: "linear"
                        }}
                    >
                        <Wind className={`mb-2 transition-colors duration-500 ${phase === 'Inhale' ? 'text-brand-sage' :
                            phase === 'Exhale' ? 'text-brand-peach' : 'text-brand-purple'
                            }`} size={40} />
                        <span className="text-2xl font-black text-brand-brown uppercase tracking-tighter">{phase}</span>
                        {isActive && <span className="text-sm font-bold text-brand-brown/40">{timer}s</span>}
                    </motion.div>
                </div>

                {/* Controls */}
                <div className="mt-16 flex items-center gap-8">
                    <button onClick={reset} className="p-4 bg-white rounded-full shadow-soft hover:bg-brand-grey/10 transition-all text-brand-brown/60">
                        <RotateCcw size={24} />
                    </button>
                    <button
                        onClick={toggle}
                        className="w-20 h-20 bg-brand-brown text-white rounded-full shadow-premium flex items-center justify-center hover:scale-105 transition-transform"
                    >
                        {isActive ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
                    </button>
                    <div className="w-12" /> {/* Spacer */}
                </div>

                {/* Technique Selection */}
                <div className="mt-12 flex gap-4 overflow-x-auto pb-4 max-w-2xl px-4 scrollbar-hide">
                    {Object.entries(techniques).map(([id, t]) => (
                        <button
                            key={id}
                            onClick={() => { setSelected(id); reset(); }}
                            className={`flex flex-col items-start p-5 rounded-3xl border transition-all min-w-[180px] ${selected === id
                                ? 'bg-white shadow-soft border-brand-grey/50'
                                : 'bg-transparent border-transparent opacity-50 hover:opacity-100'
                                }`}
                        >
                            <span className="font-bold text-brand-brown">{t.name}</span>
                            <span className="text-[10px] text-brand-brown/60 leading-tight mt-1">{t.desc}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BreathingExercise;
