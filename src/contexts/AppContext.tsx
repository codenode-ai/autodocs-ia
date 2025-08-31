import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Types
export interface Document {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  uploadedAt: string;
  content?: string;
  extractedText?: string;
}

export interface Report {
  id: string;
  title: string;
  type: 'technical' | 'analysis' | 'summary' | 'custom';
  status: 'draft' | 'processing' | 'completed' | 'error';
  content: string;
  documentIds: string[];
  createdAt: string;
  updatedAt: string;
  pages?: number;
  documentSource?: string;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  autoSave: boolean;
  defaultReportType: Report['type'];
  pdfTemplate: 'minimal' | 'standard' | 'detailed';
  aiProvider: 'openai' | 'claude' | 'gemini';
}

interface AppState {
  documents: Document[];
  reports: Report[];
  settings: AppSettings;
  isLoading: boolean;
  error: string | null;
}

// Actions
type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_DOCUMENT'; payload: Document }
  | { type: 'UPDATE_DOCUMENT'; payload: { id: string; updates: Partial<Document> } }
  | { type: 'REMOVE_DOCUMENT'; payload: string }
  | { type: 'ADD_REPORT'; payload: Report }
  | { type: 'UPDATE_REPORT'; payload: { id: string; updates: Partial<Report> } }
  | { type: 'REMOVE_REPORT'; payload: string }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppSettings> }
  | { type: 'LOAD_STATE'; payload: Partial<AppState> };

// Initial state
const initialState: AppState = {
  documents: [],
  reports: [],
  settings: {
    theme: 'system',
    autoSave: true,
    defaultReportType: 'technical',
    pdfTemplate: 'standard',
    aiProvider: 'openai'
  },
  isLoading: false,
  error: null
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'ADD_DOCUMENT':
      return { ...state, documents: [...state.documents, action.payload] };
    
    case 'UPDATE_DOCUMENT':
      return {
        ...state,
        documents: state.documents.map(doc =>
          doc.id === action.payload.id 
            ? { ...doc, ...action.payload.updates }
            : doc
        )
      };
    
    case 'REMOVE_DOCUMENT':
      return {
        ...state,
        documents: state.documents.filter(doc => doc.id !== action.payload)
      };
    
    case 'ADD_REPORT':
      return { ...state, reports: [...state.reports, action.payload] };
    
    case 'UPDATE_REPORT':
      return {
        ...state,
        reports: state.reports.map(report =>
          report.id === action.payload.id 
            ? { ...report, ...action.payload.updates, updatedAt: new Date().toISOString() }
            : report
        )
      };
    
    case 'REMOVE_REPORT':
      return {
        ...state,
        reports: state.reports.filter(report => report.id !== action.payload)
      };
    
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };
    
    case 'LOAD_STATE':
      return { ...state, ...action.payload };
    
    default:
      return state;
  }
}

// Context
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Helper functions
  addDocument: (document: Document) => void;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  removeDocument: (id: string) => void;
  addReport: (report: Report) => void;
  updateReport: (id: string, updates: Partial<Report>) => void;
  removeReport: (id: string) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('reportai-state');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        dispatch({ type: 'LOAD_STATE', payload: parsedState });
      } catch (error) {
        console.error('Failed to load state from localStorage:', error);
      }
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    const stateToSave = {
      documents: state.documents,
      reports: state.reports,
      settings: state.settings
    };
    localStorage.setItem('reportai-state', JSON.stringify(stateToSave));
  }, [state.documents, state.reports, state.settings]);

  // Helper functions
  const addDocument = (document: Document) => {
    dispatch({ type: 'ADD_DOCUMENT', payload: document });
  };

  const updateDocument = (id: string, updates: Partial<Document>) => {
    dispatch({ type: 'UPDATE_DOCUMENT', payload: { id, updates } });
  };

  const removeDocument = (id: string) => {
    dispatch({ type: 'REMOVE_DOCUMENT', payload: id });
  };

  const addReport = (report: Report) => {
    dispatch({ type: 'ADD_REPORT', payload: report });
  };

  const updateReport = (id: string, updates: Partial<Report>) => {
    dispatch({ type: 'UPDATE_REPORT', payload: { id, updates } });
  };

  const removeReport = (id: string) => {
    dispatch({ type: 'REMOVE_REPORT', payload: id });
  };

  const updateSettings = (settings: Partial<AppSettings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const value: AppContextType = {
    state,
    dispatch,
    addDocument,
    updateDocument,
    removeDocument,
    addReport,
    updateReport,
    removeReport,
    updateSettings,
    setLoading,
    setError
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// Hook
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}