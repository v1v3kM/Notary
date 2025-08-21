'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  Wallet,
  Building2,
  Smartphone,
  Shield,
  CheckCircle,
  Lock,
  ArrowLeft,
  Calendar,
  User,
  CreditCard as CardIcon,
  Zap,
  Clock,
  Download,
  Receipt,
  Star,
  TrendingUp
} from 'lucide-react';
import { razorpayService } from '@/lib/razorpay';
import { useAuth } from '@/contexts/AuthContext';

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string; size?: number | string }>;
  description: string;
  processingTime: string;
  fees: string;
  popular?: boolean;
  discount?: string;
}

interface PaymentSummary {
  serviceType: string;
  baseAmount: number;
  gstAmount: number;
  convenienceFee: number;
  discount: number;
  totalAmount: number;
}

interface Transaction {
  id: string;
  date: string;
  service: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  paymentMethod: string;
  transactionId: string;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'upi',
    name: 'UPI',
    icon: Smartphone,
    description: 'Pay instantly using any UPI app',
    processingTime: 'Instant',
    fees: 'Free',
    popular: true,
    discount: '2% cashback'
  },
  {
    id: 'card',
    name: 'Credit/Debit Card',
    icon: CreditCard,
    description: 'Visa, Mastercard, RuPay accepted',
    processingTime: 'Instant',
    fees: '1.5% + GST'
  },
  {
    id: 'netbanking',
    name: 'Net Banking',
    icon: Building2,
    description: 'Pay using your bank account',
    processingTime: 'Instant',
    fees: 'Free'
  },
  {
    id: 'wallet',
    name: 'Digital Wallet',
    icon: Wallet,
    description: 'Paytm, PhonePe, Google Pay',
    processingTime: 'Instant',
    fees: 'Free',
    discount: '1% cashback'
  }
];

const mockTransactions: Transaction[] = [
  {
    id: 'TXN001',
    date: '2024-01-15',
    service: 'Property Document Notarization',
    amount: 850,
    status: 'completed',
    paymentMethod: 'UPI',
    transactionId: 'UPI123456789'
  },
  {
    id: 'TXN002',
    date: '2024-01-10',
    service: 'Legal Document Verification',
    amount: 500,
    status: 'completed',
    paymentMethod: 'Credit Card',
    transactionId: 'CC987654321'
  },
  {
    id: 'TXN003',
    date: '2024-01-05',
    service: 'Affidavit Notarization',
    amount: 300,
    status: 'pending',
    paymentMethod: 'Net Banking',
    transactionId: 'NB456789123'
  }
];

