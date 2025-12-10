# Software Requirements Specification - Recruiter Module

## **III Requirement**

---

### **3.1.1 Screen Flow**

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                    RECRUITER FLOW                                        │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│   ┌──────────────────────┐                                                               │
│   │     Login/Auth       │                                                               │
│   └──────────┬───────────┘                                                               │
│              │                                                                           │
│              ▼                                                                           │
│   ┌──────────────────────┐                                                               │
│   │     Dashboard        │◄────────────────────────────────────────────┐                 │
│   └──────────┬───────────┘                                             │                 │
│              │                                                         │                 │
│    ┌─────────┼─────────┬─────────────┬──────────────┬─────────────┐   │                 │
│    ▼         ▼         ▼             ▼              ▼             ▼   │                 │
│ ┌──────┐ ┌──────┐ ┌──────────┐ ┌───────────┐ ┌───────────┐ ┌──────┐  │                 │
│ │ Jobs │ │Candi-│ │Interview │ │Employment │ │  Profile  │ │Billing│  │                 │
│ │      │ │dates │ │          │ │           │ │           │ │      │  │                 │
│ └──┬───┘ └──┬───┘ └────┬─────┘ └─────┬─────┘ └─────┬─────┘ └──┬───┘  │                 │
│    │        │          │             │             │          │      │                 │
│    ▼        ▼          ▼             ▼             ▼          ▼      │                 │
│ ┌──────┐ ┌──────┐ ┌──────────┐ ┌───────────┐ ┌───────────┐ ┌──────┐  │                 │
│ │Create│ │Appli-│ │ Schedule │ │  Create   │ │  Account  │ │Select│──┘                 │
│ │ Job  │ │cation│ │Interview │ │Employment │ │  Org Info │ │Package                   │
│ │Post  │ │Review│ │          │ │           │ │           │ │      │                    │
│ └──────┘ └──────┘ └──────────┘ └───────────┘ └───────────┘ └──────┘                    │
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### **3.1.2 Screen Descriptions**

#### **REC-001: Recruiter Dashboard**
| Attribute | Description |
|-----------|-------------|
| **Screen ID** | REC-001 |
| **Screen Name** | Recruiter Dashboard |
| **URL** | `/recruiter/recruiter-feature/dashboard` |
| **Purpose** | Main landing page for recruiters showing overview statistics, quick actions, and recent activities |
| **Roles** | Recruiter |

**Interface Elements:**
| Element | Type | Required | Description |
|---------|------|----------|-------------|
| Jobs Posted | Display Card | - | Shows total number of job postings |
| Candidates | Display Card | - | Shows total number of applications received |
| Views | Display Card | - | Shows total job views |
| Match Rate | Display Card | - | Shows matching rate percentage |
| Job Overview | Section | - | Active, Pending, Expired, Rejected job counts |
| Quick Actions | Section | - | Post New Job, Manage Jobs, View Applications buttons |
| Recent Candidates | Carousel | - | Auto-scrolling display of recent applicants |
| Package Info | Modal | - | Current subscription package details |

**Screen Layout:**
![Dashboard](../public/img/screens/recruiter-dashboard.png)

---

#### **REC-002: Create Job Posting**
| Attribute | Description |
|-----------|-------------|
| **Screen ID** | REC-002 |
| **Screen Name** | Create Job Posting |
| **URL** | `/recruiter/recruiter-feature/jobs/create` |
| **Purpose** | Create and publish new job postings to attract candidates |
| **Roles** | Recruiter |

**Interface Elements:**
| Element | Type | Required | Description |
|---------|------|----------|-------------|
| Job Title | Text Input | ✅ Yes | Title of the job position |
| Job Description | Rich Text | ✅ Yes | Detailed description of the role |
| Work Address | Text Input | ✅ Yes | Location of the job |
| Expiration Date | Date Picker | ✅ Yes | When the job posting expires |
| Years of Experience | Number Input | ✅ Yes | Required years of experience |
| Work Model | Dropdown | ✅ Yes | REMOTE / ONSITE / HYBRID |
| Salary Range | Dropdown | ✅ Yes | Salary range for the position |
| Job Package | Dropdown | ✅ Yes | Type of job posting package |
| Skills | Multi-select | No | Required skills with "Must Have" toggle |

