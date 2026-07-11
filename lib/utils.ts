import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Normalizes an Algerian mobile number to E.164 (+213XXXXXXXXX).
 * Accepts input like "0551234567", "551234567", "+213551234567".
 */
export function toAlgerianE164(raw: string): string {
  const digits = raw.replace(/[^\d]/g, '');
  if (digits.startsWith('213')) return `+${digits}`;
  if (digits.startsWith('0')) return `+213${digits.slice(1)}`;
  return `+213${digits}`;
}

/** Validates a Algerian mobile number (5/6/7-prefixed, 9 digits after the leading 0/213). */
export function isValidAlgerianPhone(raw: string): boolean {
  const e164 = toAlgerianE164(raw);
  return /^\+213[5-7]\d{8}$/.test(e164);
}

export function formatPhoneDisplay(e164: string | null | undefined): string {
  if (!e164) return '—';
  const match = e164.match(/^\+213(\d{1})(\d{2})(\d{2})(\d{2})(\d{2})$/);
  if (!match) return e164;
  return `+213 ${match[1]} ${match[2]} ${match[3]} ${match[4]} ${match[5]}`;
}

export function formatDate(iso: string | null | undefined, locale: 'fr' | 'ar'): string {
  if (!iso) return '—';
  const date = new Date(iso);
  return date.toLocaleDateString(locale === 'ar' ? 'ar-DZ' : 'fr-DZ', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(iso: string | null | undefined, locale: 'fr' | 'ar'): string {
  if (!iso) return '—';
  const date = new Date(iso);
  return date.toLocaleString(locale === 'ar' ? 'ar-DZ' : 'fr-DZ', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function daysBetween(from: Date, to: Date): number {
  const ms = to.getTime() - from.getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

/** Generates a storage-safe random suffix to avoid filename collisions. */
export function randomSuffix(): string {
  return Math.random().toString(36).slice(2, 9);
}

/**
 * Extracts the 11-character video ID from any common YouTube URL shape:
 * watch?v=…, youtu.be/…, /embed/…, /shorts/…, /live/… — with or without
 * extra query params (playlist, share id, timestamp, etc).
 * Returns null when the URL isn't a recognizable YouTube link.
 */
export function getYouTubeVideoId(url: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }

  const host = parsed.hostname.replace(/^www\./, '').replace(/^m\./, '');

  if (host === 'youtu.be') {
    return parsed.pathname.slice(1).split('/')[0] || null;
  }

  if (host === 'youtube.com' || host === 'music.youtube.com') {
    if (parsed.pathname === '/watch') return parsed.searchParams.get('v');
    const match = parsed.pathname.match(/^\/(?:embed|shorts|live)\/([^/?]+)/);
    if (match) return match[1];
  }

  return null;
}

/** Turns a YouTube "t=1m30s" / "t=90" style timestamp param into whole seconds. */
function parseYouTubeStart(value: string | null): number {
  if (!value) return 0;
  if (/^\d+$/.test(value)) return parseInt(value, 10);
  const match = value.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/);
  if (!match) return 0;
  const [, h, m, s] = match;
  return Number(h || 0) * 3600 + Number(m || 0) * 60 + Number(s || 0);
}

/**
 * Converts any YouTube URL into an embeddable player URL for an <iframe>,
 * preserving the start time when the original link had one.
 * Returns null when the link isn't YouTube, so callers can fall back to
 * a plain <audio>/<video> tag for direct media file URLs.
 */
export function getYouTubeEmbedUrl(url: string): string | null {
  const id = getYouTubeVideoId(url);
  if (!id) return null;

  let start = 0;
  try {
    const parsed = new URL(url);
    start = parseYouTubeStart(parsed.searchParams.get('t') ?? parsed.searchParams.get('start'));
  } catch {
    // unreachable: getYouTubeVideoId already validated the URL
  }

  const embed = new URL(`https://www.youtube.com/embed/${id}`);
  embed.searchParams.set('rel', '0');
  if (start > 0) embed.searchParams.set('start', String(start));
  return embed.toString();
}

/** Builds a plain "watch on youtube.com" link from any YouTube URL shape. */
export function getYouTubeWatchUrl(url: string): string | null {
  const id = getYouTubeVideoId(url);
  return id ? `https://www.youtube.com/watch?v=${id}` : null;
}
