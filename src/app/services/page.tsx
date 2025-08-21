'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Scale, 
  FileText, 
  Home, 
  Building, 
  Heart, 
  Shield, 
  Globe, 
  Video, 
  Clock, 
  CheckCircle, 
  Star,
  ArrowRight,
  Zap,
  Users,
  Award,
  Phone,
  Mail,
  Calendar
} from 'lucide-react';

interface Service {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
  features: string[];
  price: string;
  duration: string;
  rating: number;
  reviews: number;
  popular: boolean;
  href: string;
  color: string;
}

const services: Service[] = [
  {
    id: 'property-law',
    title: 'Property Law Services',
    description: 'Complete legal assistance for property transactions, registrations, and disputes.',
    icon: Home,
    category: 'Real Estate',
    features: ['Property Registration', 'Sale Deeds', 'Lease Agreements', 'Title Verification', 'Encumbrance Certificate'],
    price: '₹2,000 - ₹10,000',
    duration: '2-5 days',
    rating: 4.9,
    reviews: 1250,
    popular: true,
    href: '/services/property-law',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'business-law',
    title: 'Business & Corporate Law',
    description: 'Legal support for business formation, partnerships, and corporate documentation.',
    icon: Building,
    category: 'Corporate',
    features: ['Business Registration', 'Partnership Deeds', 'MOUs', 'Employment Contracts', 'Corporate Agreements'],
    price: '₹3,000 - ₹15,000',
    duration: '1-3 days',
    rating: 4.8,
    reviews: 890,
    popular: true,
    href: '/services/business-law',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'family-law',
    title: 'Family Law Services',
    description: 'Sensitive handling of family matters including marriage, divorce, and inheritance.',
    icon: Heart,
    category: 'Personal',
    features: ['Marriage Registration', 'Divorce Proceedings', 'Will Drafting', 'Adoption Papers', 'Custody Agreements'],
    price: '₹1,500 - ₹8,000',
    duration: '3-7 days',
    rating: 4.7,
    reviews: 650,
    popular: false,
    href: '/services/family-law',
    color: 'from-red-500 to-orange-500'
  },
  {
    id: 'contract-drafting',
    title: 'Contract Drafting',
    description: 'Professional contract drafting and review services for all business needs.',
    icon: FileText,
    category: 'Documentation',
    features: ['Service Agreements', 'NDAs', 'Vendor Contracts', 'Employment Terms', 'Licensing Agreements'],
    price: '₹1,000 - ₹5,000',
    duration: '1-2 days',
    rating: 4.8,
    reviews: 420,
    popular: true,
    href: '/services/contract-drafting',
    color: 'from-green-500 to-teal-500'
  },
  {
    id: 'digital-notary',
    title: 'Digital Notarization',
    description: 'Secure online document notarization with video verification and digital signatures.',
    icon: Video,
    category: 'Digital Services',
    features: ['Video Notarization', 'Digital Signatures', 'Document Authentication', 'Online Verification', 'Secure Storage'],
    price: '₹500 - ₹2,000',
    duration: '30 mins - 2 hours',
    rating: 4.9,
    reviews: 2100,
    popular: true,
    href: '/services/digital-notary',
    color: 'from-indigo-500 to-purple-500'
  },
  {
    id: 'legal-consultation',
    title: 'Legal Consultation',
    description: 'Expert legal advice and consultation for all your legal queries and concerns.',
    icon: Scale,
    category: 'Advisory',
    features: ['Legal Advice', 'Case Analysis', 'Document Review', 'Strategic Planning', 'Risk Assessment'],
    price: '₹800 - ₹3,000',
    duration: '30 mins - 2 hours',
    rating: 4.8,
    reviews: 1560,
    popular: false,
    href: '/services/legal-consultation',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    id: 'immigration-law',
    title: 'Immigration Services',
    description: 'Complete immigration assistance including visa applications and documentation.',
    icon: Globe,
    category: 'Immigration',
    features: ['Visa Applications', 'Green Card Process', 'Citizenship Documentation', 'Work Permits', 'Student Visas'],
    price: '₹5,000 - ₹25,000',
    duration: '1-4 weeks',
    rating: 4.6,
    reviews: 340,
    popular: false,
    href: '/services/immigration-law',
    color: 'from-teal-500 to-blue-500'
  },
  {
    id: 'litigation-support',
    title: 'Litigation Support',
    description: 'Comprehensive litigation support including court documentation and representation.',
    icon: Shield,
    category: 'Legal Proceedings',
    features: ['Court Filings', 'Legal Representation', 'Case Preparation', 'Document Discovery', 'Expert Testimony'],
    price: '₹10,000 - ₹50,000',
    duration: '2-12 weeks',
    rating: 4.7,
    reviews: 280,
    popular: false,
    href: '/services/litigation-support',
    color: 'from-gray-600 to-gray-800'
  }
];

