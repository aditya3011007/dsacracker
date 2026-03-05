import React, { useState, useEffect, useContext } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Spinner from 'react-bootstrap/Spinner';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Fade from 'react-reveal/Fade';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import './Topic.css';
import { ThemeContext } from '../../App';
import Button from 'react-bootstrap/Button';

export default function Topic({ data, updateData }) {
	const [select, setSelected] = useState([]);
	const [isBookmarkSortFilterSelected, setIsBookmarkSortFilterSelected] = useState(false);
	const [isSelectedComplete, setSelectedComplete] = useState(true);
	const [sortMode, setSortMode] = useState({
		dataField: '_is_selected',
		order: 'asc',
	});
	const [questionsTableData, setQuestionsTableData] = useState([]);
	const [topicName, setTopicName] = useState('');

	const dark = useContext(ThemeContext);

	useEffect(() => {
		if (data !== undefined) {
			let doneQuestion = [];

			let tableData = data.questions.map((question, index) => {
				if (question.Done) {
					doneQuestion.push(index);
				}
				return {
					id: index,
					question: (
						<div style={{ display: 'flex', justifyContent: 'space-between' }}>
							<a
								href={question.URL}
								target='_blank'
								rel='noopener noreferrer'
								className='question-link p-1'
							>
								{question.Problem}
							</a>
						</div>
					),
					links: (
						<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px' }}>
							{question.URL2.length > 0 && <img
								src={'https://i.ibb.co/RcQ5qLs/Coding-Ninjas-logo.jpg'}
								width='30px'
								height='25px'
								alt='icon'
								style={{ cursor: 'pointer', borderRadius: '4px' }}
								onClick={() => {
									window.open(`${question.URL2}&utm_source=website&utm_medium=affiliate&utm_campaign=450dsatracker`, '_blank');
								}}
							/>}

							<img
								src={
									question.URL.includes('geeksforgeeks')
										? 'https://img.icons8.com/color/24/000000/GeeksforGeeks.png'
										: 'https://img.icons8.com/external-tal-revivo-color-tal-revivo/24/000000/external-level-up-your-coding-skills-and-quickly-land-a-job-logo-color-tal-revivo.png'
								}
								width='30px'
								height='25px'
								alt='icon'
								style={{ cursor: 'pointer', borderRadius: '4px' }}
								onClick={() => {
									window.open(question.URL, '_blank');
								}}
							/>
						</div>
					),
					controls: (
						<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px' }}>
							<OverlayTrigger
								placement='left'
								overlay={!question.Bookmark ? renderTooltipAddBookmark : renderTooltipRemoveBookmark}
							>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									width='20'
									height='20'
									fill='currentColor'
									className={question.Bookmark === 1 ? 'bi bi-bookmark-fill' : 'bi bi-bookmark'}
									viewBox='0 0 16 16'
									style={{ color: 'var(--success-color)', cursor: 'pointer', transition: 'transform 0.2s' }}
									onClick={(e) => {
										e.stopPropagation();
										handleBookmark(index, question);
									}}
									onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
									onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
								>
									{question.Bookmark ? (
										<path d='M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z' />
									) : (
										<path d='M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z' />
									)}
								</svg>
							</OverlayTrigger>
							<OverlayTrigger
								placement='left'
								overlay={question.Notes && question.Notes.length !== 0 ? renderTooltipView : renderTooltipAdd}
							>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									width='20'
									height='20'
									fill='currentColor'
									className={question.Notes && question.Notes.length !== 0 ? 'bi bi-sticky-fill' : 'bi bi-sticky'}
									viewBox='0 0 16 16'
									style={{ color: 'var(--accent-color)', cursor: 'pointer', transition: 'transform 0.2s' }}
									onClick={(e) => {
										e.stopPropagation();
										shownotes(index);
									}}
									onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
									onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
								>
									{question.Notes && question.Notes.length !== 0 ? (
										<path d='M2.5 1A1.5 1.5 0 0 0 1 2.5v11A1.5 1.5 0 0 0 2.5 15h6.086a1.5 1.5 0 0 0 1.06-.44l4.915-4.914A1.5 1.5 0 0 0 15 8.586V2.5A1.5 1.5 0 0 0 13.5 1h-11zm6 8.5a1 1 0 0 1 1-1h4.396a.25.25 0 0 1 .177.427l-5.146 5.146a.25.25 0 0 1-.427-.177V9.5z' />
									) : (
										<path d='M2.5 1A1.5 1.5 0 0 0 1 2.5v11A1.5 1.5 0 0 0 2.5 15h6.086a1.5 1.5 0 0 0 1.06-.44l4.915-4.914A1.5 1.5 0 0 0 15 8.586V2.5A1.5 1.5 0 0 0 13.5 1h-11zM2 2.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 .5.5V8H9.5A1.5 1.5 0 0 0 8 9.5V14H2.5a.5.5 0 0 1-.5-.5v-11zm7 11.293V9.5a.5.5 0 0 1 .5-.5h4.293L9 13.793z' />
									)}
								</svg>
							</OverlayTrigger>
						</div>
					),

					_is_selected: question.Done,
					Bookmark: question.Bookmark,
					_search_text: question.Problem,
				};
			});
			setQuestionsTableData(tableData);
			setTopicName(data.topicName);
			setSelected(doneQuestion);
		}
	}, [data]);

	const renderTooltipAddBookmark = (props) => (
		<Tooltip {...props} className='in' id='button-tooltip'>
			Add Bookmark
		</Tooltip>
	);

	const renderTooltipRemoveBookmark = (props) => (
		<Tooltip {...props} className='in' id='button-tooltip'>
			Remove Bookmark
		</Tooltip>
	);

	const renderTooltipSortBookmark = (props) => (
		<Tooltip {...props} className='in' id='button-tooltip'>
			Show Bookmarks
		</Tooltip>
	);

	const renderTooltipResetSortBookmark = (props) => (
		<Tooltip {...props} className='in' id='button-tooltip'>
			Reset Show Bookmarks
		</Tooltip>
	);

	const renderTooltipView = (props) => (
		<Tooltip {...props} className='in' id='button-tooltip'>
			View Notes
		</Tooltip>
	);

	const renderTooltipAdd = (props) => (
		<Tooltip {...props} className='in' id='button-tooltip'>
			Add Notes
		</Tooltip>
	);

	const Sorter = (x) => {
		if (!x) {
			setSortMode({
				dataField: 'Bookmark',
				order: 'desc',
			});
			setSelectedComplete(x);
		} else {
			setSortMode({
				dataField: '_is_selected',
				order: 'asc',
			});
			setSelectedComplete(x);
		}
		setIsBookmarkSortFilterSelected(!x);
	};

	const SearchBar = (props) => {
		const handleChange = (e) => {
			props.onSearch(e.target.value);
		};
		return (
			<div className='topic-input-container mb-4'>
				<InputGroup>
					<InputGroup.Prepend>
						<RandomButton data={data} />
					</InputGroup.Prepend>
					<FormControl
						className='text-center search-input-container'
						placeholder='Search Question.. 🔍'
						aria-label='Search Question'
						aria-describedby='basic-addon2'
						onChange={handleChange}
					/>
					<InputGroup.Append>
						<div className='completed-questions'>
							<span style={{ fontWeight: 'bold' }}>
								{data.doneQuestions}/{data.questions.length}
							</span>{' '}
							<span className="ml-1 d-none d-sm-inline">Done</span>
							<span className='emojiFix ml-1' role='img' aria-label='checker'>
								&#9989;
							</span>
						</div>
					</InputGroup.Append>
					<OverlayTrigger
						placement='left'
						overlay={isBookmarkSortFilterSelected ? renderTooltipResetSortBookmark : renderTooltipSortBookmark}
					>
						<Button
							variant={isBookmarkSortFilterSelected ? 'success' : 'outline-success'}
							className='sort-button'
							onClick={() => {
								Sorter(isBookmarkSortFilterSelected);
							}}
						>
							<span className='label-emoji'>🏷️</span>
						</Button>
					</OverlayTrigger>
				</InputGroup>
			</div>
		);
	};

	const columns = [
		{
			dataField: 'id',
			text: 'id',
			headerStyle: { width: '40px', textAlign: 'center' },
			style: { cursor: 'pointer', textAlign: 'center' },
			events: {
				onClick: (e, column, columnIndex, row, rowIndex) => {
					handleSelect(row, !row._is_selected);
				},
			},
		},
		{
			dataField: 'question',
			text: 'Questions',
			headerStyle: { textAlign: 'left', width: '65%' },
		},
		{
			dataField: 'links',
			text: 'Solve Links',
			headerStyle: { textAlign: 'center' },
		},
		{
			dataField: 'controls',
			text: 'Actions',
			headerStyle: { textAlign: 'center' },
		},
		{
			dataField: '_is_selected',
			text: 'Is Selected',
			hidden: true,
			sort: true,
		},
		{
			dataField: '_search_text',
			text: 'Search Text',
			hidden: true,
		},
		{
			dataField: 'Bookmark',
			text: 'Bookmark',
			hidden: true,
		},
	];

	const selectRow = {
		mode: 'checkbox',
		style: {
			background: 'rgba(16, 185, 129, 0.1)',
			borderLeft: '4px solid var(--success-color)'
		},
		selected: select,
		onSelect: handleSelect,
		hideSelectAll: true,
	};

	function handleSelect(row, isSelect) {
		let key = topicName.replace(/[^A-Z0-9]+/gi, '_').toLowerCase();
		let newDoneQuestion = [...select];
		let updatedQuestionsStatus = data.questions.map((question, index) => {
			if (row.id === index) {
				question.Done = isSelect;
				if (isSelect) {
					newDoneQuestion.push(row.id);
				} else {
					var pos = newDoneQuestion.indexOf(row.id);
					newDoneQuestion.splice(pos, 1);
				}
				return question;
			} else {
				return question;
			}
		});
		updateData(
			key,
			{
				started: newDoneQuestion.length > 0 ? true : false,
				doneQuestions: newDoneQuestion.length,
				questions: updatedQuestionsStatus,
			},
			data.position
		);
		if (isSelectedComplete) displayToast(isSelect, row.id);
	}

	function displayToast(isSelect, id) {
		const { type, icon, dir } = {
			type: isSelect ? 'Done' : 'Incomplete',
			icon: isSelect ? '🎉' : '🙇🏻‍♂️',
			dir: isSelect ? '👇🏻' : '👆🏻',
		};

		const title = `${isSelect ? select.length + 1 : select.length - 1}/${data.questions.length} Done`;
		const subTitle = `Question pushed ${dir} the table.`;

		const Card = (
			<>
				<p className="mb-1">
					{title} <span className='emojiFix'>{icon}</span>
				</p>
				<p className='toast-subtitle mb-0'>{subTitle}</p>
			</>
		);

		toast(Card, {
			className: `toast-${type}`,
			autoClose: 2000,
			closeButton: true,
		});
	}

	const NoteSection = (props) => {
		let id = localStorage.getItem('cid');
		const [quickNotes, setQuickNotes] = useState(data.questions[id]?.Notes);

		const addnewnotes = (event) => {
			setQuickNotes(event.target.value);
		};

		const onadd = () => {
			let key = topicName.replace(/[^A-Z0-9]+/gi, '_').toLowerCase();
			if (id) {
				let que = data.questions;
				que[id].Notes = quickNotes.trim().length === 0 ? '' : quickNotes.trim();
				updateData(
					key,
					{
						started: data.started,
						doneQuestions: data.doneQuestions,
						questions: que,
					},
					data.position
				);
				localStorage.removeItem('cid');
			}
			saveAndExitNotes();
		};

		return (
			<>
				<div className='note-area'>
					<div className='note-container'>
						<div className='question-title'>{data.questions[id]?.Problem || 'Notes'}</div>
						<textarea maxLength='432' className='note-section' placeholder='Write your approach or hints here...' onChange={addnewnotes}></textarea>
						<div className='button-container'>
							<button className='note-exit' onClick={saveAndExitNotes}>
								Close
							</button>
							<button className='note-save' onClick={onadd}>
								Save Note
							</button>
						</div>
					</div>
				</div>
			</>
		);
	};

	function handleBookmark(row, quest) {
		let key = topicName.replace(/[^A-Z0-9]+/gi, '_').toLowerCase();
		let newDoneQuestion = [...select];
		let updatedQuestionsStatus = data.questions.map((question, index) => {
			if (row === index) {
				question.Bookmark = quest.Bookmark ? false : true;
				return question;
			} else {
				return question;
			}
		});
		updateData(
			key,
			{
				started: newDoneQuestion.length > 0 ? true : false,
				doneQuestions: newDoneQuestion.length,
				questions: updatedQuestionsStatus,
			},
			data.position
		);
	}

	function saveAndExitNotes() {
		document.getElementsByClassName('note-area')[0].style.display = 'none';
		localStorage.removeItem('cid');
	}

	function shownotes(ind) {
		document.getElementsByClassName('note-area')[0].style.display = 'block';
		localStorage.setItem('cid', ind);
		document.getElementsByClassName('note-section')[0].value = data.questions[ind].Notes;
		document.getElementsByClassName('question-title')[0].innerHTML = data.questions[ind].Problem;
	}

	const topicInsights = {
		"Array": { time: "O(1) Access, O(n) Search/Insert/Delete", space: "O(n)", tip: "Two pointers, Sliding window, Hashing are your best friends." },
		"Matrix": { time: "O(m*n) Traversal", space: "O(1) to O(m*n)", tip: "Think of it as a 2D array or graph. BFS/DFS work great." },
		"String": { time: "O(n) Traversal", space: "O(n) mostly", tip: "Understand ASCII, Palindromes, KMP, Rabin-Karp, and Tries." },
		"Search & Sort": { time: "O(n log n) Sort, O(log n) Search", space: "O(1) to O(n)", tip: "Binary Search is the most powerful tool. Divide & Conquer." },
		"Linked List": { time: "O(n) Traversal, O(1) Insert (if node given)", space: "O(1) usually", tip: "Fast/Slow Pointers (Floyd's Cycle Finding), Dummy Nodes." },
		"Binary Trees": { time: "O(n) Traversal", space: "O(h) where h is height", tip: "Recursion! Master Inorder, Preorder, Postorder, and Level Order (BFS)." },
		"BST": { time: "O(h) Search/Insert/Delete", space: "O(h)", tip: "Inorder traversal gives sorted order. Useful for range queries." },
		"Greedy": { time: "Varies (usually sorting + O(n))", space: "O(1) mostly", tip: "Local optimum leads to global optimum. 'Always pick the best right now'." },
		"Backtracking": { time: "O(a^n) usually exponential", space: "O(n) recursion depth", tip: "Explore all paths. 'Choose, explore, un-choose' pattern." },
		"Stacks & Queues": { time: "O(1) Push/Pop", space: "O(n)", tip: "LIFO vs FIFO. Great for Monotonic Stacks, Next Greater Element, BFS." },
		"Heap": { time: "O(1) Peek, O(log n) Push/Pop", space: "O(n)", tip: "Priority Queues! Top K elements, median in data stream." },
		"Graph": { time: "O(V + E) BFS/DFS", space: "O(V)", tip: "Adjacency List > Matrix usually. Dijkstra, MST, Topological Sort." },
		"Trie": { time: "O(L) where L is string length", space: "O(N * L * Alphabet)", tip: "Awesome for Prefix matching, Autocomplete, XOR maximum." },
		"Dynamic Programming": { time: "Polynomial O(n^2), O(n*W)", space: "O(n) to O(n^2) usually", tip: "Overlapping subproblems + optimal substructure. Memoize or Tabulate." },
		"Bit Manipulation": { time: "O(1) for built-in, O(bits) loops", space: "O(1)", tip: "XOR properties, bit masking, checking set bits." }
	};

	const currentInsight = topicInsights[topicName] || { time: "Varies", space: "Varies", tip: "Practice makes perfect!" };

	return (
		<>
			<div className="mb-5">
				<h3 className='page-heading'>
					{topicName}
				</h3>
				<div className="page-subtitle mb-4">
					<Link to='/' style={{ color: 'var(--text-secondary-light)', textDecoration: 'none' }}>Topics</Link>
					<span className="mx-2">/</span>
					<span style={{ color: 'var(--text-primary-light)', fontWeight: 'bold' }}>{topicName}</span>
				</div>

				{topicName && (
					<Fade top distance="20px" duration={500}>
						<div className="topic-insight-card p-4 mb-4" style={{
							background: 'rgba(139, 92, 246, 0.05)',
							borderLeft: '4px solid var(--accent-color)',
							borderRadius: '0 var(--radius-lg) var(--radius-lg) 0',
							backdropFilter: 'blur(5px)'
						}}>
							<h5 style={{ color: 'var(--text-primary-light)', marginBottom: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
								<span>💡</span> Quick Cheat Sheet
							</h5>
							<div className="row">
								<div className="col-md-4 mb-2 mb-md-0">
									<strong style={{ color: 'var(--accent-color)' }}>🕒 Time:</strong>
									<div style={{ color: 'var(--text-secondary-light)', fontSize: '0.9rem' }}>{currentInsight.time}</div>
								</div>
								<div className="col-md-4 mb-2 mb-md-0">
									<strong style={{ color: 'var(--accent-color)' }}>💾 Space:</strong>
									<div style={{ color: 'var(--text-secondary-light)', fontSize: '0.9rem' }}>{currentInsight.space}</div>
								</div>
								<div className="col-md-4">
									<strong style={{ color: 'var(--accent-color)' }}>🎯 Pro Tip:</strong>
									<div style={{ color: 'var(--text-secondary-light)', fontSize: '0.9rem' }}>{currentInsight.tip}</div>
								</div>
							</div>
						</div>
					</Fade>
				)}
			</div>

			{data === undefined ? (
				<div className='d-flex justify-content-center align-items-center' style={{ minHeight: '40vh' }}>
					<Spinner animation='border' variant='primary' style={{ width: '3rem', height: '3rem' }} />
				</div>
			) : (
				<ToolkitProvider
					className='float-right'
					keyField='id'
					data={questionsTableData}
					columns={columns}
					search
				>
					{(props) => (
						<div>
							<div className='header-rand'>{SearchBar({ ...props.searchProps })}</div>
							<div className='container p-0' style={{ overflowAnchor: 'none', maxWidth: 'var(--table-xl-width)' }}>
								<Fade duration={600}>
									<BootstrapTable
										{...props.baseProps}
										selectRow={selectRow}
										sort={sortMode}
										classes={`table-borderless ${dark ? 'dark-table' : ''}`}
										wrapperClasses="table-responsive"
									/>
								</Fade>
							</div>
						</div>
					)}
				</ToolkitProvider>
			)}
			<ToastContainer />
			<NoteSection />
		</>
	);
}

function RandomButton({ data }) {
	let min = 0;
	let max = data.questions.length - 1;
	const [rnd, setRnd] = useState(Math.floor(Math.random() * (max - min)) + min);
	function pickRandomHandler() {
		setRnd(Math.floor(Math.random() * (max - min)) + min);
	}
	return (
		<Button
			className='pick-random-btn'
			onClick={pickRandomHandler}
			variant='outline-primary'
			href={data.questions[rnd].URL}
			target='_blank'
		>
			Pick Random{' '}
			<span role='img' aria-label='woman-juggling-emoji' className='emojiFix'>
				🤹🏻‍♀️
			</span>
		</Button>
	);
}
