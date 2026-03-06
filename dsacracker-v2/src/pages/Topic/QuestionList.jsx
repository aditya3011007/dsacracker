import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, Bookmark, FileText, ExternalLink, BrainCircuit, Lightbulb, Flame } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { cn } from '../../components/FloatingDock/FloatingDock';
import NotesModal from './NotesModal';
import InterviewModal from './InterviewModal';
import HintModal from './HintModal';
import RoastModal from './RoastModal';

const QuestionList = ({ activeTopic }) => {
    const toggleQuestionDone = useStore((state) => state.toggleQuestionDone);
    const toggleBookmark = useStore((state) => state.toggleBookmark);
    const saveNote = useStore((state) => state.saveNote);

    const [editingNoteIndex, setEditingNoteIndex] = React.useState(null);
    const [interviewingIndex, setInterviewingIndex] = React.useState(null);
    const [hintingIndex, setHintingIndex] = React.useState(null);
    const [roastingIndex, setRoastingIndex] = React.useState(null);

    if (!activeTopic) return <div className="text-center p-10 font-display">Topic not found.</div>;

    return (
        <div className="flex-1 max-w-4xl w-full">
            <div className="mb-8">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-display font-bold text-white mb-2"
                >
                    {activeTopic.topicName}
                </motion.h1>
                <div className="text-text-secondary-light">
                    Master {activeTopic.questions.length} essential problems.
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <AnimatePresence>
                    {activeTopic.questions.map((q, index) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: index * 0.02, type: 'spring', stiffness: 200, damping: 20 }}
                            key={index}
                            className={cn(
                                "group relative bento-glass rounded-2xl p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all hover:-translate-y-1",
                                q.Done ? "border-success-color/30 bg-success-color/5" : "hover:border-accent-color/50"
                            )}
                        >
                            <div className="flex items-center gap-4 flex-1">
                                <button
                                    onClick={() => toggleQuestionDone(activeTopic.topicName, index, !q.Done)}
                                    className="mt-1 md:mt-0 flex-shrink-0 transition-transform active:scale-95"
                                >
                                    {q.Done ? (
                                        <CheckCircle2 className="text-success-color" size={28} />
                                    ) : (
                                        <Circle className="text-text-secondary-light group-hover:text-accent-color" size={28} />
                                    )}
                                </button>
                                <div className="flex-1">
                                    <a
                                        href={q.URL}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-lg font-semibold text-text-primary-light group-hover:text-accent-color transition-colors line-clamp-2 md:line-clamp-1 flex items-center gap-2 w-fit"
                                    >
                                        {q.Problem}
                                        <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 w-full md:w-auto justify-end border-t md:border-t-0 border-border-color-light pt-3 md:pt-0">
                                {/* Secondary Platform Link (GFG/CN) */}
                                {q.URL2 && (
                                    <a
                                        href={q.URL2}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="p-2 rounded-lg bg-surface-dark hover:bg-accent-color/20 text-text-secondary-light hover:text-accent-color transition-colors"
                                        title="Alternative Platform"
                                    >
                                        <CodeIcon />
                                    </a>
                                )}

                                {/* AI Hint Trigger */}
                                <button
                                    className="p-2 rounded-lg bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 transition-all hover:scale-110 shadow-[0_0_10px_rgba(234,179,8,0.2)] hover:shadow-[0_0_20px_rgba(234,179,8,0.4)]"
                                    title="Progressive AI Hints"
                                    onClick={() => setHintingIndex(index)}
                                >
                                    <Lightbulb size={20} />
                                </button>

                                {/* AI Roast Trigger */}
                                <button
                                    className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all hover:scale-110 shadow-[0_0_10px_rgba(239,68,68,0.2)] hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                                    title="Roast My Code"
                                    onClick={() => setRoastingIndex(index)}
                                >
                                    <Flame size={20} />
                                </button>

                                {/* Interview Me AI Trigger */}
                                <button
                                    className="p-2 rounded-lg bg-secondary-color/10 text-secondary-color hover:bg-secondary-color/20 transition-all hover:scale-110 shadow-[0_0_10px_rgba(156,39,176,0.2)] hover:shadow-[0_0_20px_rgba(156,39,176,0.4)]"
                                    title="FAANG Interview Agent"
                                    onClick={() => setInterviewingIndex(index)}
                                >
                                    <BrainCircuit size={20} />
                                </button>

                                {/* Add Note */}
                                <button
                                    className={cn(
                                        "p-2 rounded-lg transition-colors",
                                        q.Notes ? "bg-warning-color/20 text-warning-color" : "bg-surface-dark text-text-secondary-light hover:text-warning-color hover:bg-warning-color/20"
                                    )}
                                    title={q.Notes ? "Edit Note" : "Add Note"}
                                    onClick={() => setEditingNoteIndex(index)}
                                >
                                    <FileText size={20} />
                                </button>

                                {/* Bookmark */}
                                <button
                                    onClick={() => toggleBookmark(activeTopic.topicName, index)}
                                    className={cn(
                                        "p-2 rounded-lg transition-colors",
                                        q.Bookmark ? "bg-accent-color/20 text-accent-color" : "bg-surface-dark text-text-secondary-light hover:text-accent-color hover:bg-accent-color/20"
                                    )}
                                    title="Bookmark"
                                >
                                    <Bookmark size={20} fill={q.Bookmark ? 'currentColor' : 'none'} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Note Editor Modal */}
            <NotesModal
                isOpen={editingNoteIndex !== null}
                onClose={() => setEditingNoteIndex(null)}
                initialNote={editingNoteIndex !== null ? activeTopic.questions[editingNoteIndex].Notes : ''}
                questionName={editingNoteIndex !== null ? activeTopic.questions[editingNoteIndex].Problem : ''}
                onSave={(text) => {
                    saveNote(activeTopic.topicName, editingNoteIndex, text);
                }}
            />

            {/* AI Interview Modal */}
            <InterviewModal
                isOpen={interviewingIndex !== null}
                onClose={() => setInterviewingIndex(null)}
                questionName={interviewingIndex !== null ? activeTopic.questions[interviewingIndex].Problem : ''}
                questionUrl={interviewingIndex !== null ? activeTopic.questions[interviewingIndex].URL : ''}
            />

            {/* AI Hint Modal */}
            <HintModal
                isOpen={hintingIndex !== null}
                onClose={() => setHintingIndex(null)}
                questionName={hintingIndex !== null ? activeTopic.questions[hintingIndex].Problem : ''}
            />

            {/* AI Roast Modal */}
            <RoastModal
                isOpen={roastingIndex !== null}
                onClose={() => setRoastingIndex(null)}
                questionName={roastingIndex !== null ? activeTopic.questions[roastingIndex].Problem : ''}
            />
        </div>
    );
};

// Generic Code icon since CN/GFG svgs vary
const CodeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
);

export default QuestionList;
