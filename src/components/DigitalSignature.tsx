'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  PenTool,
  Upload,
  Download,
  CheckCircle,
  Shield,
  Lock,
  FileText,
  User,
  MapPin,
  Clock,
  Mail,
  AlertCircle,
  Eye,
  X,
  RotateCcw,
  Save,
  Zap,
  Fingerprint,
  ArrowLeft
} from 'lucide-react';

interface SignatureMethod {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string; size?: number | string }>;
  security: 'high' | 'medium' | 'basic';
  timeRequired: string;
  cost: number;
  features: string[];
}

interface Document {
  id: string;
  name: string;
  type: string;
  pages: number;
  size: string;
  uploadDate: Date;
  status: 'pending' | 'signed' | 'notarized';
}

interface SignaturePosition {
  x: number;
  y: number;
  page: number;
  width: number;
  height: number;
}

interface DigitalCertificate {
  id: string;
  issuer: string;
  subject: string;
  validFrom: Date;
  validTo: Date;
  serialNumber: string;
  algorithm: string;
  keySize: number;
}

const signatureMethods: SignatureMethod[] = [
  {
    id: 'draw',
    name: 'Draw Signature',
    description: 'Draw your signature using mouse or touch',
    icon: PenTool,
    security: 'basic',
    timeRequired: '1-2 minutes',
    cost: 0,
    features: ['Quick setup', 'Easy to use', 'Mobile friendly']
  },
  {
    id: 'upload',
    name: 'Upload Signature',
    description: 'Upload an image of your signature',
    icon: Upload,
    security: 'medium',
    timeRequired: '2-3 minutes',
    cost: 0,
    features: ['Professional look', 'Custom signature', 'High quality']
  },
  {
    id: 'digital_certificate',
    name: 'Digital Certificate',
    description: 'Use PKI-based digital certificate for signing',
    icon: Shield,
    security: 'high',
    timeRequired: '5-10 minutes',
    cost: 500,
    features: ['Legally compliant', 'Non-repudiation', 'Bank-grade security']
  },
  {
    id: 'biometric',
    name: 'Biometric Signature',
    description: 'Use fingerprint or face recognition for signing',
    icon: Fingerprint,
    security: 'high',
    timeRequired: '3-5 minutes',
    cost: 200,
    features: ['Unique identity', 'Anti-fraud', 'Instant verification']
  }
];

const mockDocument: Document = {
  id: 'DOC001',
  name: 'Property Sale Agreement.pdf',
  type: 'Property Sale',
  pages: 12,
  size: '2.3 MB',
  uploadDate: new Date(),
  status: 'pending'
};

const mockCertificate: DigitalCertificate = {
  id: 'CERT001',
  issuer: 'Digital India Certificate Authority',
  subject: 'CN=Rajesh Kumar, OU=Individual, O=Digital India',
  validFrom: new Date(2024, 0, 1),
  validTo: new Date(2026, 11, 31),
  serialNumber: '1A2B3C4D5E6F',
  algorithm: 'RSA-SHA256',
  keySize: 2048
};

