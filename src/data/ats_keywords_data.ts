// ATS Keywords Database - Industry-specific keywords for resume optimization
// This data helps users include the right keywords to pass ATS screening

// Core action verbs categorized by impact level and industry relevance
export const actionVerbsByCategory = {
  leadership: {
    high_impact: ['spearheaded', 'orchestrated', 'pioneered', 'revolutionized', 'championed'],
    medium_impact: ['led', 'managed', 'directed', 'supervised', 'coordinated'],
    entry_level: ['assisted', 'supported', 'collaborated', 'contributed', 'participated']
  },
  achievement: {
    high_impact: ['exceeded', 'surpassed', 'outperformed', 'maximized', 'optimized'],
    medium_impact: ['achieved', 'accomplished', 'delivered', 'completed', 'attained'],
    entry_level: ['reached', 'met', 'fulfilled', 'obtained', 'secured']
  },
  innovation: {
    high_impact: ['innovated', 'engineered', 'architected', 'designed', 'developed'],
    medium_impact: ['created', 'built', 'implemented', 'established', 'introduced'],
    entry_level: ['learned', 'adopted', 'applied', 'utilized', 'practiced']
  },
  improvement: {
    high_impact: ['transformed', 'overhauled', 'streamlined', 'enhanced', 'modernized'],
    medium_impact: ['improved', 'upgraded', 'refined', 'strengthened', 'advanced'],
    entry_level: ['updated', 'modified', 'adjusted', 'corrected', 'maintained']
  },
  growth: {
    high_impact: ['scaled', 'expanded', 'accelerated', 'amplified', 'multiplied'],
    medium_impact: ['increased', 'grew', 'boosted', 'elevated', 'developed'],
    entry_level: ['supported', 'contributed', 'aided', 'helped', 'assisted']
  }
} as const;

