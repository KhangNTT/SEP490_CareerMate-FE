# Test Cases - Admin Module
# CareerMate Project - SEP490

## Sheet 1: Dashboard Test Cases

| Test Case ID | Module | Test Case Name | Description | Preconditions | Test Steps | Expected Result | Priority | Status |
|--------------|--------|----------------|-------------|---------------|------------|-----------------|----------|--------|
| TC-ADM-DASH-001 | Dashboard | Load Dashboard Successfully | Verify dashboard loads with all components | User logged in as Admin | 1. Navigate to /admin | Dashboard displays with all stats and health status | High | |
| TC-ADM-DASH-002 | Dashboard | Display System Health Banner | Verify system health status displays correctly | Dashboard loaded | 1. View system health banner | Shows status of Database, Kafka, Weaviate, Email | High | |
| TC-ADM-DASH-003 | Dashboard | Display User Statistics | Verify user counts display correctly | Has users in system | 1. View stats cards | Total Users, Candidates, Recruiters, Admins counts shown | High | |
| TC-ADM-DASH-004 | Dashboard | Display User Role Chart | Verify pie chart shows role distribution | Has users | 1. View User Role Chart | Pie chart shows correct distribution | High | |
| TC-ADM-DASH-005 | Dashboard | Display Account Status Chart | Verify account status chart | Has accounts | 1. View Account Status Chart | Shows Active, Pending, Banned, Rejected counts | Medium | |
| TC-ADM-DASH-006 | Dashboard | Manual Refresh Button | Verify refresh button works | Dashboard loaded | 1. Click Refresh button | Data refreshed, toast shown | Medium | |
| TC-ADM-DASH-007 | Dashboard | Auto Refresh Every 30s | Verify auto refresh | Dashboard loaded | 1. Wait 30 seconds | Data refreshed automatically | Medium | |
| TC-ADM-DASH-008 | Dashboard | Display Pending Items Count | Verify pending items shown | Has pending items | 1. View pending count | Shows pending approvals + flagged content | Medium | |
| TC-ADM-DASH-009 | Dashboard | Handle API Error | Verify error handling | API fails | 1. Trigger API error | Error message displayed with retry button | Low | |
| TC-ADM-DASH-010 | Dashboard | Quick Links Navigation | Verify quick links work | Dashboard loaded | 1. Click quick link | Navigates to correct page | Low | |

## Sheet 2: User Management Test Cases

| Test Case ID | Module | Test Case Name | Description | Preconditions | Test Steps | Expected Result | Priority | Status |
|--------------|--------|----------------|-------------|---------------|------------|-----------------|----------|--------|
| TC-ADM-USER-001 | User Management | Load User List | Verify user list loads | Logged in as Admin | 1. Navigate to /admin/user-management | User table displayed with data | High | |
| TC-ADM-USER-002 | User Management | Display Total Users Count | Verify total count | Has users | 1. View total count | Correct total displayed | High | |
| TC-ADM-USER-003 | User Management | Search Users | Search by username/email | Has users | 1. Enter search query | Matching users displayed | High | |
| TC-ADM-USER-004 | User Management | View User Details | View user information | Has users | 1. Click View on user | User details modal opens | Medium | |
| TC-ADM-USER-005 | User Management | Role Badge Colors | Verify badge colors | Has users with different roles | 1. View role badges | Admin=Red, Recruiter=Blue, Candidate=Green | Medium | |
| TC-ADM-USER-006 | User Management | Pagination | Navigate pages | More than 20 users | 1. Click next page | Next page of users loaded | Medium | |
| TC-ADM-USER-007 | User Management | Empty Search Result | No matching users | No match for query | 1. Search non-existent | Empty state message shown | Medium | |
| TC-ADM-USER-008 | User Management | Handle API Error | Error handling | API fails | 1. Trigger error | Error message with retry button | Low | |

## Sheet 3: Job Postings Test Cases

