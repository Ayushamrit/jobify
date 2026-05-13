import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { AI_API_END_POINT } from '@/utils/constant';
import {
    MessageSquare, X, Send, Bot, Sparkles,
    Briefcase, User2, RotateCcw, ChevronDown
} from 'lucide-react';

// ─── Typing dots animation ───────────────────────────────────────────────────
const TypingDots = () => (
    <div className="flex items-center gap-1 px-4 py-3">
        {[0, 1, 2].map(i => (
            <span
                key={i}
                className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
            />
        ))}
    </div>
);

// ─── Message bubble ───────────────────────────────────────────────────────────
const MessageBubble = ({ msg, userInitial, avatarGradient }) => {
    const isUser = msg.role === 'user';

    // Convert **bold** and bullet lines to styled output
    const formatText = (text) => {
        return text.split('\n').map((line, i) => {
            // Bold
            const parts = line.split(/\*\*(.*?)\*\*/g);
            const formatted = parts.map((p, j) =>
                j % 2 === 1 ? <strong key={j}>{p}</strong> : p
            );
            // Bullet
            if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
                return (
                    <li key={i} className="ml-3 list-disc">
                        {formatted}
                    </li>
                );
            }
            return line ? <p key={i}>{formatted}</p> : <br key={i} />;
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
        >
            {/* Avatar */}
            {isUser ? (
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                    {userInitial}
                </div>
            ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6A38C2] to-[#8B5CF6] flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                </div>
            )}

            {/* Bubble */}
            <div className={`max-w-[80%] text-sm leading-relaxed rounded-2xl px-4 py-3 space-y-1 ${
                isUser
                    ? 'bg-gradient-to-br from-[#6A38C2] to-[#8B5CF6] text-white rounded-tr-sm'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-sm'
            }`}>
                {formatText(msg.text)}
            </div>
        </motion.div>
    );
};

// ─── Quick reply chips ────────────────────────────────────────────────────────
const QUICK_REPLIES = [
    { label: '📋 How to apply?', text: 'How do I apply for a job on Jobify?' },
    { label: '📊 My stats', text: 'How many jobs have I applied to and how many have I saved?' },
    { label: '👤 Profile tips', text: 'How can I improve my profile completion?' },
    { label: '🔍 Search help', text: 'How do I use filters to find the right job?' },
    { label: '📄 Resume help', text: 'How do I upload my resume?' },
];

// ─── Main AI Assistant Component ──────────────────────────────────────────────
const AIAssistant = () => {
    const { user } = useSelector(store => store.auth);
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'ai',
            text: `Hi${user ? ` ${user.fullname?.split(' ')[0]}` : ''}! 👋 I'm **Jobify AI** — your personal career assistant.\n\nI can help you find jobs, track applications, complete your profile, and much more. What would you like to know?`,
            id: 'welcome'
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showScrollBtn, setShowScrollBtn] = useState(false);
    const bottomRef = useRef(null);
    const inputRef = useRef(null);
    const bodyRef = useRef(null);

    // Avatar
    const avatarInitial = user?.fullname?.charAt(0)?.toUpperCase() || 'U';
    const GRADIENTS = [
        'from-[#6A38C2] to-[#8B5CF6]', 'from-[#F83002] to-[#f97316]',
        'from-[#0ea5e9] to-[#6366f1]', 'from-[#10b981] to-[#06b6d4]',
    ];
    const avatarGradient = GRADIENTS[(user?.fullname?.charCodeAt(0) || 0) % GRADIENTS.length];

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    // Focus input when panel opens
    useEffect(() => {
        if (open) setTimeout(() => inputRef.current?.focus(), 300);
    }, [open]);

    const handleScroll = () => {
        if (!bodyRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = bodyRef.current;
        setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 100);
    };

    const scrollToBottom = () => bottomRef.current?.scrollIntoView({ behavior: 'smooth' });

    const sendMessage = useCallback(async (text) => {
        const msgText = text || input.trim();
        if (!msgText || isTyping) return;
        setInput('');

        // Add user message
        const userMsg = { role: 'user', text: msgText, id: Date.now() };
        setMessages(prev => [...prev, userMsg]);
        setIsTyping(true);

        try {
            const res = await axios.post(
                `${AI_API_END_POINT}/chat`,
                { message: msgText },
                { withCredentials: true }
            );
            const reply = res.data?.reply || "I couldn't get a response. Please try again.";
            setMessages(prev => [...prev, { role: 'ai', text: reply, id: Date.now() + 1 }]);
        } catch (err) {
            const errMsg = err.response?.data?.message || 'Something went wrong. Please try again.';
            setMessages(prev => [...prev, { role: 'ai', text: `⚠️ ${errMsg}`, id: Date.now() + 1 }]);
        } finally {
            setIsTyping(false);
        }
    }, [input, isTyping]);

    const clearChat = async () => {
        try {
            await axios.delete(`${AI_API_END_POINT}/history`, { withCredentials: true });
        } catch (_) {}
        setMessages([{
            role: 'ai',
            text: `Chat cleared! How can I help you${user ? `, ${user.fullname?.split(' ')[0]}` : ''}?`,
            id: Date.now()
        }]);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    // Don't render if user is not logged in (show subtle prompt instead)
    if (!user) {
        return (
            <div className="fixed bottom-6 right-6 z-50">
                <AnimatePresence>
                    {open && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="mb-4 w-72 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 p-6 text-center"
                        >
                            <div className="w-12 h-12 bg-gradient-to-br from-[#6A38C2] to-[#8B5CF6] rounded-2xl flex items-center justify-center mx-auto mb-3">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="font-bold text-gray-900 dark:text-white mb-1">Jobify AI</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                Please log in to chat with your AI career assistant.
                            </p>
                            <a href="/login" className="inline-block bg-gradient-to-r from-[#6A38C2] to-[#8B5CF6] text-white text-sm font-semibold px-5 py-2 rounded-xl hover:opacity-90 transition-opacity">
                                Log In
                            </a>
                        </motion.div>
                    )}
                </AnimatePresence>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setOpen(!open)}
                    className="w-14 h-14 rounded-full bg-gradient-to-br from-[#6A38C2] to-[#8B5CF6] shadow-xl shadow-[#6A38C2]/40 flex items-center justify-center"
                >
                    {open ? <X className="w-6 h-6 text-white" /> : <MessageSquare className="w-6 h-6 text-white" />}
                </motion.button>
            </div>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Panel */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: 20 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className="mb-4 w-[360px] sm:w-[400px] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden flex flex-col"
                        style={{ maxHeight: '560px' }}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-[#6A38C2] to-[#8B5CF6] px-4 py-3.5 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                                    <Sparkles className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <div className="text-white font-bold text-sm">Jobify AI</div>
                                    <div className="flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                        <span className="text-white/70 text-xs">Online</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={clearChat}
                                    title="Clear chat"
                                    className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                                >
                                    <RotateCcw className="w-4 h-4 text-white" />
                                </button>
                                <button
                                    onClick={() => setOpen(false)}
                                    className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                                >
                                    <X className="w-4 h-4 text-white" />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div
                            ref={bodyRef}
                            onScroll={handleScroll}
                            className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-white/10"
                            style={{ minHeight: 0 }}
                        >
                            {messages.map(msg => (
                                <MessageBubble
                                    key={msg.id}
                                    msg={msg}
                                    userInitial={avatarInitial}
                                    avatarGradient={avatarGradient}
                                />
                            ))}
                            {isTyping && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex items-center gap-2.5"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6A38C2] to-[#8B5CF6] flex items-center justify-center shrink-0">
                                        <Sparkles className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-sm">
                                        <TypingDots />
                                    </div>
                                </motion.div>
                            )}
                            <div ref={bottomRef} />
                        </div>

                        {/* Scroll to bottom button */}
                        <AnimatePresence>
                            {showScrollBtn && (
                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={scrollToBottom}
                                    className="absolute bottom-24 right-6 w-8 h-8 bg-[#6A38C2] text-white rounded-full shadow-lg flex items-center justify-center"
                                >
                                    <ChevronDown className="w-4 h-4" />
                                </motion.button>
                            )}
                        </AnimatePresence>

                        {/* Quick Replies */}
                        {messages.length <= 2 && (
                            <div className="px-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar shrink-0">
                                {QUICK_REPLIES.map(({ label, text }) => (
                                    <button
                                        key={label}
                                        onClick={() => sendMessage(text)}
                                        className="shrink-0 text-xs px-3 py-1.5 rounded-full border border-[#6A38C2]/30 text-[#6A38C2] dark:text-[#a78bfa] hover:bg-[#6A38C2]/10 transition-colors whitespace-nowrap"
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Input */}
                        <div className="px-4 py-3 border-t border-gray-100 dark:border-white/10 flex gap-2 items-end shrink-0">
                            <textarea
                                ref={inputRef}
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask me anything about jobs..."
                                rows={1}
                                className="flex-1 resize-none bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6A38C2]/30 focus:border-[#6A38C2] transition-all"
                                style={{ maxHeight: '100px' }}
                                onInput={e => {
                                    e.target.style.height = 'auto';
                                    e.target.style.height = e.target.scrollHeight + 'px';
                                }}
                            />
                            <button
                                onClick={() => sendMessage()}
                                disabled={!input.trim() || isTyping}
                                className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6A38C2] to-[#8B5CF6] flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[#6A38C2]/30 transition-all shrink-0"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Button */}
            <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setOpen(!open)}
                className="relative w-14 h-14 rounded-full bg-gradient-to-br from-[#6A38C2] to-[#8B5CF6] shadow-xl shadow-[#6A38C2]/40 flex items-center justify-center"
                aria-label="Open AI Assistant"
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
                <span className="absolute inset-0 rounded-full border-2 border-[#8B5CF6]/50 animate-ping" />
            </motion.button>
        </div>
    );
};

export default AIAssistant;
