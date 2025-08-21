'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Check,
  Zap,
  Shield,
  Clock,
  FileText,
  Award,
  HeadphonesIcon,
  Crown
} from 'lucide-react';

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  features: string[];
  icon: React.ComponentType<{ className?: string }>;
  popular?: boolean;
  premium?: boolean;
  buttonText: string;
  buttonStyle: string;
}

interface Service {
  name: string;
  basePrice: number;
  urgentPrice: number;
  category: string;
  description: string;
}

const pricingPlans: PricingPlan[] = [
  {
    id: 'basic',
    name: 'Basic Plan',
    price: 299,
    description: 'Perfect for individual document needs',
    features: [
      'Up to 3 documents per month',
      'Basic templates access',
      'Email support',
      'Standard processing (5-7 days)',
      'Basic document verification',
      'Mobile app access'
    ],
    icon: FileText,
    buttonText: 'Get Started',
    buttonStyle: 'bg-gray-600 hover:bg-gray-700'
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 899,
    originalPrice: 1299,
    description: 'Ideal for professionals and small businesses',
    features: [
      'Up to 15 documents per month',
      'Premium templates library',
      'Priority email & chat support',
      'Fast processing (3-5 days)',
      'Advanced document verification',
      'Version control & history',
      'Multi-language support',
      'Lawyer consultation (1 session)',
      'Document tracking & notifications'
    ],
    icon: Zap,
    popular: true,
    buttonText: 'Choose Professional',
    buttonStyle: 'bg-blue-600 hover:bg-blue-700'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 2499,
    originalPrice: 3499,
    description: 'Complete solution for large organizations',
    features: [
      'Unlimited documents',
      'Custom templates & branding',
      '24/7 dedicated support',
      'Express processing (1-2 days)',
      'Premium verification & compliance',
      'Advanced analytics & reporting',
      'Team collaboration tools',
      'Unlimited lawyer consultations',
      'API access & integrations',
      'Custom workflow automation',
      'Priority legal review',
      'Dedicated account manager'
    ],
    icon: Crown,
    premium: true,
    buttonText: 'Contact Sales',
    buttonStyle: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
  }
];

