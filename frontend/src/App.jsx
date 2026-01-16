import React from 'react';
import InvestorList from './components/InvestorList/InvestorList';
import InvestorForm from './components/InvestorForm/InvestorForm';

function Home() {
  return (
    <>
      <div className="section-header">
        <h1 className="section-header__title">PM Investor Management</h1>
        <p className="section-header__description">
          Bring your investors and their financial documents into one secure system - fast.
          Import existing data in minutes and let us handle ongoing verification and updates,
          so you can focus on your platform, not paperwork.
        </p>
      </div>

      <div className="section-header__cta">
        <a
          href="/investors/new"
          className="btn btn--cta btn--primary"
        >
          Start
        </a>
      </div>

      <div className="section-header__features" aria-label="Key product features">
        <div className="section-header__feature">
          <span className="section-header__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </span>
          <div className="section-header__feature-title">Fast</div>
          <div className="section-header__feature-text">Collect and review investor info quickly.</div>
        </div>

        <div className="section-header__feature">
          <span className="section-header__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </span>
          <div className="section-header__feature-title">Secure</div>
          <div className="section-header__feature-text">Keep sensitive data protected end-to-end.</div>
        </div>

        <div className="section-header__feature">
          <span className="section-header__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3v18h18" />
              <path d="M7 14l3-3 4 4 6-7" />
            </svg>
          </span>
          <div className="section-header__feature-title">Smart Investments</div>
          <div className="section-header__feature-text">Organize documents for streamlined diligence.</div>
        </div>
      </div>
    </>
  );
}

function App() {
  const path = window.location.pathname;

  if (path === '/investors' || path === '/investors/') {
    return <InvestorList />;
  }

  if (path === '/investors/new' || path === '/investors/new/') {
    return <InvestorForm mode="new" />;
  }

  const editMatch = path.match(/^\/investors\/([^/]+)\/edit\/?$/);
  if (editMatch) {
    return <InvestorForm mode="edit" investorId={editMatch[1]} />;
  }

  return <Home />;
}

export default App;