"use client";

import { useState } from "react";
import Link from "next/link";
import { Shield, FileText, Home, Users, ArrowRight, Clock, DollarSign } from "lucide-react";

const agreementTypes = [
  {
    id: "rent",
    name: "Rent Agreement",
    description: "Rental and lease agreements for residential/commercial properties",
    icon: Home,
    price: "₹299",
    duration: "24-48 hours",
    features: ["Customizable terms", "State-specific clauses", "Stamp paper included"]
  },
  {
    id: "affidavit",
    name: "Affidavit",
    description: "General affidavits for various legal purposes",
    icon: FileText,
    price: "₹199",
    duration: "12-24 hours",
    features: ["Multiple formats", "Oath before notary", "Legal validity"]
  },
  {
    id: "partnership",
    name: "Partnership Agreement",
    description: "Business partnership and service agreements",
    icon: Users,
    price: "₹499",
    duration: "48-72 hours",
    features: ["Profit sharing terms", "Liability clauses", "Dispute resolution"]
  }
];

export default function SelectAgreement() {
  const [selectedAgreement, setSelectedAgreement] = useState<string>("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">Notary</span>
            </Link>
            <nav className="flex items-center space-x-6">
              <Link href="/dashboard" className="text-gray-700 hover:text-blue-600">
                Dashboard
              </Link>
              <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Login
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                1
              </div>
              <span className="ml-2 font-medium text-blue-600">Select Agreement</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm font-semibold">
                2
              </div>
              <span className="ml-2 text-gray-500">Fill Details</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm font-semibold">
                3
              </div>
              <span className="ml-2 text-gray-500">Upload Documents</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm font-semibold">
                4
              </div>
              <span className="ml-2 text-gray-500">Review & Submit</span>
            </div>
          </div>
        </div>

        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Agreement Type</h1>
          <p className="text-xl text-gray-600">Select the type of document you need to get notarized</p>
        </div>

        {/* Agreement Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {agreementTypes.map((agreement) => {
            const Icon = agreement.icon;
            const isSelected = selectedAgreement === agreement.id;
            
            return (
              <div
                key={agreement.id}
                onClick={() => setSelectedAgreement(agreement.id)}
                className={`p-6 rounded-xl border-2 cursor-pointer transition-all hover:shadow-lg ${
                  isSelected
                    ? "border-blue-500 bg-blue-50 shadow-lg"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="text-center mb-6">
                  <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
                    isSelected ? "bg-blue-600" : "bg-gray-100"
                  }`}>
                    <Icon className={`w-8 h-8 ${isSelected ? "text-white" : "text-gray-600"}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{agreement.name}</h3>
                  <p className="text-gray-600 text-sm">{agreement.description}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="font-semibold text-green-600">{agreement.price}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-orange-600" />
                      <span className="text-sm text-orange-600">{agreement.duration}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {agreement.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {isSelected && (
                  <div className="mt-6 pt-4 border-t border-blue-200">
                    <div className="text-center">
                      <span className="text-sm font-medium text-blue-600">Selected</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <Link 
            href="/"
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Back to Home
          </Link>
          
          {selectedAgreement && (
            <Link 
              href={`/agreements/form/${selectedAgreement}`}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {/* Help Section */}
        <div className="mt-16 bg-white rounded-xl p-8 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Need Help Choosing?</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Most Popular</h4>
              <p className="text-gray-600 text-sm">Rent agreements are our most requested service, perfect for landlords and tenants.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Quick Processing</h4>
              <p className="text-gray-600 text-sm">Affidavits can be processed fastest, usually within 12-24 hours.</p>
            </div>
          </div>
          <div className="mt-4 text-center">
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              Contact Support for Custom Requirements
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
