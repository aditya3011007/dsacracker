import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, X, ExternalLink, CheckCircle } from 'lucide-react';
import { useStore } from '../../store/useStore';
import confetti from 'canvas-confetti';

const DailyChallenge = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [challenge, setChallenge] = useState(null);
    const data = useStore((state) => state.data);
    const toggleQuestionDone = useStore((state) => state.toggleQuestionDone);

    const getUnsolvedQuestion = () => {
        let unsolved = [];
        data.forEach((topic, tIndex) => {
            topic.questions.forEach((q, qIndex) => {
                if (!q.Done) {
                    unsolved.push({ ...q, topicName: topic.topicName, tIndex, qIndex });
                }
            });
        });

        if (unsolved.length === 0) return null;
        return unsolved[Math.floor(Math.random() * unsolved.length)];
    };

    useEffect(() => {
        setChallenge(getUnsolvedQuestion());
    }, []); // Get once per session

    const handleComplete = () => {
        if (challenge) {
            toggleQuestionDone(challenge.topicName, challenge.qIndex, true);
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#8b5cf6', '#10b981', '#f8fafc', '#3b82f6']
            });
            setTimeout(() => setIsOpen(false), 2000);
        }
    };

    return (
        <>
            <motion.button
                className="fixed bottom-6 right-6 z-[2000] p-4 rounded-full bg-accent-color text-white shadow-2xl hover:shadow-accent-color/50 border border-border-color-light"
                whileHover={{ scale: 1.1, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(true)}
            >
                <Swords size={28} />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-background-dark/80 backdrop-blur-sm"
                            onClick={() => setIsOpen(false)}
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: 50, rotateX: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: 50, rotateX: -20 }}
                            transition={{ type: "spring", bounce: 0.4, duration: 0.6 }}
                            className="relative bento-glass w-full max-w-lg rounded-3xl p-8 border-t-2 border-t-accent-color/50 shadow-2xl flex flex-col items-center text-center"
                            style={{ perspective: 1000 }}
                        >
                            <button
                                className="absolute top-4 right-4 text-text-secondary-light hover:text-white transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                <X size={24} />
                            </button>

                            <div className="w-16 h-16 rounded-full bg-accent-color/20 flex items-center justify-center mb-6 text-accent-color">
                                <Swords size={32} />
                            </div>

                            <h2 className="text-3xl font-display font-bold text-white mb-2">Daily Quest</h2>

                            {!challenge ? (
                                <p className="text-text-secondary-light">You have mastered all DSA topics! 🏆</p>
                            ) : (
                                <>
                                    <span className="px-3 py-1 rounded-full bg-surface-dark text-xs font-bold text-warning-color mb-6 uppercase tracking-wider">
                                        {challenge.topicName}
                                    </span>

                                    <p className="text-xl text-text-primary-light font-medium mb-8 leading-relaxed">
                                        "{challenge.Problem}"
                                    </p>

                                    <div className="flex gap-4 w-full">
                                        <a
                                            href={challenge.URL}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-surface-dark hover:bg-surface-dark/80 text-white font-semibold transition-colors border border-border-color-light"
                                        >
                                            Solve <ExternalLink size={18} />
                                        </a>
                                        <button
                                            onClick={handleComplete}
                                            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-accent-color hover:bg-accent-color/90 text-white font-semibold shadow-lg shadow-accent-color/25 transition-transform active:scale-95"
                                        >
                                            Done <CheckCircle size={18} />
                                        </button>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default DailyChallenge;
