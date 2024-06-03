export const SIWS_URI =
  process.env.NEXT_PUBLIC_ENV === 'production'
    ? 'https://dotstack.xyz'
    : process.env.NEXT_PUBLIC_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://dotstack.xyz';

export const SIWS_HOSTNAME =
  process.env.NEXT_PUBLIC_ENV === 'production'
    ? 'dotstack.xyz'
    : process.env.NEXT_PUBLIC_ENV === 'development'
      ? 'localhost:3000'
      : '192.168.1.160';