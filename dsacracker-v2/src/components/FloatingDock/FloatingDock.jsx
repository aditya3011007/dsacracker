import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Home, LineChart, Info, User, Search } from 'lucide-react';
import { useStore } from '../../store/useStore';
import GlobalSearch from '../Search/GlobalSearch';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const FloatingDock = () => {
    const location = useLocation();
    const user = useStore(state => state.user);
    const [isSearchOpen, setIsSearchOpen] = React.useState(false);

    const links = [
        { title: "Home", icon: <Home className="w-5 h-5" />, href: "/" },
        { title: "Stats", icon: <LineChart className="w-5 h-5" />, href: "/stats" },
        { title: user ? "Cloud Profile" : "Login", icon: <User className={cn("w-5 h-5", user && "text-success-color")} />, href: "/auth" },
        { title: "About", icon: <Info className="w-5 h-5" />, href: "/about" },
    ];

    return (
        <>
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[1000]">
                <motion.div
                    className="flex items-center gap-4 px-6 py-3 rounded-full bento-glass bg-surface-dark border-border-color-light"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                >
                    {links.map((link) => {
                        const isActive = location.pathname === link.href;
                        return (
                            <Link key={link.title} to={link.href}>
                                <motion.div
                                    className={cn(
                                        "relative flex flex-col items-center justify-center p-2 rounded-full transition-colors cursor-pointer group",
                                        isActive ? "text-accent-color" : "text-text-secondary-light hover:text-text-primary-light"
                                    )}
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="active-indicator"
                                            className="absolute inset-0 bg-accent-color/20 rounded-full"
                                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                        />
                                    )}
                                    <span className="relative z-10">{link.icon}</span>

                                    {/* Tooltip */}
                                    <div className="absolute -top-10 scale-0 group-hover:scale-100 transition-transform origin-bottom px-2 py-1 bg-surface-dark border border-border-color-light rounded text-xs font-medium whitespace-nowrap shadow-xl">
                                        {link.title}
                                    </div>
                                </motion.div>
                            </Link>
                        );
                    })}

                    {/* Divider */}
                    <div className="w-px h-6 bg-border-color-light mx-1"></div>

                    {/* Search Button */}
                    <motion.button
                        onClick={() => setIsSearchOpen(true)}
                        className="relative flex flex-col items-center justify-center p-2 rounded-full transition-colors cursor-pointer group text-text-secondary-light hover:text-blue-400"
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span className="relative z-10"><Search className="w-5 h-5" /></span>
                        <div className="absolute -top-10 scale-0 group-hover:scale-100 transition-transform origin-bottom px-2 py-1 bg-surface-dark border border-border-color-light rounded text-xs font-medium whitespace-nowrap shadow-xl">
                            AI Search
                        </div>
                    </motion.button>
                </motion.div>
            </div>

            <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
};

export default FloatingDock;
