# Resume API Integration Summary

## Tổng quan

Đã tích hợp hoàn chỉnh Resume API vào trang CM Profile để quản lý resume data của candidate. Thay vì sử dụng `resumeId: 0` cứng, giờ đây hệ thống sẽ fetch resume data từ API `/api/resume` và sử dụng resumeId thực tế.

## Luồng hoạt động

### 1. **Load Resume Data** (Component Mount)

```typescript
useEffect(() => {
  const fetchResumeData = async () => {
    const response = await api.get("/api/resume");
    const resume = response.data.result[0]; // Get first resume
    
    setResumeId(resume.resumeId); // ✅ Lưu resumeId vào state
    
    // Load all resume sections
    - About Me
    - Awards
    - Education
    - Highlight Projects
    - Work Experience
    - Foreign Languages
    - Certificates
  };
  
  fetchResumeData();
}, []);
```

### 2. **Add Award with Real ResumeId**

```typescript
const handleSaveAward = async () => {
  if (!resumeId) {
    toast.error("Resume ID not found. Please refresh the page.");
    return;
  }
  
  const awardData: AwardData = {
    resumeId: resumeId, // ✅ Dùng resumeId từ state
    name: awardName,
    organization: awardOrg,
    getDate: `${awardYear}-${awardMonth}-25`,
    description: awardDesc || undefined
  };
  
  const response = await addAward(awardData);
  toast.success("Award added successfully!");
};
```

## Thay đổi chính

### A. **State Management**

#### Thêm Resume State
```typescript
const [resumeId, setResumeId] = useState<number | null>(null);
const [isLoadingResume, setIsLoadingResume] = useState(true);
```

#### Thêm Array States cho Sections
```typescript
const [educations, setEducations] = useState<Array<{...}>>([]);
const [workExperiences, setWorkExperiences] = useState<Array<{...}>>([]);
// selectedLanguages đã có sẵn
// awards đã có sẵn  
// projects đã có sẵn
// certificates đã có sẵn
```

### B. **Resume API Library** (`src/lib/resume-api.ts`)

#### API Endpoints được implement:

1. **Awards API**
   - ✅ `addAward()` - POST /api/award
   - ✅ `getAwardsByResumeId()` - GET /api/award/{resumeId}
   - ✅ `updateAward()` - PUT /api/award/{id}
   - ✅ `deleteAward()` - DELETE /api/award/{id}

2. **Education API**
   - ✅ `addEducation()` - POST /api/education
   - ✅ `deleteEducation()` - DELETE /api/education/{id}

3. **Certificate API**
   - ✅ `addCertificate()` - POST /api/certificate
   - ✅ `deleteCertificate()` - DELETE /api/certificate/{id}

4. **Highlight Project API**
   - ✅ `addHighlightProject()` - POST /api/highlight-project
   - ✅ `deleteHighlightProject()` - DELETE /api/highlight-project/{id}

5. **Work Experience API**
   - ✅ `addWorkExperience()` - POST /api/work-experience
   - ✅ `deleteWorkExperience()` - DELETE /api/work-experience/{id}

6. **Foreign Language API**
   - ✅ `addForeignLanguage()` - POST /api/foreign-language
   - ✅ `deleteForeignLanguage()` - DELETE /api/foreign-language/{id}

### C. **API Response Format**

#### Resume GET Response (`/api/resume`)
```json
{
  "code": 0,
  "message": "string",
  "result": [
    {
      "resumeId": 0,
      "aboutMe": "string",
      "createdAt": "2025-10-26T17:25:40.804Z",
      "candidateId": 0,
      "certificates": [...],
      "educations": [...],
      "highlightProjects": [...],
      "workExperiences": [...],
      "skills": [...],
      "foreignLanguages": [...],
      "awards": [...]
    }
  ]
}
```

#### Award POST Request
```json
{
  "resumeId": 123,
  "name": "Excellence Award",
  "organization": "FPT University",
  "getDate": "2025-10-25",
  "description": "Award for outstanding performance"
}
```

