import * as process from 'process';

export const config = {
  env: {
    databaseUrl: process.env.DATABASE_URL,
    apiEndpoint: process.env.NEXT_PUBLIC_API_ENDPOINT,
  },
};
