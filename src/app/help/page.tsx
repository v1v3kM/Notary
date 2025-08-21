'use client';

import { motion } from 'framer-motion';
import { 
  Search, 
  FileText, 
  Shield, 
  Clock,
  Phone,
  Mail,
  MessageCircle,
  ChevronDown,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

const categories = [
  {
    title: 'Getting Started',
    icon: <FileText className="w-6 h-6" />,
    color: 'blue',
    articles: [
      'How to create your first notarization',
      'Account setup and verification',
      'Understanding digital notarization',
      'Required documents and ID verification'
    ]
  },
  {
    title: 'Security & Privacy',
    icon: <Shield className="w-6 h-6" />,
    color: 'green',
    articles: [
      'How we protect your documents',
      'Data encryption and security measures',
      'Privacy policy and data handling',
      'Document storage and retention'
    ]
  },
  {
    title: 'Technical Support',
    icon: <Clock className="w-6 h-6" />,
    color: 'purple',
    articles: [
      'Browser requirements and compatibility',
      'Troubleshooting video calls',
      'Upload issues and file formats',
      'Mobile app support'
    ]
  }
];

const faqs = [
  {
    category: 'General',
    questions: [
      {
        question: 'What is digital notarization?',
        answer: 'Digital notarization is the electronic equivalent of traditional notarization. Using secure video technology, a licensed notary public can verify your identity and witness your document signing remotely, creating a legally valid notarized document.',
        type: 'info'
      },
      {
        question: 'Is digital notarization legally valid?',
        answer: 'Yes, digital notarization is legally recognized in all 50 states and meets federal requirements. The documents produced have the same legal standing as traditional paper notarizations.',
        type: 'success'
      },
      {
        question: 'How long does the process take?',
        answer: 'Most notarizations are completed within 15-30 minutes. This includes identity verification, document review, and the actual notarization process.',
        type: 'info'
      }
    ]
  },
  {
    category: 'Technical',
    questions: [
      {
        question: 'What browsers are supported?',
        answer: 'We support the latest versions of Chrome, Firefox, Safari, and Edge. For the best experience, we recommend using Chrome with a stable internet connection.',
        type: 'info'
      },
      {
        question: 'What if my video call is not working?',
        answer: 'First, ensure your browser has camera and microphone permissions enabled. If issues persist, try refreshing the page or switching browsers. Our support team is available 24/7 to help.',
        type: 'warning'
      },
      {
        question: 'Can I use my mobile device?',
        answer: 'Yes, our platform works on mobile devices through your browser. For the best experience on mobile, we recommend using our dedicated mobile app available on iOS and Android.',
        type: 'success'
      }
    ]
  },
  {
    category: 'Security',
    questions: [
      {
        question: 'How secure is my personal information?',
        answer: 'We use bank-level encryption (AES-256) to protect all data in transit and at rest. Your documents are stored securely and automatically deleted after the required retention period.',
        type: 'success'
      },
      {
        question: 'Who can access my documents?',
        answer: 'Only you and the assigned notary can access your documents during the session. After completion, documents are encrypted and accessible only to you through your secure account.',
        type: 'info'
      },
      {
        question: 'What happens to my documents after notarization?',
        answer: 'Your notarized documents are securely stored in your account for easy access. We retain copies as required by law, typically for 7-10 years depending on state regulations.',
        type: 'info'
      }
    ]
  }
];

const quickActions = [
  {
    title: 'Start Live Chat',
    description: 'Get instant help from our support team',
    icon: <MessageCircle className="w-8 h-8" />,
    color: 'blue',
    action: () => console.log('Start chat')
  },
  {
    title: 'Call Support',
    description: '1-800-NOTARY-1 (Available 24/7)',
    icon: <Phone className="w-8 h-8" />,
    color: 'green',
    action: () => window.open('tel:+18006682791')
  },
  {
    title: 'Email Us',
    description: 'support@notarypro.com',
    icon: <Mail className="w-8 h-8" />,
    color: 'purple',
    action: () => window.open('mailto:support@notarypro.com')
  }
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('General');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const filteredFAQs = faqs.find(cat => cat.category === selectedCategory)?.questions || [];

  const getIconForType = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <motion.div 
            className="text-center"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="text-5xl lg:text-6xl font-bold mb-8"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Help Center
            </motion.h1>
            
            <motion.p 
              className="text-xl lg:text-2xl mb-12 max-w-4xl mx-auto text-blue-100"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Find answers to your questions and get the support you need.
            </motion.p>

            {/* Search Bar */}
            <motion.div 
              className="max-w-2xl mx-auto relative"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                <input
                  type="text"
                  placeholder="Search for help articles, FAQs, and more..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-full text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-white/30"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Need Immediate Help?
            </h2>
            <p className="text-xl text-gray-600">
              Get instant support through any of these channels
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                className="bg-gray-50 rounded-2xl p-8 text-center group hover:shadow-lg transition-all duration-300 cursor-pointer"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -5, scale: 1.02 }}
                viewport={{ once: true }}
                onClick={action.action}
              >
                <motion.div 
                  className={`w-20 h-20 bg-gradient-to-r ${
                    action.color === 'blue' ? 'from-blue-500 to-cyan-500' :
                    action.color === 'green' ? 'from-green-500 to-emerald-500' :
                    'from-purple-500 to-pink-500'
                  } rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg transition-all duration-300`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <div className="text-white">
                    {action.icon}
                  </div>
                </motion.div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-600 transition-colors">
                  {action.title}
                </h3>
                <p className="text-gray-600">{action.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Browse Help Topics
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find detailed guides and tutorials organized by category
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.title}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -5, scale: 1.02 }}
                viewport={{ once: true }}
              >
                <motion.div 
                  className={`w-16 h-16 bg-gradient-to-r ${
                    category.color === 'blue' ? 'from-blue-500 to-cyan-500' :
                    category.color === 'green' ? 'from-green-500 to-emerald-500' :
                    'from-purple-500 to-pink-500'
                  } rounded-2xl flex items-center justify-center mb-6 group-hover:shadow-lg transition-all duration-300`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <div className="text-white">
                    {category.icon}
                  </div>
                </motion.div>
                <h3 className="text-xl font-semibold mb-4 group-hover:text-blue-600 transition-colors">
                  {category.title}
                </h3>
                <ul className="space-y-2">
                  {category.articles.map((article, idx) => (
                    <li key={idx} className="text-gray-600 hover:text-blue-600 cursor-pointer transition-colors">
                      • {article}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Quick answers to the most common questions
            </p>
          </motion.div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {faqs.map((category) => (
              <motion.button
                key={category.category}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  selectedCategory === category.category
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setSelectedCategory(category.category)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.category}
              </motion.button>
            ))}
          </div>

          {/* FAQ List */}
          <div className="space-y-4">
            {filteredFAQs.map((faq, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 rounded-2xl overflow-hidden"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <button
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-100 transition-colors"
                  onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                >
                  <div className="flex items-center gap-3">
                    {getIconForType(faq.type)}
                    <span className="font-semibold text-gray-900">{faq.question}</span>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedFAQ === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  </motion.div>
                </button>
                
                <motion.div
                  initial={false}
                  animate={{
                    height: expandedFAQ === index ? 'auto' : 0,
                    opacity: expandedFAQ === index ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 leading-relaxed pl-8">
                      {faq.answer}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8">
              Still Need Help?
            </h2>
            <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto">
              Our support team is available 24/7 to assist you with any questions or issues.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/contact">
                <motion.button 
                  className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Mail className="w-5 h-5" />
                  Contact Support
                </motion.button>
              </Link>
              
              <motion.button 
                className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 flex items-center gap-2"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <MessageCircle className="w-5 h-5" />
                Live Chat
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
