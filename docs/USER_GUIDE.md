# CAPSTONE PROJECT REPORT
# Report 6 – Software User Guides
# CareerMate - Career Management Platform

**FPT University, Hanoi**  
**December 2025**

---

## Table of Contents

I. [Record of Changes](#i-record-of-changes)  
II. [Release Package & User Guides](#ii-release-package--user-guides)  
&nbsp;&nbsp;&nbsp;&nbsp;1. [Deliverable Package](#1-deliverable-package)  
&nbsp;&nbsp;&nbsp;&nbsp;2. [Installation Guides](#2-installation-guides)  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.1 [System Requirements](#21-system-requirements)  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.2 [Installation Instruction](#22-installation-instruction)  
&nbsp;&nbsp;&nbsp;&nbsp;3. [User Manual](#3-user-manual)  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3.1 [Overview](#31-overview)  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3.2 [Recruiter User Guide](#32-recruiter-user-guide)  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3.3 [Admin User Guide](#33-admin-user-guide)  

---

## I. Record of Changes

| Date | A* | M, D | In charge | Change Description |
|------|----|----|-----------|-------------------|
| 12/06/2025 | A | - | Development Team | Initial document creation |
| 12/06/2025 | A | - | Development Team | Added Recruiter workflow guides |
| 12/06/2025 | A | - | Development Team | Added Admin workflow guides |
| 12/09/2025 | M | - | Documentation Team | Updated installation instructions |

*A - Added, M - Modified, D - Deleted

---

## II. Release Package & User Guides

### 1. Deliverable Package

| No. | Deliverable Item | Description | Version |
|-----|------------------|-------------|---------|
| 1 | Project Schedule/Tracking | Project timeline and milestone tracking | v1.0 |
| 2 | Project Backlog | User stories and tasks backlog | v1.0 |
| 3 | Source Codes | Frontend (Next.js 15) and Backend source code | v1.0 |
| 4 | Database Script(s) | PostgreSQL database schema and seed data | v1.0 |
| 5 | Final Report Document | Complete project documentation | v1.0 |
| 6 | Test Cases Document | Test cases for Recruiter and Admin modules | v1.0 |
| 7 | Defects List | Known issues and bug tracking | v1.0 |
| 8 | Issues List | Outstanding issues and resolutions | v1.0 |
| 9 | Presentation Slides | Project presentation materials | v1.0 |
| 10 | SRS Documentation | Software Requirements Specification for Recruiter and Admin | v1.0 |
| 11 | API Documentation | REST API endpoints documentation | v1.0 |
| 12 | User Manual | Comprehensive user guides (this document) | v1.0 |

---

### 2. Installation Guides

#### 2.1 System Requirements

**Frontend (Next.js Application):**
- Node.js: v18.x or higher
- npm: v9.x or higher
- Operating System: Windows 10/11, macOS 11+, Linux (Ubuntu 20.04+)
- RAM: Minimum 4GB (8GB recommended)
- Disk Space: 2GB free space
- Browser: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

**Backend (Spring Boot Application):**
- Java JDK: v17 or higher
- Maven: v3.8+ or Gradle 7.6+
- PostgreSQL: v14 or higher
- Apache Kafka: v3.0+
- Weaviate: v1.20+ (Vector Database for AI features)
- RAM: Minimum 8GB (16GB recommended)
- Disk Space: 10GB free space

**Development Tools:**
- IDE: VS Code, IntelliJ IDEA, or Eclipse
- Git: v2.30+
- Docker: v20.10+ (optional, for containerized deployment)

---

#### 2.2 Installation Instruction

**A. Frontend Installation**

1. **Clone Repository**
```bash
git clone https://github.com/KhangNTT/SEP490_CareerMate-FE.git
cd SEP490_CareerMate-FE
```

2. **Install Dependencies**
```bash
npm install
```

3. **Configure Environment Variables**

Create `.env.local` file in the root directory:
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080

# Firebase Configuration (for file storage)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com

# OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

4. **Run Development Server**
```bash
npm run dev
```

Application will be available at: `http://localhost:3000`

5. **Build for Production**
```bash
npm run build
npm start
```

**B. Backend Installation**

1. **Clone Backend Repository**
```bash
git clone [backend-repo-url]
cd CareerMate-Backend
```

2. **Configure Database**

Create PostgreSQL database:
```sql
CREATE DATABASE careermate_db;
CREATE USER careermate_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE careermate_db TO careermate_user;
```

3. **Configure application.properties**
```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/careermate_db
spring.datasource.username=careermate_user
spring.datasource.password=your_password

# Kafka
spring.kafka.bootstrap-servers=localhost:9092

# Weaviate
weaviate.url=http://localhost:8080
```

4. **Run Database Migrations**
```bash
mvn flyway:migrate
```

5. **Start Backend Server**
```bash
mvn spring-boot:run
```

Backend API will be available at: `http://localhost:8080`

**C. Docker Deployment (Optional)**

1. **Docker Compose**
```bash
docker-compose up -d
```

This will start:
- Frontend (port 3000)
- Backend (port 8080)
- PostgreSQL (port 5432)
- Kafka (port 9092)
- Weaviate (port 8081)

---

### 3. User Manual

#### 3.1 Overview

**CareerMate** is a comprehensive career management platform that connects recruiters with qualified candidates. The system provides powerful tools for job posting management, candidate screening, interview scheduling, and employment tracking.

**Key Features:**
- **For Recruiters:**
  - Dashboard with real-time statistics
  - Job posting creation and management
  - Application review and candidate screening
  - Interview scheduling and management
  - Employment tracking
  - AI-powered candidate recommendations
  - Subscription package management

- **For Admins:**
  - System health monitoring
  - User management
  - Recruiter approval workflow
  - Job posting moderation
  - Content moderation (blog comments/ratings)
  - Skill management
  - Broadcast notifications

**System Architecture:**

```
┌─────────────────────────────────────────────────────────────────┐
│                         CareerMate System                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐    │
│  │   Frontend   │────▶│   Backend    │────▶│  Database    │    │
│  │  (Next.js)   │     │(Spring Boot) │     │(PostgreSQL)  │    │
│  └──────────────┘     └──────────────┘     └──────────────┘    │
│                              │                                  │
│                              ├──────────────┬─────────────┐     │
│                              ▼              ▼             ▼     │
│                       ┌──────────┐   ┌─────────┐  ┌─────────┐  │
│                       │  Kafka   │   │Weaviate │  │Firebase │  │
│                       │(Message) │   │  (AI)   │  │(Storage)│  │
│                       └──────────┘   └─────────┘  └─────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

#### 3.2 Recruiter User Guide

##### **Workflow 1: Job Posting Management**

**Purpose:** This workflow guides recruiters through creating, managing, and tracking job postings to attract qualified candidates.

**Workflow Diagram:**

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Login     │────▶│  Dashboard  │────▶│ Create Job  │────▶│ Active Jobs │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                           │                                        │
                           │                                        ▼
                           │                                 ┌─────────────┐
                           │                                 │   Manage    │
                           │                                 │   (Edit/    │
                           └────────────────────────────────▶│  Extend)    │
                                                             └─────────────┘
```

---

##### **Step 1: Access Dashboard**

**Purpose:** View overview of job posting statistics and quick access to features.

**Step-by-step Guide:**

1. **Login to System**
   - Navigate to `https://careermate.com`
   - Enter your recruiter credentials
   - Click "Sign In"

![Login Page](../public/img/user-guide/recruiter-login.png)

2. **View Dashboard**
   - After successful login, you'll be redirected to the dashboard
   - Dashboard displays:
     - Total Jobs Posted
     - Total Candidates/Applications
     - Job Overview (Active, Pending, Expired, Rejected)
     - Recent Candidates
     - Package Information

![Dashboard](../public/img/user-guide/recruiter-dashboard.png)

**Key Metrics Explained:**
- **Jobs Posted:** Total number of job postings you've created
- **Candidates:** Total applications received across all jobs
- **Active Jobs:** Jobs currently visible to candidates
- **Pending Jobs:** Jobs awaiting admin approval
- **Expired Jobs:** Jobs that have passed their expiration date
- **Rejected Jobs:** Jobs rejected by admin during review

---

##### **Step 2: Create New Job Posting**

**Purpose:** Create and publish a new job posting to attract candidates.

**Prerequisites:**
- Active subscription package (BASIC, PROFESSIONAL, or ENTERPRISE)
- Package must have available job posting quota

**Step-by-step Guide:**

1. **Navigate to Create Job**
   - From Dashboard, click "Post New Job" in Quick Actions section
   - OR click "Create Job Post" button in the header
   - OR navigate to `/recruiter/recruiter-feature/jobs/create`

2. **Check Job Posting Quota**
   - System automatically displays your current quota at the top
   - Example: "Job Posting Limit: 3 / 5 (BASIC)"
   - If limit reached, you'll see "Limit Reached" message with upgrade prompt

![Job Quota Banner](../public/img/user-guide/job-quota.png)

3. **Fill Job Details Form**

**Required Fields:**

| Field | Description | Example |
|-------|-------------|---------|
| Job Title | Position name | "Senior Full Stack Developer" |
| Job Description | Detailed role description | "We are looking for an experienced..." |
| Work Address | Job location | "123 Tech Street, Hanoi" |
| Expiration Date | When posting expires | "2025-12-31" |
| Years of Experience | Required experience | "3-5 years" |
| Work Model | Work arrangement | REMOTE / ONSITE / HYBRID |
| Salary Range | Compensation range | "1500-2500 USD" |
| Job Package | Posting type | BASIC / PREMIUM / URGENT |

![Create Job Form](../public/img/user-guide/create-job-form.png)

4. **Add Required Skills (Optional)**
   - Click "Add Skill" button
   - Select skill from dropdown (e.g., "JavaScript", "React", "Node.js")
   - Toggle "Must Have" if skill is mandatory
   - Click "Add" to confirm
   - Repeat for all required skills
   - Click "X" icon to remove a skill

![Add Skills](../public/img/user-guide/add-skills.png)

5. **Preview and Submit**
   - Review all entered information
   - Click "Create Job Posting" button
   - System validates all required fields
   - If validation passes, job is created

6. **Handle Validation Errors**

Common validation errors:
- "Job Title is required" → Enter job title
- "Description is too short" → Add more details (minimum 50 characters)
- "Expiration date must be in the future" → Select future date
- "You have reached your job posting limit" → Upgrade package

7. **Confirmation**
   - Success message: "Job posting created successfully"
   - Job appears in your job list with status "PENDING"
   - Job will be reviewed by admin before becoming "ACTIVE"

![Success Message](../public/img/user-guide/job-created-success.png)

---

##### **Step 3: Manage Active Jobs**

**Purpose:** View, edit, extend, and manage your active job postings.

**Step-by-step Guide:**

1. **Access Active Jobs**
   - Click "Manage Jobs" in Dashboard Quick Actions
   - OR navigate to `/recruiter/recruiter-feature/jobs/active`

2. **View Job List**
   - Table displays all your active jobs with:
     - Job Title
     - Status (ACTIVE badge in green)
     - Creation Date
     - Expiration Date
     - Number of Applications
     - Action Buttons

![Active Jobs List](../public/img/user-guide/active-jobs-list.png)

3. **View Job Statistics**
   - Click "View Stats" button on a job
   - Modal displays:
     - Total Views
     - Total Applications
     - Application Status Breakdown
     - Recent Activity

![Job Stats](../public/img/user-guide/job-stats.png)

4. **Extend Job Posting**
   - Click "Extend" button
   - Select extension period (7, 14, 30 days)
   - Click "Confirm Extension"
   - New expiration date is calculated and displayed
   - Success message confirms extension

![Extend Job](../public/img/user-guide/extend-job.png)

5. **Edit Job Details**
   - Click "Edit" button
   - Modify job information
   - Click "Save Changes"
   - Job is updated (may require admin re-approval)

6. **AI-Powered Recommendations (ENTERPRISE only)**
   - Click "AI Recommendations" button
   - System analyzes job requirements
   - Displays matched candidates with:
     - Match Score (percentage)
     - Candidate Profile
     - Key Skills Match
     - Experience Match
   - Click "Contact" to reach out to candidate

![AI Recommendations](../public/img/user-guide/ai-recommendations.png)

**Note:** AI Recommendations feature requires ENTERPRISE package subscription.

---

##### **Workflow 2: Application Review & Interview Management**

**Purpose:** This workflow guides recruiters through reviewing applications, scheduling interviews, and managing the hiring process.

**Workflow Diagram:**

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│Applications │────▶│   Review    │────▶│  Schedule   │────▶│  Interview  │
│    List     │     │  & Filter   │     │  Interview  │     │  Management │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                           │                                        │
                           ▼                                        ▼
                    ┌─────────────┐                         ┌─────────────┐
                    │  Approve/   │                         │  Complete   │
                    │   Reject    │                         │  Interview  │
                    └─────────────┘                         └─────────────┘
                           │                                        │
                           ▼                                        ▼
                    ┌─────────────┐                         ┌─────────────┐
                    │   Create    │                         │  Employment │
                    │ Employment  │◀────────────────────────│   Created   │
                    └─────────────┘                         └─────────────┘
```

---

##### **Step 1: Review Applications**

**Purpose:** View and manage job applications from candidates.

**Step-by-step Guide:**

1. **Access Applications**
   - From Dashboard, click "View Applications" in Quick Actions
   - OR navigate to `/recruiter/recruiter-feature/candidates/applications`

2. **View Application List**
   - Table displays all applications with:
     - Candidate Name
     - Job Title Applied
     - Phone Number
     - Email
     - Status Badge
     - Applied Date
     - Action Buttons

![Applications List](../public/img/user-guide/applications-list.png)

3. **Filter Applications**
   - Use status dropdown to filter:
     - ALL
     - SUBMITTED (New applications)
     - REVIEWING (Under review)
     - INTERVIEW_SCHEDULED
     - INTERVIEWED
     - APPROVED
     - WORKING
     - REJECTED
     - WITHDRAWN
     - BANNED

4. **Search Candidates**
   - Enter candidate name or email in search box
   - Results update in real-time

5. **View Application Details**
   - Click on application row or "View" button
   - Modal displays:
     - Full Name
     - Job Applied
     - Phone & Email
     - Preferred Work Location
     - Status
     - Application Date
     - CV Link (if package allows)

![Application Details](../public/img/user-guide/application-details.png)

---

##### **Step 2: Review Candidate CV**

**Purpose:** Access and review candidate's CV/resume.

**Prerequisites:**
- Package with CV_VIEW entitlement (PROFESSIONAL or ENTERPRISE)

**Step-by-step Guide:**

1. **Check CV View Access**
   - System automatically checks your package entitlement
   - If you have access, "View CV" button is blue and enabled
   - If no access, "View CV" button is grayed with lock icon

2. **View CV (With Access)**
   - Click "View CV" button
   - CV opens in new browser tab
   - You can download or print CV from browser

3. **Upgrade for CV Access (Without Access)**
   - Click locked "View CV" button
   - Toast notification: "You need to upgrade your package to view CV"
   - Click notification or go to Billing page
   - Upgrade to PROFESSIONAL or ENTERPRISE package

![CV View Locked](../public/img/user-guide/cv-view-locked.png)

---

##### **Step 3: Change Application Status**

**Purpose:** Move application through hiring pipeline stages.

**Application Status Flow:**

```
SUBMITTED → REVIEWING → INTERVIEW_SCHEDULED → INTERVIEWED → APPROVED → WORKING
     │           │              │                  │            │
     ▼           ▼              ▼                  ▼            ▼
  REJECTED    REJECTED       REJECTED          REJECTED     TERMINATED
```

**Available Actions by Status:**

| Current Status | Available Actions |
|----------------|-------------------|
| SUBMITTED | Set Reviewing, Approve, Reject, Ban |
| REVIEWING | Schedule Interview, Approve, Reject |
| INTERVIEW_SCHEDULED | View Interview, Reschedule, Cancel |
| INTERVIEWED | Approve, Reject |
| APPROVED | Create Employment |
| WORKING | Terminate Employment |

**Step-by-step Guide:**

1. **Set to Reviewing**
   - Click "Review" button
   - Status changes to "REVIEWING"
   - Candidate receives notification

2. **Approve Application**
   - Click "Approve" button
   - Confirmation dialog appears
   - Click "Confirm"
   - Status changes to "APPROVED"
   - Next step: Create Employment

3. **Reject Application**
   - Click "Reject" button
   - Rejection dialog opens
   - Enter rejection reason (required)
   - Click "Confirm Rejection"
   - Status changes to "REJECTED"
   - Candidate receives rejection email

![Reject Dialog](../public/img/user-guide/reject-application.png)

4. **Ban Candidate**
   - Click "Ban" button (use carefully)
   - Enter ban reason
   - Click "Confirm Ban"
   - Candidate is banned from future applications
   - Status changes to "BANNED"

---

##### **Step 4: Schedule Interview**

**Purpose:** Set up interview with candidate.

**Step-by-step Guide:**

1. **Navigate to Interview Scheduling**
   - From application with status "REVIEWING"
   - Click "Schedule Interview" button
   - Redirects to `/recruiter/interviews/schedule?applicationId={id}`

2. **Fill Interview Details**

**Required Information:**

| Field | Description | Example |
|-------|-------------|---------|
| Interview Type | Meeting format | VIDEO_CALL / IN_PERSON / PHONE |
| Date | Interview date | "2025-12-15" |
| Time | Interview time | "14:00" |
| Duration | Expected duration | "60 minutes" |
| Location/Link | Meeting location or video link | "https://meet.google.com/xyz" |
| Notes | Additional instructions | "Please prepare portfolio" |

![Schedule Interview](../public/img/user-guide/schedule-interview.png)

3. **Interview Types Explained**

- **VIDEO_CALL:** Online meeting via Zoom, Google Meet, Teams, etc.
  - Provide meeting link
  - Test link before interview

- **IN_PERSON:** Physical office interview
  - Provide complete address
  - Include building/floor/room details
  - Mention parking availability

- **PHONE:** Phone interview
  - Provide contact number
  - Specify who calls whom

4. **Submit Interview Schedule**
   - Review all details
   - Click "Schedule Interview"
   - System validates date/time (must be future)
   - Confirmation email sent to candidate
   - Application status changes to "INTERVIEW_SCHEDULED"

5. **Confirmation**
   - Success message displayed
   - Interview appears in your Interview Management page
   - Candidate receives email notification with details

---

##### **Step 5: Manage Interviews**

**Purpose:** Track upcoming interviews and handle reschedule requests.

**Step-by-step Guide:**

1. **Access Interview Management**
   - Navigate to `/recruiter/interviews`
   - Two tabs available:
     - Upcoming Interviews
     - Reschedule Requests

![Interview Management](../public/img/user-guide/interview-management.png)

2. **View Upcoming Interviews**
   - Lists all scheduled interviews
   - Displays:
     - Candidate Name
     - Job Position
     - Interview Type
     - Date & Time
     - Location/Link
     - Status

3. **Complete Interview**
   - Click "Complete" button after interview
   - Complete Interview dialog opens
   - Select Result:
     - **PASS:** Candidate performed well
     - **FAIL:** Candidate did not meet requirements
     - **PENDING:** Need more time to decide
     - **NEEDS_SECOND_ROUND:** Requires another interview
   - Enter Feedback (optional but recommended)
   - Click "Submit Result"

![Complete Interview](../public/img/user-guide/complete-interview.png)

4. **Handle Reschedule Requests**
   - Switch to "Reschedule Requests" tab
   - View candidate's reschedule reason
   - Choose action:
     - **Approve:** Accept new date/time
     - **Reject:** Decline reschedule, keep original time
   - Enter response message
   - Click "Submit"

5. **Cancel Interview**
   - Click "Cancel" button
   - Enter cancellation reason
   - Click "Confirm Cancellation"
   - Candidate receives notification
   - Application status reverts to "REVIEWING"

---

##### **Step 6: Create Employment**

**Purpose:** Officially onboard approved candidate as employee.

**Step-by-step Guide:**

1. **Prerequisites**
   - Application status must be "APPROVED"
   - Interview completed with PASS result

2. **Navigate to Employment Creation**
   - From approved application, click "Create Employment"
   - Redirects to `/recruiter/employments/create?applicationId={id}`

3. **Fill Employment Details**

**Required Information:**

| Field | Description | Example |
|-------|-------------|---------|
| Start Date | First working day | "2025-12-20" |
| Position | Job title | "Full Stack Developer" |
| Probation Period | Trial period in days | "90" |
| Salary | Monthly salary | "2000 USD" |
| Contract Type | Employment type | FULL_TIME / PART_TIME / CONTRACT |

![Create Employment](../public/img/user-guide/create-employment.png)

4. **Submit Employment**
   - Review all details
   - Click "Create Employment"
   - System creates employment record
   - Application status changes to "WORKING"
   - Welcome email sent to employee

5. **Manage Employment**
   - Navigate to `/recruiter/employments`
   - View all active employees
   - Monitor probation status
   - Track employment duration

---

##### **Step 7: Terminate Employment**

**Purpose:** End employment relationship with employee.

**Step-by-step Guide:**

1. **Access Employments**
   - Navigate to `/recruiter/employments`
   - Lists all active employments

2. **Select Employment to Terminate**
   - Click "Terminate" button on employee card
   - Termination dialog opens

3. **Fill Termination Details**

**Required Information:**

| Field | Description |
|-------|-------------|
| Termination Type | Reason category (dropdown) |
| Termination Date | Last working day |
| Reason | Detailed explanation (optional) |

**Termination Types:**
- RESIGNATION: Employee resigned
- FIRED_PERFORMANCE: Fired due to performance
- FIRED_MISCONDUCT: Fired due to misconduct
- CONTRACT_END: Contract ended
- MUTUAL_AGREEMENT: Mutual agreement
- PROBATION_FAILED: Failed probation
- COMPANY_CLOSURE: Company closure
- LAYOFF: Laid off

![Terminate Employment](../public/img/user-guide/terminate-employment.png)

4. **Submit Termination**
   - Select termination type
   - Enter termination date
   - Add reason if needed
   - Click "Confirm Termination"
   - Employee removed from active list
   - Final documentation generated

---

##### **Workflow 3: Package Management & Billing**

**Purpose:** Manage subscription packages and upgrade features.

**Step-by-step Guide:**

1. **Access Billing Page**
   - Navigate to `/recruiter/recruiter-feature/profile/billing`
   - View available packages

2. **Package Comparison**

| Feature | BASIC (Free) | PROFESSIONAL | ENTERPRISE |
|---------|--------------|--------------|------------|
| Job Postings | 5 | 20 | Unlimited |
| CV View | ❌ | ✅ | ✅ |
| AI Matching | ❌ | ❌ | ✅ |
| Support | Email | Priority | 24/7 |
| Price | Free | Contact Sales | Contact Sales |

![Package Comparison](../public/img/user-guide/package-comparison.png)

3. **Select Package**
   - Click on desired package card
   - Package is highlighted
   - "Continue" button becomes active

4. **Upgrade Process**
   - Click "Continue" button
   - Redirects to confirmation page
   - Review package details and price
   - Select payment method (VNPay, Credit Card, etc.)
   - Complete payment
   - Package activated immediately

5. **View Current Package**
   - Current package shown with "Active" badge
   - View package details modal shows:
     - Package Name
     - Amount Paid
     - Start Date
     - Valid Until
     - Status

---

#### 3.3 Admin User Guide

##### **Workflow 1: System Monitoring & Health Check**

**Purpose:** Monitor system health, view statistics, and ensure platform stability.

**Workflow Diagram:**

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Login     │────▶│  Dashboard  │────▶│   System    │
│   (Admin)   │     │  Overview   │     │   Health    │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           ├──────────┬──────────┬──────────┐
                           ▼          ▼          ▼          ▼
                      ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
                      │ Users  │ │Recruit-│ │  Jobs  │ │Content │
                      │  Mgmt  │ │ers Mgmt│ │  Mgmt  │ │Moderate│
                      └────────┘ └────────┘ └────────┘ └────────┘
```

---

##### **Step 1: Access Admin Dashboard**

**Purpose:** View system overview and key metrics.

**Step-by-step Guide:**

1. **Login as Admin**
   - Navigate to `https://careermate.com/admin`
   - Enter admin credentials
   - Click "Sign In"

2. **Dashboard Overview**
   - System displays:
     - System Health Banner
     - User Statistics
     - User Role Distribution Chart
     - Account Status Chart
     - Pending Items Count
     - Quick Access Links

![Admin Dashboard](../public/img/user-guide/admin-dashboard.png)

3. **System Health Status**

**Health Indicators:**
- **Database Status:** UP/DOWN
- **Kafka Status:** UP/DOWN
- **Weaviate Status:** UP/DOWN
- **Email Service Status:** UP/DOWN

**System Status:**
- 🟢 **Green Banner:** All systems operational
- 🔴 **Red Banner:** System issue detected

![System Health](../public/img/user-guide/system-health.png)

4. **Key Statistics**
   - **Total Users:** All registered users
   - **Candidates:** Total candidate accounts
   - **Recruiters:** Total recruiter accounts
   - **Admins:** Total admin accounts
   - **Active Accounts:** Verified and active
   - **Pending Accounts:** Awaiting approval
   - **Banned Accounts:** Banned users
   - **Rejected Accounts:** Rejected registrations

5. **Auto Refresh**
   - Dashboard auto-refreshes every 30 seconds
   - Manual refresh available via "Refresh" button

---

##### **Workflow 2: Recruiter Approval Management**

**Purpose:** Review, approve, or reject new recruiter registrations.

**Workflow Diagram:**

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Pending   │────▶│   Review    │────▶│  Approve/   │
│  Recruiters │     │   Details   │     │   Reject    │
└─────────────┘     └─────────────┘     └─────────────┘
                                               │
                                ┌──────────────┴──────────────┐
                                ▼                             ▼
                         ┌─────────────┐             ┌─────────────┐
                         │  Approved   │             │  Rejected   │
                         │  (Active)   │             │ (w/ Reason) │
                         └─────────────┘             └─────────────┘
```

---

##### **Step 1: View Pending Approvals**

**Step-by-step Guide:**

1. **Access Pending Approvals**
   - From Admin Dashboard, click "Pending Approvals"
   - OR navigate to `/admin/pending-approval`

2. **View Recruiter List**
   - Table displays:
     - Company Name
     - Contact Person
     - Email
     - Phone
     - Industry
     - Registration Date
     - Action Buttons

![Pending Approvals](../public/img/user-guide/pending-approvals.png)

3. **Search Recruiters**
   - Enter company name or email in search box
   - Results filter in real-time

---

##### **Step 2: Review Recruiter Details**

**Step-by-step Guide:**

1. **Open Details Modal**
   - Click "View Details" button on recruiter row
   - Modal displays complete information:
     - Company Information
     - Contact Details
     - Business Description
     - Industry
     - Registration Date

![Recruiter Details](../public/img/user-guide/recruiter-details.png)

2. **Verify Information**
   - Check company name validity
   - Verify contact email and phone
   - Review business description
   - Assess industry appropriateness

---

##### **Step 3: Approve Recruiter**

**Step-by-step Guide:**

1. **Click Approve Button**
   - In details modal or from table row
   - Confirmation dialog appears

2. **Confirm Approval**
   - Review company name one final time
   - Click "Confirm Approval"
   - System processes approval

3. **Result**
   - Success message: "Recruiter approved successfully!"
   - Recruiter account status changes to "APPROVED"
   - Welcome email sent to recruiter
   - Recruiter removed from pending list
   - Recruiter can now log in and post jobs

![Approve Success](../public/img/user-guide/approve-success.png)

---

##### **Step 4: Reject Recruiter**

**Step-by-step Guide:**

1. **Click Reject Button**
   - Rejection dialog opens

2. **Select Rejection Reason**
   - Choose from common reasons:
     - Incomplete company information
     - Invalid business documents
     - Duplicate registration
     - Suspicious activity
     - Other (custom reason)

![Reject Dialog](../public/img/user-guide/reject-recruiter.png)

3. **Enter Custom Reason (if selected "Other")**
   - Type detailed rejection reason
   - Be specific and professional

4. **Submit Rejection**
   - Click "Confirm Rejection"
   - System processes rejection

5. **Result**
   - Success message: "Recruiter rejected successfully!"
   - Recruiter account status changes to "REJECTED"
   - Rejection email sent with reason
   - Recruiter removed from pending list
   - Account cannot log in

---

##### **Workflow 3: Job Posting Moderation**

**Purpose:** Review and moderate job postings from recruiters.

**Step-by-step Guide:**

1. **Access Job Postings**
   - Navigate to `/admin/job-postings`
   - View all job postings

2. **Filter by Status**
   - Select status filter:
     - ALL
     - PENDING (requires review)
     - ACTIVE
     - REJECTED
     - EXPIRED

![Job Postings List](../public/img/user-guide/admin-job-postings.png)

3. **Review Job Details**
   - Click "View" button
   - Review:
     - Job Title
     - Company
     - Description
     - Requirements
     - Salary Range
     - Location
     - Work Model

4. **Approve Job**
   - Click "Approve" button
   - Confirmation dialog
   - Click "Confirm"
   - Job status changes to "ACTIVE"
   - Visible to candidates

5. **Reject Job**
   - Click "Reject" button
   - Enter rejection reason:
     - Inappropriate content
     - Misleading information
     - Incomplete details
     - Violates policies
   - Click "Submit"
   - Job status changes to "REJECTED"
   - Recruiter notified

---

##### **Workflow 4: User & Recruiter Management**

**Purpose:** Manage all users and recruiters in the system.

##### **Step 1: User Management**

1. **Access User Management**
   - Navigate to `/admin/user-management`
   - View all system users

![User Management](../public/img/user-guide/user-management.png)

2. **Search Users**
   - Enter username, email, or role
   - Filter results in real-time

3. **View User Details**
   - Click "View" button
   - See complete user profile
   - View roles and permissions

4. **Role Identification**
   - **ADMIN:** Red badge
   - **RECRUITER:** Blue badge
   - **CANDIDATE:** Green badge

---

##### **Step 2: Recruiter Management**

1. **Access Recruiter Management**
   - Navigate to `/admin/recruiters`
   - View all recruiters (all statuses)

2. **Filter by Status**
   - ALL
   - PENDING
   - APPROVED
   - ACTIVE
   - REJECTED
   - BANNED

![Recruiter Management](../public/img/user-guide/recruiter-management.png)

3. **Ban Recruiter**

**When to Ban:**
- Violation of terms of service
- Posting fake jobs
- Harassing candidates
- Fraudulent activity

**Steps:**
- Click "Ban" button
- Enter ban reason (required)
- Click "Confirm Ban"
- Recruiter account banned
- Previous status stored
- Recruiter cannot log in

4. **Unban Recruiter**
   - Navigate to `/admin/banned-recruiters`
   - Click "Unban" button
   - Confirm unban
   - Previous status restored
   - Recruiter can log in again

---

##### **Workflow 5: Content Moderation**

**Purpose:** Moderate user-generated content (comments and ratings on blog posts).

##### **Step 1: Comment Moderation**

1. **Access Moderation**
   - Navigate to `/admin/moderation`
   - Select "Comments" tab

![Comment Moderation](../public/img/user-guide/comment-moderation.png)

2. **View Flagged Comments**
   - Click "Flagged" subtab
   - See comments reported by users
   - View flag reason

3. **Review Comment**
   - Read comment content
   - Check user information
   - View associated blog post

4. **Moderate Comment**

**Options:**
- **Approve:** Comment is acceptable
  - Click "Approve"
  - Comment visible to all
  - Flag removed

- **Reject:** Comment violates policy
  - Click "Reject"
  - Comment hidden from public
  - User notified

- **Delete:** Permanently remove
  - Click "Delete"
  - Confirm deletion
  - Comment removed from database

5. **View Statistics**
   - Total comments
   - Flagged comments
   - Approved comments
   - Rejected comments

---

##### **Step 2: Rating Moderation**

1. **Switch to Ratings Tab**
   - Click "Ratings" tab
   - View all blog post ratings

2. **Review Ratings**
   - See rating value (stars)
   - Read rating comment
   - Check user who rated

3. **Moderate Ratings**
   - Same options as comments
   - Approve, Reject, or Delete

---

##### **Workflow 6: Skill Management**

**Purpose:** Manage the list of skills available for job postings.

**Step-by-step Guide:**

1. **Access Skill Management**
   - Navigate to `/admin/skills`
   - View all skills

![Skill Management](../public/img/user-guide/skill-management.png)

2. **Search Skills**
   - Enter skill name in search box
   - Click "Search" or press Enter

3. **Create New Skill**
   - Click "Create Skill" button
   - Enter skill name (e.g., "TypeScript", "Docker")
   - Click "Create"
   - Success message displayed
   - Skill added to list

4. **View Skill Usage**
   - "Usage Count" column shows how many jobs use this skill
   - Helps identify popular skills

5. **Edit Skill**
   - Click "Edit" button (if available)
   - Modify skill name
   - Save changes

6. **Delete Skill**
   - Click "Delete" button
   - Confirmation dialog
   - Warning if skill is in use
   - Confirm deletion

---

##### **Workflow 7: Broadcast Notifications**

**Purpose:** Send system-wide notifications to users.

**Step-by-step Guide:**

1. **Access Notifications**
   - Navigate to `/admin/notifications`

![Broadcast Notifications](../public/img/user-guide/broadcast-notifications.png)

2. **Fill Notification Form**

**Required Fields:**

| Field | Description | Example |
|-------|-------------|---------|
| Title | Notification headline | "System Maintenance Notice" |
| Message | Detailed message | "The system will undergo maintenance..." |
| Priority | Importance level | LOW/MEDIUM/HIGH/URGENT |
| Target Role | Recipient group | ALL/CANDIDATE/RECRUITER/ADMIN |

3. **Select Priority**

- **LOW:** General information
- **MEDIUM:** Normal importance
- **HIGH:** Important updates
- **URGENT:** Critical notifications (red highlight)

4. **Select Target Role**

- **ALL:** Send to everyone
- **CANDIDATE:** Candidates only
- **RECRUITER:** Recruiters only
- **ADMIN:** Admins only

5. **Send Notification**
   - Review message
   - Click "Send Broadcast"
   - Confirmation dialog
   - Click "Confirm"
   - Notification sent
   - Success message displayed

6. **Notification Delivery**
   - In-app notification appears to users
   - Email notification sent (if configured)
   - Push notification (if mobile app available)

---

##### **Workflow 8: Profile Update Requests**

**Purpose:** Review and approve/reject recruiter profile update requests.

**Step-by-step Guide:**

1. **Access Profile Updates**
   - Navigate to `/admin/profile-updates`

2. **View Requests**
   - List of all update requests
   - Filter by status:
     - ALL
     - PENDING
     - APPROVED
     - REJECTED

![Profile Update Requests](../public/img/user-guide/profile-update-requests.png)

3. **Review Request**
   - Click "View" button
   - Comparison modal shows:
     - **Current Value:** Existing profile data
     - **Requested Value:** New data recruiter wants
   - Review changed fields

4. **Approve Update**
   - Click "Approve" button
   - Add admin note (optional)
   - Click "Confirm"
   - Profile updated
   - Recruiter notified

5. **Reject Update**
   - Click "Reject" button
   - Enter rejection reason (required)
   - Click "Submit"
   - Profile unchanged
   - Recruiter notified with reason

---

##### **Workflow 9: Blog Management**

**Purpose:** Create, edit, and manage blog posts.

**Step-by-step Guide:**

1. **Access Blog Management**
   - Navigate to `/admin/blog`

2. **View Blog List**
   - All published and draft blogs
   - Filter by:
     - Status (DRAFT/PUBLISHED/ARCHIVED)
     - Category
   - Sort by date, views, etc.

![Blog Management](../public/img/user-guide/blog-management.png)

3. **Create New Blog**
   - Click "Create Blog" button
   - Fill blog details:
     - Title
     - Content (Rich text editor)
     - Category
     - Featured Image
     - Tags
   - Click "Save as Draft" or "Publish"

4. **Edit Blog**
   - Click "Edit" button on blog
   - Modify content
   - Save changes

5. **Publish Blog**
   - Select draft blog
   - Click "Publish" button
   - Blog becomes visible to public

6. **Archive Blog**
   - Click "Archive" button
   - Blog hidden from public
   - Can be restored later

7. **Delete Blog**
   - Click "Delete" button
   - Confirmation required
   - Blog permanently removed

---

## Appendix A: Troubleshooting

### Common Issues and Solutions

#### Issue 1: Cannot Login
**Problem:** Login fails with invalid credentials  
**Solution:**
1. Verify username/email and password
2. Check Caps Lock is off
3. Try "Forgot Password" link
4. Contact admin if account is locked

#### Issue 2: Job Posting Limit Reached
**Problem:** Cannot create new job posting  
**Solution:**
1. Check current package quota
2. Delete expired/draft jobs
3. Upgrade to higher package tier
4. Contact support for temporary increase

#### Issue 3: CV View Not Available
**Problem:** Cannot view candidate CV  
**Solution:**
1. Verify package includes CV_VIEW entitlement
2. Upgrade to PROFESSIONAL or ENTERPRISE
3. Clear browser cache
4. Try different browser

#### Issue 4: Interview Scheduling Failed
**Problem:** Cannot schedule interview  
**Solution:**
1. Ensure date/time is in future
2. Check all required fields filled
3. Verify meeting link format (for video calls)
4. Try again with different time slot

#### Issue 5: Payment Failed
**Problem:** Package upgrade payment unsuccessful  
**Solution:**
1. Check payment card details
2. Ensure sufficient balance
3. Try different payment method
4. Contact payment gateway support
5. Contact CareerMate support

---

## Appendix B: Keyboard Shortcuts

### General Shortcuts
- **Ctrl/Cmd + K:** Global search
- **Ctrl/Cmd + /:** Show shortcuts help
- **Esc:** Close modal/dialog

### Recruiter Shortcuts
- **Ctrl/Cmd + J:** Create new job
- **Ctrl/Cmd + A:** View applications
- **Ctrl/Cmd + I:** View interviews

### Admin Shortcuts
- **Ctrl/Cmd + D:** Go to dashboard
- **Ctrl/Cmd + U:** User management
- **Ctrl/Cmd + R:** Recruiter management

---

## Appendix C: Contact & Support

### Technical Support
- **Email:** support@careermate.com
- **Phone:** +84 (24) 1234 5678
- **Hours:** Monday - Friday, 9:00 - 18:00 (GMT+7)

### Sales Inquiries
- **Email:** sales@careermate.com
- **Phone:** +84 (24) 1234 5679

### Bug Reports
- **GitHub Issues:** https://github.com/KhangNTT/SEP490_CareerMate-FE/issues
- **Email:** bugs@careermate.com

### Documentation
- **API Docs:** https://api.careermate.com/docs
- **Developer Guide:** https://docs.careermate.com

---

## Appendix D: Glossary

| Term | Definition |
|------|------------|
| **Application** | Job application submitted by candidate |
| **Entitlement** | Feature access permission based on package |
| **Job Posting** | Published job vacancy |
| **Package** | Subscription tier (BASIC/PROFESSIONAL/ENTERPRISE) |
| **Quota** | Limit on number of job postings |
| **Recruiter** | Company user who posts jobs |
| **Candidate** | Job seeker who applies for jobs |
| **Admin** | System administrator |
| **Moderation** | Review and approval of content |
| **CV** | Curriculum Vitae / Resume |
| **AI Matching** | Automated candidate recommendation |

---

**Document Version:** 1.0  
**Last Updated:** December 9, 2025  
**Prepared by:** CareerMate Development Team  
**FPT University, Hanoi**
