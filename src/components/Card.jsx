import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = "", delay = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className={`rounded-4xl shadow-soft border border-brand-grey/30 overflow-hidden ${className || "bg-white"}`}
        >
            {children}
        </motion.div>
    );
};

export default Card;
