import { useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor = ({ value, onChange, placeholder }: RichTextEditorProps) => {
  const quillRef = useRef<ReactQuill>(null);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      [{ 'size': [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, 
       { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image', 'video'],
      [{ 'align': [] }],
      [{ 'color': [] }, { 'background': [] }],
      ['code-block'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false,
    }
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video',
    'align', 'color', 'background',
    'code-block'
  ];

  useEffect(() => {
    // Add custom styles for the editor
    const style = document.createElement('style');
    style.textContent = `
      .ql-editor {
        min-height: 400px;
        font-family: inherit;
        font-size: 14px;
        line-height: 1.6;
      }
      
      .ql-toolbar {
        border-top: 1px solid hsl(var(--border));
        border-left: 1px solid hsl(var(--border));
        border-right: 1px solid hsl(var(--border));
        border-bottom: none;
        background: hsl(var(--background));
      }
      
      .ql-container {
        border-bottom: 1px solid hsl(var(--border));
        border-left: 1px solid hsl(var(--border));
        border-right: 1px solid hsl(var(--border));
        border-top: none;
        background: hsl(var(--card));
      }
      
      .ql-editor.ql-blank::before {
        color: hsl(var(--muted-foreground));
        font-style: normal;
      }
      
      .ql-toolbar .ql-stroke {
        stroke: hsl(var(--foreground));
      }
      
      .ql-toolbar .ql-fill {
        fill: hsl(var(--foreground));
      }
      
      .ql-toolbar .ql-picker-label {
        color: hsl(var(--foreground));
      }
      
      .ql-toolbar button:hover {
        background: hsl(var(--secondary));
      }
      
      .ql-toolbar button.ql-active {
        background: hsl(var(--primary));
      }
      
      .ql-toolbar button.ql-active .ql-stroke {
        stroke: hsl(var(--primary-foreground));
      }
      
      .ql-toolbar button.ql-active .ql-fill {
        fill: hsl(var(--primary-foreground));
      }
      
      .ql-editor h1,
      .ql-editor h2,
      .ql-editor h3,
      .ql-editor h4,
      .ql-editor h5,
      .ql-editor h6 {
        color: hsl(var(--foreground));
        font-weight: 600;
        margin-top: 1rem;
        margin-bottom: 0.5rem;
      }
      
      .ql-editor h1 { font-size: 2rem; }
      .ql-editor h2 { font-size: 1.5rem; }
      .ql-editor h3 { font-size: 1.25rem; }
      .ql-editor h4 { font-size: 1.125rem; }
      .ql-editor h5 { font-size: 1rem; }
      .ql-editor h6 { font-size: 0.875rem; }
      
      .ql-editor p {
        margin-bottom: 1rem;
        color: hsl(var(--foreground));
      }
      
      .ql-editor ul,
      .ql-editor ol {
        margin-bottom: 1rem;
        padding-left: 1.5rem;
      }
      
      .ql-editor li {
        margin-bottom: 0.25rem;
        color: hsl(var(--foreground));
      }
      
      .ql-editor blockquote {
        border-left: 4px solid hsl(var(--primary));
        padding-left: 1rem;
        margin: 1rem 0;
        background: hsl(var(--secondary));
        padding: 1rem;
        border-radius: 0.375rem;
      }
      
      .ql-editor pre {
        background: hsl(var(--muted));
        padding: 1rem;
        border-radius: 0.375rem;
        margin: 1rem 0;
        overflow-x: auto;
      }
      
      .ql-editor code {
        background: hsl(var(--muted));
        padding: 0.125rem 0.25rem;
        border-radius: 0.25rem;
        font-family: 'Courier New', monospace;
      }
      
      .ql-editor a {
        color: hsl(var(--primary));
        text-decoration: underline;
      }
      
      .ql-editor a:hover {
        color: hsl(var(--primary-hover));
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="w-full">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{
          backgroundColor: 'transparent',
        }}
      />
    </div>
  );
};

export { RichTextEditor };