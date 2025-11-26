export interface Recruiter {
  recruiterId: number;
  accountId: number;
  email: string;
  companyName: string;
  website: string;
  logoUrl: string;
  about: string;
  companyEmail: string;
  contactPerson: string;
  phoneNumber: string;
  companyAddress: string;
  accountStatus: string;
  accountRole: string;
  verificationStatus: string;
}

export interface RecruiterResponse {
  code: number;
  message: string;
  result: Recruiter[];
}
