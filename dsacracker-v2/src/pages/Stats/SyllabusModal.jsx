import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Loader2, BookOpen, Target, ChevronRight } from 'lucide-react';
import { useStore } from '../../store/useStore';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const SyllabusModal = ({ isOpen, onClose }) => {
    const [syllabusResponse, setSyllabusResponse] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const token = useStore((state) => state.token);
    const data = useStore((state) => state.data);

    // Reset when closing
    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setSyllabusResponse(null);
                setIsLoading(false);
            }, 300);
        }
    }, [isOpen]);

    const generateSyllabus = async () => {
        if (isLoading) return;
        setIsLoading(true);
        setSyllabusResponse(null);

        // 1. Compile User Progress Summary
        let summaryParts = [];
        data.forEach(topic => {
            const total = topic.questions.length;
            const done = topic.doneQuestions;
            if (total === 0) return;

            let bookmarks = 0;
            topic.questions.forEach(q => { if (q.Bookmark) bookmarks++; });

            if (done > 0 || bookmarks > 0) {
                summaryParts.push(`- **${topic.topicName}**: ${done}/${total} completed. ${bookmarks} questions bookmarked for review.`);
            } else {
                summaryParts.push(`- **${topic.topicName}**: 0/${total} completed (Not Started).`);
            }
        });

        const progressSummary = summaryParts.join('\n');

        // 2. Transmit to Backend
        try {
            const response = await fetch('http://localhost:5005/api/ai/syllabus', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ progressSummary })
            });

            if (!response.ok) throw new Error('Failed to fetch syllabus');

            const responseData = await response.json();
            setSyllabusResponse(responseData.text);
        } catch (error) {
            console.error("Syllabus error:", error);
            setSyllabusResponse("*(Error connecting to the AI Mentor. Please ensure the backend is running and you are logged in.)*");
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
                        className="fixed inset-0 bg-background-dark/90 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-8"
                    >
                        {/* Modal Content */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 30 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-5xl h-[85vh] bento-glass rounded-3xl border border-blue-500/20 shadow-[0_0_50px_rgba(59,130,246,0.1)] overflow-hidden flex flex-col relative"
                        >
                            {/* Decorative Background Elements */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-color/10 rounded-full blur-[100px] pointer-events-none" />

                            {/* Header */}
                            <div className="p-6 md:p-8 border-b border-border-color-light flex items-center justify-between shrink-0 bg-surface-dark/50 backdrop-blur-sm z-10">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-2xl bg-blue-500/20 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                                        <BookOpen size={28} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-display font-bold text-white tracking-wide flex items-center gap-2">
                                            Smart Syllabus <Sparkles size={20} className="text-blue-400" />
                                        </h2>
                                        <p className="text-sm text-text-secondary-light">Your AI-generated personalized study masterplan</p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-xl hover:bg-white/10 text-text-secondary-light hover:text-white transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Content Area */}
                            <div className="flex-1 overflow-hidden flex flex-col md:flex-row z-10 relative">

                                {/* Left Side: Trigger & Info */}
                                <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-border-color-light bg-background-dark/30 p-6 md:p-8 flex flex-col">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                            <Target size={20} className="text-accent-color" /> How it works
                                        </h3>
                                        <p className="text-text-secondary-light leading-relaxed mb-6 text-sm">
                                            The Staff Engineer AI Agent will evaluate your entire DSA progress matrix. It analyzes which topics you've mastered, which ones you are avoiding, and where you have placed bookmarks for review.
                                        </p>
                                        <p className="text-text-secondary-light leading-relaxed mb-6 text-sm">
                                            It will then generate a highly tailored, step-by-step roadmap recommending exactly what you should study next to maximize your interview readiness.
                                        </p>
                                    </div>

                                    <button
                                        onClick={generateSyllabus}
                                        disabled={isLoading}
                                        className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-accent-color text-white font-bold text-lg flex items-center justify-center gap-3 hover:shadow-[0_0_25px_rgba(59,130,246,0.4)] hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed transition-all relative overflow-hidden group"
                                    >
                                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                                        {isLoading ? (
                                            <><Loader2 size={24} className="animate-spin relative z-10" /> Analyzing Progress...</>
                                        ) : (
                                            <><Sparkles size={24} className="relative z-10" /> Generate Masterplan</>
                                        )}
                                    </button>
                                </div>

                                {/* Right Side: Generated Output */}
                                <div className="w-full md:w-2/3 bg-surface-dark/20 p-6 md:p-10 overflow-y-auto custom-scrollbar relative">
                                    {!syllabusResponse && !isLoading && (
                                        <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                                            <BookOpen size={80} className="mb-6 text-text-secondary-light drop-shadow-lg" />
                                            <p className="text-2xl font-display tracking-wider">Awaiting Generation...</p>
                                            <p className="text-sm mt-2 max-w-sm">Click the button to compile your stats and generate your roadmap.</p>
                                        </div>
                                    )}

                                    {isLoading && (
                                        <div className="h-full flex flex-col items-center justify-center gap-6">
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-blue-500/20 blur-2xl animate-pulse rounded-full"></div>
                                                <div className="w-20 h-20 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin relative z-10"></div>
                                            </div>
                                            <p className="text-blue-400 font-display animate-pulse tracking-widest font-bold uppercase">Synthesizing Data Matrix...</p>
                                        </div>
                                    )}

                                    {syllabusResponse && !isLoading && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5 }}
                                            className="prose prose-invert prose-p:leading-relaxed prose-headings:font-display prose-headings:text-transparent prose-headings:bg-clip-text prose-headings:bg-gradient-to-r prose-headings:from-blue-400 prose-headings:to-accent-color prose-li:text-text-secondary-light prose-strong:text-white max-w-none pb-12"
                                        >
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {syllabusResponse}
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

export default SyllabusModal;
