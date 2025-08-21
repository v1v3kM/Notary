"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  ArrowRight, 
  User, 
  MapPin, 
  Calendar,
  FileText,
  CheckCircle,
  AlertCircle,
  Info,
  Building,
  Phone,
  Mail,
  DollarSign,
  Clock,
  Save,
  HelpCircle
} from "lucide-react";

// Form templates for different agreement types
const formTemplates = {
  "rent-agreement": {
    title: "Rent Agreement",
    subtitle: "Complete rental agreement for residential or commercial properties",
    estimatedTime: "5-8 minutes",
    sections: [
      {
        title: "Property Owner Details",
        fields: [
          { name: "landlordName", label: "Full Name", type: "text", required: true, icon: User },
          { name: "landlordPhone", label: "Phone Number", type: "tel", required: true, icon: Phone },
          { name: "landlordEmail", label: "Email Address", type: "email", required: true, icon: Mail },
          { name: "landlordAddress", label: "Address", type: "textarea", required: true, icon: MapPin },
        ]
      },
      {
        title: "Tenant Details",
        fields: [
          { name: "tenantName", label: "Full Name", type: "text", required: true, icon: User },
          { name: "tenantPhone", label: "Phone Number", type: "tel", required: true, icon: Phone },
          { name: "tenantEmail", label: "Email Address", type: "email", required: true, icon: Mail },
          { name: "tenantOccupation", label: "Occupation", type: "text", required: true, icon: Building },
        ]
      },
      {
        title: "Property Information",
        fields: [
          { name: "propertyAddress", label: "Complete Property Address", type: "textarea", required: true, icon: MapPin },
          { name: "propertyType", label: "Property Type", type: "select", required: true, icon: Building, options: ["Apartment", "House", "Commercial Space", "Shop", "Office"] },
          { name: "furnishingStatus", label: "Furnishing Status", type: "select", required: true, icon: Building, options: ["Fully Furnished", "Semi Furnished", "Unfurnished"] },
        ]
      },
      {
        title: "Financial Terms",
        fields: [
          { name: "monthlyRent", label: "Monthly Rent", type: "number", required: true, icon: DollarSign, prefix: "₹" },
          { name: "securityDeposit", label: "Security Deposit", type: "number", required: true, icon: DollarSign, prefix: "₹" },
          { name: "maintenanceCharges", label: "Monthly Maintenance", type: "number", required: false, icon: DollarSign, prefix: "₹" },
        ]
      },
      {
        title: "Lease Terms",
        fields: [
          { name: "leasePeriod", label: "Lease Duration (months)", type: "number", required: true, icon: Clock },
          { name: "startDate", label: "Lease Start Date", type: "date", required: true, icon: Calendar },
          { name: "rentDueDate", label: "Monthly Rent Due Date", type: "number", required: true, icon: Calendar, max: 31 },
        ]
      }
    ]
  },
  "affidavit": {
    title: "Affidavit",
    subtitle: "Sworn statement for legal purposes and court proceedings",
    estimatedTime: "3-5 minutes",
    sections: [
      {
        title: "Personal Information",
        fields: [
          { name: "affiantName", label: "Full Name", type: "text", required: true, icon: User },
          { name: "affiantAge", label: "Age", type: "number", required: true, icon: User },
          { name: "affiantAddress", label: "Complete Address", type: "textarea", required: true, icon: MapPin },
          { name: "affiantOccupation", label: "Occupation", type: "text", required: true, icon: Building },
        ]
      },
      {
        title: "Affidavit Details",
        fields: [
          { name: "purpose", label: "Purpose of Affidavit", type: "select", required: true, icon: FileText, options: ["Name Change", "Address Proof", "Income Certificate", "Age Proof", "Other"] },
          { name: "statement", label: "Statement/Declaration", type: "textarea", required: true, icon: FileText, rows: 6 },
          { name: "date", label: "Date", type: "date", required: true, icon: Calendar },
        ]
      }
    ]
  },
  "partnership-deed": {
    title: "Partnership Deed",
    subtitle: "Legal framework for business partnerships and joint ventures",
    estimatedTime: "8-12 minutes",
    sections: [
      {
        title: "Business Information",
        fields: [
          { name: "businessName", label: "Business Name", type: "text", required: true, icon: Building },
          { name: "businessType", label: "Business Type", type: "select", required: true, icon: Building, options: ["Trading", "Manufacturing", "Service", "Professional", "Other"] },
          { name: "businessAddress", label: "Business Address", type: "textarea", required: true, icon: MapPin },
        ]
      },
      {
        title: "Partner 1 Details",
        fields: [
          { name: "partner1Name", label: "Full Name", type: "text", required: true, icon: User },
          { name: "partner1Address", label: "Address", type: "textarea", required: true, icon: MapPin },
          { name: "partner1Investment", label: "Capital Investment", type: "number", required: true, icon: DollarSign, prefix: "₹" },
          { name: "partner1Share", label: "Profit Share (%)", type: "number", required: true, icon: DollarSign, max: 100 },
        ]
      },
      {
        title: "Partner 2 Details",
        fields: [
          { name: "partner2Name", label: "Full Name", type: "text", required: true, icon: User },
          { name: "partner2Address", label: "Address", type: "textarea", required: true, icon: MapPin },
          { name: "partner2Investment", label: "Capital Investment", type: "number", required: true, icon: DollarSign, prefix: "₹" },
          { name: "partner2Share", label: "Profit Share (%)", type: "number", required: true, icon: DollarSign, max: 100 },
        ]
      },
      {
        title: "Partnership Terms",
        fields: [
          { name: "startDate", label: "Partnership Start Date", type: "date", required: true, icon: Calendar },
          { name: "duration", label: "Partnership Duration", type: "select", required: true, icon: Clock, options: ["1 Year", "2 Years", "3 Years", "5 Years", "Indefinite"] },
        ]
      }
    ]
  }
};

