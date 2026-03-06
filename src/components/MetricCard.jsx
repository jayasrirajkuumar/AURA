import React from 'react';
import Card from './Card';
import { motion } from 'framer-motion';

const MetricCard = ({ title, value, label, icon: Icon, color, delay }) => {
    const colorMap = {
        sage: 'bg-brand-sage/20 text-brand-sage',
        peach: 'bg-brand-peach/15 text-brand-peach',
        lavender: 'bg-brand-lavender/15 text-brand-lavender',
        brown: 'bg-brand-brown/10 text-brand-brown',
    };

    const ringColorMap = {
        sage: '#a4b494',
        peach: '#ff8a5c',
        lavender: '#a29bfe',
        brown: '#4a3a2a',
    };

    return (
        <Card className="p-6 flex flex-col items-center text-center bg-white" delay={delay}>
            <div className={`p-3 rounded-2xl mb-4 ${colorMap[color] || colorMap.sage}`}>
                <Icon size={24} />
            </div>
            <h3 className="text-sm font-medium text-brand-brown/60 mb-2 uppercase tracking-wider">{title}</h3>

            <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-brand-grey/30"
                    />
                    <motion.circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke={ringColorMap[color] || ringColorMap.sage}
                        strokeWidth="8"
                        strokeDasharray={351.8}
                        initial={{ strokeDashoffset: 351.8 }}
                        animate={{ strokeDashoffset: 351.8 - (351.8 * (value / 100)) }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: delay + 0.3 }}
                        fill="transparent"
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold">{value}</span>
                    <span className="text-xs text-brand-brown/40">{label}</span>
                </div>
            </div>

            <p className="text-sm font-semibold text-brand-sage">Healthy</p>
        </Card>
    );
};

export default MetricCard;
