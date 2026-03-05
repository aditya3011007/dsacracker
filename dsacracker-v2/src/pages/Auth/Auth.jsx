import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, UserPlus, Lock, Mail, ArrowRight } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const setAuth = useStore((state) => state.setAuth);
    const syncDown = useStore((state) => state.syncDown);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const endpoint = isLogin ? '/auth/login' : '/auth/register';

        try {
            const res = await fetch(`http://localhost:5005${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Authentication failed');
                setLoading(false);
                return;
            }

            // Success
            setAuth(data.token, data.user);
            await syncDown(data.token); // Pull progress from cloud
            navigate('/'); // redirect to dashboard

        } catch (err) {
            setError('Network Error. Is the backend running?');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center p-4 relative"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-background-dark via-[#0f172a] to-background-dark -z-10" />

            <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bento-glass p-8 md:p-10 rounded-3xl w-full max-w-md relative overflow-hidden shadow-2xl shadow-accent-color/10"
            >
                {/* Decorative Elements */}
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent-color/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10">
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 mx-auto bg-surface-dark border border-border-color-light rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                            {isLogin ? <LogIn className="text-accent-color" size={32} /> : <UserPlus className="text-blue-400" size={32} />}
                        </div>
                        <h1 className="text-3xl font-display font-bold text-white mb-2">
                            {isLogin ? 'Welcome Back' : 'Create Account'}
                        </h1>
                        <p className="text-text-secondary-light">
                            {isLogin ? 'Log in to securely sync your DSA progress.' : 'Join to auto-save to the cloud.'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-text-secondary-light uppercase tracking-wider pl-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary-light/50" size={20} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-surface-dark border border-border-color-light rounded-xl pl-12 pr-4 py-3 outline-none focus:border-accent-color focus:ring-1 focus:ring-accent-color/50 transition-all text-white placeholder:text-text-secondary-light/30"
                                    placeholder="engineering@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-text-secondary-light uppercase tracking-wider pl-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary-light/50" size={20} />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-surface-dark border border-border-color-light rounded-xl pl-12 pr-4 py-3 outline-none focus:border-accent-color focus:ring-1 focus:ring-accent-color/50 transition-all text-white placeholder:text-text-secondary-light/30"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-danger-color/10 border border-danger-color/30 text-danger-color text-sm p-3 rounded-xl text-center"
                                >
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-accent-color hover:bg-accent-color/90 text-white font-bold py-3.5 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 mt-4 shadow-lg shadow-accent-color/20"
                        >
                            {loading ? (
                                <span className="animate-pulse">Authenticating...</span>
                            ) : (
                                <>
                                    {isLogin ? 'Sign In' : 'Sign Up'} <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center border-t border-border-color-light pt-6">
                        <p className="text-text-secondary-light text-sm">
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                            <button
                                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                                className="ml-2 text-white font-semibold hover:text-accent-color transition-colors"
                            >
                                {isLogin ? 'Create one' : 'Log in here'}
                            </button>
                        </p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Auth;
