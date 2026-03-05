import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Badge from 'react-bootstrap/Badge';
import { FiGift, FiX, FiArrowRight } from 'react-icons/fi';
import './DailyChallenge.css'; // We'll rely on a CSS file for standard animations

const DailyChallenge = ({ questionData }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [challengeIdea, setChallengeIdea] = useState(null);
    const history = useHistory();

    // Find a random unsolved question
    useEffect(() => {
        if (!questionData || questionData.length === 0) return;

        let unsolvedQuestions = [];

        questionData.forEach(topic => {
            topic.questions.forEach((q, index) => {
                if (!q.Done) {
                    unsolvedQuestions.push({
                        topicName: topic.topicName,
                        topicSlug: `/${topic.topicName.replace(/[^A-Z0-9]+/gi, "_").toLowerCase()}`,
                        questionName: q.Problem
                    });
                }
            });
        });

        if (unsolvedQuestions.length > 0) {
            const randomIndex = Math.floor(Math.random() * unsolvedQuestions.length);
            setChallengeIdea(unsolvedQuestions[randomIndex]);
        }
    }, [questionData]);

    const handleSolve = () => {
        if (challengeIdea) {
            history.push(challengeIdea.topicSlug);
            setIsOpen(false);
        }
    };

    if (!challengeIdea) return null;

    return (
        <>
            <button
                className="daily-challenge-fab hvr-grow"
                onClick={() => setIsOpen(true)}
                style={{
                    position: 'fixed',
                    bottom: '2rem',
                    right: '2rem',
                    width: '60px',
                    height: '60px',
                    borderRadius: '30px',
                    background: 'linear-gradient(135deg, var(--accent-color), #8b5cf6)',
                    border: 'none',
                    color: 'white',
                    boxShadow: '0 10px 25px rgba(139, 92, 246, 0.4)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 999,
                    cursor: 'pointer'
                }}
            >
                <FiGift size={24} />
            </button>

            {isOpen && (
                <div
                    className="modal-backdrop-fade"
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        background: 'rgba(0,0,0,0.6)',
                        backdropFilter: 'blur(10px)',
                        zIndex: 10000,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className="modal-content-spring"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: 'var(--bg-color-secondary-light)',
                            padding: '2.5rem',
                            borderRadius: 'var(--radius-xl)',
                            maxWidth: '450px',
                            width: '90%',
                            position: 'relative',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                            border: '1px solid var(--border-color-light)',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Magic UI Style Border Glow behind content */}
                        <div style={{
                            position: 'absolute',
                            top: '-50%', left: '-50%', width: '200%', height: '200%',
                            background: 'conic-gradient(transparent, var(--accent-color), transparent 30%)',
                            animation: 'rotateGlow 4s linear infinite',
                            opacity: 0.1,
                            zIndex: 0,
                            pointerEvents: 'none'
                        }} />

                        <button
                            onClick={() => setIsOpen(false)}
                            style={{
                                position: 'absolute', top: '1rem', right: '1rem',
                                background: 'transparent', border: 'none', color: 'var(--text-secondary-light)',
                                cursor: 'pointer', zIndex: 10
                            }}
                        >
                            <FiX size={24} />
                        </button>

                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <Badge variant="primary" style={{ backgroundColor: 'rgba(139, 92, 246, 0.2)', color: '#8b5cf6', padding: '0.4em 0.8em', borderRadius: '20px', marginBottom: '1rem' }}>
                                Daily Challenge
                            </Badge>

                            <h3 className="app-heading2" style={{ fontSize: '1.8rem', marginTop: '0', marginBottom: '0.5rem' }}>
                                Ready to level up?
                            </h3>

                            <p style={{ color: 'var(--text-secondary-light)', marginBottom: '2rem' }}>
                                We picked this random unsolved question just for you from the <strong>{challengeIdea.topicName}</strong> topic.
                            </p>

                            <div
                                style={{
                                    background: 'rgba(59, 130, 246, 0.05)',
                                    border: '1px solid rgba(59, 130, 246, 0.2)',
                                    padding: '1.5rem',
                                    borderRadius: 'var(--radius-lg)',
                                    marginBottom: '2rem'
                                }}
                            >
                                <strong style={{ color: 'var(--text-primary-light)', fontSize: '1.1rem', display: 'block' }}>
                                    {challengeIdea.questionName}
                                </strong>
                            </div>

                            <button
                                className="hvr-grow"
                                onClick={handleSolve}
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    background: 'var(--text-primary-light)',
                                    color: 'var(--bg-color-light)',
                                    border: 'none',
                                    borderRadius: 'var(--radius-md)',
                                    fontWeight: 600,
                                    fontSize: '1rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    cursor: 'pointer'
                                }}
                            >
                                Solve Now <FiArrowRight />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DailyChallenge;
