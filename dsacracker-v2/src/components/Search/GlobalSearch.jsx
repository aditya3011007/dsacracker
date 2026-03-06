import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Sparkles, Loader2, BookOpen, ExternalLink, ArrowRight } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useNavigate } from 'react-router-dom';

const GlobalSearch = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const token = useStore((state) => state.token);
    const data = useStore((state) => state.data);
    const navigate = useNavigate();
    const inputRef = useRef(null);

    // Focus input on open
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current.focus(), 100);
        }
    }, [isOpen]);

    // Reset when closing
    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setQuery('');
                setResults([]);
                setHasSearched(false);
            }, 300);
        }
    }, [isOpen]);

    // Handle Escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);


    const performSearch = async (e) => {
        e.preventDefault();
        if (!query.trim() || isLoading) return;

        setIsLoading(true);
        setHasSearched(true);
        setResults([]);

        try {
            // 1. Get Canonical Problem Name from Gemini
            const response = await fetch('http://localhost:5005/api/ai/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ query })
            });

            if (!response.ok) throw new Error('Search failed');

            const { problemName } = await response.json();

            // 2. Fuzzy Match across Local Data Store
            const matchedQuestions = [];
            const searchTerms = problemName.toLowerCase().split(' ');

            data.forEach(topic => {
                topic.questions.forEach(q => {
                    const titleLower = q.Problem.toLowerCase();
                    // Simple text match: if title contains the AI-suggested name, or any significant words from it
                    const exactMatch = titleLower.includes(problemName.toLowerCase());
                    const partialMatch = searchTerms.some(term => term.length > 3 && titleLower.includes(term));

                    if (exactMatch || partialMatch) {
                        matchedQuestions.push({
                            ...q,
                            topicName: topic.topicName,
                            exactMatch
                        });
                    }
                });
            });

            // Sort so exact matches are first
            matchedQuestions.sort((a, b) => (b.exactMatch ? 1 : 0) - (a.exactMatch ? 1 : 0));

            // Limit to top 5 results
            setResults(matchedQuestions.slice(0, 5));

        } catch (error) {
            console.error("Search error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleNavigate = (topicName) => {
        onClose();
        navigate(`/topic/${topicName.replace(/[^A-Z0-9]+/gi, "_").toLowerCase()}`);
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
                        className="fixed inset-0 bg-background-dark/90 backdrop-blur-md z-[1001] flex items-start justify-center pt-20 md:pt-32 p-4"
                    >
                        {/* Search Modal */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: -20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: -20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-2xl bento-glass rounded-3xl border border-blue-500/20 shadow-[0_20px_60px_rgba(59,130,246,0.15)] overflow-hidden flex flex-col"
                        >
                            {/* Input Form */}
                            <form onSubmit={performSearch} className="relative border-b border-border-color-light p-4 md:p-6 bg-surface-dark/50">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-400" size={28} />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Describe a problem... e.g., 'find longest subarray of 1s'"
                                    className="w-full bg-transparent border-none text-white text-xl md:text-2xl pl-14 pr-12 focus:outline-none placeholder:text-text-secondary-light/50 font-display"
                                />
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="absolute right-6 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-white/10 text-text-secondary-light hover:text-white transition-colors"
                                >
                                    <X size={24} />
                                </button>

                                {/* Decorator */}
                                <div className="absolute top-0 right-0 p-4 pointer-events-none opacity-20">
                                    <Sparkles size={80} className="text-blue-500" />
                                </div>
                            </form>

                            {/* Results Area */}
                            <div className="max-h-[60vh] overflow-y-auto custom-scrollbar bg-background-dark/50">

                                {/* Loading State */}
                                {isLoading && (
                                    <div className="p-8 flex flex-col items-center justify-center gap-4 text-blue-400">
                                        <Loader2 size={32} className="animate-spin" />
                                        <div className="text-sm font-semibold tracking-wide uppercase">AI is analyzing intent...</div>
                                    </div>
                                )}

                                {/* Zero State */}
                                {!hasSearched && !isLoading && (
                                    <div className="p-10 flex flex-col items-center text-center opacity-50">
                                        <Sparkles size={48} className="mb-4 text-text-secondary-light" />
                                        <p className="text-lg font-display text-white">Semantic Search Active</p>
                                        <p className="text-sm text-text-secondary-light mt-2">Don't remember the name? Describe the algorithm logic to find it instantly.</p>
                                    </div>
                                )}

                                {/* No Results */}
                                {hasSearched && !isLoading && results.length === 0 && (
                                    <div className="p-10 flex flex-col items-center text-center opacity-70">
                                        <BookOpen size={48} className="mb-4 text-text-secondary-light" />
                                        <p className="text-lg font-display text-white">No matches found in your database.</p>
                                        <p className="text-sm text-text-secondary-light mt-2">Try rewording your query to focus on the core data structure or algorithm.</p>
                                    </div>
                                )}

                                {/* Results List */}
                                {!isLoading && results.length > 0 && (
                                    <div className="p-2">
                                        {results.map((q, idx) => (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                key={q.URL + idx}
                                                className="group flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl hover:bg-surface-dark transition-colors border border-transparent hover:border-border-color-light"
                                            >
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-accent-color/20 text-accent-color uppercase tracking-wider">
                                                            {q.topicName}
                                                        </span>
                                                        {q.exactMatch && (
                                                            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-400 uppercase tracking-wider flex items-center gap-1">
                                                                <Sparkles size={10} /> AI Best Match
                                                            </span>
                                                        )}
                                                    </div>
                                                    <a
                                                        href={q.URL}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors flex items-center gap-2"
                                                    >
                                                        {q.Problem}
                                                        <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </a>
                                                </div>

                                                <button
                                                    onClick={() => handleNavigate(q.topicName)}
                                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-background-dark border border-border-color-light text-text-primary-light hover:bg-accent-color hover:border-accent-color hover:text-background-dark transition-all text-sm font-semibold shrink-0"
                                                >
                                                    Go to Topic <ArrowRight size={16} />
                                                </button>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-3 border-t border-border-color-light bg-surface-dark/80 text-center text-xs text-text-secondary-light/50 flex justify-center items-center gap-4">
                                <span><kbd className="px-1.5 py-0.5 rounded bg-background-dark border border-border-color-light font-mono text-[10px]">Enter</kbd> to search</span>
                                <span><kbd className="px-1.5 py-0.5 rounded bg-background-dark border border-border-color-light font-mono text-[10px]">Esc</kbd> to close</span>
                            </div>

                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default GlobalSearch;
