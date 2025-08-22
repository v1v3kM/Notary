'use client';

import { useState, createContext, useContext, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Languages, Globe, Check } from 'lucide-react';

type Language = 'en' | 'hi' | 'bn' | 'te' | 'ta' | 'gu' | 'mr' | 'kn';

interface Translation {
  [key: string]: string | Translation;
}

interface Translations {
  [key: string]: Translation;
}

const translations: Translations = {
  en: {
    common: {
      welcome: 'Welcome',
      dashboard: 'Dashboard',
      documents: 'Documents',
      templates: 'Templates',
      profile: 'Profile',
      settings: 'Settings',
      logout: 'Sign Out',
      loading: 'Loading...',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      download: 'Download',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      language: 'Language',
      selectLanguage: 'Select Language'
    },
    navigation: {
      home: 'Home',
      about: 'About',
      services: 'Services',
      help: 'Help',
      contact: 'Contact',
      login: 'Sign In',
      signup: 'Get Started'
    },
    dashboard: {
      welcome: 'Welcome back',
      totalDocuments: 'Total Documents',
      completedDocuments: 'Completed',
      pendingDocuments: 'In Progress',
      totalSpent: 'Total Spent',
      recentActivity: 'Recent Activity',
      popularTemplates: 'Popular Templates',
      newDocument: 'New Document',
      browseTemplates: 'Browse Templates',
      contactSupport: 'Contact Support'
    },
    templates: {
      title: 'Document Templates',
      subtitle: 'Choose from our professionally crafted legal document templates',
      searchPlaceholder: 'Search templates...',
      categories: 'Categories',
      allCategories: 'All Categories',
      property: 'Property',
      business: 'Business',
      personal: 'Personal',
      legal: 'Legal',
      sortBy: 'Sort by',
      popularity: 'Popularity',
      priceHigh: 'Price: High to Low',
      priceLow: 'Price: Low to High',
      newest: 'Newest First',
      useTemplate: 'Use Template',
      preview: 'Preview',
      popular: 'Popular',
      rating: 'Rating',
      uses: 'uses'
    },
    documents: {
      title: 'My Documents',
      searchPlaceholder: 'Search documents...',
      allStatus: 'All Status',
      pending: 'Pending',
      inProgress: 'In Progress',
      completed: 'Completed',
      rejected: 'Rejected',
      noDocuments: 'No documents found',
      noDocumentsDescription: 'Try adjusting your search or filter criteria',
      createNew: 'Create New Document',
      progress: 'Progress',
      created: 'Created',
      lawyer: 'Lawyer'
    }
  },
  hi: {
    common: {
      welcome: 'स्वागत है',
      dashboard: 'डैशबोर्ड',
      documents: 'दस्तावेज़',
      templates: 'टेम्प्लेट',
      profile: 'प्रोफ़ाइल',
      settings: 'सेटिंग्स',
      logout: 'साइन आउट',
      loading: 'लोड हो रहा है...',
      save: 'सेव करें',
      cancel: 'रद्द करें',
      delete: 'हटाएं',
      edit: 'संपादित करें',
      view: 'देखें',
      download: 'डाउनलोड',
      search: 'खोजें',
      filter: 'फ़िल्टर',
      sort: 'सॉर्ट',
      language: 'भाषा',
      selectLanguage: 'भाषा चुनें'
    },
    navigation: {
      home: 'होम',
      about: 'परिचय',
      services: 'सेवाएं',
      help: 'सहायता',
      contact: 'संपर्क',
      login: 'साइन इन',
      signup: 'शुरू करें'
    },
    dashboard: {
      welcome: 'वापसी पर स्वागत है',
      totalDocuments: 'कुल दस्तावेज़',
      completedDocuments: 'पूर्ण',
      pendingDocuments: 'प्रगति में',
      totalSpent: 'कुल खर्च',
      recentActivity: 'हाल की गतिविधि',
      popularTemplates: 'लोकप्रिय टेम्प्लेट',
      newDocument: 'नया दस्तावेज़',
      browseTemplates: 'टेम्प्लेट ब्राउज़ करें',
      contactSupport: 'सहायता संपर्क'
    },
    templates: {
      title: 'दस्तावेज़ टेम्प्लेट',
      subtitle: 'हमारे पेशेवर रूप से तैयार कानूनी दस्तावेज़ टेम्प्लेट में से चुनें',
      searchPlaceholder: 'टेम्प्लेट खोजें...',
      categories: 'श्रेणियां',
      allCategories: 'सभी श्रेणियां',
      property: 'संपत्ति',
      business: 'व्यापार',
      personal: 'व्यक्तिगत',
      legal: 'कानूनी',
      sortBy: 'सॉर्ट करें',
      popularity: 'लोकप्रियता',
      priceHigh: 'मूल्य: अधिक से कम',
      priceLow: 'मूल्य: कम से अधिक',
      newest: 'नवीनतम पहले',
      useTemplate: 'टेम्प्लेट उपयोग करें',
      preview: 'पूर्वावलोकन',
      popular: 'लोकप्रिय',
      rating: 'रेटिंग',
      uses: 'उपयोग'
    },
    documents: {
      title: 'मेरे दस्तावेज़',
      searchPlaceholder: 'दस्तावेज़ खोजें...',
      allStatus: 'सभी स्थिति',
      pending: 'लंबित',
      inProgress: 'प्रगति में',
      completed: 'पूर्ण',
      rejected: 'अस्वीकृत',
      noDocuments: 'कोई दस्तावेज़ नहीं मिला',
      noDocumentsDescription: 'अपनी खोज या फ़िल्टर मापदंड समायोजित करने का प्रयास करें',
      createNew: 'नया दस्तावेज़ बनाएं',
      progress: 'प्रगति',
      created: 'बनाया गया',
      lawyer: 'वकील'
    }
  }
};

