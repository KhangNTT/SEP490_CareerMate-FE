# Test Scenarios - Rejected Recruiter Resubmission Feature

## Test Environment Setup

### Prerequisites
- Backend API running at `http://localhost:8080`
- Frontend running at `http://localhost:3000`
- Test recruiter account with REJECTED status
- Admin account for approval testing

### Test Data
```json
{
  "testRecruiter": {
    "email": "rejected.recruiter@test.com",
    "password": "Test123!",
    "status": "REJECTED",
    "rejectReason": "Business license không hợp lệ. Vui lòng cung cấp giấy phép mới."
  },
  "validOrganizationData": {
    "companyName": "FPT Software",
    "website": "https://fptsoftware.com",
    "logoUrl": "https://example.com/fpt-logo.png",
    "businessLicense": "BL-2025-FPT-12345",
    "contactPerson": "Nguyễn Văn A",
    "phoneNumber": "0929098765",
    "companyAddress": "Ftown1, Đà Nẵng, Việt Nam",
    "about": "FPT Software là công ty phần mềm hàng đầu Việt Nam..."
  }
}
```

---

## Test Cases

### TC001: OAuth Login - Rejected Status Redirect
**Priority**: P0 (Critical)  
**Test Type**: Functional

**Steps**:
1. Navigate to `http://localhost:3000/auth/signin`
2. Click "Sign in with Google"
3. Complete OAuth flow with rejected recruiter account
4. Backend returns status REJECTED with reason

**Expected Result**:
- Redirected to `/auth/account-rejected`
- Page shows rejection icon (red X)
- Page displays rejection reason: "Business license không hợp lệ..."
- "Cập nhật thông tin doanh nghiệp" button visible
- "Liên hệ hỗ trợ" button visible

**Status**: ⏳ Pending

---

### TC002: Display Rejection Notice
**Priority**: P0 (Critical)  
**Test Type**: UI/UX

**Steps**:
1. Direct navigate to `/auth/account-rejected?reason=Business%20license%20không%20hợp%20lệ`

**Expected Result**:
- Page loads successfully
- Title: "Đơn đăng ký của bạn đã bị từ chối"
- Rejection reason box (red background) shows: "Business license không hợp lệ"
- Info box (blue background) shows helpful tips
- Two action buttons visible and clickable

**Actual Result**: ___________________

**Status**: ⏳ Pending

---

### TC003: Show Organization Update Form
**Priority**: P0 (Critical)  
**Test Type**: Functional

**Steps**:
1. On `/auth/account-rejected` page
2. Click "Cập nhật thông tin doanh nghiệp" button

**Expected Result**:
- Form slides in / appears
- All form fields visible:
  - ✓ Tên công ty (required)
  - ✓ Website (optional)
  - ✓ Logo URL (optional)
  - ✓ Giấy phép kinh doanh (required)
  - ✓ Người liên hệ (required)
  - ✓ Số điện thoại (required)
  - ✓ Địa chỉ công ty (required)
  - ✓ Giới thiệu về công ty (optional)
- "Quay lại" button visible
- "Gửi lại yêu cầu phê duyệt" button visible
- "Hủy" button visible

**Status**: ⏳ Pending

---

### TC004: Form Validation - Missing Required Fields
**Priority**: P1 (High)  
**Test Type**: Validation

**Steps**:
1. Open organization update form
2. Leave all fields empty
3. Click "Gửi lại yêu cầu phê duyệt"

**Expected Result**:
- Form does not submit
- Toast error appears: "Vui lòng điền đầy đủ các trường bắt buộc"
- Browser HTML5 validation highlights first empty required field
- No API call made (check Network tab)

**Status**: ⏳ Pending

---

### TC005: Form Validation - Invalid Phone Number
**Priority**: P1 (High)  
**Test Type**: Validation

**Test Data**:
- Valid data for all fields
- Phone number: "123" (invalid - too short)

**Steps**:
1. Fill form with test data
2. Enter invalid phone number
3. Submit form

**Expected Result**:
- HTML5 validation error: "Please match the requested format"
- Pattern validation: Must be 10-11 digits
- Form does not submit

**Status**: ⏳ Pending

---

### TC006: Form Validation - Invalid URL
**Priority**: P2 (Medium)  
**Test Type**: Validation

**Test Data**:
- Website: "not-a-url"
- Logo URL: "invalid"

**Steps**:
1. Fill form with valid data
2. Enter invalid URLs
3. Submit form

**Expected Result**:
- HTML5 URL validation triggers
- Error message for invalid URL format
- Form does not submit

**Status**: ⏳ Pending

---

### TC007: Successful Form Submission
**Priority**: P0 (Critical)  
**Test Type**: Integration

**Test Data**: Use `validOrganizationData` from setup

