import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fileSizeConverter = (size: number) => {
  if (size >= 1024) {
    size = size / 1024;
    return size >= 1024 ? `${(size / 1024).toFixed(1)} MB` : `${size.toFixed(1)} KB`;
  }
  return `${size} B`;
};

export const ellipsizeText = (text: string, maxlimit: number) => {
  if (text) {
    if (text.length > maxlimit) {
      return `${text.substring(0, maxlimit - 3)}...`;
    }
    return text;
  }
  return '';
};

export const hashTagText = (text: string) => {
  if (text) {
    return `#${text.replace(' ', '')}`;
  }
  return '';
};

export const deHyphenateText = (text: string) => {
  if (text) {
    return `${text.replace('-', ' ')}`;
  }
  return '';
};

export const CopyToClipboard = (text: string | number) => {
  navigator.clipboard.writeText(String(text));
};

/**
 * Converts a base64 string to a data URL that can be used as the src for an image tag
 * @param base64String The base64 encoded string (without the data URL prefix)
 * @param mimeType Optional mime type, defaults to 'image/png'
 * @returns A complete data URL that can be used in an img src attribute
 */
export const base64ToImageSrc = (base64String: string, mimeType = 'image/png'): string => {
  if (base64String.startsWith('data:')) {
    return base64String;
  }
  return `data:${mimeType};base64,${base64String}`;
};

export const getInitials = (name: string | null | undefined, fallback: string = '?'): string => {
  if (!name || typeof name !== 'string') return fallback;

  if (name.includes('@')) {
    const emailPrefix = name.split('@')[0];
    if (emailPrefix) {
      return emailPrefix[0].toUpperCase();
    }
  }

  const initials = name
    .trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .slice(0, 2)
    .map(v => v && v[0].toUpperCase())
    .filter(Boolean)
    .join('');

  return initials || fallback;
};

export const buildQueryParams = <T extends Record<string, unknown>>(
  filters: T,
  excludeValues: string[] = ['all']
) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (excludeValues.includes(value as string)) return;
      params.append(key, value.toString());
    }
  });
  return params.toString();
};
