import React from 'react';
import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin, Heart } from 'lucide-react';

const About = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl mx-auto px-6 pt-20 pb-32 text-center"
        >
            <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-accent-color/10 border border-accent-color/20 text-accent-color text-sm font-semibold tracking-wider uppercase">
                About The Project
            </div>

            <h1 className="text-5xl md:text-6xl font-display font-extrabold tracking-tighter mb-8 leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">Mastering DSA,</span><br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-color via-blue-500 to-cyan-400">Reimagined.</span>
            </h1>

            <p className="text-xl text-text-secondary-light leading-relaxed mb-12 max-w-2xl mx-auto">
                DSA Cracker V2 is a completely rebuilt, state-of-the-art platform designed to help developers track and conquer the most essential Data Structures and Algorithms problems.
                Built with React 18, Vite, Tailwind CSS, Framer Motion, and ThreeJS.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-16 text-left">
                <div className="bento-glass p-6 auto-rows-min rounded-3xl">
                    <h3 className="font-display font-bold text-xl mb-3 flex items-center gap-2 text-white">
                        <span>🎯</span> The Mission
                    </h3>
                    <p className="text-text-secondary-light text-sm leading-relaxed">
                        To provide an unparalleled, aesthetically pleasing tracking experience that gamifies the journey of mastering Data Structures and Algorithms.
                    </p>
                </div>
                <div className="bento-glass p-6 auto-rows-min rounded-3xl">
                    <h3 className="font-display font-bold text-xl mb-3 flex items-center gap-2 text-white">
                        <span>✨</span> Features
                    </h3>
                    <ul className="text-text-secondary-light text-sm leading-relaxed list-disc list-inside space-y-1">
                        <li>3D Interactive Topic Explorer</li>
                        <li>Global Mastery Progress</li>
                        <li>Live LeetCode Synchronization</li>
                        <li>Daily Challenge Picker</li>
                    </ul>
                </div>
            </div>

            <div className="flex justify-center items-center gap-6">
                <motion.a whileHover={{ scale: 1.1, y: -2 }} href="#" className="p-4 rounded-2xl bg-surface-dark hover:bg-white/10 text-white transition-colors border border-border-color-light">
                    <Github size={24} />
                </motion.a>
                <motion.a whileHover={{ scale: 1.1, y: -2 }} href="#" className="p-4 rounded-2xl bg-surface-dark hover:bg-white/10 text-[#0a66c2] transition-colors border border-border-color-light">
                    <Linkedin size={24} />
                </motion.a>
                <motion.a whileHover={{ scale: 1.1, y: -2 }} href="#" className="p-4 rounded-2xl bg-surface-dark hover:bg-white/10 text-[#1da1f2] transition-colors border border-border-color-light">
                    <Twitter size={24} />
                </motion.a>
            </div>

            <div className="mt-16 text-text-secondary-light/60 flex items-center justify-center gap-2 font-medium">
                Built with <Heart size={16} className="text-danger-color" /> for the Dev Community
            </div>
        </motion.div>
    );
};

export default About;
