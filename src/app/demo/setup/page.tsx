"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function DemoSetup() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const setupDemoUsers = async () => {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch('/api/demo/setup', {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Setup failed');
      } else {
        setMessage('Demo users created successfully! You can now use the demo login buttons.');
      }
    } catch (err) {
      console.error('Setup error:', err);
      setError('An unexpected error occurred during setup.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-md w-full space-y-8"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Demo Setup</h2>
          <p className="text-gray-600">Set up demo users for testing the application</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {message}
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">Demo Users to be Created:</h3>
            <div className="space-y-2 text-sm text-blue-700">
              <div>
                <p className="font-medium">Client Account:</p>
                <p>Email: demo.client@notary.com</p>
                <p>Password: demo123</p>
              </div>
              <div>
                <p className="font-medium">Lawyer Account:</p>
                <p>Email: demo.lawyer@notary.com</p>
                <p>Password: demo123</p>
              </div>
            </div>
          </div>

          <button
            onClick={setupDemoUsers}
            disabled={loading}
            className={`w-full py-3 px-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
            }`}
          >
            {loading ? 'Setting up...' : 'Setup Demo Users'}
          </button>

          <div className="text-center">
            <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium">
              ← Back to Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