// Industry-specific ATS keywords organized by job function
export const atsByIndustry = {
  'Software Engineer': {
    core_keywords: [
      'software development', 'programming', 'coding', 'software engineer',
      'full stack developer', 'backend developer', 'frontend developer',
      'web development', 'mobile development', 'application development',
      'software architecture', 'system design', 'database design',
      'API development', 'microservices', 'cloud computing'
    ],
    technical_skills: [
      'JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 'Angular',
      'Vue.js', 'SQL', 'NoSQL', 'MongoDB', 'PostgreSQL', 'MySQL',
      'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes',
      'Git', 'CI/CD', 'DevOps', 'Agile', 'Scrum', 'REST API',
      'GraphQL', 'TypeScript', 'HTML', 'CSS', 'Redux', 'Express.js'
    ],
    methodologies: [
      'Agile development', 'Scrum methodology', 'DevOps practices',
      'Test-driven development', 'Continuous integration', 'Continuous deployment',
      'Code review', 'Pair programming', 'Software testing',
      'Unit testing', 'Integration testing', 'Automated testing'
    ],
    soft_skills: [
      'problem solving', 'analytical thinking', 'technical communication',
      'team collaboration', 'code optimization', 'debugging',
      'software troubleshooting', 'technical documentation',
      'cross-functional collaboration', 'mentoring'
    ],
    industry_terms: [
      'software lifecycle', 'version control', 'code deployment',
      'software maintenance', 'technical debt', 'scalability',
      'performance optimization', 'security practices',
      'open source', 'machine learning', 'artificial intelligence'
    ]
  },

  'Data Scientist': {
    core_keywords: [
      'data science', 'machine learning', 'artificial intelligence',
      'data analysis', 'statistical analysis', 'predictive modeling',
      'data mining', 'big data', 'analytics', 'business intelligence',
      'data visualization', 'statistical modeling', 'quantitative analysis'
    ],
    technical_skills: [
      'Python', 'R', 'SQL', 'SAS', 'SPSS', 'Tableau', 'Power BI',
      'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy',
      'Matplotlib', 'Seaborn', 'Jupyter', 'Apache Spark', 'Hadoop',
      'AWS', 'Azure ML', 'Google Cloud AI', 'Docker', 'Kubernetes'
    ],
    methodologies: [
      'supervised learning', 'unsupervised learning', 'deep learning',
      'neural networks', 'natural language processing', 'computer vision',
      'time series analysis', 'A/B testing', 'experimental design',
      'feature engineering', 'model validation', 'cross-validation'
    ],
    soft_skills: [
      'analytical thinking', 'statistical reasoning', 'data storytelling',
      'business acumen', 'communication', 'presentation skills',
      'problem solving', 'critical thinking', 'research skills'
    ],
    industry_terms: [
      'data pipeline', 'ETL processes', 'data warehouse', 'data lake',
      'model deployment', 'model monitoring', 'data governance',
      'data quality', 'feature selection', 'hyperparameter tuning'
    ]
  },

  'Marketing Manager': {
    core_keywords: [
      'digital marketing', 'marketing strategy', 'brand management',
      'campaign management', 'lead generation', 'customer acquisition',
      'market research', 'content marketing', 'social media marketing',
      'email marketing', 'search engine optimization', 'paid advertising'
    ],
    technical_skills: [
      'Google Analytics', 'Google Ads', 'Facebook Ads', 'LinkedIn Ads',
      'HubSpot', 'Salesforce', 'Mailchimp', 'Hootsuite', 'Buffer',
      'Adobe Creative Suite', 'Canva', 'WordPress', 'HTML', 'CSS',
      'SEO tools', 'SEM tools', 'marketing automation', 'CRM systems'
    ],
    methodologies: [
      'A/B testing', 'conversion optimization', 'customer segmentation',
      'marketing funnel optimization', 'attribution modeling',
      'performance marketing', 'growth hacking', 'omnichannel marketing',
      'customer journey mapping', 'persona development'
    ],
    soft_skills: [
      'creative thinking', 'strategic planning', 'data analysis',
      'project management', 'communication', 'presentation skills',
      'brand storytelling', 'customer insights', 'trend analysis'
    ],
    industry_terms: [
      'ROI', 'ROAS', 'CTR', 'CPC', 'CPM', 'conversion rate',
      'customer lifetime value', 'churn rate', 'engagement rate',
      'brand awareness', 'market penetration', 'competitive analysis'
    ]
  },

  'Project Manager': {
    core_keywords: [
      'project management', 'program management', 'agile project management',
      'scrum master', 'project planning', 'project execution',
      'stakeholder management', 'risk management', 'budget management',
      'resource management', 'timeline management', 'quality assurance'
    ],
    technical_skills: [
      'Microsoft Project', 'Jira', 'Asana', 'Trello', 'Monday.com',
      'Smartsheet', 'Confluence', 'Slack', 'Teams', 'Excel',
      'PowerPoint', 'Visio', 'Gantt charts', 'Kanban boards'
    ],
    methodologies: [
      'Agile methodology', 'Scrum framework', 'Waterfall methodology',
      'Lean project management', 'Six Sigma', 'PRINCE2',
      'PMI methodology', 'change management', 'process improvement',
      'sprint planning', 'retrospectives', 'daily standups'
    ],
    soft_skills: [
      'leadership', 'communication', 'negotiation', 'problem solving',
      'team building', 'conflict resolution', 'decision making',
      'time management', 'adaptability', 'critical thinking'
    ],
    industry_terms: [
      'project scope', 'deliverables', 'milestones', 'dependencies',
      'critical path', 'project charter', 'work breakdown structure',
      'project lifecycle', 'lessons learned', 'post-mortem'
    ]
  },

  'Sales Representative': {
    core_keywords: [
      'sales', 'business development', 'account management',
      'lead generation', 'prospecting', 'customer relationship management',
      'sales strategy', 'territory management', 'quota achievement',
      'revenue generation', 'client acquisition', 'sales process'
    ],
    technical_skills: [
      'Salesforce', 'HubSpot', 'Pipedrive', 'LinkedIn Sales Navigator',
      'Outreach', 'SalesLoft', 'ZoomInfo', 'Calendly', 'Zoom',
      'Microsoft Office', 'CRM systems', 'sales analytics tools'
    ],
    methodologies: [
      'consultative selling', 'solution selling', 'SPIN selling',
      'challenger sale', 'MEDDIC', 'Sandler selling system',
      'account-based selling', 'social selling', 'value-based selling',
      'sales funnel management', 'pipeline management'
    ],
    soft_skills: [
      'relationship building', 'communication', 'negotiation',
      'persuasion', 'active listening', 'resilience', 'persistence',
      'time management', 'goal orientation', 'customer service'
    ],
    industry_terms: [
      'sales cycle', 'conversion rate', 'close rate', 'pipeline velocity',
      'average deal size', 'customer lifetime value', 'churn rate',
      'upselling', 'cross-selling', 'cold calling', 'warm leads'
    ]
  },

  'Registered Nurse': {
    core_keywords: [
      'patient care', 'clinical nursing', 'registered nurse', 'healthcare',
      'patient assessment', 'medication administration', 'wound care',
      'emergency care', 'critical care', 'patient safety',
      'infection control', 'patient education', 'care coordination'
    ],
    technical_skills: [
      'electronic health records', 'EHR systems', 'Epic', 'Cerner',
      'IV therapy', 'phlebotomy', 'vital signs monitoring',
      'medical equipment operation', 'patient monitors',
      'infusion pumps', 'ventilator management', 'telemetry'
    ],
    methodologies: [
      'nursing process', 'evidence-based practice', 'patient-centered care',
      'interdisciplinary collaboration', 'care planning',
      'quality improvement', 'infection prevention protocols',
      'medication safety protocols', 'emergency procedures'
    ],
    soft_skills: [
      'compassionate care', 'critical thinking', 'communication',
      'empathy', 'attention to detail', 'stress management',
      'time management', 'cultural sensitivity', 'teamwork'
    ],
    industry_terms: [
      'nursing documentation', 'patient outcomes', 'quality metrics',
      'patient satisfaction', 'regulatory compliance', 'HIPAA',
      'Joint Commission standards', 'patient advocacy',
      'continuing education', 'professional development'
    ]
  },

  'Electrician': {
    core_keywords: [
      'electrical installation', 'electrical maintenance', 'electrical repair',
      'wiring systems', 'electrical troubleshooting', 'electrical safety',
      'residential electrical', 'commercial electrical', 'industrial electrical',
      'electrical code compliance', 'power distribution', 'electrical systems'
    ],
    technical_skills: [
      'electrical wiring', 'conduit installation', 'panel installation',
      'circuit analysis', 'motor controls', 'PLC programming',
      'electrical testing', 'voltage testing', 'blueprint reading',
      'electrical schematics', 'load calculations', 'grounding systems'
    ],
    methodologies: [
      'National Electrical Code', 'electrical safety procedures',
      'lockout/tagout procedures', 'electrical inspection',
      'preventive maintenance', 'electrical upgrades',
      'energy efficiency improvements', 'power quality analysis'
    ],
    soft_skills: [
      'problem solving', 'attention to detail', 'safety consciousness',
      'customer service', 'time management', 'physical stamina',
      'manual dexterity', 'reliability', 'communication'
    ],
    industry_terms: [
      'electrical permit', 'code violations', 'electrical inspection',
      'power outage', 'electrical hazards', 'arc flash',
      'electrical efficiency', 'renewable energy systems',
      'smart home technology', 'backup power systems'
    ]
  },

  'Graphic Designer': {
    core_keywords: [
      'graphic design', 'visual design', 'brand design', 'logo design',
      'web design', 'print design', 'digital design', 'creative design',
      'visual communication', 'design thinking', 'user interface design',
      'marketing design', 'advertising design', 'packaging design'
    ],
    technical_skills: [
      'Adobe Creative Suite', 'Photoshop', 'Illustrator', 'InDesign',
      'Figma', 'Sketch', 'Canva', 'After Effects', 'Premiere Pro',
      'HTML', 'CSS', 'JavaScript', 'WordPress', 'typography',
      'color theory', 'layout design', 'vector graphics'
    ],
    methodologies: [
      'design process', 'design thinking', 'user-centered design',
      'design research', 'prototyping', 'wireframing',
      'brand guidelines development', 'design systems',
      'responsive design', 'accessibility design'
    ],
    soft_skills: [
      'creativity', 'visual storytelling', 'attention to detail',
      'communication', 'collaboration', 'time management',
      'project management', 'client relations', 'artistic vision'
    ],
    industry_terms: [
      'brand identity', 'visual hierarchy', 'design brief',
      'creative concepts', 'design iterations', 'client feedback',
      'design deliverables', 'print production', 'web standards'
    ]
  },

  'Financial Analyst': {
    core_keywords: [
      'financial analysis', 'financial modeling', 'budget analysis',
      'investment analysis', 'risk assessment', 'financial reporting',
      'variance analysis', 'forecasting', 'valuation', 'due diligence',
      'financial planning', 'cost analysis', 'revenue analysis'
    ],
    technical_skills: [
      'Excel', 'SQL', 'Python', 'R', 'VBA', 'SAP', 'Oracle',
      'Bloomberg Terminal', 'FactSet', 'QuickBooks', 'PowerBI',
      'Tableau', 'financial software', 'ERP systems'
    ],
    methodologies: [
      'DCF modeling', 'sensitivity analysis', 'scenario analysis',
      'ratio analysis', 'trend analysis', 'benchmarking',
      'Monte Carlo simulation', 'regression analysis',
      'GAAP compliance', 'IFRS standards'
    ],
    soft_skills: [
      'analytical thinking', 'attention to detail', 'communication',
      'presentation skills', 'problem solving', 'critical thinking',
      'time management', 'ethical judgment', 'business acumen'
    ],
    industry_terms: [
      'ROI', 'NPV', 'IRR', 'EBITDA', 'cash flow', 'profit margin',
      'balance sheet', 'income statement', 'budget variance',
      'financial metrics', 'KPIs', 'cost-benefit analysis'
    ]
  },

  'Human Resources': {
    core_keywords: [
      'human resources', 'talent acquisition', 'recruitment', 'hiring',
      'employee relations', 'performance management', 'compensation',
      'benefits administration', 'training and development',
      'organizational development', 'HR strategy', 'workforce planning'
    ],
    technical_skills: [
      'HRIS systems', 'Workday', 'BambooHR', 'ADP', 'SuccessFactors',
      'applicant tracking systems', 'LinkedIn Recruiter',
      'performance management systems', 'learning management systems',
      'payroll systems', 'benefits platforms'
    ],
    methodologies: [
      'talent management', 'succession planning', 'competency modeling',
      'job analysis', 'performance evaluation', 'employee engagement',
      'change management', 'diversity and inclusion',
      'compliance management', 'policy development'
    ],
    soft_skills: [
      'communication', 'interpersonal skills', 'conflict resolution',
      'negotiation', 'confidentiality', 'empathy', 'leadership',
      'problem solving', 'ethical judgment', 'cultural awareness'
    ],
    industry_terms: [
      'employee retention', 'turnover rate', 'time to hire',
      'cost per hire', 'employee satisfaction', 'workplace culture',
      'employment law', 'compliance', 'equal opportunity',
      'workforce analytics', 'talent pipeline'
    ]
  }
} as const;

