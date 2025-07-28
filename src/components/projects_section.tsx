import React, { useState, useEffect } from 'react';
import { Plus, Minus, Sparkles, BookOpen, ArrowLeft, ArrowRight, Code, Lightbulb, Target, AlertCircle, CheckCircle, ExternalLink, Github, Calendar, Users, TrendingUp, Search, Filter, GripVertical, X, Monitor, Smartphone, Database, Globe, Zap, Award, Eye, Clock, BarChart } from 'lucide-react';

// Constants to avoid magic strings
const PROJECT_STATUSES = {
  COMPLETED: 'completed',
  IN_PROGRESS: 'in-progress',
  ON_HOLD: 'on-hold',
  CONCEPT: 'concept'
} as const;

type ProjectStatus = typeof PROJECT_STATUSES[keyof typeof PROJECT_STATUSES];
type ArraySection = 'projects';

// Project types by industry
const projectTypesByIndustry = {
  'Software Engineer': {
    types: ['Web Application', 'Mobile App', 'API/Backend Service', 'Desktop Application', 'Library/Framework', 'DevOps/Infrastructure', 'Data Pipeline', 'Machine Learning Model'],
    technologies: ['React', 'Node.js', 'Python', 'JavaScript', 'TypeScript', 'AWS', 'Docker', 'MongoDB', 'PostgreSQL', 'Redis', 'GraphQL', 'REST API'],
    metrics: ['users', 'performance improvement', 'code coverage', 'uptime', 'load time reduction', 'cost savings', 'test coverage']
  },
  'Data Scientist': {
    types: ['Machine Learning Model', 'Data Pipeline', 'Analytics Dashboard', 'Predictive Model', 'Data Visualization', 'ETL Process', 'Research Study', 'A/B Test Analysis'],
    technologies: ['Python', 'R', 'SQL', 'Tableau', 'Power BI', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'Scikit-learn', 'Apache Spark', 'Jupyter'],
    metrics: ['accuracy improvement', 'model performance', 'data processing speed', 'cost reduction', 'prediction accuracy', 'ROI increase']
  },
  'Marketing Manager': {
    types: ['Campaign Strategy', 'Marketing Automation', 'Content Strategy', 'Brand Launch', 'Digital Campaign', 'SEO Optimization', 'Social Media Campaign', 'Lead Generation'],
    technologies: ['Google Analytics', 'HubSpot', 'Salesforce', 'Mailchimp', 'Hootsuite', 'Google Ads', 'Facebook Ads', 'SEMrush', 'Canva', 'WordPress'],
    metrics: ['conversion rate increase', 'lead generation', 'ROI improvement', 'engagement rate', 'traffic growth', 'cost per acquisition reduction']
  },
  'Project Manager': {
    types: ['Process Improvement', 'System Implementation', 'Change Management', 'Team Reorganization', 'Product Launch', 'Digital Transformation', 'Cost Optimization', 'Quality Initiative'],
    technologies: ['Jira', 'Asana', 'Microsoft Project', 'Slack', 'Confluence', 'Monday.com', 'Trello', 'Teams', 'Smartsheet', 'PowerBI'],
    metrics: ['on-time delivery', 'budget savings', 'efficiency improvement', 'stakeholder satisfaction', 'risk reduction', 'timeline acceleration']
  },
  'Graphic Designer': {
    types: ['Brand Identity', 'Website Design', 'Print Design', 'Digital Campaign', 'Packaging Design', 'UI/UX Design', 'Illustration Project', 'Motion Graphics'],
    technologies: ['Adobe Creative Suite', 'Figma', 'Sketch', 'InDesign', 'Illustrator', 'Photoshop', 'After Effects', 'Canva', 'Principle', 'InVision'],
    metrics: ['client satisfaction', 'brand recognition increase', 'engagement improvement', 'conversion rate lift', 'design awards', 'project completion rate']
  },
  'Sales Representative': {
    types: ['Sales Process Optimization', 'Territory Expansion', 'Client Acquisition', 'Product Launch Support', 'CRM Implementation', 'Training Program', 'Partnership Development', 'Market Research'],
    technologies: ['Salesforce', 'HubSpot', 'LinkedIn Sales Navigator', 'Outreach', 'ZoomInfo', 'Pipedrive', 'Zoom', 'Slack', 'Excel', 'PowerPoint'],
    metrics: ['revenue increase', 'quota achievement', 'new client acquisition', 'pipeline growth', 'conversion rate improvement', 'customer retention']
  }
};