**Data Processing:**
- **Input Validation**: All required fields must be filled before submission
- **Package Check**: Validates current package job posting limit
- **API Call**: POST `/api/jobposting/recruiter` with job details
- **Skill Association**: Associates selected skills with job posting

**Feedback:**
- ✅ Success: "Job posting created successfully"
- ❌ Error: "Failed to create job posting" with error details
- 🔒 Limit Reached: "You have reached your job posting limit"

**Business Rules:**
- BASIC package: Max 5 job postings
- PROFESSIONAL package: Max 20 job postings
- ENTERPRISE/PREMIUM package: Unlimited (limitValue = 0)

**Screen Layout:**
![Create Job](../public/img/screens/recruiter-create-job.png)

---

#### **REC-003: Active Jobs Management**
| Attribute | Description |
|-----------|-------------|
| **Screen ID** | REC-003 |
| **Screen Name** | Active Jobs |
| **URL** | `/recruiter/recruiter-feature/jobs/active` |
| **Purpose** | View and manage active job postings |
| **Roles** | Recruiter |

**Interface Elements:**
| Element | Type | Required | Description |
|---------|------|----------|-------------|
| Job List | Table/Cards | - | List of all active job postings |
| View Stats | Button | - | View job posting statistics |
| Extend | Button | - | Extend job posting expiration |
| Edit | Button | - | Edit job posting details |
| AI Recommendations | Button | - | Get AI-powered candidate recommendations |
| Pagination | Component | - | Page navigation for job list |

**Data Processing:**
- **API Call**: GET `/api/jobposting/recruiter` with pagination
- **Filter**: Only display jobs with status = 'ACTIVE'
- **Extend API**: PUT `/api/jobposting/{id}/extend`
- **AI Recommendations**: GET `/api/recommendations/job/{id}`

**Entitlement Check:**
- AI Matching feature requires package entitlement (checkAIMatchingEntitlement)

**Screen Layout:**
![Active Jobs](../public/img/screens/recruiter-active-jobs.png)

---

#### **REC-004: Job Applications Management**
| Attribute | Description |
|-----------|-------------|
| **Screen ID** | REC-004 |
| **Screen Name** | Applications |
| **URL** | `/recruiter/recruiter-feature/candidates/applications` |
| **Purpose** | Review and manage job applications from candidates |
| **Roles** | Recruiter |

**Interface Elements:**
| Element | Type | Required | Description |
|---------|------|----------|-------------|
| Search | Text Input | No | Search by candidate name/email |
| Status Filter | Dropdown | No | Filter by application status |
| Application List | Table | - | List of all applications |
| View CV | Button | - | View candidate's CV (requires package) |
| Approve | Button | - | Approve the application |
| Reject | Button | - | Reject with reason |
| Schedule Interview | Button | - | Schedule interview for candidate |
| Set Reviewing | Button | - | Mark as under review |

**Application Statuses:**
| Status | Description | Available Actions |
|--------|-------------|-------------------|
| SUBMITTED | Initial state | Review, Approve, Reject, Ban |
| REVIEWING | Under review | Approve, Reject, Schedule Interview |
| INTERVIEW_SCHEDULED | Interview set | View Interview, Reschedule, Cancel |
| INTERVIEWED | Interview completed | Approve, Reject |
| APPROVED | Offer extended | Create Employment |
| WORKING | Currently employed | Terminate |
| REJECTED | Not selected | - |
| WITHDRAWN | Candidate withdrew | - |
| BANNED | Banned candidate | - |

**Data Processing:**
- **API Call**: GET `/api/recruiter/applications` or filtered endpoint
- **Status Update**: PUT `/api/job-applications/{id}/status`
- **CV View Check**: GET `/api/recruiter-entitlement/cv-view-checker`

