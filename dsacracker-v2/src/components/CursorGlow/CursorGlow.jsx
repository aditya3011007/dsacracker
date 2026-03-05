import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

const CursorGlow = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const cursorX = useSpring(0, { stiffness: 50, damping: 20 });
    const cursorY = useSpring(0, { stiffness: 50, damping: 20 });

    useEffect(() => {
        const updateMousePosition = (e) => {
            cursorX.set(e.clientX - 150);
            cursorY.set(e.clientY - 150);
        };

        window.addEventListener('mousemove', updateMousePosition);
        return () => window.removeEventListener('mousemove', updateMousePosition);
    }, [cursorX, cursorY]);

    return (
        <motion.div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: 300,
                height: 300,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
                pointerEvents: 'none',
                zIndex: 9999,
                x: cursorX,
                y: cursorY,
            }}
        />
    );
};

export default CursorGlow;
