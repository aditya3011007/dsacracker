import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
	return (
		<footer
			className="footer"
			style={{
				padding: "2rem 1rem",
				borderTop: "1px solid var(--border-color-light)",
				marginTop: "auto",
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				flexWrap: "wrap",
				gap: "1rem"
			}}
		>
			<div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
				<a
					href="/"
					style={{
						color: 'var(--text-secondary-light)',
						textDecoration: 'none',
						fontWeight: '500',
						fontSize: '0.95rem',
						transition: 'color 0.2s'
					}}
					onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-primary-light)'}
					onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary-light)'}
				>
					<span role="img" aria-label="home" className="mr-2">🏠</span> Home
				</a>
				<Link
					to="/about"
					style={{
						color: 'var(--text-secondary-light)',
						textDecoration: 'none',
						fontWeight: '500',
						fontSize: '0.95rem',
						transition: 'color 0.2s'
					}}
					onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-primary-light)'}
					onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary-light)'}
				>
					<span role="img" aria-label="about" className="mr-2">ℹ️</span> About & Settings
				</Link>
			</div>

			<div
				style={{
					color: 'var(--text-secondary-light)',
					fontSize: '0.9rem',
					fontWeight: '400'
				}}
			>
				Built with <span role="img" aria-label="heart" style={{ color: 'var(--danger-color)' }}>❤️</span> for placement prep
			</div>
		</footer>
	);
}
