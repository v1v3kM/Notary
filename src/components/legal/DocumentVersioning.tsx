'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  User,
  Download,
  Eye,
  GitBranch,
  FileText,
  Edit3,
  MessageCircle,
  Check,
  X,
  MoreVertical,
  History,
  GitCompare,
  RotateCcw
} from 'lucide-react';

interface DocumentVersion {
  id: string;
  version: string;
  title: string;
  author: string;
  authorEmail: string;
  timestamp: string;
  status: 'draft' | 'reviewed' | 'approved' | 'rejected';
  changes: string[];
  comments: number;
  fileSize: string;
  isActive: boolean;
}

interface DocumentVersioningProps {
  documentId: string;
  documentTitle: string;
}

const mockVersions: DocumentVersion[] = [
  {
    id: '1',
    version: 'v1.3',
    title: 'Property Sale Agreement - Final Draft',
    author: 'John Doe',
    authorEmail: 'john.doe@example.com',
    timestamp: '2025-01-13T14:30:00Z',
    status: 'approved',
    changes: ['Updated property valuation', 'Added new clauses for payments', 'Revised timeline'],
    comments: 2,
    fileSize: '156 KB',
    isActive: true
  },
  {
    id: '2',
    version: 'v1.2',
    title: 'Property Sale Agreement - Second Review',
    author: 'Advocate Priya Sharma',
    authorEmail: 'priya.sharma@example.com',
    timestamp: '2025-01-12T16:45:00Z',
    status: 'reviewed',
    changes: ['Legal compliance review', 'Updated terms and conditions', 'Added lawyer signature section'],
    comments: 5,
    fileSize: '142 KB',
    isActive: false
  },
  {
    id: '3',
    version: 'v1.1',
    title: 'Property Sale Agreement - First Draft',
    author: 'John Doe',
    authorEmail: 'john.doe@example.com',
    timestamp: '2025-01-10T10:15:00Z',
    status: 'draft',
    changes: ['Initial document creation', 'Basic template setup', 'Added party details'],
    comments: 1,
    fileSize: '98 KB',
    isActive: false
  }
];

