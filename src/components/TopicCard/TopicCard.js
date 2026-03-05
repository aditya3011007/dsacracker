import React, { useContext } from "react";
import Card from "react-bootstrap/Card";
import ProgressBar from "react-bootstrap/ProgressBar";
import Badge from "react-bootstrap/Badge";
import Fade from "react-reveal/Fade";
import { Link } from "react-router-dom";
import Tilt from "react-parallax-tilt";
import { FiBox, FiList, FiTrendingUp, FiLayers, FiActivity, FiFolder, FiCpu, FiGitBranch } from "react-icons/fi";
import { ThemeContext } from "../../App";

import "./topicCard.css";

// Helper function to map topics to modern minimalist icons
const getTopicIcon = (name) => {
  const n = name.toLowerCase();
  if (n.includes('array')) return <FiLayers size={24} style={{ color: 'var(--accent-color)' }} />;
  if (n.includes('string')) return <FiList size={24} style={{ color: 'var(--success-color)' }} />;
  if (n.includes('matrix')) return <FiBox size={24} style={{ color: '#8b5cf6' }} />;
  if (n.includes('search') || n.includes('sort')) return <FiActivity size={24} style={{ color: '#ef4444' }} />;
  if (n.includes('tree') || n.includes('graph')) return <FiGitBranch size={24} style={{ color: '#10b981' }} />;
  if (n.includes('dynamic') || n.includes('greedy')) return <FiCpu size={24} style={{ color: '#f59e0b' }} />;
  return <FiFolder size={24} style={{ color: 'var(--text-secondary-light)' }} />;
};

