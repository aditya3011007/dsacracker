import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, FileText } from 'lucide-react';

const NotesModal = ({ isOpen, onClose, initialNote, onSave, questionName }) => {
    const [noteText, setNoteText] = useState(initialNote || '');
    const textareaRef = useRef(null);

    // Auto-focus when opened
    useEffect(() => {
        if (isOpen) {
            setNoteText(initialNote || '');
            setTimeout(() => {
                textareaRef.current?.focus();
            }, 100);
        }
    }, [isOpen, initialNote]);

    const handleSave = () => {
        onSave(noteText);
        onClose();
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
                        className="fixed inset-0 bg-background-dark/80 backdrop-blur-sm z-[100]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-lg z-[101] bento-glass rounded-3xl overflow-hidden shadow-2xl border border-warning-color/30 flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-border-color-light bg-surface-dark/50">
                            <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
                                <FileText className="text-warning-color" />
                                Personal Notes
                            </h3>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-white/10 text-text-secondary-light hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 flex flex-col gap-4">
                            <div className="text-sm text-text-secondary-light font-medium line-clamp-1">
                                {questionName}
                            </div>

                            <textarea
                                ref={textareaRef}
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                                placeholder="Jot down hints, gotchas, or your breakthrough approach for this problem..."
                                className="w-full h-48 bg-surface-dark/50 border border-border-color-light rounded-xl p-4 text-text-primary-light outline-none focus:border-warning-color/50 transition-colors resize-none custom-scrollbar"
                            />
                        </div>

                        {/* Footer */}
                        <div className="p-6 flex justify-end gap-3 bg-surface-dark/30 border-t border-border-color-light">
                            <button
                                onClick={onClose}
                                className="px-5 py-2.5 rounded-xl font-semibold text-text-secondary-light hover:text-white hover:bg-white/5 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-5 py-2.5 rounded-xl font-bold bg-warning-color text-black hover:bg-yellow-400 transition-all shadow-[0_0_15px_rgba(245,158,11,0.5)] hover:shadow-[0_0_25px_rgba(245,158,11,0.8)] flex items-center gap-2"
                            >
                                <Save size={18} />
                                Save Note
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default NotesModal;
