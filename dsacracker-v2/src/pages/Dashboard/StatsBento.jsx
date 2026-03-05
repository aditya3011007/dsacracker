import React, { useState } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { Trophy, Code2, Target, Hash } from 'lucide-react';

const StatsBento = () => {
    const data = useStore((state) => state.data);
    const lcUsername = useStore((state) => state.lcUsername);
    const lcStats = useStore((state) => state.lcStats);
    const setLcData = useStore((state) => state.setLcData);

    const [inputUsername, setInputUsername] = useState(lcUsername);
    const [loading, setLoading] = useState(false);
    const [lcError, setLcError] = useState('');

    let manualTotalQuestions = 0;
    let manualTotalSolved = 0;
    data.forEach(topic => {
        manualTotalQuestions += topic.questions.length;
        manualTotalSolved += topic.doneQuestions;
    });

    // Always use internal 450-list counts for the main ring to separate concerns
    const totalQuestions = manualTotalQuestions;
    const totalSolved = manualTotalSolved;

    const percentage = totalQuestions > 0 ? ((totalSolved / totalQuestions) * 100).toFixed(1) : 0;
    const dashOffset = 440 - (440 * percentage) / 100;

    // Mouse glow for the LC card
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = ({ currentTarget, clientX, clientY }) => {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    };

    const fetchLeetCodeStats = async (e) => {
        e.preventDefault();
        if (!inputUsername.trim()) return;
        setLoading(true);
        setLcError('');
        try {
            const res = await fetch(`https://leetcode-api-faisalshohag.vercel.app/${inputUsername}`);

            if (!res.ok) {
                setLcError("User not found or API Error.");
                setLoading(false);
                return;
            }

            const json = await res.json();

            if (json.errors || !json.totalSolved) {
                setLcError(json.message || "User not found or API Error.");
            } else {
                setLcData(inputUsername, json);
                setInputUsername('');
            }
        } catch (err) {
            setLcError("Network Error. API might be down.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto px-6 mb-20">
            {/* Global Progress Card */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "spring", delay: 0.3 }}
                className="bento-glass rounded-3xl p-8 relative overflow-hidden group flex flex-col items-center justify-center text-center"
            >
                <div className="absolute top-0 right-0 p-6 opacity-10">
                    <Target size={120} />
                </div>
                <h3 className="text-2xl font-display font-bold mb-6 z-10">Global Progress</h3>

                <div className="relative w-48 h-48 flex items-center justify-center mb-4 z-10">
                    <svg width="100%" height="100%" viewBox="0 0 160 160" className="-rotate-90 drop-shadow-2xl">
                        <circle r="70" cx="80" cy="80" fill="transparent" stroke="rgba(139, 92, 246, 0.1)" strokeWidth="12" />
                        <motion.circle
                            r="70" cx="80" cy="80" fill="transparent"
                            stroke="var(--accent-color)" strokeWidth="12"
                            strokeDasharray="440" strokeDashoffset={440}
                            animate={{ strokeDashoffset: dashOffset }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                        <span className="text-4xl font-bold font-display">{percentage}%</span>
                    </div>
                </div>
                <div className="text-text-secondary-light font-medium tracking-wide z-10">
                    {totalSolved} / {totalQuestions} Solved
                </div>
            </motion.div>

            {/* LeetCode Sync Card */}
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "spring", delay: 0.4 }}
                className="bento-glass rounded-3xl p-8 relative overflow-hidden group"
                onMouseMove={handleMouseMove}
            >
                {/* Spotlight hover effect */}
                <motion.div
                    className="absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none"
                    style={{
                        background: useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, rgba(139, 92, 246, 0.15), transparent 80%)`
                    }}
                />

                <div className="flex justify-between items-start mb-6 z-10 relative">
                    <h3 className="text-2xl font-display font-bold flex items-center gap-2">
                        <Code2 className="text-warning-color" /> {lcStats ? 'LeetCode Synced' : 'LeetCode Sync'}
                    </h3>
                    {lcStats && (
                        <button
                            className="bg-danger-color/20 text-danger-color text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-danger-color/30 transition-colors"
                            onClick={() => setLcData('', null)}
                        >
                            Unlink
                        </button>
                    )}
                </div>

                {!lcStats && (
                    <form onSubmit={fetchLeetCodeStats} className="flex gap-2 mb-6 z-10 relative">
                        <input
                            className="flex-1 bg-surface-dark border border-border-color-light rounded-xl px-4 py-3 outline-none focus:border-accent-color transition-colors"
                            placeholder="Username (e.g. lee215)"
                            value={inputUsername}
                            onChange={(e) => setInputUsername(e.target.value)}
                        />
                        <button
                            className="bg-accent-color hover:bg-accent-color/80 text-white font-bold px-6 py-3 rounded-xl transition-all active:scale-95 flex items-center gap-2"
                            disabled={loading}
                        >
                            {loading ? 'Syncing...' : 'Sync'}
                        </button>
                    </form>
                )}

                <div className="z-10 relative min-h-[140px] flex flex-col justify-center">
                    {lcError && (
                        <div className="text-center text-danger-color bg-danger-color/10 p-3 rounded-xl border border-danger-color/20 mb-4">
                            {lcError}
                        </div>
                    )}

                    {!lcStats && !lcError && (
                        <div className="text-center text-text-secondary-light/50">
                            Enter your username to auto-fill your progress & stats.
                        </div>
                    )}

                    {lcStats && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="grid grid-cols-2 gap-4"
                        >
                            <div className="bg-surface-dark border border-border-color-light rounded-2xl p-4">
                                <span className="text-text-secondary-light text-sm font-semibold">Total Solved</span>
                                <div className="text-3xl font-display font-bold mt-1 text-white">{lcStats.totalSolved}</div>
                            </div>
                            <div className="bg-surface-dark border border-border-color-light rounded-2xl p-4">
                                <span className="text-text-secondary-light text-sm font-semibold">Global Rank</span>
                                <div className="text-3xl font-display font-bold mt-1 text-accent-color">#{lcStats.ranking}</div>
                            </div>
                            <div className="col-span-2 flex justify-between bg-surface-dark border border-border-color-light rounded-2xl p-4 mt-2">
                                <div className="text-center">
                                    <div className="text-[#10b981] font-bold text-xl">{lcStats.easySolved}</div>
                                    <div className="text-xs text-text-secondary-light font-bold">Easy</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-[#f59e0b] font-bold text-xl">{lcStats.mediumSolved}</div>
                                    <div className="text-xs text-text-secondary-light font-bold">Medium</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-[#ef4444] font-bold text-xl">{lcStats.hardSolved}</div>
                                    <div className="text-xs text-text-secondary-light font-bold">Hard</div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default StatsBento;
