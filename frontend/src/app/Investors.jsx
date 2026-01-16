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
      ssn
    }
  }
`;

export default function Investors() {
  const [investors, setInvestors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <section className="section-container">
      <div className="section-header new-investor__header">
        <div className="section-header__title new-investor__title">
          <h1>Investors</h1>
        </div>
      </div>

      <div className="mt-4">
        <a href="/investors/new" className="btn btn-primary">Add Investor</a>
      </div>

      {loading && (
        <div className="mt-4">
          <p>Loading investors…</p>
        </div>
      )}

      {error && (
        <div className="mt-4 alert alert-danger">
          {error.message}
        </div>
      )}

      {!loading && !error && (
        <div className="mt-4 table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Location</th>
                <th>SSN</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {investors.length === 0 ? (
                <tr>
                  <td colSpan={5}>No investors found.</td>
                </tr>
              ) : (
                investors.map((inv) => (
                  <tr key={inv.id}>
                    <td>{inv.firstName} {inv.lastName}</td>
                    <td>{inv.phoneNumber}</td>
                    <td>{inv.streetAddress}, {inv.city}, {inv.state} {inv.zipCode}</td>
                    <td>{inv.ssn}</td>
                    <td>
                      <div className="btn-group" role="group">
                        <a href={`/investors/${inv.id}`} className="btn btn-sm btn-outline-primary">View</a>
                        <a href={`/investors/${inv.id}/edit`} className="btn btn-sm btn-outline-secondary">Edit</a>
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