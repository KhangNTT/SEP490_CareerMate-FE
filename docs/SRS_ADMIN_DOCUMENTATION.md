# Software Requirements Specification - Admin Module

## **III Requirement**

---

### **3.1.1 Screen Flow**

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                      ADMIN FLOW                                          │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│   ┌──────────────────────┐                                                               │
│   │     Login/Auth       │                                                               │
│   └──────────┬───────────┘                                                               │
│              │                                                                           │
│              ▼                                                                           │
│   ┌──────────────────────┐                                                               │
│   │   Admin Dashboard    │◄────────────────────────────────────────────┐                 │
│   └──────────┬───────────┘                                             │                 │
│              │                                                         │                 │
│    ┌─────────┼─────────┬─────────────┬──────────────┬─────────────┐   │                 │
│    ▼         ▼         ▼             ▼              ▼             ▼   │                 │
│ ┌──────┐ ┌──────┐ ┌──────────┐ ┌───────────┐ ┌───────────┐ ┌──────┐  │                 │
│ │Users │ │Recru-│ │  Jobs    │ │   Blog    │ │Moderation │ │Skills│  │                 │
│ │Mgmt  │ │iters │ │  Mgmt    │ │   Mgmt    │ │           │ │ Mgmt │  │                 │
│ └──┬───┘ └──┬───┘ └────┬─────┘ └─────┬─────┘ └─────┬─────┘ └──┬───┘  │                 │
│    │        │          │             │             │          │      │                 │
│    │        ▼          ▼             ▼             ▼          │      │                 │
│    │    ┌──────┐  ┌──────────┐  ┌─────────┐  ┌───────────┐    │      │                 │
│    │    │Pending│  │ Approve/ │  │ Create/ │  │ Comments/ │    │      │                 │
│    │    │Approv │  │ Reject   │  │  Edit   │  │  Ratings  │    │      │                 │
│    │    └──────┘  └──────────┘  └─────────┘  └───────────┘    │      │                 │
│    │        │                                                  │      │                 │
│    │        ▼                                                  │      │                 │
│    │    ┌──────┐                                               │      │                 │
│    │    │Banned│                                               │      │                 │
│    │    │Recru.│                                               │      │                 │
│    │    └──────┘                                               │      │                 │
│    │                                                           │      │                 │
│    │    ┌────────────────┐    ┌────────────────┐              │      │                 │
│    │    │ Profile Update │    │  Notifications │──────────────┼──────┘                 │
│    │    │    Requests    │    │   Broadcast    │              │                        │
│    │    └────────────────┘    └────────────────┘              │                        │
│    │                                                           │                        │
│    └───────────────────────────────────────────────────────────┘                        │
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### **3.1.2 Screen Descriptions**

#### **ADM-001: Admin Dashboard**
| Attribute | Description |
|-----------|-------------|
| **Screen ID** | ADM-001 |
| **Screen Name** | Admin Dashboard |
| **URL** | `/admin` |
| **Purpose** | Central overview of system statistics, health status, and quick access to management features |
| **Roles** | Admin |

**Interface Elements:**
| Element | Type | Required | Description |
|---------|------|----------|-------------|
| System Health Banner | Display | - | Shows overall system status (UP/DOWN) |
| Database Status | Badge | - | Database connection status |
| Kafka Status | Badge | - | Kafka service status |
| Weaviate Status | Badge | - | Weaviate (vector DB) status |
| Email Status | Badge | - | Email service status |
| Total Users | Stat Card | - | Total registered users count |
| Candidates Count | Stat Card | - | Total candidates count |
| Recruiters Count | Stat Card | - | Total recruiters count |
| Admins Count | Stat Card | - | Total admins count |
| User Role Chart | Pie Chart | - | Distribution of users by role |
| Account Status Chart | Pie Chart | - | Distribution by account status |
| Pending Items | Stat Card | - | Pending recruiter approvals + flagged content |
| Quick Links | Button Group | - | Navigation to management pages |
| Refresh Button | Button | - | Manually refresh dashboard data |

**Data Processing:**
- **API Call**: GET `/api/admin/stats` fetches dashboard statistics
- **Auto Refresh**: Dashboard auto-refreshes every 30 seconds
- **Real-time Health**: System health status from backend health endpoint

**Screen Layout:**
![Admin Dashboard](../public/img/screens/admin-dashboard.png)

---

