'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  X, 
  CheckCircle, 
  AlertCircle,
  File,
  Image as ImageIcon,
  Eye,
  Download,
  Trash2,
  Clock,
  Shield,
  Zap,
  Cloud,
  Plus,
  Search,
  Filter,
  MoreVertical
} from 'lucide-react';

interface UploadedFile {
  file: File;
  id: string;
  status: 'uploading' | 'success' | 'error';
  progress: number;
  category?: string;
  tags?: string[];
  uploadDate?: Date;
  preview?: string;
}

interface DocumentCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string; size?: number | string }>;
  acceptedFormats: string[];
  maxSize: number;
  examples: string[];
  color: string;
}

interface DocumentUploadProps {
  onFilesUploaded: (files: File[]) => void;
  acceptedTypes?: string[];
  maxFiles?: number;
  maxSize?: number; // in MB
  showCategories?: boolean;
  showPreview?: boolean;
  allowTagging?: boolean;
}

const documentCategories: DocumentCategory[] = [
  {
    id: 'property',
    name: 'Property Documents',
    description: 'Sale deeds, rental agreements, NOCs',
    icon: FileText,
    acceptedFormats: ['.pdf', '.jpg', '.png', '.docx'],
    maxSize: 10,
    examples: ['Property Sale Agreement', 'Rental Agreement', 'NOC Certificate'],
    color: 'blue'
  },
  {
    id: 'identity',
    name: 'Identity Documents',
    description: 'Aadhaar, PAN, passport, license',
    icon: Shield,
    acceptedFormats: ['.pdf', '.jpg', '.png'],
    maxSize: 5,
    examples: ['Aadhaar Card', 'PAN Card', 'Passport', 'Driving License'],
    color: 'green'
  },
  {
    id: 'business',
    name: 'Business Documents',
    description: 'Certificates, licenses, agreements',
    icon: File,
    acceptedFormats: ['.pdf', '.docx', '.jpg', '.png'],
    maxSize: 15,
    examples: ['GST Certificate', 'Business License', 'Partnership Deed'],
    color: 'purple'
  },
  {
    id: 'legal',
    name: 'Legal Documents',
    description: 'Affidavits, notices, contracts',
    icon: FileText,
    acceptedFormats: ['.pdf', '.docx'],
    maxSize: 20,
    examples: ['Affidavit', 'Legal Notice', 'Contract Agreement'],
    color: 'red'
  }
];

