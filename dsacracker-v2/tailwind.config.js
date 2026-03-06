/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: {
                    light: '#2563eb', // blue-600
                    dark: '#3b82f6',  // blue-500
                },
                background: {
                    light: '#f8fafc',
                    dark: '#0f172a',
                },
                surface: {
                    light: 'rgba(255, 255, 255, 0.7)',
                    dark: 'rgba(30, 41, 59, 0.7)',
                },
                'accent-color': 'var(--accent-color)',
                'success-color': 'var(--success-color)',
                'danger-color': 'var(--danger-color)',
                'warning-color': 'var(--warning-color)',
                'text-primary-light': 'var(--text-primary-light)',
                'text-secondary-light': 'var(--text-secondary-light)',
                'bg-color-light': 'var(--bg-color-light)',
                'bg-color-secondary-light': 'var(--bg-color-secondary-light)',
                'border-color-light': 'var(--border-color-light)',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Outfit', 'sans-serif'],
            },
            animation: {
                'blob': 'blob 7s infinite',
                'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
                'spin-slow': 'spin 8s linear infinite',
            },
            keyframes: {
                blob: {
                    '0%': { transform: 'translate(0px, 0px) scale(1)' },
                    '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
                    '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
                    '100%': { transform: 'translate(0px, 0px) scale(1)' },
                },
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                }
            }
        },
    },
    plugins: [],
}
