import React, { useState, useRef, useCallback } from 'react';
import { Download, FileText, AlertCircle, CheckCircle, Loader2, Eye, X } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Types
interface ResumeData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    website?: string;
    summary: string;
    jobTitle?: string;
    yearsExperience?: string;
  };
  experience: Array<{
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    graduationDate: string;
    gpa?: string;
    coursework?: string;
    honors?: string;
    location?: string;
    current: boolean;
    type: string;
  }>;
  skills: Array<{
    name: string;
    category: 'technical' | 'soft' | 'tools' | 'certifications';
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    years?: string;
    featured: boolean;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    dateObtained: string;
    expirationDate?: string;
    credentialId?: string;
    verificationUrl?: string;
    status: 'valid' | 'expired' | 'in-progress' | 'pending';
    description?: string;
  }>;
  projects?: Array<{
    title: string;
    description: string;
    technologies: string[];
    role: string;
    startDate: string;
    endDate: string;
    status: 'completed' | 'in-progress' | 'on-hold' | 'concept';
    githubUrl?: string;
    liveUrl?: string;
    metrics?: string;
    type: string;
    teamSize?: string;
  }>;
}

interface Template {
  id: string;
  name: string;
  colors: { primary: string; secondary: string; accent: string };
  layout: 'single-column' | 'two-column' | 'creative' | 'minimal';
  atsScore: number;
}

interface PDFGeneratorProps {
  resumeData: ResumeData;
  template: Template;
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

interface PDFOptions {
  format: 'letter' | 'a4';
  orientation: 'portrait' | 'landscape';
  quality: 'standard' | 'high' | 'print';
  includeColors: boolean;
  fontSize: 'small' | 'medium' | 'large';
  margins: 'narrow' | 'normal' | 'wide';
}

// Loading spinner component to avoid repetition
const LoadingSpinner: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <Loader2 className={`${className} animate-spin`} />
);

// Progress update throttling
const useThrottledProgress = () => {
  const [progress, setProgress] = useState(0);
  const lastUpdateRef = useRef(0);
  
  const updateProgress = useCallback((value: number) => {
    const now = Date.now();
    // Only update every 100ms or on significant changes (5% steps)
    if (now - lastUpdateRef.current > 100 || Math.abs(value - progress) >= 5) {
      setProgress(value);
      lastUpdateRef.current = now;
    }
  }, [progress]);

  return { progress, updateProgress, setProgress };
};

