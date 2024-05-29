import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { isEmpty, isNumber } from 'lodash';
import { customAlphabet } from 'nanoid';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
