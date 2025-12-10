# Test Cases - Recruiter Module
# CareerMate Project - SEP490

## Sheet 1: Dashboard Test Cases

| Test Case ID | Module | Test Case Name | Description | Preconditions | Test Steps | Expected Result | Priority | Status |
|--------------|--------|----------------|-------------|---------------|------------|-----------------|----------|--------|
| TC-REC-DASH-001 | Dashboard | Load Dashboard Successfully | Verify dashboard loads with all components | User logged in as Recruiter | 1. Navigate to /recruiter/recruiter-feature/dashboard | Dashboard displays with stats, quick actions, recent candidates | High | |
| TC-REC-DASH-002 | Dashboard | Display Stats Cards | Verify all 4 stats cards display correctly | User logged in | 1. View dashboard | Jobs Posted, Candidates, Views, Match Rate cards visible with data | High | |
| TC-REC-DASH-003 | Dashboard | Job Overview Section | Verify job overview shows correct counts | User has job postings | 1. View Job Overview section | Active, Pending, Expired, Rejected counts match actual data | High | |
| TC-REC-DASH-004 | Dashboard | Quick Actions Navigation | Verify quick action buttons navigate correctly | User on dashboard | 1. Click "Post New Job" | Navigates to /recruiter/recruiter-feature/jobs/create | Medium | |
| TC-REC-DASH-005 | Dashboard | Quick Actions - Manage Jobs | Verify manage jobs navigation | User on dashboard | 1. Click "Manage Jobs" | Navigates to /recruiter/recruiter-feature/jobs/active | Medium | |
| TC-REC-DASH-006 | Dashboard | Quick Actions - View Applications | Verify applications navigation | User on dashboard | 1. Click "View Applications" | Navigates to /recruiter/recruiter-feature/candidates/applications | Medium | |
| TC-REC-DASH-007 | Dashboard | Recent Candidates Carousel | Verify candidate carousel auto-scrolls | Has applications | 1. Wait 5 seconds | Carousel advances to next candidate | Medium | |
| TC-REC-DASH-008 | Dashboard | Package Details Modal | Verify package info modal opens | Has active package | 1. Click on package info | Modal displays package name, amount, dates, status | Low | |

## Sheet 2: Create Job Test Cases

| Test Case ID | Module | Test Case Name | Description | Preconditions | Test Steps | Expected Result | Priority | Status |
|--------------|--------|----------------|-------------|---------------|------------|-----------------|----------|--------|
| TC-REC-JOB-001 | Create Job | Open Create Job Form | Verify create job modal opens | On create job page | 1. Click "Create Job Post" button | Form modal opens with all fields | High | |
| TC-REC-JOB-002 | Create Job | Submit Valid Job Posting | Create job with all required fields | Form open, valid data | 1. Fill all required fields 2. Click Submit | Job created successfully, toast shown | High | |
| TC-REC-JOB-003 | Create Job | Validate Required Fields | Verify validation for empty required fields | Form open | 1. Leave required fields empty 2. Submit | Error message for each empty required field | High | |
| TC-REC-JOB-004 | Create Job | Title Validation | Verify title field validation | Form open | 1. Enter title < 5 chars | Validation error displayed | High | |
| TC-REC-JOB-005 | Create Job | Description Validation | Verify description field validation | Form open | 1. Enter description < 50 chars | Validation error displayed | High | |
| TC-REC-JOB-006 | Create Job | Expiration Date Validation | Verify date must be in future | Form open | 1. Select past date | Error: Date must be in future | High | |
| TC-REC-JOB-007 | Create Job | Add Skills to Job | Verify skills can be added | Form open, skills loaded | 1. Select skill 2. Set Must Have 3. Add | Skill appears in skills list | Medium | |
| TC-REC-JOB-008 | Create Job | Remove Skills from Job | Verify skills can be removed | Skills added | 1. Click remove on skill | Skill removed from list | Medium | |
| TC-REC-JOB-009 | Create Job | Prevent Duplicate Skills | Verify same skill cannot be added twice | Skill already added | 1. Try to add same skill | Error: Skill already added | Medium | |
| TC-REC-JOB-010 | Create Job | Package Limit - BASIC | Verify 5 job limit for BASIC | BASIC package, 5 jobs exist | 1. Try to create 6th job | Error: Limit reached, upgrade package | High | |
| TC-REC-JOB-011 | Create Job | Package Limit - PROFESSIONAL | Verify 20 job limit for PROFESSIONAL | PROFESSIONAL package, 20 jobs | 1. Try to create 21st job | Error: Limit reached | High | |
| TC-REC-JOB-012 | Create Job | Package Limit - ENTERPRISE | Verify unlimited for ENTERPRISE | ENTERPRISE package | 1. Create any number of jobs | Jobs created without limit | High | |
| TC-REC-JOB-013 | Create Job | Load Template | Verify template loading | Template stored in session | 1. Navigate with template | Form pre-filled with template data | Medium | |
| TC-REC-JOB-014 | Create Job | Work Model Selection | Verify work model dropdown | Form open | 1. Select each work model option | REMOTE/ONSITE/HYBRID selectable | Medium | |
| TC-REC-JOB-015 | Create Job | Cancel Job Creation | Verify cancel closes form | Form open with data | 1. Click Cancel/Close | Form closes, data not saved | Low | |

