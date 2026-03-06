import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, BrainCircuit, Code2, Bot, User, Loader2 } from 'lucide-react';
import { useStore } from '../../store/useStore';

const InterviewModal = ({ isOpen, onClose, questionName, questionUrl }) => {
    const [userCode, setUserCode] = useState('');
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);
    const token = useStore((state) => state.token);

    // Auto-scroll chat
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // Focus chat input on open
    useEffect(() => {
        if (isOpen) {
            setMessages([
                {
                    role: 'ai',
                    text: `Hello! I'm your Senior Staff Engineer for today's mock interview on **${questionName}**.\n\nTake your time to write out your approach in the code editor. When you're ready, ask me for a hint, or submit your code for a Time & Space complexity review!`
                }
            ]);
            setTimeout(() => {
                textareaRef.current?.focus();
            }, 500);
        } else {
            // Reset when closed
            setUserCode('');
            setMessages([]);
            setInputValue('');
        }
    }, [isOpen, questionName]);

    const handleSendMessage = async () => {
        if (!inputValue.trim() && !userCode.trim()) return;

        const newUserMessage = { role: 'user', text: inputValue || "Can you review my code?" };
        const updatedMessages = [...messages, newUserMessage];

        setMessages(updatedMessages);
        setInputValue('');
        setIsTyping(true);

        try {
            const response = await fetch('http://localhost:5005/api/ai/interview', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    questionName,
                    userCode,
                    chatHistory: updatedMessages.filter(m => m.text) // Send previous context
                })
            });

            if (!response.ok) throw new Error('Failed to get AI response');

            const data = await response.json();

            setMessages(prev => [...prev, { role: 'ai', text: data.text }]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'ai', text: "*(System Network Error: Could not connect to the FAANG Interviewer. Please ensure your backend is running.)*" }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-background-dark/90 backdrop-blur-md z-[200]"
                    />

                    {/* Massive Full Screen Modal */}
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 250, damping: 25 }}
                        className="fixed top-4 bottom-4 left-4 right-4 z-[201] flex flex-col bento-glass rounded-3xl overflow-hidden shadow-2xl border border-secondary-color/30"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 px-6 border-b border-white/5 bg-surface-dark/80 shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="p-2 rounded-xl bg-secondary-color/20 text-secondary-color">
                                    <BrainCircuit size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-display font-bold text-white flex items-center gap-3">
                                        FAANG Mock Interview
                                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-warning-color/20 text-warning-color uppercase">
                                            AI Beta
                                        </span>
                                    </h2>
                                    <a href={questionUrl} target="_blank" rel="noreferrer" className="text-sm text-text-secondary-light hover:text-secondary-color transition-colors line-clamp-1">
                                        Problem: {questionName}
                                    </a>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-3 rounded-xl hover:bg-white/10 text-text-secondary-light hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Split Workspace */}
                        <div className="flex flex-1 overflow-hidden flex-col md:flex-row">

                            {/* Left Pane: Code Editor */}
                            <div className="w-full md:w-[55%] border-b md:border-b-0 md:border-r border-white/5 flex flex-col bg-[#0d1117]">
                                <div className="flex items-center gap-2 p-3 px-5 border-b border-white/5 text-xs font-mono text-text-secondary-light uppercase tracking-wider shrink-0 bg-[#161b22]">
                                    <Code2 size={16} /> Solution Workspace
                                </div>
                                <textarea
                                    value={userCode}
                                    onChange={(e) => setUserCode(e.target.value)}
                                    placeholder="// Paste your JavaScript, Python, or C++ approach here..."
                                    className="flex-1 w-full bg-transparent p-6 text-sm font-mono text-text-primary-light outline-none resize-none custom-scrollbar"
                                    spellCheck="false"
                                />
                            </div>

                            {/* Right Pane: AI Chat */}
                            <div className="w-full md:w-[45%] flex flex-col bg-surface-dark/30 relative">

                                {/* Chat History */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                                    {messages.map((msg, idx) => (
                                        <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                            <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-accent-color/20 text-accent-color' : 'bg-secondary-color/20 text-secondary-color'}`}>
                                                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                                            </div>
                                            <div className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                                <div className="text-xs text-text-secondary-light mb-1 px-1">
                                                    {msg.role === 'user' ? 'You' : 'Staff Engineer'}
                                                </div>
                                                <div className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'user'
                                                        ? 'bg-accent-color/10 text-text-primary-light rounded-tr-sm border border-accent-color/20'
                                                        : 'bg-surface-dark/80 text-text-primary-light rounded-tl-sm border border-white/5 shadow-xl'
                                                    }`}>
                                                    {/* Ideally we use a Markdown renderer here, but whitespace-pre-wrap works for V1 text constraints */}
                                                    {msg.text}
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {isTyping && (
                                        <div className="flex gap-4">
                                            <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-secondary-color/20 text-secondary-color">
                                                <Bot size={16} />
                                            </div>
                                            <div className="p-4 rounded-2xl rounded-tl-sm bg-surface-dark/80 border border-white/5 text-text-secondary-light flex items-center gap-2">
                                                <Loader2 size={16} className="animate-spin text-secondary-color" />
                                                Analyzing complexity...
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Chat Input Area */}
                                <div className="p-4 bg-surface-dark/90 border-t border-white/5 shrink-0 backdrop-blur-md">
                                    <div className="flex items-end gap-3 bg-background-dark/50 rounded-2xl border border-white/10 p-2 focus-within:border-secondary-color/50 transition-colors">
                                        <textarea
                                            ref={textareaRef}
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            placeholder="Ask for a hint, or press Enter to submit your code for review..."
                                            className="flex-1 max-h-32 bg-transparent p-3 text-sm text-text-primary-light outline-none resize-none custom-scrollbar"
                                            rows={1}
                                        />
                                        <button
                                            onClick={handleSendMessage}
                                            disabled={isTyping || (!inputValue.trim() && !userCode.trim())}
                                            className="p-3 mb-1 mr-1 rounded-xl bg-secondary-color text-white hover:bg-secondary-color/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_15px_rgba(156,39,176,0.4)] disabled:shadow-none"
                                        >
                                            <Send size={18} />
                                        </button>
                                    </div>
                                    <div className="text-center mt-2 text-[10px] text-text-secondary-light">
                                        AI can make mistakes. Consider manually executing your code on LeetCode.
                                    </div>
                                </div>

                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default InterviewModal;