// Popular project examples
const projectExamples = {
  'Software Engineer': [
    'E-commerce platform with React and Node.js, handling 10,000+ daily users',
    'RESTful API service with 99.9% uptime serving 1M+ requests daily',
    'Mobile app developed with React Native, achieving 4.8-star rating',
    'DevOps pipeline reducing deployment time by 75%',
    'Machine learning model improving recommendation accuracy by 35%'
  ],
  'Data Scientist': [
    'Predictive model increasing sales forecast accuracy by 40%',
    'Customer churn analysis reducing retention costs by $500K annually',
    'Real-time analytics dashboard for executive decision-making',
    'A/B testing framework improving conversion rates by 25%',
    'ETL pipeline processing 1TB+ data daily with 99.5% accuracy'
  ],
  'Marketing Manager': [
    'Multi-channel campaign generating 150% ROI increase',
    'SEO strategy boosting organic traffic by 300% in 6 months',
    'Marketing automation workflow improving lead quality by 45%',
    'Brand refresh increasing customer engagement by 80%',
    'Social media campaign reaching 2M+ impressions'
  ],
  'Project Manager': [
    'Digital transformation project delivered 20% under budget',
    'Process improvement initiative saving $200K annually',
    'Cross-functional team coordination for product launch',
    'System migration with zero downtime and 95% user adoption',
    'Change management program achieving 90% stakeholder buy-in'
  ],
  'Graphic Designer': [
    'Brand identity redesign increasing recognition by 60%',
    'Website redesign improving user engagement by 45%',
    'Print campaign winning regional design award',
    'UI/UX redesign reducing user drop-off by 30%',
    'Packaging design contributing to 25% sales increase'
  ],
  'Sales Representative': [
    'Territory expansion resulting in 40% revenue growth',
    'CRM implementation improving lead conversion by 35%',
    'Partnership development generating $1M+ in new business',
    'Sales process optimization reducing cycle time by 50%',
    'Client retention program achieving 95% satisfaction rate'
  ]
};

// ATS keywords for project descriptions
const projectATSKeywords = {
  'Software Engineer': ['developed', 'implemented', 'built', 'designed', 'optimized', 'deployed', 'maintained', 'integrated', 'automated', 'scaled'],
  'Data Scientist': ['analyzed', 'modeled', 'predicted', 'optimized', 'visualized', 'processed', 'cleaned', 'validated', 'interpreted', 'forecasted'],
  'Marketing Manager': ['launched', 'managed', 'optimized', 'increased', 'generated', 'improved', 'analyzed', 'targeted', 'converted', 'engaged'],
  'Project Manager': ['managed', 'coordinated', 'delivered', 'implemented', 'facilitated', 'streamlined', 'optimized', 'monitored', 'communicated', 'achieved'],
  'Graphic Designer': ['designed', 'created', 'conceptualized', 'illustrated', 'branded', 'visualized', 'collaborated', 'refined', 'produced', 'delivered'],
  'Sales Representative': ['achieved', 'exceeded', 'generated', 'developed', 'managed', 'negotiated', 'closed', 'expanded', 'acquired', 'retained']
};

// Helper functions
function omitKey<T extends Record<string, any>>(obj: T, key: string | number): T {
  const { [key]: _omit, ...rest } = obj;
  return rest as T;
}

