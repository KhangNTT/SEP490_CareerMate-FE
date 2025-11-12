# Test Scenarios - Account Status Check Feature

## Test Suite Overview
Bộ test cases để kiểm tra chức năng kiểm tra trạng thái tài khoản recruiter khi đăng nhập.

---

## Test Group 1: Normal Login (Email/Password)

### TC-NL-01: Login với Account REJECTED
**Priority:** High  
**Type:** Functional

**Pre-conditions:**
- Có tài khoản recruiter với status = REJECTED
- Có rejectionReason trong database
- User chưa đăng nhập

**Test Steps:**
1. Navigate to `/sign-in`
2. Enter email: `rejected-recruiter@test.com`
3. Enter password: `Test123!@#`
4. Click "Sign in" button
5. Wait for response

**Expected Results:**
- ✅ Login API call successful (200)
- ✅ Token được lưu vào localStorage
- ✅ Call GET `/api/recruiter/my-profile` successful
- ✅ Toast error hiển thị: "Tài khoản bị từ chối: {rejectionReason}"
- ✅ Redirect to `/auth/account-rejected?reason={rejectionReason}`
- ✅ Page hiển thị lý do từ chối
- ✅ Có nút "Cập nhật thông tin doanh nghiệp"

**Test Data:**
```json
{
  "email": "rejected-recruiter@test.com",
  "password": "Test123!@#",
  "expectedStatus": "REJECTED",
  "expectedReason": "Thông tin doanh nghiệp không đầy đủ"
}
```

---

### TC-NL-02: Login với Account PENDING
**Priority:** High  
**Type:** Functional

**Pre-conditions:**
- Có tài khoản recruiter với status = PENDING
- User chưa đăng nhập

**Test Steps:**
1. Navigate to `/sign-in`
2. Enter email: `pending-recruiter@test.com`
3. Enter password: `Test123!@#`
4. Click "Sign in" button
5. Wait for response

**Expected Results:**
- ✅ Login API call successful (200)
- ✅ Token được lưu vào localStorage
- ✅ Call GET `/api/recruiter/my-profile` successful
- ✅ Toast info hiển thị: "Tài khoản đang chờ phê duyệt..."
- ✅ Redirect to `/auth/account-pending`
- ✅ Page hiển thị thông tin chờ duyệt (1-3 ngày)
- ✅ Có icon clock màu vàng
- ✅ Có nút "Về trang chủ" và "Quay lại đăng nhập"

---

### TC-NL-03: Login với Account ACTIVE
**Priority:** High  
**Type:** Functional

**Pre-conditions:**
- Có tài khoản recruiter với status = ACTIVE hoặc APPROVED
- User chưa đăng nhập

**Test Steps:**
1. Navigate to `/sign-in`
2. Enter email: `active-recruiter@test.com`
3. Enter password: `Test123!@#`
4. Click "Sign in" button
5. Wait for response

**Expected Results:**
- ✅ Login API call successful (200)
- ✅ Token được lưu vào localStorage
- ✅ Call GET `/api/recruiter/my-profile` successful
- ✅ Toast success hiển thị: "Đăng nhập thành công!"
- ✅ Redirect to `/recruiter/recruiter-feature/jobs`
- ✅ User có thể truy cập recruiter dashboard
- ✅ Không có error toast

---

### TC-NL-04: Login với Profile API Error
**Priority:** Medium  
**Type:** Error Handling

**Pre-conditions:**
- Có tài khoản recruiter hợp lệ
- API `/api/recruiter/my-profile` trả về lỗi 500

**Test Steps:**
1. Navigate to `/sign-in`
2. Mock API error: `GET /api/recruiter/my-profile → 500`
3. Enter valid credentials
4. Click "Sign in" button
5. Wait for response

**Expected Results:**
- ✅ Login API call successful (200)
- ✅ Token được lưu vào localStorage
- ✅ Profile API call failed (500)
- ✅ Error được log ra console
- ✅ User vẫn được redirect theo role (không block login)
- ✅ Redirect to `/recruiter/recruiter-feature/jobs`

**Note:** Feature fail-safe - không block login nếu profile API lỗi

---

## Test Group 2: OAuth Login (Google)

### TC-OL-01: OAuth Login với Account REJECTED
**Priority:** High  
**Type:** Functional

**Pre-conditions:**
- Có tài khoản Google đã liên kết với recruiter REJECTED
- Backend trả về rejection_reason

**Test Steps:**
1. Navigate to `/sign-in`
2. Click "Sign in with Google" button
3. Complete Google OAuth flow
4. Backend redirects to `/oauth-callback` with params:
   ```
   ?success=true
   &account_type=recruiter
   &account_status=rejected
   &rejection_reason=Thông tin không hợp lệ
   &access_token=...
   ```