#### **ADM-002: User Management**
| Attribute | Description |
|-----------|-------------|
| **Screen ID** | ADM-002 |
| **Screen Name** | User Management |
| **URL** | `/admin/user-management` |
| **Purpose** | View and manage all system users across all roles |
| **Roles** | Admin |

**Interface Elements:**
| Element | Type | Required | Description |
|---------|------|----------|-------------|
| Total Users Count | Display | - | Total number of users |
| Search Bar | Text Input | No | Search by username, email, or role |
| User Table | Table | - | List of all users with details |
| Username | Column | - | User's username |
| Email | Column | - | User's email address |
| Roles | Column | - | User roles with colored badges |
| Actions | Column | - | View details button |
| User Details Modal | Dialog | - | Full user information |
| Pagination | Component | - | Page navigation |

**Role Badge Colors:**
| Role | Color |
|------|-------|
| ADMIN | Red |
| RECRUITER | Blue |
| CANDIDATE | Green |

**Data Processing:**
- **API Call**: GET `/api/users` with pagination
- **Search**: Client-side filtering by username, email, role
- **Pagination**: Server-side pagination

**Screen Layout:**
![User Management](../public/img/screens/admin-user-management.png)

---

#### **ADM-003: Job Postings Management**
| Attribute | Description |
|-----------|-------------|
| **Screen ID** | ADM-003 |
| **Screen Name** | Job Postings Management |
| **URL** | `/admin/job-postings` |
| **Purpose** | Review, approve, or reject job postings from recruiters |
| **Roles** | Admin |

**Interface Elements:**
| Element | Type | Required | Description |
|---------|------|----------|-------------|
| Search Bar | Text Input | No | Search by job title |
| Status Filter | Dropdown | No | Filter by job status |
| Job Table | Table | - | List of all job postings |
| Title | Column | - | Job title |
| Company | Column | - | Company name |
| Location | Column | - | Job location |
| Status | Column | - | PENDING/ACTIVE/REJECTED/EXPIRED |
| Created At | Column | - | Creation date |
| Actions | Column | - | View, Approve, Reject buttons |
| Job Details Modal | Dialog | - | Full job information |
| Reject Dialog | Dialog | - | Rejection reason input |
| Pagination | Component | - | Page navigation |

**Job Status Flow:**
| Current Status | Available Actions | Result Status |
|----------------|-------------------|---------------|
| PENDING | Approve | ACTIVE |
| PENDING | Reject | REJECTED |
| ACTIVE | - | - |
| REJECTED | - | - |
| EXPIRED | - | - |

**Data Processing:**
- **API Call**: GET `/api/admin/job-postings` with pagination and filters
- **Approve**: PUT `/api/admin/job-postings/{id}/approve`
- **Reject**: PUT `/api/admin/job-postings/{id}/reject` with reason

**Screen Layout:**
![Job Postings](../public/img/screens/admin-job-postings.png)

---

#### **ADM-004: Pending Recruiter Approvals**
| Attribute | Description |
|-----------|-------------|
| **Screen ID** | ADM-004 |
| **Screen Name** | Pending Approvals |
| **URL** | `/admin/pending-approval` |
| **Purpose** | Review and approve/reject new recruiter registrations |
| **Roles** | Admin |

**Interface Elements:**
| Element | Type | Required | Description |
|---------|------|----------|-------------|
| Search Bar | Text Input | No | Search by company name, email |
| Recruiter Table | Table | - | List of pending recruiters |
| Company Name | Column | - | Company name |
| Contact Person | Column | - | Contact person name |
| Email | Column | - | Contact email |
| Industry | Column | - | Business industry |
| Created At | Column | - | Registration date |
| Actions | Column | - | View, Approve, Reject buttons |
| Details Modal | Dialog | - | Full recruiter information |
| Reject Dialog | Dialog | - | Rejection reason selection |

**Common Rejection Reasons:**
| Reason |
|--------|
| Incomplete company information |
| Invalid business documents |
| Duplicate registration |
| Suspicious activity |
| Other (custom reason) |

**Data Processing:**
- **API Call**: GET `/api/recruiter/pending` fetches pending recruiters
- **Approve**: POST `/api/recruiter/{id}/approve`
- **Reject**: POST `/api/recruiter/{id}/reject` with reason

**Screen Layout:**
![Pending Approvals](../public/img/screens/admin-pending-approval.png)

---

