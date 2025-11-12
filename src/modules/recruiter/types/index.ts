export type SubMenuItem = {
    label: string;
    href: string;
};

export type NavItem = {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    subItems?: SubMenuItem[];
};

export type RecruiterProfile = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    bio: string;
    avatar?: string;
};

export type OrganizationProfile = {
    companyName: string;
    industry: string;
    companySize: string;
    website: string;
    description: string;
    address: string;
    city: string;
    country: string;
    companyEmail?: string;
};

export type CandidateApplication = {
    id: string;
    candidateName: string;
    position: string;
    applicationDate: string;
    status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected';
    resume?: string;
    tags: string[];
};

export type JobPosting = {
    id: string;
    title: string;
    company: string;
    location: string;
    type: 'full-time' | 'part-time' | 'contract' | 'remote';
    status: 'active' | 'draft' | 'closed';
    createdDate: string;
    applicationsCount: number;
};
