import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Sparkles, MessageSquare, Loader2, User, Bot, Trash2, Maximize2, Minimize2 } from 'lucide-react';
import axios from 'axios';
import { AI_API_END_POINT } from '@/utils/constant';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

const MessageBubble = ({ msg, userInitial, avatarGradient }) => {
    const isAi = msg.role === 'ai';
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={`flex ${isAi ? 'justify-start' : 'justify-end'} mb-4 px-2`}
        >
            <div className={`flex items-start gap-2.5 max-w-[85%] ${isAi ? 'flex-row' : 'flex-row-reverse'}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm border ${
                    isAi 
                    ? 'bg-gradient-to-br from-[#6A38C2] to-[#8B5CF6] border-white/20' 
                    : `bg-gradient-to-br ${avatarGradient} border-gray-100 dark:border-white/10`
                }`}>
                    {isAi ? <Bot className="w-4 h-4 text-white" /> : <span className="text-xs font-bold text-white">{userInitial}</span>}
                </div>

                {/* Content */}
                <div className={`relative px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    isAi 
                    ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-white/10 shadow-sm rounded-tl-none' 
                    : 'bg-[#6A38C2] text-white shadow-md shadow-[#6A38C2]/20 rounded-tr-none'
                }`}>
                    {msg.text.split('\n').map((line, i) => (
                        <p key={i} className={line.trim() === '' ? 'h-2' : ''}>
                            {line}
                        </p>
                    ))}
                    <span className={`text-[10px] opacity-40 mt-1 block ${isAi ? 'text-gray-400' : 'text-white/70'}`}>
                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

const AIAssistant = () => {
    const [open, setOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.auth);
    
    // Initial welcome message
    const [messages, setMessages] = useState([
        {
            role: 'ai',
            text: `Hi${user ? ` ${user.fullname?.split(' ')[0]}` : ''}! 👋 I'm **Jobify AI** — your personal career assistant.\n\nI can help you find jobs, track applications, complete your profile, and much more. What would you like to know?`,
            id: 'welcome'
        }
    ]);

    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, loading]);

    const handleSend = async (msgOverride = null) => {
        const textToSend = msgOverride || input;
        if (typeof textToSend !== 'string' || !textToSend.trim() || loading) return;

        const userMsg = textToSend.trim();
        if (!msgOverride) setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg, id: Date.now() }]);
        setLoading(true);

        try {
            const res = await axios.post(`${AI_API_END_POINT}/chat`, { message: userMsg }, { withCredentials: true });
            if (res.data.success) {
                setMessages(prev => [...prev, { role: 'ai', text: res.data.reply, id: Date.now() + 1 }]);
            }
        } catch (error) {
            console.error("AI Error:", error);
            const errMsg = error.response?.data?.message || "I'm having trouble connecting. Please check your internet.";
            setMessages(prev => [...prev, { role: 'ai', text: `⚠️ ${errMsg}`, id: Date.now() + 1 }]);
        } finally {
            setLoading(false);
        }
    };

    const clearChat = async () => {
        if (window.confirm("Clear conversation history?")) {
            try {
                await axios.delete(`${AI_API_END_POINT}/history`, { withCredentials: true });
                setMessages([messages[0]]); // Keep welcome message
                toast.success("Chat history cleared");
            } catch (error) {
                toast.error("Failed to clear history");
            }
        }
    };

    const handleSuggestionClick = (suggestion) => {
        const text = suggestion.replace(/^[^ ]+ /, '');
        setInput(text);
        handleSend(text);
    };

    const userInitial = user?.fullname?.[0]?.toUpperCase() || 'U';
    const avatarGradient = user?.role === 'recruiter' ? 'from-orange-400 to-rose-500' : 'from-blue-400 to-indigo-500';

    if (!user) return null; // Chatbot only after login

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
            {/* Chat Window */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9, transformOrigin: 'bottom right' }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className={`mb-4 bg-white dark:bg-gray-950 border border-gray-100 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
                            isExpanded ? 'w-[450px] h-[700px]' : 'w-[350px] h-[500px]'
                        }`}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-[#6A38C2] to-[#8B5CF6] p-4 text-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                                    <Bot className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm tracking-tight">Jobify AI Assistant</h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                                        <span className="text-[10px] font-medium opacity-80 uppercase tracking-widest">Active Now</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button onClick={() => setIsExpanded(!isExpanded)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                                    {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                                </button>
                                <button onClick={clearChat} title="Clear history" className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                <button onClick={() => setOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors ml-1">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div 
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50/50 dark:bg-transparent scroll-smooth custom-scrollbar"
                        >
                            {messages.map((msg) => (
                                <MessageBubble 
                                    key={msg.id} 
                                    msg={msg} 
                                    userInitial={userInitial}
                                    avatarGradient={avatarGradient}
                                />
                            ))}
                            {loading && (
                                <div className="flex justify-start px-2 mb-4">
                                    <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl rounded-tl-none border border-gray-100 dark:border-white/10 shadow-sm flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin text-[#6A38C2]" />
                                        <span className="text-xs text-gray-500">Thinking...</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Suggestions */}
                        {!loading && messages.length < 5 && (
                            <div className="px-4 pb-2 flex flex-wrap gap-2">
                                {[
                                    "📊 Show my stats", 
                                    "📝 Jobs I applied", 
                                    "💼 Find remote jobs", 
                                    "✨ Improve my profile"
                                ].map((suggestion) => (
                                    <button
                                        key={suggestion}
                                        onClick={() => handleSuggestionClick(suggestion)}
                                        className="text-[11px] px-3 py-1.5 bg-[#6A38C2]/5 hover:bg-[#6A38C2]/10 text-[#6A38C2] border border-[#6A38C2]/10 rounded-full transition-all duration-200"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Input Area */}
                        <div className="p-4 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-white/10">
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Type your question..."
                                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-white/10 rounded-2xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#6A38C2]/30 focus:border-[#6A38C2] transition-all"
                                />
                                <button 
                                    onClick={handleSend}
                                    disabled={!input.trim() || loading}
                                    className={`absolute right-2 p-2 rounded-xl transition-all duration-200 ${
                                        input.trim() && !loading 
                                        ? 'bg-[#6A38C2] text-white shadow-lg shadow-[#6A38C2]/20 scale-100' 
                                        : 'text-gray-400 bg-transparent scale-90'
                                    }`}
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                            <p className="text-[10px] text-center text-gray-400 mt-2">
                                Powered by Jobify AI & Gemini 1.5 Flash
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            {user && (
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setOpen(!open)}
                    className="w-14 h-14 rounded-2xl bg-gradient-to-r from-[#6A38C2] to-[#8B5CF6] shadow-xl shadow-[#6A38C2]/30 flex items-center justify-center relative group"
                >
                    <AnimatePresence mode="wait">
                        {open ? (
                            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                                <X className="w-6 h-6 text-white" />
                            </motion.div>
                        ) : (
                            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                                <Sparkles className="w-6 h-6 text-white" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                    {/* Pulse ring */}
                    <span className="absolute inset-0 rounded-full border-2 border-[#8B5CF6]/50 animate-ping opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>
            )}
        </div>
    );
};

export default AIAssistant;
