export type PersonaMode = 'student' | 'parent';
export type AppLanguage = 'en' | 'hi' | 'mr';

export type AcademicStream = '12th_science_pcm' | '12th_science_pcb' | '12th_commerce' | '12th_arts' | 'diploma_polytechnic';

export type CandidateCategory = 'Open' | 'OBC' | 'SC' | 'ST' | 'EWS' | 'TFWS' | 'VJNT' | 'SBC' | 'Minority';

export interface StudentProfile {
  name: string;
  stream: AcademicStream;
  boardPercentage: number;
  entranceExam: 'MHT-CET' | 'JEE-Main' | 'NEET' | 'Direct-Merit';
  entranceScore: number; // Percentile or marks
  category: CandidateCategory;
  annualIncome: number; // In INR Lakhs
  preferredBranch: string;
  preferredLocation: string;
  hasHostelRequirement: boolean;
  domicileState: string;
}

export interface RecommendedCourse {
  branchName: string;
  chance: 'High' | 'Moderate' | 'Ambitious';
  cutoffEstimate: string;
  avgPackage: string;
  highestPackage?: string;
  whyFit: string;
  keySkills?: string[];
}

export interface EvaluationResult {
  eligibilityVerdict: 'High Chance' | 'Moderate Chance' | 'Competitive / Ambitious';
  summary: string;
  recommendedBranches: RecommendedCourse[];
  applicableScholarships: {
    name: string;
    benefit: string;
    eligibilityNote: string;
  }[];
  strategicAdvice: string[];
}

export interface DocumentItem {
  id: string;
  title: string;
  marathiTitle?: string;
  hindiTitle?: string;
  categoryRelevance: CandidateCategory[];
  description: string;
  issuingAuthority: string;
  validityNotice?: string;
  isMandatory: boolean;
  status: 'pending' | 'verified' | 'in_progress';
  fileUploadedName?: string;
}

export interface ScholarshipInfo {
  id: string;
  name: string;
  marathiName: string;
  hindiName: string;
  provider: string;
  eligibility: string;
  tuitionWaiverPercent: number; // e.g. 50 or 100
  additionalAllowanceYearly?: number;
  incomeLimitLakhs: number;
  portalUrl: string;
  tags: string[];
}

export interface CollegeOption {
  id: string;
  name: string;
  shortName: string;
  city: string;
  type: 'Govt Autonomous' | 'Govt Aided' | 'Private Autonomous' | 'University Dept';
  naacGrade: string;
  nirfRank?: number;
  annualTuitionFee: number;
  hostelFeeYearly: number;
  avgPlacementLPA: number;
  highestPlacementLPA: number;
  cutoffCSPercentile: number;
  cutoffENTCPercentile: number;
  topRecruiters: string[];
  campusAreaAcres: number;
  safetyScore: number; // Out of 10
  busFacility: boolean;
  messQuality: 'Vegetarian & Jain' | 'Multi-cuisine' | 'Standard Mess';
}

export interface TimelineMilestone {
  id: string;
  title: string;
  marathiTitle: string;
  hindiTitle: string;
  dateStr: string;
  targetDate: string; // ISO date format for countdown
  status: 'upcoming' | 'ongoing' | 'completed';
  description: string;
  urgentNotice?: string;
}

export interface ProblemScenario {
  id: string;
  title: string;
  category: string;
  shortSnippet: string;
  resolutionSteps: string[];
  contactAgency: string;
  riskFactor: 'High' | 'Medium' | 'Low';
}
