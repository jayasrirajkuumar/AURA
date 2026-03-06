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

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-brand-cream/30">
            {/* Chat Header */}
            <div className="px-10 py-6 border-b border-brand-grey/30 bg-white/40 backdrop-blur-md z-10 flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold text-brand-brown">Cognitive Companion</h1>
                    <p className="text-xs text-brand-brown/50 font-medium">Personalized support for your internal narrative</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-brand-lavender/10 border border-brand-lavender/30 rounded-full">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-purple animate-pulse"></div>
                    <span className="text-[10px] font-black text-brand-purple uppercase tracking-widest">Supports 50+ Languages</span>
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

            {/* Input Area */}
            <div className="flex-shrink-0 border-t border-brand-grey/20 bg-white/20">
                <ChatInput onSendMessage={handleSendMessage} disabled={loading} />
            </div>
        </div>
    );
};

export default Conversations;
