import React, { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import Fade from "react-reveal/Fade";

export default function About({ resetData, exportData, importData }) {
	const inputFile = useRef(null);
	let history = useHistory();
	const [importSpinnerState, setImportSpinnerState] = useState(false);
	const [exportSpinnerState, setExportSpinnerState] = useState(false);

	function handleChange(e) {
		const fileReader = new FileReader();
		fileReader.readAsText(e.target.files[0], "UTF-8");
		fileReader.onload = (e) => {
			const JSONData = JSON.parse(e.target.result);
			importData(JSONData, () => {
				setImportSpinnerState(false);
				history.push("/");
			});
		};
	}

	const handleExport = () => {
		setExportSpinnerState(true);
		exportData(() => {
			setExportSpinnerState(false);
		});
	}

	const handleImport = () => {
		setImportSpinnerState(true);
		inputFile.current.click();
	}

	return (
		<>
			<div className="container-custom" style={{ padding: '2rem 1rem' }}>
				<Fade duration={500}>
					<div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>

						<div
							style={{
								background: 'var(--bg-color-secondary-light)',
								borderRadius: 'var(--radius-xl)',
								padding: '3rem',
								boxShadow: 'var(--shadow-md)',
								border: '1px solid var(--border-color-light)',
								textAlign: 'center',
								marginBottom: '2rem'
							}}
						>
							<h2 className="page-heading mb-4" style={{ fontSize: '2rem' }}>About 450 DSA Cracker</h2>
							<p style={{ fontSize: '1.2rem', color: 'var(--text-secondary-light)', lineHeight: '1.6', marginBottom: '2rem' }}>
								Build your confidence in solving any coding related question and prepare for your placements.
								<span role="img" aria-label="student" className="ml-2">👨🏻‍🎓</span>
							</p>

							<div
								style={{
									background: 'rgba(59, 130, 246, 0.05)',
									padding: '1.5rem',
									borderRadius: 'var(--radius-lg)',
									border: '1px dashed rgba(59, 130, 246, 0.3)',
									marginBottom: '2.5rem'
								}}
							>
								<p style={{ fontSize: '1.1rem', marginBottom: '0' }}>
									Based on the comprehensive <br className="d-md-none" />
									<a
										href="https://drive.google.com/file/d/1FMdN_OCfOI0iAeDlqswCiC2DZzD4nPsb/view"
										target="_blank"
										rel="noopener noreferrer"
										style={{ color: 'var(--accent-color)', fontWeight: '600', textDecoration: 'none' }}
									>
										DSA Cracker Sheet
									</a>
									{" "}by{" "}
									<a
										href="https://www.linkedin.com/in/love-babbar-38ab2887/"
										target="_blank"
										rel="noopener noreferrer"
										style={{ color: 'var(--text-primary-light)', fontWeight: '700', textDecoration: 'none' }}
									>
										Love Babbar
									</a>{" "}
									<span role="img" aria-label="join-hands">🙏🏻</span>
								</p>
							</div>

							<div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-3" style={{ gap: '1rem' }}>
								<button
									onClick={handleExport}
									className="btn"
									style={{
										padding: '0.75rem 1.5rem',
										background: 'var(--bg-color-light)',
										color: 'var(--text-primary-light)',
										border: '1px solid var(--border-color-light)',
										borderRadius: 'var(--radius-md)',
										fontWeight: '600',
										width: '100%',
										maxWidth: '200px',
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
										gap: '0.5rem',
										transition: 'all 0.2s'
									}}
									onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
									onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
								>
									{exportSpinnerState ? <Spinner size="sm" animation="border" /> : <span role="img" aria-label="export">📤</span>}
									Export Progress
								</button>

								<button
									onClick={handleImport}
									className="btn"
									style={{
										padding: '0.75rem 1.5rem',
										background: 'var(--accent-color)',
										color: 'white',
										border: 'none',
										borderRadius: 'var(--radius-md)',
										fontWeight: '600',
										width: '100%',
										maxWidth: '200px',
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
										gap: '0.5rem',
										transition: 'all 0.2s'
									}}
									onMouseOver={(e) => { e.currentTarget.style.background = 'var(--accent-color-hover)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
									onMouseOut={(e) => { e.currentTarget.style.background = 'var(--accent-color)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
								>
									{importSpinnerState ? <Spinner size="sm" animation="border" /> : <span role="img" aria-label="import">📥</span>}
									Import Progress
								</button>
							</div>

							<div className="mt-5 pt-3 border-top" style={{ borderColor: 'var(--border-color-light) !important' }}>
								<button
									onClick={() => {
										if (window.confirm("Are you sure you want to completely reset your progress? This action cannot be undone.")) {
											resetData();
										}
									}}
									className="btn btn-link text-danger"
									style={{ textDecoration: 'none', fontWeight: '500' }}
								>
									Reset All Progress
								</button>
							</div>

						</div>
						<input type="file" id="file" ref={inputFile} style={{ display: "none" }} accept=".json" onChange={handleChange} />
					</div>
				</Fade>
			</div>
		</>
	);
}
