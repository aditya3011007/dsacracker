import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { TopicRadar, CompletionBarChart } from './Charts';
import { Target, Trophy, Flame, BrainCircuit, Sparkles } from 'lucide-react';
import SyllabusModal from './SyllabusModal';

const Stats = () => {
    const [isSyllabusOpen, setIsSyllabusOpen] = React.useState(false);
    const data = useStore((state) => state.data);
    const lcStats = useStore((state) => state.lcStats);

    let manualTotalQuestions = 0;
    let manualTotalSolved = 0;
    let completelyMastered = 0;

    data.forEach(topic => {
        manualTotalQuestions += topic.questions.length;
        manualTotalSolved += topic.doneQuestions;
        if (topic.doneQuestions === topic.questions.length && topic.questions.length > 0) {
            completelyMastered++;
        }
    });

    const isLinked = !!lcStats;
    const totalQuestions = manualTotalQuestions;
    const totalSolved = manualTotalSolved;

    const completionRate = totalQuestions > 0 ? ((totalSolved / totalQuestions) * 100).toFixed(1) : 0;

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-32"
            >
                <div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
                            Analytics <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-color to-blue-500">Center</span>
                        </h1>
                        <p className="text-lg text-text-secondary-light">Visualize your mastery. Analyze your weak points. Dominate DSA.</p>
                    </div>

                    <button
                        onClick={() => setIsSyllabusOpen(true)}
                        className="group relative flex items-center gap-3 px-6 py-4 rounded-2xl bg-surface-dark/50 border border-blue-500/30 hover:bg-blue-500/10 hover:border-blue-500/50 transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-accent-color/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Sparkles className="text-blue-400 group-hover:animate-pulse relative z-10" size={24} />
                        <div className="text-left relative z-10">
                            <div className="text-white font-display font-bold text-lg leading-tight">Smart Syllabus</div>
                            <div className="text-xs text-blue-300/80">AI Study Masterplan</div>
                        </div>
                    </button>
                </div>

                {/* Top Metrics Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <div className="bento-glass p-6 rounded-3xl flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-accent-color/20 text-accent-color flex items-center justify-center">
                            <Target size={28} />
                        </div>
                        <div>
                            <div className="text-text-secondary-light text-sm font-semibold uppercase tracking-wider">Total Progress</div>
                            <div className="text-3xl font-display font-bold text-white">{completionRate}%</div>
                        </div>
                    </div>

                    <div className="bento-glass p-6 rounded-3xl flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-success-color/20 text-success-color flex items-center justify-center">
                            <Trophy size={28} />
                        </div>
                        <div>
                            <div className="text-text-secondary-light text-sm font-semibold uppercase tracking-wider">Solved</div>
                            <div className="text-3xl font-display font-bold text-white">{totalSolved} <span className="text-sm text-text-secondary-light font-normal">/ {totalQuestions}</span></div>
                        </div>
                    </div>

                    <div className="bento-glass p-6 rounded-3xl flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-warning-color/20 text-warning-color flex items-center justify-center">
                            <BrainCircuit size={28} />
                        </div>
                        <div>
                            <div className="text-text-secondary-light text-sm font-semibold uppercase tracking-wider">Topics Mastered</div>
                            <div className="text-3xl font-display font-bold text-white">{completelyMastered} <span className="text-sm text-text-secondary-light font-normal">/ {data.length}</span></div>
                        </div>
                    </div>

                    <div className="bento-glass p-6 rounded-3xl flex items-center gap-4 bg-gradient-to-br from-surface-dark to-accent-color/10 border-accent-color/30">
                        <div className="w-14 h-14 rounded-2xl bg-danger-color/20 text-danger-color flex items-center justify-center">
                            <Flame size={28} />
                        </div>
                        <div>
                            <div className="text-text-secondary-light text-sm font-semibold uppercase tracking-wider">Status</div>
                            <div className="text-xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500">
                                {completionRate > 90 ? 'God Tier 🔥' : completionRate > 50 ? 'On Fire 🔥' : 'Grinding 🏃'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div className="bento-glass rounded-3xl p-6 md:p-8 flex flex-col relative overflow-hidden group">
                        <h3 className="text-2xl font-display font-bold text-white mb-6 z-10">Topic Mastery Spider</h3>
                        <div className="flex-1 min-h-[400px] z-10">
                            <TopicRadar />
                        </div>
                        {/* Decorative background glow */}
                        <div className="absolute inset-0 bg-accent-color/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-0" />
                    </div>

                    <div className="bento-glass rounded-3xl p-6 md:p-8 flex flex-col relative overflow-hidden group">
                        <h3 className="text-2xl font-display font-bold text-white mb-2 z-10">Largest Topics Distribution</h3>
                        <p className="text-sm text-text-secondary-light mb-6 z-10">Visualizing manual completion ratio for the largest topics.</p>
                        <div className="flex-1 min-h-[350px] z-10">
                            <CompletionBarChart />
                        </div>
                    </div>
                </div>

                {/* LeetCode Sync Section if linked */}
                {isLinked && (
                    <div className="mt-16 border-t border-border-color-light pt-12">
                        <div className="mb-10 text-center md:text-left">
                            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-2 flex items-center justify-center md:justify-start gap-3">
                                <span className="text-warning-color">⚡</span> LeetCode Profile Analytics
                            </h2>
                            <p className="text-text-secondary-light">Real-time statistics synced securely from your global LeetCode account.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                            <div className="bento-glass p-6 md:p-8 rounded-3xl col-span-1 border border-warning-color/30 flex flex-col justify-center items-center">
                                <h3 className="text-xl font-display font-bold text-white mb-6 w-full text-center">Difficulty Distribution</h3>

                                <div className="relative w-48 h-48 flex items-center justify-center mb-6">
                                    <svg width="100%" height="100%" viewBox="0 0 160 160" className="-rotate-90">
                                        <circle r="60" cx="80" cy="80" fill="transparent" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="16" />
                                        {/* Hard (Red) */}
                                        <circle r="60" cx="80" cy="80" fill="transparent" stroke="#ef4444" strokeWidth="16" strokeDasharray="377" strokeDashoffset={377 - (377 * ((lcStats.easySolved + lcStats.mediumSolved + lcStats.hardSolved) / (lcStats.totalSolved || 1)))} className="transition-all duration-1000" />
                                        {/* Medium (Yellow) */}
                                        <circle r="60" cx="80" cy="80" fill="transparent" stroke="#f59e0b" strokeWidth="16" strokeDasharray="377" strokeDashoffset={377 - (377 * ((lcStats.easySolved + lcStats.mediumSolved) / (lcStats.totalSolved || 1)))} className="transition-all duration-1000" />
                                        {/* Easy (Cyan) */}
                                        <circle r="60" cx="80" cy="80" fill="transparent" stroke="#10b981" strokeWidth="16" strokeDasharray="377" strokeDashoffset={377 - (377 * (lcStats.easySolved / (lcStats.totalSolved || 1)))} className="transition-all duration-1000" />
                                    </svg>

                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center mt-2">
                                        <div className="text-xs text-text-secondary-light font-bold uppercase tracking-wider mb-1">Total LC</div>
                                        <div className="text-3xl font-display font-bold text-white">{lcStats.totalSolved}</div>
                                    </div>
                                </div>

                                <div className="flex w-full justify-between px-2">
                                    <div className="text-center">
                                        <div className="text-xs text-text-secondary-light font-bold uppercase tracking-wider mb-1">Easy</div>
                                        <div className="text-xl font-bold text-[#10b981]">{lcStats.easySolved}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xs text-text-secondary-light font-bold uppercase tracking-wider mb-1">Med</div>
                                        <div className="text-xl font-bold text-[#f59e0b]">{lcStats.mediumSolved}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xs text-text-secondary-light font-bold uppercase tracking-wider mb-1">Hard</div>
                                        <div className="text-xl font-bold text-[#ef4444]">{lcStats.hardSolved}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="bento-glass p-6 md:p-8 rounded-3xl col-span-1 md:col-span-2 border border-warning-color/30 flex flex-col">
                                <h3 className="text-xl font-display font-bold text-white mb-6 w-full">Recent Accepted Submissions</h3>

                                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3 max-h-[300px]">
                                    {lcStats.submitStatsGlobal && lcStats.submitStatsGlobal.acSubmissionNum ? (
                                        <div className="text-text-secondary-light opacity-50 italic">Full submission history endpoint unavailable. Showing aggregate ACs.</div>
                                    ) : (
                                        <div className="flex items-center justify-center h-full">
                                            <p className="text-text-secondary-light italic text-center opacity-50">Historical submissions not exposed by public API.<br />Check LeetCode directly.</p>
                                        </div>
                                    )}

                                    {/* Mocking the UI structure based on typical API response if we had the full AcSubmissions array */}
                                    <div className="space-y-3">
                                        {[1, 2, 3, 4].map((_, i) => (
                                            <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-border-color-light bg-surface-dark/50 hover:bg-surface-dark transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-2 h-2 rounded-full bg-success-color shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                                                    <span className="text-text-primary-light font-medium line-clamp-1">Placeholder Problem {i + 1}</span>
                                                </div>
                                                <span className="text-xs text-text-secondary-light bg-background-dark px-2 py-1 rounded-md border border-border-color-light uppercase font-mono">JAVA</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                )}

            </motion.div>

            {/* AI Smart Syllabus Modal */}
            <SyllabusModal
                isOpen={isSyllabusOpen}
                onClose={() => setIsSyllabusOpen(false)}
            />
        </>
    );
};

export default Stats;