export default function AgreementForm() {
  const params = useParams();
  const agreementType = params.type as string;
  const template = formTemplates[agreementType as keyof typeof formTemplates];

  const [formData, setFormData] = useState<Record<string, string>>({});
  const [currentSection, setCurrentSection] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [savedProgress, setSavedProgress] = useState(false);

  if (!template) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div 
          className="text-center bg-white p-8 rounded-xl shadow-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Document Type Not Found</h1>
          <p className="text-gray-600 mb-6">The requested agreement type could not be found.</p>
          <Link 
            href="/agreements/select" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Selection
          </Link>
        </motion.div>
      </div>
    );
  }

  const currentSectionData = template.sections[currentSection];
  const totalSections = template.sections.length;
  const progressPercentage = ((currentSection + 1) / totalSections) * 100;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  const validateSection = () => {
    const sectionErrors: Record<string, string> = {};
    
    currentSectionData.fields.forEach(field => {
      if (field.required && !formData[field.name]?.trim()) {
        sectionErrors[field.name] = `${field.label} is required`;
      }
    });

    setErrors(sectionErrors);
    return Object.keys(sectionErrors).length === 0;
  };

  const handleNext = () => {
    if (validateSection()) {
      if (currentSection < totalSections - 1) {
        setCurrentSection(currentSection + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateSection()) {
      console.log("Form data:", formData);
      // TODO: Save form data and proceed to document upload
    }
  };

  const saveProgress = () => {
    localStorage.setItem(`agreement-form-${agreementType}`, JSON.stringify(formData));
    setSavedProgress(true);
    setTimeout(() => setSavedProgress(false), 2000);
  };

  const renderField = (field: {
    name: string;
    label: string;
    type: string;
    required: boolean;
    icon: React.ComponentType<{ className?: string }>;
    options?: string[];
    prefix?: string;
    rows?: number;
    max?: number;
  }) => {
    const hasError = errors[field.name];
    const Icon = field.icon;

    return (
      <div key={field.name} className={field.type === "textarea" ? "col-span-2" : ""}>
        <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-2">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        <div className="relative">
          {Icon && (
            <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          )}
          {field.prefix && (
            <span className="absolute left-10 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
              {field.prefix}
            </span>
          )}
          
          {field.type === "textarea" ? (
            <textarea
              name={field.name}
              id={field.name}
              required={field.required}
              value={formData[field.name] || ""}
              onChange={handleInputChange}
              rows={field.rows || 4}
              className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                Icon ? "pl-10" : ""
              } ${
                hasError ? "border-red-300 bg-red-50" : "border-gray-300"
              }`}
              placeholder={`Enter ${field.label.toLowerCase()}`}
            />
          ) : field.type === "select" ? (
            <select
              name={field.name}
              id={field.name}
              required={field.required}
              value={formData[field.name] || ""}
              onChange={handleInputChange}
              className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                Icon ? "pl-10" : ""
              } ${
                hasError ? "border-red-300 bg-red-50" : "border-gray-300"
              }`}
            >
              <option value="">Select {field.label.toLowerCase()}</option>
              {field.options?.map((option: string) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          ) : (
            <input
              type={field.type}
              name={field.name}
              id={field.name}
              required={field.required}
              value={formData[field.name] || ""}
              onChange={handleInputChange}
              max={field.max}
              className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                Icon ? "pl-10" : ""
              } ${
                field.prefix ? "pl-16" : ""
              } ${
                hasError ? "border-red-300 bg-red-50" : "border-gray-300"
              }`}
              placeholder={field.type === "number" ? "0" : `Enter ${field.label.toLowerCase()}`}
            />
          )}
        </div>
        
        {hasError && (
          <motion.p 
            className="text-red-600 text-sm mt-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {hasError}
          </motion.p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="Notary Platform Logo"
                width={150}
                height={40}
                className="h-10 w-auto cursor-pointer"
              />
            </Link>
            <div className="flex items-center space-x-4">
              <button
                onClick={saveProgress}
                className={`flex items-center space-x-2 px-4 py-2 text-sm rounded-lg transition-colors ${
                  savedProgress 
                    ? "bg-green-100 text-green-700" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {savedProgress ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                <span>{savedProgress ? "Saved!" : "Save Progress"}</span>
              </button>
              <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{template.title}</h1>
              <p className="text-gray-600 mt-1">{template.subtitle}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Estimated time</div>
              <div className="text-lg font-semibold text-gray-900 flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {template.estimatedTime}
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="bg-gray-200 rounded-full h-2 mb-6">
            <motion.div 
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${progressPercentage}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* Section Navigation */}
          <div className="flex justify-center space-x-4 mb-8">
            {template.sections.map((section, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  index < currentSection 
                    ? "bg-green-600 text-white" 
                    : index === currentSection 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-300 text-gray-500"
                }`}>
                  {index < currentSection ? <CheckCircle className="w-4 h-4" /> : index + 1}
                </div>
                {index < template.sections.length - 1 && (
                  <div className={`w-8 h-0.5 mx-2 ${
                    index < currentSection ? "bg-green-600" : "bg-gray-300"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Section */}
        <motion.div
          key={currentSection}
          className="bg-white rounded-xl shadow-sm border p-8"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              {currentSectionData.title}
            </h2>
            <p className="text-gray-600">
              Step {currentSection + 1} of {totalSections}
            </p>
          </div>

          <form onSubmit={currentSection === totalSections - 1 ? handleSubmit : (e) => e.preventDefault()}>
            <div className="grid md:grid-cols-2 gap-6">
              {currentSectionData.fields.map(renderField)}
            </div>

            {/* Help Section */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start">
                <Info className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Helpful Tips</h4>
                  <ul className="text-blue-800 text-sm space-y-1">
                    <li>• All required fields must be completed to proceed</li>
                    <li>• Your progress is automatically saved</li>
                    <li>• Double-check all information for accuracy</li>
                    {currentSection === 0 && (
                      <li>• Ensure all names match your identification documents</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-4">
                {currentSection > 0 ? (
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>
                ) : (
                  <Link 
                    href="/agreements/select"
                    className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Selection</span>
                  </Link>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  {currentSection + 1} of {totalSections}
                </span>
                
                {currentSection < totalSections - 1 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <span>Next Section</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <span>Continue to Documents</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </form>
        </motion.div>

        {/* Additional Help */}
        <div className="mt-8 bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <HelpCircle className="w-5 h-5 mr-2" />
            Need Assistance?
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Required Documents</h4>
              <p className="text-gray-600">You&apos;ll need to upload ID proofs and supporting documents in the next step.</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Processing Time</h4>
              <p className="text-gray-600">Most agreements are processed within 24-48 hours after submission.</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Support</h4>
              <p className="text-gray-600">Contact our support team at support@notary.com for assistance.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
