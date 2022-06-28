export type DateRange = { dateStart: Date; dateEnd: Date };

/**
 * Format date for printing.
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString();
}