#### Award POST Response
```json
{
  "awardId": 456,
  "resumeId": 123,
  "name": "Excellence Award",
  "organization": "FPT University",
  "getDate": "2025-10-25",
  "description": "Award for outstanding performance"
}
```

## Data Transformation

### API → State

```typescript
// Awards transformation
const transformedAwards = resume.awards.map((award: any) => {
  const date = new Date(award.getDate);
  return {
    id: award.awardId.toString(),
    name: award.name,
    organization: award.organization,
    month: String(date.getMonth() + 1).padStart(2, '0'),
    year: String(date.getFullYear()),
    description: award.description
  };
});
```

### State → API

```typescript
// When adding award
const awardData: AwardData = {
  resumeId: resumeId, // From state
  name: awardName,
  organization: awardOrg,
  getDate: `${awardYear}-${awardMonth}-25`, // Combine month/year
  description: awardDesc || undefined
};
```

## TypeScript Interfaces

### Award Types
```typescript
export interface AwardData {
  resumeId: number;
  name: string;
  organization: string;
  getDate: string; // Format: "YYYY-MM-DD"
  description?: string;
}

export interface AwardResponse {
  awardId: number;
  resumeId: number;
  name: string;
  organization: string;
  getDate: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}
```

### Education Types
```typescript
export interface EducationData {
  resumeId: number;
  school: string;
  major: string;
  degree: string;
  startDate: string; // Format: "YYYY-MM-DD"
  endDate: string; // Format: "YYYY-MM-DD"
}
```

### Work Experience Types
```typescript
export interface WorkExperienceData {
  resumeId: number;
  jobTitle: string;
  company: string;
  startDate: string;
  endDate?: string;
  description: string;
  project?: string;
}
```

## Error Handling

### Resume ID Validation
```typescript
if (!resumeId) {
  toast.error("Resume ID not found. Please refresh the page.");
  return;
}
```

### API Error Handling
```typescript
try {
  const response = await addAward(awardData);
  toast.success("Award added successfully!");
} catch (error) {
  console.error("Error adding award:", error);
  toast.error("Failed to add award. Please try again.");
}
```

## Loading States

```typescript
const [isLoadingResume, setIsLoadingResume] = useState(true);

// In fetchResumeData
setIsLoadingResume(true);
try {
  // ... fetch data
} finally {
  setIsLoadingResume(false);
}
```

## Benefits

### ✅ Ưu điểm

1. **Dynamic Resume ID**: Không còn hardcode `resumeId: 0`
2. **Full Data Loading**: Load toàn bộ resume data một lần khi mount
3. **Type Safety**: TypeScript interfaces cho tất cả API calls
4. **Error Handling**: Toast notifications cho user feedback
5. **Consistent Structure**: Tất cả APIs follow cùng pattern
6. **Separation of Concerns**: Resume API logic tách riêng trong `resume-api.ts`

### 📝 TODO

- [ ] Implement Update functionality cho các sections
- [ ] Add loading indicators khi fetching data
- [ ] Handle multiple resumes (hiện chỉ lấy resume đầu tiên)
- [ ] Add retry logic cho failed API calls
- [ ] Implement optimistic UI updates
- [ ] Add validation cho date ranges (startDate < endDate)

## Files Modified

1. `src/lib/resume-api.ts` - ✅ Created
2. `src/app/candidate/cm-profile/page.tsx` - ✅ Updated
   - Added resume state management
   - Added fetchResumeData useEffect
   - Updated handleSaveAward to use resumeId
   - Added educations and workExperiences state arrays

## Testing Checklist

- [ ] Test add award với resumeId thực
- [ ] Test load resume data khi component mount
- [ ] Test error handling khi resumeId null
- [ ] Test delete award
- [ ] Test data transformation (API ↔ State)
- [ ] Test toast notifications
- [ ] Verify TypeScript compilation success

