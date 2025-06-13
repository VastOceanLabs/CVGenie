import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, Sparkles, BookOpen, ArrowLeft, ArrowRight, Globe, Lightbulb, Target, Search, GripVertical, X, Award, Star, TrendingUp, Users } from 'lucide-react';

// TypeScript interfaces
interface Language {
  id: string;
  name: string;
  proficiency: 'basic' | 'conversational' | 'professional' | 'fluent' | 'native';
  certification?: string;
  certificationDate?: string;
  isNative: boolean;
  businessLevel: boolean;
  yearsUsed?: string;
  lastUsed?: string;
  writingLevel: 'basic' | 'conversational' | 'professional' | 'fluent' | 'native';
  speakingLevel: 'basic' | 'conversational' | 'professional' | 'fluent' | 'native';
  readingLevel: 'basic' | 'conversational' | 'professional' | 'fluent' | 'native';
}

interface ComponentProps {
  resumeData: { languages: Language[] };
  updateResumeData: (section: string, data: Language[]) => void;
  addArrayItem: (section: string, item: Language) => void;
  removeArrayItem: (section: string, index: number) => void;
  updateArrayItem: (section: string, index: number, data: Partial<Language>) => void;
  setShowPhraseLibrary: (show: boolean) => void;
  goToNextStep: () => void;
  goToPrevStep: () => void;
  currentStep: number;
  totalSteps: number;
}

// Language proficiency levels with accessibility-friendly indicators
const proficiencyLevels = {
  basic: { 
    label: 'Basic', 
    description: 'Limited working proficiency - basic conversation',
    color: 'bg-gray-100 text-gray-700',
    icon: '🟡',
    atsWeight: 1
  },
  conversational: { 
    label: 'Conversational', 
    description: 'Can communicate effectively in most situations',
    color: 'bg-blue-100 text-blue-700',
    icon: '🔵',
    atsWeight: 2
  },
  professional: { 
    label: 'Professional', 
    description: 'Full working proficiency in business contexts',
    color: 'bg-green-100 text-green-700',
    icon: '🟢',
    atsWeight: 3
  },
  fluent: { 
    label: 'Fluent', 
    description: 'Near-native proficiency with excellent command',
    color: 'bg-purple-100 text-purple-700',
    icon: '🟣',
    atsWeight: 4
  },
  native: { 
    label: 'Native', 
    description: 'Native or bilingual proficiency',
    color: 'bg-yellow-100 text-yellow-700',
    icon: '⭐',
    atsWeight: 5
  }
};

// Popular world languages with normalized names
const popularLanguages = {
  global: [
    'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian',
    'Chinese (Mandarin)', 'Japanese', 'Korean', 'Arabic', 'Hindi', 'Dutch',
    'Swedish', 'Norwegian', 'Danish', 'Polish', 'Czech', 'Hungarian'
  ],
  business: [
    'English', 'Chinese (Mandarin)', 'Spanish', 'French', 'German', 'Japanese',
    'Portuguese', 'Russian', 'Arabic', 'Korean', 'Italian', 'Dutch'
  ],
  tech: [
    'English', 'Chinese (Mandarin)', 'Japanese', 'German', 'French', 'Korean',
    'Russian', 'Spanish', 'Hebrew', 'Swedish', 'Dutch', 'Italian'
  ],
  european: [
    'English', 'German', 'French', 'Spanish', 'Italian', 'Dutch', 'Portuguese',
    'Polish', 'Russian', 'Swedish', 'Norwegian', 'Danish', 'Czech', 'Hungarian',
    'Romanian', 'Greek', 'Croatian', 'Finnish', 'Estonian', 'Latvian', 'Lithuanian'
  ],
  asian: [
    'Chinese (Mandarin)', 'Japanese', 'Korean', 'Hindi', 'Arabic', 'Thai',
    'Vietnamese', 'Indonesian', 'Malay', 'Filipino', 'Bengali', 'Urdu',
    'Persian', 'Hebrew', 'Turkish', 'Mongolian', 'Burmese', 'Khmer'
  ],
  americas: [
    'English', 'Spanish', 'Portuguese', 'French', 'Chinese (Mandarin)',
    'German', 'Italian', 'Russian', 'Japanese', 'Korean', 'Arabic'
  ]
};

