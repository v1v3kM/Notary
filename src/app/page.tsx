'use client';

import { motion } from 'framer-motion';
import { 
  FileText, 
  Shield, 
  Clock, 
  Users, 
  CheckCircle, 
  Star, 
  ArrowRight,
  Building,
  Heart,
  Home
} from 'lucide-react';
import Link from 'next/link';

const stats = [
  { number: '10,000+', label: 'Documents Notarized', icon: FileText },
  { number: '99.9%', label: 'Accuracy Rate', icon: Shield },
  { number: '24/7', label: 'Support Available', icon: Clock },
  { number: '5,000+', label: 'Happy Clients', icon: Users },
];

const services = [
  {
    title: 'Real Estate',
    description: 'Property transactions, deeds, and contracts',
    icon: <Home className="w-6 h-6" />,
    color: 'blue',
    price: '$25',
    popular: true,
    features: [
      'Property deeds',
      'Purchase agreements',
      'Lease documents',
      'Title transfers'
    ]
  },
  {
    title: 'Legal Documents',
    description: 'Wills, powers of attorney, and affidavits',
    icon: <FileText className="w-6 h-6" />,
    color: 'green',
    price: '$15',
    features: [
      'Wills & testaments',
      'Power of attorney',
      'Affidavits',
      'Legal contracts'
    ]
  },
  {
    title: 'Business',
    description: 'Corporate documents and agreements',
    icon: <Building className="w-6 h-6" />,
    color: 'purple',
    price: '$35',
    features: [
      'Articles of incorporation',
      'Business contracts',
      'Partnership agreements',
      'Board resolutions'
    ]
  },
  {
    title: 'Personal',
    description: 'Personal documents and certifications',
    icon: <Heart className="w-6 h-6" />,
    color: 'orange',
    price: '$20',
    features: [
      'Birth certificates',
      'Marriage licenses',
      'Divorce papers',
      'Name changes'
    ]
  },
];

