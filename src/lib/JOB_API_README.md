# Job API Integration

## Overview
This document describes the integration of the Job Postings API into the jobs-detail page.

## API Endpoint
```
GET /api/job-postings
```

## Query Parameters
- `keyword`: Optional search term (searches in title, description, and address)
- `page`: Page number (default: 0, zero-indexed)
- `size`: Items per page (default: 10)
- `sortBy`: Field to sort by (default: createAt)
- `sortDir`: Sort direction - `asc` or `desc` (default: desc)

## Response Format
```typescript
{
  code: 200,
  message: "Job postings retrieved successfully",
  result: {
    content: JobPosting[],
    page: number,
    size: number,
    totalElements: number,
    totalPages: number
  }
}
```

## Usage in Components

### Import
```typescript
import { fetchJobPostings, transformJobPosting } from '@/lib/job-api';
```

### Fetch Jobs
```typescript
const response = await fetchJobPostings({
  keyword: 'developer',
  page: 0,
  size: 10,
  sortBy: 'createAt',
  sortDir: 'desc'
});

const jobs = response.result.content.map(transformJobPosting);
```

## Data Transformation
The API response is automatically transformed to match the existing `JobListing` interface:

### API Fields → UI Fields
- `id` → `id`
- `title` → `title`
- `recruiterInfo.companyName` → `company`
- `recruiterInfo.logoUrl` → `companyLogo`
- `address` → `location`
- `postTime` → `postedAgo` (calculated, e.g., "2 hours ago")
- `workModel` → `workMode`
- `yearsOfExperience` → `experience` (formatted as "X+ years")
- `skills` → `skills` (array of skill names)
- `description` → `description` (split by newlines)
- `salaryRange` → `salaryRange`
- `jobPackage` → `benefitSummary` and `benefits`

## Features Implemented

### 1. Real-time Data Fetching
- Jobs are fetched from API on component mount
- Auto-refresh on page change or search
- Loading states with spinner
- Error handling with retry button

### 2. Search Functionality
- Keyword search across title, description, and address
- Search resets to page 0
- Debounced for performance (via useEffect dependency)

### 3. Pagination
- Server-side pagination (API handles paging)
- Smart page number display (max 5 buttons)
- Previous/Next navigation
- Disabled states for boundary pages
- Scroll to top on page change

### 4. Loading States
```tsx
{loading ? (
  <Spinner />
) : error ? (
  <ErrorMessage />
) : jobs.length === 0 ? (
  <EmptyState />
) : (
  <JobsList />
)}
```

## Environment Variables
Add to `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## Error Handling
- Network errors: Show retry button
- Empty results: Show "No jobs found" message
- API errors: Log to console and display user-friendly message

## Performance Optimizations
1. Only fetch data when needed (page change or search)
2. Automatic selection of first job on load
3. Efficient pagination with limited page buttons
4. Smooth scroll on page transitions

## Future Enhancements
- [ ] Add debounce to search input
- [ ] Implement filter by location, salary, work model
- [ ] Add job bookmarking persistence
- [ ] Cache recently viewed jobs
- [ ] Implement infinite scroll as alternative to pagination