| Test Case ID | Module | Test Case Name | Description | Preconditions | Test Steps | Expected Result | Priority | Status |
|--------------|--------|----------------|-------------|---------------|------------|-----------------|----------|--------|
| TC-ADM-JOB-001 | Job Postings | Load Job Postings | Verify list loads | Has job postings | 1. Navigate to /admin/job-postings | Job table displayed | High | |
| TC-ADM-JOB-002 | Job Postings | Filter by Status | Filter PENDING jobs | Has various status jobs | 1. Select PENDING filter | Only PENDING jobs shown | High | |
| TC-ADM-JOB-003 | Job Postings | View Job Details | View full job info | Has job posting | 1. Click View on job | Job details modal opens | High | |
| TC-ADM-JOB-004 | Job Postings | Approve Job Posting | Approve pending job | Has PENDING job | 1. Click Approve 2. Confirm | Job status changes to ACTIVE | High | |
| TC-ADM-JOB-005 | Job Postings | Reject Job Posting | Reject with reason | Has PENDING job | 1. Click Reject 2. Enter reason 3. Confirm | Job status changes to REJECTED | High | |
| TC-ADM-JOB-006 | Job Postings | Reject Without Reason | Validate reason required | Has PENDING job | 1. Click Reject 2. Submit without reason | Error: Please enter rejection reason | High | |
| TC-ADM-JOB-007 | Job Postings | Search Jobs | Search by title | Has jobs | 1. Enter search query | Matching jobs displayed | Medium | |
| TC-ADM-JOB-008 | Job Postings | Status Badge Colors | Verify status colors | Has various statuses | 1. View status badges | Correct colors per status | Medium | |
| TC-ADM-JOB-009 | Job Postings | Pagination | Navigate pages | Many job postings | 1. Click next page | Next page loaded | Medium | |
| TC-ADM-JOB-010 | Job Postings | Filter by ACTIVE | Filter active jobs | Has ACTIVE jobs | 1. Select ACTIVE filter | Only ACTIVE jobs shown | Medium | |
| TC-ADM-JOB-011 | Job Postings | Empty State | No job postings | No jobs exist | 1. View page | Empty state message | Low | |
| TC-ADM-JOB-012 | Job Postings | Refresh List | Refresh job data | On page | 1. Click refresh | Data refreshed | Low | |

## Sheet 4: Pending Approvals Test Cases

| Test Case ID | Module | Test Case Name | Description | Preconditions | Test Steps | Expected Result | Priority | Status |
|--------------|--------|----------------|-------------|---------------|------------|-----------------|----------|--------|
| TC-ADM-PEND-001 | Pending Approvals | Load Pending Recruiters | Verify list loads | Has pending recruiters | 1. Navigate to /admin/pending-approval | Pending recruiters displayed | High | |
| TC-ADM-PEND-002 | Pending Approvals | View Recruiter Details | View full information | Has pending recruiter | 1. Click View | Details modal opens with company info | High | |
| TC-ADM-PEND-003 | Pending Approvals | Approve Recruiter | Approve registration | Has pending recruiter | 1. Click Approve 2. Confirm | Recruiter approved, removed from list | High | |
| TC-ADM-PEND-004 | Pending Approvals | Reject Recruiter | Reject with reason | Has pending recruiter | 1. Click Reject 2. Select/Enter reason 3. Confirm | Recruiter rejected | High | |
| TC-ADM-PEND-005 | Pending Approvals | Reject Without Reason | Validate reason required | Has pending recruiter | 1. Click Reject 2. Submit without reason | Error: Please provide rejection reason | High | |
| TC-ADM-PEND-006 | Pending Approvals | Select Common Reason | Use predefined reason | Rejecting recruiter | 1. Select from dropdown | Reason pre-filled | Medium | |
| TC-ADM-PEND-007 | Pending Approvals | Custom Rejection Reason | Enter custom reason | Rejecting recruiter | 1. Select Other 2. Enter custom reason | Custom reason accepted | Medium | |
| TC-ADM-PEND-008 | Pending Approvals | Search Recruiters | Search by company/email | Has recruiters | 1. Enter search query | Matching recruiters shown | Medium | |
| TC-ADM-PEND-009 | Pending Approvals | Empty State | No pending recruiters | No pending | 1. View page | Empty state message | Low | |
| TC-ADM-PEND-010 | Pending Approvals | Refresh List | Refresh data | On page | 1. Click refresh | List refreshed | Low | |

## Sheet 5: Recruiter Management Test Cases