// Common ATS keywords across all industries
export const universalAtsKeywords = {
  leadership: [
    'leadership', 'team leadership', 'project leadership', 'led team',
    'managed team', 'supervised', 'mentored', 'coached', 'guided',
    'directed', 'coordinated', 'facilitated', 'delegated'
  ],
  achievement: [
    'achieved', 'exceeded', 'surpassed', 'delivered', 'accomplished',
    'completed', 'finished', 'attained', 'reached', 'met goals',
    'exceeded expectations', 'outperformed', 'improved'
  ],
  collaboration: [
    'collaboration', 'teamwork', 'cross-functional', 'partnership',
    'stakeholder management', 'client relations', 'vendor management',
    'customer service', 'communication', 'coordination'
  ],
  improvement: [
    'improved', 'enhanced', 'optimized', 'streamlined', 'upgraded',
    'modernized', 'transformed', 'renovated', 'refined', 'strengthened',
    'increased efficiency', 'reduced costs', 'saved time'
  ],
  technical: [
    'technical skills', 'software proficiency', 'system administration',
    'data analysis', 'problem solving', 'troubleshooting',
    'implementation', 'integration', 'automation', 'configuration'
  ]
} as const;

// Industry-specific job title variations (helps with keyword matching)
export const jobTitleVariations = {
  'Software Engineer': [
    'Software Developer', 'Web Developer', 'Application Developer',
    'Full Stack Developer', 'Backend Developer', 'Frontend Developer',
    'Software Programmer', 'Systems Developer', 'Development Engineer'
  ],
  'Data Scientist': [
    'Data Analyst', 'Machine Learning Engineer', 'AI Specialist',
    'Business Intelligence Analyst', 'Research Scientist',
    'Quantitative Analyst', 'Statistical Analyst', 'Data Engineer'
  ],
  'Marketing Manager': [
    'Digital Marketing Manager', 'Brand Manager', 'Campaign Manager',
    'Marketing Specialist', 'Growth Marketing Manager',
    'Content Marketing Manager', 'Product Marketing Manager'
  ],
  'Project Manager': [
    'Program Manager', 'Scrum Master', 'Product Manager',
    'Operations Manager', 'Delivery Manager', 'Technical Project Manager',
    'Agile Project Manager', 'PMO Manager'
  ],
  'Sales Representative': [
    'Account Executive', 'Sales Specialist', 'Business Development Representative',
    'Account Manager', 'Sales Associate', 'Territory Manager',
    'Customer Success Manager', 'Inside Sales Representative'
  ],
  'Registered Nurse': [
    'RN', 'Staff Nurse', 'Clinical Nurse', 'Charge Nurse',
    'Critical Care Nurse', 'Emergency Room Nurse', 'Operating Room Nurse',
    'Pediatric Nurse', 'ICU Nurse', 'Nurse Practitioner'
  ],
  'Electrician': [
    'Electrical Technician', 'Journeyman Electrician', 'Master Electrician',
    'Maintenance Electrician', 'Industrial Electrician',
    'Commercial Electrician', 'Residential Electrician'
  ],
  'Graphic Designer': [
    'Visual Designer', 'UI Designer', 'UX Designer', 'Creative Designer',
    'Brand Designer', 'Web Designer', 'Print Designer', 'Digital Designer',
    'Art Director', 'Design Specialist'
  ],
  'Financial Analyst': [
    'Business Analyst', 'Investment Analyst', 'Budget Analyst',
    'Credit Analyst', 'Risk Analyst', 'Research Analyst',
    'Corporate Finance Analyst', 'Portfolio Analyst'
  ],
  'Human Resources': [
    'HR Manager', 'HR Specialist', 'HR Generalist', 'Recruiter',
    'Talent Acquisition Specialist', 'HR Business Partner',
    'People Operations Manager', 'Employee Relations Specialist'
  ]
} as const;

