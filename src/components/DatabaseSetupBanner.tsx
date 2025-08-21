'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Database, 
  CheckCircle, 
  AlertCircle, 
  ExternalLink,
  Copy,
  RefreshCw
} from 'lucide-react';

export default function DatabaseSetupBanner() {
  const [copied, setCopied] = useState(false);

  const sqlCommand = `-- Run this in your Supabase SQL Editor
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'lawyer', 'admin')),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(sqlCommand);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-white shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-6 h-6 animate-pulse" />
            <div>
              <p className="font-semibold">Database Setup Required</p>
              <p className="text-sm opacity-90">
                Your Supabase database needs to be configured for full functionality
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={copyToClipboard}
              className="flex items-center space-x-2 px-3 py-1 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span className="text-sm">Copy SQL</span>
                </>
              )}
            </button>
            
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-3 py-1 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            >
              <Database className="w-4 h-4" />
              <span className="text-sm">Open Supabase</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            
            <button
              onClick={() => window.location.reload()}
              className="flex items-center space-x-2 px-3 py-1 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm">Refresh</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function DatabaseSetupModal() {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
            <Database className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Database Setup Required</h2>
            <p className="text-gray-600">Configure your Supabase database to enable all features</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 mb-2">Quick Setup Instructions</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-yellow-700">
              <li>Open your <strong>Supabase Dashboard</strong></li>
              <li>Go to <strong>SQL Editor</strong> → <strong>New Query</strong></li>
              <li>Copy and paste the SQL from <code>database_setup.sql</code></li>
              <li>Click <strong>Run</strong> to create all tables</li>
              <li>Refresh this page to continue</li>
            </ol>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">What You&apos;ll Get</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>✅ User profiles and authentication</li>
              <li>✅ Document management system</li>
              <li>✅ Appointment booking with lawyers</li>
              <li>✅ Payment processing integration</li>
              <li>✅ Real-time notifications</li>
              <li>✅ Digital signature storage</li>
            </ul>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Continue Without Setup
            </button>
            <div className="flex items-center space-x-3">
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Database className="w-4 h-4" />
                <span>Open Supabase</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