## Sheet 3: Active Jobs Test Cases

| Test Case ID | Module | Test Case Name | Description | Preconditions | Test Steps | Expected Result | Priority | Status |
|--------------|--------|----------------|-------------|---------------|------------|-----------------|----------|--------|
| TC-REC-ACT-001 | Active Jobs | Load Active Jobs List | Verify active jobs display | Has active jobs | 1. Navigate to active jobs page | Only ACTIVE status jobs displayed | High | |
| TC-REC-ACT-002 | Active Jobs | View Job Statistics | Verify stats modal opens | Has active job | 1. Click "View Stats" on job | Statistics modal with views, applications count | High | |
| TC-REC-ACT-003 | Active Jobs | Extend Job Posting | Verify extend functionality | Active job exists | 1. Click Extend 2. Select days 3. Confirm | Job extended, new expiration date shown | High | |
| TC-REC-ACT-004 | Active Jobs | Edit Job Posting | Verify edit navigation | Active job exists | 1. Click Edit | Navigates to edit form with data loaded | High | |
| TC-REC-ACT-005 | Active Jobs | AI Recommendations - Has Access | Get AI recommendations | Has AI entitlement | 1. Click AI Recommendations | Recommendations modal with candidates | High | |
| TC-REC-ACT-006 | Active Jobs | AI Recommendations - No Access | Block AI recommendations | No AI entitlement | 1. Click AI Recommendations | Error: Premium package required | Medium | |
| TC-REC-ACT-007 | Active Jobs | Contact Recommended Candidate | Contact candidate from AI | Has recommendations | 1. Click Contact on candidate | Contact modal with email template | Medium | |
| TC-REC-ACT-008 | Active Jobs | Pagination - Next Page | Navigate to next page | More than pageSize jobs | 1. Click next page | Next set of jobs loaded | Medium | |
| TC-REC-ACT-009 | Active Jobs | Pagination - Previous Page | Navigate to previous page | On page > 1 | 1. Click previous page | Previous set of jobs loaded | Medium | |
| TC-REC-ACT-010 | Active Jobs | Change Page Size | Change items per page | Jobs list displayed | 1. Change page size dropdown | List updates with new page size | Medium | |
| TC-REC-ACT-011 | Active Jobs | Empty State | Display when no active jobs | No active jobs | 1. View active jobs page | Empty state message displayed | Low | |
| TC-REC-ACT-012 | Active Jobs | Refresh Jobs List | Refresh job data | On active jobs page | 1. Click refresh | Jobs list reloaded from API | Low | |

## Sheet 4: Applications Test Cases

