'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { formatDateTime, formatDate } from '../utils/dateUtils';
import {
  FileText,
  Download,
  CreditCard,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Users,
  Calendar,
  Settings,
  Bell,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Share,
  Star
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { generateRentAgreement, generateAffidavit } from '@/lib/pdfGenerator';
import { documentTemplateService } from '@/lib/documentTemplates';
import { fileStorageService } from '@/lib/fileStorage';

interface DashboardStats {
  totalDocuments: number;
  pendingApprovals: number;
  totalRevenue: number;
  activeUsers: number;
}

interface Document {
  id: string;
  title: string;
  type: 'rent' | 'affidavit' | 'partnership' | 'other';
  status: 'draft' | 'completed' | 'pending' | 'approved';
  createdAt: string;
  updatedAt: string;
  fileUrl?: string;
  amount?: number;
  clientName?: string;
}

interface RecentActivity {
  id: string;
  type: 'document_created' | 'payment_received' | 'document_approved' | 'user_registered';
  title: string;
  description: string;
  timestamp: string;
  status: 'success' | 'pending' | 'error';
}

const mockDocuments: Document[] = [
  {
    id: '1',
    title: 'Property Rental Agreement',
    type: 'rent',
    status: 'completed',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T11:45:00Z',
    amount: 850,
    clientName: 'John Doe'
  },
  {
    id: '2',
    title: 'Identity Affidavit',
    type: 'affidavit',
    status: 'pending',
    createdAt: '2024-01-14T14:20:00Z',
    updatedAt: '2024-01-14T14:20:00Z',
    amount: 300,
    clientName: 'Jane Smith'
  },
  {
    id: '3',
    title: 'Business Partnership Deed',
    type: 'partnership',
    status: 'draft',
    createdAt: '2024-01-13T09:15:00Z',
    updatedAt: '2024-01-13T16:30:00Z',
    amount: 1200,
    clientName: 'ABC Corp'
  }
];

const mockActivities: RecentActivity[] = [
  {
    id: '1',
    type: 'document_created',
    title: 'New Document Created',
    description: 'Property Rental Agreement created by John Doe',
    timestamp: '2024-01-15T10:30:00Z',
    status: 'success'
  },
  {
    id: '2',
    type: 'payment_received',
    title: 'Payment Received',
    description: '₹850 received for document notarization',
    timestamp: '2024-01-15T11:45:00Z',
    status: 'success'
  },
  {
    id: '3',
    type: 'document_approved',
    title: 'Document Approved',
    description: 'Identity Affidavit approved by notary',
    timestamp: '2024-01-14T16:20:00Z',
    status: 'success'
  }
];

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalDocuments: 0,
    pendingApprovals: 0,
    totalRevenue: 0,
    activeUsers: 0
  });
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [activities] = useState<RecentActivity[]>(mockActivities);
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'analytics'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    // Load dashboard data
    const loadData = async () => {
      try {
        // Calculate stats from documents
        const totalDocs = documents.length;
        const pending = documents.filter(doc => doc.status === 'pending').length;
        const revenue = documents.reduce((sum, doc) => sum + (doc.amount || 0), 0);
        
        setStats({
          totalDocuments: totalDocs,
          pendingApprovals: pending,
          totalRevenue: revenue,
          activeUsers: 156 // Mock data
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };
    
    loadData();
  }, [documents]);

  const handleCreateDocument = async (type: 'rent' | 'affidavit' | 'partnership') => {
    setIsCreating(true);
    try {
      const template = documentTemplateService.getTemplateByType(type);
      if (!template) {
        alert('Template not found');
        return;
      }

      // Mock data for demonstration
      let pdfBlob: Blob | null = null;
      
      if (type === 'rent') {
        const rentData = {
          propertyAddress: '123 Main Street, City, State 12345',
          monthlyRent: 25000,
          securityDeposit: 50000,
          leaseDuration: 12,
          startDate: '2024-02-01',
          landlord: 'John Landlord',
          tenant: 'Jane Tenant'
        };
        pdfBlob = await generateRentAgreement(rentData);
      } else if (type === 'affidavit') {
        const affidavitData = {
          deponentName: 'John Doe',
          fatherName: 'Robert Doe',
          age: 30,
          address: '456 Oak Avenue, City, State 67890',
          statement: 'I hereby declare that all the information provided is true and correct to the best of my knowledge.',
          place: 'Mumbai'
        };
        pdfBlob = await generateAffidavit(affidavitData);
      }

      if (pdfBlob) {
        // Upload to storage - Convert Blob to File
        const filename = `${type}_${Date.now()}.pdf`;
        const file = new File([pdfBlob], filename, { type: 'application/pdf' });
        const uploadResult = await fileStorageService.uploadFile(file, { 
          fileName: filename,
          bucket: 'documents' 
        });
        
        if (uploadResult.data) {
          // Create document record
          const newDocument: Document = {
            id: Date.now().toString(),
            title: template.name,
            type,
            status: 'draft',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            fileUrl: uploadResult.data.path,
            amount: type === 'rent' ? 850 : type === 'affidavit' ? 300 : 1200,
            clientName: user?.user_metadata?.full_name || 'Current User'
          };

          setDocuments(prev => [newDocument, ...prev]);

          // Send notification email
          if (user?.email) {
            await fetch('/api/send-notification', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                type: 'document_ready',
                clientEmail: user.email,
                clientName: user.user_metadata?.full_name || 'User',
                documentType: type
              })
            });
          }

          alert('Document created successfully!');
        } else {
          alert(`Error uploading document: ${uploadResult.error}`);
        }
      } else {
        alert('Error generating PDF');
      }
    } catch (error) {
      console.error('Error creating document:', error);
      alert('Error creating document');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDownloadDocument = async (doc: Document) => {
    if (!doc.fileUrl) {
      alert('No file available for download');
      return;
    }

    try {
      const downloadResult = await fileStorageService.getFileUrl('documents', doc.fileUrl, 60);
      if (downloadResult.url) {
        const link = window.document.createElement('a');
        link.href = downloadResult.url;
        link.download = `${doc.title}.pdf`;
        window.document.body.appendChild(link);
        link.click();
        window.document.body.removeChild(link);
      } else {
        alert(`Error downloading document: ${downloadResult.error}`);
      }
    } catch (error) {
      console.error('Error downloading document:', error);
      alert('Error downloading document');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'approved': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'draft': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.clientName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || doc.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: 'Total Documents',
            value: stats.totalDocuments.toString(),
            icon: FileText,
            color: 'blue',
            change: '+12%'
          },
          {
            title: 'Pending Approvals',
            value: stats.pendingApprovals.toString(),
            icon: Clock,
            color: 'yellow',
            change: '+5%'
          },
          {
            title: 'Total Revenue',
            value: `₹${stats.totalRevenue.toLocaleString()}`,
            icon: CreditCard,
            color: 'green',
            change: '+18%'
          },
          {
            title: 'Active Users',
            value: stats.activeUsers.toString(),
            icon: Users,
            color: 'purple',
            change: '+7%'
          }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className="text-sm text-green-600 mt-1">{stat.change} from last month</p>
              </div>
              <div className={`w-12 h-12 bg-${stat.color}-100 rounded-xl flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { type: 'rent', title: 'Create Rental Agreement', description: 'Generate property rental documents' },
            { type: 'affidavit', title: 'Create Affidavit', description: 'Generate legal affidavit documents' },
            { type: 'partnership', title: 'Create Partnership Deed', description: 'Generate business partnership documents' }
          ].map((action) => (
            <button
              key={action.type}
              onClick={() => handleCreateDocument(action.type as 'rent' | 'affidavit' | 'partnership')}
              disabled={isCreating}
              className="text-left p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Plus className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{action.title}</h4>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                activity.status === 'success' ? 'bg-green-100' :
                activity.status === 'pending' ? 'bg-yellow-100' : 'bg-red-100'
              }`}>
                {activity.status === 'success' && <CheckCircle className="w-4 h-4 text-green-600" />}
                {activity.status === 'pending' && <Clock className="w-4 h-4 text-yellow-600" />}
                {activity.status === 'error' && <AlertCircle className="w-4 h-4 text-red-600" />}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{activity.title}</h4>
                <p className="text-sm text-gray-600">{activity.description}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDateTime(activity.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="relative">
          <Filter className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="approved">Approved</option>
          </select>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Document</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Client</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Amount</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Created</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDocuments.map((document) => (
                <tr key={document.id} className="hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{document.title}</h4>
                        <p className="text-sm text-gray-600">ID: {document.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900">{document.clientName}</td>
                  <td className="py-4 px-4">
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700 capitalize">
                      {document.type}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(document.status)} capitalize`}>
                      {document.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm font-medium text-gray-900">
                    {document.amount ? `₹${document.amount}` : '-'}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">
                    {formatDate(document.createdAt)}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDownloadDocument(document)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1 text-gray-400 hover:text-yellow-600 transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                        title="Share"
                      >
                        <Share className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Document Types Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Types Distribution</h3>
          <div className="space-y-4">
            {[
              { type: 'Rental Agreements', count: 45, percentage: 60, color: 'blue' },
              { type: 'Affidavits', count: 22, percentage: 30, color: 'green' },
              { type: 'Partnership Deeds', count: 8, percentage: 10, color: 'purple' }
            ].map((item) => (
              <div key={item.type} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 bg-${item.color}-500 rounded`}></div>
                  <span className="text-sm text-gray-900">{item.type}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className={`bg-${item.color}-500 h-2 rounded-full`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Trend */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue</h3>
          <div className="space-y-4">
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month) => {
              const amount = Math.floor(Math.random() * 50000) + 10000;
              const percentage = (amount / 60000) * 100;
              
              return (
                <div key={month} className="flex items-center space-x-4">
                  <div className="w-8 text-sm text-gray-600">{month}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="w-20 text-sm font-medium text-gray-900 text-right">
                    ₹{amount.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Avg. Processing Time', value: '2.5 hours', icon: Clock, trend: '+15%' },
          { title: 'Client Satisfaction', value: '4.8/5', icon: Star, trend: '+5%' },
          { title: 'Success Rate', value: '98.5%', icon: CheckCircle, trend: '+2%' }
        ].map((metric, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{metric.title}</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{metric.value}</p>
                <p className="text-sm text-green-600 mt-1">{metric.trend}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <metric.icon className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-2">Welcome back, {user?.user_metadata?.full_name || user?.email}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={signOut}
                className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-8 max-w-md">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'documents', label: 'Documents', icon: FileText },
            { id: 'analytics', label: 'Analytics', icon: Calendar }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'overview' | 'documents' | 'analytics')}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'documents' && renderDocuments()}
          {activeTab === 'analytics' && renderAnalytics()}
        </motion.div>
      </div>
    </div>
  );
}