// Language certifications and tests
const languageCertifications = {
  'English': ['TOEFL', 'IELTS', 'Cambridge English', 'TOEIC', 'CELTA', 'DELTA'],
  'Spanish': ['DELE', 'SIELE', 'CELU', 'OPI', 'ACTFL'],
  'French': ['DELF', 'DALF', 'TCF', 'TEF', 'DFP'],
  'German': ['TestDaF', 'DSH', 'Goethe Certificate', 'telc', 'OSD'],
  'Italian': ['CILS', 'CELI', 'PLIDA', 'IT'],
  'Portuguese': ['CELPE-Bras', 'CAPLE', 'DIPLE'],
  'Chinese (Mandarin)': ['HSK', 'TOCFL', 'BCT', 'YCT'],
  'Japanese': ['JLPT', 'BJT', 'J.TEST', 'NAT-TEST'],
  'Korean': ['TOPIK', 'KLPT', 'OPIc'],
  'Arabic': ['ALPT', 'ACTFL OPI', 'CIMA'],
  'Russian': ['TORFL', 'ACTFL OPI'],
  'Dutch': ['CNaVT', 'NT2']
};

// Industry-specific language importance
const industryLanguageValue = {
  'Software Engineer': {
    high: ['English', 'Chinese (Mandarin)', 'Japanese', 'German'],
    medium: ['Korean', 'French', 'Russian', 'Spanish'],
    growing: ['Hebrew', 'Swedish', 'Dutch']
  },
  'Marketing Manager': {
    high: ['English', 'Spanish', 'French', 'German', 'Chinese (Mandarin)'],
    medium: ['Portuguese', 'Japanese', 'Italian', 'Dutch'],
    growing: ['Korean', 'Arabic', 'Russian']
  },
  'Sales Representative': {
    high: ['English', 'Spanish', 'French', 'German'],
    medium: ['Portuguese', 'Italian', 'Chinese (Mandarin)', 'Japanese'],
    growing: ['Arabic', 'Korean', 'Russian', 'Dutch']
  },
  'Project Manager': {
    high: ['English', 'German', 'French', 'Spanish'],
    medium: ['Chinese (Mandarin)', 'Japanese', 'Portuguese', 'Dutch'],
    growing: ['Korean', 'Arabic', 'Russian', 'Italian']
  },
  'Nurse': {
    high: ['English', 'Spanish', 'French'],
    medium: ['German', 'Arabic', 'Chinese (Mandarin)', 'Portuguese'],
    growing: ['Korean', 'Japanese', 'Russian', 'Italian']
  },
  'Electrician': {
    high: ['English', 'Spanish'],
    medium: ['French', 'German', 'Portuguese'],
    growing: ['Arabic', 'Chinese (Mandarin)', 'Italian']
  }
};

// Language name normalization function
const normalizeLanguageName = (name: string): string => {
  const normalized = name.toLowerCase().trim();
  // Handle common variations
  if (normalized.includes('mandarin') || normalized.includes('chinese')) return 'Chinese (Mandarin)';
  if (normalized.includes('cantonese')) return 'Chinese (Cantonese)';
  return name.trim();
};

