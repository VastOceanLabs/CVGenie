import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, Award, Users, DollarSign, BarChart3, Lightbulb, Download, Edit3, Plus, Minus, Star, Calendar, MapPin, Mail, Phone, Linkedin, Globe, ChevronDown, ChevronUp } from 'lucide-react';

// TypeScript interfaces for proper typing
interface ExperienceMetrics {
  revenue: string;
  quotaAchievement: string;
  leads: string;
  accuracy: string;
  teamSize: string;
  deals: string;
  ranking: string;
  conversion: string;
  retention: string;
  growth: string;
}

interface Experience {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
  metrics: ExperienceMetrics;
}

interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  jobTitle: string;
  yearsExperience: string;
  summary: string;
}

interface Skill {
  name: string;
  category: 'sales' | 'technical' | 'soft' | 'marketing';
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  featured: boolean;
}

interface Achievement {
  title: string;
  description: string;
  year: string;
  impact: string;
}

interface Education {
  institution: string;
  degree: string;
  field: string;
  graduationDate: string;
  gpa: string;
  honors: string;
}

interface Certification {
  name: string;
  issuer: string;
  dateObtained: string;
  credentialId?: string;
}

interface ResumeData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  skills: Skill[];
  achievements: Achievement[];
  education: Education[];
  certifications: Certification[];
}

// Sales/Marketing specific sample data
const sampleSalesData: ResumeData = {
  personalInfo: {
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@email.com',
    phone: '(555) 123-4567',
    location: 'Chicago, IL',
    linkedin: 'linkedin.com/in/sarahjohnson',
    website: 'sarahjohnson.com',
    jobTitle: 'Senior Sales Manager',
    yearsExperience: '8',
    summary: 'Results-driven Senior Sales Manager with 8+ years of experience exceeding quotas and driving revenue growth. Proven track record of increasing sales by 40% year-over-year and building high-performing teams. Expert in consultative selling, account management, and CRM optimization with strong focus on customer relationship building and strategic partnerships.'
  },
  experience: [
    {
      title: 'Senior Sales Manager',
      company: 'TechSolutions Inc.',
      location: 'Chicago, IL',
      startDate: 'January 2020',
      endDate: '',
      current: true,
      description: '• Exceeded annual sales quota by 35% for three consecutive years, generating $2.8M in new revenue\n• Led team of 12 sales representatives, achieving 95% team quota attainment and reducing turnover by 40%\n• Developed and implemented strategic account management program resulting in 60% increase in customer retention\n• Negotiated and closed deals with Fortune 500 companies, with average deal size of $85K\n• Managed full sales cycle from prospecting to closing, maintaining 22% conversion rate from lead to sale',
      achievements: [
        '$2.8M in new revenue generated',
        '35% quota exceeded annually',
        '95% team quota attainment',
        '60% increase in customer retention'
      ],
      metrics: {
        revenue: '$2.8M',
        quotaAchievement: '135%',
        teamSize: '12',
        deals: '47',
        ranking: '#1',
        conversion: '22%',
        retention: '60%',
        growth: '40%',
        leads: '200+',
        accuracy: '98%'
      }
    },
    {
      title: 'Account Executive',
      company: 'GrowthMarketing Pro',
      location: 'Chicago, IL',
      startDate: 'March 2018',
      endDate: 'December 2019',
      current: false,
      description: '• Achieved 125% of annual quota, ranking #2 out of 45 sales representatives company-wide\n• Prospected and qualified 200+ leads monthly using LinkedIn Sales Navigator and cold outreach\n• Built and maintained relationships with C-level executives at mid-market companies\n• Collaborated with marketing team to optimize lead scoring and qualification process\n• Utilized Salesforce CRM to track pipeline and forecast accuracy of 98%',
      achievements: [
        'Ranked #2 out of 45 reps',
        '125% quota achievement',
        '200+ monthly qualified leads',
        '98% forecast accuracy'
      ],
      metrics: {
        revenue: '$1.2M',
        quotaAchievement: '125%',
        teamSize: '',
        deals: '32',
        ranking: '#2/45',
        conversion: '18%',
        retention: '85%',
        growth: '25%',
        leads: '200',
        accuracy: '98%'
      }
    }
  ],
  skills: [
    { name: 'Consultative Selling', category: 'sales', level: 'expert', featured: true },
    { name: 'Account Management', category: 'sales', level: 'expert', featured: true },
    { name: 'Lead Generation', category: 'sales', level: 'advanced', featured: true },
    { name: 'CRM Management (Salesforce)', category: 'technical', level: 'advanced', featured: true },
    { name: 'Negotiation', category: 'soft', level: 'expert', featured: false },
    { name: 'Team Leadership', category: 'soft', level: 'advanced', featured: false },
    { name: 'Pipeline Management', category: 'sales', level: 'expert', featured: false },
    { name: 'Customer Retention', category: 'sales', level: 'advanced', featured: false }
  ],
  achievements: [
    {
      title: 'Top Performer Award',
      description: 'Recognized as #1 sales performer company-wide for Q4 2023',
      year: '2023',
      impact: '$500K+ revenue contribution'
    },
    {
      title: 'President\'s Club',
      description: 'Achieved President\'s Club status for exceeding 130% of annual quota',
      year: '2022',
      impact: '130% quota achievement'
    }
  ],
  education: [
    {
      institution: 'Northwestern University',
      degree: 'Bachelor of Science',
      field: 'Marketing',
      graduationDate: '2016',
      gpa: '3.7',
      honors: 'Magna Cum Laude'
    }
  ],
  certifications: [
    {
      name: 'Salesforce Certified Administrator',
      issuer: 'Salesforce',
      dateObtained: '2022',
      credentialId: 'SF-2022-4567'
    },
    {
      name: 'HubSpot Sales Certification',
      issuer: 'HubSpot Academy',
      dateObtained: '2023'
    }
  ]
};

