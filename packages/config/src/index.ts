export const APP_CONFIG = {
  name: 'HealthBridge',
  sihProblemId: '26133',
  supportedLocales: ['en', 'hi', 'mr'] as const,
  defaultLocale: 'en' as const,
  roles: [
    'admin',
    'doctor',
    'nurse',
    'receptionist',
    'pharmacist',
    'labStaff',
  ] as const,
};