| Test Case ID | Module | Test Case Name | Description | Preconditions | Test Steps | Expected Result | Priority | Status |
|--------------|--------|----------------|-------------|---------------|------------|-----------------|----------|--------|
| TC-REC-APP-001 | Applications | Load Applications List | Verify applications display | Has applications | 1. Navigate to applications page | All applications listed with status | High | |
| TC-REC-APP-002 | Applications | Filter by Status | Filter applications by status | Has various statuses | 1. Select status from dropdown | Only matching applications shown | High | |
| TC-REC-APP-003 | Applications | Search Candidates | Search by name/email | Has applications | 1. Enter search query | Matching candidates displayed | High | |
| TC-REC-APP-004 | Applications | View Application Details | Open detail modal | Application exists | 1. Click on application | Detail modal with full info | High | |
| TC-REC-APP-005 | Applications | View CV - Has Access | View CV with entitlement | Has CV_VIEW | 1. Click View CV | CV opens in new tab | High | |
| TC-REC-APP-006 | Applications | View CV - No Access | Block CV without entitlement | No CV_VIEW | 1. Click View CV | Error: Upgrade package to view CV | High | |
| TC-REC-APP-007 | Applications | Set to Reviewing | Change status to reviewing | Status: SUBMITTED | 1. Click Review | Status changes to REVIEWING | High | |
| TC-REC-APP-008 | Applications | Approve Application | Approve candidate | Status: REVIEWING | 1. Click Approve 2. Confirm | Status changes to APPROVED | High | |
| TC-REC-APP-009 | Applications | Reject Application | Reject with reason | Status: REVIEWING | 1. Click Reject 2. Enter reason 3. Confirm | Status changes to REJECTED | High | |
| TC-REC-APP-010 | Applications | Schedule Interview | Schedule from application | Status: REVIEWING | 1. Click Schedule Interview | Navigates to interview scheduling | High | |
| TC-REC-APP-011 | Applications | Ban Candidate | Ban problematic candidate | Application exists | 1. Click Ban 2. Enter reason 3. Confirm | Status changes to BANNED | Medium | |
| TC-REC-APP-012 | Applications | Create Employment | Create employment for approved | Status: APPROVED | 1. Click Create Employment | Navigates to employment creation | Medium | |
| TC-REC-APP-013 | Applications | View Interview Details | View scheduled interview | Status: INTERVIEW_SCHEDULED | 1. Click View Interview | Interview details displayed | Medium | |
| TC-REC-APP-014 | Applications | Reschedule Interview | Reschedule existing interview | Interview scheduled | 1. Click Reschedule | Reschedule form displayed | Medium | |
| TC-REC-APP-015 | Applications | Cancel Interview | Cancel scheduled interview | Interview scheduled | 1. Click Cancel 2. Confirm | Interview cancelled | Medium | |
| TC-REC-APP-016 | Applications | Filter by Job Posting | Filter by specific job | Multiple jobs | 1. Select job from filter | Only that job's applications shown | Medium | |
| TC-REC-APP-017 | Applications | Sort Applications | Sort by date | Has applications | 1. Click sort column | Applications sorted correctly | Medium | |
| TC-REC-APP-018 | Applications | Pagination | Navigate application pages | Many applications | 1. Navigate pages | Correct applications per page | Medium | |
| TC-REC-APP-019 | Applications | Empty State | No applications display | No applications | 1. View page | Empty state message shown | Low | |
| TC-REC-APP-020 | Applications | Status Badge Colors | Verify status colors | Various statuses | 1. View applications | Each status has correct color | Low | |

## Sheet 5: Interview Test Cases

| Test Case ID | Module | Test Case Name | Description | Preconditions | Test Steps | Expected Result | Priority | Status |
|--------------|--------|----------------|-------------|---------------|------------|-----------------|----------|--------|
| TC-REC-INT-001 | Interviews | Load Upcoming Interviews | Display scheduled interviews | Has interviews | 1. Navigate to interviews page | All upcoming interviews listed | High | |
| TC-REC-INT-002 | Interviews | Complete Interview - Pass | Mark interview as passed | Interview today/past | 1. Click Complete 2. Select PASS 3. Add feedback | Status updated, candidate approved | High | |
| TC-REC-INT-003 | Interviews | Complete Interview - Fail | Mark interview as failed | Interview today/past | 1. Click Complete 2. Select FAIL 3. Add feedback | Status updated, candidate rejected | High | |
| TC-REC-INT-004 | Interviews | Complete Interview - Second Round | Request second round | Interview completed | 1. Click Complete 2. Select NEEDS_SECOND_ROUND | New interview can be scheduled | High | |
| TC-REC-INT-005 | Interviews | View Reschedule Requests | Display reschedule requests | Has reschedule requests | 1. View Reschedule Requests tab | All pending requests shown | High | |
| TC-REC-INT-006 | Interviews | Approve Reschedule | Accept reschedule request | Has reschedule request | 1. Click Approve 2. Add message | Request approved, interview rescheduled | Medium | |
| TC-REC-INT-007 | Interviews | Reject Reschedule | Deny reschedule request | Has reschedule request | 1. Click Reject 2. Add reason | Request rejected, original time kept | Medium | |
| TC-REC-INT-008 | Interviews | Cancel Interview | Cancel scheduled interview | Has scheduled interview | 1. Click Cancel 2. Enter reason 3. Confirm | Interview cancelled | Medium | |
| TC-REC-INT-009 | Interviews | Interview Type Display | Show correct interview type | Various types | 1. View interviews | VIDEO_CALL/IN_PERSON/PHONE shown correctly | Medium | |
| TC-REC-INT-010 | Interviews | Empty State | No interviews display | No interviews | 1. View page | Empty state message | Low | |

## Sheet 6: Employment Test Cases