// High-impact keywords that significantly boost ATS scores
export const highImpactKeywords = {
  quantifiable_results: [
    'increased', 'decreased', 'improved', 'reduced', 'generated',
    'saved', 'grew', 'boosted', 'enhanced', 'optimized',
    'percentage', 'revenue', 'profit', 'efficiency', 'productivity'
  ],
  action_oriented: [
    'led', 'managed', 'created', 'developed', 'implemented',
    'established', 'launched', 'initiated', 'executed', 'delivered',
    'achieved', 'completed', 'accomplished', 'exceeded'
  ],
  skills_focused: [
    'expertise', 'proficient', 'experienced', 'skilled', 'knowledgeable',
    'specialized', 'certified', 'trained', 'competent', 'qualified'
  ]
} as const;

// Keywords to avoid (ATS red flags)
export const keywordsToAvoid = [
  'responsible for', 'duties included', 'worked on', 'helped with',
  'assisted in', 'participated in', 'involved in', 'familiar with',
  'exposure to', 'some experience', 'basic knowledge'
] as const;

// Keyword density guidelines (all values are percentages)
export const keywordGuidelines = {
  optimal_density_percent: {
    min: 1.5, // 1.5% minimum keyword density
    max: 3.0, // 3.0% maximum to avoid keyword stuffing  
    target: 2.0 // 2.0% target density
  },
  distribution_percent: {
    summary: 30, // 30% of keywords should be in summary
    experience: 50, // 50% in experience section
    skills: 15, // 15% in skills section
    other: 5 // 5% distributed elsewhere
  },
  recommendations: {
    use_variations: true, // Use keyword variations
    natural_language: true, // Ensure natural language flow
    context_relevant: true, // Keywords must be contextually relevant
    avoid_repetition: true // Avoid excessive repetition
  }
} as const;

