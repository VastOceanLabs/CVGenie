/**
 * ATS Keywords Database
 * 
 * Comprehensive collection of industry-specific keywords optimized for ATS parsing.
 * Keywords are weighted by importance and categorized for better matching.
 */

// Industry-specific ATS keywords with importance weights
export const atsKeywordsByIndustry = {
  'Software Engineer': {
    technical: {
      high: [
        'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'TypeScript',
        'AWS', 'Docker', 'Kubernetes', 'REST API', 'SQL', 'Git',
        'CI/CD', 'Microservices', 'Cloud Computing', 'Agile'
      ],
      medium: [
        'MongoDB', 'PostgreSQL', 'Redis', 'GraphQL', 'Vue.js', 'Angular',
        'Express.js', 'Django', 'Spring Boot', 'Jenkins', 'Terraform',
        'Linux', 'DevOps', 'Test-Driven Development', 'JIRA'
      ],
      low: [
        'Webpack', 'Babel', 'ESLint', 'npm', 'yarn', 'Prettier',
        'VS Code', 'IntelliJ', 'Chrome DevTools', 'Postman'
      ]
    },
    soft: [
      'Problem Solving', 'Team Collaboration', 'Communication',
      'Leadership', 'Mentoring', 'Code Review', 'Technical Documentation',
      'Project Management', 'Critical Thinking', 'Adaptability'
    ],
    action: [
      'Developed', 'Implemented', 'Designed', 'Built', 'Optimized',
      'Deployed', 'Maintained', 'Architected', 'Integrated', 'Debugged',
      'Refactored', 'Automated', 'Scaled', 'Migrated', 'Collaborated'
    ]
  },

  'Data Scientist': {
    technical: {
      high: [
        'Python', 'R', 'Machine Learning', 'Deep Learning', 'SQL',
        'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'Scikit-learn',
        'Statistical Analysis', 'Data Visualization', 'Big Data', 'AI'
      ],
      medium: [
        'Tableau', 'Power BI', 'Spark', 'Hadoop', 'Jupyter', 'Git',
        'A/B Testing', 'Neural Networks', 'NLP', 'Computer Vision',
        'Time Series Analysis', 'Predictive Modeling', 'AWS', 'Azure'
      ],
      low: [
        'Matplotlib', 'Seaborn', 'Plotly', 'Excel', 'MATLAB',
        'SAS', 'SPSS', 'Kafka', 'Airflow', 'Docker'
      ]
    },
    soft: [
      'Data Storytelling', 'Business Acumen', 'Problem Solving',
      'Communication', 'Presentation Skills', 'Stakeholder Management',
      'Critical Thinking', 'Curiosity', 'Attention to Detail'
    ],
    action: [
      'Analyzed', 'Modeled', 'Predicted', 'Visualized', 'Discovered',
      'Optimized', 'Implemented', 'Trained', 'Evaluated', 'Deployed',
      'Interpreted', 'Presented', 'Validated', 'Extracted', 'Transformed'
    ]
  },

  'Marketing Manager': {
    technical: {
      high: [
        'Digital Marketing', 'SEO', 'SEM', 'Google Analytics', 'Social Media Marketing',
        'Content Marketing', 'Email Marketing', 'Marketing Automation', 'CRM',
        'Lead Generation', 'Campaign Management', 'ROI Analysis', 'Brand Management'
      ],
      medium: [
        'HubSpot', 'Salesforce', 'Google Ads', 'Facebook Ads', 'LinkedIn Marketing',
        'A/B Testing', 'Conversion Optimization', 'Marketing Analytics', 'Mailchimp',
        'Adobe Creative Suite', 'Content Management Systems', 'PPC', 'Influencer Marketing'
      ],
      low: [
        'Hootsuite', 'Buffer', 'Canva', 'WordPress', 'SEMrush', 'Ahrefs',
        'Marketo', 'Pardot', 'Google Tag Manager', 'Hotjar'
      ]
    },
    soft: [
      'Strategic Planning', 'Creative Thinking', 'Leadership', 'Communication',
      'Project Management', 'Data Analysis', 'Presentation Skills',
      'Team Collaboration', 'Budget Management', 'Negotiation'
    ],
    action: [
      'Developed', 'Launched', 'Managed', 'Increased', 'Generated',
      'Optimized', 'Executed', 'Analyzed', 'Created', 'Implemented',
      'Drove', 'Coordinated', 'Strategized', 'Measured', 'Improved'
    ]
  },

  'Project Manager': {
    technical: {
      high: [
        'Project Management', 'Agile', 'Scrum', 'PMP', 'Stakeholder Management',
        'Risk Management', 'Budget Management', 'Resource Allocation',
        'Project Planning', 'MS Project', 'JIRA', 'Waterfall', 'Kanban'
      ],
      medium: [
        'Change Management', 'Quality Assurance', 'Sprint Planning', 'Confluence',
        'Asana', 'Trello', 'Gantt Charts', 'Critical Path', 'Earned Value',
        'Portfolio Management', 'Program Management', 'Slack', 'Teams'
      ],
      low: [
        'Monday.com', 'Basecamp', 'Smartsheet', 'Wrike', 'ClickUp',
        'Notion', 'Excel', 'PowerPoint', 'Visio', 'SharePoint'
      ]
    },
    soft: [
      'Leadership', 'Communication', 'Problem Solving', 'Negotiation',
      'Team Building', 'Conflict Resolution', 'Time Management',
      'Decision Making', 'Adaptability', 'Strategic Thinking'
    ],
    action: [
      'Led', 'Managed', 'Delivered', 'Coordinated', 'Implemented',
      'Planned', 'Executed', 'Monitored', 'Facilitated', 'Optimized',
      'Streamlined', 'Negotiated', 'Resolved', 'Aligned', 'Achieved'
    ]
  },

  'Sales Representative': {
    technical: {
      high: [
        'Sales', 'CRM', 'Lead Generation', 'Account Management', 'B2B Sales',
        'B2C Sales', 'Sales Pipeline', 'Prospecting', 'Cold Calling',
        'Salesforce', 'Negotiation', 'Closing', 'Territory Management'
      ],
      medium: [
        'Sales Analytics', 'Sales Forecasting', 'Solution Selling', 'HubSpot',
        'LinkedIn Sales Navigator', 'Email Marketing', 'Presentation Skills',
        'Product Knowledge', 'Customer Relationship Management', 'Objection Handling'
      ],
      low: [
        'Zoom', 'Microsoft Office', 'Pipedrive', 'Outreach', 'SalesLoft',
        'ZoomInfo', 'Gong', 'Chorus', 'DocuSign', 'Calendly'
      ]
    },
    soft: [
      'Communication', 'Persuasion', 'Listening Skills', 'Empathy',
      'Persistence', 'Time Management', 'Relationship Building',
      'Problem Solving', 'Adaptability', 'Self-Motivation'
    ],
    action: [
      'Sold', 'Exceeded', 'Generated', 'Closed', 'Negotiated',
      'Developed', 'Cultivated', 'Presented', 'Achieved', 'Increased',
      'Expanded', 'Converted', 'Qualified', 'Managed', 'Secured'
    ]
  },

  'Registered Nurse': {
    technical: {
      high: [
        'Patient Care', 'Clinical Skills', 'Medication Administration',
        'IV Therapy', 'Patient Assessment', 'Electronic Health Records',
        'BLS', 'ACLS', 'Emergency Response', 'HIPAA Compliance',
        'Infection Control', 'Vital Signs', 'Clinical Documentation'
      ],
      medium: [
        'Wound Care', 'Pain Management', 'Patient Education', 'Discharge Planning',
        'Care Coordination', 'Medical Terminology', 'Phlebotomy', 'EKG',
        'Telemetry', 'Critical Care', 'Pediatric Care', 'Geriatric Care'
      ],
      low: [
        'Epic', 'Cerner', 'Meditech', 'IV Pumps', 'Ventilators',
        'Patient Monitors', 'Glucometers', 'Pulse Oximeters'
      ]
    },
    soft: [
      'Compassion', 'Communication', 'Empathy', 'Teamwork',
      'Critical Thinking', 'Attention to Detail', 'Stress Management',
      'Time Management', 'Cultural Sensitivity', 'Patient Advocacy'
    ],
    action: [
      'Administered', 'Assessed', 'Monitored', 'Documented', 'Educated',
      'Collaborated', 'Implemented', 'Coordinated', 'Managed', 'Provided',
      'Evaluated', 'Assisted', 'Maintained', 'Communicated', 'Advocated'
    ]
  },

  'Electrician': {
    technical: {
      high: [
        'Electrical Installation', 'Wiring', 'Circuit Breakers', 'NEC Code',
        'Troubleshooting', 'Blueprint Reading', 'Electrical Systems',
        'Safety Compliance', 'OSHA', 'Power Distribution', 'Motor Controls',
        'Conduit Installation', 'Panel Installation', 'Voltage Testing'
      ],
      medium: [
        'PLC Programming', 'Industrial Electrical', 'Residential Wiring',
        'Commercial Electrical', 'Fire Alarm Systems', 'Low Voltage',
        'Transformer Installation', 'Generator Installation', 'Lighting Systems',
        'Grounding Systems', 'Arc Flash Safety', 'Lockout/Tagout'
      ],
      low: [
        'Multimeter', 'Wire Strippers', 'Conduit Benders', 'Power Tools',
        'Hand Tools', 'Voltage Testers', 'Fish Tape', 'Cable Pullers'
      ]
    },
    soft: [
      'Safety Consciousness', 'Problem Solving', 'Attention to Detail',
      'Physical Stamina', 'Customer Service', 'Teamwork',
      'Time Management', 'Communication', 'Reliability', 'Manual Dexterity'
    ],
    action: [
      'Installed', 'Repaired', 'Maintained', 'Troubleshot', 'Wired',
      'Tested', 'Inspected', 'Upgraded', 'Diagnosed', 'Connected',
      'Replaced', 'Configured', 'Commissioned', 'Calibrated', 'Documented'
    ]
  },

  'Teacher': {
    technical: {
      high: [
        'Curriculum Development', 'Lesson Planning', 'Classroom Management',
        'Student Assessment', 'Differentiated Instruction', 'Educational Technology',
        'Common Core', 'IEP', 'Parent Communication', 'Grade Level Standards',
        'Learning Objectives', 'Student Engagement', 'Behavior Management'
      ],
      medium: [
        'Google Classroom', 'Smart Board', 'Microsoft Office', 'Zoom',
        'Canvas', 'Blackboard', 'Formative Assessment', 'Summative Assessment',
        'Project-Based Learning', 'Collaborative Learning', 'Distance Learning'
      ],
      low: [
        'PowerSchool', 'Schoology', 'Remind', 'ClassDojo', 'Kahoot',
        'Quizlet', 'Padlet', 'Flipgrid', 'Nearpod', 'Seesaw'
      ]
    },
    soft: [
      'Patience', 'Communication', 'Creativity', 'Empathy',
      'Organization', 'Flexibility', 'Leadership', 'Collaboration',
      'Problem Solving', 'Cultural Awareness'
    ],
    action: [
      'Taught', 'Developed', 'Implemented', 'Assessed', 'Created',
      'Facilitated', 'Mentored', 'Adapted', 'Engaged', 'Motivated',
      'Evaluated', 'Collaborated', 'Differentiated', 'Managed', 'Inspired'
    ]
  },

  'Graphic Designer': {
    technical: {
      high: [
        'Adobe Creative Suite', 'Photoshop', 'Illustrator', 'InDesign',
        'Typography', 'Color Theory', 'Layout Design', 'Brand Identity',
        'Visual Communication', 'UI/UX Design', 'Digital Design', 'Print Design'
      ],
      medium: [
        'Sketch', 'Figma', 'After Effects', 'Premiere Pro', 'XD',
        'Web Design', 'Logo Design', 'Packaging Design', 'Motion Graphics',
        'Vector Graphics', 'Photo Editing', 'Marketing Materials'
      ],
      low: [
        'Canva', 'Procreate', 'CorelDRAW', 'Affinity Designer',
        'HTML/CSS', 'WordPress', 'Dribbble', 'Behance'
      ]
    },
    soft: [
      'Creativity', 'Attention to Detail', 'Communication', 'Time Management',
      'Client Relations', 'Problem Solving', 'Collaboration',
      'Conceptual Thinking', 'Adaptability', 'Critique Reception'
    ],
    action: [
      'Designed', 'Created', 'Developed', 'Illustrated', 'Conceptualized',
      'Produced', 'Collaborated', 'Presented', 'Refined', 'Branded',
      'Visualized', 'Executed', 'Art Directed', 'Rendered', 'Optimized'
    ]
  },

  'Financial Analyst': {
    technical: {
      high: [
        'Financial Analysis', 'Excel', 'Financial Modeling', 'Budgeting',
        'Forecasting', 'Financial Reporting', 'Data Analysis', 'SQL',
        'Financial Statements', 'Valuation', 'Risk Analysis', 'ROI Analysis'
      ],
      medium: [
        'Bloomberg Terminal', 'Power BI', 'Tableau', 'QuickBooks', 'SAP',
        'Oracle', 'Python', 'VBA', 'Financial Planning', 'Cost Analysis',
        'Variance Analysis', 'Capital Budgeting', 'Treasury Management'
      ],
      low: [
        'Alteryx', 'Anaplan', 'Hyperion', 'NetSuite', 'Workday',
        'FactSet', 'S&P Capital IQ', 'PitchBook', 'Refinitiv'
      ]
    },
    soft: [
      'Analytical Thinking', 'Attention to Detail', 'Communication',
      'Problem Solving', 'Time Management', 'Presentation Skills',
      'Critical Thinking', 'Business Acumen', 'Teamwork', 'Integrity'
    ],
    action: [
      'Analyzed', 'Forecasted', 'Modeled', 'Evaluated', 'Prepared',
      'Presented', 'Recommended', 'Optimized', 'Monitored', 'Developed',
      'Calculated', 'Reviewed', 'Assessed', 'Reported', 'Streamlined'
    ]
  }
};