const categories = ['All Services', 'Real Estate', 'Corporate', 'Personal', 'Documentation', 'Digital Services', 'Advisory', 'Immigration', 'Legal Proceedings'];

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Services');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = services.filter(service => {
    const matchesCategory = selectedCategory === 'All Services' || service.category === selectedCategory;
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.features.some(feature => feature.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Legal Services
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Comprehensive legal solutions for individuals and businesses across India
            </motion.p>
            
            {/* Stats */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">500+</div>
                <div className="text-blue-200">Legal Experts</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">50,000+</div>
                <div className="text-blue-200">Cases Handled</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">4.8★</div>
                <div className="text-blue-200">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">24/7</div>
                <div className="text-blue-200">Support Available</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-8">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Search services, legal areas, or document types..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
              />
              <Scale className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service, index) => (
            <motion.div
              key={service.id}
              className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Service Header */}
              <div className={`bg-gradient-to-r ${service.color} p-6 text-white relative`}>
                {service.popular && (
                  <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
                    POPULAR
                  </div>
                )}
                <service.icon className="w-12 h-12 mb-4" />
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-white/90 text-sm">{service.description}</p>
              </div>

              {/* Service Details */}
              <div className="p-6">
                {/* Category */}
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                    {service.category}
                  </span>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Key Features:</h4>
                  <ul className="space-y-2">
                    {service.features.slice(0, 3).map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                    {service.features.length > 3 && (
                      <li className="text-sm text-gray-500">
                        +{service.features.length - 3} more features
                      </li>
                    )}
                  </ul>
                </div>

                {/* Service Info */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <Clock className="w-4 h-4 mr-1" />
                      Duration
                    </div>
                    <div className="font-medium text-gray-900">{service.duration}</div>
                  </div>
                  <div>
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <Star className="w-4 h-4 mr-1" />
                      Rating
                    </div>
                    <div className="font-medium text-gray-900">{service.rating} ({service.reviews})</div>
                  </div>
                </div>

                {/* Price and Action */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <div className="text-sm text-gray-600">Starting from</div>
                    <div className="font-bold text-gray-900">{service.price}</div>
                  </div>
                  <Link href={service.href}>
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                      <span>Learn More</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <Scale className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No services found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or select a different category</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All Services');
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Show All Services
            </button>
          </div>
        )}
      </div>

      {/* Why Choose Us Section */}
      <div className="bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our Platform?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide comprehensive legal solutions with the highest standards of professionalism and efficiency
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: 'Verified Lawyers',
                description: 'All our legal professionals are verified and licensed by respective bar councils',
                color: 'text-blue-600'
              },
              {
                icon: Zap,
                title: 'Quick Processing',
                description: 'Fast turnaround times with efficient document processing and legal procedures',
                color: 'text-yellow-600'
              },
              {
                icon: Users,
                title: 'Expert Support',
                description: '24/7 customer support with experienced legal advisors available anytime',
                color: 'text-green-600'
              },
              {
                icon: Award,
                title: 'Quality Assured',
                description: 'High success rates and customer satisfaction with money-back guarantee',
                color: 'text-purple-600'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="text-center p-6 bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <feature.icon className={`w-12 h-12 ${feature.color} mx-auto mb-4`} />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Need Custom Legal Assistance?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Can&apos;t find the service you&apos;re looking for? Our legal experts are ready to help with custom solutions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <button className="flex items-center justify-center space-x-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              <Phone className="w-5 h-5" />
              <span>Call Now</span>
            </button>
            <button className="flex items-center justify-center space-x-2 bg-white/20 text-white px-6 py-3 rounded-lg font-medium hover:bg-white/30 transition-colors border border-white/30">
              <Mail className="w-5 h-5" />
              <span>Send Email</span>
            </button>
            <button className="flex items-center justify-center space-x-2 bg-white/20 text-white px-6 py-3 rounded-lg font-medium hover:bg-white/30 transition-colors border border-white/30">
              <Calendar className="w-5 h-5" />
              <span>Book Consultation</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