const steps = [
  {
    number: '01',
    title: 'Upload Documents',
    description: 'Securely upload your documents through our encrypted platform'
  },
  {
    number: '02',
    title: 'Identity Verification',
    description: 'Complete identity verification through our secure video call'
  },
  {
    number: '03',
    title: 'Digital Notarization',
    description: 'Get your documents notarized digitally with legal compliance'
  },
  {
    number: '04',
    title: 'Download & Share',
    description: 'Download your notarized documents and share them securely'
  }
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Real Estate Agent',
    company: 'Premium Properties',
    content: 'The digital notarization process saved me hours of travel time. Professional and efficient service.',
    rating: 5,
    avatar: '👩‍💼'
  },
  {
    name: 'Michael Chen',
    role: 'Business Owner',
    company: 'Tech Innovations Inc.',
    content: 'Excellent service for our corporate documents. The platform is secure and user-friendly.',
    rating: 5,
    avatar: '👨‍💻'
  },
  {
    name: 'Emily Rodriguez',
    role: 'Legal Consultant',
    company: 'Rodriguez Law Firm',
    content: 'Quick and reliable notarization service. The quality and attention to detail is outstanding.',
    rating: 5,
    avatar: '👩‍⚖️'
  }
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <motion.div 
            className="text-center"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="text-5xl lg:text-7xl font-bold mb-8 leading-tight"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Digital Notary<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400">
                Made Simple
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl lg:text-2xl mb-12 max-w-4xl mx-auto text-blue-100"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Secure, fast, and legally compliant digital notarization services. 
              Get your documents notarized from anywhere, anytime.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <Link href="/dashboard">
                <motion.button 
                  className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started Now
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              
              <motion.button 
                className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Animated background elements */}
        <motion.div 
          className="absolute top-20 left-10 w-20 h-20 bg-blue-400/20 rounded-full"
          animate={{ y: [0, -20, 0], rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-32 h-32 bg-purple-400/20 rounded-full"
          animate={{ y: [0, 20, 0], rotate: -360 }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={`stat-${index}-${stat.label || index}`}
                className="text-center group cursor-pointer"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -5, scale: 1.05 }}
                viewport={{ once: true }}
              >
                <motion.div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg transition-all duration-300"
                  whileHover={{ 
                    rotate: 360,
                    boxShadow: "0 10px 25px rgba(59, 130, 246, 0.4)"
                  }}
                  transition={{ duration: 0.6 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    className="text-white"
                  >
                    <stat.icon className="w-6 h-6" />
                  </motion.div>
                </motion.div>
                <motion.h3 
                  className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors"
                  whileHover={{ scale: 1.1 }}
                >
                  {stat.number}
                </motion.h3>
                <p className="text-gray-600 group-hover:text-gray-800 transition-colors">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Our Legal Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive legal documentation solutions for individuals and businesses
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={`service-${index}-${service.title || index}`}
                className={`bg-white border-2 border-gray-100 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group relative overflow-hidden cursor-pointer ${
                  service.popular ? 'border-blue-200 shadow-lg' : ''
                }`}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -8, scale: 1.03 }}
                viewport={{ once: true }}
              >
                {/* Animated background gradient */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={false}
                />
                
                {service.popular && (
                  <motion.div 
                    className="absolute -top-3 left-1/2 transform -translate-x-1/2"
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                      Most Popular
                    </span>
                  </motion.div>
                )}
                
                <motion.div 
                  className={`w-16 h-16 bg-gradient-to-r ${
                    service.color === 'blue' ? 'from-blue-500 to-cyan-500' :
                    service.color === 'green' ? 'from-green-500 to-emerald-500' :
                    service.color === 'purple' ? 'from-purple-500 to-pink-500' :
                    'from-orange-500 to-red-500'
                  } rounded-2xl flex items-center justify-center mb-6 relative z-10`}
                  whileHover={{ 
                    scale: 1.15, 
                    rotate: [0, -10, 10, 0],
                    boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
                  }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.div 
                    className="text-white"
                    whileHover={{ scale: 1.1 }}
                  >
                    {service.icon}
                  </motion.div>
                </motion.div>
                
                <motion.h3 
                  className="text-xl font-semibold mb-3 group-hover:text-blue-600 transition-colors relative z-10"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {service.title}
                </motion.h3>
                <p className="text-gray-600 mb-4 relative z-10 group-hover:text-gray-700 transition-colors">
                  {service.description}
                </p>
                
                <ul className="space-y-2 mb-6 relative z-10">
                  {service.features.map((feature, idx) => (
                    <motion.li 
                      key={`feature-${idx}-${feature || idx}`} 
                      className="flex items-center text-sm text-gray-600 group-hover:text-gray-700 transition-colors"
                      initial={{ opacity: 0.8 }}
                      whileHover={{ opacity: 1, x: 5 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 360 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      </motion.div>
                      {feature}
                    </motion.li>
                  ))}
                </ul>
                
                <div className="flex items-center justify-between relative z-10">
                  <motion.div 
                    className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                  >
                    {service.price}
                  </motion.div>
                  <motion.button
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-md"
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 8px 20px rgba(59, 130, 246, 0.3)"
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Select
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get your documents notarized in just four simple steps
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={`step-${index}-${step.number || index}`}
                className="text-center group"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -5 }}
                viewport={{ once: true }}
              >
                <motion.div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold group-hover:shadow-lg transition-all duration-300"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  {step.number}
                </motion.div>
                <h3 className="text-xl font-semibold mb-4 group-hover:text-blue-600 transition-colors">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              What Our Clients Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Trusted by thousands of professionals and businesses
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={`testimonial-${index}-${testimonial.name || index}`}
                className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 group"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -5, scale: 1.02 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.div
                      key={`star-${index}-${i}`}
                      whileHover={{ scale: 1.2, rotate: 12 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    </motion.div>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic group-hover:text-gray-900 transition-colors">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                <div className="flex items-center">
                  <motion.div 
                    className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl mr-4"
                    whileHover={{ scale: 1.1, rotate: 15 }}
                  >
                    {testimonial.avatar}
                  </motion.div>
                  <div>
                    <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </div>
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
            <h2 className="text-4xl lg:text-6xl font-bold text-white mb-8">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto">
              Join thousands of satisfied customers who trust our digital notarization services
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/dashboard">
                <motion.button 
                  className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Notarizing Now
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              
              <motion.button 
                className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Sales
              </motion.button>
            </div>
          </motion.div>
        </div>
        
        {/* Animated background elements */}
        <motion.div 
          className="absolute top-10 left-10 w-20 h-20 bg-blue-400/20 rounded-full"
          animate={{ y: [0, -20, 0], rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-10 right-10 w-32 h-32 bg-purple-400/20 rounded-full"
          animate={{ y: [0, 20, 0], rotate: -360 }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="grid md:grid-cols-4 gap-12"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div>
              <h3 className="text-2xl font-bold mb-6">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  NotaryPro
                </span>
              </h3>
              <p className="text-gray-400 mb-6">
                Professional digital notarization services that you can trust.
              </p>
              <div className="flex space-x-4">
                {/* Social media icons would go here */}
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6">Services</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Real Estate</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Legal Documents</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Business</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Personal</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6">Company</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6">Support</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Live Chat</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">API</Link></li>
              </ul>
            </div>
          </motion.div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 NotaryPro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