// Common ATS keywords across all industries
export const universalATSKeywords = {
  skills: [
    'Leadership', 'Communication', 'Problem Solving', 'Teamwork',
    'Time Management', 'Microsoft Office', 'Project Management',
    'Data Analysis', 'Customer Service', 'Strategic Planning',
    'Budget Management', 'Process Improvement', 'Quality Assurance',
    'Training', 'Compliance', 'Innovation', 'Negotiation',
    'Presentation Skills', 'Analytical Skills', 'Detail-Oriented'
  ],
  achievements: [
    'Increased', 'Improved', 'Reduced', 'Achieved', 'Exceeded',
    'Generated', 'Saved', 'Streamlined', 'Optimized', 'Delivered',
    'Launched', 'Implemented', 'Spearheaded', 'Transformed', 'Drove'
  ],
  metrics: [
    'Revenue', 'Efficiency', 'Productivity', 'Performance', 'ROI',
    'Cost Savings', 'Customer Satisfaction', 'Quality', 'Accuracy',
    'Growth', 'Sales', 'Profit', 'Market Share', 'Retention', 'Engagement'
  ]
};

// Keywords that often trigger ATS filters (to avoid)
export const atsProblematicTerms = [
  'References available upon request', // Outdated
  'Responsible for', // Weak action verb
  'Duties included', // Passive language
  'Team player', // Overused cliché
  'Hard worker', // Vague and overused
  'Go-getter', // Informal
  'Think outside the box', // Cliché
  'Synergy', // Corporate jargon
  'Self-starter', // Overused
  'Results-driven', // Vague without specifics
];