#### **ADM-005: Recruiter Management**
| Attribute | Description |
|-----------|-------------|
| **Screen ID** | ADM-005 |
| **Screen Name** | Recruiter Management |
| **URL** | `/admin/recruiters` |
| **Purpose** | View and manage all recruiters in the system |
| **Roles** | Admin |

**Interface Elements:**
| Element | Type | Required | Description |
|---------|------|----------|-------------|
| Search Bar | Text Input | No | Search by company, email |
| Status Filter | Dropdown | No | Filter by status (All/Pending/Approved/Active/Rejected/Banned) |
| Recruiter Table | Table | - | List of all recruiters |
| Company Name | Column | - | Company name |
| Contact Person | Column | - | Contact person name |
| Email | Column | - | Contact email |
| Phone | Column | - | Contact phone |
| Status | Column | - | Account status with badge |
| Created At | Column | - | Registration date |
| Actions | Column | - | View details, Ban buttons |
| Details Modal | Dialog | - | Full recruiter info with tabs (Info/Profile) |
| Ban Dialog | Dialog | - | Ban reason input |
| Pagination | Component | - | Page navigation |

**Status Badge Colors:**
| Status | Color |
|--------|-------|
| PENDING | Yellow |
| APPROVED | Blue |
| ACTIVE | Green |
| REJECTED | Red |
| BANNED | Dark Red |

**Data Processing:**
- **API Call**: GET `/api/recruiter/search` with filters and pagination
- **Ban**: POST `/api/recruiter/{accountId}/ban` with reason

**Screen Layout:**
![Recruiter Management](../public/img/screens/admin-recruiters.png)

---

#### **ADM-006: Banned Recruiters**
| Attribute | Description |
|-----------|-------------|
| **Screen ID** | ADM-006 |
| **Screen Name** | Banned Recruiters |
| **URL** | `/admin/banned-recruiters` |
| **Purpose** | Manage banned recruiters and unban if needed |
| **Roles** | Admin |

**Interface Elements:**
| Element | Type | Required | Description |
|---------|------|----------|-------------|
| Search Bar | Text Input | No | Search by company, email |
| Banned Recruiter Table | Table | - | List of banned recruiters |
| Company Name | Column | - | Company name |
| Contact Email | Column | - | Contact email |
| Ban Reason | Column | - | Reason for ban |
| Banned At | Column | - | Ban date |
| Previous Status | Column | - | Status before ban |
| Actions | Column | - | View, Unban buttons |
| Details Modal | Dialog | - | Full recruiter information |
| Unban Confirmation | Dialog | - | Confirm unban action |

**Data Processing:**
- **API Call**: GET `/api/recruiter/search?status=BANNED`
- **Unban**: POST `/api/recruiter/{accountId}/unban`
- **Previous Status**: Restored after unban

**Screen Layout:**
![Banned Recruiters](../public/img/screens/admin-banned-recruiters.png)

---

#### **ADM-007: Blog Management**
| Attribute | Description |
|-----------|-------------|
| **Screen ID** | ADM-007 |
| **Screen Name** | Blog Management |
| **URL** | `/admin/blog` |
| **Purpose** | Create, edit, publish, and manage blog posts |
| **Roles** | Admin |

**Interface Elements:**
| Element | Type | Required | Description |
|---------|------|----------|-------------|
| Create Blog Button | Button | - | Navigate to create new blog |
| Search Bar | Text Input | No | Search by blog title |
| Status Filter | Dropdown | No | Filter by status |
| Category Filter | Dropdown | No | Filter by category |
| Sort By | Dropdown | No | Sort options |
| Blog Table/Cards | Display | - | List of all blogs |
| Title | Column | - | Blog title |
| Category | Column | - | Blog category |
| Status | Column | - | DRAFT/PUBLISHED/ARCHIVED |
| Created At | Column | - | Creation date |
| Views | Column | - | View count |
| Actions | Column | - | Edit, Delete, Preview, Archive buttons |
| Preview Modal | Dialog | - | Blog preview |
| Delete Confirmation | Dialog | - | Confirm delete action |

**Blog Status:**
| Status | Description |
|--------|-------------|
| DRAFT | Not published yet |
| PUBLISHED | Live and visible |
| ARCHIVED | Hidden from public |

