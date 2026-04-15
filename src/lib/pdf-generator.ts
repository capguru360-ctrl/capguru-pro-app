import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';

/**
 * CapGuru Pro - Robust PDF Generation Engine
 * 
 * This engine uses 'html-to-image' instead of 'html2canvas' because 
 * Tailwind CSS v4 uses modern color functions (oklab, oklch) which 
 * html2canvas cannot currently parse.
 */
export async function generatePDF(elementId: string, fileName: string) {
  const element = document.getElementById(elementId);
  
  if (!element) {
    console.error(`[PDF Error] Target element #${elementId} not found.`);
    return false;
  }

  try {
    console.log(`[PDF Engine] Starting capture for #${elementId}...`);
    
    // 1. Stabilization: Wait for charts and animations to settle
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 2. High-Fidelity Capture
    let dataUrl: string;
    try {
      const { toCanvas } = await import('html-to-image');
      const canvas = await toCanvas(element, {
        pixelRatio: 2,
        cacheBust: true,
        skipFonts: false,
        backgroundColor: '#0B1E3C',
        style: {
          transform: 'none',
          transition: 'none',
          animation: 'none',
          position: 'relative',
          left: '0',
          top: '0',
          visibility: 'visible',
          opacity: '1',
          margin: '0',
          color: '#FFFFFF',
          fontFamily: 'Inter, system-ui, sans-serif',
        },
        filter: (node) => {
          if (node instanceof HTMLElement) {
            return !node.classList.contains('pdf-exclude');
          }
          return true;
        }
      });
      dataUrl = canvas.toDataURL('image/png', 1.0);
    } catch (err) {
      console.warn('[PDF Warning] toCanvas failed, falling back to toPng...', err);
      const { toPng } = await import('html-to-image');
      dataUrl = await toPng(element, {
        pixelRatio: 2,
        cacheBust: true,
        skipFonts: true,
        backgroundColor: '#0B1E3C',
        style: {
          transform: 'none',
          transition: 'none',
          animation: 'none',
          position: 'relative',
          left: '0',
          top: '0',
          visibility: 'visible',
          opacity: '1',
          margin: '0',
        }
      });
    }

    // 3. Validation & PDF Construction
    if (!dataUrl || dataUrl.length < 1000) {
      throw new Error('Captured image is empty or invalid.');
    }

    console.log(`[PDF Engine] Capture successful. Image size: ${Math.round(dataUrl.length / 1024)} KB`);

    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    // 4. Responsive Scaling
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const imgProps = pdf.getImageProperties(dataUrl);
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    // 5. Final Assembly
    const format = dataUrl.startsWith('data:image/jpeg') ? 'JPEG' : 'PNG';
    pdf.addImage(dataUrl, format, 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
    pdf.save(`${fileName}.pdf`);

    console.log(`[PDF Success] ${fileName}.pdf has been generated.`);
    return true;
  } catch (error: any) {
    console.error('[PDF Engine Failure]', error);
    
    // Handle specific browser event errors (often CORS or resource related)
    if (error instanceof Event) {
      console.error('[PDF Error] A resource failed to load. Check console for network errors.');
    }
    
    return false;
  }
}
