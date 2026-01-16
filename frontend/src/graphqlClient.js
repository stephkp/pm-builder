export async function graphqlRequest(query, variables = {}) {
  const res = await fetch('/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    credentials: 'include', // keeps cookies if you later add auth
    body: JSON.stringify({ query, variables }),
  });

  const text = await res.text();
  if (!text) {
    throw new Error(`GraphQL request failed: empty response (HTTP ${res.status} ${res.statusText})`);
  }

  let json;
  try {
    json = JSON.parse(text);
  } catch (e) {
    const snippet = text.slice(0, 300);
    throw new Error(`GraphQL request failed: non-JSON response (HTTP ${res.status} ${res.statusText}): ${snippet}`);
  }

  if (!res.ok) {
    const message = json?.error?.message || json?.errors?.map((err) => err.message).join(', ') || `HTTP ${res.status}`;
    throw new Error(`GraphQL request failed: ${message}`);
  }

  if (json.errors) throw new Error(json.errors.map(e => e.message).join(', '));
  return json.data;
}