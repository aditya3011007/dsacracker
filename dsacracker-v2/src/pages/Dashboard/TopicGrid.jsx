import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { Library } from 'lucide-react';

const TopicCard = ({ topic, index }) => {
    // 3D Tilt Effect
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-100, 100], [15, -15]);
    const rotateY = useTransform(x, [-100, 100], [-15, 15]);

    const handleMouseMove = (event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        x.set(event.clientX - rect.left - rect.width / 2);
        y.set(event.clientY - rect.top - rect.height / 2);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const isComplete = topic.doneQuestions === topic.questions.length && topic.questions.length > 0;
    const progress = (topic.doneQuestions / topic.questions.length) * 100;

    return (
        <Link to={`/topic/${topic.topicName.replace(/[^A-Z0-9]+/gi, "_").toLowerCase()}`}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", delay: 0.1 * index }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                className={`relative h-48 bento-glass rounded-3xl p-6 flex flex-col justify-between cursor-pointer group ${isComplete ? 'border-success-color/50 bg-success-color/5' : ''}`}
            >
                {/* Magic Border Glow if Complete */}
                {isComplete && (
                    <div className="absolute inset-0 rounded-3xl opacity-50 bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,#10b981_100%)] animate-spin-slow mix-blend-screen pointer-events-none" style={{ maskImage: 'linear-gradient(#000, #000), linear-gradient(#000, #000)', maskClip: 'content-box, border-box', maskComposite: 'exclude', padding: '1px' }} />
                )}

                <h3 className="text-xl font-display font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 group-hover:from-accent-color group-hover:to-blue-400 transition-all duration-300 z-10" style={{ transform: "translateZ(30px)" }}>
                    {topic.topicName}
                </h3>

                <div className="mt-auto z-10" style={{ transform: "translateZ(20px)" }}>
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-xs font-bold font-display uppercase tracking-wider text-text-secondary-light">
                            {isComplete ? 'Mastered 🏆' : 'Progress'}
                        </span>
                        <span className="text-sm font-bold bg-surface-dark px-2 py-1 rounded-lg">
                            {topic.doneQuestions} / {topic.questions.length}
                        </span>
                    </div>
                    {/* Progress Bar */}
                    <div className="h-2 w-full bg-surface-dark rounded-full overflow-hidden">
                        <motion.div
                            className={`h-full ${isComplete ? 'bg-success-color' : 'bg-accent-color'}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                        />
                    </div>
                </div>
            </motion.div>
        </Link>
    );
};

const TopicGrid = () => {
    const data = useStore((state) => state.data);

    return (
        <div className="max-w-6xl mx-auto px-6 pb-20">
            <h2 className="text-3xl font-display font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/80 mb-8 flex items-center gap-3">
                <span className="bg-surface-dark p-2 rounded-xl border border-border-color-light text-accent-color">
                    <Library size={24} />
                </span>
                DSA Topics
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" style={{ perspective: "1000px" }}>
                {data.map((topic, index) => (
                    <TopicCard key={topic.topicName} topic={topic} index={index} />
                ))}
            </div>
        </div>
    );
};

export default TopicGrid;
