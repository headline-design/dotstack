import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { isEmpty, isNumber } from 'lodash';
import { customAlphabet } from 'nanoid';
import { Metadata } from "next";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function constructMetadata({
  title = 'DotStack',
  description = 'The Next.js FullStack Template for Polkadot.',
  image = '/dotstack-og.png',
  icons = '/favicon.ico',
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@headline_crypto',
    },
    icons,
    metadataBase: new URL('https://dotstack.xyz'),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}


export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
}

/**
 * Rounds a number without unnecessary trailing zeros
 * @param num Number to round.
 * @param decimals Round the number to this many decimals or the default value if missing.
 * @return The rounded number or undefined it the param was undefined.
 * */
export function prettyRound(num, decimals = 3) {
  if (isNumber(num)) {
    return parseFloat(num.toFixed(decimals));
  }
  return num;
}


/**
 * Reading a value from local storage always return a string. It can lead to type problems in JavaScript. This method check whether the value is a boolean, number or string and returns the value as the proper type.
 * @param key The local storage key.
 * @param defaultValue Optional default value to return when the item is not found in the local storage.
 */
export function getLocalStorageItemSafely(key, defaultValue = undefined) {
  const value = localStorage.getItem(key);
  if (value !== null) {
    if (['true', 'false'].includes(value)) {
      return Boolean(value === 'true');
    } else if (isNumber(value)) {
      return +value;
    } else {
      return value;
    }
  } else if (defaultValue !== undefined) {
    return defaultValue;
  }
  return null;
}

export const tap = async <T>(value: T, cb: (value: T) => Promise<unknown>): Promise<T> => {
  await cb(value);
  return value;
};

export const getSearchParams = (url: string) => {
  // Create a params object
  let params = {} as Record<string, string>;

  new URL(url).searchParams.forEach(function (val, key) {
    params[key] = val;
  });

  return params;
};

export const nanoid = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  7,
); // 7-character random string


export function shortenAddress(str = '') {
  return `${str.slice(0, 6)}...${str.slice(str.length - 4)}`;
}

export function shorten(str: string, key?: any): string {
  if (!str) return str;
  let limit;
  if (typeof key === 'number') limit = key;
  if (key === 'symbol') limit = 6;
  if (key === 'name') limit = 64;
  if (key === 'choice') limit = 12;
  if (limit)
    return str.length > limit ? `${str.slice(0, limit).trim()}...` : str;
  return shortenAddress(str);
}

export function truncateMicroString(str, pad = 5) {
  if (str) {
    const { length } = str;
    const start = str.substring(0, pad);
    return `${start}...${str.substring(length - pad, length)}`;
  }
}