**Data Processing:**
- **API Call**: GET `/api/blog/admin/filter` with filters
- **Create**: POST `/api/blog/admin`
- **Update**: PUT `/api/blog/admin/{id}`
- **Delete**: DELETE `/api/blog/admin/{id}`
- **Archive**: PUT `/api/blog/admin/{id}/archive`
- **Publish**: PUT `/api/blog/admin/{id}/publish`

**Screen Layout:**
![Blog Management](../public/img/screens/admin-blog.png)

---

#### **ADM-008: Content Moderation**
| Attribute | Description |
|-----------|-------------|
| **Screen ID** | ADM-008 |
| **Screen Name** | Content Moderation |
| **URL** | `/admin/moderation` |
| **Purpose** | Moderate user comments and ratings on blog posts |
| **Roles** | Admin |

**Interface Elements:**
| Element | Type | Required | Description |
|---------|------|----------|-------------|
| Tab Navigation | Tabs | - | Comments / Ratings tabs |
| Flagged Toggle | Tab | - | Show flagged vs all |
| Statistics Cards | Display | - | Total, Flagged, Approved, Rejected counts |
| Search by Email | Text Input | No | Search by user email |
| Blog ID Filter | Text Input | No | Filter by blog ID |
| Sort Options | Dropdown | No | Sort by date |
| Content Table | Table | - | List of comments/ratings |
| User Info | Column | - | User email, name |
| Content | Column | - | Comment text or rating |
| Status | Column | - | PENDING/APPROVED/REJECTED/FLAGGED |
| Flag Reason | Column | - | Why content was flagged |
| Actions | Column | - | Approve, Reject, Delete, Hide buttons |

**Moderation Actions:**
| Action | Description |
|--------|-------------|
| Approve | Mark as acceptable |
| Reject | Mark as rejected (hidden) |
| Delete | Permanently remove |
| Hide | Temporarily hide from public |
| Show | Restore hidden content |

**Data Processing:**
- **Comments API**: GET `/api/admin/moderation/comments`
- **Ratings API**: GET `/api/admin/moderation/ratings`
- **Approve**: PUT `/api/admin/moderation/{type}/{id}/approve`
- **Reject**: PUT `/api/admin/moderation/{type}/{id}/reject`

**Screen Layout:**
![Moderation](../public/img/screens/admin-moderation.png)

---

#### **ADM-009: Skill Management**
| Attribute | Description |
|-----------|-------------|
| **Screen ID** | ADM-009 |
| **Screen Name** | Skill Management |
| **URL** | `/admin/skills` |
| **Purpose** | Manage the list of skills available for job postings |
| **Roles** | Admin |

**Interface Elements:**
| Element | Type | Required | Description |
|---------|------|----------|-------------|
| Create Skill Button | Button | - | Open create skill dialog |
| Search Bar | Text Input | No | Search skills by name |
| Clear Search | Button | - | Reset search filter |
| Skill Table | Table | - | List of all skills |
| ID | Column | - | Skill ID |
| Name | Column | - | Skill name |
| Usage Count | Column | - | How many jobs use this skill |
| Created At | Column | - | Creation date |
| Actions | Column | - | Edit, Delete buttons |
| Create Dialog | Dialog | - | New skill form |
| Pagination | Component | - | Page navigation |

**Create Skill Form:**
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Skill Name | Text Input | ✅ Yes | Min 2 characters, unique |

**Data Processing:**
- **API Call**: GET `/api/skills` fetches all skills
- **Create**: POST `/api/skills` with skill name
- **Search**: Client-side filtering by skill name

**Screen Layout:**
![Skill Management](../public/img/screens/admin-skills.png)

---

#### **ADM-010: Profile Update Requests**
| Attribute | Description |
|-----------|-------------|
| **Screen ID** | ADM-010 |
| **Screen Name** | Profile Update Requests |
| **URL** | `/admin/profile-updates` |
| **Purpose** | Review and approve/reject recruiter profile update requests |
| **Roles** | Admin |

**Interface Elements:**
| Element | Type | Required | Description |
|---------|------|----------|-------------|
| Status Filter | Dropdown | No | Filter by status (All/Pending/Approved/Rejected) |
| Refresh Button | Button | - | Refresh request list |
| Request Table | Table | - | List of update requests |
| Company Name | Column | - | Recruiter's company |
| Requested Fields | Column | - | Which fields changed |
| Status | Column | - | PENDING/APPROVED/REJECTED |
| Created At | Column | - | Request date |
| Actions | Column | - | View, Approve, Reject buttons |
| Details Modal | Dialog | - | Show current vs requested values |
| Approve Dialog | Dialog | - | Optional admin note |
| Reject Dialog | Dialog | - | Rejection reason required |

