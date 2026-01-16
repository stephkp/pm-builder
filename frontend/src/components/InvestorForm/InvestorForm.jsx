import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { graphqlRequest } from '../../graphqlClient';
import { INVESTOR_QUERY } from '../../constants/queries';
import { US_STATES } from '../../constants/usStates';
import { FIELD_VALIDATIONS } from '../../constants/formFields';
import { getCsrfToken } from '../../utils/csrf';
import { readResponseBody } from '../../utils/http';
import { buildInvestorFormData } from '../../utils/investorFormData';
import { splitServerErrors } from '../../utils/serverErrors';
import { formatSsn } from '../../utils/validators';

import './InvestorForm.scss';

export default function InvestorForm({ mode, investorId }) {
  const isEdit = mode === 'edit';

  const [loading, setLoading] = useState(isEdit);
  const [submitError, setSubmitError] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  const documentsRef = useRef(null);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError: setFieldError,
    clearErrors,
    setFocus,
  } = useForm({
    defaultValues: {
      first_name: '',
      last_name: '',
      date_of_birth: '',
      phone_number: '',
      street_address: '',
      city: '',
      state: '',
      zip_code: '',
      ssn: '',
    },
    shouldFocusError: true,
  });

  function focusFirstInvalidField(errsByField) {
    const order = [
      'first_name',
      'last_name',
      'date_of_birth',
      'ssn',
      'phone_number',
      'street_address',
      'city',
      'state',
      'zip_code',
      'documents',
    ];

    for (const key of order) {
      if (!errsByField[key]) continue;
      if (key === 'documents') {
        requestAnimationFrame(() => documentsRef.current?.focus());
        return;
      }

      setFocus(key);
      return;
    }
  }

  const [documents, setDocuments] = useState([]);
  const [existingDocuments, setExistingDocuments] = useState([]);

  async function handleDeleteDocument(documentId) {
    try {
      const csrfToken = getCsrfToken();
      if (!csrfToken) {
        throw new Error('Missing CSRF token');
      }

      const response = await fetch(`/investors/${investorId}/documents/${documentId}`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-Token': csrfToken,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'same-origin',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to delete document');
      }

      // Remove from local state
      setExistingDocuments(prev => prev.filter(doc => doc.id !== documentId));
    } catch (error) {
      setSubmitError(error);
    }
  }

  const title = useMemo(() => {
    if (isEdit) return 'Edit Investor';
    return 'Add New Investor';
  }, [isEdit]);

  useEffect(() => {
    if (!isEdit) return;

    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setSubmitError(null);
        setValidationErrors([]);
        clearErrors();

        const data = await graphqlRequest(INVESTOR_QUERY, { id: investorId });
        if (cancelled) return;

        const inv = data?.investor;
        if (!inv) {
          setSubmitError(new Error('Investor not found.'));
          return;
        }

        // Set existing documents
        const docs = inv.documents || [];
        setExistingDocuments(docs);

        reset({
          first_name: inv.firstName ?? '',
          last_name: inv.lastName ?? '',
          date_of_birth: inv.dateOfBirth ?? '',
          phone_number: inv.phoneNumber ?? '',
          street_address: inv.streetAddress ?? '',
          city: inv.city ?? '',
          state: inv.state ?? '',
          zip_code: inv.zipCode ?? '',
          ssn: formatSsn(inv.ssn ?? ''),
        });
      } catch (e) {
        if (cancelled) return;
        setSubmitError(e);
      } finally {
        if (cancelled) return;
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [isEdit, investorId]);

  function focusFirstInvalidField(errsByField) {
    const order = [
      'first_name',
      'last_name',
      'date_of_birth',
      'ssn',
      'phone_number',
      'street_address',
      'city',
      'state',
      'zip_code',
      'documents',
    ];

    for (const key of order) {
      if (!errsByField[key]) continue;
      if (key === 'documents') {
        requestAnimationFrame(() => documentsRef.current?.focus());
        return;
      }

      setFocus(key);
      return;
    }
  }

  async function onSubmit(values) {
    setSubmitError(null);
    setValidationErrors([]);
    clearErrors();

    if (!isEdit && (!Array.isArray(documents) || documents.length === 0)) {
      setFieldError('documents', { type: 'manual', message: 'Please attach at least 1 document.' });
      focusFirstInvalidField({ documents: true });
      return;
    }

    try {
      const csrfToken = getCsrfToken();
      if (!csrfToken) {
        throw new Error('Missing CSRF token meta tag. This form must be rendered from Rails (localhost:3000) for POST/PATCH to work.');
      }

      const fd = buildInvestorFormData(values, documents);
      const url = isEdit ? `/investors/${investorId}` : '/investors';
      const method = isEdit ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        body: fd,
        headers: {
          Accept: 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        credentials: 'same-origin',
      });

      const { text, json } = await readResponseBody(response);

      if (!response.ok) {
        const errs = json?.errors;
        if (Array.isArray(errs) && errs.length > 0) {
          const { fieldErrors, otherErrors } = splitServerErrors(errs);
          setValidationErrors(otherErrors);
          if (Object.keys(fieldErrors).length > 0) {
            for (const [key, msg] of Object.entries(fieldErrors)) {
              setFieldError(key, { type: 'server', message: msg });
            }
            focusFirstInvalidField(fieldErrors);
          }

          return;
        }

        const message = json?.error || json?.message || text?.slice(0, 300) || `HTTP ${response.status}`;
        throw new Error(message);
      }

      window.location.href = '/investors';
    } catch (e2) {
      setSubmitError(e2);
    }
  }

  if (loading) {
    return (
      <section className="page page--narrow">
        <div className="page__status">Loading…</div>
      </section>
    );
  }

  return (
    <section className="page page--narrow">
      <div className="page__header">
        <h2 className="page__title">{title}</h2>
        <a href="/investors" className="btn btn--secondary btn--sm">Back to Investors</a>
      </div>

      <div className="card">
        {submitError && (
          <div className="alert alert--error" role="alert">
            {submitError.message}
          </div>
        )}

        {validationErrors.length > 0 && (
          <div className="alert alert--error" role="alert">
            <div>
              {validationErrors.length} error{validationErrors.length === 1 ? '' : 's'} prohibited this investor from being saved:
            </div>
            <ul className="alert__list">
              {validationErrors.map((msg, idx) => (
                <li key={idx}>{msg}</li>
              ))}
            </ul>
          </div>
        )}

        <form className="form" noValidate onSubmit={handleSubmit(onSubmit)}>
          <div className="form__grid form__grid--2">
            <div className="form__field">
              <label className="form__label" htmlFor="first_name">First Name</label>
              <input
                id="first_name"
                name="first_name"
                className={errors.first_name ? 'form__input form__input--error' : 'form__input'}
                required
                {...register('first_name', {
                  ...FIELD_VALIDATIONS.first_name,
                  onChange: (e) => {
                    e.target.value = e.target.value.trimStart();
                    FIELD_VALIDATIONS.first_name?.onChange?.(e);
                  }
                })}
              />
              {errors.first_name?.message && (
                <div className="form__error">{errors.first_name.message}</div>
              )}
            </div>
            <div className="form__field">
              <label className="form__label" htmlFor="last_name">Last Name</label>
              <input
                id="last_name"
                name="last_name"
                className={errors.last_name ? 'form__input form__input--error' : 'form__input'}
                required
                {...register('last_name', {
                  ...FIELD_VALIDATIONS.last_name,
                  onChange: (e) => {
                    e.target.value = e.target.value.trimStart();
                    FIELD_VALIDATIONS.last_name?.onChange?.(e);
                  }
                })}
              />
              {errors.last_name?.message && (
                <div className="form__error">{errors.last_name.message}</div>
              )}
            </div>
          </div>

          <div className="form__grid form__grid--2">
            <div className="form__field">
              <label className="form__label" htmlFor="date_of_birth">Date of Birth</label>
              <input
                id="date_of_birth"
                name="date_of_birth"
                type="date"
                className={errors.date_of_birth ? 'form__input form__input--error' : 'form__input'}
                required
                {...register('date_of_birth', FIELD_VALIDATIONS.date_of_birth)}
              />
              {errors.date_of_birth?.message && (
                <div className="form__error">{errors.date_of_birth.message}</div>
              )}
            </div>
            <div className="form__field">
              <label className="form__label" htmlFor="ssn">Social Security Number</label>
              <Controller
                control={control}
                name="ssn"
                rules={FIELD_VALIDATIONS.ssn}
                render={({ field }) => (
                  <input
                    id="ssn"
                    name="ssn"
                    placeholder="123-45-6789"
                    inputMode="numeric"
                    maxLength={11}
                    pattern="\d{3}-\d{2}-\d{4}"
                    className={errors.ssn ? 'form__input form__input--error' : 'form__input'}
                    required
                    value={field.value}
                    onChange={(e) => field.onChange(formatSsn(e.target.value))}
                    onBlur={field.onBlur}
                    ref={field.ref}
                  />
                )}
              />
              {errors.ssn?.message && (
                <div className="form__error">{errors.ssn.message}</div>
              )}
            </div>
          </div>

          <div className="form__grid form__grid--2">
            <div className="form__field">
              <label className="form__label" htmlFor="phone_number">Phone Number</label>
              <Controller
                control={control}
                name="phone_number"
                rules={FIELD_VALIDATIONS.phone_number}
                render={({ field }) => (
                  <input
                    id="phone_number"
                    name="phone_number"
                    type="tel"
                    inputMode="tel"
                    placeholder="(123) 456-7890"
                    maxLength={14}
                    className={errors.phone_number ? 'form__input form__input--error' : 'form__input'}
                    required
                    value={field.value}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                      let formatted = digits;
                      if (digits.length >= 6) {
                        formatted = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
                      } else if (digits.length >= 3) {
                        formatted = `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
                      }
                      field.onChange(formatted);
                    }}
                    onBlur={field.onBlur}
                    ref={field.ref}
                  />
                )}
              />
              {errors.phone_number?.message && (
                <div className="form__error">{errors.phone_number.message}</div>
              )}
            </div>
            <div className="form__field">
              <label className="form__label" htmlFor="street_address">Street Address</label>
              <input
                id="street_address"
                name="street_address"
                className={errors.street_address ? 'form__input form__input--error' : 'form__input'}
                required
                {...register('street_address', {
                  ...FIELD_VALIDATIONS.street_address,
                  onChange: (e) => {
                    e.target.value = e.target.value.trimStart();
                    FIELD_VALIDATIONS.street_address?.onChange?.(e);
                  }
                })}
              />
              {errors.street_address?.message && (
                <div className="form__error">{errors.street_address.message}</div>
              )}
            </div>
          </div>

          <div className="form__grid form__grid--3">
            <div className="form__field">
              <label className="form__label" htmlFor="city">City</label>
              <input
                id="city"
                name="city"
                className={errors.city ? 'form__input form__input--error' : 'form__input'}
                required
                {...register('city', {
                  ...FIELD_VALIDATIONS.city,
                  onChange: (e) => {
                    e.target.value = e.target.value.trimStart();
                    FIELD_VALIDATIONS.city?.onChange?.(e);
                  }
                })}
              />
              {errors.city?.message && (
                <div className="form__error">{errors.city.message}</div>
              )}
            </div>
            <div className="form__field">
              <label className="form__label" htmlFor="state">State</label>
              <select
                id="state"
                name="state"
                className={errors.state ? 'form__input form__input--error' : 'form__input form__select'}
                required
                {...register('state', FIELD_VALIDATIONS.state)}
              >
                <option value="">Select a state</option>
                {US_STATES.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.name} ({s.code})
                  </option>
                ))}
              </select>
              {errors.state?.message && (
                <div className="form__error">{errors.state.message}</div>
              )}
            </div>
            <div className="form__field">
              <label className="form__label" htmlFor="zip_code">Zip Code</label>
              <input
                id="zip_code"
                name="zip_code"
                className={errors.zip_code ? 'form__input form__input--error' : 'form__input'}
                required
                {...register('zip_code', {
                  ...FIELD_VALIDATIONS.zip_code,
                  onChange: (e) => {
                    e.target.value = e.target.value.trimStart();
                    FIELD_VALIDATIONS.zip_code?.onChange?.(e);
                  }
                })}
              />
              {errors.zip_code?.message && (
                <div className="form__error">{errors.zip_code.message}</div>
              )}
            </div>
          </div>

          <div className="form__field">
            <label className="form__label" htmlFor="documents">Documents</label>

            {/* Show existing documents in edit mode */}
            {isEdit && existingDocuments.length > 0 && (
              <div className="existing-documents">
                <h4 className="existing-documents__title">Uploaded Files:</h4>
                <ul className="existing-documents__list">
                  {existingDocuments.map((doc) => (
                    <li key={doc.id} className="existing-documents__item">
                      <a
                        href={doc.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="existing-documents__link"
                      >
                        {doc.filename}
                      </a>
                      <span className="existing-documents__size">
                        ({Math.round(doc.byteSize / 1024)}KB)
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteDocument(doc.id)}
                        className="existing-documents__delete"
                        title="Delete document"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <input
              id="documents"
              name="documents"
              type="file"
              className={errors.documents ? 'form__input form__input--documents form__input--error' : 'form__input form__input--documents'}
              multiple
              accept=".jpg,.jpeg,.png,.doc,.docx,.pdf,.txt,.csv"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                const maxSize = 3 * 1024 * 1024; // 3MB
                const allowedTypes = ['.jpg', '.jpeg', '.png', '.doc', '.docx', '.pdf', '.txt', '.csv'];

                // Check file size
                const oversizedFiles = files.filter(file => file.size > maxSize);
                if (oversizedFiles.length > 0) {
                  const fileNames = oversizedFiles.map(f => f.name).join(', ');
                  setFieldError('documents', {
                    type: 'manual',
                    message: `Files larger than 3MB are not allowed: ${fileNames}`
                  });
                  e.target.value = ''; // Clear the input
                  setDocuments([]);
                  return;
                }

                // Check file type
                const invalidFiles = files.filter(file => {
                  const extension = '.' + file.name.split('.').pop().toLowerCase();
                  return !allowedTypes.includes(extension);
                });

                if (invalidFiles.length > 0) {
                  const fileNames = invalidFiles.map(f => f.name).join(', ');
                  setFieldError('documents', {
                    type: 'manual',
                    message: `Only JPG, PNG, DOC, DOCX, PDF, TXT, and CSV files are allowed.\nInvalid files: ${fileNames}`
                  });
                  e.target.value = ''; // Clear the input
                  setDocuments([]);
                  return;
                }

                setDocuments(files);
                clearErrors('documents');
              }}
              ref={documentsRef}
            />
            <div className="form__help">
              {isEdit ? 'Add more documents (optional)' : 'Attach at least 1 file.'}
            </div>
            {errors.documents?.message && (
              <div className="form__error">{errors.documents.message}</div>
            )}
          </div>

          <div className="form__actions">
            <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : 'Save Changes'}
            </button>
            <a href="/investors" className="btn btn--secondary">
              Cancel
            </a>
          </div>
        </form>
      </div>
    </section>
  );
 }
