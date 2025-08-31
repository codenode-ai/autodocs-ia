import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import type { Document } from '@/contexts/AppContext';

interface UseFileProcessorReturn {
  processFiles: (files: FileList) => Promise<void>;
  isProcessing: boolean;
  error: string | null;
}

export function useFileProcessor(): UseFileProcessorReturn {
  const { addDocument, updateDocument, setError } = useApp();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setLocalError] = useState<string | null>(null);

  const generateId = () => `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const extractTextFromFile = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const result = e.target?.result as string;
        
        if (file.type === 'text/plain') {
          resolve(result);
        } else if (file.type === 'application/pdf') {
          // For now, simulate PDF text extraction
          resolve(`[PDF Content] This is extracted text from ${file.name}. In a real implementation, this would use a PDF parsing library like pdf-js.`);
        } else if (file.type.includes('word') || file.type.includes('document')) {
          // For now, simulate Word document text extraction
          resolve(`[Word Document] This is extracted text from ${file.name}. In a real implementation, this would use a library like mammoth.js.`);
        } else if (file.type.includes('excel') || file.type.includes('spreadsheet')) {
          // For now, simulate Excel text extraction
          resolve(`[Excel Spreadsheet] This is extracted data from ${file.name}. In a real implementation, this would use a library like xlsx.js.`);
        } else {
          resolve(`[${file.type}] Binary file content from ${file.name}`);
        }
      };

      reader.onerror = () => {
        resolve(`Error reading file: ${file.name}`);
      };

      if (file.type === 'text/plain') {
        reader.readAsText(file);
      } else {
        reader.readAsDataURL(file);
      }
    });
  };

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    const maxSize = 50 * 1024 * 1024; // 50MB
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
      'text/csv'
    ];

    if (file.size > maxSize) {
      return { valid: false, error: `File ${file.name} is too large. Maximum size is 50MB.` };
    }

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: `File type ${file.type} is not supported.` };
    }

    return { valid: true };
  };

  const processFiles = async (files: FileList) => {
    setIsProcessing(true);
    setLocalError(null);
    setError(null);

    try {
      const fileArray = Array.from(files);
      
      for (const file of fileArray) {
        const validation = validateFile(file);
        if (!validation.valid) {
          throw new Error(validation.error);
        }

        // Create document entry
        const document: Document = {
          id: generateId(),
          name: file.name,
          size: file.size,
          type: file.type,
          status: 'uploading',
          uploadedAt: new Date().toISOString()
        };

        addDocument(document);

        // Simulate upload progress
        await new Promise(resolve => setTimeout(resolve, 500));
        
        updateDocument(document.id, { status: 'processing' });

        // Extract text content
        try {
          const extractedText = await extractTextFromFile(file);
          
          // Simulate processing time
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          updateDocument(document.id, {
            status: 'completed',
            extractedText,
            content: extractedText
          });
        } catch (extractError) {
          updateDocument(document.id, { 
            status: 'error'
          });
          throw new Error(`Failed to process ${file.name}: ${extractError}`);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setLocalError(errorMessage);
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    processFiles,
    isProcessing,
    error
  };
}