// Type definitions for better type safety
export type IndustryKey = keyof typeof atsByIndustry;
export type ExperienceLevel = 'entry' | 'mid' | 'senior';
export type ImpactLevel = keyof typeof actionVerbsByCategory;
export type ActionVerbCategory = keyof typeof actionVerbsByCategory[ImpactLevel];

// Function to get relevant keywords for a specific industry and experience level
export const getRelevantKeywords = (
  industry: IndustryKey, 
  experienceLevel: ExperienceLevel = 'mid',
  includeUniversal: boolean = true
): string[] => {
  const industryData = atsByIndustry[industry];
  
  let keywords = [
    ...industryData.core_keywords,
    ...industryData.technical_skills,
    ...industryData.industry_terms
  ];

  // Add experience-level appropriate action verbs
  const actionVerbs = Object.values(actionVerbsByCategory).flatMap(category => {
    switch (experienceLevel) {
      case 'entry':
        return category.entry_level || [];
      case 'senior':
        return category.high_impact || [];
      default:
        return category.medium_impact || [];
    }
  });

  keywords.push(...actionVerbs);

  // Add universal keywords if requested
  if (includeUniversal) {
    keywords.push(...Object.values(universalAtsKeywords).flat());
  }

  // Remove duplicates and return
  return [...new Set(keywords)];
};

