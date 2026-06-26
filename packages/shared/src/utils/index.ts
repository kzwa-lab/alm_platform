import { CURRENCIES } from '../constants/index.js';

/**
 * Format a number as Ghana Cedi (GHS) or other currency
 */
export function formatCurrency(value: number, currencyCode: string = 'GHS', decimals: number = 2): string {
  const currency = CURRENCIES[currencyCode as keyof typeof CURRENCIES];
  const symbol = currency?.symbol || currencyCode;
  const formatted = new Intl.NumberFormat('en-GH', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
  return `${symbol} ${formatted}`;
}

/**
 * Format a number as percentage
 */
export function formatPercent(value: number, decimals: number = 2): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Format a number as basis points
 */
export function formatBasisPoints(value: number): string {
  return `${(value * 10000).toFixed(0)}bp`;
}

/**
 * Format a date for Ghana context (GMT)
 */
export function formatDate(date: Date | string, format: 'short' | 'long' | 'iso' = 'short'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  switch (format) {
    case 'short':
      return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'GMT' });
    case 'long':
      return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'GMT' });
    case 'iso':
      return d.toISOString().split('T')[0];
    default:
      return d.toLocaleDateString('en-GB', { timeZone: 'GMT' });
  }
}

/**
 * Format a datetime for Ghana context
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'GMT',
  });
}

/**
 * Get traffic light color from status
 */
export function getStatusColor(status: 'green' | 'amber' | 'red' | 'neutral'): string {
  switch (status) {
    case 'green':
      return '#10B981'; // emerald-500
    case 'amber':
      return '#F59E0B'; // amber-500
    case 'red':
      return '#EF4444'; // red-500
    case 'neutral':
    default:
      return '#6B7280'; // gray-500
  }
}

/**
 * Get traffic light background color from status
 */
export function getStatusBgColor(status: 'green' | 'amber' | 'red' | 'neutral'): string {
  switch (status) {
    case 'green':
      return '#D1FAE5'; // emerald-100
    case 'amber':
      return '#FEF3C7'; // amber-100
    case 'red':
      return '#FEE2E2'; // red-100
    case 'neutral':
    default:
      return '#F3F4F6'; // gray-100
  }
}

/**
 * Determine status from value and thresholds
 */
export function determineStatus(
  value: number,
  greenThreshold: number,
  amberThreshold: number,
  redThreshold: number,
  higherIsBetter: boolean = true
): 'green' | 'amber' | 'red' | 'neutral' {
  if (higherIsBetter) {
    if (value >= greenThreshold) return 'green';
    if (value >= amberThreshold) return 'amber';
    if (value <= redThreshold) return 'red';
    return 'neutral';
  } else {
    if (value <= greenThreshold) return 'green';
    if (value <= amberThreshold) return 'amber';
    if (value >= redThreshold) return 'red';
    return 'neutral';
  }
}

/**
 * Format a large number with K/M/B suffix
 */
export function formatCompactNumber(value: number, currencyCode: string = 'GHS'): string {
  const currency = CURRENCIES[currencyCode as keyof typeof CURRENCIES];
  const symbol = currency?.symbol || currencyCode;
  const formatter = new Intl.NumberFormat('en-GH', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1,
  });
  return `${symbol} ${formatter.format(value)}`;
}

/**
 * Generate a UUID v4
 */
export function generateId(): string {
  return crypto.randomUUID();
}

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Sleep for a given number of milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Check if a value is within a range (inclusive)
 */
export function inRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * Calculate percentage change
 */
export function percentChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return (current - previous) / previous;
}

/**
 * Round to a given number of decimal places
 */
export function round(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}
