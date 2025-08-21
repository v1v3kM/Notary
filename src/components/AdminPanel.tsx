'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  FileText,
  DollarSign,
  TrendingUp,
  CheckCircle,
  Clock,
  Search,
  MoreVertical,
  UserPlus,
  Download,
  Upload,
  RefreshCw,
  Settings,
  Shield,
  Eye,
  Edit,
  Trash2,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  Award,
  User,
  Database,
  Server,
  Wifi,
  Cpu,
  HardDrive,
  Bell,
  Scale
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'lawyer' | 'notary' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  joinDate: Date;
  lastActive: Date;
  documentsCount: number;
  consultationsCount: number;
  verified: boolean;
}

interface Document {
  id: string;
  title: string;
  type: string;
  status: 'pending' | 'approved' | 'rejected' | 'processing';
  uploadedBy: string;
  uploadDate: Date;
  size: string;
  category: string;
}

interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  totalDocuments: number;
  pendingDocuments: number;
  totalRevenue: number;
  monthlyRevenue: number;
  systemUptime: string;
  storageUsed: string;
  storageTotal: string;
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Arjun Malhotra',
    email: 'arjun.malhotra@email.com',
    role: 'client',
    status: 'active',
    joinDate: new Date('2023-01-15'),
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
    documentsCount: 12,
    consultationsCount: 5,
    verified: true
  },
  {
    id: '2',
    name: 'Advocate Priya Sharma',
    email: 'priya.sharma@law.com',
    role: 'lawyer',
    status: 'active',
    joinDate: new Date('2022-08-20'),
    lastActive: new Date(Date.now() - 30 * 60 * 1000),
    documentsCount: 156,
    consultationsCount: 89,
    verified: true
  },
  {
    id: '3',
    name: 'Notary Rajesh Kumar',
    email: 'rajesh.kumar@notary.com',
    role: 'notary',
    status: 'active',
    joinDate: new Date('2023-03-10'),
    lastActive: new Date(Date.now() - 6 * 60 * 60 * 1000),
    documentsCount: 78,
    consultationsCount: 45,
    verified: true
  }
];

const mockDocuments: Document[] = [
  {
    id: '1',
    title: 'Property Sale Agreement',
    type: 'Contract',
    status: 'pending',
    uploadedBy: 'Arjun Malhotra',
    uploadDate: new Date(Date.now() - 2 * 60 * 60 * 1000),
    size: '2.4 MB',
    category: 'Real Estate'
  },
  {
    id: '2',
    title: 'Business Partnership Deed',
    type: 'Agreement',
    status: 'approved',
    uploadedBy: 'Meera Patel',
    uploadDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
    size: '1.8 MB',
    category: 'Business'
  },
  {
    id: '3',
    title: 'Will and Testament',
    type: 'Legal Document',
    status: 'processing',
    uploadedBy: 'Suresh Gupta',
    uploadDate: new Date(Date.now() - 4 * 60 * 60 * 1000),
    size: '3.2 MB',
    category: 'Estate Planning'
  }
];

