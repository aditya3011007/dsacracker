import React from 'react';
import { motion } from 'framer-motion';

const HeroSection = () => {
    const containerVars = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 },
        },
    };

    const itemVars = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
    };

    return (
        <motion.div
            variants={containerVars}
            initial="hidden"
            animate="show"
            className="text-center py-20 px-4"
        >
            <motion.h1
                variants={itemVars}
                className="text-5xl md:text-7xl font-display font-bold tracking-tighter mb-6"
            >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
                    Master DSA
                </span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-color via-blue-500 to-cyan-400">
                    Like Never Before.
                </span>
            </motion.h1>
            <motion.p variants={itemVars} className="text-lg md:text-xl text-text-secondary-light max-w-2xl mx-auto tracking-wide font-light">
                Track your progress across 450 curated problems.
                Level up your problem-solving skills with an immersive tracking experience.
            </motion.p>
        </motion.div>
    );
};

export default HeroSection;
