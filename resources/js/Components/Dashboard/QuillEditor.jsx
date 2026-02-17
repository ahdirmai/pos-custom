import React, { useRef, useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import styles

export default function QuillEditor({ value, onChange, placeholder, error }) {
    const quillRef = useRef(null);

    const modules = useMemo(() => ({
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['link', 'image'],
            ['clean']
        ],
    }), []);

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'list', 'bullet',
        'link', 'image'
    ];

    return (
        <div className="quill-wrapper">
            <ReactQuill 
                theme="snow" 
                value={value} 
                onChange={onChange} 
                modules={modules}
                formats={formats}
                placeholder={placeholder}
                className={`bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl overflow-hidden ${error ? 'border border-danger-500' : ''}`}
            />
            {error && (
                <p className="mt-1 text-sm text-danger-500">{error}</p>
            )}
            <style>{`
                .ql-toolbar {
                    border-color: #e2e8f0 !important;
                    border-top-left-radius: 0.75rem;
                    border-top-right-radius: 0.75rem;
                    background-color: #f8fafc;
                }
                .dark .ql-toolbar {
                    border-color: #334155 !important;
                    background-color: #1e293b;
                }
                .ql-container {
                    border-color: #e2e8f0 !important;
                    border-bottom-left-radius: 0.75rem;
                    border-bottom-right-radius: 0.75rem;
                    min-height: 200px;
                    font-family: inherit;
                    font-size: 1rem;
                }
                .dark .ql-container {
                    border-color: #334155 !important;
                    background-color: #0f172a;
                    color: white;
                }
                .ql-editor {
                    min-height: 200px;
                }
                .ql-snow .ql-stroke {
                    stroke: #64748b;
                }
                .dark .ql-snow .ql-stroke {
                    stroke: #94a3b8;
                }
                .ql-snow .ql-fill {
                    fill: #64748b;
                }
                .dark .ql-snow .ql-fill {
                    fill: #94a3b8;
                }
                .ql-snow .ql-picker {
                    color: #64748b;
                }
                .dark .ql-snow .ql-picker {
                    color: #94a3b8;
                }
            `}</style>
        </div>
    );
}
