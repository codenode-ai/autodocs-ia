import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import type { Document, Report } from '@/contexts/AppContext';

interface UseAIProcessorReturn {
  generateReport: (documentIds: string[], reportType: Report['type'], title?: string) => Promise<string>;
  isGenerating: boolean;
  error: string | null;
}

// Mock AI templates for different report types
const reportTemplates = {
  technical: {
    sections: ['Executive Summary', 'Technical Analysis', 'Findings', 'Recommendations', 'Conclusion'],
    tone: 'formal and technical',
    focus: 'technical specifications, data analysis, and actionable insights'
  },
  analysis: {
    sections: ['Overview', 'Data Analysis', 'Key Metrics', 'Insights', 'Next Steps'],
    tone: 'analytical and data-driven',
    focus: 'statistical analysis, trends, and data interpretation'
  },
  summary: {
    sections: ['Key Points', 'Main Findings', 'Summary'],
    tone: 'concise and clear',
    focus: 'highlighting the most important information'
  },
  custom: {
    sections: ['Introduction', 'Analysis', 'Conclusions'],
    tone: 'adaptable based on content',
    focus: 'flexible structure based on document content'
  }
};

export function useAIProcessor(): UseAIProcessorReturn {
  const { state, addReport, updateReport, setError } = useApp();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setLocalError] = useState<string | null>(null);

  const generateId = () => `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const simulateAIGeneration = async (
    documents: Document[], 
    reportType: Report['type']
  ): Promise<string> => {
    const template = reportTemplates[reportType];
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate mock content based on document data
    const documentSummary = documents.map(doc => 
      `Document: ${doc.name} (${Math.round(doc.size / 1024)}KB) - ${doc.extractedText?.slice(0, 100)}...`
    ).join('\n\n');

    const mockContent = `
# ${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report

## ${template.sections[0]}
This report analyzes ${documents.length} document(s) uploaded on ${new Date().toLocaleDateString()}. The analysis focuses on ${template.focus}.

## ${template.sections[1]}
Based on the content extracted from the following documents:

${documentSummary}

Key observations:
- Total documents processed: ${documents.length}
- Combined file size: ${Math.round(documents.reduce((acc, doc) => acc + doc.size, 0) / 1024)}KB
- Document types: ${[...new Set(documents.map(doc => doc.type))].join(', ')}

## ${template.sections[2]}
The analysis reveals several important findings that require attention. Each document contributes unique insights to the overall understanding of the subject matter.

### Key Metrics
- Processing completion rate: 100%
- Content extraction accuracy: High
- Data quality assessment: Good

## ${template.sections[3] || 'Recommendations'}
Based on the analysis, we recommend:

1. **Data Integration**: Consolidate findings from all documents
2. **Quality Assurance**: Implement additional validation steps
3. **Documentation**: Maintain detailed records of all processes
4. **Follow-up Actions**: Schedule regular reviews and updates

## ${template.sections[4] || 'Conclusion'}
This ${reportType} report provides a comprehensive analysis of the submitted documents. The findings support data-driven decision making and highlight areas for further investigation.

---
*Report generated on ${new Date().toLocaleString()} using AI-powered analysis*
    `.trim();

    return mockContent;
  };

  const generateReport = async (
    documentIds: string[], 
    reportType: Report['type'], 
    title?: string
  ): Promise<string> => {
    setIsGenerating(true);
    setLocalError(null);
    setError(null);

    try {
      // Get documents
      const documents = state.documents.filter(doc => 
        documentIds.includes(doc.id) && doc.status === 'completed'
      );

      if (documents.length === 0) {
        throw new Error('No completed documents found for report generation');
      }

      // Create initial report
      const reportId = generateId();
      const report: Report = {
        id: reportId,
        title: title || `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report - ${new Date().toLocaleDateString()}`,
        type: reportType,
        status: 'processing',
        content: '',
        documentIds,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        pages: 0,
        documentSource: documents.map(d => d.name).join(', ')
      };

      addReport(report);

      // Simulate AI generation
      const generatedContent = await simulateAIGeneration(documents, reportType);
      
      // Calculate estimated pages (rough estimate: 500 words per page)
      const wordCount = generatedContent.split(/\s+/).length;
      const estimatedPages = Math.max(1, Math.ceil(wordCount / 500));

      // Update report with generated content
      updateReport(reportId, {
        status: 'completed',
        content: generatedContent,
        pages: estimatedPages
      });

      return reportId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate report';
      setLocalError(errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateReport,
    isGenerating,
    error
  };
}