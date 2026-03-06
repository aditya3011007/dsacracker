import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import TopicSidebar from './TopicSidebar';
import QuestionList from './QuestionList';
import { motion } from 'framer-motion';

const Topic = () => {
    const { id } = useParams();
    const data = useStore((state) => state.data);

    const activeTopic = data.find(t => t.topicName.replace(/[^A-Z0-9]+/gi, "_").toLowerCase() === id?.toLowerCase());

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [id]);

    if (!data || data.length === 0) return <div>Loading...</div>;
    if (!activeTopic && id) return <Navigate to="/" />; // Fallback if invalid URL

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24 flex items-start gap-8"
        >
            <TopicSidebar />
            <QuestionList activeTopic={activeTopic} />
        </motion.div>
    );
};

export default Topic;