// ATS-friendly formatting keywords
export const atsFormattingKeywords = {
  sections: [
    'Professional Summary', 'Work Experience', 'Education',
    'Skills', 'Certifications', 'Professional Experience',
    'Technical Skills', 'Core Competencies', 'Achievements',
    'Professional Development', 'Additional Information'
  ],
  dateFormats: [
    'MM/YYYY', 'Month YYYY', 'January 2023', '01/2023',
    'Jan 2023', 'Present', 'Current'
  ],
  educationTerms: [
    'Bachelor', 'Master', 'PhD', 'Associate', 'Degree',
    'University', 'College', 'Certificate', 'Certification',
    'GPA', 'Honors', 'Cum Laude', 'Dean\'s List'
  ]
};

// Function to get ATS keywords for a specific job title
export const getATSKeywords = (jobTitle: string): {
  technical: string[];
  soft: string[];
  action: string[];
} => {
  // Find exact match first
  if (atsKeywordsByIndustry[jobTitle]) {
    const keywords = atsKeywordsByIndustry[jobTitle];
    return {
      technical: [
        ...(keywords.technical.high || []),
        ...(keywords.technical.medium || []),
        ...(keywords.technical.low || [])
      ],
      soft: keywords.soft || [],
      action: keywords.action || []
    };
  }

  // Try to find partial match
  const partialMatch = Object.keys(atsKeywordsByIndustry).find(key =>
    jobTitle.toLowerCase().includes(key.toLowerCase()) ||
    key.toLowerCase().includes(jobTitle.toLowerCase())
  );

  if (partialMatch) {
    const keywords = atsKeywordsByIndustry[partialMatch];
    return {
      technical: [
        ...(keywords.technical.high || []),
        ...(keywords.technical.medium || []),
        ...(keywords.technical.low || [])
      ],
      soft: keywords.soft || [],
      action: keywords.action || []
    };
  }

  // Return universal keywords as fallback
  return {
    technical: universalATSKeywords.skills,
    soft: universalATSKeywords.skills,
    action: universalATSKeywords.achievements
  };
};