**Comparison View:**
| Current Value | Requested Value |
|---------------|-----------------|
| Old company name | New company name |
| Old address | New address |
| ... | ... |

**Data Processing:**
- **API Call**: GET `/api/recruiter/profile-update-requests` with filters
- **Approve**: POST `/api/recruiter/profile-update-requests/{id}/approve`
- **Reject**: POST `/api/recruiter/profile-update-requests/{id}/reject` with reason

**Screen Layout:**
![Profile Updates](../public/img/screens/admin-profile-updates.png)

---

#### **ADM-011: Broadcast Notifications**
| Attribute | Description |
|-----------|-------------|
| **Screen ID** | ADM-011 |
| **Screen Name** | Broadcast Notifications |
| **URL** | `/admin/notifications` |
| **Purpose** | Send broadcast notifications to users |
| **Roles** | Admin |

**Interface Elements:**
| Element | Type | Required | Description |
|---------|------|----------|-------------|
| Title | Text Input | ✅ Yes | Notification title |
| Message | Textarea | ✅ Yes | Notification content |
| Priority | Dropdown | ✅ Yes | LOW/MEDIUM/HIGH/URGENT |
| Target Role | Dropdown | ✅ Yes | ALL/CANDIDATE/RECRUITER/ADMIN |
| Send Button | Button | - | Send broadcast notification |
| Info Card | Display | - | Instructions for admin |

**Priority Levels:**
| Priority | Description |
|----------|-------------|
| LOW | General information |
| MEDIUM | Normal importance |
| HIGH | Important updates |
| URGENT | Critical notifications |

**Target Roles:**
| Target | Description |
|--------|-------------|
| ALL | All users |
| CANDIDATE | Candidates only |
| RECRUITER | Recruiters only |
| ADMIN | Admins only |

**Data Processing:**
- **API Call**: POST `/api/notifications/broadcast`
- **Payload**: { title, message, priority, targetRole }

**Screen Layout:**
![Notifications](../public/img/screens/admin-notifications.png)

---

### **3.1.3 Screen Authorization**

| Screen | URL | Roles | Auth Required | Special Permission |
|--------|-----|-------|---------------|-------------------|
| Dashboard | `/admin` | Admin | ✅ Yes | - |
| User Management | `/admin/user-management` | Admin | ✅ Yes | - |
| Job Postings | `/admin/job-postings` | Admin | ✅ Yes | - |
| Pending Approvals | `/admin/pending-approval` | Admin | ✅ Yes | - |
| Recruiters | `/admin/recruiters` | Admin | ✅ Yes | - |
| Banned Recruiters | `/admin/banned-recruiters` | Admin | ✅ Yes | - |
| Blog Management | `/admin/blog` | Admin | ✅ Yes | - |
| Moderation | `/admin/moderation` | Admin | ✅ Yes | - |
| Skills | `/admin/skills` | Admin | ✅ Yes | - |
| Profile Updates | `/admin/profile-updates` | Admin | ✅ Yes | - |
| Notifications | `/admin/notifications` | Admin | ✅ Yes | - |

---

### **3.1.4 Non-Screen Functions**

#### **NSF-ADM-001: Auto Dashboard Refresh**
| Attribute | Description |
|-----------|-------------|
| **Function ID** | NSF-ADM-001 |
| **Function Name** | Auto Dashboard Refresh |
| **Trigger** | Every 30 seconds on Dashboard |
| **Logic** | Automatically fetch latest stats without user action |

#### **NSF-ADM-002: System Health Check**
| Attribute | Description |
|-----------|-------------|
| **Function ID** | NSF-ADM-002 |
| **Function Name** | System Health Check |
| **API Endpoint** | GET `/api/admin/health` |
| **Logic** | Check status of Database, Kafka, Weaviate, Email services |

#### **NSF-ADM-003: Email Notification on Actions**
| Attribute | Description |
|-----------|-------------|
| **Function ID** | NSF-ADM-003 |
| **Function Name** | Email Notifications |
| **Trigger** | Approve/Reject recruiter, Ban/Unban actions |
| **Logic** | System sends email to affected user |

