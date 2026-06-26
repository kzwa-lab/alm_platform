/**
 * Format a number as Ghana Cedi (GHS) or other currency
 */
export declare function formatCurrency(value: number, currencyCode?: string, decimals?: number): string;
/**
 * Format a number as percentage
 */
export declare function formatPercent(value: number, decimals?: number): string;
/**
 * Format a number as basis points
 */
export declare function formatBasisPoints(value: number): string;
/**
 * Format a date for Ghana context (GMT)
 */
export declare function formatDate(date: Date | string, format?: 'short' | 'long' | 'iso'): string;
/**
 * Format a datetime for Ghana context
 */
export declare function formatDateTime(date: Date | string): string;
/**
 * Get traffic light color from status
 */
export declare function getStatusColor(status: 'green' | 'amber' | 'red' | 'neutral'): string;
/**
 * Get traffic light background color from status
 */
export declare function getStatusBgColor(status: 'green' | 'amber' | 'red' | 'neutral'): string;
/**
 * Determine status from value and thresholds
 */
export declare function determineStatus(value: number, greenThreshold: number, amberThreshold: number, redThreshold: number, higherIsBetter?: boolean): 'green' | 'amber' | 'red' | 'neutral';
/**
 * Format a large number with K/M/B suffix
 */
export declare function formatCompactNumber(value: number, currencyCode?: string): string;
/**
 * Generate a UUID v4
 */
export declare function generateId(): string;
/**
 * Deep clone an object
 */
export declare function deepClone<T>(obj: T): T;
/**
 * Sleep for a given number of milliseconds
 */
export declare function sleep(ms: number): Promise<void>;
/**
 * Check if a value is within a range (inclusive)
 */
export declare function inRange(value: number, min: number, max: number): boolean;
/**
 * Calculate percentage change
 */
export declare function percentChange(current: number, previous: number): number;
/**
 * Round to a given number of decimal places
 */
export declare function round(value: number, decimals: number): number;
//# sourceMappingURL=index.d.ts.map