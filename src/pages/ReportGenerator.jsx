import { useState, useRef } from 'react';
import { Download, FileText, Trash2, Bold, Italic, List, Heading2, Upload, X, ZoomIn, ZoomOut, Maximize2, Minimize2 } from 'lucide-react';

const ReportGenerator = () => {
  const [reportContent, setReportContent] = useState('');
  const [reportTitle, setReportTitle] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const updateStats = (content) => {
    const words = content.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
    setCharCount(content.length);
  };

  const handleContentChange = (e) => {
    const content = e.target.value;
    setReportContent(content);
    updateStats(content);
  };

  const insertMarkdown = (format) => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = reportContent.substring(start, end);
    let newText = '';

    switch (format) {
      case 'bold':
        newText = `**${selectedText || 'bold text'}**`;
        break;
      case 'italic':
        newText = `*${selectedText || 'italic text'}*`;
        break;
      case 'heading':
        newText = `## ${selectedText || 'Heading'}`;
        break;
      case 'list':
        newText = `- ${selectedText || 'List item'}`;
        break;
      default:
        newText = selectedText;
    }

    const before = reportContent.substring(0, start);
    const after = reportContent.substring(end);
    const updatedContent = before + newText + after;
    setReportContent(updatedContent);
    updateStats(updatedContent);
    
    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + newText.length, start + newText.length);
    }, 0);
  };

  const downloadReport = () => {
    const content = reportTitle 
      ? `# ${reportTitle}\n\n${reportContent}` 
      : reportContent;
    
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report_${reportTitle || 'untitled'}_${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearReport = () => {
    if (window.confirm('Are you sure you want to clear the report? This action cannot be undone.')) {
      setReportContent('');
      setReportTitle('');
      updateStats('');
    }
  };

  const loadTemplate = (template) => {
    let content = '';
    switch (template) {
      case 'research':
        content = `# Research Report

## Abstract

[Write your abstract here]

## Introduction

[Write your introduction here]

## Methodology

[Describe your methodology]

## Results

[Present your results]

## Discussion

[Discuss your findings]

## Conclusion

[Summarize your conclusions]

## References

1. [Citation 1]
2. [Citation 2]
`;
        break;
      case 'literature':
        content = `# Literature Review

## Overview

[Overview of the literature]

## Key Themes

### Theme 1
[Description]

### Theme 2
[Description]

## Gaps in Research

[Identify gaps]

## Conclusion

[Concluding remarks]

## References

[Your references]
`;
        break;
      case 'blank':
        content = '';
        break;
    }
    setReportContent(content);
    updateStats(content);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      
      if (file.type === 'application/pdf') {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFilePreview(e.target.result);
        };
        reader.readAsDataURL(file);
      } else if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFilePreview(e.target.result);
        };
        reader.readAsDataURL(file);
      } else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFilePreview(null);
          setReportContent(e.target.result);
          updateStats(e.target.result);
        };
        reader.readAsText(file);
      } else {
        alert('Unsupported file type. Please upload PDF, image, or text files.');
      }
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 10, 50));
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="max-w-full mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Manual Report Generator</h1>
        <p className="text-gray-600">
          Upload a paper/document on the left, read it, and manually type your report on the right.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side - Paper Viewer */}
        <div className={`space-y-4 ${isFullscreen ? 'lg:col-span-2' : ''}`}>
          <div className="card flex flex-col" style={{ minHeight: '600px' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Paper/Document Viewer</h3>
              <div className="flex items-center space-x-2">
                {uploadedFile && (
                  <>
                    <button
                      onClick={handleZoomOut}
                      className="p-2 hover:bg-gray-100 rounded transition-colors"
                      title="Zoom Out"
                    >
                      <ZoomOut className="h-4 w-4" />
                    </button>
                    <span className="text-sm text-gray-600">{zoomLevel}%</span>
                    <button
                      onClick={handleZoomIn}
                      className="p-2 hover:bg-gray-100 rounded transition-colors"
                      title="Zoom In"
                    >
                      <ZoomIn className="h-4 w-4" />
                    </button>
                    <button
                      onClick={toggleFullscreen}
                      className="p-2 hover:bg-gray-100 rounded transition-colors"
                      title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                    >
                      {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={removeFile}
                      className="p-2 hover:bg-red-50 rounded transition-colors text-red-600"
                      title="Remove File"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {!uploadedFile ? (
              <div className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-center p-8">
                  <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 mb-4">Upload a paper or document to read</p>
                  <label className="btn-primary inline-flex items-center space-x-2 cursor-pointer">
                    <Upload className="h-4 w-4" />
                    <span>Upload Document</span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg,.txt"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-2">Supports PDF, Images, and Text files</p>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-auto bg-gray-100 rounded-lg p-4" style={{ minHeight: '500px' }}>
                {uploadedFile && uploadedFile.type === 'application/pdf' && filePreview ? (
                  <div className="flex justify-center items-start">
                    <iframe
                      src={filePreview}
                      className="border border-gray-300 shadow-lg bg-white"
                      style={{
                        width: `${zoomLevel}%`,
                        minHeight: '600px',
                        maxWidth: '100%'
                      }}
                      title="PDF Viewer"
                    />
                  </div>
                ) : uploadedFile && uploadedFile.type.startsWith('image/') && filePreview ? (
                  <div className="flex justify-center items-start">
                    <img
                      src={filePreview}
                      alt="Uploaded document"
                      className="border border-gray-300 shadow-lg max-w-full"
                      style={{
                        transform: `scale(${zoomLevel / 100})`,
                        transformOrigin: 'top center',
                        maxWidth: '100%'
                      }}
                    />
                  </div>
                ) : uploadedFile ? (
                  <div className="bg-white p-4 rounded border border-gray-300">
                    <p className="text-sm text-gray-600 mb-2">File: {uploadedFile.name}</p>
                    <p className="text-xs text-gray-500">Text file content has been loaded into the editor.</p>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Manual Typing Editor */}
        {!isFullscreen && (
          <div className="space-y-4">
            <div className="card flex flex-col" style={{ minHeight: '600px' }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Manual Typing Editor</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={downloadReport}
                    className="btn-primary flex items-center space-x-1"
                    disabled={!reportContent.trim()}
                  >
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </button>
                  <button
                    onClick={clearReport}
                    className="btn-secondary flex items-center space-x-1"
                    disabled={!reportContent.trim()}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Clear</span>
                  </button>
                </div>
              </div>

              {/* Report Title */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Title
                </label>
                <input
                  type="text"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  placeholder="Enter report title..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Formatting Toolbar */}
              <div className="mb-4 flex items-center space-x-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
                <button
                  onClick={() => insertMarkdown('bold')}
                  className="p-2 hover:bg-gray-200 rounded transition-colors"
                  title="Bold"
                >
                  <Bold className="h-4 w-4" />
                </button>
                <button
                  onClick={() => insertMarkdown('italic')}
                  className="p-2 hover:bg-gray-200 rounded transition-colors"
                  title="Italic"
                >
                  <Italic className="h-4 w-4" />
                </button>
                <button
                  onClick={() => insertMarkdown('heading')}
                  className="p-2 hover:bg-gray-200 rounded transition-colors"
                  title="Heading"
                >
                  <Heading2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => insertMarkdown('list')}
                  className="p-2 hover:bg-gray-200 rounded transition-colors"
                  title="List"
                >
                  <List className="h-4 w-4" />
                </button>
                <div className="flex-1"></div>
                <div className="text-xs text-gray-500">
                  {wordCount} words • {charCount} chars
                </div>
              </div>

              {/* Text Editor */}
              <textarea
                ref={textareaRef}
                value={reportContent}
                onChange={handleContentChange}
                placeholder="Read the paper on the left and type your report here...

You can use Markdown formatting:
# Heading 1
## Heading 2
**bold text**
*italic text*
- List item"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm resize-none"
                style={{ minHeight: '400px' }}
              />

              {/* Templates and Quick Actions */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-600">Quick Templates:</span>
                    <button
                      onClick={() => loadTemplate('research')}
                      className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                    >
                      Research
                    </button>
                    <button
                      onClick={() => loadTemplate('literature')}
                      className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                    >
                      Literature
                    </button>
                    <button
                      onClick={() => loadTemplate('blank')}
                      className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                    >
                      Blank
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics Card */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">{wordCount}</div>
                  <div className="text-xs text-gray-600 mt-1">Words</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">{charCount}</div>
                  <div className="text-xs text-gray-600 mt-1">Characters</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">{Math.ceil(wordCount / 200)}</div>
                  <div className="text-xs text-gray-600 mt-1">Minutes Read</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportGenerator;