// Function to analyze keyword presence in resume text with accurate counting
export const analyzeKeywordPresence = (
  resumeText: string,
  targetKeywords: string[]
): {
  found: string[];
  missing: string[];
  totalMatches: number;
  density: number;
  score: number;
} => {
  const text = resumeText.toLowerCase();
  const words = text.split(/\s+/).filter(word => word.length > 0).length;
  
  const found: string[] = [];
  const missing: string[] = [];
  let totalMatches = 0;
  
  targetKeywords.forEach(keyword => {
    const normalizedKeyword = keyword.toLowerCase().trim();
    let matches = 0;
    
    // Handle multi-word phrases vs single words differently
    if (normalizedKeyword.includes(' ')) {
      // For phrases, use indexOf to find exact matches
      let index = 0;
      while ((index = text.indexOf(normalizedKeyword, index)) !== -1) {
        matches++;
        index += normalizedKeyword.length;
      }
    } else {
      // For single words, use word boundary regex to avoid partial matches
      const regex = new RegExp(`\\b${normalizedKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\// Function to analyze keyword presence in resume text
export const analyzeKeywordPresence = (
  resumeText: string,
  targetKeywords: string[]
): {
  found: string[];
  missing: string[];
  density: number;
  score: number;
} => {
  const text = resumeText.toLowerCase();
  const words = text.split(/\s+/).length;
  
  const found = targetKeywords.filter(keyword => 
    text.includes(keyword.toLowerCase())
  );
  
  const missing = targetKeywords.filter(keyword => 
    !text.includes(keyword.toLowerCase())
  );
  
  const density = (found.length / words) * 100;
  const score = Math.min(100, (found.length / targetKeywords.length) * 100);
  
  return { found, missing, density, score };
};')}\\b`, 'gi');
      const regexMatches = text.match(regex);
      matches = regexMatches ? regexMatches.length : 0;
    }
    
    if (matches > 0) {
      found.push(keyword);
      totalMatches += matches;
    } else {
      missing.push(keyword);
    }
  });
  
  // Calculate density as percentage of total word count
  const density = words > 0 ? (totalMatches / words) * 100 : 0;
  
  // Score based on unique keywords found (0-100%)
  const score = Math.min(100, (found.length / Math.max(targetKeywords.length, 1)) * 100);
  
  return { found, missing, totalMatches, density, score };
};