const services: Service[] = [
  { name: 'Property Sale Agreement', basePrice: 799, urgentPrice: 1299, category: 'Property', description: 'Comprehensive property sale documentation' },
  { name: 'Rental Agreement', basePrice: 499, urgentPrice: 799, category: 'Property', description: 'Rental and lease agreements' },
  { name: 'Partnership Deed', basePrice: 1299, urgentPrice: 1999, category: 'Business', description: 'Business partnership documentation' },
  { name: 'Power of Attorney', basePrice: 699, urgentPrice: 1099, category: 'Legal', description: 'Legal power of attorney documents' },
  { name: 'Identity Affidavit', basePrice: 299, urgentPrice: 499, category: 'Personal', description: 'Personal identity verification' },
  { name: 'Employment Contract', basePrice: 899, urgentPrice: 1399, category: 'Business', description: 'Employment and contract documentation' }
];

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [calculatorService, setCalculatorService] = useState(services[0]);
  const [isUrgent, setIsUrgent] = useState(false);

  const getYearlyPrice = (monthlyPrice: number) => Math.floor(monthlyPrice * 12 * 0.8); // 20% discount for yearly

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Choose the perfect plan for your legal documentation needs. 
              All plans include secure processing and verified legal compliance.
            </p>
            
            {/* Billing Toggle */}
            <div className="inline-flex items-center bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl p-1">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-3 rounded-lg font-medium transition-all relative ${
                  billingCycle === 'yearly'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Yearly
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  Save 20%
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              className={`relative bg-white/70 backdrop-blur-sm border rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 ${
                plan.popular 
                  ? 'border-blue-500 scale-105 shadow-blue-100' 
                  : plan.premium 
                    ? 'border-purple-500 shadow-purple-100' 
                    : 'border-white/20'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: plan.popular ? 1.05 : 1.02 }}
            >
              {/* Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              )}
              {plan.premium && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-1">
                  <Crown className="w-4 h-4" />
                  <span>Premium</span>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center ${
                  plan.popular 
                    ? 'bg-blue-100' 
                    : plan.premium 
                      ? 'bg-gradient-to-r from-purple-100 to-indigo-100' 
                      : 'bg-gray-100'
                }`}>
                  <plan.icon className={`w-8 h-8 ${
                    plan.popular 
                      ? 'text-blue-600' 
                      : plan.premium 
                        ? 'text-purple-600' 
                        : 'text-gray-600'
                  }`} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                
                {/* Price */}
                <div className="mb-4">
                  {plan.originalPrice && (
                    <span className="text-lg text-gray-400 line-through mr-2">
                      ₹{billingCycle === 'yearly' ? getYearlyPrice(plan.originalPrice) : plan.originalPrice}
                    </span>
                  )}
                  <span className="text-4xl font-bold text-gray-900">
                    ₹{billingCycle === 'yearly' ? getYearlyPrice(plan.price) : plan.price}
                  </span>
                  <span className="text-gray-600">/{billingCycle === 'yearly' ? 'year' : 'month'}</span>
                </div>
                
                {billingCycle === 'yearly' && plan.originalPrice && (
                  <div className="text-green-600 text-sm font-medium">
                    Save ₹{(plan.originalPrice * 12) - getYearlyPrice(plan.price)} per year
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Button */}
              <button
                className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 ${plan.buttonStyle}`}
              >
                {plan.buttonText}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Service Pricing Calculator */}
        <motion.div
          className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-8 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Service Pricing Calculator</h2>
            <p className="text-gray-600">Calculate the cost for individual document services</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Service Selection */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Select Service</label>
                <div className="space-y-3">
                  {services.map((service) => (
                    <div
                      key={service.name}
                      onClick={() => setCalculatorService(service)}
                      className={`p-4 border rounded-xl cursor-pointer transition-all ${
                        calculatorService.name === service.name
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{service.name}</h4>
                          <p className="text-sm text-gray-600">{service.description}</p>
                          <span className="inline-block mt-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            {service.category}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">₹{service.basePrice}</div>
                          <div className="text-sm text-gray-500">Standard</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Processing Speed */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Processing Speed</label>
                <div className="space-y-3">
                  <div
                    onClick={() => setIsUrgent(false)}
                    className={`p-4 border rounded-xl cursor-pointer transition-all ${
                      !isUrgent
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Standard Processing</h4>
                        <p className="text-sm text-gray-600">5-7 business days</p>
                      </div>
                      <div className="font-semibold text-gray-900">₹{calculatorService.basePrice}</div>
                    </div>
                  </div>
                  <div
                    onClick={() => setIsUrgent(true)}
                    className={`p-4 border rounded-xl cursor-pointer transition-all ${
                      isUrgent
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Urgent Processing</h4>
                        <p className="text-sm text-gray-600">1-2 business days</p>
                      </div>
                      <div className="font-semibold text-gray-900">₹{calculatorService.urgentPrice}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Price Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-700">Service</span>
                  <span className="font-medium">{calculatorService.name}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-700">Processing</span>
                  <span className="font-medium">{isUrgent ? 'Urgent (1-2 days)' : 'Standard (5-7 days)'}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-700">Base Price</span>
                  <span className="font-medium">₹{isUrgent ? calculatorService.urgentPrice : calculatorService.basePrice}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-700">Taxes & Fees</span>
                  <span className="font-medium">₹{Math.floor((isUrgent ? calculatorService.urgentPrice : calculatorService.basePrice) * 0.18)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between py-4 border-t-2 border-gray-300">
                <span className="text-xl font-semibold text-gray-900">Total Amount</span>
                <span className="text-2xl font-bold text-blue-600">
                  ₹{Math.floor((isUrgent ? calculatorService.urgentPrice : calculatorService.basePrice) * 1.18)}
                </span>
              </div>

              <button className="w-full mt-6 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                Proceed with Service
              </button>
            </div>
          </div>
        </motion.div>

        {/* Features Comparison */}
        <motion.div
          className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-8 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our Platform?</h2>
            <p className="text-gray-600">Professional legal documentation with government compliance</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: 'Secure & Verified',
                description: 'Bank-level security with government compliance',
                color: 'text-green-600'
              },
              {
                icon: Clock,
                title: 'Fast Processing',
                description: 'Quick turnaround times with express options',
                color: 'text-blue-600'
              },
              {
                icon: Award,
                title: 'Expert Review',
                description: 'Legal experts review all documents',
                color: 'text-purple-600'
              },
              {
                icon: HeadphonesIcon,
                title: '24/7 Support',
                description: 'Round-the-clock customer assistance',
                color: 'text-orange-600'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-xl flex items-center justify-center">
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600">Get answers to common questions about our pricing and services</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                question: 'Can I upgrade or downgrade my plan?',
                answer: 'Yes, you can change your plan at any time. Changes will be reflected in your next billing cycle.'
              },
              {
                question: 'Is there a refund policy?',
                answer: 'We offer a 30-day money-back guarantee for all subscription plans.'
              },
              {
                question: 'Are the documents legally valid?',
                answer: 'Yes, all documents are reviewed by legal experts and comply with Indian law requirements.'
              },
              {
                question: 'What payment methods do you accept?',
                answer: 'We accept all major credit cards, debit cards, UPI, and net banking.'
              },
              {
                question: 'How secure is my data?',
                answer: 'We use bank-level encryption and comply with all data protection regulations.'
              },
              {
                question: 'Can I get help with complex documents?',
                answer: 'Yes, our legal experts are available for consultation and can help with complex requirements.'
              }
            ].map((faq, index) => (
              <div key={index} className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
