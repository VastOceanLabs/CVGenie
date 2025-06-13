import React, { useState, useRef } from 'react';
import Plus from 'lucide-react/dist/esm/icons/plus';
import Minus from 'lucide-react/dist/esm/icons/minus';
import Sparkles from 'lucide-react/dist/esm/icons/sparkles';
import BookOpen from 'lucide-react/dist/esm/icons/book-open';
import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';
import Briefcase from 'lucide-react/dist/esm/icons/briefcase';
import Calendar from 'lucide-react/dist/esm/icons/calendar';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import Building from 'lucide-react/dist/esm/icons/building';
import Lightbulb from 'lucide-react/dist/esm/icons/lightbulb';
import Copy from 'lucide-react/dist/esm/icons/copy';
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down';
import ChevronUp from 'lucide-react/dist/esm/icons/chevron-up';
import GripVertical from 'lucide-react/dist/esm/icons/grip-vertical';
import Target from 'lucide-react/dist/esm/icons/target';
import AlertCircle from 'lucide-react/dist/esm/icons/alert-circle';
import CheckCircle from 'lucide-react/dist/esm/icons/check-circle';
import TrendingUp from 'lucide-react/dist/esm/icons/trending-up';
import Users from 'lucide-react/dist/esm/icons/users';
import Award from 'lucide-react/dist/esm/icons/award';
import Zap from 'lucide-react/dist/esm/icons/zap';

// Lazy load experience data
const loadExperienceData = () => import('../data/experience-data');

interface ExperienceSectionProps {
  resumeData?: { experience?: any[] };
  updateResumeData?: (section: string, data: any) => void;
  addArrayItem?: (section: string, item: any) => void;
  removeArrayItem?: (section: string, index: number) => void;
  updateArrayItem?: (section: string, index: number, data: any) => void;
  setShowPhraseLibrary?: (show: boolean) => void;
  goToNextStep?: () => void;
  goToPrevStep?: () => void;
  currentStep?: number;
  totalSteps?: number;
}

