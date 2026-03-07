import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import MessageBubble from '../components/MessageBubble';
import ChatInput from '../components/ChatInput';
import TypingIndicator from '../components/TypingIndicator';

const Conversations = () => {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: "Hello! I'm Aura, your cognitive companion. How are you feeling today?",
            timestamp: new Date()
        }
    ]);
    const [loading, setLoading] = useState(false);
    const [showClearModal, setShowClearModal] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/chat/history');
                if (response.data.length > 0) {
                    setMessages(response.data.map(msg => ({
                        ...msg,
                        timestamp: new Date(msg.timestamp)
                    })));
                }
            } catch (error) {
                console.error("Failed to fetch history:", error);
            }
        };
        fetchHistory();
    }, []);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, loading]);

    const handleSendMessage = async (content) => {
        const userMessage = {
            role: 'user',
            content,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:5000/api/chat', {
                message: content,
                provider: "huggingface"
            });
            const aiResponse = {
                role: 'assistant',
                content: response.data.response,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiResponse]);
        } catch (error) {
            console.error("Chat Error:", error);
            const errorMessage = {
                role: 'assistant',
                content: "I'm having a little trouble connecting right now. Please make sure the backend is running.",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const handleClearChat = async () => {
        try {
            await axios.delete('http://localhost:5000/api/chat/history');
            setMessages([
                {
                    role: 'assistant',
                    content: "History cleared. How can I help you starting fresh?",
                    timestamp: new Date()
                }
            ]);
            setShowClearModal(false);
        } catch (error) {
            console.error("Failed to clear chat:", error);
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-brand-cream/30">
            {/* Chat Header */}
            <div className="px-10 py-6 border-b border-brand-grey/30 bg-white/40 backdrop-blur-md z-10 flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold text-brand-brown">Cognitive Companion</h1>
                    <p className="text-xs text-brand-brown/50 font-medium">Personalized support for your internal narrative</p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setShowClearModal(true)}
                        className="text-[10px] font-black uppercase tracking-widest text-brand-brown/40 hover:text-red-500 transition-colors"
                    >
                        Clear Chat
                    </button>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-brand-lavender/10 border border-brand-lavender/30 rounded-full">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-purple animate-pulse"></div>
                        <span className="text-[10px] font-black text-brand-purple uppercase tracking-widest">Supports 50+ Languages</span>
                    </div>
                </div>
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto px-10 py-8 scrollbar-hide">
                <div className="max-w-4xl mx-auto">
                    <AnimatePresence>
                        {messages.map((msg, index) => (
                            <MessageBubble
                                key={index}
                                role={msg.role}
                                content={msg.content}
                                timestamp={msg.timestamp}
                            />
                        ))}
                    </AnimatePresence>
                    {loading && <TypingIndicator />}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            <div className="flex-shrink-0 border-t border-brand-grey/20 bg-white/20">
                <ChatInput onSendMessage={handleSendMessage} disabled={loading} />
            </div>

            {/* Modal Overlay */}
            <AnimatePresence>
                {showClearModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-brand-brown/20 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full shadow-premium border border-brand-grey/20 text-center"
                        >
                            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                            </div>
                            <h3 className="text-xl font-black text-brand-brown mb-2 tracking-tight">Clear Chat History?</h3>
                            <p className="text-sm text-brand-brown/60 mb-8 font-medium leading-relaxed">
                                This action cannot be undone. All your messages with Aura on this account will be permanently removed.
                            </p>
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={handleClearChat}
                                    className="w-full py-4 bg-red-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-red-200 hover:bg-red-600 transition-all active:scale-[0.98]"
                                >
                                    Confirm Deletion
                                </button>
                                <button
                                    onClick={() => setShowClearModal(false)}
                                    className="w-full py-4 bg-brand-grey/20 text-brand-brown rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-grey/30 transition-all active:scale-[0.98]"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Conversations;