**Steps**:
1. Fill all required fields with valid data
2. Click "Gửi lại yêu cầu phê duyệt"
3. Wait for API response

**Expected Result**:
- Loading state appears ("Đang gửi..." with spinner)
- API call to `PUT /api/recruiter/update-organization`
- Success toast: "Thông tin doanh nghiệp đã được cập nhật thành công!"
- After 2 seconds, redirect to `/pending-approval-confirmation`

**API Request Check**:
```json
{
  "companyName": "FPT Software",
  "website": "https://fptsoftware.com",
  ...
}
```

**Status**: ⏳ Pending

---

### TC008: API Error Handling - 400 Bad Request
**Priority**: P1 (High)  
**Test Type**: Error Handling

**Mock Response**: 400 Bad Request
```json
{
  "code": 400,
  "message": "Business license already exists"
}
```

**Steps**:
1. Submit form
2. Backend returns 400 error

**Expected Result**:
- Loading stops
- Error toast: "Business license already exists"
- User can edit and retry
- Form data preserved

**Status**: ⏳ Pending

---

### TC009: API Error Handling - 401 Unauthorized
**Priority**: P1 (High)  
**Test Type**: Security

**Mock Response**: 401 Unauthorized

**Steps**:
1. Clear JWT token / expire session
2. Try to submit form

**Expected Result**:
- Error toast: "Failed to update organization"
- Consider redirect to login (if auth middleware catches it)

**Status**: ⏳ Pending

---

### TC010: API Error Handling - Network Error
**Priority**: P2 (Medium)  
**Test Type**: Error Handling

**Steps**:
1. Disconnect network / stop backend server
2. Fill and submit form

**Expected Result**:
- Error toast: "Có lỗi xảy ra khi cập nhật thông tin"
- User can retry when connection restored

**Status**: ⏳ Pending

---

### TC011: Cancel Form Action
**Priority**: P2 (Medium)  
**Test Type**: Functional

**Steps**:
1. Open form
2. Fill some fields
3. Click "Hủy" button

**Expected Result**:
- Form closes
- Returns to initial rejection notice view
- Form data not saved
- No API call made

**Status**: ⏳ Pending

---

### TC012: Back Button
**Priority**: P2 (Medium)  
**Test Type**: Navigation

**Steps**:
1. Open form
2. Click "Quay lại" button

**Expected Result**:
- Same as TC011 (Cancel)
- Returns to initial view

**Status**: ⏳ Pending

---

### TC013: Logo Preview Feature
**Priority**: P3 (Low)  
**Test Type**: UI

**Steps**:
1. Open form
2. Enter valid logo URL: `https://via.placeholder.com/150`
3. Tab out of field

**Expected Result**:
- Small preview image appears below logo URL field
- Image loads correctly (80x80px rounded)
- If URL invalid/broken, image hidden gracefully

**Status**: ⏳ Pending

---

### TC014: Pending Confirmation Page Display
**Priority**: P1 (High)  
**Test Type**: UI/UX

**Steps**:
1. Direct navigate to `/pending-approval-confirmation`

**Expected Result**:
- Success icon (green checkmark) visible
- Title: "Thông tin đã được gửi thành công!"
- Info box with next steps (1, 2, 3)
- Support email link clickable
- "Về trang chủ" button
- "Đăng nhập" button
- Auto-redirect countdown notice

**Status**: ⏳ Pending

---

### TC015: Auto Redirect from Confirmation Page
**Priority**: P2 (Medium)  
**Test Type**: Functional

**Steps**:
1. Navigate to `/pending-approval-confirmation`
2. Wait 8 seconds

**Expected Result**:
- After 8 seconds, auto-redirect to home page `/`
- No errors in console

**Status**: ⏳ Pending

---

### TC016: Manual Navigation from Confirmation Page
**Priority**: P2 (Medium)  
**Test Type**: Navigation

**Steps**:
1. On `/pending-approval-confirmation`
2. Click "Về trang chủ"

**Expected Result**:
- Immediately redirects to `/`
- Auto-redirect timer cleared

**Status**: ⏳ Pending

---

### TC017: Responsive Design - Mobile
**Priority**: P1 (High)  
**Test Type**: Responsive

**Steps**:
1. Open `/auth/account-rejected` on mobile device (or DevTools mobile view)
2. Check layout
3. Open form

**Expected Result**:
- Form fields stack vertically (1 column)
- Buttons full-width
- Text readable without zoom
- No horizontal scroll
- Touch targets adequate (44x44px min)

**Devices to test**:
- [ ] iPhone SE (375px)
- [ ] iPhone 12 Pro (390px)
- [ ] iPad (768px)

**Status**: ⏳ Pending

---

### TC018: Responsive Design - Desktop
**Priority**: P2 (Medium)  
**Test Type**: Responsive

**Steps**:
1. Open `/auth/account-rejected` on desktop (1920px)
2. Check layout