// Function to calculate ATS score based on keyword matches
export const calculateATSScore = (
  resumeText: string,
  jobTitle: string,
  options: {
    includeUniversal?: boolean;
    strictMatching?: boolean;
  } = {}
): {
  score: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
} => {
  const { includeUniversal = true, strictMatching = false } = options;
  
  const keywords = getATSKeywords(jobTitle);
  const allKeywords = [
    ...keywords.technical,
    ...keywords.soft,
    ...keywords.action,
    ...(includeUniversal ? universalATSKeywords.skills : [])
  ];

  const uniqueKeywords = [...new Set(allKeywords)];
  const normalizedResume = resumeText.toLowerCase();
  
  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  uniqueKeywords.forEach(keyword => {
    const normalizedKeyword = keyword.toLowerCase();
    const isMatch = strictMatching
      ? new RegExp(`\\b${normalizedKeyword}\\b`).test(normalizedResume)
      : normalizedResume.includes(normalizedKeyword);

    if (isMatch) {
      matchedKeywords.push(keyword);
    } else {
      missingKeywords.push(keyword);
    }
  });

  // Calculate score (weighted by keyword importance)
  const technicalMatches = keywords.technical.filter(k =>
    matchedKeywords.includes(k)
  ).length;
  const softMatches = keywords.soft.filter(k =>
    matchedKeywords.includes(k)
  ).length;
  const actionMatches = keywords.action.filter(k =>
    matchedKeywords.includes(k)
  ).length;

  // Weight technical skills higher for technical roles
  const isTechnicalRole = ['Engineer', 'Developer', 'Analyst', 'Scientist'].some(
    term => jobTitle.includes(term)
  );

  const technicalWeight = isTechnicalRole ? 0.5 : 0.3;
  const softWeight = 0.3;
  const actionWeight = 0.2;

  const score = Math.round(
    ((technicalMatches / Math.max(keywords.technical.length, 1)) * technicalWeight +
     (softMatches / Math.max(keywords.soft.length, 1)) * softWeight +
     (actionMatches / Math.max(keywords.action.length, 1)) * actionWeight) * 100
  );

  // Generate suggestions based on missing high-value keywords
  const suggestions = missingKeywords
    .filter(keyword => {
      const industry = atsKeywordsByIndustry[jobTitle];
      return industry?.technical?.high?.includes(keyword) ||
             industry?.soft?.slice(0, 5).includes(keyword);
    })
    .slice(0, 5);

  return {
    score: Math.min(score, 100),
    matchedKeywords,
    missingKeywords,
    suggestions
  };
};

