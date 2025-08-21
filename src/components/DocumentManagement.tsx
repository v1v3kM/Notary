'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Download,
  Upload,
  FolderOpen,
  Share2,
  Lock,
  Unlock,
  Eye,
  Star,
  Clock,
  User,
  Search,
  Filter,
  Grid,
  List,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Archive,
  CheckCircle,
  FileX,
  FilePlus,
  Folder,
  Image as ImageIcon,
  BookOpen,
  Building,
  Home,
  Briefcase
} from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'image' | 'other';
  category: string;
  size: string;
  lastModified: Date;
  created: Date;
  owner: string;
  status: 'draft' | 'review' | 'approved' | 'signed' | 'archived';
  isPrivate: boolean;
  isStarred: boolean;
  tags: string[];
  version: number;
  collaborators: string[];
  thumbnail?: string;
  description?: string;
}

interface Folder {
  id: string;
  name: string;
  documentCount: number;
  lastModified: Date;
  isPrivate: boolean;
  color: string;
  description?: string;
}

interface DocumentCategory {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string; size?: number | string }>;
  color: string;
  count: number;
}

const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Property Sale Agreement - Mumbai.pdf',
    type: 'pdf',
    category: 'Property',
    size: '2.3 MB',
    lastModified: new Date(Date.now() - 2 * 60 * 60 * 1000),
    created: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    owner: 'Rajesh Kumar',
    status: 'signed',
    isPrivate: false,
    isStarred: true,
    tags: ['property', 'sale', 'mumbai'],
    version: 3,
    collaborators: ['Advocate Priya Sharma', 'Notary Suresh Gupta'],
    description: 'Final agreement for property sale in Bandra, Mumbai'
  },
  {
    id: '2',
    name: 'Employment Contract - TechCorp.docx',
    type: 'docx',
    category: 'Employment',
    size: '856 KB',
    lastModified: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    created: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    owner: 'Neha Singh',
    status: 'review',
    isPrivate: true,
    isStarred: false,
    tags: ['employment', 'contract', 'tech'],
    version: 2,
    collaborators: ['Advocate Rajesh Kumar'],
    description: 'Employment contract for senior developer position'
  },
  {
    id: '3',
    name: 'Partnership Deed Amendment.pdf',
    type: 'pdf',
    category: 'Business',
    size: '1.2 MB',
    lastModified: new Date(Date.now() - 6 * 60 * 60 * 1000),
    created: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    owner: 'Vikram Agarwal',
    status: 'draft',
    isPrivate: false,
    isStarred: false,
    tags: ['partnership', 'business', 'amendment'],
    version: 1,
    collaborators: ['Advocate Meera Patel'],
    description: 'Amendment to existing partnership agreement'
  },
  {
    id: '4',
    name: 'Rental Agreement - Bangalore.pdf',
    type: 'pdf',
    category: 'Property',
    size: '1.8 MB',
    lastModified: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    created: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    owner: 'Arjun Reddy',
    status: 'approved',
    isPrivate: false,
    isStarred: true,
    tags: ['rental', 'property', 'bangalore'],
    version: 2,
    collaborators: ['Advocate Lakshmi Nair'],
    description: '11-month rental agreement for 3BHK apartment'
  }
];

const mockFolders: Folder[] = [
  {
    id: '1',
    name: 'Property Documents',
    documentCount: 15,
    lastModified: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isPrivate: false,
    color: 'blue',
    description: 'All property-related legal documents'
  },
  {
    id: '2',
    name: 'Business Contracts',
    documentCount: 8,
    lastModified: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    isPrivate: true,
    color: 'purple',
    description: 'Business agreements and contracts'
  },
  {
    id: '3',
    name: 'Personal Documents',
    documentCount: 12,
    lastModified: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    isPrivate: true,
    color: 'green',
    description: 'Personal legal documents and certificates'
  }
];

