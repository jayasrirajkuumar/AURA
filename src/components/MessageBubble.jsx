import React from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const MessageBubble = ({ role, content, timestamp }) => {
    const isUser = role === 'user';
    const [isSpeaking, setIsSpeaking] = React.useState(false);

    const speak = () => {
        if ('speechSynthesis' in window) {
            if (isSpeaking) {
                window.speechSynthesis.cancel();
                setIsSpeaking(false);
            } else {
                const utterance = new SpeechSynthesisUtterance(content);
                // Simple language detection (not perfect but AI responds in user language)
                // Browsers usually auto-detect or use user default
                utterance.onend = () => setIsSpeaking(false);
                utterance.onerror = () => setIsSpeaking(false);
                window.speechSynthesis.speak(utterance);
                setIsSpeaking(true);
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}
        >
            <div className={`
        max-w-[85%] px-5 py-3 rounded-3xl shadow-soft border relative group
        ${isUser
                    ? 'bg-brand-peach/10 border-brand-peach/20 text-brand-brown rounded-tr-none'
                    : 'bg-brand-sage border-brand-sage/20 text-white rounded-tl-none'}
      `}>
                {!isUser && (
                    <button
                        onClick={speak}
                        className="absolute -right-10 top-2 p-2 rounded-full bg-white border border-brand-grey/20 text-brand-brown/40 opacity-0 group-hover:opacity-100 transition-opacity hover:text-brand-purple"
                    >
                        {isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>
                )}
                <div className="text-[15px] leading-relaxed font-medium prose prose-sm max-w-none prose-white">
                    {isUser ? (
                        <p>{content}</p>
                    ) : (
                        <ReactMarkdown>{content}</ReactMarkdown>
                    )}
                </div>
                <div className={`
          text-[10px] mt-1.5 font-bold uppercase tracking-wider
          ${isUser ? 'text-brand-brown/30' : 'text-white/60'}
        `}>
                    {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>
        </motion.div>
    );
};

export default MessageBubble;
