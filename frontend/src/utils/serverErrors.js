function isSsnErrorMessage(msg) {
  const s = String(msg || '').toLowerCase();
  return s.includes('ssn') || s.startsWith('ssn ') || s.startsWith('ssn');
}

function fieldForErrorMessage(msg) {
  const s = String(msg || '').toLowerCase();
  if (s.startsWith('first name')) return 'first_name';
  if (s.startsWith('last name')) return 'last_name';
  if (s.startsWith('date of birth')) return 'date_of_birth';
  if (s.startsWith('phone number') || s.startsWith('phone')) return 'phone_number';
  if (s.startsWith('street address') || s.startsWith('street')) return 'street_address';
  if (s.startsWith('city')) return 'city';
  if (s.startsWith('state')) return 'state';
  if (s.startsWith('zip code') || s.startsWith('zip')) return 'zip_code';
  if (s.startsWith('documents') || s.includes('documents')) return 'documents';
  if (isSsnErrorMessage(msg)) return 'ssn';
  return null;
}

export function splitServerErrors(errs) {
  const fieldErrors = {};
  const otherErrors = [];

  for (const msg of errs) {
    const key = fieldForErrorMessage(msg);
    if (key) {
      if (!fieldErrors[key]) fieldErrors[key] = msg;
    } else {
      otherErrors.push(msg);
    }
  }

  return { fieldErrors, otherErrors };
}
