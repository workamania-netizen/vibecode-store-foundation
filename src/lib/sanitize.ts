// ---------------------------------------------------------------------------
// Input sanitization utilities
// ---------------------------------------------------------------------------

/**
 * Strips HTML tags from a string.
 */
export function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, "");
}

/**
 * Sanitizes a single field: strips HTML, trims whitespace, enforces max length.
 */
export function sanitizeField(input: string, maxLength: number): string {
  return stripHtml(input).trim().slice(0, maxLength);
}

/**
 * Validates an email address format.
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