export default function DocumentUpload({
  onFilesUploaded,
  acceptedTypes = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'],
  maxFiles = 5,
  maxSize = 10,
  showCategories = false,
  showPreview = true,
  allowTagging = false
}: DocumentUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'uploading' | 'success' | 'error'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FileText className="w-8 h-8 text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileText className="w-8 h-8 text-blue-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <ImageIcon className="w-8 h-8 text-green-500" />;
      default:
        return <File className="w-8 h-8 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File) => {
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedTypes.includes(extension)) {
      return `File type ${extension} is not supported`;
    }
    if (file.size > maxSize * 1024 * 1024) {
      return `File size exceeds ${maxSize}MB limit`;
    }
    return null;
  };

  const handleFiles = (files: FileList) => {
    if (uploadedFiles.length + files.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const newFiles: UploadedFile[] = [];
    
    Array.from(files).forEach((file) => {
      const error = validateFile(file);
      if (error) {
        alert(error);
        return;
      }

      const uploadedFile: UploadedFile = {
        file,
        id: Math.random().toString(36).substr(2, 9),
        status: 'uploading',
        progress: 0,
        category: selectedCategory?.name || 'General',
        tags: [],
        uploadDate: new Date()
      };

      newFiles.push(uploadedFile);

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === uploadedFile.id 
              ? { ...f, progress: Math.min(f.progress + Math.random() * 15, 100) }
              : f
          )
        );
      }, 200);

      // Simulate upload completion
      setTimeout(() => {
        clearInterval(interval);
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === uploadedFile.id 
              ? { ...f, status: 'success', progress: 100 }
              : f
          )
        );
      }, 2000 + Math.random() * 2000);
    });

    setUploadedFiles(prev => [...prev, ...newFiles]);
    onFilesUploaded(newFiles.map(f => f.file));
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const filteredFiles = uploadedFiles.filter(file => {
    const matchesSearch = file.file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || file.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="w-full space-y-6">
      {/* Categories Section */}
      {showCategories && !selectedCategory && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Document Categories</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {documentCategories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category)}
                className={`bg-white border border-gray-200 rounded-lg p-4 text-left hover:shadow-md transition-all group`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`w-10 h-10 bg-${category.color}-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-${category.color}-200 transition-colors`}>
                  <category.icon className={`w-5 h-5 text-${category.color}-600`} />
                </div>
                <h4 className="font-medium text-gray-900 mb-1">{category.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                <div className="text-xs text-gray-500">
                  Max {category.maxSize}MB • {category.acceptedFormats.join(', ')}
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Selected Category Header */}
      {selectedCategory && (
        <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <selectedCategory.icon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{selectedCategory.name}</h3>
              <p className="text-sm text-gray-600">{selectedCategory.description}</p>
            </div>
          </div>
          <button
            onClick={() => setSelectedCategory(null)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Upload Area */}
      <motion.div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
          dragActive
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleChange}
          accept={selectedCategory ? selectedCategory.acceptedFormats.join(',') : acceptedTypes.join(',')}
          className="hidden"
        />
        
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Upload className="w-8 h-8 text-blue-600" />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {selectedCategory ? `Upload ${selectedCategory.name}` : 'Upload Documents'}
            </h3>
            <p className="text-gray-600 mb-4">
              Drag and drop your files here, or click to browse
            </p>
            <button
              onClick={onButtonClick}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Choose Files
            </button>
          </div>
          
          <div className="text-sm text-gray-500">
            <p>Supported formats: {selectedCategory ? selectedCategory.acceptedFormats.join(', ') : acceptedTypes.join(', ')}</p>
            <p>Maximum {maxFiles} files, {selectedCategory ? selectedCategory.maxSize : maxSize}MB each</p>
          </div>
        </div>

        {/* Security Badge */}
        <div className="absolute top-4 right-4 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
          <Shield className="w-3 h-3 inline mr-1" />
          Secure Upload
        </div>
      </motion.div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-4">
          {/* Files Header with Search and Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">
                Uploaded Files ({filteredFiles.length}/{maxFiles})
              </h4>
              <p className="text-sm text-gray-600">Manage your uploaded documents</p>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              {/* Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'uploading' | 'success' | 'error')}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Files</option>
                <option value="uploading">Uploading</option>
                <option value="success">Completed</option>
                <option value="error">Failed</option>
              </select>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Files', value: uploadedFiles.length, color: 'blue' },
              { label: 'Completed', value: uploadedFiles.filter(f => f.status === 'success').length, color: 'green' },
              { label: 'Uploading', value: uploadedFiles.filter(f => f.status === 'uploading').length, color: 'yellow' },
              { label: 'Failed', value: uploadedFiles.filter(f => f.status === 'error').length, color: 'red' }
            ].map((stat, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
          
          {/* Files List */}
          <div className="space-y-3">
            <AnimatePresence>
              {filteredFiles.map((uploadedFile) => (
                <motion.div
                  key={uploadedFile.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="flex-shrink-0">
                        {getFileIcon(uploadedFile.file.name)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="font-medium text-gray-900 truncate">{uploadedFile.file.name}</p>
                          {uploadedFile.category && (
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                              {uploadedFile.category}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{formatFileSize(uploadedFile.file.size)}</span>
                          {uploadedFile.uploadDate && (
                            <span>{uploadedFile.uploadDate.toLocaleDateString()}</span>
                          )}
                          <div className={`flex items-center space-x-1 ${
                            uploadedFile.status === 'success' ? 'text-green-600' :
                            uploadedFile.status === 'error' ? 'text-red-600' :
                            'text-blue-600'
                          }`}>
                            {uploadedFile.status === 'uploading' && <Clock className="w-4 h-4" />}
                            {uploadedFile.status === 'success' && <CheckCircle className="w-4 h-4" />}
                            {uploadedFile.status === 'error' && <AlertCircle className="w-4 h-4" />}
                            <span className="capitalize">{uploadedFile.status}</span>
                          </div>
                        </div>

                        {/* Progress Bar for Uploading Files */}
                        {uploadedFile.status === 'uploading' && (
                          <div className="mt-2">
                            <div className="flex items-center space-x-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${uploadedFile.progress}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-600 w-12 text-right">
                                {Math.round(uploadedFile.progress)}%
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Tags */}
                        {allowTagging && uploadedFile.tags && uploadedFile.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {uploadedFile.tags.map((tag, index) => (
                              <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {uploadedFile.status === 'success' && showPreview && (
                        <>
                          <button
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Preview"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      
                      <button
                        onClick={() => removeFile(uploadedFile.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Empty State for Filtered Results */}
          {filteredFiles.length === 0 && uploadedFiles.length > 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No files found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          )}

          {/* Bulk Actions */}
          {uploadedFiles.filter(f => f.status === 'success').length > 0 && (
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                {uploadedFiles.filter(f => f.status === 'success').length} files ready for processing
              </div>
              <div className="space-x-3">
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium">
                  Submit All for Notarization
                </button>
                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                  Save as Draft
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tips Section */}
      {uploadedFiles.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Zap className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-blue-900 mb-2">Upload Tips</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Ensure documents are clear and readable</li>
                <li>• Use high-quality scans or photos</li>
                <li>• Remove any sensitive information not required</li>
                <li>• Organize documents by category for faster processing</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