export default function TopicCard({ questionData }) {
  const dark = useContext(ThemeContext);

  const findPercentage = (doneQuestions, totalQuestions) => {
    return Math.round((doneQuestions / totalQuestions) * 100);
  };

  let totalSolved = 0;
  let totalQuestions = 0;

  let topicCard = questionData.map((topic, index) => {
    let { topicName, doneQuestions, questions, started } = topic;
    let percentDone = findPercentage(doneQuestions, questions.length);
    let questionsRemainig = questions.length - doneQuestions;

    totalSolved += doneQuestions;
    totalQuestions += questions.length;

    // We increase tilt depth for a modern interactive feel
    const tiltOptions = {
      tiltMaxAngleX: 4,
      tiltMaxAngleY: 4,
      scale: 1.02,
      transitionSpeed: 2000,
      glareEnable: true,
      glareMaxOpacity: 0.15,
      glarePosition: "all",
      glareBorderRadius: "var(--radius-xl)"
    };

    if (started) {
      return (
        <Fade duration={500 + index * 0.4} key={index}>
          <Tilt {...tiltOptions} className="bento-card-wrapper">
            <Link
              to={`/${topic.topicName.replace(/[^A-Z0-9]+/gi, "_").toLowerCase()}`}
              style={{ textDecoration: "none" }}
            >
              <Card className={`topic-card inprogress-card hvr-grow ${questionsRemainig === 0 ? 'magic-border-card' : ''}`}>
                <Card.Body className="p-0 d-flex flex-column h-100">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="d-flex align-items-center gap-2" style={{ gap: '12px' }}>
                      <div className="icon-wrapper">
                        {getTopicIcon(topic.topicName)}
                      </div>
                      <Card.Title className="topicName m-0">
                        {topic.topicName}
                      </Card.Title>
                    </div>
                    <Badge
                      pill
                      className="card-badge"
                      style={{ backgroundColor: questionsRemainig === 0 ? 'var(--success-color)' : 'var(--accent-color)' }}
                    >
                      {questionsRemainig === 0 ? "Done" : "In Progress"}
                    </Badge>
                  </div>

                  <div className="flex-grow-1">
                    <Card.Text className="totalQuestion">
                      {questions.length} Questions <br />
                      {questionsRemainig === 0
                        ? <span style={{ color: 'var(--success-color)' }}>All completed 👏🏻</span>
                        : <span>{`${questionsRemainig}`} More to go</span>
                      }
                    </Card.Text>
                  </div>

                  <div className="mt-auto d-flex align-items-center justify-content-between">
                    <div>
                      <p className="percentDone mb-1" style={{ display: 'block' }}>
                        <span>Progress</span>
                      </p>
                      <span style={{ fontSize: '1.2rem', fontWeight: 700, color: questionsRemainig === 0 ? 'var(--success-color)' : 'var(--accent-color)' }}>
                        {percentDone}%
                      </span>
                    </div>

                    {/* Circular Progress Ring */}
                    <div style={{ position: 'relative', width: '50px', height: '50px' }}>
                      <svg width="50" height="50" viewBox="0 0 50 50">
                        {/* Background track */}
                        <circle
                          cx="25"
                          cy="25"
                          r="20"
                          fill="none"
                          stroke="var(--border-color-light)"
                          strokeWidth="4"
                        />
                        {/* Progress stroke */}
                        <circle
                          cx="25"
                          cy="25"
                          r="20"
                          fill="none"
                          stroke={questionsRemainig === 0 ? 'var(--success-color)' : 'url(#gradient)'}
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeDasharray="125.6"
                          strokeDashoffset={125.6 - (125.6 * percentDone) / 100}
                          style={{
                            transition: 'stroke-dashoffset 1s ease-in-out',
                            transform: 'rotate(-90deg)',
                            transformOrigin: '50% 50%'
                          }}
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="var(--accent-color)" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Link>
          </Tilt>
        </Fade>
      );
    } else {
      return (
        <Fade duration={500 + index * 50} key={index}>
          <Tilt {...tiltOptions} className="bento-card-wrapper">
            <Link
              to={`/${topic.topicName.replace(/[^A-Z0-9]+/gi, "_").toLowerCase()}`}
              style={{ textDecoration: "none" }}
            >
              <Card className={`topic-card notstarted-card hvr-grow`}>
                <Card.Body className="p-0 d-flex flex-column h-100">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="d-flex align-items-center gap-2" style={{ gap: '12px' }}>
                      <div className="icon-wrapper" style={{ opacity: 0.6 }}>
                        {getTopicIcon(topic.topicName)}
                      </div>
                      <Card.Title className="topicName m-0">
                        {topicName}
                      </Card.Title>
                    </div>
                    <Badge
                      pill
                      className="card-badge"
                      style={{ backgroundColor: 'var(--text-secondary-light)' }}
                    >
                      Start Here
                    </Badge>
                  </div>

                  <div className="flex-grow-1">
                    <Card.Text className="totalQuestion">
                      {questions.length} Questions<br />
                      Not yet started
                    </Card.Text>
                  </div>

                  <div className="mt-auto pt-3 d-flex align-items-center justify-content-between">
                    <div>
                      <p className="percentDone mb-1" style={{ display: 'block', color: 'var(--text-secondary-light)' }}>
                        <span>Progress</span>
                      </p>
                      <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-secondary-light)' }}>
                        0%
                      </span>
                    </div>

                    {/* Circular Progress Ring (0%) */}
                    <div style={{ position: 'relative', width: '50px', height: '50px' }}>
                      <svg width="50" height="50" viewBox="0 0 50 50">
                        <circle
                          cx="25"
                          cy="25"
                          r="20"
                          fill="none"
                          stroke="var(--border-color-light)"
                          strokeWidth="4"
                        />
                      </svg>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Link>
          </Tilt>
        </Fade>
      );
    }
  });

  return (
    <>
      <div className="text-center mb-5 heroic-header fade-in-section">
        <h3
          className="app-heading2 mb-2"
          style={{ fontSize: '2.5rem', letterSpacing: '-0.03em' }}
        >
          Your Gateway to crack DSA{" "}
          <span
            role="img" aria-label="fire" className="emojiFix"
            style={{ display: 'inline-block', animation: 'wobble 2s infinite' }}
          >🔥</span>
        </h3>

        <div
          className="stats-heading mb-4"
          style={{ fontSize: '1.2rem' }}
        >
          {totalSolved
            ? `Completed ${totalSolved} out of ${totalQuestions} questions`
            : "Let's get started on your DSA journey!"}
        </div>

        {totalSolved > 0 && (
          <div className="container" style={{ maxWidth: '600px' }}>
            <ProgressBar
              animated={
                ((totalSolved / totalQuestions) * 100).toFixed(2) === "100" ? false : true
              }
              now={((totalSolved / totalQuestions) * 100).toFixed(2)}
              style={{ height: '12px', borderRadius: '6px' }}
            />
            <div className="text-right mt-2" style={{ fontSize: '0.9rem', color: 'var(--text-secondary-light)', fontWeight: 600 }}>
              {((totalSolved / totalQuestions) * 100).toFixed(1)}% Mastery
            </div>
          </div>
        )}
      </div>

      <div className="container container-custom fade-in-section" style={{ animationDelay: '0.2s' }}>
        <div className="bento-grid mt-3">
          {topicCard}
        </div>
      </div>
    </>
  );
}