// Generate unique ID for new languages
const generateLanguageId = (): string => {
  return `lang_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export default function LanguagesSection({ 
  resumeData = { languages: [] }, 
  updateResumeData = () => {}, 
  addArrayItem = () => {}, 
  removeArrayItem = () => {}, 
  updateArrayItem = () => {},
  setShowPhraseLibrary = () => {},
  goToNextStep = () => {},
  goToPrevStep = () => {},
  currentStep = 0,
  totalSteps = 1
}: ComponentProps) {
  const [activeCategory, setActiveCategory] = useState('global');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showLanguageHelper, setShowLanguageHelper] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [atsAnalysis, setAtsAnalysis] = useState({ score: 0, missing: [], found: [], marketValue: [] });

  // Get user's job title with memoization
  const userJobTitle = useMemo(() => {
    return (resumeData as any)?.personalInfo?.jobTitle || 'Software Engineer';
  }, [(resumeData as any)?.personalInfo?.jobTitle]);

  // Memoized industry data
  const industryData = useMemo(() => {
    return industryLanguageValue[userJobTitle] || industryLanguageValue['Software Engineer'];
  }, [userJobTitle]);

  // Analyze languages for ATS and market value
  const analyzeLanguagesATS = useCallback(() => {
    const userLanguages = (resumeData?.languages || [])
      .map(lang => lang.name?.toLowerCase())
      .filter(name => name && name.length > 0); // Filter out empty/undefined names
    
    const relevantLanguages = [
      ...industryData.high,
      ...industryData.medium,
      ...industryData.growing
    ].map(lang => normalizeLanguageName(lang).toLowerCase());

    const foundLanguages = relevantLanguages.filter(lang => 
      userLanguages.some(userLang => {
        if (!userLang) return false; // Safety check
        const normalizedUserLang = normalizeLanguageName(userLang);
        const normalizedLang = normalizeLanguageName(lang);
        return normalizedUserLang.includes(normalizedLang) || normalizedLang.includes(normalizedUserLang);
      })
    );
    
    const missingHighValue = industryData.high.filter(lang => 
      !userLanguages.some(userLang => {
        if (!userLang) return false;
        const normalizedUserLang = normalizeLanguageName(userLang);
        const normalizedLang = normalizeLanguageName(lang);
        return normalizedUserLang.includes(normalizedLang) || normalizedLang.includes(normalizedUserLang);
      })
    ).slice(0, 4);

    // Calculate market value based on proficiency and language importance
    const marketValue = (resumeData?.languages || []).map(lang => {
      if (!lang.name) return null; // Safety check
      
      const normalizedName = normalizeLanguageName(lang.name);
      const importance = industryData.high.some(h => normalizeLanguageName(h) === normalizedName) ? 'high' :
                        industryData.medium.some(m => normalizeLanguageName(m) === normalizedName) ? 'medium' :
                        industryData.growing.some(g => normalizeLanguageName(g) === normalizedName) ? 'growing' : 'standard';
      
      const proficiencyWeight = proficiencyLevels[lang.proficiency]?.atsWeight || 1;
      const importanceMultiplier = importance === 'high' ? 5 : importance === 'medium' ? 3 : 
                                  importance === 'growing' ? 4 : 1; // No minimum floor for irrelevant languages
      
      return {
        language: lang.name,
        importance,
        marketScore: importanceMultiplier * proficiencyWeight,
        certified: lang.certification ? 1.5 : 1
      };
    }).filter(Boolean); // Remove null entries

    // Calculate overall ATS score - more realistic scoring
    const totalPossibleValue = industryData.high.length * 5;
    const userValue = foundLanguages.reduce((acc, _) => acc + 3, 0); // Base value per relevant language
    const bonusValue = (resumeData?.languages || []).reduce((acc, lang) => {
      const proficiencyBonus = proficiencyLevels[lang.proficiency]?.atsWeight || 0;
      const certificationBonus = lang.certification ? 2 : 0;
      return acc + proficiencyBonus + certificationBonus;
    }, 0);

    const score = totalPossibleValue > 0 ? 
      Math.min(100, Math.round(((userValue + bonusValue) / totalPossibleValue) * 100)) : 0;

    setAtsAnalysis({
      score,
      found: foundLanguages,
      missing: missingHighValue,
      marketValue: marketValue.sort((a, b) => b.marketScore - a.marketScore)
    });
  }, [resumeData?.languages, industryData]);

  // Memoized callbacks to prevent re-renders
  const addLanguage = useCallback((languageName = '', proficiency: keyof typeof proficiencyLevels = 'conversational') => {
    const newLanguage: Language = {
      id: generateLanguageId(),
      name: languageName,
      proficiency: proficiency,
      certification: '',
      certificationDate: '',
      isNative: false,
      businessLevel: false,
      yearsUsed: '',
      lastUsed: '',
      writingLevel: proficiency,
      speakingLevel: proficiency,
      readingLevel: proficiency
    };
    addArrayItem('languages', newLanguage);
  }, [addArrayItem]);

  const addSuggestionLanguage = useCallback((languageName: string) => {
    addLanguage(languageName, 'conversational');
    setShowSuggestions(false);
  }, [addLanguage]);

  const updateLanguage = useCallback((index: number, updates: Partial<Language>) => {
    // If setting as native, update proficiency levels
    if (updates.isNative === true) {
      updates = {
        ...updates,
        proficiency: 'native',
        writingLevel: 'native',
        speakingLevel: 'native',
        readingLevel: 'native'
      };
    }
    
    updateArrayItem('languages', index, updates);
  }, [updateArrayItem]);

  const removeLanguage = useCallback((index: number) => {
    removeArrayItem('languages', index);
  }, [removeArrayItem]);

  // Memoized filtered suggestions
  const filteredSuggestions = useMemo(() => {
    const currentLanguageNames = (resumeData?.languages || [])
      .map(lang => normalizeLanguageName(lang.name || '').toLowerCase())
      .filter(name => name.length > 0);
    
    const categoryLanguages = popularLanguages[activeCategory] || popularLanguages.global;
    
    let suggestions = categoryLanguages.filter(lang => 
      !currentLanguageNames.includes(normalizeLanguageName(lang).toLowerCase()) &&
      (!searchTerm || normalizeLanguageName(lang).toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    return suggestions.slice(0, 12);
  }, [resumeData?.languages, activeCategory, searchTerm]);

  // Drag and drop handlers with stable key support
  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const languages = resumeData?.languages || [];
    const newLanguages = [...languages];
    const draggedItem = newLanguages[draggedIndex];
    newLanguages.splice(draggedIndex, 1);
    newLanguages.splice(dropIndex, 0, draggedItem);
    
    updateResumeData('languages', newLanguages);
    setDraggedIndex(null);
    // Trigger ATS analysis after reordering
    setTimeout(() => analyzeLanguagesATS(), 100);
  }, [draggedIndex, resumeData?.languages, updateResumeData, analyzeLanguagesATS]);

  // Effect to run ATS analysis when languages change
  useEffect(() => {
    analyzeLanguagesATS();
  }, [analyzeLanguagesATS]);

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Languages</h3>
          <p className="text-sm text-gray-600 mt-1">
            Add languages to showcase your global communication abilities and cultural awareness
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowLanguageHelper(!showLanguageHelper)}
            className="flex items-center space-x-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm"
            aria-label="Show language helper tips"
          >
            <Lightbulb className="w-4 h-4" />
            <span>Language Helper</span>
          </button>
          <button
            onClick={() => setShowPhraseLibrary(true)}
            className="flex items-center space-x-2 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-sm"
            aria-label="Open phrase library"
          >
            <BookOpen className="w-4 h-4" />
            <span>Phrase Library</span>
          </button>
        </div>
      </div>

      {/* ATS Analysis Panel */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4" role="region" aria-label="Language market value analysis">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-blue-900 flex items-center">
            <Target className="w-4 h-4 mr-2" />
            Language Market Value Score: {atsAnalysis.score}%
          </h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-blue-700 font-medium mb-1">
              <span className="text-green-600">✓</span> High-Value Languages ({atsAnalysis.found.length}):
            </p>
            <p className="text-blue-600">
              {atsAnalysis.found.length > 0 ? `${atsAnalysis.found.slice(0, 2).join(', ')}${atsAnalysis.found.length > 2 ? '...' : ''}` : 'Add valuable languages'}
            </p>
          </div>
          <div>
            <p className="text-orange-700 font-medium mb-1">
              <span className="text-orange-600">⚠</span> Consider Adding for {userJobTitle}:
            </p>
            <p className="text-orange-600">
              {atsAnalysis.missing.slice(0, 2).join(', ')}
              {atsAnalysis.missing.length > 2 && '...'}
            </p>
          </div>
          <div>
            <p className="text-green-700 font-medium mb-1">
              <span className="text-green-600">💼</span> Your Top Language Assets:
            </p>
            <p className="text-green-600">
              {atsAnalysis.marketValue.slice(0, 2).map(mv => mv.language).join(', ') || 'Add languages'}
            </p>
          </div>
        </div>

        {/* Industry-specific insights */}
        <div className="mt-3 pt-3 border-t border-blue-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
            <div>
              <span className="font-medium text-blue-800">🔥 High Priority:</span>
              <span className="text-blue-600 ml-1">{industryData.high.slice(0, 2).join(', ')}</span>
            </div>
            <div>
              <span className="font-medium text-blue-800">📊 Medium Value:</span>
              <span className="text-blue-600 ml-1">{industryData.medium.slice(0, 2).join(', ')}</span>
            </div>
            <div>
              <span className="font-medium text-blue-800">📈 Growing Demand:</span>
              <span className="text-blue-600 ml-1">{industryData.growing.slice(0, 2).join(', ')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Language Helper */}
      {showLanguageHelper && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4" role="region" aria-label="Language section guidance">
          <h5 className="font-medium text-green-900 mb-3">
            🌍 Language Section Best Practices:
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-green-800 mb-2">What to Include:</p>
              <ul className="text-green-700 space-y-1">
                <li>• Languages relevant to your target market</li>
                <li>• Business-level languages prominently</li>
                <li>• Official certifications when available</li>
                <li>• Native/heritage languages</li>
                <li>• Programming languages (if relevant)</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-green-800 mb-2">Pro Tips:</p>
              <ul className="text-green-700 space-y-1">
                <li>• Be honest about proficiency levels</li>
                <li>• Highlight business communication ability</li>
                <li>• Include years of use for context</li>
                <li>• Mention recent certifications</li>
                <li>• Order by business relevance</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Add Language Button */}
      <button
        onClick={() => addLanguage()}
        className="w-full flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors min-h-[44px]"
        aria-label="Add new language"
      >
        <Plus className="w-5 h-5 text-gray-500" />
        <span className="text-gray-600 font-medium">Add Language</span>
      </button>

      {/* Languages List */}
      <div className="space-y-3">
        {(resumeData?.languages || []).map((language, index) => (
          <div 
            key={language.id || `language-${index}`} // Use stable ID
            className={`bg-white border border-gray-200 rounded-lg p-4 ${
              draggedIndex === index ? 'opacity-50' : ''
            }`}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
          >
            <div className="space-y-4">
              {/* Main Language Info */}
              <div className="flex items-center space-x-4">
                <GripVertical className="w-4 h-4 text-gray-400 cursor-move" aria-label="Drag to reorder" />
                
                {/* Language Name */}
                <div className="flex-1">
                  <label htmlFor={`language-name-${index}`} className="sr-only">Language name</label>
                  <input
                    id={`language-name-${index}`}
                    type="text"
                    value={language?.name || ''}
                    onChange={(e) => updateLanguage(index, { name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[44px]"
                    placeholder="e.g., Spanish, French, Mandarin Chinese"
                    aria-label="Language name"
                  />
                </div>

                {/* Overall Proficiency */}
                <div className="w-40">
                  <label htmlFor={`proficiency-${index}`} className="sr-only">Overall proficiency level</label>
                  <select
                    id={`proficiency-${index}`}
                    value={language?.proficiency || 'conversational'}
                    onChange={(e) => updateLanguage(index, { proficiency: e.target.value as keyof typeof proficiencyLevels })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm min-h-[44px]"
                    aria-label="Overall proficiency level"
                  >
                    {Object.entries(proficiencyLevels).map(([value, config]) => (
                      <option key={value} value={value}>{config.icon} {config.label}</option>
                    ))}
                  </select>
                </div>

                {/* Native Speaker Toggle */}
                <div className="flex items-center space-x-2 min-h-[44px]">
                  <label htmlFor={`native-${index}`} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      id={`native-${index}`}
                      type="checkbox"
                      checked={language?.isNative || false}
                      onChange={(e) => updateLanguage(index, { isNative: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    <span className="text-xs text-gray-600">Native</span>
                  </label>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeLanguage(index)}
                  className="text-red-600 hover:text-red-700 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label={`Remove ${language?.name || 'language'}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Detailed Skills Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor={`speaking-${index}`} className="block text-xs font-medium text-gray-700 mb-1">Speaking</label>
                  <select
                    id={`speaking-${index}`}
                    value={language?.speakingLevel || language?.proficiency || 'conversational'}
                    onChange={(e) => updateLanguage(index, { speakingLevel: e.target.value as keyof typeof proficiencyLevels })}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                    aria-label="Speaking proficiency level"
                  >
                    {Object.entries(proficiencyLevels).map(([value, config]) => (
                      <option key={value} value={value}>{config.icon} {config.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor={`writing-${index}`} className="block text-xs font-medium text-gray-700 mb-1">Writing</label>
                  <select
                    id={`writing-${index}`}
                    value={language?.writingLevel || language?.proficiency || 'conversational'}
                    onChange={(e) => updateLanguage(index, { writingLevel: e.target.value as keyof typeof proficiencyLevels })}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                    aria-label="Writing proficiency level"
                  >
                    {Object.entries(proficiencyLevels).map(([value, config]) => (
                      <option key={value} value={value}>{config.icon} {config.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor={`reading-${index}`} className="block text-xs font-medium text-gray-700 mb-1">Reading</label>
                  <select
                    id={`reading-${index}`}
                    value={language?.readingLevel || language?.proficiency || 'conversational'}
                    onChange={(e) => updateLanguage(index, { readingLevel: e.target.value as keyof typeof proficiencyLevels })}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                    aria-label="Reading proficiency level"
                  >
                    {Object.entries(proficiencyLevels).map(([value, config]) => (
                      <option key={value} value={value}>{config.icon} {config.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Certifications and Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor={`certification-${index}`} className="block text-xs font-medium text-gray-700 mb-1">Certification</label>
                  <select
                    id={`certification-${index}`}
                    value={language?.certification || ''}
                    onChange={(e) => updateLanguage(index, { certification: e.target.value })}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                    aria-label="Language certification"
                  >
                    <option value="">No certification</option>
                    {(languageCertifications[language?.name || ''] || []).map(cert => (
                      <option key={cert} value={cert}>{cert}</option>
                    ))}
                    <option value="other">Other certification</option>
                  </select>
                </div>
                <div>
                  <label htmlFor={`years-used-${index}`} className="block text-xs font-medium text-gray-700 mb-1">Years Used</label>
                  <input
                    id={`years-used-${index}`}
                    type="text"
                    value={language?.yearsUsed || ''}
                    onChange={(e) => updateLanguage(index, { yearsUsed: e.target.value })}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                    placeholder="e.g., 5+ years"
                    aria-label="Years of language use"
                  />
                </div>
                <div>
                  <label htmlFor={`business-${index}`} className="block text-xs font-medium text-gray-700 mb-1">Business Level</label>
                  <div className="flex items-center space-x-2 mt-2">
                    <label htmlFor={`business-checkbox-${index}`} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        id={`business-checkbox-${index}`}
                        type="checkbox"
                        checked={language?.businessLevel || false}
                        onChange={(e) => updateLanguage(index, { businessLevel: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                      />
                      <span className="text-xs text-gray-600">Business proficiency</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Language Level Indicator */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded text-xs ${proficiencyLevels[language?.proficiency || 'conversational'].color}`}>
                    {proficiencyLevels[language?.proficiency || 'conversational'].icon} {proficiencyLevels[language?.proficiency || 'conversational'].label}
                  </span>
                  {language?.certification && (
                    <span className="text-xs text-blue-600 flex items-center">
                      <Award className="w-3 h-3 mr-1" />
                      {language.certification}
                    </span>
                  )}
                  {language?.businessLevel && (
                    <span className="text-xs text-green-600 flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      Business Level
                    </span>
                  )}
                  {language?.isNative && (
                    <span className="text-xs text-yellow-600 flex items-center">
                      <Star className="w-3 h-3 mr-1" />
                      Native
                    </span>
                  )}
                </div>

                {/* Market Value Indicator */}
                {atsAnalysis.marketValue.find(mv => mv.language === language?.name) && (
                  <div className="text-xs text-gray-500">
                    Market Value: {atsAnalysis.marketValue.find(mv => mv.language === language?.name)?.importance === 'high' ? '🔥 High' :
                                  atsAnalysis.marketValue.find(mv => mv.language === language?.name)?.importance === 'growing' ? '📈 Growing' : '📊 Medium'}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {(!resumeData?.languages || resumeData.languages.length === 0) && (
        <div className="text-center py-12 text-gray-500" role="region" aria-label="No languages added">
          <Globe className="w-16 h-16 mx-auto mb-4 opacity-50" aria-hidden="true" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No languages added yet</h4>
          <p className="text-sm mb-4">Add languages to showcase your global communication abilities</p>
          <button
            onClick={() => addLanguage()}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors min-h-[44px]"
            aria-label="Add your first language"
          >
            <Plus className="w-4 h-4" />
            <span>Add Your First Language</span>
          </button>
        </div>
      )}

      {/* Language Suggestions */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4" role="region" aria-label="Language suggestions">
        <div className="flex items-center justify-between mb-3">
          <h5 className="font-medium text-purple-900 flex items-center">
            <Sparkles className="w-4 h-4 mr-2" />
            Popular Languages for {userJobTitle}
          </h5>
          <button
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="text-purple-600 text-sm hover:text-purple-700 min-h-[44px] px-2"
            aria-label={`${showSuggestions ? 'Hide' : 'Show'} language suggestions`}
          >
            {showSuggestions ? 'Hide' : 'Show'} ({filteredSuggestions.length})
          </button>
        </div>
        
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-3">
          {Object.keys(popularLanguages).map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-3 py-1 rounded text-xs font-medium min-h-[32px] ${
                activeCategory === category
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              aria-label={`Filter by ${category} languages`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Search */}
        {showSuggestions && (
          <div className="mb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" aria-hidden="true" />
              <label htmlFor="language-search" className="sr-only">Search languages</label>
              <input
                id="language-search"
                type="text"
                placeholder="Search languages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm min-h-[44px]"
                aria-label="Search languages"
              />
            </div>
          </div>
        )}
        
        {showSuggestions && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {filteredSuggestions.map((suggestion, index) => {
              const isHighValue = industryData.high.some(lang => normalizeLanguageName(lang) === normalizeLanguageName(suggestion));
              const isGrowing = industryData.growing.some(lang => normalizeLanguageName(lang) === normalizeLanguageName(suggestion));
              
              return (
                <button
                  key={`${suggestion}-${index}`}
                  onClick={() => addSuggestionLanguage(suggestion)}
                  className={`text-left p-2 bg-white hover:bg-purple-50 rounded border transition-colors min-h-[44px] ${
                    isHighValue ? 'border-green-300 bg-green-50' :
                    isGrowing ? 'border-yellow-300 bg-yellow-50' :
                    'border-purple-200 hover:border-purple-300'
                  }`}
                  aria-label={`Add ${suggestion} language`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{suggestion}</span>
                    {isHighValue && <span className="text-xs" aria-label="High value">🔥</span>}
                    {isGrowing && <span className="text-xs" aria-label="Growing demand">📈</span>}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Language Statistics */}
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-4" role="region" aria-label="Language portfolio statistics">
        <h5 className="font-medium text-gray-900 mb-3 flex items-center">
          <TrendingUp className="w-4 h-4 mr-2" />
          Language Portfolio Overview
        </h5>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600" aria-label={`${(resumeData?.languages || []).length} total languages`}>
              {(resumeData?.languages || []).length}
            </div>
            <div className="text-xs text-gray-600">Total Languages</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600" aria-label={`${(resumeData?.languages || []).filter(l => l.businessLevel || l.proficiency === 'professional' || l.proficiency === 'fluent').length} business level languages`}>
              {(resumeData?.languages || []).filter(l => l.businessLevel || l.proficiency === 'professional' || l.proficiency === 'fluent').length}
            </div>
            <div className="text-xs text-gray-600">Business Level</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600" aria-label={`${(resumeData?.languages || []).filter(l => l.certification).length} certified languages`}>
              {(resumeData?.languages || []).filter(l => l.certification).length}
            </div>
            <div className="text-xs text-gray-600">Certified</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600" aria-label={`${atsAnalysis.score}% market value score`}>
              {atsAnalysis.score}%
            </div>
            <div className="text-xs text-gray-600">Market Value</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-200">
        <button
          onClick={goToPrevStep}
          disabled={currentStep === 0}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[44px]"
          aria-label="Go to previous step"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <span className="text-sm text-gray-500" aria-label={`Step ${currentStep + 1} of ${totalSteps}`}>
          Step {currentStep + 1} of {totalSteps}
        </span>

        <button
          onClick={goToNextStep}
          disabled={currentStep === totalSteps - 1}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[44px]"
          aria-label="Go to next step"
        >
          <span>Next</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}