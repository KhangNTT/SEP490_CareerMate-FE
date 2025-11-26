import { NextRequest, NextResponse } from "next/server";
import chromium from "@sparticuz/chromium";

// ========================================
// RUNTIME CONFIGURATION
// ========================================

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60; // Maximum execution time in seconds

// ========================================
// CONFIGURATION
// ========================================

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
const isDev = process.env.NODE_ENV === "development";

// Valid template IDs
const VALID_TEMPLATES = ['classic', 'modern', 'professional', 'vintage'];

// ========================================
// TYPES
// ========================================

interface ExportRequest {
  cvId: string;
  templateId: string;
  fileName?: string;
}

// ========================================
// MAIN EXPORT HANDLER
// ========================================

export async function POST(req: NextRequest) {
  let browser = null;
  const startTime = Date.now();
  
  try {
    // ========================================
    // 1. PARSE REQUEST
    // ========================================
    
    const body: ExportRequest = await req.json();
    const { cvId, templateId, fileName } = body;

    // Validate required fields
    if (!cvId) {
      return NextResponse.json(
        { error: "CV ID is required" },
        { status: 400 }
      );
    }

    if (!templateId) {
      return NextResponse.json(
        { error: "Template ID is required" },
        { status: 400 }
      );
    }

    // Validate template ID
    if (!VALID_TEMPLATES.includes(templateId)) {
      return NextResponse.json(
        { error: `Invalid template ID. Valid options: ${VALID_TEMPLATES.join(', ')}` },
        { status: 400 }
      );
    }

    console.log("========================================");
    console.log("🚀 PDF EXPORT STARTED");
    console.log("========================================");
    console.log("📋 CV ID:", cvId);
    console.log("🎨 Template:", templateId);
    console.log("📁 File name:", fileName || `cv-${cvId}.pdf`);
    console.log("🔧 Environment:", isDev ? "Development" : "Production");
    console.log("🌐 Base URL:", BASE_URL);
    console.log("========================================");

    // ========================================
    // 2. LAUNCH BROWSER
    // ========================================
    
    try {
      if (isDev) {
        // Development: Use full puppeteer with bundled Chromium
        const puppeteer = require("puppeteer");
        
        console.log("🔍 Launching bundled Chromium (development mode)");

        browser = await puppeteer.launch({
          headless: true,
          args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu",
            "--disable-web-security",
            "--disable-features=IsolateOrigins,site-per-process",
            "--font-render-hinting=none",
            "--hide-scrollbars",
            "--disable-background-timer-throttling",
            "--disable-backgrounding-occluded-windows",
            "--disable-renderer-backgrounding",
          ],
        });
      } else {
        // Production: Use puppeteer-core + @sparticuz/chromium for serverless
        const puppeteerCore = require("puppeteer-core");
        
        console.log("🔍 Launching @sparticuz/chromium (production mode)");
        
        browser = await puppeteerCore.launch({
          args: [
            ...chromium.args,
            "--hide-scrollbars",
            "--disable-web-security",
          ],
          defaultViewport: {
            width: 1920,
            height: 1080,
          },
          executablePath: await chromium.executablePath(),
          headless: true,
        });
      }

      console.log("✅ Browser launched successfully");
    } catch (launchError: any) {
      console.error("❌ Browser launch failed:", launchError);
      throw new Error(`Failed to launch browser: ${launchError.message}`);
    }

    // ========================================
    // 3. CREATE NEW PAGE
    // ========================================
    
    const page = await browser.newPage();
    console.log("✅ New page created");

    // ========================================
    // 4. SET VIEWPORT
    // ========================================
    
    // A4 dimensions at 96 DPI: 794×1123 pixels
    await page.setViewport({
      width: 794,
      height: 1123,
      deviceScaleFactor: 1,
    });
    
    console.log("✅ Viewport set to A4 (794×1123px @ 96 DPI)");

    // ========================================
    // 5. NAVIGATE TO PRINT PAGE
    // ========================================
    
    const printUrl = `${BASE_URL}/candidate/cv/print/${templateId}?id=${cvId}`;
    console.log("🌐 Navigating to:", printUrl);

    try {
      await page.goto(printUrl, {
        waitUntil: "networkidle0", // Wait until no more than 0 network connections
        timeout: 30000,             // 30 second timeout
      });
      
      console.log("✅ Page loaded successfully");
    } catch (navError: any) {
      console.error("❌ Navigation failed:", navError);
      throw new Error(`Failed to load print page: ${navError.message}`);
    }

    // ========================================
    // 6. WAIT FOR FONTS
    // ========================================
    
    try {
      await page.evaluateHandle('document.fonts.ready');
      console.log("✅ Fonts loaded and ready");
    } catch (fontError: any) {
      console.warn("⚠️  Font loading check failed (continuing anyway):", fontError.message);
    }

    // ========================================
    // 7. EMULATE MEDIA TYPE
    // ========================================
    
    await page.emulateMediaType("print");
    console.log("✅ Media type set to 'print'");

    // ========================================
    // 8. OPTIONAL: WAIT FOR CUSTOM READY EVENT
    // ========================================
    
    // If your print page dispatches a custom event when ready:
    /*
    try {
      await page.evaluate(() => {
        return new Promise((resolve) => {
          if (document.readyState === 'complete') {
            resolve(true);
          } else {
            window.addEventListener('load', () => resolve(true));
          }
        });
      });
      console.log("✅ Custom ready event detected");
    } catch (readyError: any) {
      console.warn("⚠️  Custom ready event check failed:", readyError.message);
    }
    */

    // ========================================
    // 9. GENERATE PDF
    // ========================================
    
    console.log("📄 Generating PDF...");

    const pdfBuffer = await page.pdf({
      // Paper format
      format: "A4",
      
      // Background rendering
      printBackground: true,
      
      // Page size behavior
      preferCSSPageSize: true, // Respect @page CSS rules
      
      // Margins
      margin: {
        top: "10mm",
        right: "10mm",
        bottom: "10mm",
        left: "10mm",
      },
      
      // Orientation
      landscape: false,
      
      // Background transparency
      omitBackground: false,
      
      // Font loading
      waitForFonts: true,
      
      // Timeout
      timeout: 30000,
      
      // Scale
      scale: 1,
      
      // Header/Footer (disabled for CV)
      displayHeaderFooter: false,
      
      // Experimental features
      tagged: false,
      outline: false,
    });

    // ========================================
    // 10. CLEANUP
    // ========================================
    
    await browser.close();
    console.log("✅ Browser closed");

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log("========================================");
    console.log("✅ PDF GENERATION COMPLETED");
    console.log("========================================");
    console.log("📊 Buffer size:", (pdfBuffer.length / 1024).toFixed(2), "KB");
    console.log("⏱️  Duration:", duration, "seconds");
    console.log("========================================");

    // ========================================
    // 11. RETURN PDF
    // ========================================
    
    const finalFileName = fileName || `cv-${cvId}.pdf`;
    
    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${finalFileName}"`,
        "Content-Length": pdfBuffer.length.toString(),
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });

  } catch (error: any) {
    // ========================================
    // ERROR HANDLING
    // ========================================
    
    console.error("========================================");
    console.error("❌ PDF GENERATION ERROR");
    console.error("========================================");
    console.error("Error:", error.message);
    console.error("Stack:", error.stack);
    console.error("========================================");

    // Cleanup browser if still open
    if (browser) {
      try {
        await browser.close();
        console.log("🧹 Browser closed after error");
      } catch (closeError: any) {
        console.error("⚠️  Failed to close browser:", closeError.message);
      }
    }

    // Return error response
    return NextResponse.json(
      {
        error: "PDF generation failed",
        message: error.message,
        details: isDev ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

// ========================================
// HEALTH CHECK ENDPOINT (GET)
// ========================================

export async function GET(req: NextRequest) {
  return NextResponse.json({
    status: "ok",
    service: "PDF Export API",
    environment: isDev ? "development" : "production",
    baseUrl: BASE_URL,
    validTemplates: VALID_TEMPLATES,
    timestamp: new Date().toISOString(),
  });
}
