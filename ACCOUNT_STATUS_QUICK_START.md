# Quick Start - Account Status Check Feature

## Tính Năng
Kiểm tra trạng thái tài khoản recruiter ngay khi đăng nhập và hiển thị thông báo phù hợp.

## User Stories

### 1. Recruiter Bị Từ Chối (REJECTED)
**Khi đăng nhập:**
- ❌ Thấy toast error: "Tài khoản bị từ chối: {lý do}"
- 🔄 Được redirect đến `/auth/account-rejected`
- 📝 Thấy lý do từ chối cụ thể
- ✅ Có nút "Cập nhật thông tin doanh nghiệp"
- 📤 Điền form và gửi lại thông tin
- ⏳ Sau khi gửi, được redirect đến trang xác nhận chờ duyệt

### 2. Recruiter Đang Chờ Duyệt (PENDING)
**Khi đăng nhập:**
- ⏳ Thấy toast info: "Tài khoản đang chờ phê duyệt..."
- 🔄 Được redirect đến `/auth/account-pending`
- 📋 Thấy thông tin:
  - Thời gian xét duyệt: 1-3 ngày
  - Sẽ nhận email thông báo
  - Kiểm tra email thường xuyên
- 🏠 Có nút về trang chủ hoặc đăng nhập lại

### 3. Recruiter Đã Được Duyệt (APPROVED/ACTIVE)
**Khi đăng nhập:**
- ✅ Thấy toast success: "Đăng nhập thành công!"
- 🚀 Được redirect đến recruiter dashboard
- 💼 Có thể sử dụng đầy đủ chức năng

## API Endpoints

### 1. Lấy Profile Recruiter
```http
GET /api/recruiter/my-profile
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "code": 200,
  "message": "Success",
  "result": {
    "accountStatus": "REJECTED" | "PENDING" | "APPROVED" | "ACTIVE",
    "rejectionReason": "Không thích hợp",
    "companyName": "FPT",
    "businessLicense": "BL-2025-123456",
    ...
  }
}
```

### 2. Cập Nhật Organization (Resubmit)
```http
PUT /api/recruiter/update-organization
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "companyName": "FPT Software",
  "website": "https://fptsoftware.com",
  "logoUrl": "https://...",
  "businessLicense": "BL-2025-123456",
  "contactPerson": "Nhật Huỳnh",
  "phoneNumber": "0929076985",
  "companyAddress": "FTown 1",
  "about": "Leading software company"
}
```

**Response:**
```json
{
  "code": 200,
  "message": "Organization updated successfully",
  "result": { ... }
}
```

## Testing

### Test với Account REJECTED
1. **Login:**
   ```
   Email: rejected-recruiter@example.com
   Password: Password123!
   ```

2. **Expected:**
   - Toast: "Tài khoản bị từ chối: {lý do}"
   - Redirect: `/auth/account-rejected?reason=...`
   - Page hiển thị form để gửi lại

3. **Action:**
   - Click "Cập nhật thông tin doanh nghiệp"
   - Điền form với thông tin mới
   - Click "Gửi lại yêu cầu phê duyệt"
   - Verify API call success
   - Verify redirect đến `/pending-approval-confirmation`

### Test với Account PENDING
1. **Login:**
   ```
   Email: pending-recruiter@example.com
   Password: Password123!
   ```

2. **Expected:**
   - Toast: "Tài khoản đang chờ phê duyệt..."
   - Redirect: `/auth/account-pending`
   - Page hiển thị thông tin chờ duyệt

3. **Action:**
   - Verify thông tin hiển thị đầy đủ
   - Verify auto-redirect sau 12 giây
   - Click "Về trang chủ" hoặc "Quay lại đăng nhập"

### Test với Account ACTIVE
1. **Login:**
   ```
   Email: active-recruiter@example.com
   Password: Password123!
   ```

2. **Expected:**
   - Toast: "Đăng nhập thành công!"
   - Redirect: `/recruiter/recruiter-feature/jobs`
   - User có thể truy cập dashboard

### Test OAuth với Account REJECTED
1. **Login:**
   - Click "Sign in with Google"
   - Chọn account Google đã liên kết với recruiter bị từ chối

2. **Expected:**
   - Backend redirect về `/oauth-callback` với params:
     ```
     ?success=true
     &account_type=recruiter
     &account_status=rejected
     &rejection_reason=Không thích hợp
     ```
   - Toast: "Tài khoản bị từ chối: Không thích hợp"
   - Redirect: `/auth/account-rejected?reason=Không%20thích%20hợp`

## Code Files

### Modified Files:
1. **`src/lib/recruiter-api.ts`** - API functions
2. **`src/modules/client/auth/hooks/use-sign-in-hooks.ts`** - Login logic
3. **`src/app/oauth-callback/page.tsx`** - OAuth callback handler
4. **`src/app/auth/account-pending/page.tsx`** - Pending page UI

### Existing Components:
1. **`src/app/auth/account-rejected/page.tsx`** - Rejected page
2. **`src/components/auth/OrganizationUpdateForm.tsx`** - Resubmit form

## Debugging

### Check Console Logs
```javascript
// Trong use-sign-in-hooks.ts
console.log("🔵 [SIGNIN] Recruiter profile fetched", {
  accountStatus: profile.accountStatus,
  hasRejectionReason: !!profile.rejectionReason,
});

// Trong oauth-callback/page.tsx
console.log("🔍 [OAuth Callback Page] Parameters:", {
  accountStatus,
  rejectReason,
  ...
});
```

### Check Network Requests
1. Open DevTools → Network tab
2. Filter: `my-profile` hoặc `update-organization`
3. Verify request headers có Authorization token
4. Verify response status code và data

### Check LocalStorage
```javascript
// Trong browser console
localStorage.getItem('access_token');
localStorage.getItem('token_expires_at');
```

## Common Issues

### Issue 1: Profile API không được gọi
**Symptoms:** Không thấy log "Recruiter profile fetched"
**Solution:** 
- Verify role trong token là "RECRUITER" hoặc "ROLE_RECRUITER"
- Check network tab xem có lỗi 401/403 không
- Verify access token còn hạn

### Issue 2: Rejection reason không hiển thị
**Symptoms:** Trang rejected không hiển thị lý do
**Solution:**
- Check query param: `/auth/account-rejected?reason=...`
- Verify backend trả về `rejectionReason` field
- Check console log để xem giá trị

### Issue 3: Form submit bị lỗi 400
**Symptoms:** Toast error "Failed to update organization"
**Solution:**
- Check validation errors trong response
- Verify tất cả required fields đã điền
- Check format của businessLicense, phoneNumber

## Next Steps

1. **Email Integration:**
   - Backend gửi email khi status thay đổi
   - Email template chuyên nghiệp

2. **Admin Dashboard:**
   - Notification khi có resubmission
   - History của các lần submit

3. **Real-time Updates:**
   - WebSocket để notify khi status change
   - Không cần đăng nhập lại

## Support

Nếu có vấn đề:
1. Check console logs (F12)
2. Check network requests
3. Verify API responses
4. Liên hệ team lead

---

**Last Updated:** 2025-01-11
**Version:** 1.0