**Entitlement Check:**
- View CV feature requires CV_VIEW entitlement in package

**Screen Layout:**
![Applications](../public/img/screens/recruiter-applications.png)

---

#### **REC-005: Interview Management**
| Attribute | Description |
|-----------|-------------|
| **Screen ID** | REC-005 |
| **Screen Name** | Interviews |
| **URL** | `/recruiter/interviews` |
| **Purpose** | Manage interview schedules and conduct interviews |
| **Roles** | Recruiter |

**Interface Elements:**
| Element | Type | Required | Description |
|---------|------|----------|-------------|
| Upcoming Interviews | Tab | - | List of scheduled interviews |
| Reschedule Requests | Tab | - | Pending reschedule requests |
| Interview Type | Display | - | VIDEO_CALL / IN_PERSON / PHONE |
| Date/Time | Display | - | Scheduled interview datetime |
| Location/Link | Display | - | Interview location or meeting link |
| Complete Interview | Button | - | Mark interview as completed |
| Respond to Reschedule | Button | - | Accept/Reject reschedule |
| Cancel Interview | Button | - | Cancel scheduled interview |

**Interview Types:**
| Type | Description |
|------|-------------|
| VIDEO_CALL | Online video meeting |
| IN_PERSON | Physical location interview |
| PHONE | Phone call interview |

**Interview Results:**
| Result | Description |
|--------|-------------|
| PASS | Candidate passed |
| FAIL | Candidate failed |
| PENDING | Result pending |
| NEEDS_SECOND_ROUND | Requires another interview |

**Data Processing:**
- **API Call**: GET `/api/interviews/recruiter/upcoming`
- **Complete**: POST `/api/interviews/{id}/complete`
- **Cancel**: DELETE `/api/interviews/{id}`
- **Reschedule Response**: PUT `/api/interviews/reschedule/{id}/respond`

**Screen Layout:**
![Interviews](../public/img/screens/recruiter-interviews.png)

---

#### **REC-006: Employment Management**
| Attribute | Description |
|-----------|-------------|
| **Screen ID** | REC-006 |
| **Screen Name** | Employments |
| **URL** | `/recruiter/employments` |
| **Purpose** | Manage active employments and terminations |
| **Roles** | Recruiter |

**Interface Elements:**
| Element | Type | Required | Description |
|---------|------|----------|-------------|
| Employment List | Cards | - | List of active employments |
| Job Title | Display | - | Position title |
| Start Date | Display | - | Employment start date |
| Duration | Display | - | Employment duration |
| Probation Status | Badge | - | Whether in probation period |
| Terminate | Button | - | Terminate employment |

**Termination Dialog:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Termination Type | Dropdown | ✅ Yes | Type of termination |
| Termination Date | Date | ✅ Yes | Last working day |
| Reason | Textarea | No | Reason for termination |

**Termination Types:**
| Type | Description |
|------|-------------|
| RESIGNATION | Employee resigned |
| FIRED_PERFORMANCE | Fired due to performance |
| FIRED_MISCONDUCT | Fired due to misconduct |
| CONTRACT_END | Contract ended |
| MUTUAL_AGREEMENT | Mutual agreement |
| PROBATION_FAILED | Failed probation |
| COMPANY_CLOSURE | Company closure |
| LAYOFF | Laid off |

**Data Processing:**
- **API Call**: GET `/api/employment/recruiter/active`
- **Terminate**: POST `/api/employment/{id}/terminate`

**Screen Layout:**
![Employments](../public/img/screens/recruiter-employments.png)

---

#### **REC-007: Recruiter Profile**
| Attribute | Description |
|-----------|-------------|
| **Screen ID** | REC-007 |
| **Screen Name** | Profile |
| **URL** | `/recruiter/recruiter-feature/profile` |
| **Purpose** | Manage recruiter account and organization information |
| **Roles** | Recruiter |