**Expected Result**:
- Form uses 2-column grid for most fields
- Some fields span full width (companyName, address, about)
- Buttons side-by-side
- Max-width container (max-w-3xl)

**Status**: ⏳ Pending

---

### TC019: Accessibility - Keyboard Navigation
**Priority**: P2 (Medium)  
**Test Type**: Accessibility

**Steps**:
1. Open form
2. Use only Tab key to navigate
3. Press Enter to submit

**Expected Result**:
- All form fields focusable
- Focus order logical (top to bottom)
- Submit button focusable
- Enter key submits form
- Escape key closes form (nice to have)

**Status**: ⏳ Pending

---

### TC020: Accessibility - Screen Reader
**Priority**: P3 (Low)  
**Test Type**: Accessibility

**Tools**: VoiceOver (Mac) / NVDA (Windows)

**Steps**:
1. Enable screen reader
2. Navigate form

**Expected Result**:
- Labels read correctly
- Required fields announced
- Error messages announced
- Button purposes clear

**Status**: ⏳ Pending

---

### TC021: OAuth Callback - Multiple Status Codes
**Priority**: P0 (Critical)  
**Test Type**: Integration

**Test Matrix**:

| Backend Code | Status | Expected Redirect |
|--------------|--------|-------------------|
| 200 | APPROVED | `/auth/oauth/success` |
| 202 | INCOMPLETE | `/auth/oauth/complete-recruiter` |
| 403 | REJECTED | `/auth/account-rejected` |
| Other | ERROR | `/auth/oauth/error` |

**Expected Result**: Correct redirect for each status

**Status**: ⏳ Pending

---

### TC022: End-to-End Flow
**Priority**: P0 (Critical)  
**Test Type**: E2E

**Steps**:
1. OAuth login as rejected recruiter
2. See rejection page
3. Click "Cập nhật thông tin"
4. Fill all required fields
5. Submit form
6. View confirmation page
7. Click "Về trang chủ"

**Expected Result**:
- All steps work seamlessly
- No console errors
- Good UX throughout
- Status changes to PENDING in backend

**Status**: ⏳ Pending

---

### TC023: Security - SQL Injection
**Priority**: P1 (High)  
**Test Type**: Security

**Malicious Input**:
```
companyName: "'; DROP TABLE recruiters; --"
businessLicense: "' OR '1'='1"
```

**Steps**:
1. Enter malicious strings
2. Submit form

**Expected Result**:
- Backend sanitizes input
- No SQL injection occurs
- Data stored safely

**Status**: ⏳ Pending

---

### TC024: Security - XSS Attack
**Priority**: P1 (High)  
**Test Type**: Security

**Malicious Input**:
```html
about: "<script>alert('XSS')</script>"
companyName: "<img src=x onerror=alert('XSS')>"
```

**Steps**:
1. Enter malicious HTML/JS
2. Submit and view data

**Expected Result**:
- Input sanitized
- No script execution
- Safe display

**Status**: ⏳ Pending

---

### TC025: Performance - Form Submission Time
**Priority**: P2 (Medium)  
**Test Type**: Performance

**Steps**:
1. Fill form
2. Submit
3. Measure time to redirect

**Expected Result**:
- API response < 2 seconds
- Total time to redirect < 4 seconds
- No UI lag during submission

**Status**: ⏳ Pending

---

## Test Execution Summary

| Priority | Total | Passed | Failed | Pending |
|----------|-------|--------|--------|---------|
| P0       | 6     | 0      | 0      | 6       |
| P1       | 9     | 0      | 0      | 9       |
| P2       | 8     | 0      | 0      | 8       |
| P3       | 2     | 0      | 0      | 2       |
| **Total**| **25**| **0**  | **0**  | **25**  |

---

## Bug Report Template

### Bug #XXX: [Title]

**Severity**: Critical / High / Medium / Low  
**Priority**: P0 / P1 / P2 / P3  
**Test Case**: TCXXX  
**Tester**: ___________  
**Date**: ___________

**Environment**:
- OS: 
- Browser: 
- Frontend: 
- Backend: 

**Steps to Reproduce**:
1.
2.
3.

**Expected Result**:


**Actual Result**:


**Screenshots/Videos**:


**Console Errors**:
```
```

**Network Logs**:
```
```

**Notes**:


---

## Test Sign-off

- [ ] All P0 tests passed
- [ ] All P1 tests passed
- [ ] Known P2/P3 issues documented
- [ ] No critical bugs
- [ ] Performance acceptable
- [ ] Security validated
- [ ] Accessibility checked

**QA Lead**: ___________________  
**Date**: ___________________  
**Signature**: ___________________

---

**Document Version**: 1.0.0  
**Last Updated**: November 1, 2025  
**Status**: Ready for Testing