const languages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' }
];

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  availableLanguages: typeof languages;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: Translation | string = translations[currentLanguage];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k] as Translation | string;
      } else {
        // Fallback to English if translation not found
        value = translations.en;
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey] as Translation | string;
          } else {
            return key; // Return key if no translation found
          }
        }
        break;
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  const setLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
    // In a real app, you'd also save this to localStorage or user preferences
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred-language', lang);
    }
  };

  return (
    <LanguageContext.Provider value={{ 
      currentLanguage, 
      setLanguage, 
      t, 
      availableLanguages: languages 
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

interface LanguageSelectorProps {
  className?: string;
  showFullNames?: boolean;
}

export function LanguageSelector({ className = '', showFullNames = false }: LanguageSelectorProps) {
  const { currentLanguage, setLanguage, availableLanguages, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = availableLanguages.find(lang => lang.code === currentLanguage);

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:border-blue-500 transition-colors"
        title={t('common.selectLanguage')}
      >
        <Globe className="w-4 h-4 text-gray-600" />
        {showFullNames ? (
          <span className="text-sm font-medium text-gray-700">
            {currentLang?.nativeName}
          </span>
        ) : (
          <span className="text-sm font-medium text-gray-700 uppercase">
            {currentLanguage}
          </span>
        )}
        <Languages className="w-4 h-4 text-gray-400" />
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-lg shadow-xl z-50 min-w-[200px]"
        >
          <div className="py-2">
            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase border-b border-gray-100">
              {t('common.selectLanguage')}
            </div>
            {availableLanguages.map((language) => (
              <button
                key={language.code}
                onClick={() => {
                  setLanguage(language.code as Language);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-blue-50 transition-colors ${
                  currentLanguage === language.code
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700'
                }`}
              >
                <div className="flex flex-col items-start">
                  <span className="font-medium">{language.nativeName}</span>
                  <span className="text-xs text-gray-500">{language.name}</span>
                </div>
                {currentLanguage === language.code && (
                  <Check className="w-4 h-4 text-blue-600" />
                )}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Hook for easy translation access
export function useTranslation() {
  const { t } = useLanguage();
  return { t };
}