**Interface Elements (Account Tab):**
| Element | Type | Required | Description |
|---------|------|----------|-------------|
| Full Name | Text Input | ✅ Yes | Recruiter's full name |
| Email | Text Input | ✅ Yes | Email address (read-only) |
| Phone | Text Input | ✅ Yes | Contact phone number |
| Position | Text Input | No | Job title/position |
| Avatar | Image Upload | No | Profile picture |

**Interface Elements (Organization Tab):**
| Element | Type | Required | Description |
|---------|------|----------|-------------|
| Company Name | Text Input | ✅ Yes | Organization name |
| Industry | Dropdown | ✅ Yes | Business industry |
| Company Size | Dropdown | No | Number of employees |
| Website | Text Input | No | Company website URL |
| Description | Textarea | No | Company description |
| Logo | Image Upload | No | Company logo |

**Data Processing:**
- **Account Update**: PUT `/api/recruiter/profile`
- **Organization Update**: PUT `/api/organization/update`
- **Image Upload**: POST `/api/upload/image`

**Screen Layout:**
![Profile](../public/img/screens/recruiter-profile.png)

---

#### **REC-008: Billing & Packages**
| Attribute | Description |
|-----------|-------------|
| **Screen ID** | REC-008 |
| **Screen Name** | Billing & Plans |
| **URL** | `/recruiter/recruiter-feature/profile/billing` |
| **Purpose** | View and purchase subscription packages |
| **Roles** | Recruiter |

**Interface Elements:**
| Element | Type | Required | Description |
|---------|------|----------|-------------|
| Package Cards | Display | - | Available package options |
| Current Package | Badge | - | Currently active package |
| Features List | List | - | Package features and limits |
| Price | Display | - | Package pricing |
| Duration | Display | - | Package validity period |
| Select Package | Button | - | Choose a package |
| Continue | Button | - | Proceed to payment |

**Available Packages:**
| Package | Price | Job Postings | CV View | AI Matching |
|---------|-------|--------------|---------|-------------|
| BASIC | Free | 5 | ❌ No | ❌ No |
| PROFESSIONAL | Paid | 20 | ✅ Yes | ❌ No |
| ENTERPRISE | Premium | Unlimited | ✅ Yes | ✅ Yes |

**Data Processing:**
- **Fetch Packages**: GET `/api/package/recruiter`
- **Fetch Invoice**: GET `/api/recruiter-invoice/my-invoice`
- **Payment**: POST `/api/payment/create`

**Screen Layout:**
![Billing](../public/img/screens/recruiter-billing.png)

---

### **3.1.3 Screen Authorization**

| Screen | URL | Roles | Auth Required | Package Required |
|--------|-----|-------|---------------|------------------|
| Dashboard | `/recruiter/recruiter-feature/dashboard` | Recruiter | ✅ Yes | ❌ No |
| Create Job | `/recruiter/recruiter-feature/jobs/create` | Recruiter | ✅ Yes | ✅ Yes |
| Active Jobs | `/recruiter/recruiter-feature/jobs/active` | Recruiter | ✅ Yes | ❌ No |
| Applications | `/recruiter/recruiter-feature/candidates/applications` | Recruiter | ✅ Yes | ❌ No |
| Interviews | `/recruiter/interviews` | Recruiter | ✅ Yes | ❌ No |
| Employments | `/recruiter/employments` | Recruiter | ✅ Yes | ❌ No |
| Profile | `/recruiter/recruiter-feature/profile` | Recruiter | ✅ Yes | ❌ No |
| Billing | `/recruiter/recruiter-feature/profile/billing` | Recruiter | ✅ Yes | ❌ No |

---

### **3.1.4 Non-Screen Functions**

#### **NSF-001: Job Posting Limit Check**
| Attribute | Description |
|-----------|-------------|
| **Function ID** | NSF-001 |
| **Function Name** | Check Job Posting Limit |
| **Trigger** | Before creating new job posting |
| **API Endpoint** | GET `/api/recruiter-entitlement/job-posting-checker` |
| **Logic** | Compare current job count with package limit (limitValue=0 means unlimited) |

