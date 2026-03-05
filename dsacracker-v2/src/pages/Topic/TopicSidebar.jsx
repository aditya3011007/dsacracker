import React from 'react';
import { NavLink } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { motion } from 'framer-motion';
import { cn } from '../../components/FloatingDock/FloatingDock';

const TopicSidebar = () => {
    const data = useStore((state) => state.data);

    return (
        <div className="hidden lg:block w-72 h-[calc(100vh-8rem)] sticky top-8 bento-glass rounded-3xl p-4 overflow-y-auto overflow-x-hidden">
            <h3 className="font-display font-bold text-lg mb-4 text-text-primary-light px-2">
                DSA Explorer
            </h3>
            <div className="flex flex-col gap-2">
                {data.map((topic) => {
                    const isComplete = topic.doneQuestions === topic.questions.length && topic.questions.length > 0;
                    return (
                        <NavLink
                            key={topic.topicName}
                            to={`/topic/${topic.topicName.replace(/[^A-Z0-9]+/gi, "_").toLowerCase()}`}
                            className={({ isActive }) => cn(
                                "relative py-3 px-4 rounded-xl transition-all font-semibold flex items-center justify-between group",
                                isActive
                                    ? "text-white bg-accent-color/20 border border-accent-color/50"
                                    : "text-text-secondary-light hover:text-white hover:bg-surface-dark"
                            )}
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                {isComplete && <span className="text-success-color">✨</span>}
                                {topic.topicName}
                            </span>
                            <span className="text-xs font-bold bg-bg-color-light/50 px-2 py-1 rounded-md z-10">
                                {topic.doneQuestions}/{topic.questions.length}
                            </span>
                        </NavLink>
                    );
                })}
            </div>
        </div>
    );
};

export default TopicSidebar;
