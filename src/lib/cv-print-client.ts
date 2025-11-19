// ========================================
// CV PRINT CLIENT UTILITY
// Usage: Call from your CV preview page
// ========================================

interface ExportPDFOptions {
  cvId: string;
  templateId: 'classic' | 'modern' | 'professional';
  fileName?: string;
}

export async function exportCVToPDF(options: ExportPDFOptions): Promise<Blob> {
  const { cvId, templateId, fileName } = options;

  // Validate inputs
  if (!cvId) {
    throw new Error('CV ID is required');
  }

  if (!templateId) {
    throw new Error('Template ID is required');
  }

  const validTemplates = ['classic', 'modern', 'professional'];
  if (!validTemplates.includes(templateId)) {
    throw new Error(`Invalid template. Valid options: ${validTemplates.join(', ')}`);
  }

  try {
    // Call export API
    const response = await fetch('/candidate/cv/api/export-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cvId,
        templateId,
        fileName: fileName || `cv-${cvId}.pdf`,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'PDF export failed');
    }

    // Return PDF blob
    return await response.blob();
  } catch (error: any) {
    console.error('PDF export error:', error);
    throw error;
  }
}

// ========================================
// DOWNLOAD PDF TO USER'S DEVICE
// ========================================

export function downloadPDF(blob: Blob, fileName: string): void {
  // Create temporary download link
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

// ========================================
// UPLOAD PDF TO FIREBASE
// ========================================

export async function uploadPDFToFirebase(
  blob: Blob,
  userId: string,
  fileName: string
): Promise<string> {
  // TODO: Implement Firebase upload
  // This is a placeholder - integrate with your existing Firebase upload helper
  
  const formData = new FormData();
  formData.append('file', blob, fileName);
  formData.append('userId', userId);
  formData.append('type', 'cv');

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Firebase upload failed');
  }

  const data = await response.json();
  return data.url; // Return Firebase Storage URL
}

// ========================================
// COMPLETE EXPORT WORKFLOW
// ========================================

export async function exportAndDownloadCV(
  options: ExportPDFOptions & {
    onProgress?: (stage: string) => void;
    onError?: (error: Error) => void;
  }
): Promise<void> {
  const { cvId, templateId, fileName, onProgress, onError } = options;

  try {
    // Stage 1: Generate PDF
    onProgress?.('Generating PDF...');
    const pdfBlob = await exportCVToPDF({ cvId, templateId, fileName });

    // Stage 2: Download
    onProgress?.('Downloading PDF...');
    const finalFileName = fileName || `cv-${cvId}.pdf`;
    downloadPDF(pdfBlob, finalFileName);

    // Stage 3: Complete
    onProgress?.('Complete!');
  } catch (error: any) {
    onError?.(error);
    throw error;
  }
}

// ========================================
// EXPORT WITH FIREBASE UPLOAD
// ========================================

export async function exportAndUploadCV(
  options: ExportPDFOptions & {
    userId: string;
    onProgress?: (stage: string) => void;
    onError?: (error: Error) => void;
  }
): Promise<string> {
  const { cvId, templateId, fileName, userId, onProgress, onError } = options;

  try {
    // Stage 1: Generate PDF
    onProgress?.('Generating PDF...');
    const pdfBlob = await exportCVToPDF({ cvId, templateId, fileName });

    // Stage 2: Upload to Firebase
    onProgress?.('Uploading to Firebase...');
    const finalFileName = fileName || `cv-${cvId}.pdf`;
    const firebaseUrl = await uploadPDFToFirebase(pdfBlob, userId, finalFileName);

    // Stage 3: Complete
    onProgress?.('Complete!');
    
    return firebaseUrl;
  } catch (error: any) {
    onError?.(error);
    throw error;
  }
}

// ========================================
// USAGE EXAMPLE
// ========================================

/*

import { 
  exportCVToPDF, 
  downloadPDF, 
  exportAndDownloadCV 
} from '@/lib/cv-print-client';

// Example 1: Simple export and download
async function handleExport() {
  try {
    await exportAndDownloadCV({
      cvId: '123',
      templateId: 'modern',
      fileName: 'my-cv.pdf',
      onProgress: (stage) => console.log(stage),
      onError: (error) => console.error(error),
    });
  } catch (error) {
    console.error('Export failed:', error);
  }
}

// Example 2: Export and get blob for custom handling
async function handleExportCustom() {
  try {
    const blob = await exportCVToPDF({
      cvId: '123',
      templateId: 'professional',
    });
    
    // Do something custom with the blob
    console.log('PDF size:', blob.size, 'bytes');
    
    // Download it
    downloadPDF(blob, 'my-cv.pdf');
  } catch (error) {
    console.error('Export failed:', error);
  }
}

// Example 3: With React component
function CVExportButton({ cvId, templateId }: { cvId: string; templateId: string }) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');

  const handleExport = async () => {
    setLoading(true);
    
    try {
      await exportAndDownloadCV({
        cvId,
        templateId: templateId as any,
        fileName: `cv-${cvId}.pdf`,
        onProgress: (stage) => setProgress(stage),
        onError: (error) => {
          console.error(error);
          alert(`Export failed: ${error.message}`);
        },
      });
    } finally {
      setLoading(false);
      setProgress('');
    }
  };

  return (
    <button onClick={handleExport} disabled={loading}>
      {loading ? progress : 'Export PDF'}
    </button>
  );
}

*/
