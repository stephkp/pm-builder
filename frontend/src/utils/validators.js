export function formatSsn(raw) {
  const digits = String(raw || '').replace(/\D/g, '').slice(0, 9);
  const parts = [];

  if (digits.length <= 3) {
    parts.push(digits);
  } else if (digits.length <= 5) {
    parts.push(digits.slice(0, 3), digits.slice(3));
  } else {
    parts.push(digits.slice(0, 3), digits.slice(3, 5), digits.slice(5));
  }

  return parts.filter(Boolean).join('-');
}

export function isValidZip(zip) {
  return /^\d{5}(-\d{4})?$/.test(String(zip || '').trim());
}

export function isValidSsn(ssn) {
  return /^\d{3}-\d{2}-\d{4}$/.test(String(ssn || '').trim());
}

export function isValidPhone(phone) {
  const raw = String(phone || '').trim();
  if (!raw) return false;
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 10) return true;
  return /^\d{3}-\d{3}-\d{4}$/.test(raw) || /^\(\d{3}\)\s?\d{3}-?\d{4}$/.test(raw);
}

export function isAtLeast18(dateStr) {
  const s = String(dateStr || '').trim();
  if (!s) return false;

  const parts = s.split('-').map((n) => Number(n));
  const [year, month, day] = parts;
  if (!year || !month || !day) return false;

  const dob = new Date(Date.UTC(year, month - 1, day));
  const now = new Date();
  const cutoff = new Date(Date.UTC(now.getUTCFullYear() - 18, now.getUTCMonth(), now.getUTCDate()));
  return dob <= cutoff;
}
