import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lightbulb, ChevronRight, Loader2, Lock, Unlock } from 'lucide-react';
import { useStore } from '../../store/useStore';

const HintModal = ({ isOpen, onClose, questionName }) => {
    // 0 = no hints unlocked, 1 = intuition, 2 = approach, 3 = complexity
    const [unlockedLevel, setUnlockedLevel] = useState(0);
    // Tracks which hint's content is actively expanded (accordion style)
    const [activeAccordion, setActiveAccordion] = useState(0);
    const [hints, setHints] = useState({ 1: '', 2: '', 3: '' });
    const [isLoading, setIsLoading] = useState(false);
    const token = useStore((state) => state.token);

    // Reset when changing questions or closing
    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setUnlockedLevel(0);
                setActiveAccordion(0);
                setHints({ 1: '', 2: '', 3: '' });
                setIsLoading(false);
            }, 300);
        }
    }, [isOpen, questionName]);

    const requestHint = async (level) => {
        if (isLoading) return;
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:5005/api/ai/hint', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ questionName, hintLevel: level })
            });

            if (!response.ok) throw new Error('Failed to fetch hint');

            const data = await response.json();

            setHints(prev => ({ ...prev, [level]: data.text }));
            setUnlockedLevel(level);
            setActiveAccordion(level);
        } catch (error) {
            console.error("Hint error:", error);
            setHints(prev => ({ ...prev, [level]: "*(Error: Could not connect to the AI Hint Server)*" }));
            setUnlockedLevel(level); // Still unlock so they can see error
            setActiveAccordion(level);
        } finally {
            setIsLoading(false);
        }
    };

    const HintBox = ({ level, title, description, isNext }) => {
        const isUnlocked = unlockedLevel >= level;
        const isActive = isLoading && isNext;
        const isExpanded = activeAccordion === level;

        return (
            <motion.div
                layout
                className={`flex flex-col rounded-2xl border ${isUnlocked ? 'bg-surface-dark border-secondary-color/30' : 'bg-surface-dark/40 border-white/5'} overflow-hidden transition-all`}
            >
                {/* Header Row */}
                <div
                    className={`flex items-center justify-between p-4 ${isUnlocked ? 'cursor-pointer hover:bg-white/5' : (!isUnlocked && isNext && !isLoading ? 'cursor-pointer hover:bg-white/5' : '')}`}
                    onClick={() => {
                        if (isUnlocked) {
                            // Toggle Accordion if already unlocked
                            setActiveAccordion(isExpanded ? 0 : level);
                        } else if (!isUnlocked && isNext && !isLoading) {
                            // Trigger API if it's the next locked hint
                            requestHint(level);
                        }
                    }}
                >
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl flex items-center justify-center ${isUnlocked ? 'bg-secondary-color/20 text-secondary-color' : 'bg-background-dark text-text-secondary-dark'}`}>
                            {isUnlocked ? <Unlock size={18} /> : <Lock size={18} />}
                        </div>
                        <div>
                            <div className={`text-sm font-semibold ${isUnlocked ? 'text-white' : 'text-text-secondary-light'}`}>
                                Hint {level}: {title}
                            </div>
                            {!isUnlocked && <div className="text-xs text-text-secondary-dark">{description}</div>}
                        </div>
                    </div>

                    {!isUnlocked && isNext && (
                        <div className="text-xs font-bold text-secondary-color flex items-center gap-1 bg-secondary-color/10 px-3 py-1.5 rounded-full">
                            {isActive ? <><Loader2 size={14} className="animate-spin" /> Unlocking...</> : <>Unlock <ChevronRight size={14} /></>}
                        </div>
                    )}
                </div>

                {/* Content Area (Animated Accordion Reveal) */}
                <AnimatePresence>
                    {isUnlocked && isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            className="border-t border-white/5 bg-background-dark/50"
                        >
                            <div className="p-4 text-sm text-text-primary-light leading-relaxed whitespace-pre-wrap">
                                {hints[level]}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        );
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
                        className="fixed inset-0 bg-background-dark/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        {/* Modal Content */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-lg bento-glass rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-5 border-b border-white/5 bg-surface-dark/80 shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 rounded-xl bg-yellow-500/20 text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)]">
                                        <Lightbulb size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-display font-bold text-white">Progressive AI Hints</h2>
                                        <p className="text-xs text-text-secondary-light line-clamp-1">{questionName}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-xl hover:bg-white/10 text-text-secondary-light hover:text-white transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Hint Progression List */}
                            <div className="p-5 overflow-y-auto custom-scrollbar flex flex-col gap-4">
                                <p className="text-sm text-text-secondary-light mb-2">
                                    Stuck? Unlock hints progressively. The AI will never give away the direct code solution.
                                </p>

                                <HintBox
                                    level={1}
                                    title="Semantic Intuition"
                                    description="Get a real-world analogy or high-level concept."
                                    isNext={unlockedLevel === 0}
                                />
                                <HintBox
                                    level={2}
                                    title="Algorithmic Approach"
                                    description="Discover the required pattern (e.g., sliding window)."
                                    isNext={unlockedLevel === 1}
                                />
                                <HintBox
                                    level={3}
                                    title="Optimal Complexity"
                                    description="Target Time/Space constraints and Data Structures."
                                    isNext={unlockedLevel === 2}
                                />
                            </div>

                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default HintModal;
