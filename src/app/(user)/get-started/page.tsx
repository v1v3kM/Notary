'use client'

import Link from 'next/link'
import { ArrowRight, Mail, UserPlus, Shield, CheckCircle } from 'lucide-react'

export default function GettingStarted() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to Digital Notary
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started with secure, digital notarization services. Follow these simple steps to create your account and begin notarizing documents online.
            </p>
          </div>

          {/* Steps */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <UserPlus className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Create Account</h3>
              <p className="text-gray-600 mb-6">
                Sign up with your email and create a secure password. Choose between client or lawyer account type based on your needs.
              </p>
              <Link 
                href="/auth/signup"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign Up Now <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <Mail className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">2. Verify Email</h3>
              <p className="text-gray-600 mb-6">
                Check your email for a verification link and click it to activate your account. This ensures your account security.
              </p>
              <Link 
                href="/auth/resend"
                className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
              >
                Resend Email <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">3. Complete Profile</h3>
              <p className="text-gray-600 mb-6">
                Add your personal information and identity documents for verification. This enables secure notarization services.
              </p>
              <Link 
                href="/auth/login"
                className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium"
              >
                Login & Continue <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              What You Get
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Secure Digital Notarization</h4>
                    <p className="text-gray-600 text-sm">Bank-grade security for all your important documents</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Video Consultation</h4>
                    <p className="text-gray-600 text-sm">Meet with certified notaries via secure video calls</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Document Management</h4>
                    <p className="text-gray-600 text-sm">Upload, track, and manage all your notarized documents</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Legal Compliance</h4>
                    <p className="text-gray-600 text-sm">Fully compliant with state and federal regulations</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">24/7 Availability</h4>
                    <p className="text-gray-600 text-sm">Access notary services anytime, anywhere</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Instant Delivery</h4>
                    <p className="text-gray-600 text-sm">Get your notarized documents immediately after completion</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of users who trust our platform for their notarization needs. 
              Create your account today and experience the future of digital notarization.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/auth/signup"
                className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Create Account
              </Link>
              <Link 
                href="/auth/login"
                className="inline-flex items-center justify-center bg-gray-100 text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-200 transition-colors"
              >
                <ArrowRight className="w-5 h-5 mr-2" />
                Sign In
              </Link>
            </div>
          </div>

          {/* Help */}
          <div className="mt-16 text-center">
            <p className="text-gray-600">
              Need help? {" "}
              <Link href="/help" className="text-blue-600 hover:text-blue-700 underline">
                Visit our help center
              </Link>
              {" "} or {" "}
              <Link href="/contact" className="text-blue-600 hover:text-blue-700 underline">
                contact support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