#### **NSF-002: CV View Entitlement Check**
| Attribute | Description |
|-----------|-------------|
| **Function ID** | NSF-002 |
| **Function Name** | Check CV View Entitlement |
| **Trigger** | Before viewing candidate CV |
| **API Endpoint** | GET `/api/recruiter-entitlement/cv-view-checker` |
| **Logic** | Returns boolean if recruiter can view CVs |

#### **NSF-003: AI Matching Entitlement Check**
| Attribute | Description |
|-----------|-------------|
| **Function ID** | NSF-003 |
| **Function Name** | Check AI Matching Entitlement |
| **Trigger** | Before using AI recommendations |
| **API Endpoint** | GET `/api/recruiter-entitlement/ai-matching-checker` |
| **Logic** | Returns boolean if recruiter can use AI features |

#### **NSF-004: Auto Token Refresh**
| Attribute | Description |
|-----------|-------------|
| **Function ID** | NSF-004 |
| **Function Name** | Automatic Token Refresh |
| **Trigger** | When access token expires |
| **Logic** | Automatically refresh access token using refresh token |

---

### **3.2 Web Application**

#### **3.2.1 Create Job Posting**

- **Roles:** Recruiter
- **Purpose:** To add a new job posting to the system with details such as title, description, requirements, etc.

**Interface:**
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Job Title | Text Input | ✅ Yes | Min 5 characters |
| Job Description | Rich Text | ✅ Yes | Min 50 characters |
| Work Address | Text Input | ✅ Yes | Valid address format |
| Expiration Date | Date Picker | ✅ Yes | Must be future date |
| Years of Experience | Dropdown | ✅ Yes | 0-15+ years |
| Work Model | Dropdown | ✅ Yes | REMOTE/ONSITE/HYBRID |
| Salary Range | Dropdown | ✅ Yes | Predefined ranges |
| Job Package | Dropdown | ✅ Yes | BASIC/PREMIUM/URGENT |
| Skills | Multi-select | No | Select from skill list |

**Data Processing:**
- **Input Validation**: Ensures all required fields are provided and valid
- **Package Limit Check**: Validates recruiter hasn't exceeded job posting limit
- **API Call**: POST `/api/jobposting/recruiter` sends job details to backend
- **Skill Association**: Selected skills are linked to the job posting

**Feedback:**
| Type | Message |
|------|---------|
| Success | "Job posting created successfully" |
| Error - Validation | "Please fill in all required fields" |
| Error - Limit | "You have reached your job posting limit. Please upgrade your package." |
| Error - Server | "Failed to create job posting. Please try again." |

---

#### **3.2.2 Manage Applications**

- **Roles:** Recruiter
- **Purpose:** To review and manage job applications from candidates

**Interface:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Search | Text Input | No | Filter by name/email |
| Status Filter | Dropdown | No | Filter by application status |
| Application List | Table | - | Display all applications |
| Action Buttons | Button Group | - | Context-specific actions |

**Data Processing:**
- **Input Validation**: None required for filtering
- **API Call**: GET `/api/recruiter/applications` fetches all applications
- **Status Update**: PUT `/api/job-applications/{id}/status` updates status
- **Entitlement Check**: GET `/api/recruiter-entitlement/cv-view-checker` before viewing CV

**Feedback:**
| Type | Message |
|------|---------|
| Success - Approve | "Application approved successfully" |
| Success - Reject | "Application rejected" |
| Error - CV | "You need to upgrade your package to view CV" |
| Error - Server | "Failed to update application status" |

---

### **5.3 Web Messages List**

