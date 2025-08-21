'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Eye, 
  Search,
  Home,
  Scale,
  Building,
  Users,
  GraduationCap
} from 'lucide-react';

interface DocumentTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  price: string;
  duration: string;
  popularity: number;
  fields: TemplateField[];
  preview: string;
}

interface TemplateField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'textarea';
  required: boolean;
  options?: string[];
  placeholder?: string;
}

const templates: DocumentTemplate[] = [
  {
    id: 'property-sale-deed',
    title: 'Property Sale Deed',
    description: 'Complete sale deed for property transactions',
    category: 'Real Estate',
    icon: <Home className="w-6 h-6" />,
    price: '₹500',
    duration: '2-3 hours',
    popularity: 95,
    fields: [
      { id: 'seller_name', label: 'Seller Name', type: 'text', required: true, placeholder: 'Full name of seller' },
      { id: 'buyer_name', label: 'Buyer Name', type: 'text', required: true, placeholder: 'Full name of buyer' },
      { id: 'property_address', label: 'Property Address', type: 'textarea', required: true, placeholder: 'Complete property address' },
      { id: 'sale_amount', label: 'Sale Amount', type: 'number', required: true, placeholder: 'Amount in INR' },
      { id: 'sale_date', label: 'Sale Date', type: 'date', required: true },
      { id: 'property_type', label: 'Property Type', type: 'select', required: true, options: ['Residential', 'Commercial', 'Agricultural', 'Industrial'] }
    ],
    preview: 'SALE DEED\n\nThis deed of sale is executed on [DATE] between [SELLER NAME] (Seller) and [BUYER NAME] (Buyer) for the property located at [PROPERTY ADDRESS]...'
  },
  {
    id: 'rental-agreement',
    title: 'Rental Agreement',
    description: 'Comprehensive rental/lease agreement',
    category: 'Real Estate',
    icon: <Building className="w-6 h-6" />,
    price: '₹300',
    duration: '1-2 hours',
    popularity: 88,
    fields: [
      { id: 'landlord_name', label: 'Landlord Name', type: 'text', required: true },
      { id: 'tenant_name', label: 'Tenant Name', type: 'text', required: true },
      { id: 'property_address', label: 'Rental Property Address', type: 'textarea', required: true },
      { id: 'monthly_rent', label: 'Monthly Rent', type: 'number', required: true },
      { id: 'security_deposit', label: 'Security Deposit', type: 'number', required: true },
      { id: 'lease_duration', label: 'Lease Duration (months)', type: 'number', required: true },
      { id: 'start_date', label: 'Lease Start Date', type: 'date', required: true }
    ],
    preview: 'RENTAL AGREEMENT\n\nThis agreement is made between [LANDLORD NAME] (Landlord) and [TENANT NAME] (Tenant) for the rental of property at [PROPERTY ADDRESS]...'
  },
  {
    id: 'affidavit-income',
    title: 'Income Affidavit',
    description: 'Income declaration affidavit for official purposes',
    category: 'Legal',
    icon: <Scale className="w-6 h-6" />,
    price: '₹200',
    duration: '1 hour',
    popularity: 92,
    fields: [
      { id: 'applicant_name', label: 'Applicant Name', type: 'text', required: true },
      { id: 'father_name', label: 'Father/Husband Name', type: 'text', required: true },
      { id: 'address', label: 'Address', type: 'textarea', required: true },
      { id: 'annual_income', label: 'Annual Income', type: 'number', required: true },
      { id: 'income_source', label: 'Source of Income', type: 'select', required: true, options: ['Salary', 'Business', 'Agriculture', 'Pension', 'Other'] },
      { id: 'purpose', label: 'Purpose of Affidavit', type: 'text', required: true }
    ],
    preview: 'INCOME AFFIDAVIT\n\nI, [APPLICANT NAME], son/daughter of [FATHER NAME], resident of [ADDRESS], do hereby solemnly affirm and declare that...'
  },
  {
    id: 'partnership-deed',
    title: 'Partnership Deed',
    description: 'Business partnership agreement document',
    category: 'Business',
    icon: <Users className="w-6 h-6" />,
    price: '₹800',
    duration: '3-4 hours',
    popularity: 75,
    fields: [
      { id: 'business_name', label: 'Business Name', type: 'text', required: true },
      { id: 'partner1_name', label: 'Partner 1 Name', type: 'text', required: true },
      { id: 'partner2_name', label: 'Partner 2 Name', type: 'text', required: true },
      { id: 'business_address', label: 'Business Address', type: 'textarea', required: true },
      { id: 'capital_contribution', label: 'Capital Contribution Details', type: 'textarea', required: true },
      { id: 'profit_sharing', label: 'Profit Sharing Ratio', type: 'text', required: true },
      { id: 'business_nature', label: 'Nature of Business', type: 'text', required: true }
    ],
    preview: 'PARTNERSHIP DEED\n\nThis partnership deed is executed between [PARTNER1 NAME] and [PARTNER2 NAME] for the business of [BUSINESS NAME]...'
  },
  {
    id: 'power-of-attorney',
    title: 'Power of Attorney',
    description: 'General power of attorney document',
    category: 'Legal',
    icon: <FileText className="w-6 h-6" />,
    price: '₹400',
    duration: '2 hours',
    popularity: 83,
    fields: [
      { id: 'principal_name', label: 'Principal Name (Grantor)', type: 'text', required: true },
      { id: 'attorney_name', label: 'Attorney Name (Grantee)', type: 'text', required: true },
      { id: 'principal_address', label: 'Principal Address', type: 'textarea', required: true },
      { id: 'attorney_address', label: 'Attorney Address', type: 'textarea', required: true },
      { id: 'powers_granted', label: 'Powers Granted', type: 'textarea', required: true },
      { id: 'duration', label: 'Duration/Validity', type: 'text', required: true }
    ],
    preview: 'POWER OF ATTORNEY\n\nKnow all men by these presents that I, [PRINCIPAL NAME], do hereby constitute and appoint [ATTORNEY NAME] as my attorney...'
  },
  {
    id: 'employment-contract',
    title: 'Employment Contract',
    description: 'Employee appointment and service agreement',
    category: 'Business',
    icon: <GraduationCap className="w-6 h-6" />,
    price: '₹600',
    duration: '2-3 hours',
    popularity: 78,
    fields: [
      { id: 'company_name', label: 'Company Name', type: 'text', required: true },
      { id: 'employee_name', label: 'Employee Name', type: 'text', required: true },
      { id: 'designation', label: 'Designation', type: 'text', required: true },
      { id: 'salary', label: 'Monthly Salary', type: 'number', required: true },
      { id: 'joining_date', label: 'Joining Date', type: 'date', required: true },
      { id: 'probation_period', label: 'Probation Period (months)', type: 'number', required: true },
      { id: 'notice_period', label: 'Notice Period (days)', type: 'number', required: true }
    ],
    preview: 'EMPLOYMENT CONTRACT\n\nThis agreement is entered into between [COMPANY NAME] (Company) and [EMPLOYEE NAME] (Employee) on [JOINING DATE]...'
  }
];

