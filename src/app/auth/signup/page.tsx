"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  User, 
  FileText, 
  Mail, 
  Phone, 
  CreditCard, 
  MapPin, 
  Upload, 
  X, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Shield,
  Eye,
  EyeOff,
  Check,
  Lock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface FileUploadBoxProps {
  fileType: string;
  uploadedFile: File | null;
  onUpload: (fileType: string, file: File) => void;
  onRemove: (fileType: string) => void;
  acceptedTypes: string;
  description: string;
  required?: boolean;
}

// File Upload Component
const FileUploadBox = ({ fileType, uploadedFile, onUpload, onRemove, acceptedTypes, description, required = false }: FileUploadBoxProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndUploadFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      validateAndUploadFile(files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateAndUploadFile = (file: File) => {
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    // Validate file type
    const allowedTypes = acceptedTypes.split(',').map(type => type.trim());
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!allowedTypes.includes(fileExtension)) {
      alert(`Invalid file type. Allowed types: ${acceptedTypes}`);
      return;
    }

    setUploading(true);
    // Simulate upload delay for better UX
    setTimeout(() => {
      onUpload(fileType, file);
      setUploading(false);
    }, 500);
  };

  return (
    <div 
      className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 ${
        dragActive
          ? 'border-blue-500 bg-blue-50'
          : uploadedFile 
          ? 'border-green-300 bg-green-50' 
          : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/30'
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      {uploadedFile ? (
        <motion.div 
          className="space-y-3"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-center space-x-2">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <span className="text-sm font-medium text-gray-700 truncate max-w-48">{uploadedFile.name}</span>
          </div>
          <div className="text-xs text-gray-500">
            {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
          </div>
          <button
            type="button"
            onClick={() => onRemove(fileType)}
            className="inline-flex items-center px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 mr-1" />
            Remove
          </button>
        </motion.div>
      ) : uploading ? (
        <div className="space-y-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-blue-600 font-medium">Uploading...</p>
        </div>
      ) : (
        <div className="space-y-3">
          <Upload className="w-8 h-8 text-gray-400 mx-auto" />
          <div>
            <label htmlFor={`file-${fileType}`} className="cursor-pointer">
              <span className="text-blue-600 hover:text-blue-700 font-medium">
                Click to upload
              </span>
              <span className="text-gray-500"> or drag and drop</span>
            </label>
            <input
              id={`file-${fileType}`}
              type="file"
              className="hidden"
              accept={acceptedTypes}
              onChange={handleFileChange}
            />
          </div>
          <p className="text-xs text-gray-500">{description}</p>
          {required && <span className="text-xs text-red-500 font-medium">Required</span>}
        </div>
      )}
    </div>
  );
};

// Password Strength Indicator
const PasswordStrength = ({ password }: { password: string }) => {
  const requirements = [
    { text: "At least 8 characters", test: password.length >= 8 },
    { text: "Contains uppercase letter", test: /[A-Z]/.test(password) },
    { text: "Contains lowercase letter", test: /[a-z]/.test(password) },
    { text: "Contains number", test: /\d/.test(password) },
    { text: "Contains special character", test: /[!@#$%^&*(),.?":{}|<>]/.test(password) }
  ];

  const strength = requirements.filter(req => req.test).length;
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-green-600'];
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center space-x-2">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${strengthColors[strength - 1] || 'bg-gray-200'}`}
            style={{ width: `${(strength / 5) * 100}%` }}
          />
        </div>
        <span className="text-xs font-medium text-gray-600">
          {strength > 0 ? strengthLabels[strength - 1] : 'Enter password'}
        </span>
      </div>
      <div className="space-y-1">
        {requirements.map((req, index) => (
          <div key={index} className="flex items-center space-x-2 text-xs">
            <Check className={`w-3 h-3 ${req.test ? 'text-green-500' : 'text-gray-300'}`} />
            <span className={req.test ? 'text-green-600' : 'text-gray-500'}>{req.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function SignUp() {
  const [currentStep, setCurrentStep] = useState(1);
  const [role, setRole] = useState<"client" | "lawyer">("client");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    aadhaarNumber: "",
    panNumber: "",
    address: "",
    specialization: ""
  });
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File | null>>({
    idCard: null,
    aadhaarCard: null,
    panCard: null,
    profilePhoto: null
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [timeoutWarning, setTimeoutWarning] = useState(false);

  const { signUp } = useAuth();
  const router = useRouter();

  const totalSteps = 4;

  // Auto-save form progress
  useEffect(() => {
    const savedData = localStorage.getItem('signup-progress');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(parsed.formData || {
          name: "",
          email: "",
          phone: "",
          aadhaarNumber: "",
          panNumber: "",
          address: "",
          specialization: ""
        });
        setCurrentStep(parsed.currentStep || 1);
        setRole(parsed.role || 'client');
      } catch (error) {
        console.error('Failed to load saved progress:', error);
      }
    }
  }, []); // Empty dependency array is correct here

  useEffect(() => {
    // Save progress whenever form data changes
    const progressData = {
      formData,
      currentStep,
      role,
      timestamp: Date.now()
    };
    localStorage.setItem('signup-progress', JSON.stringify(progressData));
  }, [formData, currentStep, role]);

  // Session timeout warning (15 minutes of inactivity)
  useEffect(() => {
    const timeoutDuration = 15 * 60 * 1000; // 15 minutes
    const warningDuration = 13 * 60 * 1000; // Show warning at 13 minutes

    const warningTimer = setTimeout(() => {
      setTimeoutWarning(true);
    }, warningDuration);

    const expireTimer = setTimeout(() => {
      localStorage.removeItem('signup-progress');
      alert('Session expired due to inactivity. Please start over.');
      window.location.reload();
    }, timeoutDuration);

    return () => {
      clearTimeout(warningTimer);
      clearTimeout(expireTimer);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    let { value } = e.target;
    
    // Format specific fields
    if (name === 'aadhaarNumber') {
      // Remove all non-digits and limit to 12 digits
      value = value.replace(/\D/g, '').slice(0, 12);
      // Add spaces for readability: XXXX XXXX XXXX format, but only if we have digits
      if (value.length > 8) {
        value = value.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3');
      } else if (value.length > 4) {
        value = value.replace(/(\d{4})(\d{4})/, '$1 $2');
      }
    } else if (name === 'panNumber') {
      // Convert to uppercase and limit format
      value = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
    } else if (name === 'phone') {
      // Remove non-digits except + at start
      value = value.replace(/[^\d+]/g, '');
      if (value.startsWith('+91')) {
        value = value.slice(0, 13); // +91 + 10 digits
      } else if (value.length > 10) {
        value = value.slice(0, 10);
      }
    }
    
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileUpload = (fileType: string, file: File) => {
    setUploadedFiles({
      ...uploadedFiles,
      [fileType]: file
    });
  };

  const removeFile = (fileType: string) => {
    setUploadedFiles({
      ...uploadedFiles,
      [fileType]: null
    });
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return true; // Role selection is always valid
      case 2:
        // Enhanced validation for step 2
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[+]?[1-9][\d\s\-()]{8,15}$/;
        
        return formData.name.trim().length >= 2 && 
               emailRegex.test(formData.email.trim()) && 
               phoneRegex.test(formData.phone.trim()) &&
               password.length >= 8 &&
               password === confirmPassword;
      case 3:
        // Enhanced validation for step 3
        const aadhaarRegex = /^\d{12}$/;
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        
        const aadhaarClean = formData.aadhaarNumber.replace(/\s/g, '');
        const aadhaarValid = aadhaarClean.length === 12 && aadhaarRegex.test(aadhaarClean);
        const panValid = formData.panNumber.trim().length === 10 && panRegex.test(formData.panNumber.trim().toUpperCase());
        const addressValid = formData.address.trim().length >= 10;
        const specializationValid = role !== "lawyer" || formData.specialization.trim().length >= 3;
        
        // Debug logging
        console.log('Step 3 Validation:', {
          aadhaarNumber: formData.aadhaarNumber,
          aadhaarClean,
          aadhaarValid,
          panNumber: formData.panNumber,
          panValid,
          addressLength: formData.address.trim().length,
          addressValid,
          role,
          specialization: formData.specialization,
          specializationValid,
          overall: addressValid && aadhaarValid && panValid && specializationValid
        });
        
        return addressValid && aadhaarValid && panValid && specializationValid;
      case 4:
        return uploadedFiles.idCard !== null &&
               uploadedFiles.aadhaarCard !== null &&
               uploadedFiles.panCard !== null &&
               acceptTerms &&
               acceptPrivacy;
      default:
        return false;
    }
  };

  const getValidationError = (step: number): string => {
    switch (step) {
      case 2:
        if (formData.name.trim().length < 2) return "Name must be at least 2 characters";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) return "Please enter a valid email address";
        if (!/^[+]?[1-9][\d\s\-()]{8,15}$/.test(formData.phone.trim())) return "Please enter a valid phone number";
        if (password.length < 8) return "Password must be at least 8 characters";
        if (password !== confirmPassword) return "Passwords do not match";
        break;
      case 3:
        const aadhaarNumber = formData.aadhaarNumber.replace(/\s/g, '');
        const panNumber = formData.panNumber.trim().toUpperCase();
        
        if (formData.address.trim().length < 10) return "Address must be at least 10 characters";
        if (aadhaarNumber.length !== 12 || !/^\d{12}$/.test(aadhaarNumber)) return "Aadhaar number must be exactly 12 digits";
        if (panNumber.length !== 10 || !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber)) return "PAN number format is invalid (e.g., ABCDE1234F)";
        if (role === "lawyer" && formData.specialization.trim().length < 3) return "Specialization must be at least 3 characters";
        break;
      case 4:
        if (!uploadedFiles.idCard) return "Government ID card is required";
        if (!uploadedFiles.aadhaarCard) return "Aadhaar card is required";
        if (!uploadedFiles.panCard) return "PAN card is required";
        if (!acceptTerms) return "You must accept the Terms of Service";
        if (!acceptPrivacy) return "You must accept the Privacy Policy";
        break;
    }
    return "Please fill in all required fields correctly";
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
      setError("");
    } else {
      setError(getValidationError(currentStep));
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateStep(4)) {
      setError("Please complete all required steps");
      return;
    }

    setLoading(true);

    try {
      // File uploads are now working after storage bucket setup
      const uploadPromises = [];
      const fileUploads: Record<string, string> = {};

      if (uploadedFiles.idCard) {
        const formDataUpload = new FormData();
        formDataUpload.append('file', uploadedFiles.idCard);
        formDataUpload.append('uploadType', 'identity');
        uploadPromises.push(
          fetch('/api/upload', {
            method: 'POST',
            body: formDataUpload
          }).then(async (res) => {
            if (res.ok) {
              const data = await res.json();
              fileUploads.idCard = data.file.file_url;
            }
          }).catch(err => {
            console.error('File upload error:', err);
            // Continue even if file upload fails
          })
        );
      }

      if (uploadedFiles.aadhaarCard) {
        const formDataUpload = new FormData();
        formDataUpload.append('file', uploadedFiles.aadhaarCard);
        formDataUpload.append('uploadType', 'identity');
        uploadPromises.push(
          fetch('/api/upload', {
            method: 'POST',
            body: formDataUpload
          }).then(async (res) => {
            if (res.ok) {
              const data = await res.json();
              fileUploads.aadhaarCard = data.file.file_url;
            }
          }).catch(err => {
            console.error('File upload error:', err);
            // Continue even if file upload fails
          })
        );
      }

      if (uploadedFiles.panCard) {
        const formDataUpload = new FormData();
        formDataUpload.append('file', uploadedFiles.panCard);
        formDataUpload.append('uploadType', 'identity');
        uploadPromises.push(
          fetch('/api/upload', {
            method: 'POST',
            body: formDataUpload
          }).then(async (res) => {
            if (res.ok) {
              const data = await res.json();
              fileUploads.panCard = data.file.file_url;
            }
          }).catch(err => {
            console.error('File upload error:', err);
            // Continue even if file upload fails
          })
        );
      }

      // Wait for all uploads to complete (with error handling)
      try {
        await Promise.all(uploadPromises);
        console.log('File uploads completed:', fileUploads);
      } catch (uploadError) {
        console.error('Some file uploads failed:', uploadError);
        // Continue with signup even if some uploads fail
      }

      const signUpResult = await signUp(formData.email, password, {
        email: formData.email,
        name: formData.name,
        phone: formData.phone,
        role,
        aadhaar_number: formData.aadhaarNumber,
        pan_number: formData.panNumber,
        address: formData.address,
        specialization: role === "lawyer" ? formData.specialization : undefined,
        is_verified: false,
      });

      if (signUpResult.error) {
        setError(signUpResult.error);
      } else if (signUpResult.success) {
        setSuccess(signUpResult.success);
        
        // Clear saved progress on successful signup
        localStorage.removeItem('signup-progress');
        
        // Send welcome email (re-enabled after setup)
        try {
          await fetch('/api/send-notification', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'welcome',
              clientEmail: formData.email,
              clientName: formData.name,
              role: role
            })
          });
          console.log('Welcome email sent successfully');
        } catch (emailError) {
          console.error('Failed to send welcome email:', emailError);
          // Don't fail signup if email fails
        }
        
        setTimeout(() => {
          router.push("/auth/login");
        }, 3000);
      } else {
        setSuccess("Registration successful! Please check your email to verify your account.");
        
        // Clear saved progress on successful signup
        localStorage.removeItem('signup-progress');
        
        // Send welcome email (re-enabled after setup)
        try {
          await fetch('/api/send-notification', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'welcome',
              clientEmail: formData.email,
              clientName: formData.name,
              role: role
            })
          });
          console.log('Welcome email sent successfully');
        } catch (emailError) {
          console.error('Failed to send welcome email:', emailError);
          // Don't fail signup if email fails
        }
        
        setTimeout(() => {
          router.push("/auth/login");
        }, 3000);
      }
    } catch (err: unknown) {
      console.error('Signup error:', err)
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const stepTitles = [
    "Choose Your Role",
    "Personal Information", 
    "Identity Verification",
    "Document Upload"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-2xl w-full space-y-8"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <motion.div 
          className="text-center"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Link href="/" className="flex items-center justify-center mb-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-white/60 backdrop-blur-sm rounded-2xl p-3 shadow-lg"
            >
              <Image
                src="/logo-with-name.png"
                alt="Notary Platform Logo"
                width={200}
                height={60}
                className="h-16 w-auto drop-shadow-lg"
              />
            </motion.div>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h1>
          <p className="text-gray-800">Join thousands of users who trust our notary services</p>
        </motion.div>

        {/* Progress Indicator */}
        <motion.div 
          className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                  step < currentStep 
                    ? 'bg-green-500 text-white' 
                    : step === currentStep 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step < currentStep ? <Check className="w-5 h-5" /> : step}
                </div>
                {step < 4 && (
                  <div className={`w-full h-1 mx-4 transition-all duration-300 ${
                    step < currentStep ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800">{stepTitles[currentStep - 1]}</h3>
            <p className="text-sm text-gray-800">Step {currentStep} of {totalSteps}</p>
          </div>
        </motion.div>

        {/* Form Content */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {/* Error & Success Messages */}
          <AnimatePresence>
            {timeoutWarning && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-xl flex items-center justify-between mb-6"
              >
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                  <span>Session will expire soon. Complete registration to save your progress.</span>
                </div>
                <button 
                  onClick={() => setTimeoutWarning(false)}
                  className="text-yellow-600 hover:text-yellow-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center mb-6"
              >
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                {error}
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center mb-6"
              >
                <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                {success}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {/* Step 1: Role Selection */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -50, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">What brings you here?</h2>
                    <p className="text-gray-800">Choose the option that best describes you</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.button
                      type="button"
                      onClick={() => setRole("client")}
                      className={`p-8 border-2 rounded-2xl text-center transition-all duration-300 ${
                        role === "client"
                          ? "border-blue-500 bg-blue-50 text-blue-700 shadow-lg ring-2 ring-blue-200"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                      whileHover={{ scale: 1.02, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <User className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                      <div className="font-semibold text-xl mb-2">I&apos;m a Client</div>
                      <div className="text-sm text-gray-800 mb-4">I need documents notarized and legal services</div>
                      <div className="flex flex-wrap gap-2 justify-center">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">Document Notarization</span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">Legal Consultation</span>
                      </div>
                    </motion.button>

                    <motion.button
                      type="button"
                      onClick={() => setRole("lawyer")}
                      className={`p-8 border-2 rounded-2xl text-center transition-all duration-300 ${
                        role === "lawyer"
                          ? "border-purple-500 bg-purple-50 text-purple-700 shadow-lg ring-2 ring-purple-200"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                      whileHover={{ scale: 1.02, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FileText className="w-12 h-12 mx-auto mb-4 text-purple-600" />
                      <div className="font-semibold text-xl mb-2">I&apos;m a Lawyer</div>
                      <div className="text-sm text-gray-800 mb-4">I provide notary and legal services</div>
                      <div className="flex flex-wrap gap-2 justify-center">
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">Notary Services</span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">Legal Practice</span>
                      </div>
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Personal Information */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -50, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Personal Information</h2>
                    <p className="text-gray-800">Let&apos;s get to know you better</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="+91 XXXXX XXXXX"
                          inputMode="tel"
                          autoComplete="tel"
                          required
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Create a strong password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {password && <PasswordStrength password={password} />}
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                          confirmPassword && password !== confirmPassword 
                            ? 'border-red-300 bg-red-50' 
                            : 'border-gray-300'
                        }`}
                        placeholder="Confirm your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {confirmPassword && password !== confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Identity Verification */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -50, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <Shield className="w-12 h-12 mx-auto text-blue-600 mb-3" />
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Identity Verification</h2>
                    <p className="text-gray-800">Help us verify your identity for security</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Aadhaar Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Aadhaar Number * 
                        <span className="text-xs text-gray-500 ml-1">(12 digits only)</span>
                      </label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          name="aadhaarNumber"
                          value={formData.aadhaarNumber}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                            formData.aadhaarNumber && formData.aadhaarNumber.replace(/\s/g, '').length === 12 
                              ? 'border-green-300 bg-green-50' 
                              : formData.aadhaarNumber 
                              ? 'border-red-300 bg-red-50' 
                              : 'border-gray-300'
                          }`}
                          placeholder="XXXX XXXX XXXX"
                          maxLength={14}
                          inputMode="numeric"
                          autoComplete="off"
                          required
                        />
                        {formData.aadhaarNumber.replace(/\s/g, '').length === 12 && (
                          <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5" />
                        )}
                      </div>
                      {formData.aadhaarNumber && formData.aadhaarNumber.replace(/\s/g, '').length !== 12 && (
                        <p className="text-red-500 text-xs mt-1">
                          Aadhaar must be exactly 12 digits ({formData.aadhaarNumber.replace(/\s/g, '').length}/12)
                        </p>
                      )}
                    </div>

                    {/* PAN Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        PAN Number * 
                        <span className="text-xs text-gray-500 ml-1">(ABCDE1234F format)</span>
                      </label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          name="panNumber"
                          value={formData.panNumber}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                            formData.panNumber && /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber.trim().toUpperCase()) 
                              ? 'border-green-300 bg-green-50' 
                              : formData.panNumber 
                              ? 'border-red-300 bg-red-50' 
                              : 'border-gray-300'
                          }`}
                          placeholder="ABCDE1234F"
                          maxLength={10}
                          autoComplete="off"
                          style={{ textTransform: 'uppercase' }}
                          required
                        />
                        {formData.panNumber && /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber.trim().toUpperCase()) && (
                          <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5" />
                        )}
                      </div>
                      {formData.panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber.trim().toUpperCase()) && (
                        <p className="text-red-500 text-xs mt-1">
                          PAN format: 5 letters + 4 numbers + 1 letter (e.g., ABCDE1234F)
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Complete Address * 
                      <span className="text-xs text-gray-500 ml-1">(minimum 10 characters)</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows={3}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                          formData.address && formData.address.trim().length >= 10 
                            ? 'border-green-300 bg-green-50' 
                            : formData.address 
                            ? 'border-red-300 bg-red-50' 
                            : 'border-gray-300'
                        }`}
                        placeholder="Enter your complete address with pincode"
                        required
                      />
                      {formData.address.trim().length >= 10 && (
                        <CheckCircle className="absolute right-3 top-3 text-green-500 w-5 h-5" />
                      )}
                    </div>
                    {formData.address && formData.address.trim().length < 10 && (
                      <p className="text-red-500 text-xs mt-1">
                        Address must be at least 10 characters ({formData.address.trim().length}/10)
                      </p>
                    )}
                  </div>

                  {/* Lawyer Specialization */}
                  {role === "lawyer" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Specialization * 
                        <span className="text-xs text-gray-500 ml-1">(minimum 3 characters)</span>
                      </label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          name="specialization"
                          value={formData.specialization}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                            formData.specialization && formData.specialization.trim().length >= 3 
                              ? 'border-green-300 bg-green-50' 
                              : formData.specialization 
                              ? 'border-red-300 bg-red-50' 
                              : 'border-gray-300'
                          }`}
                          placeholder="e.g., Civil Law, Criminal Law, Corporate Law"
                          required
                        />
                        {formData.specialization.trim().length >= 3 && (
                          <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5" />
                        )}
                      </div>
                      {formData.specialization && formData.specialization.trim().length < 3 && (
                        <p className="text-red-500 text-xs mt-1">
                          Specialization must be at least 3 characters ({formData.specialization.trim().length}/3)
                        </p>
                      )}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Step 4: Document Upload */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -50, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <Upload className="w-12 h-12 mx-auto text-blue-600 mb-3" />
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Document Upload</h2>
                    <p className="text-gray-800">Upload your identity documents for verification</p>
                  </div>

                  <div className="space-y-6">
                    {/* Government ID */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Government ID Card *</label>
                      <FileUploadBox
                        fileType="idCard"
                        uploadedFile={uploadedFiles.idCard}
                        onUpload={handleFileUpload}
                        onRemove={removeFile}
                        acceptedTypes=".pdf,.jpg,.jpeg,.png"
                        description="Upload your government-issued ID (Driving License, Passport, Voter ID, etc.)"
                        required={true}
                      />
                    </div>

                    {/* Aadhaar Card */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Aadhaar Card *</label>
                      <FileUploadBox
                        fileType="aadhaarCard"
                        uploadedFile={uploadedFiles.aadhaarCard}
                        onUpload={handleFileUpload}
                        onRemove={removeFile}
                        acceptedTypes=".pdf,.jpg,.jpeg,.png"
                        description="Upload your Aadhaar card (front and back)"
                        required={true}
                      />
                    </div>

                    {/* PAN Card */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">PAN Card *</label>
                      <FileUploadBox
                        fileType="panCard"
                        uploadedFile={uploadedFiles.panCard}
                        onUpload={handleFileUpload}
                        onRemove={removeFile}
                        acceptedTypes=".pdf,.jpg,.jpeg,.png"
                        description="Upload your PAN card"
                        required={true}
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                      <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">Security Notice</p>
                        <p>Your documents are encrypted and stored securely. We use industry-standard security measures to protect your personal information.</p>
                      </div>
                    </div>
                  </div>

                  {/* Terms and Privacy Acceptance */}
                  <div className="space-y-4 pt-4 border-t border-gray-200">
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id="acceptTerms"
                        checked={acceptTerms}
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                        className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        required
                      />
                      <label htmlFor="acceptTerms" className="text-sm text-gray-700">
                        I agree to the{" "}
                        <Link href="/terms" target="_blank" className="text-blue-600 hover:text-blue-700 underline">
                          Terms of Service
                        </Link>{" "}
                        and acknowledge that I have read and understood them. *
                      </label>
                    </div>

                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id="acceptPrivacy"
                        checked={acceptPrivacy}
                        onChange={(e) => setAcceptPrivacy(e.target.checked)}
                        className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        required
                      />
                      <label htmlFor="acceptPrivacy" className="text-sm text-gray-700">
                        I agree to the{" "}
                        <Link href="/privacy" target="_blank" className="text-blue-600 hover:text-blue-700 underline">
                          Privacy Policy
                        </Link>{" "}
                        and consent to the processing of my personal data. *
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              {currentStep > 1 ? (
                <motion.button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
                  whileHover={{ x: -4 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back
                </motion.button>
              ) : (
                <div />
              )}

              {currentStep < totalSteps ? (
                <motion.button
                  type="button"
                  onClick={nextStep}
                  disabled={!validateStep(currentStep)}
                  className={`flex items-center px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    validateStep(currentStep)
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  whileHover={validateStep(currentStep) ? { scale: 1.02, x: 4 } : {}}
                  whileTap={validateStep(currentStep) ? { scale: 0.95 } : {}}
                >
                  Continue
                  <ArrowRight className="w-5 h-5 ml-2" />
                </motion.button>
              ) : (
                <motion.button
                  type="submit"
                  disabled={loading || !validateStep(currentStep)}
                  className={`flex items-center px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl ${
                    loading || !validateStep(currentStep)
                      ? 'bg-gray-400 cursor-not-allowed text-white' 
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                  }`}
                  whileHover={!loading && validateStep(currentStep) ? { scale: 1.02 } : {}}
                  whileTap={!loading && validateStep(currentStep) ? { scale: 0.95 } : {}}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <CheckCircle className="w-5 h-5 ml-2" />
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </form>

          {/* Login Link */}
          <motion.div 
            className="text-center mt-6 pt-6 border-t border-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            <p className="text-gray-800">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
                Sign in here
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
