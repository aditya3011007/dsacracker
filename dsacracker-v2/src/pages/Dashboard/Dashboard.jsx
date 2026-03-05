import React from 'react';
import HeroSection from './HeroSection';
import StatsBento from './StatsBento';
import TopicGrid from './TopicGrid';
import { motion } from 'framer-motion';

const Dashboard = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="pt-10"
        >
            <HeroSection />
            <StatsBento />
            <TopicGrid />
        </motion.div>
    );
};

export default Dashboard;
