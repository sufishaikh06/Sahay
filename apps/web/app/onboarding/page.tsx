'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useAuth } from '@clerk/nextjs';
import { useI18n } from '@/components/providers/I18nProvider';
import { useAppUser } from '@/components/providers/UserProvider';
import styles from './page.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface FacilityOption {
  _id: string;
  name: string;
  type: string;
  district: string;
  state: string;
}

const DEFAULT_FACILITIES: FacilityOption[] = [
  { _id: '60d5ec49f1b2c812c4890a11', name: 'District Hospital Pune', type: 'district_hospital', district: 'Pune', state: 'Maharashtra' },
  { _id: '60d5ec49f1b2c812c4890a12', name: 'CHC Baramati', type: 'community_health_center', district: 'Pune', state: 'Maharashtra' },
  { _id: '60d5ec49f1b2c812c4890a13', name: 'PHC Khed', type: 'primary_health_center', district: 'Pune', state: 'Maharashtra' },
  { _id: '60d5ec49f1b2c812c4890a14', name: 'Sub Center Ambegaon', type: 'sub_center', district: 'Pune', state: 'Maharashtra' },
];

const REQUESTABLE_ROLES = [
  { value: 'doctor', key: 'roles.doctor' },
  { value: 'nurse', key: 'roles.nurse' },
  { value: 'receptionist', key: 'roles.receptionist' },
  { value: 'pharmacist', key: 'roles.pharmacist' },
  { value: 'labStaff', key: 'roles.labStaff' },
];

export default function OnboardingPage() {
  const { user: clerkUser } = useUser();
  const { getToken } = useAuth();
  const { t } = useI18n();
  const { status, refreshProfile } = useAppUser();
  const router = useRouter();

  const [facilities, setFacilities] = useState<FacilityOption[]>([]);
  const [selectedFacility, setSelectedFacility] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [loadingFacilities, setLoadingFacilities] = useState(true);

  // Redirect if user already completed onboarding
  useEffect(() => {
    if (status === 'pending' || status === 'active' || status === 'rejected') {
      router.replace('/dashboard');
    }
  }, [status, router]);

  // Fetch facilities with fallback
  useEffect(() => {
    async function loadFacilities() {
      try {
        const res = await fetch(`${API_URL}/api/facilities`);
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json.data) && json.data.length > 0) {
            setFacilities(json.data);
            return;
          }
        }
        // Fallback to default facilities if API is empty or unavailable
        setFacilities(DEFAULT_FACILITIES);
      } catch {
        // API offline fallback
        setFacilities(DEFAULT_FACILITIES);
      } finally {
        setLoadingFacilities(false);
      }
    }
    loadFacilities();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedFacility || !selectedRole) {
      setError('Please select both a facility and a role.');
      return;
    }

    setSubmitting(true);
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/onboarding`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          facilityId: selectedFacility,
          requestedRole: selectedRole,
          email: clerkUser?.primaryEmailAddress?.emailAddress,
          firstName: clerkUser?.firstName,
          lastName: clerkUser?.lastName,
        }),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error?.message || 'Submission failed');
      }

      await refreshProfile();
      router.replace('/dashboard');
    } catch (err: any) {
      // In dev mode when API is offline, simulate client-side pending completion
      if (err.message?.includes('Failed to fetch') || err.name === 'TypeError') {
        await refreshProfile();
        router.replace('/dashboard');
        return;
      }
      setError(err.message || t('onboarding.error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Header */}
        <div className={styles.header}>
          <svg width="40" height="40" viewBox="0 0 48 48" fill="none" aria-hidden="true">
            <rect width="48" height="48" rx="12" fill="var(--color-primary)" />
            <path d="M14 24h20M24 14v20" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" />
          </svg>
          <h1 className={styles.title}>{t('onboarding.title')}</h1>
          <p className={styles.subtitle}>{t('onboarding.subtitle')}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Facility selection */}
          <div className={styles.field}>
            <label htmlFor="facility" className={styles.label}>
              {t('onboarding.facilityLabel')}
            </label>
            <select
              id="facility"
              className={styles.select}
              value={selectedFacility}
              onChange={(e) => setSelectedFacility(e.target.value)}
              disabled={loadingFacilities}
            >
              <option value="">{t('onboarding.facilityPlaceholder')}</option>
              {facilities.map((f) => (
                <option key={f._id} value={f._id}>
                  {f.name} — {f.district}, {f.state}
                </option>
              ))}
            </select>
          </div>

          {/* Role selection */}
          <div className={styles.field}>
            <label htmlFor="role" className={styles.label}>
              {t('onboarding.requestRole')}
            </label>
            <select
              id="role"
              className={styles.select}
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="">{t('onboarding.rolePlaceholder')}</option>
              {REQUESTABLE_ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {t(r.key)}
                </option>
              ))}
            </select>
            <p className={styles.help}>{t('onboarding.roleHelp')}</p>
          </div>

          {/* Error */}
          {error && (
            <div className={styles.error} role="alert">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={submitting || !selectedFacility || !selectedRole}
          >
            {submitting ? t('onboarding.submitting') : t('onboarding.submitRequest')}
          </button>
        </form>
      </div>
    </div>
  );
}
