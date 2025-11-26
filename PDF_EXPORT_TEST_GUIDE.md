# PDF Export - Testing Guide

## 🚀 Quick Test Commands

Your server is running on: **http://localhost:3002**

---

## Step 1: Test Health Check ✅

Check if the API is configured correctly:

```powershell
curl http://localhost:3002/api/export-pdf
```

**Expected Response:**
```json
{
  "status": "ok",
  "service": "PDF Export API",
  "baseUrl": "http://localhost:3002",
  "environment": "development",
  "validTemplates": [...],
  "testUrl": "http://localhost:3002/candidate/cv/print/vintage?id=test"
}
```

---

## Step 2: Test Print Page in Browser 🌐

Open in your browser:

```
http://localhost:3002/candidate/cv/print/vintage?id=test
```

**Verify:**
- ✅ Page loads without errors
- ✅ Two-column layout visible
- ✅ Tailwind styles applied
- ✅ Fonts render correctly
- ✅ No console errors

Test all templates:
- http://localhost:3002/candidate/cv/print/classic?id=test
- http://localhost:3002/candidate/cv/print/modern?id=test
- http://localhost:3002/candidate/cv/print/professional?id=test
- http://localhost:3002/candidate/cv/print/vintage?id=test

---

## Step 3: Test PDF Export via API 📄

### Test Vintage Template:
```powershell
curl -X POST http://localhost:3002/api/export-pdf `
  -H "Content-Type: application/json" `
  -d '{\"cvId\": \"test\", \"templateId\": \"vintage\", \"fileName\": \"test-vintage\"}' `
  --output test-vintage.pdf
```

### Test Classic Template:
```powershell
curl -X POST http://localhost:3002/api/export-pdf `
  -H "Content-Type: application/json" `
  -d '{\"cvId\": \"test\", \"templateId\": \"classic\"}' `
  --output test-classic.pdf
```

### Test Modern Template:
```powershell
curl -X POST http://localhost:3002/api/export-pdf `
  -H "Content-Type: application/json" `
  -d '{\"cvId\": \"test\", \"templateId\": \"modern\"}' `
  --output test-modern.pdf
```

### Test Professional Template:
```powershell
curl -X POST http://localhost:3002/api/export-pdf `
  -H "Content-Type: application/json" `
  -d '{\"cvId\": \"test\", \"templateId\": \"professional\"}' `
  --output test-professional.pdf
```

---

## Step 4: Verify Server Logs 📝

Look for these messages in your terminal:

```
🚀 PDF EXPORT STARTED
========================================
📋 CV ID: test
🎨 Template: vintage
🔧 Environment: Development
🌐 Resolved Base URL: http://localhost:3002
✅ Navigation timeout set to 60 seconds
🌐 Attempting to navigate to: http://localhost:3002/candidate/cv/print/vintage?id=test
✅ Page loaded successfully
📄 Page title: CV Print - vintage
✅ All fonts loaded
📄 Generating PDF...
✅ PDF generated (XXX.XX KB)
✅ PDF EXPORT COMPLETED in X.XXs
```

---

## Step 5: Open and Verify PDFs 👀

Open each generated PDF and verify:

- ✅ PDF opens without errors
- ✅ Layout matches browser preview
- ✅ All text visible and properly formatted
- ✅ Colors render correctly (backgrounds, text colors)
- ✅ Fonts don't fallback to system defaults
- ✅ Spacing and padding correct
- ✅ Borders visible (especially vintage template)
- ✅ Two-column layout preserved (vintage template)
- ✅ No content cut off or overlapping
- ✅ Fits properly on A4 page

---

## 🐛 Troubleshooting

### Issue: Connection Refused
**Cause:** Server not running or wrong port

**Solution:**
```powershell
# Check what's running on ports
netstat -ano | findstr :3002