| Test Case ID | Module | Test Case Name | Description | Preconditions | Test Steps | Expected Result | Priority | Status |
|--------------|--------|----------------|-------------|---------------|------------|-----------------|----------|--------|
| TC-ADM-REC-001 | Recruiters | Load Recruiter List | Verify list loads | Has recruiters | 1. Navigate to /admin/recruiters | Recruiters table displayed | High | |
| TC-ADM-REC-002 | Recruiters | Filter by Status | Filter by APPROVED | Has various statuses | 1. Select APPROVED filter | Only APPROVED shown | High | |
| TC-ADM-REC-003 | Recruiters | View Recruiter Details | View full info | Has recruiter | 1. Click View | Details modal with Info/Profile tabs | High | |
| TC-ADM-REC-004 | Recruiters | Ban Recruiter | Ban with reason | Has active recruiter | 1. Click Ban 2. Enter reason 3. Confirm | Recruiter banned | High | |
| TC-ADM-REC-005 | Recruiters | Ban Without Reason | Validate reason required | Banning recruiter | 1. Click Ban 2. Submit without reason | Error: Please provide reason | Medium | |
| TC-ADM-REC-006 | Recruiters | Search Recruiters | Search by keyword | Has recruiters | 1. Enter search query | Matching recruiters shown | Medium | |
| TC-ADM-REC-007 | Recruiters | Debounced Search | Search waits for typing | On page | 1. Type search quickly | Search triggers after 500ms pause | Medium | |
| TC-ADM-REC-008 | Recruiters | Status Badge Colors | Verify badge colors | Has various statuses | 1. View status badges | Correct colors per status | Medium | |
| TC-ADM-REC-009 | Recruiters | Pagination | Navigate pages | Many recruiters | 1. Click next page | Next page loaded | Low | |
| TC-ADM-REC-010 | Recruiters | Details Tabs | Switch between tabs | Viewing details | 1. Click Profile tab | Profile info displayed | Low | |

## Sheet 6: Banned Recruiters Test Cases

| Test Case ID | Module | Test Case Name | Description | Preconditions | Test Steps | Expected Result | Priority | Status |
|--------------|--------|----------------|-------------|---------------|------------|-----------------|----------|--------|
| TC-ADM-BAN-001 | Banned Recruiters | Load Banned List | Verify list loads | Has banned recruiters | 1. Navigate to /admin/banned-recruiters | Banned recruiters displayed | High | |
| TC-ADM-BAN-002 | Banned Recruiters | Display Ban Reason | Show why banned | Has banned recruiter | 1. View recruiter | Ban reason displayed | High | |
| TC-ADM-BAN-003 | Banned Recruiters | View Details | View full info | Has banned recruiter | 1. Click View | Details modal opens | High | |
| TC-ADM-BAN-004 | Banned Recruiters | Unban Recruiter | Restore recruiter | Has banned recruiter | 1. Click Unban 2. Confirm | Recruiter unbanned, previous status restored | High | |
| TC-ADM-BAN-005 | Banned Recruiters | Search Banned | Search by company | Has banned recruiters | 1. Enter search query | Matching banned shown | Medium | |
| TC-ADM-BAN-006 | Banned Recruiters | Display Previous Status | Show status before ban | Has banned recruiter | 1. View details | Previous status shown | Medium | |
| TC-ADM-BAN-007 | Banned Recruiters | Empty State | No banned recruiters | No banned | 1. View page | Empty state message | Medium | |
| TC-ADM-BAN-008 | Banned Recruiters | Refresh List | Refresh data | On page | 1. Click refresh | List refreshed | Low | |

## Sheet 7: Blog Management Test Cases

| Test Case ID | Module | Test Case Name | Description | Preconditions | Test Steps | Expected Result | Priority | Status |
|--------------|--------|----------------|-------------|---------------|------------|-----------------|----------|--------|
| TC-ADM-BLOG-001 | Blog | Load Blog List | Verify list loads | Has blogs | 1. Navigate to /admin/blog | Blog list displayed | High | |
| TC-ADM-BLOG-002 | Blog | Create New Blog | Create blog post | On blog page | 1. Click Create 2. Fill form 3. Submit | Blog created | High | |
| TC-ADM-BLOG-003 | Blog | Edit Blog | Edit existing blog | Has blog | 1. Click Edit 2. Modify 3. Save | Blog updated | High | |
| TC-ADM-BLOG-004 | Blog | Delete Blog | Delete blog post | Has blog | 1. Click Delete 2. Confirm | Blog deleted | High | |
| TC-ADM-BLOG-005 | Blog | Publish Blog | Publish draft blog | Has DRAFT blog | 1. Click Publish | Blog status changes to PUBLISHED | High | |
| TC-ADM-BLOG-006 | Blog | Archive Blog | Archive published blog | Has PUBLISHED blog | 1. Click Archive | Blog status changes to ARCHIVED | Medium | |
| TC-ADM-BLOG-007 | Blog | Filter by Status | Filter blogs | Has various statuses | 1. Select status filter | Matching blogs shown | Medium | |
| TC-ADM-BLOG-008 | Blog | Filter by Category | Filter by category | Has categorized blogs | 1. Select category | Matching blogs shown | Medium | |
| TC-ADM-BLOG-009 | Blog | Search Blogs | Search by title | Has blogs | 1. Enter search query | Matching blogs shown | Medium | |
| TC-ADM-BLOG-010 | Blog | Preview Blog | Preview before publish | Has blog | 1. Click Preview | Preview modal opens | Medium | |
| TC-ADM-BLOG-011 | Blog | Sort Blogs | Change sort order | Has blogs | 1. Change sort dropdown | Blogs reordered | Low | |
| TC-ADM-BLOG-012 | Blog | Pagination | Navigate pages | Many blogs | 1. Click next page | Next page loaded | Low | |

