export async function readResponseBody(response) {
  const text = await response.text();
  let json;
  try {
    json = text ? JSON.parse(text) : null;
  } catch (_e) {
    json = null;
  }

  return { text, json };
}
