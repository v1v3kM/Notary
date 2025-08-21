'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  Users,
  FileText,
  DollarSign,
  Calendar,
  Download,
  RefreshCw,
  Clock,
  Award,
  Activity,
  PieChart,
  LineChart,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  Globe,
  MapPin,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react';

interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  userGrowthRate: number;
  totalDocuments: number;
  documentsToday: number;
  documentGrowthRate: number;
  totalRevenue: number;
  revenueToday: number;
  revenueGrowthRate: number;
  totalConsultations: number;
  consultationsToday: number;
  consultationGrowthRate: number;
  averageRating: number;
  successRate: number;
  responseTime: string;
}

interface TimeSeriesData {
  date: string;
  users: number;
  documents: number;
  revenue: number;
  consultations: number;
}

interface GeographicData {
  state: string;
  users: number;
  documents: number;
  revenue: number;
}

interface DeviceData {
  device: string;
  users: number;
  percentage: number;
}

interface TopLawyer {
  id: string;
  name: string;
  specialization: string;
  rating: number;
  consultations: number;
  revenue: number;
  growthRate: number;
}

const mockAnalytics: AnalyticsData = {
  totalUsers: 15847,
  activeUsers: 3247,
  newUsersToday: 127,
  userGrowthRate: 12.5,
  totalDocuments: 42856,
  documentsToday: 284,
  documentGrowthRate: 18.7,
  totalRevenue: 12456789,
  revenueToday: 45670,
  revenueGrowthRate: 22.3,
  totalConsultations: 8942,
  consultationsToday: 67,
  consultationGrowthRate: 15.8,
  averageRating: 4.8,
  successRate: 96.5,
  responseTime: '2.3 hours'
};

const mockTimeSeriesData: TimeSeriesData[] = [
  { date: '2024-01-01', users: 12450, documents: 35600, revenue: 8945000, consultations: 6800 },
  { date: '2024-01-02', users: 12678, documents: 36200, revenue: 9124000, consultations: 6950 },
  { date: '2024-01-03', users: 12934, documents: 36890, revenue: 9456000, consultations: 7120 },
  { date: '2024-01-04', users: 13205, documents: 37456, revenue: 9789000, consultations: 7340 },
  { date: '2024-01-05', users: 13467, documents: 38123, revenue: 10123000, consultations: 7580 },
  { date: '2024-01-06', users: 13789, documents: 38945, revenue: 10567000, consultations: 7820 },
  { date: '2024-01-07', users: 14123, documents: 39678, revenue: 11023000, consultations: 8090 },
  { date: '2024-01-08', users: 14456, documents: 40234, revenue: 11456000, consultations: 8350 },
  { date: '2024-01-09', users: 14789, documents: 40890, revenue: 11789000, consultations: 8620 },
  { date: '2024-01-10', users: 15123, documents: 41567, revenue: 12123000, consultations: 8890 },
  { date: '2024-01-11', users: 15456, documents: 42234, revenue: 12456000, consultations: 9160 },
  { date: '2024-01-12', users: 15847, documents: 42856, revenue: 12456789, consultations: 8942 }
];

const mockGeographicData: GeographicData[] = [
  { state: 'Maharashtra', users: 3456, documents: 8945, revenue: 2456789 },
  { state: 'Delhi', users: 2890, documents: 7234, revenue: 1987654 },
  { state: 'Karnataka', users: 2345, documents: 6123, revenue: 1654321 },
  { state: 'Tamil Nadu', users: 2123, documents: 5678, revenue: 1456789 },
  { state: 'Gujarat', users: 1890, documents: 4567, revenue: 1234567 },
  { state: 'Rajasthan', users: 1567, documents: 3890, revenue: 987654 },
  { state: 'West Bengal', users: 1345, documents: 3456, revenue: 876543 },
  { state: 'Uttar Pradesh', users: 1234, documents: 3123, revenue: 765432 }
];

const mockDeviceData: DeviceData[] = [
  { device: 'Desktop', users: 8456, percentage: 53.3 },
  { device: 'Mobile', users: 5234, percentage: 33.0 },
  { device: 'Tablet', users: 2157, percentage: 13.6 }
];

