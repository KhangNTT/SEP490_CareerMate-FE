import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const jobId = formData.get("jobId");
    const cvFile = formData.get("cvFile") as File | null;
    const useCurrentCV = formData.get("useCurrentCV") === "true";
    const fullName = formData.get("fullName");
    const phoneNumber = formData.get("phoneNumber");
    const preferredLocation = formData.get("preferredLocation");
    const coverLetter = formData.get("coverLetter");

    // Validation
    if (!jobId || !fullName || !phoneNumber || !preferredLocation) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!useCurrentCV && !cvFile) {
      return NextResponse.json(
        { error: "CV file is required" },
        { status: 400 }
      );
    }

    // Validate phone number
    const phoneRegex = /^\d{10}$/;
    const cleanPhone = (phoneNumber as string).replace(/\s/g, "");
    if (!phoneRegex.test(cleanPhone)) {
      return NextResponse.json(
        { error: "Invalid phone number format" },
        { status: 400 }
      );
    }

    // Validate CV file if uploaded
    if (cvFile) {
      const maxSize = 3 * 1024 * 1024; // 3MB
      if (cvFile.size > maxSize) {
        return NextResponse.json(
          { error: "File size must not exceed 3MB" },
          { status: 400 }
        );
      }

      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(cvFile.type)) {
        return NextResponse.json(
          { error: "Only .doc, .docx, and .pdf files are allowed" },
          { status: 400 }
        );
      }
    }

    // TODO: Here you would:
    // 1. Upload CV file to storage (S3, Azure Blob, etc.)
    // 2. Save application data to database
    // 3. Send notification emails
    // 4. Create application record

    // Mock response for now
    const applicationData = {
      id: Date.now(),
      jobId,
      candidateName: fullName,
      phoneNumber,
      preferredLocation,
      coverLetter,
      cvFileName: useCurrentCV ? "current_cv.pdf" : cvFile?.name,
      status: "pending_review",
      appliedAt: new Date().toISOString(),
    };

    console.log("Application submitted:", applicationData);

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Application submitted successfully",
        data: applicationData,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing job application:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}
