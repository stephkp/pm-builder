import { isAtLeast18, isValidPhone, isValidSsn, isValidZip } from '../utils/validators';

export const FIELD_VALIDATIONS = {
  first_name: {
    required: 'First name is required.',
  },
  last_name: {
    required: 'Last name is required.',
  },
  date_of_birth: {
    required: 'Date of birth is required.',
    validate: (value) => isAtLeast18(value) || 'Investor must be at least 18 years old.',
  },
  ssn: {
    required: 'SSN is required.',
    validate: (value) => isValidSsn(value) || 'SSN must be in the format 123-45-6789.',
  },
  phone_number: {
    required: 'Phone number is required.',
    validate: (value) => isValidPhone(value) || 'Phone number must be valid.',
  },
  street_address: {
    required: 'Street address is required.',
  },
  city: {
    required: 'City is required.',
  },
  state: {
    required: 'State is required.',
  },
  zip_code: {
    required: 'Zip code is required.',
    validate: (value) => isValidZip(value) || 'Zip code must be in the format 12345 or 12345-6789.',
  },
};