// Function to analyze keyword density
export const analyzeKeywordDensity = (
  resumeText: string,
  targetKeywords: string[]
): Record<string, { count: number; density: number }> => {
  const wordCount = resumeText.split(/\s+/).length;
  const density: Record<string, { count: number; density: number }> = {};

  targetKeywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    const matches = resumeText.match(regex) || [];
    const count = matches.length;
    
    density[keyword] = {
      count,
      density: (count / wordCount) * 100
    };
  });

  return density;
};

// Function to suggest keyword improvements
export const suggestKeywordImprovements = (
  currentKeywords: string[],
  jobTitle: string,
  targetCount: number = 10
): {
  add: string[];
  remove: string[];
  optimize: Array<{ keyword: string; suggestion: string }>;
} => {
  const recommendedKeywords = getATSKeywords(jobTitle);
  const allRecommended = [
    ...recommendedKeywords.technical,
    ...recommendedKeywords.soft
  ];

  // Keywords to add (high-value missing keywords)
  const add = allRecommended
    .filter(keyword => !currentKeywords.some(
      ck => ck.toLowerCase() === keyword.toLowerCase()
    ))
    .slice(0, targetCount);

  // Keywords to remove (problematic or low-value)
  const remove = currentKeywords.filter(keyword =>
    atsProblematicTerms.some(term =>
      keyword.toLowerCase().includes(term.toLowerCase())
    )
  );

  // Keywords to optimize (suggest better alternatives)
  const optimize: Array<{ keyword: string; suggestion: string }> = [];
  
  currentKeywords.forEach(keyword => {
    if (keyword.toLowerCase().includes('responsible for')) {
      optimize.push({
        keyword,
        suggestion: keyword.replace(/responsible for/i, 'Managed')
      });
    }
    if (keyword.toLowerCase().includes('duties included')) {
      optimize.push({
        keyword,
        suggestion: keyword.replace(/duties included/i, 'Accomplished')
      });
    }
  });

  return { add, remove, optimize };
};