export default function PaymentProcessing() {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<'summary' | 'method' | 'details' | 'processing' | 'success'>('summary');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [activeTab, setActiveTab] = useState<'pay' | 'history' | 'analytics'>('pay');

  const paymentSummary: PaymentSummary = {
    serviceType: 'Property Document Notarization',
    baseAmount: 750,
    gstAmount: 135,
    convenienceFee: 25,
    discount: 60,
    totalAmount: 850
  };

  const handlePayment = async () => {
    if (!selectedMethod) {
      alert('Please select a payment method');
      return;
    }

    try {
      setCurrentStep('processing');

      // Create order with Razorpay
      const orderData = {
        amount: paymentSummary.totalAmount * 100, // Convert to paise
        currency: 'INR',
        receipt: `NOTARY_${Date.now()}`,
        notes: {
          service: paymentSummary.serviceType,
          method: selectedMethod.id
        }
      };

      const order = await razorpayService.createOrder(orderData);

      // Process payment with Razorpay
      const paymentResponse = await razorpayService.processPayment({
        amount: order.amount,
        currency: order.currency,
        name: 'NotaryPro',
        description: paymentSummary.serviceType,
        order_id: order.id,
        prefill: {
          name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User',
          email: user?.email || 'user@example.com',
          contact: user?.user_metadata?.phone || user?.phone || '9999999999'
        },
        theme: {
          color: '#2563eb'
        }
      });

      // Verify payment
      const isVerified = await razorpayService.verifyPayment(paymentResponse);

      if (isVerified) {
        // Save payment to database
        const paymentRecord = {
          user_id: user?.id,
          amount: paymentSummary.totalAmount,
          currency: 'INR',
          service_type: paymentSummary.serviceType,
          payment_method: selectedMethod.id,
          razorpay_order_id: order.id,
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          status: 'completed',
          created_at: new Date().toISOString()
        };
        
        // Note: In production, save to Supabase or your database
        console.log('Payment record to save:', paymentRecord);
        setCurrentStep('success');
      } else {
        alert('Payment verification failed');
        setCurrentStep('method');
      }
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
      setCurrentStep('method');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const renderPaymentSummary = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Payment Summary</h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Service</span>
            <span className="font-medium text-gray-900">{paymentSummary.serviceType}</span>
          </div>
          
          <div className="border-t border-gray-200 pt-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Base Amount</span>
              <span className="text-gray-900">₹{paymentSummary.baseAmount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">GST (18%)</span>
              <span className="text-gray-900">₹{paymentSummary.gstAmount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Convenience Fee</span>
              <span className="text-gray-900">₹{paymentSummary.convenienceFee}</span>
            </div>
            <div className="flex justify-between items-center text-green-600">
              <span>Discount Applied</span>
              <span>-₹{paymentSummary.discount}</span>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span className="text-gray-900">Total Amount</span>
              <span className="text-blue-600">₹{paymentSummary.totalAmount}</span>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => setCurrentStep('method')}
          className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Proceed to Payment
        </button>
      </div>

      {/* Security Features */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <Shield className="w-4 h-4 text-green-600" />
          </div>
          <h4 className="font-medium text-green-900">Secure Payment</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-green-700">
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4" />
            <span>256-bit SSL Encryption</span>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span>PCI DSS Compliant</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4" />
            <span>Money Back Guarantee</span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderPaymentMethods = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={() => setCurrentStep('summary')}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Choose Payment Method</h3>
          <p className="text-gray-600">Select your preferred payment option</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paymentMethods.map((method) => (
          <motion.button
            key={method.id}
            onClick={() => setSelectedMethod(method)}
            className={`relative border-2 rounded-xl p-6 text-left transition-all ${
              selectedMethod?.id === method.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {method.popular && (
              <div className="absolute -top-2 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                Most Popular
              </div>
            )}
            
            <div className="flex items-center space-x-4 mb-3">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <method.icon className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{method.name}</h4>
                <p className="text-sm text-gray-600">{method.description}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Processing Time</span>
                <div className="font-medium text-gray-900">{method.processingTime}</div>
              </div>
              <div>
                <span className="text-gray-500">Fees</span>
                <div className="font-medium text-gray-900">{method.fees}</div>
              </div>
            </div>
            
            {method.discount && (
              <div className="mt-3 bg-green-100 text-green-700 px-3 py-2 rounded-lg text-sm font-medium">
                {method.discount}
              </div>
            )}
          </motion.button>
        ))}
      </div>

      {selectedMethod && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-200 rounded-xl p-6"
        >
          <h4 className="font-semibold text-gray-900 mb-4">Payment Details</h4>
          
          {selectedMethod.id === 'card' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <CardIcon className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cardholder Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <User className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <Calendar className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}
          
          {selectedMethod.id === 'upi' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                UPI ID
              </label>
              <input
                type="text"
                placeholder="yourname@upi"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}
          
          <button
            onClick={handlePayment}
            className="w-full mt-6 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center space-x-2"
          >
            <Lock className="w-4 h-4" />
            <span>Pay ₹{paymentSummary.totalAmount}</span>
          </button>
        </motion.div>
      )}
    </motion.div>
  );

  const renderProcessing = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-12"
    >
      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Zap className="w-10 h-10 text-blue-600" />
        </motion.div>
      </div>
      <h3 className="text-2xl font-semibold text-gray-900 mb-4">Processing Payment</h3>
      <p className="text-gray-600 mb-8">Please wait while we securely process your payment...</p>
      <div className="w-64 bg-gray-200 rounded-full h-2 mx-auto">
        <motion.div
          className="bg-blue-600 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 3 }}
        ></motion.div>
      </div>
    </motion.div>
  );

  const renderSuccess = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12"
    >
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10 text-green-600" />
      </div>
      <h3 className="text-2xl font-semibold text-gray-900 mb-4">Payment Successful!</h3>
      <p className="text-gray-600 mb-8">Your payment has been processed successfully</p>
      
      <div className="bg-white border border-gray-200 rounded-xl p-6 max-w-md mx-auto mb-8">
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Transaction ID</span>
            <span className="font-medium">TXN123456789</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Amount Paid</span>
            <span className="font-medium">₹{paymentSummary.totalAmount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Payment Method</span>
            <span className="font-medium">{selectedMethod?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date & Time</span>
            <span className="font-medium">{new Date().toLocaleString()}</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2 mx-auto">
          <Download className="w-4 h-4" />
          <span>Download Receipt</span>
        </button>
        <button 
          onClick={() => {
            setCurrentStep('summary');
            setSelectedMethod(null);
          }}
          className="block bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium mx-auto"
        >
          Make Another Payment
        </button>
      </div>
    </motion.div>
  );

  const renderPaymentHistory = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Payment History</h3>
          <p className="text-gray-600">Track all your transactions</p>
        </div>
        <button className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors font-medium flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Export</span>
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Service</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Amount</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Method</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="py-4 px-4 text-sm text-gray-900">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900">{transaction.service}</td>
                  <td className="py-4 px-4 text-sm font-medium text-gray-900">₹{transaction.amount}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">{transaction.paymentMethod}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      <Receipt className="w-4 h-4 inline mr-1" />
                      Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900">Payment Analytics</h3>
        <p className="text-gray-600">Insights into your spending patterns</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Total Spent', value: '₹2,150', icon: TrendingUp, color: 'blue' },
          { title: 'This Month', value: '₹850', icon: Calendar, color: 'green' },
          { title: 'Avg. Transaction', value: '₹717', icon: Star, color: 'purple' }
        ].map((stat, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 bg-${stat.color}-100 rounded-xl flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Monthly Spending</h4>
        <div className="space-y-4">
          {['Jan', 'Feb', 'Mar', 'Apr', 'May'].map((month) => {
            const amount = Math.floor(Math.random() * 1000) + 200;
            const percentage = (amount / 1200) * 100;
            
            return (
              <div key={month} className="flex items-center space-x-4">
                <div className="w-12 text-sm text-gray-600">{month}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className="w-16 text-sm font-medium text-gray-900 text-right">₹{amount}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Payment Center</h1>
              <p className="text-gray-600 mt-2">Secure and fast payment processing</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                <Shield className="w-4 h-4 inline mr-1" />
                Bank Grade Security
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-8 max-w-md">
          {[
            { id: 'pay', label: 'Make Payment', icon: CreditCard },
            { id: 'history', label: 'History', icon: Clock },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'pay' | 'history' | 'analytics')}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {activeTab === 'pay' && (
                <motion.div
                  key="pay"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  {currentStep === 'summary' && renderPaymentSummary()}
                  {currentStep === 'method' && renderPaymentMethods()}
                  {currentStep === 'processing' && renderProcessing()}
                  {currentStep === 'success' && renderSuccess()}
                </motion.div>
              )}
              
              {activeTab === 'history' && (
                <motion.div
                  key="history"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  {renderPaymentHistory()}
                </motion.div>
              )}
              
              {activeTab === 'analytics' && (
                <motion.div
                  key="analytics"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  {renderAnalytics()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left bg-blue-50 hover:bg-blue-100 p-3 rounded-lg transition-colors">
                  <div className="font-medium text-blue-900">Request Refund</div>
                  <div className="text-sm text-blue-700">Get help with failed payments</div>
                </button>
                <button className="w-full text-left bg-gray-50 hover:bg-gray-100 p-3 rounded-lg transition-colors">
                  <div className="font-medium text-gray-900">Payment Support</div>
                  <div className="text-sm text-gray-600">Contact our payment team</div>
                </button>
                <button className="w-full text-left bg-gray-50 hover:bg-gray-100 p-3 rounded-lg transition-colors">
                  <div className="font-medium text-gray-900">Download Invoice</div>
                  <div className="text-sm text-gray-600">Get tax invoices</div>
                </button>
              </div>
            </div>

            {/* Payment Tips */}
            <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Payment Tips</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Use UPI for instant payments with cashback</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Keep your payment details secure</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Check for discount offers before paying</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Save receipts for tax purposes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