**Expected Results:**
- ✅ Callback page parses query params correctly
- ✅ Toast error: "Tài khoản bị từ chối: Thông tin không hợp lệ"
- ✅ Redirect to `/auth/account-rejected?reason=Thông%20tin%20không%20hợp%20lệ`
- ✅ Page hiển thị lý do từ query param
- ✅ Console log: "❌ [OAuth Callback] Recruiter account rejected"

---

### TC-OL-02: OAuth Login với Account PENDING
**Priority:** High  
**Type:** Functional

**Pre-conditions:**
- Có tài khoản Google đã liên kết với recruiter PENDING

**Test Steps:**
1. Navigate to `/sign-in`
2. Click "Sign in with Google"
3. Complete OAuth flow
4. Backend redirects với params:
   ```
   ?success=true
   &account_type=recruiter
   &account_status=pending
   &access_token=...
   ```

**Expected Results:**
- ✅ Toast info: "Tài khoản đang chờ phê duyệt..."
- ✅ Redirect to `/auth/account-pending`
- ✅ Console log: "⏳ [OAuth Callback] Recruiter account pending approval"

---

### TC-OL-03: OAuth Login với Account ACTIVE
**Priority:** High  
**Type:** Functional

**Pre-conditions:**
- Có tài khoản Google đã liên kết với recruiter ACTIVE

**Test Steps:**
1. Navigate to `/sign-in`
2. Click "Sign in with Google"
3. Complete OAuth flow
4. Backend redirects với params:
   ```
   ?success=true
   &account_type=recruiter
   &account_status=active
   &access_token=...
   &refresh_token=...
   &email=user@gmail.com
   ```

**Expected Results:**
- ✅ Toast success: "Đăng nhập thành công!"
- ✅ Redirect to `/auth/oauth/success` với token params
- ✅ Token được set vào store và localStorage
- ✅ Final redirect to `/recruiter/recruiter-feature/jobs`

---

### TC-OL-04: OAuth với Missing Rejection Reason
**Priority:** Low  
**Type:** Edge Case

**Pre-conditions:**
- Account REJECTED nhưng không có rejection_reason

**Test Steps:**
1. OAuth flow với params:
   ```
   ?success=true
   &account_type=recruiter
   &account_status=rejected
   ```
   (không có rejection_reason)

**Expected Results:**
- ✅ Toast error: "Tài khoản của bạn đã bị từ chối. Vui lòng liên hệ hỗ trợ."
- ✅ Redirect to `/auth/account-rejected?reason=`
- ✅ Page hiển thị thông báo generic (không crash)

---

## Test Group 3: Resubmission Flow

### TC-RS-01: Submit Form với Valid Data
**Priority:** High  
**Type:** Functional

**Pre-conditions:**
- User ở trang `/auth/account-rejected`
- User đã click "Cập nhật thông tin doanh nghiệp"

**Test Steps:**
1. Fill form:
   ```
   Company Name: FPT Software Vietnam
   Website: https://fptsoftware.com
   Business License: BL-2025-123456
   Contact Person: Nguyen Van A
   Phone: 0912345678
   Address: 123 ABC Street, District 1, HCMC
   About: Leading software company in Vietnam
   ```
2. Upload logo (optional)
3. Click "Gửi lại yêu cầu phê duyệt"

**Expected Results:**
- ✅ Form validation passes
- ✅ API call: `PUT /api/recruiter/update-organization`
- ✅ Response 200 OK
- ✅ Toast success: "Cập nhật thành công!"
- ✅ Redirect to `/pending-approval-confirmation` after 2s
- ✅ Confirmation page hiển thị thông báo chờ duyệt

---

### TC-RS-02: Submit Form với Invalid Data
**Priority:** High  
**Type:** Validation

**Test Steps:**
1. Fill form with invalid data:
   ```
   Company Name: (empty)
   Website: not-a-url
   Business License: (empty)
   Phone: 123 (invalid format)
   ```
2. Click submit

**Expected Results:**
- ✅ Form validation fails
- ✅ Error messages hiển thị dưới các fields:
   - "Company name is required"
   - "Please enter a valid URL"
   - "Business license is required"
   - "Please enter a valid phone number"
- ✅ API không được gọi
- ✅ Form không submit

---

### TC-RS-03: Submit Form với API Error
**Priority:** Medium  
**Type:** Error Handling

**Pre-conditions:**
- Form filled correctly
- API trả về lỗi 400 hoặc 500

**Test Steps:**
1. Fill valid data
2. Mock API error: `PUT /api/recruiter/update-organization → 400`
3. Click submit

**Expected Results:**
- ✅ API call được thực hiện
- ✅ Response 400 Bad Request
- ✅ Toast error: "Failed to update organization"
- ✅ Form không bị clear
- ✅ User có thể sửa và submit lại

---

### TC-RS-04: Cancel Resubmission
**Priority:** Low  
**Type:** UX

**Test Steps:**
1. Navigate to `/auth/account-rejected`
2. Click "Cập nhật thông tin doanh nghiệp"
3. Partially fill form
4. Click "Quay lại" button

