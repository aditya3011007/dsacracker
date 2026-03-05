import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { getData, updateDBData, resetDBData, exportDBData, importDBData } from './services/dbServices';
import { saveAs } from 'file-saver';
import Spinner from 'react-bootstrap/Spinner';
import TopicCard from './components/TopicCard/TopicCard';
import Topic from './components/Topic/Topic';
import About from './components/About/About';
import Footer from './components/Footer/Footer';
import ThreeBackground from './components/ThreeBackground/ThreeBackground';
import DailyChallenge from './components/DailyChallenge/DailyChallenge';
import StatsDashboard from './components/StatsDashboard/StatsDashboard';
import ReactGA from 'react-ga';
import { FiSun, FiMoon } from 'react-icons/fi';
import './App.css';

// Creating a theme context
export const ThemeContext = createContext(null);

function App() {
	// setting state for data received from the DB
	const [questionData, setquestionData] = useState([]);

	// if dark theme is enabled or not
	const [dark, setDark] = useState(false);

	// useEffect for fetching data from DB on load and init GA
	useEffect(() => {
		localStorage.removeItem('cid');
		ReactGA.initialize(process.env.REACT_APP_GA_TRACKING_ID);
		ReactGA.pageview(window.location.pathname + window.location.search);
		getData((QuestionData) => {
			setquestionData(QuestionData);
		});

		//implementing dark theme mode option
		// checking if dark mode "isDark" is already declared or not
		if (!('isDark' in window.localStorage)) {
			window.localStorage.setItem('isDark', dark);
		} else {
			// initialising the value of dark with the already stored value
			let temp = window.localStorage['isDark'];
			if (temp === 'false') {
				setDark(false);
			} else {
				setDark(true);
			}
		}
	}, []);

	// Custom ambient pointer glow tracker
	useEffect(() => {
		const cursor = document.getElementById('custom-cursor');
		if (!cursor) return;
		const moveCursor = (e) => {
			cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
		};
		window.addEventListener('mousemove', moveCursor);
		return () => window.removeEventListener('mousemove', moveCursor);
	}, []);

	// Update theme toggle function to sync with localStorage
	const toggleTheme = () => {
		const newTheme = !dark;
		setDark(newTheme);
		window.localStorage.setItem('isDark', newTheme);
	};

	//to update progress in '/' route and also update DB
	function updateData(key, topicData, topicPosition) {
		let reGenerateUpdatedData = questionData.map((topic, index) => {
			if (index === topicPosition) {
				updateDBData(key, topicData);
				return { topicName: topic.topicName, position: topic.position, ...topicData };
			} else {
				return topic;
			}
		});
		setquestionData(reGenerateUpdatedData);
	}

	// reset and clear DB
	function resetData() {
		resetDBData((response) => {
			setquestionData([]);
			window.location.replace(window.location.origin);
		});
	}

	// export 450DSA-Progress data

	function exportData(callback) {
		exportDBData((data) => {
			const fileData = JSON.stringify(data);
			const blob = new Blob([fileData], { type: 'text/plain' });
			saveAs(blob, 'progress.json');
			callback();
		});
	}

	// import 450DSA-Progress data

	function importData(data, callback) {
		importDBData(data, (QuestionData) => {
			setquestionData(QuestionData);
			callback();
		});
	}

	return (
		<Router>
			<div className={dark ? 'App dark' : 'App'}>
				<ThreeBackground />
				<div id="custom-cursor" className="pointer-glow" />
				<nav className="app-navbar floating-dock">
					<Link to="/" className="navbar-brand">
						<span role="img" aria-label="fire" style={{ fontSize: '1.8rem' }}>🔥</span>
						450 DSA Cracker
					</Link>
					<div className="navbar-actions">
						<Link to="/stats" style={{ color: 'var(--text-secondary-light)', textDecoration: 'none', fontWeight: 600 }}>
							<span role="img" aria-label="chart" className="mr-1">📊</span> Stats
						</Link>
						<Link to="/about" style={{ color: 'var(--text-secondary-light)', textDecoration: 'none', fontWeight: 600 }}>
							<span role="img" aria-label="info" className="mr-1">ℹ️</span> About
						</Link>
						<button
							className="theme-toggle-btn"
							onClick={toggleTheme}
							aria-label="Toggle theme"
						>
							{dark ? <FiSun size={24} /> : <FiMoon size={24} />}
						</button>
					</div>
				</nav>

				<main className="app-content">
					{questionData.length === 0 ? (
						// load spinner until data is fetched from DB
						<div className='d-flex justify-content-center align-items-center' style={{ minHeight: '50vh' }}>
							<Spinner animation='border' variant='primary' style={{ width: '3rem', height: '3rem' }} />
						</div>
					) : (
						<div className="fade-in-section">
							<ThemeContext.Provider value={dark}>
								{/* HOME AND ABOUT ROUTE */}
								<Route exact path='/' children={<TopicCard questionData={questionData}></TopicCard>} />
								<Route
									path='/stats'
									children={<StatsDashboard questionData={questionData} />}
								/>
								<Route
									path='/about'
									children={
										<About
											resetData={resetData}
											exportData={exportData}
											importData={importData}
											setQuestionData={setquestionData}
										></About>
									}
								/>

								{/* TOPIC ROUTE */}
								<Route path='/array' children={<Topic data={questionData[0]} updateData={updateData} />} />
								<Route path='/matrix' children={<Topic data={questionData[1]} updateData={updateData} />} />
								<Route path='/string' children={<Topic data={questionData[2]} updateData={updateData} />} />
								<Route path='/search_sort' children={<Topic data={questionData[3]} updateData={updateData} />} />
								<Route path='/linked_list' children={<Topic data={questionData[4]} updateData={updateData} />} />
								<Route path='/binary_trees' children={<Topic data={questionData[5]} updateData={updateData} />} />
								<Route path='/bst' children={<Topic data={questionData[6]} updateData={updateData} />} />
								<Route path='/greedy' children={<Topic data={questionData[7]} updateData={updateData} />} />
								<Route path='/backtracking' children={<Topic data={questionData[8]} updateData={updateData} />} />
								<Route path='/stacks_queues' children={<Topic data={questionData[9]} updateData={updateData} />} />
								<Route path='/heap' children={<Topic data={questionData[10]} updateData={updateData} />} />
								<Route path='/graph' children={<Topic data={questionData[11]} updateData={updateData} />} />
								<Route path='/trie' children={<Topic data={questionData[12]} updateData={updateData} />} />
								<Route path='/dynamic_programming' children={<Topic data={questionData[13]} updateData={updateData} />} />
								<Route path='/bit_manipulation' children={<Topic data={questionData[14]} updateData={updateData} />} />
							</ThemeContext.Provider>
							<DailyChallenge questionData={questionData} />
						</div>
					)}
				</main>
				<Footer dark={dark} setDark={setDark}></Footer>
			</div>
		</Router>
	);
}

export default App;

