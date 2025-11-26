# Recruiter Module

This module contains all functionality related to the recruiter interface and features.

## Structure

```
modules/recruiter/
├── components/           # UI components specific to recruiter features
│   ├── RecruiterSidebar.tsx    # Main navigation sidebar
│   ├── RecruiterHeader.tsx     # Header component
│   ├── RecruiterFooter.tsx     # Footer component
│   ├── RecruiterAccountForm.tsx # Recruiter account form
│   ├── OrganizationProfileForm.tsx # Organization profile form
│   ├── AccountTabs.tsx         # Tab navigation for profiles
│   ├── ChangePasswordDialog.tsx # Password change modal
│   ├── AvatarPicker.tsx        # Avatar selection component
│   └── ...
├── hooks/               # Module-specific React hooks
│   └── useSidebarState.ts      # Sidebar state management
├── services/           # API services and business logic
│   ├── profileService.ts       # Profile-related API calls
│   └── candidateService.ts     # Candidate management API calls
├── types/              # TypeScript type definitions
│   └── index.ts               # All module types
├── index.ts            # Module exports
└── README.md           # This file
```

## Features

### Profile Management
- Recruiter personal profile
- Organization profile
- Password management
- Avatar upload

### Navigation
- Collapsible sidebar with TailAdmin styling
- Responsive navigation
- Active state management
- Local storage persistence

### Candidate Management
- Application viewing
- Saved candidates
- Tag management
- Status updates

## Usage

```typescript
// Import components
import { RecruiterSidebar, RecruiterHeader } from "@/modules/recruiter";

// Import services
import { ProfileService, CandidateService } from "@/modules/recruiter";

// Import types
import type { RecruiterProfile, CandidateApplication } from "@/modules/recruiter";
```

## API Services

### ProfileService
- `getRecruiterProfile()` - Fetch recruiter profile data
- `updateRecruiterProfile()` - Update recruiter profile
- `getOrganizationProfile()` - Fetch organization profile
- `updateOrganizationProfile()` - Update organization profile

### CandidateService
- `getApplications()` - Fetch job applications
- `getSavedCandidates()` - Fetch saved candidates
- `updateApplicationStatus()` - Update application status
- `addTag()` / `removeTag()` - Manage candidate tags

## Types

All TypeScript types are defined in `types/index.ts` and exported through the main module index.