// PDF Generation Hook
const usePDFGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { progress, updateProgress, setProgress } = useThrottledProgress();
  const [error, setError] = useState<string | null>(null);
  const [generatedPDF, setGeneratedPDF] = useState<Blob | null>(null);

  const generatePDF = useCallback(async (
    element: HTMLElement,
    options: PDFOptions,
    filename: string
  ): Promise<Blob | null> => {
    try {
      setIsGenerating(true);
      updateProgress(0);
      setError(null);

      // Step 1: Prepare element for capture (10%)
      updateProgress(10);
      
      // Clone the element to avoid modifying the original
      const clonedElement = element.cloneNode(true) as HTMLElement;
      clonedElement.style.transform = 'scale(1)';
      clonedElement.style.transformOrigin = 'top left';
      clonedElement.style.position = 'absolute';
      clonedElement.style.left = '-9999px';
      clonedElement.style.top = '0';
      
      // Apply print-specific styles to the cloned element
      const printStyles = document.createElement('style');
      printStyles.textContent = `
        * {
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        body { margin: 0; padding: 0; }
        .no-print { display: none !important; }
        .print-break-before { page-break-before: always; break-before: page; }
        .print-break-after { page-break-after: always; break-after: page; }
        .print-break-inside-avoid { 
          page-break-inside: avoid; 
          break-inside: avoid-page; 
        }
      `;
      
      // Temporarily add the cloned element and styles to DOM
      document.head.appendChild(printStyles);
      document.body.appendChild(clonedElement);

      // Step 2: Configure canvas options (20%)
      updateProgress(20);
      
      // Memory safety: Cap scale for large documents
      const baseScale = options.quality === 'print' ? 3 : options.quality === 'high' ? 2 : 1.5;
      const elementArea = element.offsetWidth * element.offsetHeight;
      const maxArea = 30000000; // ~30 megapixels to prevent crashes
      const memoryScale = elementArea > maxArea ? Math.sqrt(maxArea / elementArea) : 1;
      const scale = Math.min(baseScale, baseScale * memoryScale);
      
      const canvasOptions = {
        scale: scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: options.includeColors ? null : '#ffffff',
        logging: false,
        width: clonedElement.offsetWidth,
        height: clonedElement.offsetHeight,
        foreignObjectRendering: true,
        // Note: windowWidth, windowHeight, scrollX, scrollY are not valid html2canvas options
      };

      // Step 3: Capture cloned element as canvas (50%)
      updateProgress(30);
      const canvas = await html2canvas(clonedElement, canvasOptions);
      updateProgress(50);

      // Step 4: Configure PDF options (60%)
      updateProgress(60);
      
      const pageFormat = options.format === 'a4' ? 'a4' : 'letter';
      const orientation = options.orientation;
      const pdf = new jsPDF({
        orientation,
        unit: 'pt',
        format: pageFormat,
        compress: true,
      });

      // Calculate dimensions
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Apply margins - Fixed key mapping
      const marginMap: Record<'narrow' | 'normal' | 'wide', number> = { 
        narrow: 36, 
        normal: 72, 
        wide: 108 
      };
      const margin = marginMap[options.margins];
      const contentWidth = pdfWidth - (margin * 2);
      const contentHeight = pdfHeight - (margin * 2);

      // Step 5: Add canvas to PDF (80%)
      updateProgress(70);
      
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      // Calculate scaling to fit content area
      const scaleX = contentWidth / imgWidth;
      const scaleY = contentHeight / imgHeight;
      const scale2 = Math.min(scaleX, scaleY);
      
      const scaledWidth = imgWidth * scale2;
      const scaledHeight = imgHeight * scale2;
      
      // Center the content
      const xOffset = (pdfWidth - scaledWidth) / 2;
      const yOffset = margin;

      // Handle multi-page content
      if (scaledHeight > contentHeight) {
        // Multi-page handling
        let currentPage = 0;
        let yPosition = 0;
        
        while (yPosition < imgHeight) {
          if (currentPage > 0) {
            pdf.addPage();
          }
          
          const sourceY = yPosition;
          const sourceHeight = Math.min(contentHeight / scale2, imgHeight - yPosition);
          
          // Create a temporary canvas for this page section
          const pageCanvas = document.createElement('canvas');
          const pageCtx = pageCanvas.getContext('2d');
          
          if (!pageCtx) {
            throw new Error('Failed to get canvas context');
          }
          
          pageCanvas.width = imgWidth;
          pageCanvas.height = sourceHeight;
          
          pageCtx.drawImage(
            canvas,
            0, sourceY, imgWidth, sourceHeight,
            0, 0, imgWidth, sourceHeight
          );
          
          const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.95);
          const pageScaledHeight = sourceHeight * scale2;
          
          pdf.addImage(
            pageImgData,
            'JPEG',
            xOffset,
            yOffset,
            scaledWidth,
            pageScaledHeight,
            undefined,
            'FAST'
          );
          
          yPosition += sourceHeight;
          currentPage++;
        }
      } else {
        // Single page
        pdf.addImage(
          imgData,
          'JPEG',
          xOffset,
          yOffset,
          scaledWidth,
          scaledHeight,
          undefined,
          'FAST'
        );
      }

      // Step 6: Add metadata (90%)
      updateProgress(80);
      
      pdf.setProperties({
        title: `${filename} - Resume`,
        subject: 'Professional Resume',
        author: 'FreeResume Builder',
        creator: 'FreeResume Builder - https://freeresume-builder.pages.dev',
        keywords: 'resume, cv, professional, job application',
      });

      // Step 7: Generate blob (100%)
      updateProgress(90);
      
      const pdfBlob = pdf.output('blob');
      setGeneratedPDF(pdfBlob);
      updateProgress(100);

      // Cleanup
      document.head.removeChild(printStyles);
      document.body.removeChild(clonedElement);
      
      return pdfBlob;

    } catch (err) {
      console.error('PDF Generation Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate PDF');
      return null;
    } finally {
      setIsGenerating(false);
      setTimeout(() => setProgress(0), 2000);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const downloadPDF = useCallback((blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.pdf`;
    document.body.appendChild(link);
    
    // Better download detection (though still not perfect across all browsers)
    try {
      link.click();
    } catch (e) {
      console.warn('Download may have been cancelled:', e);
    }
    
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  return {
    generatePDF,
    downloadPDF,
    isGenerating,
    progress,
    error,
    generatedPDF,
    setError,
  };
};

// Print-Optimized Resume Component
const PrintResume: React.FC<{ resumeData: ResumeData; template: Template; options: PDFOptions }> = ({
  resumeData,
  template,
  options
}) => {
  // Enhanced ATS mode: strip all colors and use only grayscale
  const primaryColor = options.includeColors ? template.colors.primary : '#000000';
  const textColor = options.includeColors ? '#374151' : '#000000';
  const borderColor = options.includeColors ? template.colors.primary : '#000000';
  
  const fontSizeMap = {
    small: { base: '10pt', lg: '12pt', xl: '14pt', '2xl': '16pt' },
    medium: { base: '11pt', lg: '13pt', xl: '15pt', '2xl': '18pt' },
    large: { base: '12pt', lg: '14pt', xl: '16pt', '2xl': '20pt' }
  };
  
  const fonts = fontSizeMap[options.fontSize];

  return (
    <div 
      style={{ 
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#ffffff',
        color: textColor,
        fontSize: fonts.base,
        lineHeight: '1.4',
        width: '8.5in',
        minHeight: '11in',
        padding: options.margins === 'narrow' ? '0.5in' : options.margins === 'wide' ? '1.5in' : '1in',
        margin: '0 auto',
        boxSizing: 'border-box'
      }}
      className="print-break-inside-avoid"
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '24pt' }}>
        <h1 style={{ 
          fontSize: fonts['2xl'], 
          fontWeight: 'bold', 
          color: primaryColor,
          margin: '0 0 8pt 0'
        }}>
          {resumeData.personalInfo.firstName} {resumeData.personalInfo.lastName}
        </h1>
        {resumeData.personalInfo.jobTitle && (
          <div style={{ fontSize: fonts.lg, color: textColor, margin: '0 0 12pt 0' }}>
            {resumeData.personalInfo.jobTitle}
          </div>
        )}
        <div style={{ fontSize: fonts.base, color: textColor }}>
          {resumeData.personalInfo.email}
          {resumeData.personalInfo.phone && ` • ${resumeData.personalInfo.phone}`}
          {resumeData.personalInfo.location && ` • ${resumeData.personalInfo.location}`}
          {resumeData.personalInfo.linkedin && (
            <div style={{ marginTop: '4pt' }}>
              LinkedIn: {resumeData.personalInfo.linkedin.replace('https://', '')}
            </div>
          )}
          {resumeData.personalInfo.website && (
            <div style={{ marginTop: '4pt' }}>
              Portfolio: {resumeData.personalInfo.website.replace('https://', '')}
            </div>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {resumeData.personalInfo.summary && (
        <div style={{ marginBottom: '24pt' }} className="print-break-inside-avoid">
          <h2 style={{ 
            fontSize: fonts.lg, 
            fontWeight: 'bold', 
            color: primaryColor,
            borderBottom: `2pt solid ${borderColor}`,
            paddingBottom: '4pt',
            margin: '0 0 12pt 0'
          }}>
            Professional Summary
          </h2>
          <div style={{ fontSize: fonts.base, lineHeight: '1.5' }}>
            {resumeData.personalInfo.summary}
          </div>
        </div>
      )}

      {/* Experience */}
      {resumeData.experience && resumeData.experience.length > 0 && (
        <div style={{ marginBottom: '24pt' }}>
          <h2 style={{ 
            fontSize: fonts.lg, 
            fontWeight: 'bold', 
            color: primaryColor,
            borderBottom: `2pt solid ${borderColor}`,
            paddingBottom: '4pt',
            margin: '0 0 12pt 0'
          }}>
            Professional Experience
          </h2>
          {resumeData.experience.map((exp, index) => (
            <div key={index} style={{ marginBottom: '16pt' }} className="print-break-inside-avoid">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4pt' }}>
                <div>
                  <div style={{ fontSize: fonts.base, fontWeight: 'bold', color: textColor }}>
                    {exp.title}
                  </div>
                  <div style={{ fontSize: fonts.base, color: textColor }}>
                    {exp.company}{exp.location && `, ${exp.location}`}
                  </div>
                </div>
                <div style={{ fontSize: fonts.base, color: textColor, textAlign: 'right' }}>
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </div>
              </div>
              {exp.description && (
                <div style={{ fontSize: fonts.base, lineHeight: '1.4', whiteSpace: 'pre-line' }}>
                  {exp.description}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {resumeData.education && resumeData.education.length > 0 && (
        <div style={{ marginBottom: '24pt' }}>
          <h2 style={{ 
            fontSize: fonts.lg, 
            fontWeight: 'bold', 
            color: primaryColor,
            borderBottom: `2pt solid ${borderColor}`,
            paddingBottom: '4pt',
            margin: '0 0 12pt 0'
          }}>
            Education
          </h2>
          {resumeData.education.map((edu, index) => (
            <div key={index} style={{ marginBottom: '12pt' }} className="print-break-inside-avoid">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: fonts.base, fontWeight: 'bold', color: textColor }}>
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </div>
                  <div style={{ fontSize: fonts.base, color: textColor }}>
                    {edu.institution}{edu.location && `, ${edu.location}`}
                  </div>
                  {edu.gpa && (
                    <div style={{ fontSize: fonts.base, color: textColor }}>
                      GPA: {edu.gpa}
                    </div>
                  )}
                </div>
                <div style={{ fontSize: fonts.base, color: textColor }}>
                  {edu.graduationDate}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {resumeData.skills && resumeData.skills.length > 0 && (
        <div style={{ marginBottom: '24pt' }}>
          <h2 style={{ 
            fontSize: fonts.lg, 
            fontWeight: 'bold', 
            color: primaryColor,
            borderBottom: `2pt solid ${borderColor}`,
            paddingBottom: '4pt',
            margin: '0 0 12pt 0'
          }}>
            Skills & Expertise
          </h2>
          <div style={{ fontSize: fonts.base, lineHeight: '1.5' }}>
            {['technical', 'soft', 'tools', 'certifications'].map(category => {
              const categorySkills = resumeData.skills.filter(skill => skill.category === category);
              if (categorySkills.length === 0) return null;
              
              return (
                <div key={category} style={{ marginBottom: '8pt' }}>
                  <span style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                    {category === 'technical' ? 'Technical Skills' : 
                     category === 'soft' ? 'Soft Skills' :
                     category === 'tools' ? 'Tools & Technologies' : 'Certifications'}:
                  </span>
                  {' '}
                  {categorySkills.map(skill => skill.name).join(', ')}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Certifications */}
      {resumeData.certifications && resumeData.certifications.length > 0 && (
        <div style={{ marginBottom: '24pt' }}>
          <h2 style={{ 
            fontSize: fonts.lg, 
            fontWeight: 'bold', 
            color: primaryColor,
            borderBottom: `2pt solid ${borderColor}`,
            paddingBottom: '4pt',
            margin: '0 0 12pt 0'
          }}>
            Certifications
          </h2>
          {resumeData.certifications.map((cert, index) => (
            <div key={index} style={{ marginBottom: '8pt' }} className="print-break-inside-avoid">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontWeight: 'bold' }}>{cert.name}</span>
                  <span style={{ color: textColor }}> - {cert.issuer}</span>
                </div>
                <span style={{ color: textColor }}>{cert.dateObtained}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {resumeData.projects && resumeData.projects.length > 0 && (
        <div style={{ marginBottom: '24pt' }}>
          <h2 style={{ 
            fontSize: fonts.lg, 
            fontWeight: 'bold', 
            color: primaryColor,
            borderBottom: `2pt solid ${borderColor}`,
            paddingBottom: '4pt',
            margin: '0 0 12pt 0'
          }}>
            Projects
          </h2>
          {resumeData.projects.map((project, index) => (
            <div key={index} style={{ marginBottom: '12pt' }} className="print-break-inside-avoid">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4pt' }}>
                <div style={{ fontWeight: 'bold' }}>{project.title}</div>
                <div>{project.startDate} - {project.endDate}</div>
              </div>
              <div style={{ marginBottom: '4pt' }}>{project.description}</div>
              {project.technologies.length > 0 && (
                <div style={{ fontSize: fonts.base, color: textColor }}>
                  <strong>Technologies:</strong> {project.technologies.join(', ')}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Main PDF Generator Component
export default function PDFGenerator({ 
  resumeData, 
  template, 
  isOpen = false, 
  onClose = () => {},
  className = ''
}: PDFGeneratorProps) {
  const { generatePDF, downloadPDF, isGenerating, progress, error, generatedPDF, setError } = usePDFGenerator();
  const [showPreview, setShowPreview] = useState(false);
  const [pdfOptions, setPdfOptions] = useState<PDFOptions>({
    format: 'letter',
    orientation: 'portrait',
    quality: 'high',
    includeColors: true,
    fontSize: 'medium',
    margins: 'normal'
  });
  
  // Separate refs for different purposes - Fixed ref issue
  const pdfElementRef = useRef<HTMLDivElement>(null);
  const previewElementRef = useRef<HTMLDivElement>(null);

  const generateFileName = () => {
    const name = `${resumeData.personalInfo.firstName}_${resumeData.personalInfo.lastName}`.replace(/\s+/g, '_');
    const date = new Date().toISOString().split('T')[0];
    return `${name}_Resume_${date}`;
  };

  const handleGeneratePDF = async () => {
    if (!pdfElementRef.current) return;
    
    const filename = generateFileName();
    const blob = await generatePDF(pdfElementRef.current, pdfOptions, filename);
    
    if (blob) {
      downloadPDF(blob, filename);
    }
  };

  const handleQuickDownload = async () => {
    if (!pdfElementRef.current) return;
    
    const filename = generateFileName();
    const quickOptions: PDFOptions = {
      format: 'letter',
      orientation: 'portrait',
      quality: 'standard',
      includeColors: true,
      fontSize: 'medium',
      margins: 'normal'
    };
    
    const blob = await generatePDF(pdfElementRef.current, quickOptions, filename);
    
    if (blob) {
      downloadPDF(blob, filename);
    }
  };

  if (!isOpen && !className) {
    return (
      <button
        onClick={handleQuickDownload}
        disabled={isGenerating}
        className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
      >
        {isGenerating ? (
          <LoadingSpinner />
        ) : (
          <Download className="w-4 h-4" />
        )}
        <span>{isGenerating ? 'Generating...' : 'Download PDF'}</span>
      </button>
    );
  }

  return (
    <>
      {/* Quick Download Button */}
      {className && (
        <button
          onClick={handleQuickDownload}
          disabled={isGenerating}
          className={className}
        >
          {isGenerating ? (
            <LoadingSpinner />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span>{isGenerating ? 'Generating...' : 'Download'}</span>
        </button>
      )}

      {/* Hidden PDF Generation Element - Always rendered for ref stability */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px', visibility: 'hidden' }}>
        <div ref={pdfElementRef}>
          <PrintResume 
            resumeData={resumeData} 
            template={template} 
            options={pdfOptions}
          />
        </div>
      </div>

      {/* PDF Generator Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <FileText className="w-6 h-6 text-blue-600" />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Export to PDF</h2>
                  <p className="text-sm text-gray-600">Customize your PDF settings and download</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex h-[70vh]">
              {/* Settings Panel */}
              <div className="w-80 border-r border-gray-200 p-6 overflow-y-auto">
                <h3 className="font-medium text-gray-900 mb-4">PDF Settings</h3>
                
                <div className="space-y-6">
                  {/* Format */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Page Format
                    </label>
                    <select
                      value={pdfOptions.format}
                      onChange={(e) => setPdfOptions({...pdfOptions, format: e.target.value as 'letter' | 'a4'})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="letter">US Letter (8.5" × 11")</option>
                      <option value="a4">A4 (210mm × 297mm)</option>
                    </select>
                  </div>

                  {/* Quality */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quality
                    </label>
                    <select
                      value={pdfOptions.quality}
                      onChange={(e) => setPdfOptions({...pdfOptions, quality: e.target.value as 'standard' | 'high' | 'print'})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="standard">Standard (Fast)</option>
                      <option value="high">High Quality</option>
                      <option value="print">Print Quality (300 DPI)</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Print quality may take longer for large documents
                    </p>
                  </div>

                  {/* Font Size */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Font Size
                    </label>
                    <select
                      value={pdfOptions.fontSize}
                      onChange={(e) => setPdfOptions({...pdfOptions, fontSize: e.target.value as 'small' | 'medium' | 'large'})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="small">Small (Compact)</option>
                      <option value="medium">Medium (Balanced)</option>
                      <option value="large">Large (Readable)</option>
                    </select>
                  </div>

                  {/* Margins */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Margins
                    </label>
                    <select
                      value={pdfOptions.margins}
                      onChange={(e) => setPdfOptions({...pdfOptions, margins: e.target.value as 'narrow' | 'normal' | 'wide'})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="narrow">Narrow (More Content)</option>
                      <option value="normal">Normal (Balanced)</option>
                      <option value="wide">Wide (Clean Look)</option>
                    </select>
                  </div>

                  {/* Include Colors - Enhanced ATS messaging */}
                  <div>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={pdfOptions.includeColors}
                        onChange={(e) => setPdfOptions({...pdfOptions, includeColors: e.target.checked})}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Include Colors</span>
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      {pdfOptions.includeColors 
                        ? "Colorful design for human review" 
                        : "Black & white for maximum ATS compatibility"}
                    </p>
                  </div>
                </div>

                {/* Progress */}
                {isGenerating && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <LoadingSpinner className="text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">Generating PDF...</span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-blue-700 mt-1">{progress}% complete</p>
                  </div>
                )}

                {/* Error */}
                {error && (
                  <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-red-900">Generation Failed</p>
                        <p className="text-xs text-red-700 mt-1">{error}</p>
                        <button
                          onClick={() => setError(null)}
                          className="text-xs text-red-600 hover:text-red-700 mt-1"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Success */}
                {generatedPDF && !isGenerating && (
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-green-900">PDF Generated Successfully!</p>
                        <p className="text-xs text-green-700 mt-1">Your resume has been downloaded.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Preview Panel */}
              <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">PDF Preview</h3>
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="flex items-center space-x-2 px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    <span>{showPreview ? 'Hide' : 'Show'} Preview</span>
                  </button>
                </div>

                {showPreview && (
                  <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="transform scale-75 origin-top-left" style={{ width: '133.33%' }}>
                      <div ref={previewElementRef}>
                        <PrintResume 
                          resumeData={resumeData} 
                          template={template} 
                          options={pdfOptions}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {!showPreview && (
                  <div className="flex items-center justify-center h-64 bg-white rounded-lg border-2 border-dashed border-gray-300">
                    <div className="text-center">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Click "Show Preview" to see PDF preview</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-600">
                💡 Tip: Use "Print Quality" for professional printing, "Standard" for email attachments
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={handleGeneratePDF}
                  disabled={isGenerating}
                  className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {isGenerating ? (
                    <LoadingSpinner />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  <span>{isGenerating ? 'Generating...' : 'Download PDF'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}