const mockTopLawyers: TopLawyer[] = [
  {
    id: '1',
    name: 'Advocate Priya Sharma',
    specialization: 'Property Law',
    rating: 4.9,
    consultations: 156,
    revenue: 456789,
    growthRate: 25.6
  },
  {
    id: '2',
    name: 'Advocate Rajesh Kumar',
    specialization: 'Corporate Law',
    rating: 4.8,
    consultations: 134,
    revenue: 389456,
    growthRate: 18.9
  },
  {
    id: '3',
    name: 'Advocate Meera Patel',
    specialization: 'Family Law',
    rating: 4.7,
    consultations: 98,
    revenue: 234567,
    growthRate: 22.1
  }
];

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('7d');
  const [activeTab, setActiveTab] = useState('overview');
  const [analytics] = useState<AnalyticsData>(mockAnalytics);

  const timeRangeOptions = [
    { value: '1d', label: 'Today' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: '1y', label: '1 Year' }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'revenue', label: 'Revenue', icon: DollarSign },
    { id: 'geography', label: 'Geography', icon: Globe },
    { id: 'performance', label: 'Performance', icon: Activity }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  changeType: 'positive' | 'negative';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

  const StatCard = ({ title, value, change, changeType, icon: Icon, color }: StatCardProps) => (
    <motion.div
      className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6"
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          <div className={`flex items-center mt-2 text-sm ${
            changeType === 'positive' ? 'text-green-600' : 'text-red-600'
          }`}>
            {changeType === 'positive' ? (
              <ArrowUpRight className="w-4 h-4 mr-1" />
            ) : (
              <ArrowDownRight className="w-4 h-4 mr-1" />
            )}
            <span>{change}% from last period</span>
          </div>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={formatNumber(analytics.totalUsers)}
          change={analytics.userGrowthRate}
          changeType="positive"
          icon={Users}
          color="bg-blue-600"
        />
        <StatCard
          title="Total Documents"
          value={formatNumber(analytics.totalDocuments)}
          change={analytics.documentGrowthRate}
          changeType="positive"
          icon={FileText}
          color="bg-green-600"
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(analytics.totalRevenue)}
          change={analytics.revenueGrowthRate}
          changeType="positive"
          icon={DollarSign}
          color="bg-purple-600"
        />
        <StatCard
          title="Consultations"
          value={formatNumber(analytics.totalConsultations)}
          change={analytics.consultationGrowthRate}
          changeType="positive"
          icon={Calendar}
          color="bg-orange-600"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Growth Trends</h3>
            <button className="text-blue-600 hover:text-blue-800 text-sm">View Details</button>
          </div>
          <div className="h-64 flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
            <div className="text-center">
              <LineChart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Growth trends chart placeholder</p>
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Revenue Distribution</h3>
            <button className="text-blue-600 hover:text-blue-800 text-sm">View Details</button>
          </div>
          <div className="h-64 flex items-center justify-center bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
            <div className="text-center">
              <PieChart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Revenue distribution chart placeholder</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.successRate}%</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">Platform-wide success rate for document processing</p>
        </div>

        <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Average Rating</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.averageRating}/5</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">User satisfaction rating across all services</p>
        </div>

        <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Response Time</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.responseTime}</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">Average response time for support requests</p>
        </div>
      </div>
    </div>
  );

  const GeographyTab = () => (
    <div className="space-y-6">
      <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-6">Geographic Distribution</h3>
        <div className="space-y-4">
          {mockGeographicData.map((location) => (
            <div key={location.state} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{location.state}</p>
                  <p className="text-sm text-gray-600">{location.users.toLocaleString()} users</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">{formatCurrency(location.revenue)}</p>
                <p className="text-sm text-gray-600">{location.documents.toLocaleString()} docs</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-6">Device Usage</h3>
        <div className="space-y-4">
          {mockDeviceData.map((device) => {
            const Icon = device.device === 'Desktop' ? Monitor : 
                        device.device === 'Mobile' ? Smartphone : Tablet;
            return (
              <div key={device.device} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Icon className="w-5 h-5 text-gray-600" />
                  <span className="font-medium">{device.device}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${device.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">
                    {device.percentage}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const PerformanceTab = () => (
    <div className="space-y-6">
      <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-6">Top Performing Lawyers</h3>
        <div className="space-y-4">
          {mockTopLawyers.map((lawyer, index) => (
            <div key={lawyer.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-bold">
                  #{index + 1}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{lawyer.name}</p>
                  <p className="text-sm text-gray-600">{lawyer.specialization}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Rating</p>
                    <p className="font-medium">{lawyer.rating}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Consultations</p>
                    <p className="font-medium">{lawyer.consultations}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Revenue</p>
                    <p className="font-medium">{formatCurrency(lawyer.revenue)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-green-600">Growth</p>
                    <p className="font-medium text-green-600">+{lawyer.growthRate}%</p>
                  </div>
                </div>
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
              <p className="text-gray-600">Comprehensive platform insights and performance metrics</p>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {timeRangeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Download className="w-4 h-4" />
                <span>Export</span>
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
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'geography' && <GeographyTab />}
            {activeTab === 'performance' && <PerformanceTab />}
            {(activeTab === 'users' || activeTab === 'documents' || activeTab === 'revenue') && (
              <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-12 text-center">
                <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Analytics
                </h3>
                <p className="text-gray-600">Detailed {activeTab} analytics and insights coming soon.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
