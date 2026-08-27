import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format numbers as United Arab Emirates Dirhams (AED)
 * e.g. 24500 -> "AED 24,500" or "AED 24,500.00"
 */
export function formatAED(amount: number, includeDecimals = false): string {
  const formatted = new Intl.NumberFormat('en-AE', {
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(amount);
  return `AED ${formatted}`;
}

/**
 * Calculate 5% UAE standard VAT
 */
export function calculateUAEVAT(subtotal: number): number {
  return Math.round(subtotal * 0.05 * 100) / 100;
}

/**
 * Format date for UAE business context (e.g. "24 Aug 2026")
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Relative time calculation (e.g. "2 hours ago", "Yesterday")
 */
export function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) {
      const diffMins = Math.max(1, Math.floor(diffMs / (1000 * 60)));
      return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    }
    if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    }
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return formatDate(dateString);
  } catch {
    return dateString;
  }
}

/**
 * Format UAE Phone Numbers nicely
 * e.g. +971501234567 -> "+971 50 123 4567"
 */
export function formatUAEPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('971') && cleaned.length >= 11) {
    const code = cleaned.slice(0, 3);
    const operator = cleaned.slice(3, 5);
    const part1 = cleaned.slice(5, 8);
    const part2 = cleaned.slice(8);
    return `+${code} ${operator} ${part1} ${part2}`;
  }
  return phone;
}