const documentCategories: DocumentCategory[] = [
  { id: 'all', name: 'All Documents', icon: FileText, color: 'gray', count: 24 },
  { id: 'property', name: 'Property', icon: Home, color: 'blue', count: 8 },
  { id: 'business', name: 'Business', icon: Briefcase, color: 'purple', count: 6 },
  { id: 'employment', name: 'Employment', icon: Building, color: 'green', count: 4 },
  { id: 'personal', name: 'Personal', icon: User, color: 'orange', count: 6 }
];

export default function DocumentManagement() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('lastModified');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateMenu, setShowCreateMenu] = useState(false);

  const filteredDocuments = mockDocuments.filter(doc => {
    if (selectedCategory !== 'all' && doc.category.toLowerCase() !== selectedCategory) return false;
    if (statusFilter !== 'all' && doc.status !== statusFilter) return false;
    if (searchQuery && !doc.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) return false;
    return true;
  });

  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'size':
        return parseFloat(a.size) - parseFloat(b.size);
      case 'created':
        return b.created.getTime() - a.created.getTime();
      default:
        return b.lastModified.getTime() - a.lastModified.getTime();
    }
  });

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return FileText;
      case 'docx':
        return BookOpen;
      case 'image':
        return ImageIcon;
      default:
        return FileText;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'signed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'approved':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'review':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'draft':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'archived':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'signed':
        return CheckCircle;
      case 'approved':
        return CheckCircle;
      case 'review':
        return Clock;
      case 'draft':
        return Edit;
      case 'archived':
        return Archive;
      default:
        return FileText;
    }
  };

  const toggleDocumentSelection = (docId: string) => {
    setSelectedDocuments(prev => 
      prev.includes(docId) 
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  };

  const toggleStarDocument = (docId: string) => {
    // Implementation would update the document's starred status
    console.log('Toggle star for document:', docId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Document Management</h1>
              <p className="text-gray-600">Organize, manage, and collaborate on your legal documents</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  showFilters ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowCreateMenu(!showCreateMenu)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create</span>
                </button>
                
                <AnimatePresence>
                  {showCreateMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10"
                    >
                      <div className="p-2">
                        <button className="w-full flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                          <FilePlus className="w-4 h-4" />
                          <span>New Document</span>
                        </button>
                        <button className="w-full flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                          <Folder className="w-4 h-4" />
                          <span>New Folder</span>
                        </button>
                        <button className="w-full flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                          <Upload className="w-4 h-4" />
                          <span>Upload Files</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search documents, tags, or content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="lastModified">Last Modified</option>
                <option value="name">Name</option>
                <option value="created">Created Date</option>
                <option value="size">Size</option>
              </select>
              
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 pt-4 border-t border-gray-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Status</option>
                      <option value="draft">Draft</option>
                      <option value="review">In Review</option>
                      <option value="approved">Approved</option>
                      <option value="signed">Signed</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Document Type</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option value="all">All Types</option>
                      <option value="pdf">PDF</option>
                      <option value="docx">Word Document</option>
                      <option value="image">Image</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Privacy</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option value="all">All Documents</option>
                      <option value="private">Private Only</option>
                      <option value="shared">Shared Only</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Categories */}
            <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                {documentCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <category.icon className="w-4 h-4" />
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <span className={`text-sm ${
                      selectedCategory === category.id ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Folders */}
            <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Folders</h3>
              <div className="space-y-3">
                {mockFolders.map((folder) => (
                  <div key={folder.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 bg-${folder.color}-100 rounded-lg flex items-center justify-center`}>
                        <FolderOpen className={`w-4 h-4 text-${folder.color}-600`} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{folder.name}</p>
                        <p className="text-xs text-gray-500">{folder.documentCount} documents</p>
                      </div>
                    </div>
                    {folder.isPrivate && <Lock className="w-3 h-3 text-gray-400" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Documents</span>
                  <span className="font-semibold text-gray-900">24</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Pending Review</span>
                  <span className="font-semibold text-yellow-600">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Signed Today</span>
                  <span className="font-semibold text-green-600">2</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Storage Used</span>
                  <span className="font-semibold text-blue-600">2.1 GB</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Selected Actions Bar */}
            {selectedDocuments.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-50 border border-blue-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-blue-700 font-medium">
                    {selectedDocuments.length} document(s) selected
                  </span>
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-1 text-blue-700 hover:bg-blue-100 rounded-lg flex items-center space-x-1">
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                    <button className="px-3 py-1 text-blue-700 hover:bg-blue-100 rounded-lg flex items-center space-x-1">
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                    <button className="px-3 py-1 text-blue-700 hover:bg-blue-100 rounded-lg flex items-center space-x-1">
                      <Archive className="w-4 h-4" />
                      <span>Archive</span>
                    </button>
                    <button className="px-3 py-1 text-red-600 hover:bg-red-100 rounded-lg flex items-center space-x-1">
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Documents Grid/List */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedDocuments.map((document) => {
                  const FileIcon = getFileIcon(document.type);
                  const StatusIcon = getStatusIcon(document.status);
                  
                  return (
                    <motion.div
                      key={document.id}
                      className={`bg-white/70 backdrop-blur-sm border rounded-2xl p-6 cursor-pointer transition-all hover:shadow-lg ${
                        selectedDocuments.includes(document.id) 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-white/20 hover:border-blue-300'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => toggleDocumentSelection(document.id)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                          <FileIcon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleStarDocument(document.id);
                            }}
                            className={`p-1 rounded ${
                              document.isStarred ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
                            }`}
                          >
                            <Star className={`w-4 h-4 ${document.isStarred ? 'fill-current' : ''}`} />
                          </button>
                          {document.isPrivate ? (
                            <Lock className="w-4 h-4 text-gray-400" />
                          ) : (
                            <Unlock className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{document.name}</h3>
                      
                      <div className="flex items-center space-x-2 mb-3">
                        <span className={`flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(document.status)}`}>
                          <StatusIcon className="w-3 h-3" />
                          <span>{document.status}</span>
                        </span>
                        <span className="text-xs text-gray-500">v{document.version}</span>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-center justify-between">
                          <span>Size:</span>
                          <span>{document.size}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Modified:</span>
                          <span>{document.lastModified.toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Owner:</span>
                          <span className="truncate ml-2">{document.owner}</span>
                        </div>
                      </div>
                      
                      {document.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {document.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              {tag}
                            </span>
                          ))}
                          {document.tags.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              +{document.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </button>
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 text-gray-600 hover:text-gray-900"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Document
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Size
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Modified
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Owner
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {sortedDocuments.map((document) => {
                        const FileIcon = getFileIcon(document.type);
                        const StatusIcon = getStatusIcon(document.status);
                        
                        return (
                          <tr
                            key={document.id}
                            className={`hover:bg-gray-50 cursor-pointer ${
                              selectedDocuments.includes(document.id) ? 'bg-blue-50' : ''
                            }`}
                            onClick={() => toggleDocumentSelection(document.id)}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-3">
                                <input
                                  type="checkbox"
                                  checked={selectedDocuments.includes(document.id)}
                                  onChange={() => toggleDocumentSelection(document.id)}
                                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <FileIcon className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">{document.name}</div>
                                  <div className="text-sm text-gray-500">{document.category}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(document.status)}`}>
                                <StatusIcon className="w-3 h-3" />
                                <span>{document.status}</span>
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {document.size}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {document.lastModified.toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {document.owner}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-gray-600 hover:text-gray-900"
                                >
                                  <Download className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-gray-600 hover:text-gray-900"
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {sortedDocuments.length === 0 && (
              <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-12 text-center">
                <FileX className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search criteria or create a new document.</p>
                <button className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mx-auto">
                  <FilePlus className="w-4 h-4" />
                  <span>Create New Document</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
