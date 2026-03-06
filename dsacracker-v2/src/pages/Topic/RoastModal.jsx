import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flame, Send, Loader2, Code2, AlertTriangle } from 'lucide-react';
import { useStore } from '../../store/useStore';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const RoastModal = ({ isOpen, onClose, questionName }) => {
    const [userCode, setUserCode] = useState('');
    const [roastResponse, setRoastResponse] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const token = useStore((state) => state.token);

    // Reset when changing questions or closing
    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setUserCode('');
                setRoastResponse(null);
                setIsLoading(false);
            }, 300);
        }
    }, [isOpen, questionName]);

    const requestRoast = async () => {
        if (isLoading || !userCode.trim()) return;
        setIsLoading(true);
        setRoastResponse(null);

        try {
            const response = await fetch('http://localhost:5005/api/ai/roast', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ questionName, userCode })
            });

            if (!response.ok) throw new Error('Failed to fetch roast');

            const data = await response.json();
            setRoastResponse(data.text);
        } catch (error) {
            console.error("Roast error:", error);
            setRoastResponse("*(Error connecting to the Gordon Ramsay AI Server. It probably threw its keyboard through a window.)*");
        } finally {
            setIsLoading(false);
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
                        className="fixed inset-0 bg-background-dark/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
                    >
                        {/* Modal Content */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 30 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-4xl h-[85vh] bento-glass rounded-3xl border border-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.1)] overflow-hidden flex flex-col md:flex-row"
                        >
                            {/* Left Pane: Code Input */}
                            <div className="flex-1 flex flex-col border-b md:border-b-0 md:border-r border-red-500/10 bg-surface-dark/40 overflow-hidden h-1/2 md:h-full">
                                {/* Header */}
                                <div className="p-5 border-b border-red-500/10 flex items-center justify-between shrink-0 bg-red-500/5">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 rounded-xl bg-red-500/20 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                                            <Code2 size={24} />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-display font-bold text-white">Serve Your Code</h2>
                                            <p className="text-xs text-red-300/80 line-clamp-1">{questionName}</p>
                                        </div>
                                    </div>
                                    {/* Mobile Close Button */}
                                    <button
                                        onClick={onClose}
                                        className="md:hidden p-2 rounded-xl hover:bg-white/10 text-text-secondary-light hover:text-white transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                {/* Textarea */}
                                <div className="flex-1 p-5 relative flex flex-col custom-scrollbar overflow-y-auto">
                                    <div className="flex items-start gap-2 text-sm text-red-400 mb-4 bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                                        <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                                        <p>Warning: The AI is incredibly mean. Paste your code below and brace yourself.</p>
                                    </div>
                                    <textarea
                                        value={userCode}
                                        onChange={(e) => setUserCode(e.target.value)}
                                        placeholder="// Paste your Spaghetti Code here..."
                                        className="w-full flex-1 bg-background-dark/50 border border-white/5 rounded-xl p-4 text-sm font-mono text-text-primary-light placeholder-text-secondary-dark focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 resize-none transition-all"
                                    />
                                    <button
                                        onClick={requestRoast}
                                        disabled={isLoading || !userCode.trim()}
                                        className="mt-4 w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed transition-all"
                                    >
                                        {isLoading ? (
                                            <><Loader2 size={18} className="animate-spin" /> Cooking...</>
                                        ) : (
                                            <><Flame size={18} /> ROAST ME</>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Right Pane: AI Roast Output */}
                            <div className="flex-1 flex flex-col bg-background-dark/80 relative overflow-hidden h-1/2 md:h-full">
                                {/* Desktop Header */}
                                <div className="p-5 border-b border-white/5 flex items-center justify-between shrink-0 bg-surface-dark/80">
                                    <div className="flex items-center gap-3 opacity-80">
                                        <div className="text-xl">🔥</div>
                                        <div>
                                            <h2 className="text-lg font-display font-medium text-white">Chef's Critique</h2>
                                        </div>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="hidden md:block p-2 rounded-xl hover:bg-white/10 text-text-secondary-light hover:text-white transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                {/* Roast Output */}
                                <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                                    {!roastResponse && !isLoading ? (
                                        <div className="h-full flex flex-col items-center justify-center text-center opacity-30 pb-10">
                                            <Flame size={64} className="mb-4 text-text-secondary-light" />
                                            <p className="text-lg font-display tracking-wider">Waiting for your trash code...</p>
                                        </div>
                                    ) : isLoading ? (
                                        <div className="h-full flex flex-col items-center justify-center pb-10 gap-4">
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-red-500/30 blur-xl animate-pulse rounded-full"></div>
                                                <Flame size={48} className="text-red-500 animate-bounce relative z-10" />
                                            </div>
                                            <p className="text-red-400 font-display animate-pulse tracking-widest text-sm font-bold uppercase">Preparing to destroy your ego...</p>
                                        </div>
                                    ) : (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="prose prose-invert prose-p:leading-relaxed prose-pre:bg-surface-dark prose-pre:border prose-pre:border-white/10 w-full max-w-none"
                                        >
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {roastResponse}
                                            </ReactMarkdown>
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default RoastModal;