// Utility function to analyze keyword density status and provide feedback
export const analyzeKeywordDensity = (density: number): {
  status: 'too_low' | 'optimal' | 'too_high';
  message: string;
  recommendation: string;
} => {
  const { min, max, target } = keywordGuidelines.optimal_density_percent;
  
  if (density < min) {
    return {
      status: 'too_low',
      message: `Keyword density is ${density.toFixed(1)}% (target: ${target}%)`,
      recommendation: 'Add more relevant industry keywords throughout your resume, especially in the experience and summary sections.'
    };
  } else if (density > max) {
    return {
      status: 'too_high', 
      message: `Keyword density is ${density.toFixed(1)}% (target: ${target}%)`,
      recommendation: 'Reduce keyword repetition to avoid appearing spammy. Focus on natural language and context.'
    };
  } else {
    return {
      status: 'optimal',
      message: `Keyword density is ${density.toFixed(1)}% (optimal range)`,
      recommendation: 'Great! Your keyword density is in the optimal range for ATS systems.'
    };
  }
};

// Utility function to get industry from job title
export const detectIndustryFromJobTitle = (jobTitle: string): IndustryKey => {
  const normalizedTitle = jobTitle.toLowerCase().trim();
  
  // Check direct matches first
  for (const [industry, variations] of Object.entries(jobTitleVariations)) {
    if (variations.some(variation => 
      normalizedTitle.includes(variation.toLowerCase()) ||
      variation.toLowerCase().includes(normalizedTitle)
    )) {
      return industry as IndustryKey;
    }
  }
  
  // Check partial matches for industry keywords
  if (normalizedTitle.includes('engineer') || normalizedTitle.includes('developer') || normalizedTitle.includes('programmer')) {
    return 'Software Engineer';
  } else if (normalizedTitle.includes('data') || normalizedTitle.includes('analyst') || normalizedTitle.includes('scientist')) {
    return 'Data Scientist';
  } else if (normalizedTitle.includes('marketing') || normalizedTitle.includes('brand')) {
    return 'Marketing Manager';
  } else if (normalizedTitle.includes('project') || normalizedTitle.includes('program') || normalizedTitle.includes('scrum')) {
    return 'Project Manager';
  } else if (normalizedTitle.includes('sales') || normalizedTitle.includes('account')) {
    return 'Sales Representative';
  } else if (normalizedTitle.includes('nurse') || normalizedTitle.includes('nursing')) {
    return 'Registered Nurse';
  } else if (normalizedTitle.includes('electric')) {
    return 'Electrician';
  } else if (normalizedTitle.includes('design') || normalizedTitle.includes('graphic')) {
    return 'Graphic Designer';
  } else if (normalizedTitle.includes('financial') || normalizedTitle.includes('finance')) {
    return 'Financial Analyst';
  } else if (normalizedTitle.includes('hr') || normalizedTitle.includes('human resources') || normalizedTitle.includes('recruiter')) {
    return 'Human Resources';
  }
  
  // Default fallback
  return 'Software Engineer';
};

export default {
  actionVerbsByCategory,
  atsByIndustry,
  universalAtsKeywords,
  jobTitleVariations,
  highImpactKeywords,
  keywordsToAvoid,
  keywordGuidelines,
  getRelevantKeywords,
  analyzeKeywordPresence,
  analyzeKeywordDensity,
  detectIndustryFromJobTitle
};