#### **NSF-ADM-004: Audit Logging**
| Attribute | Description |
|-----------|-------------|
| **Function ID** | NSF-ADM-004 |
| **Function Name** | Admin Action Logging |
| **Trigger** | All admin moderation actions |
| **Logic** | Log who did what action and when |

---

### **3.2 Web Application**

#### **3.2.1 Approve/Reject Recruiter**

- **Roles:** Admin
- **Purpose:** To review and approve or reject new recruiter registrations

**Interface:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Company Name | Display | - | Read-only company name |
| Contact Person | Display | - | Read-only contact name |
| Email | Display | - | Read-only email |
| Phone | Display | - | Read-only phone |
| Industry | Display | - | Read-only industry |
| Company Description | Display | - | Read-only description |
| Approve Button | Button | - | Approve the recruiter |
| Reject Button | Button | - | Open reject dialog |
| Rejection Reason | Dropdown + Textarea | ✅ Yes (for reject) | Reason for rejection |

**Data Processing:**
- **Input Validation**: Rejection reason required when rejecting
- **API Call - Approve**: POST `/api/recruiter/{id}/approve`
- **API Call - Reject**: POST `/api/recruiter/{id}/reject` with reason
- **Email Notification**: System sends email to recruiter

**Feedback:**
| Type | Message |
|------|---------|
| Success - Approve | "Recruiter approved successfully!" |
| Success - Reject | "Recruiter rejected successfully!" |
| Error | "Failed to process recruiter" |

---

#### **3.2.2 Approve/Reject Job Posting**

- **Roles:** Admin
- **Purpose:** To review and approve or reject job postings from recruiters

**Interface:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Job Title | Display | - | Read-only job title |
| Company | Display | - | Read-only company name |
| Description | Display | - | Read-only job description |
| Location | Display | - | Read-only location |
| Salary Range | Display | - | Read-only salary |
| Experience | Display | - | Read-only experience requirement |
| Skills | Display | - | Read-only required skills |
| Approve Button | Button | - | Approve job posting |
| Reject Button | Button | - | Open reject dialog |
| Rejection Reason | Textarea | ✅ Yes (for reject) | Reason for rejection |

**Data Processing:**
- **Input Validation**: Rejection reason required when rejecting
- **API Call - Approve**: PUT `/api/admin/job-postings/{id}/approve`
- **API Call - Reject**: PUT `/api/admin/job-postings/{id}/reject` with reason

**Feedback:**
| Type | Message |
|------|---------|
| Success - Approve | "Job approved and activated!" |
| Success - Reject | "Job rejected!" |
| Error | "Error processing job posting" |

---

#### **3.2.3 Ban/Unban Recruiter**

- **Roles:** Admin
- **Purpose:** To ban problematic recruiters or unban previously banned ones

**Interface:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Company Name | Display | - | Read-only company name |
| Current Status | Display | - | Current account status |
| Ban Reason | Textarea | ✅ Yes (for ban) | Reason for banning |
| Ban Button | Button | - | Confirm ban action |
| Unban Button | Button | - | Confirm unban action |

**Data Processing:**
- **Input Validation**: Ban reason required when banning
- **API Call - Ban**: POST `/api/recruiter/{accountId}/ban` with reason
- **API Call - Unban**: POST `/api/recruiter/{accountId}/unban`
- **Status Preservation**: Previous status stored and restored on unban

**Feedback:**
| Type | Message |
|------|---------|
| Success - Ban | "Recruiter banned successfully" |
| Success - Unban | "Recruiter unbanned successfully" |
| Error | "Failed to process action" |

---

### **5.3 Web Messages List**