export default function DigitalSignature() {
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [currentStep, setCurrentStep] = useState(1);
  const [document] = useState<Document>(mockDocument);
  const [signaturePositions, setSignaturePositions] = useState<SignaturePosition[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureData, setSignatureData] = useState<string>('');
  const [uploadedSignature, setUploadedSignature] = useState<string>('');
  const [otpCode, setOtpCode] = useState('');
  const [certificateDetails] = useState<DigitalCertificate>(mockCertificate);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
    setCurrentStep(2);
  };

  const handleDrawStart = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const handleDrawMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const handleDrawEnd = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    setSignatureData(canvas.toDataURL());
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureData('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedSignature(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const addSignaturePosition = (x: number, y: number, page: number) => {
    const newPosition: SignaturePosition = {
      x,
      y,
      page,
      width: 150,
      height: 75
    };
    setSignaturePositions([...signaturePositions, newPosition]);
  };

  const removeSignaturePosition = (index: number) => {
    setSignaturePositions(signaturePositions.filter((_, i) => i !== index));
  };

  const getSecurityColor = (security: string) => {
    switch (security) {
      case 'high': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'basic': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const completeSignature = () => {
    // Simulate signature completion
    setTimeout(() => {
      setCurrentStep(4);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Digital Signature</h1>
              <p className="text-gray-600">Securely sign your documents with legally compliant digital signatures</p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="flex items-center space-x-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg">
                <Shield className="w-4 h-4" />
                <span className="text-sm font-medium">SSL Secured</span>
              </span>
              <span className="flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg">
                <Lock className="w-4 h-4" />
                <span className="text-sm font-medium">256-bit Encryption</span>
              </span>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between">
            {[
              { step: 1, title: 'Select Method', icon: User },
              { step: 2, title: 'Create Signature', icon: PenTool },
              { step: 3, title: 'Position & Verify', icon: Eye },
              { step: 4, title: 'Complete', icon: CheckCircle }
            ].map((item) => (
              <div key={item.step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep >= item.step
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {currentStep > item.step ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <item.icon className="w-5 h-5" />
                  )}
                </div>
                <div className="ml-3">
                  <p className={`font-medium ${
                    currentStep >= item.step ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {item.title}
                  </p>
                </div>
                {item.step < 4 && (
                  <div className={`w-16 h-1 mx-4 ${
                    currentStep > item.step ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Select Signature Method */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6">Choose Signature Method</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {signatureMethods.map((method) => (
                    <motion.button
                      key={method.id}
                      onClick={() => handleMethodSelect(method.id)}
                      className="text-left p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                          <method.icon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-gray-900">{method.name}</h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSecurityColor(method.security)}`}>
                              {method.security}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-3">{method.description}</p>
                          <div className="space-y-1">
                            <div className="flex items-center text-xs text-gray-500">
                              <Clock className="w-3 h-3 mr-1" />
                              <span>{method.timeRequired}</span>
                            </div>
                            <div className="flex items-center text-xs text-gray-500">
                              <span className="font-medium">₹{method.cost}</span>
                              {method.cost === 0 && <span className="ml-1 text-green-600">(Free)</span>}
                            </div>
                          </div>
                          <div className="mt-3">
                            {method.features.map((feature, idx) => (
                              <span key={idx} className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded mr-1 mb-1">
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Create Signature */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Create Your Signature</h2>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                </div>

                {selectedMethod === 'draw' && (
                  <div className="space-y-6">
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 bg-gray-50">
                      <canvas
                        ref={canvasRef}
                        width={600}
                        height={200}
                        className="w-full border border-gray-200 rounded-lg bg-white cursor-crosshair"
                        onMouseDown={handleDrawStart}
                        onMouseMove={handleDrawMove}
                        onMouseUp={handleDrawEnd}
                      />
                      <div className="flex items-center justify-between mt-4">
                        <p className="text-sm text-gray-600">Draw your signature in the box above</p>
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={clearSignature}
                            className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900"
                          >
                            <RotateCcw className="w-4 h-4" />
                            <span>Clear</span>
                          </button>
                          <button
                            onClick={() => setCurrentStep(3)}
                            disabled={!signatureData}
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Save className="w-4 h-4" />
                            <span>Save Signature</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedMethod === 'upload' && (
                  <div className="space-y-6">
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 bg-gray-50 text-center">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      {uploadedSignature ? (
                        <div className="space-y-4">
                          <div className="relative w-full max-w-xs mx-auto h-32">
                            <Image
                              src={uploadedSignature}
                              alt="Uploaded signature"
                              fill
                              className="object-contain"
                            />
                          </div>
                          <div className="flex items-center justify-center space-x-3">
                            <button
                              onClick={() => fileInputRef.current?.click()}
                              className="px-4 py-2 text-gray-600 hover:text-gray-900"
                            >
                              Change
                            </button>
                            <button
                              onClick={() => setCurrentStep(3)}
                              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                              <Save className="w-4 h-4" />
                              <span>Use This Signature</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                          <div>
                            <p className="text-lg font-medium text-gray-900">Upload Signature Image</p>
                            <p className="text-gray-600">Support PNG, JPG files up to 5MB</p>
                          </div>
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                            Choose File
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {selectedMethod === 'digital_certificate' && (
                  <div className="space-y-6">
                    <div className="border border-gray-200 rounded-xl p-6 bg-gradient-to-r from-green-50 to-blue-50">
                      <div className="flex items-center space-x-3 mb-4">
                        <Shield className="w-8 h-8 text-green-600" />
                        <div>
                          <h3 className="font-semibold text-gray-900">Digital Certificate Required</h3>
                          <p className="text-sm text-gray-600">Use your government-issued digital certificate for signing</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowCertificateModal(true)}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        <Shield className="w-4 h-4" />
                        <span>Select Digital Certificate</span>
                      </button>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                      <div className="flex items-start space-x-3">
                        <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-yellow-800">Important Note</h4>
                          <p className="text-sm text-yellow-700 mt-1">
                            Digital certificate signing provides the highest level of security and legal compliance. 
                            This method is recommended for high-value transactions and legal documents.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedMethod === 'biometric' && (
                  <div className="space-y-6">
                    <div className="border border-gray-200 rounded-xl p-6 bg-gradient-to-r from-purple-50 to-blue-50">
                      <div className="flex items-center space-x-3 mb-4">
                        <Fingerprint className="w-8 h-8 text-purple-600" />
                        <div>
                          <h3 className="font-semibold text-gray-900">Biometric Authentication</h3>
                          <p className="text-sm text-gray-600">Use fingerprint or face recognition for secure signing</p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                          <div className="flex items-center space-x-3">
                            <Fingerprint className="w-5 h-5 text-purple-600" />
                            <span className="font-medium">Fingerprint Authentication</span>
                          </div>
                          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                            Scan Fingerprint
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                          <div className="flex items-center space-x-3">
                            <User className="w-5 h-5 text-blue-600" />
                            <span className="font-medium">Face Recognition</span>
                          </div>
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Scan Face
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <div className="flex items-start space-x-3">
                        <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-800">Secure & Private</h4>
                          <p className="text-sm text-blue-700 mt-1">
                            Your biometric data is processed locally and never stored on our servers. 
                            This ensures maximum privacy and security for your personal information.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 3: Position Signature */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Position Your Signature</h2>
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Eye className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-blue-900">Click on the document to place your signature</span>
                    </div>
                    <span className="text-sm text-blue-700">{signaturePositions.length} signature(s) placed</span>
                  </div>

                  {/* Document Preview */}
                  <div className="border border-gray-200 rounded-xl bg-white p-4">
                    <div className="relative">
                      <div 
                        className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center cursor-crosshair"
                        onClick={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const x = e.clientX - rect.left;
                          const y = e.clientY - rect.top;
                          addSignaturePosition(x, y, 1);
                        }}
                      >
                        <div className="text-center">
                          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-600 font-medium">{document.name}</p>
                          <p className="text-sm text-gray-500">Page 1 of {document.pages}</p>
                        </div>
                      </div>

                      {/* Signature Positions */}
                      {signaturePositions.map((position, index) => (
                        <div
                          key={index}
                          className="absolute border-2 border-blue-500 bg-blue-100 bg-opacity-50 rounded"
                          style={{
                            left: position.x,
                            top: position.y,
                            width: position.width,
                            height: position.height
                          }}
                        >
                          <div className="flex items-center justify-between p-1">
                            <span className="text-xs font-medium text-blue-700">Signature {index + 1}</span>
                            <button
                              onClick={() => removeSignaturePosition(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-600">
                        {signaturePositions.length > 0 ? 'Signatures positioned successfully' : 'Click on document to add signature'}
                      </span>
                    </div>
                    <button
                      onClick={completeSignature}
                      disabled={signaturePositions.length === 0}
                      className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Zap className="w-4 h-4" />
                      <span>Sign Document</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Completion */}
            {currentStep === 4 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6"
              >
                <div className="text-center space-y-6">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Document Signed Successfully!</h2>
                    <p className="text-gray-600">Your document has been digitally signed and is now legally binding.</p>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center space-x-3">
                      <Shield className="w-5 h-5 text-green-600" />
                      <div className="text-left">
                        <p className="font-medium text-green-800">Signature Certificate Generated</p>
                        <p className="text-sm text-green-700">Certificate ID: SIGN-{Date.now()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center space-x-4">
                    <button className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      <Download className="w-4 h-4" />
                      <span>Download Signed Document</span>
                    </button>
                    <button className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                      <Mail className="w-4 h-4" />
                      <span>Email Document</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Document Info */}
            <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Document Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{document.name}</p>
                    <p className="text-sm text-gray-600">{document.type}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Pages:</span>
                  <span className="font-medium">{document.pages}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Size:</span>
                  <span className="font-medium">{document.size}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Status:</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    document.status === 'signed' ? 'bg-green-100 text-green-700' :
                    document.status === 'notarized' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {document.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Security Features */}
            <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Security Features</h3>
              <div className="space-y-3">
                {[
                  { icon: Shield, text: 'Bank-grade encryption' },
                  { icon: Lock, text: 'Tamper-proof signatures' },
                  { icon: Clock, text: 'Timestamp verification' },
                  { icon: MapPin, text: 'Location tracking' },
                  { icon: Fingerprint, text: 'Biometric validation' }
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <feature.icon className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-700">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Help */}
            <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Need Help?</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                  📋 Signature Guidelines
                </button>
                <button className="w-full text-left p-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                  🔒 Security Information
                </button>
                <button className="w-full text-left p-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                  📞 Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Certificate Modal */}
        <AnimatePresence>
          {showCertificateModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-6 max-w-md w-full"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Digital Certificate</h3>
                  <button
                    onClick={() => setShowCertificateModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3 mb-3">
                      <Shield className="w-6 h-6 text-green-600" />
                      <div>
                        <p className="font-medium text-gray-900">Valid Certificate Found</p>
                        <p className="text-sm text-gray-600">Digital India CA</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subject:</span>
                        <span className="font-medium">Rajesh Kumar</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Valid Until:</span>
                        <span className="font-medium">{certificateDetails.validTo.toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Algorithm:</span>
                        <span className="font-medium">{certificateDetails.algorithm}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Enter OTP sent to your registered mobile
                      </label>
                      <input
                        type="text"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        placeholder="Enter 6-digit OTP"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        maxLength={6}
                      />
                    </div>

                    <button
                      onClick={() => {
                        setShowCertificateModal(false);
                        setCurrentStep(3);
                      }}
                      disabled={otpCode.length !== 6}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Verify & Continue
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