| Code | Type | Message | Screen |
|------|------|---------|--------|
| MSG-001 | Success | Job posting created successfully | Create Job |
| MSG-002 | Success | Job posting updated successfully | Edit Job |
| MSG-003 | Success | Job posting extended successfully | Active Jobs |
| MSG-004 | Success | Application approved successfully | Applications |
| MSG-005 | Success | Application rejected | Applications |
| MSG-006 | Success | Interview scheduled successfully | Applications |
| MSG-007 | Success | Interview completed | Interviews |
| MSG-008 | Success | Employment created successfully | Employments |
| MSG-009 | Success | Employment terminated | Employments |
| MSG-010 | Success | Profile updated successfully | Profile |
| MSG-011 | Success | Package selected successfully | Billing |
| MSG-012 | Success | Payment completed | Payment |
| MSG-013 | Error | Please fill in all required fields | All Forms |
| MSG-014 | Error | Failed to load data. Please try again. | All Screens |
| MSG-015 | Error | You have reached your job posting limit | Create Job |
| MSG-016 | Error | You need to upgrade your package to view CV | Applications |
| MSG-017 | Error | You need to purchase a package to create job postings | Create Job |
| MSG-018 | Error | AI Matching requires premium package | Active Jobs |
| MSG-019 | Error | Failed to schedule interview | Applications |
| MSG-020 | Error | This package is already active | Billing |
| MSG-021 | Warning | Job posting will expire soon | Active Jobs |
| MSG-022 | Warning | Application pending for too long | Applications |
| MSG-023 | Info | No applications yet | Applications |
| MSG-024 | Info | No active jobs | Active Jobs |
| MSG-025 | Info | Loading... | All Screens |

---

## **IV Software Architecture**

### **1.1 System Architecture (Next.js Folder Structure)**

```
src/
├── app/                          # App Router (Next.js 15)
│   ├── recruiter/               # Recruiter module
│   │   ├── page.tsx             # Recruiter landing page
│   │   ├── calendar/            # Calendar feature
│   │   ├── employments/         # Employment management
│   │   │   ├── page.tsx         # Employment list
│   │   │   └── create/          # Create employment
│   │   ├── interviews/          # Interview management
│   │   │   ├── page.tsx         # Interview list
│   │   │   └── schedule/        # Schedule interview
│   │   ├── payment-failure/     # Payment failure page
│   │   ├── payment-success/     # Payment success page
│   │   └── recruiter-feature/   # Main feature module
│   │       ├── layout.tsx       # Shared layout
│   │       ├── dashboard/       # Dashboard
│   │       ├── jobs/            # Job management
│   │       │   ├── active/      # Active jobs
│   │       │   ├── create/      # Create job
│   │       │   ├── drafts/      # Draft jobs
│   │       │   └── templates/   # Job templates
│   │       ├── candidates/      # Candidate management
│   │       │   ├── applications/# Applications
│   │       │   ├── saved/       # Saved candidates
│   │       │   └── tags/        # Candidate tags
│   │       ├── profile/         # Profile management
│   │       │   ├── account/     # Account settings
│   │       │   ├── billing/     # Billing & packages
│   │       │   └── organization/# Organization info
│   │       └── services/        # Premium services
│   │           ├── boost/       # Job boost
│   │           ├── premium/     # Premium features
│   │           └── search/      # Candidate search
│   │
├── components/                   # Shared components
│   ├── ui/                      # UI primitives (Button, Card, etc.)
│   ├── shared/                  # Shared business components
│   └── auth/                    # Auth-related components
│
├── lib/                         # Utility libraries
│   ├── recruiter-api.ts        # Recruiter API functions
│   ├── recruiter-invoice-api.ts# Invoice API functions
│   ├── recruiter-payment-api.ts# Payment API functions
│   ├── interview-api.ts        # Interview API functions
│   └── employment-api.ts       # Employment API functions
│
├── modules/                     # Feature modules
│   └── recruiter/              # Recruiter-specific modules
│
├── hooks/                       # Custom React hooks
├── contexts/                    # React contexts
├── types/                       # TypeScript types
└── utils/                       # Utility functions
```

