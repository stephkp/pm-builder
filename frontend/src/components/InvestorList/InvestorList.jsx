import React, { useEffect, useState } from 'react';
import { graphqlRequest } from '../../graphqlClient';

const INVESTORS_QUERY = `
  query Investors {
    investors {
      id
      firstName
      lastName
      phoneNumber
      streetAddress
      city
      state
      zipCode
      documentsAttached
    }
  }
`;

function getCsrfToken() {
  const el = document.querySelector('meta[name="csrf-token"]');
  return el ? el.getAttribute('content') : null;
}

export default function InvestorList() {
  const [investors, setInvestors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const data = await graphqlRequest(INVESTORS_QUERY);
        if (cancelled) return;

        setInvestors(data?.investors ?? []);
      } catch (e) {
        if (cancelled) return;
        setError(e);
      } finally {
        if (cancelled) return;
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function onDelete(investor) {
    const confirmed = window.confirm(`Delete ${investor.firstName} ${investor.lastName}? Click OK to confirm.`);
    if (!confirmed) return;

    const csrfToken = getCsrfToken();
    if (!csrfToken) {
      setError(new Error('Missing CSRF token meta tag. This page must be served by Rails (localhost:3000) to delete.'));
      return;
    }

    try {
      setDeletingId(investor.id);
      setError(null);

      const res = await fetch(`/investors/${investor.id}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        credentials: 'same-origin',
      });

      const text = await res.text();
      let json;
      try {
        json = text ? JSON.parse(text) : null;
      } catch (_e) {
        json = null;
      }

      if (!res.ok) {
        const message = json?.error || json?.message || text?.slice(0, 300) || `HTTP ${res.status}`;
        throw new Error(message);
      }

      setInvestors((prev) => prev.filter((row) => row.id !== investor.id));
    } catch (e) {
      setError(e);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="page page--wide">
      <div className="page__header">
        <h1 className="page__title">Investors</h1>

        <a href="/investors/new" className="btn btn--primary">
          Add Investor
        </a>
      </div>

      {loading && (
        <div className="page__status">Loading investors…</div>
      )}

      {error && (
        <div className="alert alert--error">
          {error.message}
        </div>
      )}

      {!loading && !error && (
        <div className="card card--table">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Location</th>
                <th>Downloads</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {investors.length === 0 ? (
                <tr>
                  <td colSpan={5} className="table__empty">No investors found.</td>
                </tr>
              ) : (
                investors.map((investor) => (
                  <tr key={investor.id}>
                    <td className="table__primary">{investor.firstName} {investor.lastName}</td>
                    <td>{investor.phoneNumber}</td>
                    <td>{investor.streetAddress}<br /> {investor.city}, {investor.state} {investor.zipCode}</td>
                    <td>{investor.documentsAttached ? 'Added' : 'Not added'}</td>
                    <td>
                      <div className="btn-row">
                        <a href={`/investors/${investor.id}`} className="btn btn--secondary btn--sm">
                          View
                        </a>
                        <a href={`/investors/${investor.id}/edit`} className="btn btn--secondary btn--sm">
                          Edit
                        </a>
                        <button
                          type="button"
                          onClick={() => onDelete(investor)}
                          disabled={deletingId === investor.id}
                          className="btn btn--danger btn--sm"
                        >
                          {deletingId === investor.id ? 'Deleting…' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