## Sheet 8: Moderation Test Cases

| Test Case ID | Module | Test Case Name | Description | Preconditions | Test Steps | Expected Result | Priority | Status |
|--------------|--------|----------------|-------------|---------------|------------|-----------------|----------|--------|
| TC-ADM-MOD-001 | Moderation | Load Comments Tab | Verify comments load | Has comments | 1. Navigate to /admin/moderation | Comments tab displayed | High | |
| TC-ADM-MOD-002 | Moderation | Load Ratings Tab | Verify ratings load | Has ratings | 1. Click Ratings tab | Ratings displayed | High | |
| TC-ADM-MOD-003 | Moderation | View Flagged Comments | See flagged only | Has flagged comments | 1. View Flagged tab | Only flagged comments shown | High | |
| TC-ADM-MOD-004 | Moderation | Approve Comment | Approve flagged comment | Has flagged comment | 1. Click Approve | Comment approved | High | |
| TC-ADM-MOD-005 | Moderation | Reject Comment | Reject comment | Has comment | 1. Click Reject | Comment rejected/hidden | High | |
| TC-ADM-MOD-006 | Moderation | Delete Comment | Permanently delete | Has comment | 1. Click Delete 2. Confirm | Comment deleted | High | |
| TC-ADM-MOD-007 | Moderation | Approve Rating | Approve flagged rating | Has flagged rating | 1. Click Approve | Rating approved | Medium | |
| TC-ADM-MOD-008 | Moderation | Reject Rating | Reject rating | Has rating | 1. Click Reject | Rating rejected | Medium | |
| TC-ADM-MOD-009 | Moderation | View Statistics | See moderation stats | On page | 1. View stats cards | Total, Flagged, Approved, Rejected counts | Medium | |
| TC-ADM-MOD-010 | Moderation | Filter by Blog ID | Filter comments | Has comments | 1. Enter blog ID | Comments for that blog shown | Medium | |
| TC-ADM-MOD-011 | Moderation | Search by Email | Search user | Has comments | 1. Enter email | User's comments shown | Low | |
| TC-ADM-MOD-012 | Moderation | Sort Comments | Change sort | Has comments | 1. Change sort order | Comments reordered | Low | |

## Sheet 9: Skill Management Test Cases

| Test Case ID | Module | Test Case Name | Description | Preconditions | Test Steps | Expected Result | Priority | Status |
|--------------|--------|----------------|-------------|---------------|------------|-----------------|----------|--------|
| TC-ADM-SKL-001 | Skills | Load Skill List | Verify list loads | Has skills | 1. Navigate to /admin/skills | Skills table displayed | High | |
| TC-ADM-SKL-002 | Skills | Create New Skill | Add new skill | On skills page | 1. Click Create 2. Enter name 3. Submit | Skill created | High | |
| TC-ADM-SKL-003 | Skills | Validate Empty Name | Name required | Creating skill | 1. Submit with empty name | Error: Skill name is required | High | |
| TC-ADM-SKL-004 | Skills | Validate Duplicate | Unique name | Skill exists | 1. Create with existing name | Error: Skill already exists | High | |
| TC-ADM-SKL-005 | Skills | Search Skills | Search by name | Has skills | 1. Enter search query | Matching skills shown | Medium | |
| TC-ADM-SKL-006 | Skills | Clear Search | Reset search | Has search query | 1. Click Clear | Search cleared, all skills shown | Medium | |
| TC-ADM-SKL-007 | Skills | Display Usage Count | Show usage | Skills used in jobs | 1. View skill row | Usage count displayed | Medium | |
| TC-ADM-SKL-008 | Skills | Pagination | Navigate pages | Many skills | 1. Click next page | Next page loaded | Low | |