// Function to analyze keyword presence in resume text with accurate counting
export const analyzeKeywordPresence = (
  resumeText: string,
  keywords: string[],
  options: {
    caseSensitive?: boolean;
    wholeWord?: boolean;
    includeVariations?: boolean;
  } = {}
): { 
  present: string[]; 
  missing: string[]; 
  counts: Record<string, number> 
} => {
  const { 
    caseSensitive = false, 
    wholeWord = true,
    includeVariations = true 
  } = options;

  const normalizedText = caseSensitive ? resumeText : resumeText.toLowerCase();
  const present: string[] = [];
  const missing: string[] = [];
  const counts: Record<string, number> = {};

  keywords.forEach(keyword => {
    const normalizedKeyword = caseSensitive ? keyword : keyword.toLowerCase();
    let pattern: RegExp;
    
    if (wholeWord) {
      // Escape special regex characters and create word boundary pattern
      const escapedKeyword = normalizedKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      pattern = new RegExp(`\\b${escapedKeyword}\\b`, caseSensitive ? 'g' : 'gi');
    } else {
      // Escape special regex characters for partial match
      const escapedKeyword = normalizedKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      pattern = new RegExp(escapedKeyword, caseSensitive ? 'g' : 'gi');
    }
    
    const matches = (normalizedText.match(pattern) || []).length;
    
    if (matches > 0) {
      present.push(keyword);
      counts[keyword] = matches;
    } else {
      missing.push(keyword);
      counts[keyword] = 0;
    }
  });

  return { present, missing, counts };
};

// Export all functions and constants
export default {
  atsKeywordsByIndustry,
  universalATSKeywords,
  atsProblematicTerms,
  atsFormattingKeywords,
  getATSKeywords,
  calculateATSScore,
  analyzeKeywordDensity,
  suggestKeywordImprovements,
  analyzeKeywordPresence
};