# Make sure dev server is running
npm run dev
```

### Issue: Still Getting Timeout
**Cause:** Old code cached or wrong URL

**Solution:**
```powershell
# 1. Stop the server (Ctrl+C)
# 2. Clear Next.js cache
Remove-Item -Recurse -Force .next

# 3. Restart
npm run dev
```

### Issue: 404 Not Found
**Cause:** Wrong URL or template ID

**Solution:**
- Verify URL: `http://localhost:3002` (not 3000 or 3001)
- Use valid template: classic, modern, professional, vintage
- Check health endpoint first: `curl http://localhost:3002/api/export-pdf`

### Issue: PDF is Blank
**Cause:** Print page not rendering or CSS not loaded

**Debug Steps:**
1. Test print page in browser first
2. Check browser console for errors
3. Verify imports in print page:
   - `import '@/app/globals.css'`
   - `import '../print.css'`
   - `import '../fonts.css'`

### Issue: Styles Missing in PDF
**Cause:** Tailwind or CSS not loading

**Solution:**
1. Open print page: http://localhost:3002/candidate/cv/print/vintage?id=test
2. Check if styles render in browser
3. If browser works but PDF doesn't, check Puppeteer logs
4. Verify `await page.evaluateHandle('document.fonts.ready')` runs

---

## ✅ Success Criteria

Your PDF export is working correctly when:

1. ✅ Health check returns `"status": "ok"`
2. ✅ Print page loads in browser with styles
3. ✅ PDF export completes without timeout
4. ✅ Generated PDF > 0 bytes
5. ✅ PDF opens in viewer successfully
6. ✅ PDF layout matches browser preview
7. ✅ All styles preserved (Tailwind + custom CSS)
8. ✅ Fonts render correctly
9. ✅ Colors accurate
10. ✅ No console errors

---

## 📊 Expected Timeline

- Health check: ~100ms
- Print page load: ~1-2 seconds
- PDF generation: ~3-5 seconds
- Total export: ~4-7 seconds

If it takes longer, check:
- Network latency
- Browser launch time
- Font loading time
- Page complexity

---

## 🎯 Quick Test Script

Save this as `test-pdf-export.ps1`:

```powershell
# PDF Export Test Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "PDF Export System Test" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Health Check
Write-Host "Test 1: Health Check..." -ForegroundColor Yellow
try {
    $health = curl -s http://localhost:3002/api/export-pdf | ConvertFrom-Json
    if ($health.status -eq "ok") {
        Write-Host "✅ Health check passed" -ForegroundColor Green
        Write-Host "   Base URL: $($health.baseUrl)" -ForegroundColor Gray
    } else {
        Write-Host "❌ Health check failed" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Cannot connect to server" -ForegroundColor Red
    Write-Host "   Make sure server is running: npm run dev" -ForegroundColor Gray
    exit 1
}

Write-Host ""

# Test 2: PDF Export
Write-Host "Test 2: PDF Export (Vintage)..." -ForegroundColor Yellow
try {
    curl -X POST http://localhost:3002/api/export-pdf `
      -H "Content-Type: application/json" `
      -d '{\"cvId\": \"test\", \"templateId\": \"vintage\"}' `
      --output test-output.pdf
    
    if (Test-Path "test-output.pdf") {
        $size = (Get-Item "test-output.pdf").Length
        if ($size -gt 0) {
            Write-Host "✅ PDF generated successfully" -ForegroundColor Green
            Write-Host "   File: test-output.pdf" -ForegroundColor Gray
            Write-Host "   Size: $([math]::Round($size/1KB, 2)) KB" -ForegroundColor Gray
        } else {
            Write-Host "❌ PDF file is empty" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "❌ PDF file not created" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ PDF export failed: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ All tests passed!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Open test-output.pdf to verify the result" -ForegroundColor Yellow
```

Run it:
```powershell
.\test-pdf-export.ps1
```

---

**Server Status:** ✅ Running on http://localhost:3002

**Ready to test!** Start with the health check command above.
