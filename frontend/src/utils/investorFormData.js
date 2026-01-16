export function buildInvestorFormData(values, documents) {
  const fd = new FormData();
  fd.append('investor[first_name]', values.first_name);
  fd.append('investor[last_name]', values.last_name);
  fd.append('investor[date_of_birth]', values.date_of_birth);
  fd.append('investor[phone_number]', values.phone_number);
  fd.append('investor[street_address]', values.street_address);
  fd.append('investor[city]', values.city);
  fd.append('investor[state]', values.state);
  fd.append('investor[zip_code]', values.zip_code);
  fd.append('investor[ssn]', values.ssn);

  for (const file of documents) {
    fd.append('investor[documents][]', file);
  }

  return fd;
}
