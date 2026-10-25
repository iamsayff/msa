/**
 * Official AMU Faculties and Halls of Residence
 */
export const AMU_FACULTIES = [
  "Faculty of Agricultural Sciences & Theology",
  "Faculty of Arts",
  "Faculty of Commerce",
  "Faculty of Engineering & Technology",
  "Faculty of Law",
  "Faculty of Life Sciences",
  "Faculty of Management Studies & Research and International Studies",
  "Faculty of Medicine",
  "Faculty of Science",
  "Faculty of Social Sciences",
  "Faculty of Unani Medicine",
  "Other",
] as const;

export type AMUFaculty = typeof AMU_FACULTIES[number];

export const AMU_HALLS = [
  "Aftab Hall",
  "Hadi Hasan Hall",
  "Mohammad Habib Hall",
  "Mohsinul Mulk Hall",
  "Nadeem Tarin Hall",
  "Ross Masood Hall",
  "Sir Shah Sulaiman Hall",
  "Sir Syed Hall (North)",
  "Sir Syed Hall (South)",
  "Sir Ziauddin Hall",
  "Viqarul Mulk Hall",
  "Dr. B. R. Ambedkar Hall",
  "Abdullah Hall",
  "Indira Gandhi Hall",
  "Sarojini Naidu Hall",
  "Begum Sultan Jahan Hall",
  "Bibi Fatima Hall",
  "Begum Azzezun Nisa Hall",
  "Non-Resident Students Centre",
  "Allama Iqbal Hall Boarding House",
] as const;

export type AMUHall = typeof AMU_HALLS[number];