function generateUniqueId(): string {
  return `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

interface Project {
  id?: string;
  title: string;
  description: string;
  technologies: string[];
  role: string;
  startDate: string;
  endDate: string;
  status: ProjectStatus;
  githubUrl?: string;
  liveUrl?: string;
  metrics?: string;
  type: string;
  teamSize?: string;
}

interface ProjectsSectionProps {
  resumeData?: { projects?: Project[] };
  updateResumeData?: (section: ArraySection, data: any) => void;
  addArrayItem?: (section: ArraySection, item: any) => void;
  removeArrayItem?: (section: ArraySection, index: number) => void;
  updateArrayItem?: (section: ArraySection, index: number, data: any) => void;
  setShowPhraseLibrary?: (show: boolean) => void;
  goToNextStep?: () => void;
  goToPrevStep?: () => void;
  currentStep?: number;
  totalSteps?: number;
}

export default function ProjectsSection({ 
  resumeData = { projects: [] }, 
  updateResumeData = () => {}, 
  addArrayItem = () => {}, 
  removeArrayItem = () => {}, 
  updateArrayItem = () => {},
  setShowPhraseLibrary = () => {},
  goToNextStep = () => {},
  goToPrevStep = () => {},
  currentStep = 0,
  totalSteps = 1
}: ProjectsSectionProps) {
  const [expandedIndex, setExpandedIndex] = useState<number>(-1); // Fix 1.6: Start with -1
  const [showProjectHelper, setShowProjectHelper] = useState(false);
  const [showSuggestionsForIndex, setShowSuggestionsForIndex] = useState<number | null>(null); // Fix 1.5: Per-project suggestions
  const [industryFilter, setIndustryFilter] = useState('Software Engineer');
  const [validationErrors, setValidationErrors] = useState<Record<number, any>>({});
  const [atsAnalysis, setAtsAnalysis] = useState<Record<number, any>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterByStatus, setFilterByStatus] = useState<string>('all');

  // Cleanup component state on unmount
  useEffect(() => {
    return () => {
      setShowProjectHelper(false);
      setShowSuggestionsForIndex(null);
    };
  }, []);

  // Get industry-specific data
  const industryData = projectTypesByIndustry[industryFilter] || projectTypesByIndustry['Software Engineer'];
  const examples = projectExamples[industryFilter] || projectExamples['Software Engineer'];
  const keywords = projectATSKeywords[industryFilter] || projectATSKeywords['Software Engineer'];

  // Validation function
  const validateProject = (project: Project, index: number) => {
    const errors: any = {};
    if (!project.title?.trim()) errors.title = 'Project title is required';
    if (!project.description?.trim()) errors.description = 'Project description is required';
    else if (project.description.length < 50) {
      errors.description = 'Description should be at least 50 characters for better impact';
    }
    if (!project.technologies || project.technologies.length === 0) {
      errors.technologies = 'At least one technology/tool is required';
    }
    if (!project.role?.trim()) errors.role = 'Your role in the project is required';
    
    setValidationErrors(prev => ({ ...prev, [index]: errors }));
    return Object.keys(errors).length === 0;
  };

  // ATS Analysis function - Fix 1.7: Clamp before state update
  const analyzeProjectATS = (project: Project, index: number) => {
    const description = (project.description || '').toLowerCase();
    const title = (project.title || '').toLowerCase();
    const role = (project.role || '').toLowerCase();
    
    const foundKeywords = keywords.filter(keyword => 
      description.includes(keyword.toLowerCase()) ||
      title.includes(keyword.toLowerCase()) ||
      role.includes(keyword.toLowerCase())
    );
    
    const baseScore = Math.round((foundKeywords.length / keywords.length) * 100);
    // Improved regex to catch more number patterns
    const hasMetrics = /\d[\d,\.]*(%|\+|k|m|b|hr|hours|min|minutes|sec|seconds|\$|\€|\£)|\d+[\d,\.]* (users|people|clients|customers|hours|days|weeks|months|years)/i.test(description);
    const hasTechnologies = project.technologies && project.technologies.length > 0;
    const hasLinks = project.githubUrl || project.liveUrl;
    
    // Calculate adjusted score and clamp immediately
    let adjustedScore = baseScore;
    if (hasMetrics) adjustedScore += 15;
    if (hasTechnologies) adjustedScore += 10;
    if (hasLinks) adjustedScore += 5;
    const finalScore = Math.min(100, adjustedScore); // Fix 1.7: Clamp before setting state

    setAtsAnalysis(prev => ({
      ...prev,
      [index]: {
        score: finalScore,
        foundKeywords,
        missingKeywords: keywords.filter(k => !foundKeywords.includes(k)).slice(0, 5),
        hasMetrics,
        hasTechnologies,
        hasLinks
      }
    }));
  };

  // Add new project - Fix 1.6: Set expanded index after data updates
  const addProject = () => {
    const newProject: Project = {
      id: generateUniqueId(),
      title: '',
      description: '',
      technologies: [],
      role: '',
      startDate: '',
      endDate: '',
      status: PROJECT_STATUSES.COMPLETED,
      githubUrl: '',
      liveUrl: '',
      metrics: '',
      type: '',
      teamSize: ''
    };
    addArrayItem('projects', newProject);
    // Use callback form to ensure we get the updated length
    setExpandedIndex((resumeData?.projects || []).length);
  };

  // Update project field
  const updateProject = (index: number, field: string, value: any) => {
    updateArrayItem('projects', index, { [field]: value });
    
    // Validate and analyze after update
    const project = resumeData?.projects?.[index] || {};
    const updatedProject = { ...project, [field]: value };
    validateProject(updatedProject as Project, index);
    
    if (field === 'description' || field === 'title' || field === 'role') {
      analyzeProjectATS(updatedProject as Project, index);
    }
  };

  // Remove project - Fix 1.2: Clean up state
  const removeProject = (index: number) => {
    removeArrayItem('projects', index);
    
    // Clean up validation errors and ATS analysis
    setValidationErrors(prev => omitKey(prev, index));
    setAtsAnalysis(prev => omitKey(prev, index));
    
    // Reset expanded index if we removed the expanded project
    if (expandedIndex === index) {
      setExpandedIndex(-1);
    } else if (expandedIndex > index) {
      setExpandedIndex(expandedIndex - 1);
    }
    
    // Reset suggestions if they were showing for this project
    if (showSuggestionsForIndex === index) {
      setShowSuggestionsForIndex(null);
    }
  };

  // Add technology - Fix 1.3: Proper event typing
  const addTechnology = (index: number, technology: string) => {
    const project = resumeData?.projects?.[index] || {};
    const currentTechnologies = (project as any)?.technologies || [];
    if (!currentTechnologies.includes(technology)) {
      updateProject(index, 'technologies', [...currentTechnologies, technology]);
    }
  };

  // Remove technology
  const removeTechnology = (index: number, techIndex: number) => {
    const project = resumeData?.projects?.[index] || {};
    const currentTechnologies = (project as any)?.technologies || [];
    const newTechnologies = currentTechnologies.filter((_, i) => i !== techIndex);
    updateProject(index, 'technologies', newTechnologies);
  };

  // Insert suggestion
  const insertSuggestion = (text: string, index: number) => {
    updateProject(index, 'description', text);
    setTimeout(() => {
      const project = resumeData?.projects?.[index] || {};
      analyzeProjectATS({ ...project, description: text } as Project, index);
    }, 100);
  };

  // Filter projects - Fix 1.1: This will be used for rendering
  const getFilteredProjects = () => {
    let projects = resumeData?.projects || [];
    
    if (filterByStatus !== 'all') {
      projects = projects.filter(project => project.status === filterByStatus);
    }
    
    if (searchTerm) {
      projects = projects.filter(project => 
        project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.technologies?.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    return projects;
  };

  // Get original index for filtered projects
  const getOriginalIndex = (filteredProject: Project): number => {
    return (resumeData?.projects || []).findIndex(p => 
      p.id === filteredProject.id || 
      (p.title === filteredProject.title && p.description === filteredProject.description)
    );
  };

  // Initialize analysis for existing projects
  useEffect(() => {
    (resumeData?.projects || []).forEach((project, index) => {
      validateProject(project as Project, index);
      analyzeProjectATS(project as Project, index);
    });
  }, [resumeData?.projects]);

  const filteredProjects = getFilteredProjects();

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Projects & Portfolio</h3>
          <p className="text-sm text-gray-600 mt-1">
            Showcase your best work, side projects, and key accomplishments with quantified results
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowProjectHelper(!showProjectHelper)}
            className="flex items-center space-x-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm"
          >
            <Lightbulb className="w-4 h-4" />
            <span>Project Helper</span>
          </button>
          <button
            onClick={() => setShowPhraseLibrary(true)}
            className="flex items-center space-x-2 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-sm"
          >
            <BookOpen className="w-4 h-4" />
            <span>Phrase Library</span>
          </button>
        </div>
      </div>

      {/* Project Helper */}
      {showProjectHelper && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h5 className="font-medium text-green-900 mb-3">
            🚀 Project Section Best Practices:
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-green-800 mb-2">What to Include:</p>
              <ul className="text-green-700 space-y-1">
                <li>• Personal projects that show initiative</li>
                <li>• Work projects you led or contributed to significantly</li>
                <li>• Open source contributions</li>
                <li>• Freelance or volunteer work</li>
                <li>• Relevant school projects (for new graduates)</li>
                <li>• Side businesses or entrepreneurial ventures</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-green-800 mb-2">Writing Tips:</p>
              <ul className="text-green-700 space-y-1">
                <li>• Start with strong action verbs (Built, Created, Developed)</li>
                <li>• Include specific technologies and tools used</li>
                <li>• Quantify impact with metrics (users, performance, cost)</li>
                <li>• Mention your specific role and contributions</li>
                <li>• Include links to live demos or code repositories</li>
                <li>• Highlight problem-solving and innovation</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        <div className="flex space-x-2">
          <select
            value={filterByStatus}
            onChange={(e) => setFilterByStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value={PROJECT_STATUSES.COMPLETED}>Completed</option>
            <option value={PROJECT_STATUSES.IN_PROGRESS}>In Progress</option>
            <option value={PROJECT_STATUSES.ON_HOLD}>On Hold</option>
            <option value={PROJECT_STATUSES.CONCEPT}>Concept</option>
          </select>
          
          <select
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {Object.keys(projectTypesByIndustry).map(industry => (
              <option key={industry} value={industry}>{industry}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Add Project Button */}
      <button
        onClick={addProject}
        className="w-full flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
      >
        <Plus className="w-5 h-5 text-gray-500" />
        <span className="text-gray-600 font-medium">Add New Project</span>
      </button>

      {/* Projects List - Fix 1.1: Use filtered projects */}
      <div className="space-y-4">
        {filteredProjects.map((project: Project, filteredIndex: number) => {
          const originalIndex = getOriginalIndex(project);
          const isExpanded = expandedIndex === originalIndex;
          
          return (
            <div 
              key={project.id || `project-${originalIndex}`} // Better key using ID
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              {/* Project Header */}
              <div 
                className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => setExpandedIndex(isExpanded ? -1 : originalIndex)}
              >
                <div className="flex items-center space-x-3">
                  {/* Fix 1.8: Remove drag handle since drag-and-drop is not implemented */}
                  <div className="flex items-center space-x-2">
                    {project.status === PROJECT_STATUSES.COMPLETED ? <CheckCircle className="w-5 h-5 text-green-500" /> :
                     project.status === PROJECT_STATUSES.IN_PROGRESS ? <Clock className="w-5 h-5 text-blue-500" /> :
                     project.status === PROJECT_STATUSES.ON_HOLD ? <AlertCircle className="w-5 h-5 text-yellow-500" /> :
                     <Eye className="w-5 h-5 text-gray-400" />}
                    <Code className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">
                        {project.title || 'Project Title'}
                      </h4>
                      {validationErrors[originalIndex] && Object.keys(validationErrors[originalIndex]).length > 0 && (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                      {atsAnalysis[originalIndex]?.score >= 80 && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        project.status === PROJECT_STATUSES.COMPLETED ? 'bg-green-100 text-green-700' :
                        project.status === PROJECT_STATUSES.IN_PROGRESS ? 'bg-blue-100 text-blue-700' :
                        project.status === PROJECT_STATUSES.ON_HOLD ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {project.status?.replace('-', ' ') || 'No Status'}
                      </span>
                      {project.type && (
                        <span className="text-gray-500">• {project.type}</span>
                      )}
                      {atsAnalysis[originalIndex] && (
                        <span className={`ml-2 text-xs px-2 py-1 rounded ${
                          atsAnalysis[originalIndex].score >= 80 ? 'bg-green-100 text-green-700' :
                          atsAnalysis[originalIndex].score >= 60 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          ATS: {atsAnalysis[originalIndex].score}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {(project.githubUrl || project.liveUrl) && (
                    <div className="flex space-x-1">
                      {project.githubUrl && <Github className="w-4 h-4 text-gray-600" />}
                      {project.liveUrl && <ExternalLink className="w-4 h-4 text-gray-600" />}
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeProject(originalIndex);
                    }}
                    className="text-red-600 hover:text-red-700 p-1"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Project Details */}
              {isExpanded && (
                <div className="p-6 space-y-6">
                  {/* ATS Analysis */}
                  {atsAnalysis[originalIndex] && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-blue-900 flex items-center">
                          <Target className="w-4 h-4 mr-2" />
                          Project ATS Score: {atsAnalysis[originalIndex].score}%
                        </h5>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-blue-700 font-medium">✓ Found Keywords:</p>
                          <p className="text-blue-600">{atsAnalysis[originalIndex].foundKeywords.join(', ') || 'None'}</p>
                        </div>
                        <div>
                          <p className="text-orange-700 font-medium">⚠ Consider Adding:</p>
                          <p className="text-orange-600">{atsAnalysis[originalIndex].missingKeywords.slice(0, 3).join(', ')}</p>
                        </div>
                        <div>
                          <p className="text-gray-700 font-medium">Improvements:</p>
                          <div className="text-gray-600">
                            {!atsAnalysis[originalIndex].hasMetrics && <p>• Add metrics/numbers</p>}
                            {!atsAnalysis[originalIndex].hasTechnologies && <p>• Add technologies</p>}
                            {!atsAnalysis[originalIndex].hasLinks && <p>• Add project links</p>}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Project Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={project?.title || ''}
                        onChange={(e) => updateProject(originalIndex, 'title', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          validationErrors[originalIndex]?.title ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="e.g., E-commerce Platform, Mobile App, Data Dashboard"
                      />
                      {validationErrors[originalIndex]?.title && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors[originalIndex].title}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Your Role <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={project.role || ''}
                        onChange={(e) => updateProject(originalIndex, 'role', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          validationErrors[originalIndex]?.role ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="e.g., Lead Developer, Project Manager, Solo Developer"
                      />
                      {validationErrors[originalIndex]?.role && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors[originalIndex].role}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Project Type</label>
                      <select
                        value={project.type || ''}
                        onChange={(e) => updateProject(originalIndex, 'type', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select type...</option>
                        {industryData.types.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select
                        value={project.status || PROJECT_STATUSES.COMPLETED}
                        onChange={(e) => updateProject(originalIndex, 'status', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value={PROJECT_STATUSES.COMPLETED}>Completed</option>
                        <option value={PROJECT_STATUSES.IN_PROGRESS}>In Progress</option>
                        <option value={PROJECT_STATUSES.ON_HOLD}>On Hold</option>
                        <option value={PROJECT_STATUSES.CONCEPT}>Concept</option>
                      </select>
                    </div>
                  </div>

                  {/* Dates and Team */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                      <input
                        type="text"
                        value={project.startDate || ''}
                        onChange={(e) => updateProject(originalIndex, 'startDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., January 2023"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                      <input
                        type="text"
                        value={project.endDate || ''}
                        onChange={(e) => updateProject(originalIndex, 'endDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., March 2023 or Ongoing"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Team Size</label>
                      <input
                        type="text"
                        value={project.teamSize || ''}
                        onChange={(e) => updateProject(originalIndex, 'teamSize', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Solo, 2-3 people, 5+ team"
                      />
                    </div>
                  </div>

                  {/* Technologies */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Technologies & Tools <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-3">
                      {/* Technology Tags */}
                      <div className="flex flex-wrap gap-2">
                        {(project.technologies || []).map((tech: string, techIndex: number) => (
                          <span key={`${originalIndex}-${techIndex}`} className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            {tech}
                            <button
                              onClick={() => removeTechnology(originalIndex, techIndex)}
                              className="ml-2 text-blue-600 hover:text-blue-800"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                      
                      {/* Add Technology Input - Fix 1.3: Proper event typing */}
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          placeholder="Add technology or tool..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                            if (e.key === 'Enter') {
                              const value = (e.currentTarget.value || '').trim();
                              if (value) {
                                addTechnology(originalIndex, value);
                                e.currentTarget.value = '';
                              }
                            }
                          }}
                        />
                        <button
                          onClick={() => setShowSuggestionsForIndex(
                            showSuggestionsForIndex === originalIndex ? null : originalIndex
                          )}
                          className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                        >
                          Suggestions
                        </button>
                      </div>

                      {/* Technology Suggestions - Fix 1.5: Per-project suggestions */}
                      {showSuggestionsForIndex === originalIndex && (
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm font-medium text-gray-700 mb-2">Popular technologies for {industryFilter}:</p>
                          <div className="flex flex-wrap gap-2">
                            {industryData.technologies.map((tech: string) => (
                              <button
                                key={tech}
                                onClick={() => addTechnology(originalIndex, tech)}
                                className="px-2 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-blue-50 hover:border-blue-300 transition-colors"
                              >
                                {tech}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {validationErrors[originalIndex]?.technologies && (
                        <p className="text-red-500 text-xs">{validationErrors[originalIndex].technologies}</p>
                      )}
                    </div>
                  </div>

                  {/* Project Description */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Project Description & Impact <span className="text-red-500">*</span>
                      </label>
                      <button
                        onClick={() => {
                          const randomExample = examples[Math.floor(Math.random() * examples.length)];
                          insertSuggestion(randomExample, originalIndex);
                        }}
                        className="flex items-center space-x-1 px-3 py-1 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-xs"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Generate Example</span>
                      </button>
                    </div>
                    
                    <textarea
                      value={project.description || ''}
                      onChange={(e) => updateProject(originalIndex, 'description', e.target.value)}
                      rows={4}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        validationErrors[originalIndex]?.description ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Describe what you built, the problem it solved, technologies used, and quantifiable results. Include metrics like user count, performance improvements, or business impact."
                    />
                    
                    <div className="mt-2 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="text-gray-500">
                          💡 Include metrics and specific outcomes (e.g., "increased performance by 40%", "served 10,000+ users")
                        </div>
                        <div className={`${project.description?.length > 100 ? 'text-green-600' : 'text-yellow-600'}`}>
                          {project.description?.length || 0} characters
                        </div>
                      </div>
                      {validationErrors[originalIndex]?.description && (
                        <p className="text-red-500 mt-1">{validationErrors[originalIndex].description}</p>
                      )}
                    </div>
                  </div>

                  {/* Links and Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        GitHub/Code Repository
                      </label>
                      <div className="relative">
                        <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="url"
                          value={project.githubUrl || ''}
                          onChange={(e) => updateProject(originalIndex, 'githubUrl', e.target.value)}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="https://github.com/username/project"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Live Demo/Website
                      </label>
                      <div className="relative">
                        <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="url"
                          value={project.liveUrl || ''}
                          onChange={(e) => updateProject(originalIndex, 'liveUrl', e.target.value)}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="https://yourproject.com"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Key Metrics & Results
                    </label>
                    <input
                      type="text"
                      value={project.metrics || ''}
                      onChange={(e) => updateProject(originalIndex, 'metrics', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 50% performance improvement, 10,000+ users, $50K cost savings"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Specific, quantifiable outcomes that demonstrate impact
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {(!resumeData?.projects || resumeData.projects.length === 0) && (
        <div className="text-center py-12 text-gray-500">
          <Code className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No projects added yet</h4>
          <p className="text-sm mb-4">Showcase your best work to stand out from other candidates</p>
          <button
            onClick={addProject}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Your First Project</span>
          </button>
        </div>
      )}

      {/* Example Projects Inspiration */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h5 className="font-medium text-purple-900 flex items-center">
            <Sparkles className="w-4 h-4 mr-2" />
            Project Examples for {industryFilter}
          </h5>
        </div>
        <div className="space-y-2">
          {examples.slice(0, 3).map((example, i) => (
            <div key={i} className="text-sm text-purple-700 bg-white p-3 rounded border border-purple-200">
              {example}
            </div>
          ))}
        </div>
        <p className="text-xs text-purple-600 mt-2">
          💡 Use these as inspiration. Click "Generate Example" on any project to get a random suggestion.
        </p>
      </div>

      {/* Projects Statistics */}
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
        <h5 className="font-medium text-gray-900 mb-3 flex items-center">
          <BarChart className="w-4 h-4 mr-2" />
          Projects Overview
        </h5>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{(resumeData?.projects || []).length}</div>
            <div className="text-xs text-gray-600">Total Projects</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {(resumeData?.projects || []).filter(p => p.status === PROJECT_STATUSES.COMPLETED).length}
            </div>
            <div className="text-xs text-gray-600">Completed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {(resumeData?.projects || []).filter(p => p.githubUrl || p.liveUrl).length}
            </div>
            <div className="text-xs text-gray-600">With Links</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">
              {Math.round((resumeData?.projects || []).reduce((sum, _, i) => sum + (atsAnalysis[i]?.score || 0), 0) / Math.max((resumeData?.projects || []).length, 1))}%
            </div>
            <div className="text-xs text-gray-600">Avg ATS Score</div>
          </div>
        </div>
      </div>

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