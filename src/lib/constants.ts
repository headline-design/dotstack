export const SIWS_URI =
  process.env.NEXT_PUBLIC_ENV === 'production'
    ? 'https:/next-siws.vercel.app'
    : process.env.NEXT_PUBLIC_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://next-siws.vercel.app';

export const SIWS_HOSTNAME =
  process.env.NEXT_PUBLIC_ENV === 'production'
    ? 'next-siws.vercel.app'
    : process.env.NEXT_PUBLIC_ENV === 'development'
      ? 'localhost:3000'
      : '192.168.1.160';