import React, { useState } from 'react';
import { Download, Loader } from 'lucide-react';
import { generateLifePlannerPDF } from '../../utils/pdfGenerator';

interface PDFDownloadButtonProps {
  visions: any[];
  title?: string;
  subtitle?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

const PDFDownloadButton: React.FC<PDFDownloadButtonProps> = ({
  visions,
  title = 'My Life Planner',
  subtitle,
  className = '',
  variant = 'primary',
  size = 'md'
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    
    try {
      const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      const pdfSubtitle = subtitle || `Generated on ${currentDate}`;
      
      await generateLifePlannerPDF(visions, title, pdfSubtitle);
      
      // Show success message on mobile
      if (window.innerWidth < 768) {
        const successMessage = document.createElement('div');
        successMessage.className = 'fixed bottom-4 left-4 right-4 bg-green-600 text-white p-4 rounded-lg shadow-lg z-50 text-center';
        successMessage.textContent = 'PDF downloaded successfully!';
        document.body.appendChild(successMessage);
        
        setTimeout(() => {
          document.body.removeChild(successMessage);
        }, 3000);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl whitespace-nowrap';
      case 'secondary':
        return 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white shadow-lg hover:shadow-xl whitespace-nowrap';
      case 'outline':
        return 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white bg-white whitespace-nowrap';
      default:
        return 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl whitespace-nowrap';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-2 text-sm';
      case 'md':
        return 'px-4 py-2 text-base';
      case 'lg':
        return 'px-6 py-3 text-lg';
      default:
        return 'px-4 py-2 text-base';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 16;
      case 'md':
        return 20;
      case 'lg':
        return 24;
      default:
        return 20;
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isGenerating || visions.length === 0}
      className={`
        inline-flex items-center justify-center space-x-2 
        ${getVariantClasses()} 
        ${getSizeClasses()}
        rounded-xl font-semibold transition-all duration-300 
        transform hover:scale-105 disabled:opacity-50 flex-shrink-0
        disabled:cursor-not-allowed disabled:transform-none
        ${className}
      `}
      title={visions.length === 0 ? 'No data to export' : 'Download PDF'}
    >
      {isGenerating ? (
        <>
          <Loader className="animate-spin" size={getIconSize()} />
          <span>Generating...</span>
        </>
      ) : (
        <>
          <Download size={getIconSize()} />
          <span className="hidden md:inline">Download PDF</span>
          <span className="md:hidden">PDF</span>
        </>
      )}
    </button>
  );
};

export default PDFDownloadButton;