| Test Case ID | Module | Test Case Name | Description | Preconditions | Test Steps | Expected Result | Priority | Status |
|--------------|--------|----------------|-------------|---------------|------------|-----------------|----------|--------|
| TC-REC-EMP-001 | Employments | Load Active Employments | Display all active employments | Has employments | 1. Navigate to employments page | All active employments listed | High | |
| TC-REC-EMP-002 | Employments | Display Employment Duration | Show correct duration | Has employment | 1. View employment card | Duration calculated correctly | High | |
| TC-REC-EMP-003 | Employments | Show Probation Status | Display if in probation | Employment in probation | 1. View employment | Probation badge shown | High | |
| TC-REC-EMP-004 | Employments | Terminate Employment | End employment | Active employment | 1. Click Terminate 2. Select type 3. Enter date 4. Add reason | Employment terminated | High | |
| TC-REC-EMP-005 | Employments | Termination Type Validation | Require termination type | Terminating employment | 1. Try submit without type | Error: Select termination type | Medium | |
| TC-REC-EMP-006 | Employments | Termination Date Validation | Validate termination date | Terminating employment | 1. Submit with invalid date | Error: Invalid date | Medium | |
| TC-REC-EMP-007 | Employments | Empty State | No employments display | No employments | 1. View page | Empty state message | Low | |
| TC-REC-EMP-008 | Employments | Termination Types | All types available | Open terminate dialog | 1. Click termination type dropdown | All 8 types shown | Low | |

## Sheet 7: Profile Test Cases

| Test Case ID | Module | Test Case Name | Description | Preconditions | Test Steps | Expected Result | Priority | Status |
|--------------|--------|----------------|-------------|---------------|------------|-----------------|----------|--------|
| TC-REC-PRO-001 | Profile | Load Profile Page | Display profile with tabs | Logged in | 1. Navigate to profile | Account and Organization tabs shown | High | |
| TC-REC-PRO-002 | Profile | Update Account Info | Update personal details | On account tab | 1. Edit fields 2. Save | Profile updated successfully | High | |
| TC-REC-PRO-003 | Profile | Update Organization | Update company details | On organization tab | 1. Edit fields 2. Save | Organization updated successfully | Medium | |
| TC-REC-PRO-004 | Profile | Upload Avatar | Change profile picture | On account tab | 1. Click upload 2. Select image | Avatar updated | Medium | |
| TC-REC-PRO-005 | Profile | Upload Company Logo | Change company logo | On organization tab | 1. Click upload 2. Select image | Logo updated | Medium | |
| TC-REC-PRO-006 | Profile | Required Field Validation | Validate required fields | Editing profile | 1. Clear required field 2. Save | Validation error shown | Low | |

## Sheet 8: Billing Test Cases

| Test Case ID | Module | Test Case Name | Description | Preconditions | Test Steps | Expected Result | Priority | Status |
|--------------|--------|----------------|-------------|---------------|------------|-----------------|----------|--------|
| TC-REC-BIL-001 | Billing | Load Packages | Display available packages | Logged in | 1. Navigate to billing | All packages displayed with prices | High | |
| TC-REC-BIL-002 | Billing | Show Current Package | Highlight active package | Has package | 1. View billing | Current package shows "Active" badge | High | |
| TC-REC-BIL-003 | Billing | Select Package | Select package for purchase | No active package | 1. Click on package card | Package selected, highlighted | High | |
| TC-REC-BIL-004 | Billing | Block BASIC Selection | Prevent BASIC selection | Any state | 1. Click on BASIC | Cannot select free package | High | |
| TC-REC-BIL-005 | Billing | Block if Package Active | Prevent selection with active | Has active package | 1. Click any package | Error: Already have active package | High | |
| TC-REC-BIL-006 | Billing | Proceed to Payment | Continue to payment | Package selected | 1. Click Continue | Navigates to confirmation page | Medium | |
| TC-REC-BIL-007 | Billing | Display Features | Show package features | On billing page | 1. View package cards | All features listed for each package | Medium | |
| TC-REC-BIL-008 | Billing | Display Duration | Show package validity | On billing page | 1. View packages | Duration shown for each | Medium | |
| TC-REC-BIL-009 | Billing | Recommended Badge | Show recommended package | On billing page | 1. View packages | Recommended badge on PROFESSIONAL | Low | |
| TC-REC-BIL-010 | Billing | Loading State | Show loading spinner | Page loading | 1. Navigate to billing | Loading spinner while fetching | Low | |

---

## Test Environment

| Environment | URL | Description |
|-------------|-----|-------------|
| Development | http://localhost:3000 | Local development |
| Staging | https://staging.careermate.com | Pre-production testing |
| Production | https://careermate.com | Live environment |

## Test Data

| Data Type | Description | Example |
|-----------|-------------|---------|
| Recruiter Account | Test recruiter user | recruiter@test.com |
| BASIC Package | Free tier account | Package limit: 5 jobs |
| PROFESSIONAL Package | Mid tier account | Package limit: 20 jobs |
| ENTERPRISE Package | Premium account | Unlimited jobs, AI access |

## Status Legend

| Status | Description |
|--------|-------------|
| Pass | Test executed successfully |
| Fail | Test failed |
| Blocked | Cannot execute due to blocker |
| Not Run | Not yet executed |
| N/A | Not applicable |
