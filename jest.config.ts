import type { Config } from 'jest';

const config: Config = {
  clearMocks: true,
  extensionsToTreatAsEsm: ['.ts'],
  coverageProvider: 'v8',
};

export default config;