// Sales/Marketing template configuration
const salesTemplate = {
  id: 'sales-marketing',
  name: 'Sales & Marketing Professional',
  category: 'Sales',
  colors: { 
    primary: '#059669', 
    secondary: '#047857', 
    accent: '#10b981',
    text: '#1f2937',
    lightBg: '#f0fdf4'
  },
  layout: 'two-column-metrics',
  description: 'Results-driven template perfect for sales and marketing professionals',
  atsScore: 91
};

export default function SalesMarketingTemplate() {
  const [resumeData, setResumeData] = useState(sampleSalesData);
  const [editMode, setEditMode] = useState(false);
  const [expandedSection, setExpandedSection] = useState('experience');
  const [showMetrics, setShowMetrics] = useState(true);
  const [atsScore, setAtsScore] = useState(91);

  // Calculate ATS score based on content
  useEffect(() => {
    const calculateATS = () => {
      let score = 0;
      
      // Check for key sales metrics and achievements
      const description = resumeData.experience.map(exp => exp.description).join(' ').toLowerCase();
      
      // Sales keywords
      const salesKeywords = ['quota', 'revenue', 'sales', 'leads', 'conversion', 'crm', 'pipeline', 'accounts'];
      const foundKeywords = salesKeywords.filter(keyword => description.includes(keyword));
      score += (foundKeywords.length / salesKeywords.length) * 30;
      
      // Quantified achievements
      const hasNumbers = /\d+%|\$\d+|\d+\+/.test(description);
      if (hasNumbers) score += 25;
      
      // Contact info completeness
      if (resumeData.personalInfo.email && resumeData.personalInfo.phone) score += 15;
      if (resumeData.personalInfo.linkedin) score += 10;
      
      // Skills relevance
      const salesSkills = resumeData.skills.filter(skill => 
        ['sales', 'technical'].includes(skill.category)
      ).length;
      score += Math.min(20, salesSkills * 3);
      
      setAtsScore(Math.round(score));
    };
    
    calculateATS();
  }, [resumeData]);

  // Update resume data
  const updateField = (section, field, value) => {
    setResumeData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const updateExperience = (index, field, value) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const updateExperienceMetrics = (index, metricKey, value) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === index ? { 
          ...exp, 
          metrics: { 
            ...exp.metrics, 
            [metricKey]: value 
          } 
        } : exp
      )
    }));
  };

  // Add new experience
  const addExperience = () => {
    const newExp = {
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: [],
      metrics: {
        revenue: '',
        quotaAchievement: '',
        leads: '',
        accuracy: '',
        teamSize: '',
        deals: '',
        ranking: '',
        conversion: '',
        retention: '',
        growth: ''
      }
    };
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, newExp]
    }));
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header Controls */}
      <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sales & Marketing Resume Template</h1>
            <p className="text-gray-600">Results-driven template optimized for sales professionals</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium">ATS Score: </span>
              <span className={`text-lg font-bold ${
                atsScore >= 80 ? 'text-green-600' : atsScore >= 60 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {atsScore}%
              </span>
            </div>
            <button
              onClick={() => setEditMode(!editMode)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                editMode 
                  ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Edit3 className="w-4 h-4" />
              <span>{editMode ? 'View Mode' : 'Edit Mode'}</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>

        {/* Template Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="flex items-center justify-center space-x-2 p-3 bg-green-50 rounded-lg">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-800">Metrics-Focused</span>
          </div>
          <div className="flex items-center justify-center space-x-2 p-3 bg-blue-50 rounded-lg">
            <Award className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Achievement-Heavy</span>
          </div>
          <div className="flex items-center justify-center space-x-2 p-3 bg-purple-50 rounded-lg">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-800">Results-Driven</span>
          </div>
          <div className="flex items-center justify-center space-x-2 p-3 bg-orange-50 rounded-lg">
            <Target className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-medium text-orange-800">ATS-Optimized</span>
          </div>
        </div>
      </div>

      {/* Resume Content */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 min-h-[800px]">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 bg-gradient-to-br from-green-50 to-emerald-50 p-6 border-r border-gray-200">
            {/* Contact Information */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Mail className="w-5 h-5 mr-2 text-green-600" />
                Contact
              </h3>
              <div className="space-y-3 text-sm">
                {editMode ? (
                  <div className="space-y-2">
                    <input
                      type="email"
                      value={resumeData.personalInfo.email}
                      onChange={(e) => updateField('personalInfo', 'email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="Email"
                    />
                    <input
                      type="tel"
                      value={resumeData.personalInfo.phone}
                      onChange={(e) => updateField('personalInfo', 'phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="Phone"
                    />
                    <input
                      type="text"
                      value={resumeData.personalInfo.location}
                      onChange={(e) => updateField('personalInfo', 'location', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="Location"
                    />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-green-600" />
                      <span>{resumeData.personalInfo.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-green-600" />
                      <span>{resumeData.personalInfo.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-green-600" />
                      <span>{resumeData.personalInfo.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Linkedin className="w-4 h-4 mr-2 text-green-600" />
                      <span className="text-blue-600">{resumeData.personalInfo.linkedin}</span>
                    </div>
                    {resumeData.personalInfo.website && (
                      <div className="flex items-center">
                        <Globe className="w-4 h-4 mr-2 text-green-600" />
                        <span className="text-blue-600">{resumeData.personalInfo.website}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Key Metrics */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
                Key Metrics
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-lg p-3 text-center border border-green-200">
                  <div className="text-2xl font-bold text-green-600">$2.8M</div>
                  <div className="text-xs text-gray-600">Revenue Generated</div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center border border-green-200">
                  <div className="text-2xl font-bold text-green-600">135%</div>
                  <div className="text-xs text-gray-600">Quota Achievement</div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center border border-green-200">
                  <div className="text-2xl font-bold text-green-600">95%</div>
                  <div className="text-xs text-gray-600">Team Performance</div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center border border-green-200">
                  <div className="text-2xl font-bold text-green-600">60%</div>
                  <div className="text-xs text-gray-600">Retention Increase</div>
                </div>
              </div>
            </div>

            {/* Core Skills */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-green-600" />
                Core Skills
              </h3>
              <div className="space-y-2">
                {resumeData.skills.filter(skill => skill.featured).map((skill, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{skill.name}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < (skill.level === 'expert' ? 5 : skill.level === 'advanced' ? 4 : 3)
                              ? 'text-green-500 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2 text-green-600" />
                Certifications
              </h3>
              <div className="space-y-3">
                {resumeData.certifications.map((cert, index) => (
                  <div key={index} className="bg-white rounded-lg p-3 border border-green-200">
                    <div className="font-medium text-sm text-gray-900">{cert.name}</div>
                    <div className="text-xs text-gray-600">{cert.issuer}</div>
                    <div className="text-xs text-green-600">{cert.dateObtained}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 p-6">
            {/* Header */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              {editMode ? (
                <div className="space-y-3">
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={resumeData.personalInfo.firstName}
                      onChange={(e) => updateField('personalInfo', 'firstName', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="First Name"
                    />
                    <input
                      type="text"
                      value={resumeData.personalInfo.lastName}
                      onChange={(e) => updateField('personalInfo', 'lastName', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Last Name"
                    />
                  </div>
                  <input
                    type="text"
                    value={resumeData.personalInfo.jobTitle}
                    onChange={(e) => updateField('personalInfo', 'jobTitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Job Title"
                  />
                </div>
              ) : (
                <>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {resumeData.personalInfo.firstName} {resumeData.personalInfo.lastName}
                  </h1>
                  <h2 className="text-xl text-green-600 font-semibold mb-3">
                    {resumeData.personalInfo.jobTitle}
                  </h2>
                </>
              )}
            </div>

            {/* Professional Summary */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b-2 border-green-600">
                Professional Summary
              </h3>
              {editMode ? (
                <textarea
                  value={resumeData.personalInfo.summary}
                  onChange={(e) => updateField('personalInfo', 'summary', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Professional summary..."
                />
              ) : (
                <p className="text-gray-700 leading-relaxed">{resumeData.personalInfo.summary}</p>
              )}
            </div>

            {/* Experience */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 pb-2 border-b-2 border-green-600">
                  Professional Experience
                </h3>
                {editMode && (
                  <button
                    onClick={addExperience}
                    className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Experience</span>
                  </button>
                )}
              </div>
              
              <div className="space-y-6">
                {resumeData.experience.map((exp, index) => (
                  <div key={index} className="relative">
                    {editMode && (
                      <div className="absolute top-0 right-0 z-10">
                        <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                          <Minus className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    
                    <div className="border-l-4 border-green-500 pl-4">
                      {editMode ? (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <input
                              type="text"
                              value={exp.title}
                              onChange={(e) => updateExperience(index, 'title', e.target.value)}
                              className="px-3 py-2 border border-gray-300 rounded-lg"
                              placeholder="Job Title"
                            />
                            <input
                              type="text"
                              value={exp.company}
                              onChange={(e) => updateExperience(index, 'company', e.target.value)}
                              className="px-3 py-2 border border-gray-300 rounded-lg"
                              placeholder="Company"
                            />
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <input
                              type="text"
                              value={exp.startDate}
                              onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              placeholder="Start Date"
                            />
                            <input
                              type="text"
                              value={exp.endDate}
                              onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              placeholder="End Date"
                              disabled={exp.current}
                            />
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={exp.current}
                                onChange={(e) => updateExperience(index, 'current', e.target.checked)}
                                className="mr-2"
                              />
                              <label className="text-sm">Current</label>
                            </div>
                          </div>
                          
                          {/* Metrics Editor */}
                          <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                            <h5 className="font-medium text-green-800 mb-2">Performance Metrics</h5>
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                value={exp.metrics.revenue}
                                onChange={(e) => updateExperienceMetrics(index, 'revenue', e.target.value)}
                                className="px-2 py-1 border border-green-300 rounded text-sm"
                                placeholder="Revenue (e.g., $2.8M)"
                              />
                              <input
                                type="text"
                                value={exp.metrics.quotaAchievement}
                                onChange={(e) => updateExperienceMetrics(index, 'quotaAchievement', e.target.value)}
                                className="px-2 py-1 border border-green-300 rounded text-sm"
                                placeholder="Quota (e.g., 135%)"
                              />
                              <input
                                type="text"
                                value={exp.metrics.teamSize}
                                onChange={(e) => updateExperienceMetrics(index, 'teamSize', e.target.value)}
                                className="px-2 py-1 border border-green-300 rounded text-sm"
                                placeholder="Team Size"
                              />
                              <input
                                type="text"
                                value={exp.metrics.deals}
                                onChange={(e) => updateExperienceMetrics(index, 'deals', e.target.value)}
                                className="px-2 py-1 border border-green-300 rounded text-sm"
                                placeholder="# of Deals"
                              />
                            </div>
                          </div>
                          
                          <textarea
                            value={exp.description}
                            onChange={(e) => updateExperience(index, 'description', e.target.value)}
                            rows={6}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            placeholder="Job description with metrics and achievements..."
                          />
                        </div>
                      ) : (
                        <>
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900">{exp.title}</h4>
                              <div className="text-green-600 font-medium">{exp.company}</div>
                              <div className="text-sm text-gray-600 flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                                <MapPin className="w-4 h-4 ml-3 mr-1" />
                                {exp.location}
                              </div>
                            </div>
                            
                            {/* Performance Metrics */}
                            {exp.metrics && (
                              <div className="flex space-x-2">
                                {Object.entries(exp.metrics).map(([key, value], i) => (
                                  <div key={i} className="bg-green-50 px-2 py-1 rounded text-xs text-center border border-green-200">
                                    <div className="font-bold text-green-700">{value}</div>
                                    <div className="text-green-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          <div className="mt-3">
                            <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                              {exp.description}
                            </div>
                          </div>
                          
                          {/* Key Achievements Highlight */}
                          {exp.achievements && exp.achievements.length > 0 && (
                            <div className="mt-4 bg-green-50 rounded-lg p-3 border border-green-200">
                              <h5 className="font-semibold text-green-800 mb-2 flex items-center">
                                <TrendingUp className="w-4 h-4 mr-1" />
                                Key Achievements
                              </h5>
                              <div className="grid grid-cols-2 gap-2">
                                {exp.achievements.map((achievement, i) => (
                                  <div key={i} className="text-sm text-green-700 flex items-center">
                                    <Star className="w-3 h-3 mr-2 text-green-500" />
                                    {achievement}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b-2 border-green-600">
                Education
              </h3>
              {resumeData.education.map((edu, index) => (
                <div key={index} className="mb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-900">{edu.degree} in {edu.field}</h4>
                      <div className="text-green-600">{edu.institution}</div>
                      {edu.honors && (
                        <div className="text-sm text-gray-600 italic">{edu.honors}</div>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">{edu.graduationDate}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Template Insights */}
      <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
          Sales Template Features & Best Practices
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2 flex items-center">
              <DollarSign className="w-4 h-4 mr-2 text-green-600" />
              Metrics-Focused
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Revenue figures prominently displayed</li>
              <li>• Quota achievement percentages</li>
              <li>• Deal sizes and volumes</li>
              <li>• ROI and growth metrics</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-blue-600" />
              Achievement-Heavy
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Awards and recognition highlighted</li>
              <li>• Performance rankings shown</li>
              <li>• Team achievements included</li>
              <li>• Career progression emphasized</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2 flex items-center">
              <Users className="w-4 h-4 mr-2 text-purple-600" />
              Relationship-Focused
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Client relationship building</li>
              <li>• Team leadership experience</li>
              <li>• Account management skills</li>
              <li>• Customer retention metrics</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2 flex items-center">
              <Target className="w-4 h-4 mr-2 text-orange-600" />
              ATS-Optimized
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Sales keywords integrated</li>
              <li>• Clean, scannable format</li>
              <li>• Quantified achievements</li>
              <li>• Industry-standard sections</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}