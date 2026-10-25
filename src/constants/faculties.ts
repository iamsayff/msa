/**
 * Official AMU Faculties for Candidate Registration, Editing, and Search Filtering
 */
export const AMU_FACULTIES = [
  'Faculty of Agricultural Sciences & Theology',
  'Faculty of Arts',
  'Faculty of Commerce',
  'Faculty of Engineering & Technology',
  'Faculty of Law',
  'Faculty of Life Sciences',
  'Faculty of Management Studies & Research and International Studies',
  'Faculty of Medicine',
  'Faculty of Science',
  'Faculty of Social Sciences',
  'Faculty of Unani Medicine',
  'Other',
] as const;

export type AMUFaculty = typeof AMU_FACULTIES[number];
