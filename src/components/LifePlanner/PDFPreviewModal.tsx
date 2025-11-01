import React, { useState, useEffect } from 'react';
import { X, Download, FileText, Loader } from 'lucide-react';
import { PDFGenerator } from '../../utils/pdfGenerator';

interface PDFPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  visions: any[];
  title?: string;
  subtitle?: string;
}

const PDFPreviewModal: React.FC<PDFPreviewModalProps> = ({
  isOpen,
  onClose,
  visions,
  title = 'My Life Planner',
  subtitle
}) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    if (isOpen && visions.length > 0) {
      generatePreview();
    }
    
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [isOpen, visions]);

  const generatePreview = async () => {
    setIsGenerating(true);
    
    try {
      const pdfGenerator = new PDFGenerator();
      
      const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      const options = {
        title,
        subtitle: subtitle || `Generated on ${currentDate}`,
        visions: visions.map(vision => ({
          id: vision.id,
          title: vision.title || vision.name,
          description: vision.description,
          image: vision.image || vision.imageUrl,
          progress: vision.progress || 0,
          color: vision.color || '#3B82F6',
          goals: vision.goals || [],
          tasks: vision.tasks || [],
          todos: vision.todos || [],
          word: vision.word
        })),
        includeImages: true
      };
      
      await pdfGenerator.generatePDF(options);
      const blob = pdfGenerator.getBlob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (error) {
      console.error('Error generating PDF preview:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `life-planner-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6" />
            <div>
              <h2 className="text-xl font-bold">PDF Preview</h2>
              <p className="text-blue-100 text-sm">{title}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {pdfUrl && (
              <button 
                onClick={handleDownload}
                className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </button>
            )}
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-6 h-[calc(90vh-120px)] overflow-auto bg-gray-50">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <Loader className="h-12 w-12 animate-spin text-blue-600" />
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Generating PDF Preview</h3>
                <p className="text-gray-600">Please wait while we create your colorful life planner PDF...</p>
              </div>
            </div>
          ) : pdfUrl && !isMobile ? (
            <div className="h-full">
              <iframe
                src={pdfUrl}
                className="w-full h-full border border-gray-300 rounded-lg bg-white shadow-lg"
                title="PDF Preview"
              />
            </div>
          ) : pdfUrl && isMobile ? (
            <div className="h-full flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-lg">
              <img 
                src="/pdf-preview-placeholder.png" 
                alt="PDF Preview" 
                title="PDF Preview"
              />
              <p className="mt-4 text-gray-600 text-center">PDF preview is not available on mobile devices. Please use the download button to view the PDF.</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <FileText className="h-12 w-12 text-gray-400" />
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No Preview Available</h3>
                <p className="text-gray-600">Unable to generate PDF preview. Please try again.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PDFPreviewModal;