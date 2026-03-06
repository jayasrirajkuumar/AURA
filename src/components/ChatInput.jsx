import React, { useState } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';

const ChatInput = ({ onSendMessage, disabled }) => {
    const [text, setText] = useState('');
    const [isListening, setIsListening] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (text.trim() && !disabled) {
            onSendMessage(text);
            setText('');
        }
    };

    const toggleListening = () => {
        if (!('webkitSpeechRecognition' in window) && !('speechRecognition' in window)) {
            alert("Speech recognition is not supported in this browser.");
            return;
        }

        if (isListening) {
            window.recognition?.stop();
            setIsListening(false);
        } else {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            window.recognition = new SpeechRecognition();
            window.recognition.continuous = false;
            window.recognition.interimResults = false;
            window.recognition.lang = 'en-US';

            window.recognition.onstart = () => setIsListening(true);
            window.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setText(prev => prev + (prev ? ' ' : '') + transcript);
                setIsListening(false);
            };
            window.recognition.onerror = () => setIsListening(false);
            window.recognition.onend = () => setIsListening(false);

            window.recognition.start();
        }
    };

    return (
        <div className="p-6 bg-transparent">
            <form
                onSubmit={handleSubmit}
                className="max-w-4xl mx-auto relative group"
            >
                <div className="absolute inset-0 bg-brand-peach/5 blur-xl group-focus-within:bg-brand-sage/5 transition-colors -z-10 rounded-full"></div>
                <div className="flex items-center gap-3 bg-white border border-brand-grey/40 p-2 pl-4 rounded-full shadow-warm focus-within:border-brand-sage/50 transition-all duration-300">
                    <button
                        type="button"
                        onClick={toggleListening}
                        className={`p-2.5 rounded-full transition-all duration-300 ${isListening
                            ? 'bg-brand-peach text-white shadow-soft animate-pulse'
                            : 'bg-brand-grey/10 text-brand-brown/40 hover:text-brand-brown'
                            }`}
                    >
                        {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                    </button>
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        disabled={disabled}
                        placeholder={isListening ? "Listening..." : disabled ? "Aura is thinking..." : "Share your thoughts..."}
                        className="flex-1 bg-transparent border-none outline-none text-brand-brown py-2.5 placeholder:text-brand-brown/30 font-medium"
                    />
                    <button
                        type="submit"
                        disabled={disabled || !text.trim()}
                        className={`
              p-3 rounded-full transition-all duration-300
              ${text.trim() && !disabled
                                ? 'bg-brand-sage text-white shadow-soft scale-100 hover:scale-105 active:scale-95'
                                : 'bg-brand-grey/30 text-brand-brown/20 scale-95'}
            `}
                    >
                        <Send size={20} />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatInput;
