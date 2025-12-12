import type { Athlete } from '../../src/types.js';

export const mockAthlete: Athlete = {
  id: 'i12345',
  name: 'Test Athlete',
  email: 'test@example.com',
  sex: 'male',
  dob: '1990-01-01',
  weight: 70,
  restingHR: 50,
  maxHR: 190,
  lthr: 165,
  ftp: 250,
  ftpWattsPerKg: 3.57,
  w1: 1200,
  w2: 800,
  w3: 600,
  w4: 400,
  w5: 320,
  w6: 280,
  pMax: 1500,
  created: '2023-01-01T00:00:00Z',
  updated: '2024-01-15T10:00:00Z',
  icu_ftp: 255,
  icu_w1: 1220,
  icu_w2: 810,
  icu_w3: 610,
  icu_w4: 410,
  icu_w5: 325,
  icu_w6: 285,
  icu_pm: 1520,
};

export const mockAthleteUpdate: Partial<Athlete> = {
  ftp: 260,
  weight: 69.5,
  restingHR: 48,
};

export const mockUpdatedAthlete: Athlete = {
  ...mockAthlete,
  ...mockAthleteUpdate,
  updated: '2024-01-16T10:00:00Z',
};