const categories = ['All', 'Real Estate', 'Legal', 'Business', 'Government'];

export default function DocumentTemplates() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handlePreview = (template: DocumentTemplate) => {
    setSelectedTemplate(template);
    setShowPreview(true);
  };

  const handleUseTemplate = (template: DocumentTemplate) => {
    // This would navigate to the form page with the template
    console.log('Using template:', template.id);
    // For now, just show an alert
    alert(`Using template: ${template.title}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Document Templates
          </h1>
          <p className="text-xl text-gray-600 mb-2">दस्तावेज़ टेम्प्लेट</p>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Choose from our comprehensive collection of legal document templates, 
            pre-formatted and ready for digital notarization.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
            >
              {/* Template Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    {template.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {template.title}
                    </h3>
                    <span className="text-sm text-blue-600 font-medium">
                      {template.category}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">
                    {template.price}
                  </div>
                  <div className="text-xs text-gray-500">
                    {template.duration}
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-4 text-sm">
                {template.description}
              </p>

              {/* Popularity Indicator */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                  <span>Popularity</span>
                  <span>{template.popularity}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${template.popularity}%` }}
                  ></div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => handlePreview(template)}
                  className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>Preview</span>
                </button>
                <button
                  onClick={() => handleUseTemplate(template)}
                  className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span>Use</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No templates found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}

        {/* Preview Modal */}
        {showPreview && selectedTemplate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            >
              {/* Modal Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Template Preview: {selectedTemplate.title}
                  </h3>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Template Fields */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4">Required Fields</h4>
                    <div className="space-y-4">
                      {selectedTemplate.fields.map((field) => (
                        <div key={field.id} className="border-b border-gray-100 pb-3">
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-sm font-medium text-gray-700">
                              {field.label}
                            </label>
                            {field.required && (
                              <span className="text-red-500 text-xs">Required</span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500">
                            Type: {field.type}
                            {field.placeholder && ` • ${field.placeholder}`}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Template Preview */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4">Document Preview</h4>
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                        {selectedTemplate.preview}
                      </pre>
                    </div>
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setShowPreview(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      handleUseTemplate(selectedTemplate);
                      setShowPreview(false);
                    }}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Use This Template
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
