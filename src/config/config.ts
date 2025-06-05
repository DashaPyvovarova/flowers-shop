import * as process from 'process';

export const config = {
  env: {
    databaseUrl: process.env.DATABASE_URL,
    apiEndpoint: process.env.NEXT_PUBLIC_API_ENDPOINT,
    imagekit: {
      urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    },
  },
};