**Expected Results:**
- ✅ Form ẩn đi
- ✅ Trở về view ban đầu (rejection notice)
- ✅ Data không được save

---

## Test Group 4: UI/UX Tests

### TC-UI-01: Responsive Design - Mobile
**Priority:** Medium  
**Type:** UI

**Test Steps:**
1. Set viewport to 375x667 (iPhone)
2. Navigate to `/auth/account-rejected`
3. Check layout

**Expected Results:**
- ✅ Text không bị cắt
- ✅ Buttons stack vertically
- ✅ Form fields full width
- ✅ Scrollable nếu content dài

---

### TC-UI-02: Toast Notifications
**Priority:** Medium  
**Type:** UI

**Test Steps:**
1. Trigger các loại toast:
   - Error (rejected)
   - Info (pending)
   - Success (active)

**Expected Results:**
- ✅ Toast hiển thị ở góc phải màn hình
- ✅ Auto-dismiss sau 3-5 giây
- ✅ Màu sắc phù hợp:
   - Error: Đỏ
   - Info: Vàng
   - Success: Xanh
- ✅ Icon phù hợp với loại toast

---

### TC-UI-03: Auto-redirect on Pending Page
**Priority:** Low  
**Type:** UX

**Test Steps:**
1. Navigate to `/auth/account-pending`
2. Wait 12 seconds without interaction

**Expected Results:**
- ✅ Countdown timer không hiển thị (optional)
- ✅ Auto-redirect to `/sign-in` after 12s
- ✅ User có thể click button để redirect ngay

---

## Test Group 5: Integration Tests

### TC-INT-01: End-to-End Flow (Rejected → Resubmit → Pending)
**Priority:** Critical  
**Type:** Integration

**Test Steps:**
1. Login with rejected account
2. View rejection reason
3. Click resubmit button
4. Fill and submit form
5. View confirmation page
6. Logout
7. Admin approves resubmission (manual step or mock)
8. Login again

**Expected Results:**
- ✅ Step 1-6: All flows work as expected
- ✅ Step 8: Status changed to PENDING or ACTIVE
- ✅ User sees appropriate page based on new status

---

### TC-INT-02: Token Expiry During Resubmission
**Priority:** Medium  
**Type:** Security

**Pre-conditions:**
- Token sắp hết hạn (< 5 minutes)

**Test Steps:**
1. Login with rejected account
2. Navigate to resubmit form
3. Wait for token to expire
4. Submit form

**Expected Results:**
- ✅ API returns 401 Unauthorized
- ✅ Toast error: "Session expired. Please login again."
- ✅ Redirect to `/sign-in`
- ✅ After re-login, can submit successfully

---

## Test Group 6: Negative Tests

### TC-NEG-01: Direct Access to Rejected Page (No Reason)
**Priority:** Low  
**Type:** Edge Case

**Test Steps:**
1. Navigate directly to `/auth/account-rejected` (without query param)

**Expected Results:**
- ✅ Page loads without crash
- ✅ Hiển thị generic message (không có lý do cụ thể)
- ✅ Form vẫn accessible

---

### TC-NEG-02: Malformed Query Parameters
**Priority:** Low  
**Type:** Security

**Test Steps:**
1. Navigate to `/auth/account-rejected?reason=<script>alert('xss')</script>`

**Expected Results:**
- ✅ Script không được execute
- ✅ Reason được sanitized trước khi hiển thị
- ✅ Page hoạt động bình thường

---

### TC-NEG-03: Invalid Token in Authorization Header
**Priority:** Medium  
**Type:** Security

**Test Steps:**
1. Login successfully
2. Manually corrupt token in localStorage
3. Try to submit resubmission form

**Expected Results:**
- ✅ API returns 401
- ✅ Toast error: "Authentication failed"
- ✅ Redirect to `/sign-in`

---

## Performance Tests

### TC-PERF-01: Profile API Response Time
**Priority:** Low  
**Type:** Performance

**Test Steps:**
1. Login with valid account
2. Measure time from login success to profile API response

**Expected Results:**
- ✅ Profile API responds within 500ms
- ✅ Total login flow < 2s
- ✅ No blocking/freezing UI

---

## Test Execution Checklist

- [ ] All High priority tests passed
- [ ] All Medium priority tests passed
- [ ] Critical bugs fixed
- [ ] UI/UX reviewed
- [ ] Cross-browser tested (Chrome, Firefox, Safari)
- [ ] Mobile tested (iOS, Android)
- [ ] Performance acceptable
- [ ] Security checks passed
- [ ] Documentation updated

---

## Test Environment

**Browser:** Chrome 120+, Firefox 120+, Safari 17+  
**Device:** Desktop (1920x1080), Mobile (375x667)  
**Network:** Normal 4G, Slow 3G (for edge cases)  
**OS:** macOS, Windows, iOS, Android

---

**Last Updated:** 2025-01-11  
**Test Suite Version:** 1.0  
**Feature Version:** 1.0