export default function DocumentVersioning({ documentTitle }: Omit<DocumentVersioningProps, 'documentId'>) {
  const [versions] = useState<DocumentVersion[]>(mockVersions);
  const [selectedVersion, setSelectedVersion] = useState<string>('1');
  const [showComparison, setShowComparison] = useState(false);
  const [compareVersions, setCompareVersions] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);

  const getStatusColor = (status: DocumentVersion['status']) => {
    switch (status) {
      case 'approved': return 'text-green-700 bg-green-100 border-green-200';
      case 'reviewed': return 'text-blue-700 bg-blue-100 border-blue-200';
      case 'draft': return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'rejected': return 'text-red-700 bg-red-100 border-red-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getStatusIcon = (status: DocumentVersion['status']) => {
    switch (status) {
      case 'approved': return <Check className="w-4 h-4" />;
      case 'reviewed': return <Eye className="w-4 h-4" />;
      case 'draft': return <Edit3 className="w-4 h-4" />;
      case 'rejected': return <X className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCompareToggle = (versionId: string) => {
    if (compareVersions.includes(versionId)) {
      setCompareVersions(compareVersions.filter(id => id !== versionId));
    } else if (compareVersions.length < 2) {
      setCompareVersions([...compareVersions, versionId]);
    }
  };

  const handleRestore = (versionId: string) => {
    // In real implementation, this would call an API
    console.log('Restoring version:', versionId);
    setShowDropdown(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <History className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Document Versions</h2>
              <p className="text-gray-500">{documentTitle}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {compareVersions.length === 2 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => setShowComparison(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <GitCompare className="w-4 h-4" />
                <span>Compare Versions</span>
              </motion.button>
            )}
            
            {compareVersions.length > 0 && (
              <button
                onClick={() => setCompareVersions([])}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                Clear Selection
              </button>
            )}
          </div>
        </div>
        
        {compareVersions.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              {compareVersions.length === 1 
                ? 'Select one more version to compare' 
                : `Selected versions: ${compareVersions.map(id => versions.find(v => v.id === id)?.version).join(' and ')}`
              }
            </p>
          </div>
        )}
      </div>

      {/* Version List */}
      <div className="p-6">
        <div className="space-y-4">
          {versions.map((version, index) => (
            <motion.div
              key={version.id}
              className={`border rounded-lg p-4 transition-all duration-200 ${
                selectedVersion === version.id
                  ? 'border-blue-300 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              } ${
                compareVersions.includes(version.id)
                  ? 'ring-2 ring-blue-200'
                  : ''
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Version Timeline */}
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      version.isActive 
                        ? 'bg-green-100 text-green-600 border-2 border-green-300'
                        : 'bg-gray-100 text-gray-600 border-2 border-gray-300'
                    }`}>
                      <GitBranch className="w-5 h-5" />
                    </div>
                    {index < versions.length - 1 && (
                      <div className="w-0.5 h-6 bg-gray-300 mt-2"></div>
                    )}
                  </div>

                  {/* Version Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{version.version}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(version.status)}`}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(version.status)}
                          <span>{version.status}</span>
                        </div>
                      </span>
                      {version.isActive && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                          Current
                        </span>
                      )}
                    </div>

                    <p className="text-gray-900 font-medium mb-2">{version.title}</p>

                    <div className="flex items-center space-x-6 text-sm text-gray-500 mb-3">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{version.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatTimestamp(version.timestamp)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FileText className="w-4 h-4" />
                        <span>{version.fileSize}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{version.comments} comments</span>
                      </div>
                    </div>

                    {/* Changes Summary */}
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Changes:</h4>
                      <ul className="space-y-1">
                        {version.changes.map((change, changeIndex) => (
                          <li key={changeIndex} className="text-sm text-gray-600 flex items-start space-x-2">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                            <span>{change}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={compareVersions.includes(version.id)}
                    onChange={() => handleCompareToggle(version.id)}
                    disabled={!compareVersions.includes(version.id) && compareVersions.length >= 2}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    title="Select for comparison"
                  />

                  <button
                    onClick={() => setSelectedVersion(version.id)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="View version"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                    <Download className="w-4 h-4" />
                  </button>

                  <div className="relative">
                    <button
                      onClick={() => setShowDropdown(showDropdown === version.id ? null : version.id)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    <AnimatePresence>
                      {showDropdown === version.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
                        >
                          <div className="py-2">
                            <button
                              onClick={() => handleRestore(version.id)}
                              className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              disabled={version.isActive}
                            >
                              <RotateCcw className="w-4 h-4" />
                              <span>Restore this version</span>
                            </button>
                            <button className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                              <MessageCircle className="w-4 h-4" />
                              <span>Add comment</span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Comparison Modal */}
      <AnimatePresence>
        {showComparison && compareVersions.length === 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowComparison(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Compare Versions</h3>
                  <button
                    onClick={() => setShowComparison(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="mt-2 text-gray-600">
                  Comparing {compareVersions.map(id => versions.find(v => v.id === id)?.version).join(' vs ')}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
                {compareVersions.map((versionId) => {
                  const version = versions.find(v => v.id === versionId);
                  if (!version) return null;

                  return (
                    <div key={versionId} className="space-y-4">
                      <div className="border rounded-lg p-4">
                        <h4 className="font-semibold text-lg mb-2">{version.version}</h4>
                        <p className="text-gray-600 mb-3">{version.title}</p>
                        
                        <div className="space-y-2 text-sm">
                          <div><strong>Author:</strong> {version.author}</div>
                          <div><strong>Date:</strong> {formatTimestamp(version.timestamp)}</div>
                          <div><strong>Status:</strong> {version.status}</div>
                          <div><strong>Size:</strong> {version.fileSize}</div>
                        </div>

                        <div className="mt-4">
                          <h5 className="font-medium mb-2">Changes:</h5>
                          <ul className="space-y-1">
                            {version.changes.map((change, idx) => (
                              <li key={idx} className="text-sm text-gray-600 flex items-start space-x-2">
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                                <span>{change}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowComparison(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Export Comparison
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