| Code | Type | Message | Screen |
|------|------|---------|--------|
| MSG-ADM-001 | Success | Dashboard refreshed | Dashboard |
| MSG-ADM-002 | Success | Recruiter approved successfully! | Pending Approvals |
| MSG-ADM-003 | Success | Recruiter rejected successfully! | Pending Approvals |
| MSG-ADM-004 | Success | Job approved and activated! | Job Postings |
| MSG-ADM-005 | Success | Job rejected! | Job Postings |
| MSG-ADM-006 | Success | Recruiter banned successfully | Recruiters |
| MSG-ADM-007 | Success | Recruiter unbanned successfully | Banned Recruiters |
| MSG-ADM-008 | Success | Skill created successfully | Skills |
| MSG-ADM-009 | Success | Blog published successfully | Blog |
| MSG-ADM-010 | Success | Blog deleted | Blog |
| MSG-ADM-011 | Success | Comment approved | Moderation |
| MSG-ADM-012 | Success | Comment rejected | Moderation |
| MSG-ADM-013 | Success | Rating approved | Moderation |
| MSG-ADM-014 | Success | Rating rejected | Moderation |
| MSG-ADM-015 | Success | Broadcast notification sent successfully! | Notifications |
| MSG-ADM-016 | Success | Profile update approved | Profile Updates |
| MSG-ADM-017 | Success | Profile update rejected | Profile Updates |
| MSG-ADM-018 | Error | Failed to load dashboard | Dashboard |
| MSG-ADM-019 | Error | Failed to fetch users | User Management |
| MSG-ADM-020 | Error | Failed to fetch job postings | Job Postings |
| MSG-ADM-021 | Error | Failed to approve recruiter | Pending Approvals |
| MSG-ADM-022 | Error | Please provide a rejection reason | All reject dialogs |
| MSG-ADM-023 | Error | Please provide a ban reason | Recruiters |
| MSG-ADM-024 | Error | Skill name is required | Skills |
| MSG-ADM-025 | Error | Please fill in all required fields | Notifications |
| MSG-ADM-026 | Error | Unauthorized. Please login again. | All screens |
| MSG-ADM-027 | Error | Access denied. Admin privileges required. | All screens |
| MSG-ADM-028 | Warning | System issue detected | Dashboard |
| MSG-ADM-029 | Info | Loading... | All screens |
| MSG-ADM-030 | Info | No data found | All tables |

---

## **IV Software Architecture**

### **1.1 System Architecture (Next.js Folder Structure)**

```
src/
├── app/                          # App Router (Next.js 15)
│   ├── admin/                   # Admin module
│   │   ├── page.tsx             # Admin Dashboard
│   │   ├── layout.tsx           # Admin layout
│   │   ├── banned-recruiters/   # Banned recruiters management
│   │   │   └── page.tsx
│   │   ├── blog/                # Blog management
│   │   │   └── page.tsx
│   │   ├── job-postings/        # Job postings management
│   │   │   └── page.tsx
│   │   ├── moderation/          # Content moderation
│   │   │   └── page.tsx
│   │   ├── notifications/       # Broadcast notifications
│   │   │   └── page.tsx
│   │   ├── pending-approval/    # Pending recruiter approvals
│   │   │   └── page.tsx
│   │   ├── profile-updates/     # Profile update requests
│   │   │   └── page.tsx
│   │   ├── recruiters/          # Recruiter management
│   │   │   └── page.tsx
│   │   ├── skills/              # Skill management
│   │   │   └── page.tsx
│   │   └── user-management/     # User management
│   │       ├── page.tsx
│   │       └── loading.tsx
│   │
├── components/                   # Shared components
│   ├── ui/                      # UI primitives
│   └── shared/                  # Shared business components
│
├── lib/                         # Utility libraries
│   ├── admin-dashboard-api.ts  # Dashboard stats API
│   ├── admin-job-api.ts        # Job postings API
│   ├── admin-moderation-api.ts # Moderation API
│   ├── recruiter-api.ts        # Recruiter management API
│   ├── user-api.ts             # User management API
│   ├── skill-api.ts            # Skill management API
│   ├── blog-api.ts             # Blog management API
│   └── auth-admin.ts           # Admin auth utilities
│
├── modules/                     # Feature modules
│   └── admin/                  # Admin-specific modules
│       ├── dashboard/          # Dashboard components
│       │   └── components/
│       │       └── AdminDashboard.tsx
│       └── blog/               # Blog management
│           └── components/
│               ├── BlogManagement.tsx
│               ├── CommentModeration.tsx
│               ├── RatingModeration.tsx
│               ├── ConfirmDialog.tsx
│               └── BlogStatusBadge.tsx
│
├── types/                       # TypeScript types
│   ├── user.ts                 # User types
│   ├── recruiter.ts            # Recruiter types
│   └── blog.ts                 # Blog types
│
└── hooks/                       # Custom React hooks
    └── useAdminCheck.ts        # Admin role verification
```

