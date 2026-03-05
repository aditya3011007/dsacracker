import React, { useMemo } from 'react';
import { useStore } from '../../store/useStore';
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, CartesianGrid, Cell
} from 'recharts';
import { motion } from 'framer-motion';

export const TopicRadar = () => {
    const data = useStore((state) => state.data);

    // Format data for Radar Chart: We want the "percentage solved" for each topic
    const radarData = useMemo(() => {
        return data.map(topic => {
            const total = topic.questions.length;
            const solved = topic.doneQuestions;
            const percentage = total > 0 ? Math.round((solved / total) * 100) : 0;
            return {
                subject: topic.topicName.length > 10 ? topic.topicName.substring(0, 10) + '...' : topic.topicName,
                mastery: percentage,
                fullMark: 100
            };
        });
    }, [data]);

    return (
        <div className="w-full h-[400px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12, fontFamily: 'Outfit' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                        name="Mastery %"
                        dataKey="mastery"
                        stroke="#8b5cf6"
                        fill="#8b5cf6"
                        fillOpacity={0.4}
                        isAnimationActive={true}
                    />
                    <RechartsTooltip
                        contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '12px', color: '#fff' }}
                        itemStyle={{ color: '#8b5cf6', fontWeight: 'bold' }}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
};

export const CompletionBarChart = () => {
    const data = useStore((state) => state.data);

    const barData = useMemo(() => {
        return data.map(topic => ({
            name: topic.topicName,
            solved: topic.doneQuestions,
            pending: topic.questions.length - topic.doneQuestions,
            total: topic.questions.length
        })).sort((a, b) => b.total - a.total).slice(0, 10); // Top 10 largest topics
    }, [data]);

    return (
        <div className="w-full h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis
                        dataKey="name"
                        tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                    />
                    <YAxis tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <RechartsTooltip
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px' }}
                    />
                    <Bar dataKey="solved" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} name="Solved" animationDuration={1500} />
                    <Bar dataKey="pending" stackId="a" fill="rgba(255,255,255,0.1)" radius={[4, 4, 0, 0]} name="Pending" animationDuration={1500} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};
