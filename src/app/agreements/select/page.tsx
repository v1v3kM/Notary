"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileText,
  Star,
  ArrowRight,
  CheckCircle,
  Info,
  Search,
  Award,
  Briefcase,
  Home,
  Scale,
  Heart,
  Car,
  GraduationCap,
  Handshake
} from "lucide-react";

interface DocumentType {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  icon: React.ElementType;
  category: string;
  popular?: boolean;
  features: string[];
  requirements: string[];
  useCase: string;
  difficulty: 'Easy' | 'Medium' | 'Complex';
  rating: number;
  completedCount: number;
}

export default function AgreementSelect() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<DocumentType | null>(null);

  const categories = [
    { id: 'all', label: 'All Documents', icon: FileText },
    { id: 'rental', label: 'Rental & Property', icon: Home },
    { id: 'business', label: 'Business & Partnership', icon: Briefcase },
    { id: 'legal', label: 'Legal & Affidavits', icon: Scale },
    { id: 'personal', label: 'Personal & Family', icon: Heart },
    { id: 'vehicle', label: 'Vehicle & Transport', icon: Car },
    { id: 'education', label: 'Education & Training', icon: GraduationCap }
  ];

  const documentTypes: DocumentType[] = [
    {
      id: 'rent-agreement',
      title: 'Rent Agreement',
      description: 'Comprehensive rental agreement for residential and commercial properties',
      price: 499,
      duration: '2-3 days',
      icon: Home,
      category: 'rental',
      popular: true,
      features: ['11-month lease', 'Security deposit terms', 'Maintenance clauses', 'Digital signatures'],
      requirements: ['Property documents', 'ID proofs', 'Passport photos'],
      useCase: 'Perfect for landlords and tenants who want a legally binding rental agreement',
      difficulty: 'Easy',
      rating: 4.8,
      completedCount: 15420
    },
    {
      id: 'affidavit',
      title: 'Affidavit',
      description: 'Sworn statement for various legal purposes and court proceedings',
      price: 299,
      duration: '1-2 days',
      icon: Scale,
      category: 'legal',
      features: ['Identity verification', 'Notary stamps', 'Court admissible', 'Multiple formats'],
      requirements: ['ID proof', 'Address proof', 'Supporting documents'],
      useCase: 'Required for legal proceedings, name changes, address proofs, and declarations',
      difficulty: 'Easy',
      rating: 4.7,
      completedCount: 8930
    },
    {
      id: 'partnership-deed',
      title: 'Partnership Deed',
      description: 'Legal framework for business partnerships and joint ventures',
      price: 799,
      duration: '3-5 days',
      icon: Handshake,
      category: 'business',
      features: ['Profit sharing', 'Liability terms', 'Exit clauses', 'Capital contribution'],
      requirements: ['Partner details', 'Business plan', 'Investment details'],
      useCase: 'Essential for starting a business partnership with clear terms and conditions',
      difficulty: 'Medium',
      rating: 4.9,
      completedCount: 3250
    },
    {
      id: 'power-of-attorney',
      title: 'Power of Attorney',
      description: 'Legal authorization to act on behalf of another person',
      price: 399,
      duration: '2-3 days',
      icon: Award,
      category: 'legal',
      features: ['Specific powers', 'Duration limits', 'Revocation terms', 'Legal validity'],
      requirements: ['Grantor ID', 'Agent ID', 'Purpose details'],
      useCase: 'Grant legal authority to someone to act on your behalf in specific matters',
      difficulty: 'Medium',
      rating: 4.6,
      completedCount: 5670
    },
    {
      id: 'employment-contract',
      title: 'Employment Contract',
      description: 'Comprehensive employment agreement for full-time and contract workers',
      price: 599,
      duration: '2-4 days',
      icon: Briefcase,
      category: 'business',
      features: ['Salary terms', 'Benefits package', 'Termination clauses', 'Confidentiality'],
      requirements: ['Company details', 'Employee details', 'Job description'],
      useCase: 'Define employment terms, salary, benefits, and responsibilities clearly',
      difficulty: 'Medium',
      rating: 4.5,
      completedCount: 4320
    },
    {
      id: 'sale-deed',
      title: 'Sale Deed',
      description: 'Legal document for property sale and ownership transfer',
      price: 999,
      duration: '5-7 days',
      icon: Home,
      category: 'rental',
      features: ['Ownership transfer', 'Payment terms', 'Property details', 'Registration ready'],
      requirements: ['Property documents', 'Buyer/Seller ID', 'Financial details'],
      useCase: 'Complete property sale with legal ownership transfer documentation',
      difficulty: 'Complex',
      rating: 4.8,
      completedCount: 2180
    },
    {
      id: 'will-testament',
      title: 'Will & Testament',
      description: 'Legal document to distribute assets after death',
      price: 699,
      duration: '3-5 days',
      icon: Heart,
      category: 'personal',
      features: ['Asset distribution', 'Executor appointment', 'Guardian nomination', 'Legal validity'],
      requirements: ['Asset details', 'Beneficiary information', 'Witness details'],
      useCase: 'Ensure your assets are distributed according to your wishes after death',
      difficulty: 'Medium',
      rating: 4.7,
      completedCount: 1890
    },
    {
      id: 'vehicle-sale',
      title: 'Vehicle Sale Agreement',
      description: 'Legal agreement for buying and selling vehicles',
      price: 349,
      duration: '1-2 days',
      icon: Car,
      category: 'vehicle',
      features: ['Transfer terms', 'Payment details', 'Condition warranty', 'Registration transfer'],
      requirements: ['Vehicle RC', 'Buyer/Seller ID', 'Insurance details'],
      useCase: 'Safe and legal vehicle purchase/sale with proper documentation',
      difficulty: 'Easy',
      rating: 4.4,
      completedCount: 6540
    }
  ];

  const filteredDocuments = documentTypes.filter(doc => {
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-700 bg-green-100';
      case 'Medium': return 'text-yellow-700 bg-yellow-100';
      case 'Complex': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const handleDocumentSelect = (document: DocumentType) => {
    setSelectedDocument(document);
  };

  const handleProceed = () => {
    if (selectedDocument) {
      router.push(`/agreements/${selectedDocument.id}/form`);
    }
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
              <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">
                Dashboard
              </Link>
              <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Login
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Choose Your Document Type
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Select from our comprehensive library of legal documents. All templates are 
            legally compliant and created by experienced lawyers.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Documents
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Categories */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-blue-50 text-blue-600 border border-blue-200'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <category.icon className="w-5 h-5 mr-3" />
                      <span className="text-sm font-medium">{category.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Documents */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Most Popular</h3>
                <div className="space-y-3">
                  {documentTypes.filter(doc => doc.popular).map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center">
                        <doc.icon className="w-5 h-5 text-blue-600 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-blue-900">{doc.title}</div>
                          <div className="text-xs text-blue-600">₹{doc.price}</div>
                        </div>
                      </div>
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Document Grid */}
          <div className="lg:col-span-3">
            <div className="grid md:grid-cols-2 gap-6">
              {filteredDocuments.map((document, index) => (
                <motion.div
                  key={document.id}
                  className={`bg-white rounded-xl shadow-sm border-2 transition-all duration-300 cursor-pointer ${
                    selectedDocument?.id === document.id
                      ? 'border-blue-500 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  onClick={() => handleDocumentSelect(document)}
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="p-3 bg-blue-100 rounded-xl mr-4">
                          <document.icon className="w-8 h-8 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">
                            {document.title}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(document.difficulty)}`}>
                              {document.difficulty}
                            </span>
                            {document.popular && (
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                                Popular
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {document.description}
                    </p>

                    {/* Rating and Stats */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                          <span className="text-sm font-medium">{document.rating}</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {document.completedCount.toLocaleString()} completed
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">₹{document.price}</div>
                        <div className="text-sm text-gray-500">{document.duration}</div>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Key Features</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {document.features.slice(0, 4).map((feature, idx) => (
                          <div key={idx} className="flex items-center text-sm text-gray-600">
                            <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Use Case */}
                    <div className="mb-4">
                      <div className="flex items-start">
                        <Info className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-600">{document.useCase}</p>
                      </div>
                    </div>

                    {/* Action */}
                    <button
                      className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                        selectedDocument?.id === document.id
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDocumentSelect(document);
                      }}
                    >
                      {selectedDocument?.id === document.id ? 'Selected' : 'Select Document'}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredDocuments.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No documents found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your search or category filter</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Selected Document Details & Proceed */}
        {selectedDocument && (
          <motion.div
            className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <selectedDocument.icon className="w-8 h-8 text-blue-600 mr-4" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {selectedDocument.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      ₹{selectedDocument.price} • {selectedDocument.duration}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setSelectedDocument(null)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleProceed}
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    Proceed to Form
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
