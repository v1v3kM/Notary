'use client';

import { motion } from 'framer-motion';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  FileText,
  User,
  Shield,
  Download
} from 'lucide-react';

export interface DocumentStatus {
  id: string;
  name: string;
  type: string;
  status: 'pending' | 'processing' | 'review' | 'completed' | 'rejected';
  submittedDate: string;
  completedDate?: string;
  steps: {
    name: string;
    status: 'completed' | 'current' | 'pending';
    date?: string;
  }[];
}

interface StatusTrackerProps {
  document: DocumentStatus;
}

export default function StatusTracker({ document }: StatusTrackerProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'processing':
        return 'text-blue-600 bg-blue-100';
      case 'review':
        return 'text-yellow-600 bg-yellow-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5" />;
      case 'processing':
        return <Clock className="w-5 h-5" />;
      case 'review':
        return <AlertCircle className="w-5 h-5" />;
      case 'rejected':
        return <XCircle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const getStepIcon = (stepName: string) => {
    if (stepName.toLowerCase().includes('upload')) {
      return <FileText className="w-5 h-5" />;
    } else if (stepName.toLowerCase().includes('verify') || stepName.toLowerCase().includes('review')) {
      return <User className="w-5 h-5" />;
    } else if (stepName.toLowerCase().includes('sign') || stepName.toLowerCase().includes('notarize')) {
      return <Shield className="w-5 h-5" />;
    } else if (stepName.toLowerCase().includes('download') || stepName.toLowerCase().includes('complete')) {
      return <Download className="w-5 h-5" />;
    }
    return <Clock className="w-5 h-5" />;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      {/* Document Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{document.name}</h3>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>Type: {document.type}</span>
            <span>Submitted: {document.submittedDate}</span>
            {document.completedDate && (
              <span>Completed: {document.completedDate}</span>
            )}
          </div>
        </div>
        
        <div className={`px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2 ${getStatusColor(document.status)}`}>
          {getStatusIcon(document.status)}
          <span className="capitalize">{document.status}</span>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900 mb-4">Processing Steps / प्रक्रिया चरण</h4>
        
        {document.steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center space-x-4"
          >
            {/* Step Icon */}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
              step.status === 'completed'
                ? 'bg-green-100 border-green-500 text-green-600'
                : step.status === 'current'
                ? 'bg-blue-100 border-blue-500 text-blue-600'
                : 'bg-gray-100 border-gray-300 text-gray-400'
            }`}>
              {step.status === 'completed' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                getStepIcon(step.name)
              )}
            </div>

            {/* Step Content */}
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <h5 className={`font-medium ${
                  step.status === 'completed'
                    ? 'text-green-900'
                    : step.status === 'current'
                    ? 'text-blue-900'
                    : 'text-gray-500'
                }`}>
                  {step.name}
                </h5>
                {step.date && (
                  <span className="text-sm text-gray-500">{step.date}</span>
                )}
              </div>
              
              {step.status === 'current' && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      className="bg-blue-600 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: '60%' }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                  <p className="text-sm text-blue-600 mt-1">In progress...</p>
                </div>
              )}
            </div>

            {/* Connector Line */}
            {index < document.steps.length - 1 && (
              <div className={`absolute left-5 mt-10 w-0.5 h-8 ${
                step.status === 'completed' ? 'bg-green-300' : 'bg-gray-300'
              }`} style={{ marginLeft: '20px' }} />
            )}
          </motion.div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex space-x-3">
          {document.status === 'completed' && (
            <motion.button
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center space-x-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Download className="w-4 h-4" />
              <span>Download Certificate</span>
            </motion.button>
          )}
          
          <motion.button
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            View Details
          </motion.button>
          
          {(document.status === 'pending' || document.status === 'processing') && (
            <motion.button
              className="border border-red-300 text-red-700 px-4 py-2 rounded-lg font-medium hover:bg-red-50 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel Request
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
