import React from 'react';
import { motion } from 'framer-motion';

const TypingIndicator = () => {
    return (
        <div className="flex justify-start mb-4">
            <div className="bg-brand-sage/10 border border-brand-sage/20 px-5 py-4 rounded-3xl rounded-tl-none shadow-soft">
                <div className="flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            animate={{
                                y: [0, -6, 0],
                                opacity: [0.4, 1, 0.4]
                            }}
                            transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                delay: i * 0.15
                            }}
                            className="w-1.5 h-1.5 bg-brand-sage rounded-full"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TypingIndicator;
