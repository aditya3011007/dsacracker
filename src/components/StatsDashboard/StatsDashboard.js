import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
import Fade from 'react-reveal/Fade';
import './StatsDashboard.css';

const StatsDashboard = ({ questionData }) => {
    const [lcUsername, setLcUsername] = useState('');
    const [lcStats, setLcStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Calculate DSA Cracker overall stats
    let totalQuestions = 0;
    let totalSolved = 0;

    if (questionData && questionData.length > 0) {
        questionData.forEach(topic => {
            totalQuestions += topic.questions.length;
            totalSolved += topic.doneQuestions;
        });
    }

    const percentage = totalQuestions > 0 ? ((totalSolved / totalQuestions) * 100).toFixed(1) : 0;
    const dashOffset = 440 - (440 * percentage) / 100;

    const fetchLeetCodeStats = async (e) => {
        e.preventDefault();
        if (!lcUsername.trim()) return;

        setLoading(true);
        setError(null);
        setLcStats(null);

        try {
            const response = await fetch(`https://leetcode-stats-api.herokuapp.com/${lcUsername}`);
            const data = await response.json();

            if (data.status === "error") {
                setError(data.message || "User not found or API error.");
            } else {
                setLcStats(data);
            }
        } catch (err) {
            setError("Failed to fetch LeetCode data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fade-in-section mb-5">
            <h3 className='page-heading text-center' style={{ display: 'block' }}>
                Your Infographics Hub
            </h3>
            <div className="text-center page-subtitle mb-5">
                Track your mastery and link your competitive programming profiles.
            </div>

            <div className="row justify-content-center">
                {/* Tracker Stats Section */}
                <div className="col-12 col-md-5 mb-4">
                    <Fade left>
                        <div className="stats-card p-4 h-100 bento-glass">
                            <h4 style={{ fontWeight: 700, color: 'var(--text-primary-light)', marginBottom: '1.5rem' }}>
                                <span className="emojiFix">🎯</span> 450 DSA Progress
                            </h4>

                            <div className="d-flex justify-content-center align-items-center flex-column relative mb-4">
                                <svg width="200" height="200" viewBox="0 0 160 160" style={{ transform: 'rotate(-90deg)' }}>
                                    <circle
                                        r="70" cx="80" cy="80" fill="transparent"
                                        stroke="rgba(139, 92, 246, 0.1)" strokeWidth="12"
                                    />
                                    <circle
                                        r="70" cx="80" cy="80" fill="transparent"
                                        stroke="var(--accent-color)" strokeWidth="12"
                                        strokeDasharray="440" strokeDashoffset={dashOffset}
                                        style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                                    />
                                </svg>
                                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                    <h2 style={{ margin: 0, fontWeight: 800, color: 'var(--text-primary-light)', fontSize: '2.5rem' }}>
                                        {percentage}%
                                    </h2>
                                    <small style={{ color: 'var(--text-secondary-light)' }}>Mastery</small>
                                </div>
                            </div>

                            <div className="text-center">
                                <div style={{ fontSize: '1.2rem', color: 'var(--text-primary-light)', fontWeight: 600 }}>
                                    {totalSolved} / {totalQuestions}
                                </div>
                                <div style={{ color: 'var(--text-secondary-light)' }}>Questions Solved</div>
                            </div>
                        </div>
                    </Fade>
                </div>

                {/* LeetCode Integration Section */}
                <div className="col-12 col-md-7 mb-4">
                    <Fade right>
                        <div className="stats-card p-4 h-100 bento-glass">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h4 style={{ fontWeight: 700, color: 'var(--text-primary-light)', margin: 0 }}>
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png" alt="LC" width="24" className="mr-2" style={{ filter: 'var(--invert-img, none)' }} />
                                    LeetCode Stats
                                </h4>
                            </div>

                            <form onSubmit={fetchLeetCodeStats} className="mb-4 d-flex" style={{ gap: '10px' }}>
                                <input
                                    type="text"
                                    className="form-control lc-input"
                                    placeholder="Enter LeetCode Username"
                                    value={lcUsername}
                                    onChange={(e) => setLcUsername(e.target.value)}
                                    style={{
                                        background: 'var(--bg-color-secondary-light)',
                                        border: '1px solid var(--border-color-light)',
                                        color: 'var(--text-primary-light)',
                                        borderRadius: 'var(--radius-md)'
                                    }}
                                />
                                <button type="submit" className="btn custom-lc-btn" disabled={loading}>
                                    {loading ? <Spinner animation="border" size="sm" /> : 'Fetch'}
                                </button>
                            </form>

                            {error && <div className="alert alert-danger bento-glass" style={{ border: 'none', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>{error}</div>}

                            {lcStats && !loading && (
                                <Fade bottom>
                                    <div className="lc-stats-grid">
                                        <div className="lc-stat-box total">
                                            <h5>Total Solved</h5>
                                            <h2>{lcStats.totalSolved} <span style={{ fontSize: '1rem', color: 'var(--text-secondary-light)' }}>/ {lcStats.totalQuestions}</span></h2>
                                        </div>
                                        <div className="lc-stat-box easy">
                                            <h5>Easy</h5>
                                            <h2>{lcStats.easySolved}</h2>
                                        </div>
                                        <div className="lc-stat-box medium">
                                            <h5>Medium</h5>
                                            <h2>{lcStats.mediumSolved}</h2>
                                        </div>
                                        <div className="lc-stat-box hard">
                                            <h5>Hard</h5>
                                            <h2>{lcStats.hardSolved}</h2>
                                        </div>
                                        <div className="lc-stat-box rank mx-auto mt-2" style={{ gridColumn: '1 / -1' }}>
                                            <h5 style={{ color: 'var(--text-secondary-light)' }}>Global Rank</h5>
                                            <h3 style={{ color: 'var(--accent-color)' }}>{lcStats.ranking}</h3>
                                        </div>
                                    </div>
                                </Fade>
                            )}

                            {!lcStats && !loading && !error && (
                                <div className="text-center" style={{ color: 'var(--text-secondary-light)', padding: '2rem 0' }}>
                                    <span style={{ fontSize: '3rem', opacity: 0.2 }}>📊</span>
                                    <p className="mt-2">Enter your username to sync live stats.</p>
                                </div>
                            )}
                        </div>
                    </Fade>
                </div>
            </div>
        </div>
    );
};

export default StatsDashboard;
