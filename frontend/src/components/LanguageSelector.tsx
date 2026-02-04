// StoreBuddy UAE - Language Selector Component

import React from 'react';
import { useLanguage, languageOptions } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';

interface LanguageSelectorProps {
  variant?: 'dropdown' | 'inline';
  showFlags?: boolean;
  showNativeNames?: boolean;
}

export function LanguageSelector({ 
  variant = 'dropdown',
  showFlags = true,
  showNativeNames = true 
}: LanguageSelectorProps) {
  const { language, setLanguage, isRTL } = useLanguage();
  const [isOpen, setIsOpen] = React.useState(false);
  
  const currentLang = languageOptions.find(l => l.code === language);

  if (variant === 'inline') {
    return (
      <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
        {languageOptions.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code as 'en' | 'ar' | 'hi' | 'ur')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all
              ${language === lang.code 
                ? 'bg-emerald-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            {showFlags && <span className="mr-1">{lang.flag}</span>}
            {showNativeNames ? lang.nativeName : lang.name}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200 
          hover:bg-gray-50 transition-colors shadow-sm ${isRTL ? 'flex-row-reverse' : ''}`}
      >
        <Globe className="w-4 h-4 text-gray-500" />
        {showFlags && currentLang && <span>{currentLang.flag}</span>}
        <span className="text-sm font-medium text-gray-700">
          {currentLang?.nativeName || currentLang?.name}
        </span>
        <svg 
          className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)} 
          />
          
          {/* Dropdown */}
          <div className={`absolute top-full mt-2 w-48 bg-white rounded-xl shadow-lg border 
            border-gray-100 overflow-hidden z-20 ${isRTL ? 'left-0' : 'right-0'}`}>
            {languageOptions.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code as 'en' | 'ar' | 'hi' | 'ur');
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 
                  transition-colors ${isRTL ? 'flex-row-reverse text-right' : ''}
                  ${language === lang.code ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700'}`}
              >
                {showFlags && <span className="text-lg">{lang.flag}</span>}
                <div className={`flex flex-col ${isRTL ? 'items-end' : 'items-start'}`}>
                  <span className="font-medium">{lang.nativeName}</span>
                  {showNativeNames && lang.nativeName !== lang.name && (
                    <span className="text-xs text-gray-500">{lang.name}</span>
                  )}
                </div>
                {language === lang.code && (
                  <svg 
                    className={`w-4 h-4 text-emerald-600 ${isRTL ? 'mr-auto' : 'ml-auto'}`} 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default LanguageSelector;