## Sheet 10: Profile Updates Test Cases

| Test Case ID | Module | Test Case Name | Description | Preconditions | Test Steps | Expected Result | Priority | Status |
|--------------|--------|----------------|-------------|---------------|------------|-----------------|----------|--------|
| TC-ADM-PRO-001 | Profile Updates | Load Request List | Verify list loads | Has requests | 1. Navigate to /admin/profile-updates | Requests displayed | High | |
| TC-ADM-PRO-002 | Profile Updates | View Request Details | See comparison | Has request | 1. Click View | Current vs Requested values shown | High | |
| TC-ADM-PRO-003 | Profile Updates | Approve Request | Approve changes | Has PENDING request | 1. Click Approve 2. Add note 3. Confirm | Request approved, profile updated | High | |
| TC-ADM-PRO-004 | Profile Updates | Reject Request | Reject changes | Has PENDING request | 1. Click Reject 2. Enter reason 3. Confirm | Request rejected | High | |
| TC-ADM-PRO-005 | Profile Updates | Filter by Status | Filter requests | Has various statuses | 1. Select status filter | Matching requests shown | Medium | |
| TC-ADM-PRO-006 | Profile Updates | Reject Without Reason | Validate required | Rejecting request | 1. Reject without reason | Error message shown | Medium | |
| TC-ADM-PRO-007 | Profile Updates | Refresh List | Refresh data | On page | 1. Click Refresh | List refreshed | Medium | |
| TC-ADM-PRO-008 | Profile Updates | Empty State | No requests | No requests | 1. View page | Empty state message | Low | |

## Sheet 11: Notifications Test Cases

| Test Case ID | Module | Test Case Name | Description | Preconditions | Test Steps | Expected Result | Priority | Status |
|--------------|--------|----------------|-------------|---------------|------------|-----------------|----------|--------|
| TC-ADM-NOT-001 | Notifications | Load Notification Form | Verify form loads | Logged in as Admin | 1. Navigate to /admin/notifications | Form displayed with all fields | High | |
| TC-ADM-NOT-002 | Notifications | Send Broadcast - All | Send to all users | Form filled | 1. Fill form 2. Select ALL 3. Send | Notification sent to all users | High | |
| TC-ADM-NOT-003 | Notifications | Send Broadcast - Role | Send to specific role | Form filled | 1. Select CANDIDATE 2. Send | Notification sent to candidates only | High | |
| TC-ADM-NOT-004 | Notifications | Validate Required Fields | Validate form | Form empty | 1. Click Send without filling | Error: Please fill in all required fields | Medium | |
| TC-ADM-NOT-005 | Notifications | Select Priority | Choose priority | On form | 1. Select each priority | All priorities selectable | Medium | |
| TC-ADM-NOT-006 | Notifications | Form Reset After Send | Clear form | Sent notification | 1. Send notification | Form cleared after success | Low | |

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
| Admin Account | Test admin user | admin@test.com |
| Pending Recruiter | Awaiting approval | pending@company.com |
| Active Recruiter | Approved recruiter | active@company.com |
| Banned Recruiter | Banned account | banned@company.com |
| PENDING Job | Awaiting approval | "Software Developer" |
| Flagged Comment | Reported content | Inappropriate comment |
| Test Skill | Sample skill | "JavaScript" |

## Status Legend

| Status | Description |
|--------|-------------|
| Pass | Test executed successfully |
| Fail | Test failed |
| Blocked | Cannot execute due to blocker |
| Not Run | Not yet executed |
| N/A | Not applicable |

---

## Summary

| Module | Total | High | Medium | Low |
|--------|-------|------|--------|-----|
| Dashboard | 10 | 4 | 4 | 2 |
| User Management | 8 | 3 | 4 | 1 |
| Job Postings | 12 | 6 | 4 | 2 |
| Pending Approvals | 10 | 5 | 4 | 1 |
| Recruiters | 10 | 4 | 4 | 2 |
| Banned Recruiters | 8 | 4 | 3 | 1 |
| Blog Management | 12 | 5 | 5 | 2 |
| Moderation | 12 | 6 | 4 | 2 |
| Skills | 8 | 4 | 3 | 1 |
| Profile Updates | 8 | 4 | 3 | 1 |
| Notifications | 6 | 3 | 2 | 1 |
| **TOTAL** | **104** | **48** | **40** | **16** |