const mockStats: SystemStats = {
  totalUsers: 2847,
  activeUsers: 1234,
  totalDocuments: 15672,
  pendingDocuments: 89,
  totalRevenue: 12456789,
  monthlyRevenue: 895432,
  systemUptime: '99.9%',
  storageUsed: '245 GB',
  storageTotal: '1 TB'
};

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users] = useState<User[]>(mockUsers);
  const [documents] = useState<Document[]>(mockDocuments);
  const [stats] = useState<SystemStats>(mockStats);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'system', label: 'System', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'approved':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pending':
      case 'processing':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'inactive':
      case 'suspended':
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'lawyer': return <Scale className="w-4 h-4" />;
      case 'notary': return <Award className="w-4 h-4" />;
      case 'admin': return <Shield className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const DashboardView = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
              <p className="text-sm text-green-600 flex items-center mt-2">
                <TrendingUp className="w-4 h-4 mr-1" />
                +12% from last month
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Documents</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalDocuments.toLocaleString()}</p>
              <p className="text-sm text-yellow-600 flex items-center mt-2">
                <Clock className="w-4 h-4 mr-1" />
                {stats.pendingDocuments} pending
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Monthly Revenue</p>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.monthlyRevenue)}</p>
              <p className="text-sm text-green-600 flex items-center mt-2">
                <TrendingUp className="w-4 h-4 mr-1" />
                +18% from last month
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">System Uptime</p>
              <p className="text-3xl font-bold text-gray-900">{stats.systemUptime}</p>
              <p className="text-sm text-green-600 flex items-center mt-2">
                <Activity className="w-4 h-4 mr-1" />
                All systems operational
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Server className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">User Growth</h3>
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option>Last 30 days</option>
              <option>Last 3 months</option>
              <option>Last year</option>
            </select>
          </div>
          <div className="h-64 flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
            <div className="text-center">
              <LineChart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">User growth chart placeholder</p>
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Document Types</h3>
            <button className="text-blue-600 hover:text-blue-800 text-sm">View All</button>
          </div>
          <div className="h-64 flex items-center justify-center bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
            <div className="text-center">
              <PieChart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Document distribution chart placeholder</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Recent Activity</h3>
          <button className="text-blue-600 hover:text-blue-800 text-sm">View All</button>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Document uploaded by User #{item}</p>
                <p className="text-sm text-gray-600">{item} minutes ago</p>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const UsersView = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600">Manage all platform users</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <UserPlus className="w-4 h-4" />
            <span>Add User</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select className="px-3 py-3 border border-gray-300 rounded-lg">
          <option>All Roles</option>
          <option>Clients</option>
          <option>Lawyers</option>
          <option>Notaries</option>
          <option>Admins</option>
        </select>
        <select className="px-3 py-3 border border-gray-300 rounded-lg">
          <option>All Status</option>
          <option>Active</option>
          <option>Inactive</option>
          <option>Suspended</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Documents</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Active</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      className="rounded"
                      checked={selectedUsers.includes(user.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers([...selectedUsers, user.id]);
                        } else {
                          setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                        }
                      }}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-gray-900">{user.name}</p>
                          {user.verified && <CheckCircle className="w-4 h-4 text-blue-600" />}
                        </div>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {getRoleIcon(user.role)}
                      <span className="capitalize">{user.role}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{user.documentsCount}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {user.lastActive.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="w-4 h-4" />
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

  const DocumentsView = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Document Management</h2>
          <p className="text-gray-600">Monitor and manage all platform documents</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Upload className="w-4 h-4" />
            <span>Upload</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Documents</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalDocuments.toLocaleString()}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendingDocuments}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved Today</p>
              <p className="text-2xl font-bold text-green-600">45</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Storage Used</p>
              <p className="text-2xl font-bold text-purple-600">{stats.storageUsed}</p>
            </div>
            <HardDrive className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search documents..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <select className="px-3 py-2 border border-gray-300 rounded-lg">
              <option>All Types</option>
              <option>Contracts</option>
              <option>Agreements</option>
              <option>Legal Documents</option>
            </select>
            <select className="px-3 py-2 border border-gray-300 rounded-lg">
              <option>All Status</option>
              <option>Pending</option>
              <option>Approved</option>
              <option>Rejected</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Document</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Uploaded By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {documents.map((document) => (
                <tr key={document.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{document.title}</p>
                        <p className="text-sm text-gray-500">{document.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{document.type}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(document.status)}`}>
                      {document.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{document.uploadedBy}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{document.size}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="w-4 h-4" />
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

  const SystemView = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">System Management</h2>
        <p className="text-gray-600">Monitor system health and performance</p>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">CPU Usage</p>
              <p className="text-2xl font-bold text-gray-900">45%</p>
            </div>
            <Cpu className="w-8 h-8 text-blue-600" />
          </div>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Memory Usage</p>
              <p className="text-2xl font-bold text-gray-900">68%</p>
            </div>
            <Database className="w-8 h-8 text-green-600" />
          </div>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-600 h-2 rounded-full" style={{ width: '68%' }}></div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Storage</p>
              <p className="text-2xl font-bold text-gray-900">24%</p>
            </div>
            <HardDrive className="w-8 h-8 text-purple-600" />
          </div>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div className="bg-purple-600 h-2 rounded-full" style={{ width: '24%' }}></div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Network</p>
              <p className="text-2xl font-bold text-gray-900">Active</p>
            </div>
            <Wifi className="w-8 h-8 text-emerald-600" />
          </div>
          <div className="mt-4 text-sm text-emerald-600">All services online</div>
        </div>
      </div>

      {/* System Logs */}
      <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">System Logs</h3>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {[1, 2, 3, 4, 5].map((log) => (
            <div key={log} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">System backup completed successfully</p>
                <p className="text-xs text-gray-500">2024-01-15 {log + 10}:30:00 UTC</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
              <p className="text-gray-600">Complete platform management and analytics</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-600 hover:text-gray-900 relative">
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-2 mb-8">
          <div className="flex space-x-2 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'dashboard' && <DashboardView />}
            {activeTab === 'users' && <UsersView />}
            {activeTab === 'documents' && <DocumentsView />}
            {activeTab === 'system' && <SystemView />}
            {activeTab === 'analytics' && (
              <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-12 text-center">
                <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Dashboard</h3>
                <p className="text-gray-600">Detailed analytics and reporting coming soon.</p>
              </div>
            )}
            {activeTab === 'security' && (
              <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-12 text-center">
                <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Security Center</h3>
                <p className="text-gray-600">Security monitoring and management tools.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