export default function ExperienceSection({ 
  resumeData = { experience: [] }, 
  updateResumeData = () => {}, 
  addArrayItem = () => {}, 
  removeArrayItem = () => {}, 
  updateArrayItem = () => {},
  setShowPhraseLibrary = () => {},
  goToNextStep = () => {},
  goToPrevStep = () => {},
  currentStep = 0,
  totalSteps = 1
}: ExperienceSectionProps) {
  const [expandedIndex, setExpandedIndex] = useState(0);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [showBulletSuggestions, setShowBulletSuggestions] = useState<Record<number, boolean>>({});
  const [showAchievementHelper, setShowAchievementHelper] = useState<Record<number, boolean>>({});
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<number, any>>({});
  const [atsAnalysis, setAtsAnalysis] = useState<Record<number, any>>({});
  const [experienceData, setExperienceData] = useState<any>(null);

  // Lazy load data
  React.useEffect(() => {
    loadExperienceData().then((data) => {
      setExperienceData(data.default || data);
    }).catch(() => {
      // Fallback data
      setExperienceData({
        experiencePhrases: {
          'Software Engineer': {
            achievements: [
              'Increased application performance by 50% through database optimization',
              'Led migration of legacy systems to cloud infrastructure'
            ],
            responsibilities: [
              'Developed and maintained web applications using React and Node.js',
              'Collaborated with cross-functional teams'
            ]
          }
        },
        actionVerbsByCategory: {
          leadership: ['Led', 'Managed', 'Supervised'],
          achievement: ['Achieved', 'Exceeded', 'Delivered']
        },
        atsKeywords: {
          'Software Engineer': ['developed', 'built', 'implemented']
        }
      });
    });
  }, []);

  // Validation function
  const validateExperience = (experience: any, index: number) => {
    const errors: any = {};
    if (!experience.title?.trim()) errors.title = 'Job title is required';
    if (!experience.company?.trim()) errors.company = 'Company name is required';
    if (!experience.description?.trim()) errors.description = 'Job description is required';
    if (experience.description && experience.description.length < 100) {
      errors.description = 'Description should be at least 100 characters for better ATS scoring';
    }
    
    setValidationErrors(prev => ({ ...prev, [index]: errors }));
    return Object.keys(errors).length === 0;
  };

  // ATS Analysis function
  const analyzeATS = (experience: any, index: number) => {
    if (!experienceData) return;
    
    const jobTitle = experience.title?.toLowerCase() || '';
    const description = experience.description?.toLowerCase() || '';
    const keywords = experienceData.atsKeywords[experience.title] || [];
    
    const foundKeywords = keywords.filter((keyword: string) => 
      description.includes(keyword.toLowerCase())
    );
    
    const score = Math.min(100, (foundKeywords.length / Math.max(keywords.length, 1)) * 100);
    const missingKeywords = keywords.filter((keyword: string) => 
      !description.includes(keyword.toLowerCase())
    );

    setAtsAnalysis(prev => ({
      ...prev,
      [index]: {
        score: Math.round(score),
        foundKeywords,
        missingKeywords,
        hasMetrics: /\d+%|\$\d+|\d+\+/.test(description),
        hasActionVerbs: Object.values(experienceData.actionVerbsByCategory).flat().some((verb: string) => 
          description.includes(verb.toLowerCase())
        )
      }
    }));
  };

  // Add new experience
  const addExperience = () => {
    const newExperience = {
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: [],
      responsibilities: [],
      skills: []
    };
    addArrayItem('experience', newExperience);
    setExpandedIndex((resumeData?.experience || []).length);
  };

  // Generate AI suggestions
  const generateAISuggestions = async (jobTitle: string, index: number) => {
    setIsGeneratingAI(true);
    setShowBulletSuggestions({ ...showBulletSuggestions, [index]: true });
    
    // Simulate AI generation delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsGeneratingAI(false);
    return experienceData?.experiencePhrases[jobTitle] || experienceData?.experiencePhrases['Software Engineer'] || {};
  };

  // Insert suggestion with category
  const insertSuggestion = (text: string, category: string, index: number) => {
    const experience = resumeData.experience[index];
    const prefix = '• ';
    const currentDescription = experience.description || '';
    const newDescription = currentDescription 
      ? `${currentDescription}\n${prefix}${text}`
      : `${prefix}${text}`;
    
    updateArrayItem('experience', index, { description: newDescription });
    
    // Run ATS analysis after adding content
    setTimeout(() => analyzeATS({ ...experience, description: newDescription }, index), 100);
  };

  // Toggle current position
  const toggleCurrent = (index: number) => {
    const experience = resumeData.experience[index];
    updateArrayItem('experience', index, { 
      current: !experience.current,
      endDate: !experience.current ? '' : experience.endDate
    });
  };

  // Handle field updates with validation
  const handleFieldUpdate = (index: number, field: string, value: string) => {
    updateArrayItem('experience', index, { [field]: value });
    
    // Validate after update
    const experience = resumeData?.experience?.[index] || {};
    const updatedExperience = { ...experience, [field]: value };
    validateExperience(updatedExperience, index);
    
    // Run ATS analysis for description changes
    if (field === 'description' && value.length > 50) {
      analyzeATS(updatedExperience, index);
    }
  };

  if (!experienceData) {
    return <div className="animate-pulse">Loading experience section...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Work Experience</h3>
          <p className="text-sm text-gray-600 mt-1">
            Add your work history with quantified achievements and strong action verbs
          </p>
        </div>
        <button
          onClick={() => setShowPhraseLibrary(true)}
          className="flex items-center space-x-2 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-sm"
        >
          <BookOpen className="w-4 h-4" />
          <span>Phrase Library</span>
        </button>
      </div>

      {/* Add Experience Button */}
      <button
        onClick={addExperience}
        className="w-full flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
      >
        <Plus className="w-5 h-5 text-gray-500" />
        <span className="text-gray-600 font-medium">Add Work Experience</span>
      </button>

      {/* Experience List */}
      <div className="space-y-4">
        {(resumeData?.experience || []).map((exp: any, index: number) => (
          <div 
            key={index} 
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            {/* Experience Header */}
            <div 
              className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => setExpandedIndex(expandedIndex === index ? -1 : index)}
            >
              <div className="flex items-center space-x-3">
                <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                <Briefcase className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-gray-900">
                      {exp.title || 'Job Title'} {exp.company && `at ${exp.company}`}
                    </h4>
                    {validationErrors[index] && Object.keys(validationErrors[index]).length > 0 && (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                    {atsAnalysis[index]?.score >= 80 && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {exp.startDate} {exp.endDate && `- ${exp.endDate}`} {exp.current && '- Present'}
                    {atsAnalysis[index] && (
                      <span className={`ml-2 text-xs px-2 py-1 rounded ${
                        atsAnalysis[index].score >= 80 ? 'bg-green-100 text-green-700' :
                        atsAnalysis[index].score >= 60 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        ATS: {atsAnalysis[index].score}%
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeArrayItem('experience', index);
                  }}
                  className="text-red-600 hover:text-red-700 p-1"
                >
                  <Minus className="w-4 h-4" />
                </button>
                {expandedIndex === index ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </div>

            {/* Experience Details */}
            {expandedIndex === index && (
              <div className="p-6 space-y-6">
                {/* ATS Analysis */}
                {atsAnalysis[index] && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-blue-900 flex items-center">
                        <Target className="w-4 h-4 mr-2" />
                        ATS Optimization Score: {atsAnalysis[index].score}%
                      </h5>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-blue-700 font-medium">✓ Found Keywords:</p>
                        <p className="text-blue-600">{atsAnalysis[index].foundKeywords.join(', ') || 'None'}</p>
                      </div>
                      <div>
                        <p className="text-orange-700 font-medium">⚠ Missing Keywords:</p>
                        <p className="text-orange-600">{atsAnalysis[index].missingKeywords.slice(0, 3).join(', ')}</p>
                      </div>
                      <div>
                        <p className="text-gray-700 font-medium">Improvements:</p>
                        <div className="text-gray-600">
                          {!atsAnalysis[index].hasMetrics && <p>• Add metrics/numbers</p>}
                          {!atsAnalysis[index].hasActionVerbs && <p>• Use action verbs</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Job Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={exp?.title || ''}
                      onChange={(e) => handleFieldUpdate(index, 'title', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        validationErrors[index]?.title ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Senior Software Engineer"
                    />
                    {validationErrors[index]?.title && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors[index].title}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => handleFieldUpdate(index, 'company', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        validationErrors[index]?.company ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Tech Company Inc."
                    />
                    {validationErrors[index]?.company && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors[index].company}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={exp.location}
                      onChange={(e) => handleFieldUpdate(index, 'location', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., San Francisco, CA"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`current-${index}`}
                        checked={exp.current}
                        onChange={() => toggleCurrent(index)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor={`current-${index}`} className="text-sm font-medium text-gray-700">
                        I currently work here
                      </label>
                    </div>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="text"
                      value={exp.startDate}
                      onChange={(e) => handleFieldUpdate(index, 'startDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., January 2020"
                    />
                  </div>
                  {!exp.current && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                      <input
                        type="text"
                        value={exp.endDate}
                        onChange={(e) => handleFieldUpdate(index, 'endDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., December 2023"
                      />
                    </div>
                  )}
                </div>

                {/* Job Description */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Job Description & Achievements <span className="text-red-500">*</span>
                    </label>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setShowAchievementHelper({ ...showAchievementHelper, [index]: !showAchievementHelper[index] })}
                        className="flex items-center space-x-1 px-3 py-1 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-xs"
                      >
                        <Award className="w-3 h-3" />
                        <span>Achievement Helper</span>
                      </button>
                      <button
                        onClick={() => generateAISuggestions(exp.title, index)}
                        disabled={isGeneratingAI}
                        className="flex items-center space-x-1 px-3 py-1 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-xs"
                      >
                        <Sparkles className={`w-3 h-3 ${isGeneratingAI ? 'animate-spin' : ''}`} />
                        <span>AI Suggest</span>
                      </button>
                    </div>
                  </div>
                  
                  <textarea
                    value={exp.description}
                    onChange={(e) => handleFieldUpdate(index, 'description', e.target.value)}
                    rows={6}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      validationErrors[index]?.description ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="• Start with strong action verbs (Achieved, Led, Developed...)&#10;• Include specific metrics and numbers (increased sales by 25%)&#10;• Focus on achievements and impact, not just duties&#10;• Use bullet points for better readability"
                  />
                  
                  <div className="mt-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="text-gray-500">
                        💡 Lead with achievements, then responsibilities. Use numbers and metrics when possible.
                      </div>
                      <div className={`${exp.description?.length > 150 ? 'text-green-600' : 'text-yellow-600'}`}>
                        {exp.description?.length || 0} characters
                        {(!exp.description || exp.description.length < 150) && ' (aim for 150+ for better ATS score)'}
                      </div>
                    </div>
                    {validationErrors[index]?.description && (
                      <p className="text-red-500 mt-1">{validationErrors[index].description}</p>
                    )}
                  </div>
                </div>

                {/* AI Suggestions */}
                {showBulletSuggestions[index] && exp.title && experienceData?.experiencePhrases[exp.title] && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h5 className="font-medium text-blue-900 mb-3">
                      💡 Suggested content for {exp.title}:
                    </h5>
                    
                    {/* Achievements */}
                    <div className="mb-4">
                      <h6 className="flex items-center text-sm font-medium text-blue-800 mb-2">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        Achievements (lead with these):
                      </h6>
                      <div className="space-y-2">
                        {(experienceData.experiencePhrases[exp.title]?.achievements || []).map((phrase: string, phraseIndex: number) => (
                          <button
                            key={phraseIndex}
                            onClick={() => insertSuggestion(phrase, 'achievements', index)}
                            className="block w-full p-3 text-left bg-white hover:bg-blue-50 rounded-lg border border-blue-200 hover:border-blue-300 transition-colors text-sm"
                          >
                            {phrase}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Responsibilities */}
                    <div className="mb-4">
                      <h6 className="flex items-center text-sm font-medium text-blue-800 mb-2">
                        <Users className="w-4 h-4 mr-1" />
                        Key Responsibilities:
                      </h6>
                      <div className="space-y-2">
                        {(experienceData.experiencePhrases[exp.title]?.responsibilities || []).map((phrase: string, phraseIndex: number) => (
                          <button
                            key={phraseIndex}
                            onClick={() => insertSuggestion(phrase, 'responsibilities', index)}
                            className="block w-full p-3 text-left bg-white hover:bg-blue-50 rounded-lg border border-blue-200 hover:border-blue-300 transition-colors text-sm"
                          >
                            {phrase}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => setShowBulletSuggestions({ ...showBulletSuggestions, [index]: false })}
                      className="mt-3 text-sm text-blue-600 hover:text-blue-700"
                    >
                      Hide suggestions
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {(!resumeData?.experience || resumeData.experience.length === 0) && (
        <div className="text-center py-12 text-gray-500">
          <Briefcase className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No work experience added yet</h4>
          <p className="text-sm mb-4">Add your work history to showcase your professional background</p>
          <button
            onClick={addExperience}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Your First Job</span>
          </button>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-200">
        <button
          onClick={goToPrevStep}
          disabled={currentStep === 0}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <span className="text-sm text-gray-500">
          Step {currentStep + 1} of {totalSteps}
        </span>

        <button
          onClick={goToNextStep}
          disabled={currentStep === totalSteps - 1}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span>Next</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}