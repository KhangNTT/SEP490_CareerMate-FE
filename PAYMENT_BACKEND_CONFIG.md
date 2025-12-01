# 🔧 Backend Configuration for Payment Flow

## ⚠️ Vấn đề hiện tại

Backend đang redirect về:
```
http://localhost:8080/api/candidate-payment/return?vnp_ResponseCode=00&...
```

Điều này khiến user không thể thấy trang success của frontend.

## ✅ Giải pháp

### Cách 1: Cấu hình VNPay returnUrl (Recommended)

Trong backend, khi tạo payment URL, set `returnUrl` về **frontend** thay vì backend:

```java
// ❌ WRONG - redirect về backend
String returnUrl = "http://localhost:8080/api/candidate-payment/return";

// ✅ CORRECT - redirect về frontend Next.js API route
String returnUrl = "http://localhost:3000/api/candidate-payment/return";

// 🌐 Production
String returnUrl = "https://your-frontend-domain.com/api/candidate-payment/return";
```

### Cách 2: Backend proxy redirect (Alternative)

Nếu không thể thay đổi VNPay returnUrl, backend có thể:

1. Nhận callback từ VNPay
2. Xử lý và verify signature
3. Redirect về frontend với params

```java
@GetMapping("/api/candidate-payment/return")
public void handleVNPayReturn(
    @RequestParam Map<String, String> params,
    HttpServletResponse response
) throws IOException {
    // Verify signature
    boolean isValid = vnPayService.verifySignature(params);
    
    String responseCode = params.get("vnp_ResponseCode");
    String orderInfo = params.get("vnp_OrderInfo");
    
    // Extract package name
    String packageName = extractPackageName(orderInfo);
    
    // Build frontend URL
    String frontendUrl;
    if ("00".equals(responseCode) && isValid) {
        frontendUrl = "http://localhost:3000/candidate/pricing/success?package=" + packageName;
    } else {
        frontendUrl = "http://localhost:3000/candidate/pricing/failure?package=" + packageName;
    }
    
    // Redirect to frontend
    response.sendRedirect(frontendUrl);
}
```

## 🎯 Current Implementation

Frontend đã có **API Route** để handle callback:
```
/src/app/api/candidate-payment/return/route.ts
```

Endpoint này:
- Nhận VNPay callback parameters
- Parse `vnp_ResponseCode` và `orderInfo`
- Redirect về:
  - Success: `/candidate/pricing/success?package=PREMIUM`
  - Failure: `/candidate/pricing/failure?package=PREMIUM&message=...`

## 📝 Testing

### Test Success Flow
```
GET http://localhost:3000/api/candidate-payment/return?vnp_ResponseCode=00&vnp_OrderInfo=packageName%3DPREMIUM%26email%3Dtest%40gmail.com
```

Kết quả: Redirect → `/candidate/pricing/success?package=PREMIUM` (with confetti 🎉)

### Test Failure Flow
```
GET http://localhost:3000/api/candidate-payment/return?vnp_ResponseCode=24&vnp_OrderInfo=packageName%3DPLUS%26email%3Dtest%40gmail.com
```

Kết quả: Redirect → `/candidate/pricing/failure?package=PLUS&message=Transaction%20cancelled`

## 🔄 Complete Flow

```
1. User clicks "Confirm & Pay"
   ↓
2. POST /api/candidate-payment?packageName=Premium
   ↓
3. Backend creates VNPay URL with returnUrl = "http://localhost:3000/api/candidate-payment/return"
   ↓
4. User redirected to VNPay payment page
   ↓
5. User completes payment
   ↓
6. VNPay redirects to: http://localhost:3000/api/candidate-payment/return?vnp_ResponseCode=00&...
   ↓
7. Frontend API route processes and redirects to:
   - Success: /candidate/pricing/success?package=PREMIUM
   - Failure: /candidate/pricing/failure?package=PREMIUM
```

## 🌐 Production URLs

Update these in backend config:

```properties
# Development
vnpay.return.url=http://localhost:3000/api/candidate-payment/return

# Production
vnpay.return.url=https://your-frontend-domain.com/api/candidate-payment/return
```

## ✅ Checklist

- [ ] Backend sets VNPay returnUrl to frontend URL
- [ ] Test with `packageName=Premium` (case-sensitive)
- [ ] Test success flow (vnp_ResponseCode=00)
- [ ] Test failure flow (vnp_ResponseCode=24)
- [ ] Verify redirect to correct frontend pages
- [ ] Update production URLs

---

**Need Help?**
- Frontend API Route: `/src/app/api/candidate-payment/return/route.ts`
- Success Page: `/src/app/candidate/pricing/success/page.tsx`
- Failure Page: `/src/app/candidate/pricing/failure/page.tsx`