### **1.2.2 Front-end Package Diagram**

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           RECRUITER MODULE PACKAGES                              │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐          │
│  │     Pages        │    │   Components     │    │     Modules      │          │
│  │  (app/recruiter) │    │  (components/)   │    │   (modules/)     │          │
│  └────────┬─────────┘    └────────┬─────────┘    └────────┬─────────┘          │
│           │                       │                       │                     │
│           └───────────────────────┼───────────────────────┘                     │
│                                   │                                             │
│                                   ▼                                             │
│           ┌───────────────────────────────────────────────┐                     │
│           │                  Libraries                     │                     │
│           │                   (lib/)                       │                     │
│           ├───────────────────────────────────────────────┤                     │
│           │ • recruiter-api.ts                            │                     │
│           │ • recruiter-invoice-api.ts                    │                     │
│           │ • recruiter-payment-api.ts                    │                     │
│           │ • interview-api.ts                            │                     │
│           │ • employment-api.ts                           │                     │
│           │ • status-utils.ts                             │                     │
│           └───────────────────┬───────────────────────────┘                     │
│                               │                                                 │
│                               ▼                                                 │
│           ┌───────────────────────────────────────────────┐                     │
│           │              External Services                 │                     │
│           ├───────────────────────────────────────────────┤                     │
│           │ • Backend REST API                            │                     │
│           │ • Firebase Storage (Images)                   │                     │
│           │ • Payment Gateway (VNPay, etc.)               │                     │
│           └───────────────────────────────────────────────┘                     │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### **Package Dependencies:**

| Package | Version | Purpose |
|---------|---------|---------|
| next | 15.5.4 | React framework with App Router |
| react | 18.x | UI library |
| typescript | 5.x | Type safety |
| axios | 1.x | HTTP client |
| react-hot-toast | 2.x | Toast notifications |
| lucide-react | latest | Icons |
| tailwindcss | 3.x | CSS framework |
| @radix-ui/react-* | latest | UI primitives |
| sonner | latest | Alternative toast library |

---

## **V Test**

See separate Excel file for test cases: [Test Cases - Recruiter Module](./TEST_CASES_RECRUITER.xlsx)

### **Test Case Summary:**

| Module | Total Cases | Priority High | Priority Medium | Priority Low |
|--------|-------------|---------------|-----------------|--------------|
| Dashboard | 8 | 3 | 4 | 1 |
| Create Job | 15 | 8 | 5 | 2 |
| Active Jobs | 12 | 5 | 5 | 2 |
| Applications | 20 | 10 | 7 | 3 |
| Interviews | 10 | 5 | 4 | 1 |
| Employments | 8 | 4 | 3 | 1 |
| Profile | 6 | 2 | 3 | 1 |
| Billing | 10 | 5 | 4 | 1 |
| **Total** | **89** | **42** | **35** | **12** |

---

## **Appendix: API Endpoints Reference**

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/jobposting/recruiter` | POST | Create job posting |
| `/api/jobposting/recruiter` | GET | Get recruiter's job postings |
| `/api/jobposting/{id}/extend` | PUT | Extend job posting |
| `/api/recruiter/applications` | GET | Get all applications |
| `/api/job-applications/{id}/status` | PUT | Update application status |
| `/api/interviews/recruiter/upcoming` | GET | Get upcoming interviews |
| `/api/interviews/{id}/complete` | POST | Complete interview |
| `/api/employment/recruiter/active` | GET | Get active employments |
| `/api/employment/{id}/terminate` | POST | Terminate employment |
| `/api/recruiter/profile` | PUT | Update profile |
| `/api/package/recruiter` | GET | Get available packages |
| `/api/recruiter-invoice/my-invoice` | GET | Get current invoice |
| `/api/recruiter-entitlement/cv-view-checker` | GET | Check CV view entitlement |
| `/api/recruiter-entitlement/job-posting-checker` | GET | Check job posting entitlement |
| `/api/recruiter-entitlement/ai-matching-checker` | GET | Check AI matching entitlement |
