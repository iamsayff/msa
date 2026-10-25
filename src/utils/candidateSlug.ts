import { Candidate } from '../types/election';

/**
 * Generates a clean URL slug from a candidate's name or custom slug property.
 * e.g., "Sharjeel Iqbal" -> "sharjeel-iqbal"
 */
export function getCandidateSlug(candidate: Candidate): string {
  if (candidate.slug && candidate.slug.trim()) {
    return candidate.slug.trim().toLowerCase();
  }
  if (!candidate.name) return candidate.id;

  const slugFromName = candidate.name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');

  return slugFromName || candidate.id;
}