### **1.2.2 Front-end Package Diagram**

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            ADMIN MODULE PACKAGES                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐          │
│  │     Pages        │    │   Components     │    │     Modules      │          │
│  │   (app/admin)    │    │  (components/)   │    │   (modules/)     │          │
│  └────────┬─────────┘    └────────┬─────────┘    └────────┬─────────┘          │
│           │                       │                       │                     │
│           └───────────────────────┼───────────────────────┘                     │
│                                   │                                             │
│                                   ▼                                             │
│           ┌───────────────────────────────────────────────┐                     │
│           │                  Libraries                     │                     │
│           │                   (lib/)                       │                     │
│           ├───────────────────────────────────────────────┤                     │
│           │ • admin-dashboard-api.ts                      │                     │
│           │ • admin-job-api.ts                            │                     │
│           │ • admin-moderation-api.ts                     │                     │
│           │ • recruiter-api.ts                            │                     │
│           │ • user-api.ts                                 │                     │
│           │ • skill-api.ts                                │                     │
│           │ • blog-api.ts                                 │                     │
│           │ • auth-admin.ts                               │                     │
│           └───────────────────┬───────────────────────────┘                     │
│                               │                                                 │
│                               ▼                                                 │
│           ┌───────────────────────────────────────────────┐                     │
│           │              External Services                 │                     │
│           ├───────────────────────────────────────────────┤                     │
│           │ • Backend REST API                            │                     │
│           │ • Database (PostgreSQL)                       │                     │
│           │ • Kafka (Message Queue)                       │                     │
│           │ • Weaviate (Vector Search)                    │                     │
│           │ • Email Service (SMTP)                        │                     │
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
| recharts | latest | Charts and data visualization |
| @radix-ui/react-* | latest | UI primitives |

---

## **V Test**

See separate file: [Test Cases - Admin Module](./TEST_CASES_ADMIN.md)

### **Test Case Summary:**

| Module | Total Cases | Priority High | Priority Medium | Priority Low |
|--------|-------------|---------------|-----------------|--------------|
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
| **Total** | **104** | **48** | **40** | **16** |

---

## **Appendix: API Endpoints Reference**

### Dashboard & Health
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/stats` | GET | Get dashboard statistics |
| `/api/admin/health` | GET | Get system health status |

### User Management
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/users` | GET | Get paginated user list |
| `/api/users/{id}` | GET | Get user details |

### Job Postings
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/job-postings` | GET | Get all job postings with filters |
| `/api/admin/job-postings/{id}/approve` | PUT | Approve job posting |
| `/api/admin/job-postings/{id}/reject` | PUT | Reject job posting with reason |

### Recruiter Management
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/recruiter/pending` | GET | Get pending recruiters |
| `/api/recruiter/search` | GET | Search recruiters with filters |
| `/api/recruiter/{id}/approve` | POST | Approve recruiter |
| `/api/recruiter/{id}/reject` | POST | Reject recruiter with reason |
| `/api/recruiter/{accountId}/ban` | POST | Ban recruiter |
| `/api/recruiter/{accountId}/unban` | POST | Unban recruiter |

### Profile Updates
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/recruiter/profile-update-requests` | GET | Get update requests |
| `/api/recruiter/profile-update-requests/{id}/approve` | POST | Approve update |
| `/api/recruiter/profile-update-requests/{id}/reject` | POST | Reject update |

### Blog Management
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/blog/admin` | POST | Create blog |
| `/api/blog/admin/{id}` | PUT | Update blog |
| `/api/blog/admin/{id}` | DELETE | Delete blog |
| `/api/blog/admin/filter` | GET | Filter blogs |
| `/api/blog/admin/{id}/publish` | PUT | Publish blog |
| `/api/blog/admin/{id}/archive` | PUT | Archive blog |

### Moderation
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/moderation/comments` | GET | Get comments for moderation |
| `/api/admin/moderation/comments/flagged` | GET | Get flagged comments |
| `/api/admin/moderation/comments/{id}/approve` | PUT | Approve comment |
| `/api/admin/moderation/comments/{id}/reject` | PUT | Reject comment |
| `/api/admin/moderation/ratings` | GET | Get ratings for moderation |
| `/api/admin/moderation/ratings/{id}/approve` | PUT | Approve rating |
| `/api/admin/moderation/ratings/{id}/reject` | PUT | Reject rating |

### Skills
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/skills` | GET | Get all skills |
| `/api/skills` | POST | Create new skill |

### Notifications
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/notifications/broadcast` | POST | Send broadcast notification |
