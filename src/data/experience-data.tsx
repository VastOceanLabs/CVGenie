// Industry-specific experience phrases and ATS keywords
export interface ExperienceData {
  experiencePhrases: {
    [jobTitle: string]: {
      achievements: string[];
      responsibilities: string[];
    };
  };
  actionVerbsByCategory: {
    [category: string]: string[];
  };
  atsKeywords: {
    [jobTitle: string]: string[];
  };
}

// Comprehensive experience data for multiple industries
export const experienceData: ExperienceData = {
  experiencePhrases: {
    'Software Engineer': {
      achievements: [
        'Increased application performance by 50% through database optimization and caching strategies',
        'Led migration of legacy systems to cloud infrastructure, reducing operational costs by 30%',
        'Developed microservices architecture serving 100K+ daily active users',
        'Reduced deployment time from 4 hours to 15 minutes through CI/CD automation',
        'Improved code quality metrics by 40% through implementation of automated testing',
        'Mentored 5 junior developers, accelerating their onboarding by 60%',
        'Built real-time data processing pipeline handling 1M+ events per day',
        'Optimized API response times by 75% through efficient algorithms and indexing'
      ],
      responsibilities: [
        'Developed and maintained web applications using React, Node.js, and TypeScript',
        'Collaborated with cross-functional teams to deliver features on schedule',
        'Participated in code reviews and maintained high coding standards',
        'Designed and implemented RESTful APIs and GraphQL endpoints',
        'Integrated third-party services and APIs for enhanced functionality',
        'Troubleshot production issues and implemented monitoring solutions',
        'Contributed to technical documentation and knowledge sharing sessions',
        'Implemented security best practices and vulnerability assessments'
      ]
    },
    'Electrician': {
      achievements: [
        'Completed 200+ residential electrical installations with zero safety incidents',
        'Reduced project completion time by 25% through efficient workflow optimization',
        'Achieved 98% customer satisfaction rating across 150+ service calls',
        'Led electrical team of 4 technicians on commercial construction project',
        'Identified and resolved critical electrical faults, preventing potential fire hazards',
        'Implemented energy-efficient solutions saving clients average of $500 annually',
        'Maintained perfect safety record across 3 years of high-voltage work',
        'Upgraded 50+ electrical panels to meet current code requirements'
      ],
      responsibilities: [
        'Installed, maintained, and repaired electrical systems in residential and commercial buildings',
        'Interpreted blueprints, electrical schematics, and building codes',
        'Performed electrical inspections and ensured compliance with safety regulations',
        'Troubleshot electrical problems using multimeters and diagnostic equipment',
        'Installed conduit, wiring, outlets, and electrical panels',
        'Collaborated with contractors and other trades on construction projects',
        'Maintained inventory of electrical supplies and tools',
        'Provided cost estimates and consulted with customers on electrical needs'
      ]
    },
    'Marketing Manager': {
      achievements: [
        'Increased brand awareness by 150% through integrated digital marketing campaigns',
        'Generated $2M in qualified leads through targeted content marketing strategy',
        'Improved email campaign open rates by 40% through A/B testing and optimization',
        'Launched successful product campaign resulting in 300% increase in sales',
        'Reduced customer acquisition cost by 35% while maintaining lead quality',
        'Built social media following from 5K to 50K engaged followers in 18 months',
        'Achieved 25% increase in website traffic through SEO optimization',
        'Managed $500K annual marketing budget with 20% year-over-year ROI improvement'
      ],
      responsibilities: [
        'Developed and executed comprehensive marketing strategies across digital channels',
        'Managed social media presence and content calendar for multiple platforms',
        'Analyzed marketing metrics and prepared performance reports for leadership',
        'Coordinated with design and content teams to create compelling marketing materials',
        'Conducted market research and competitive analysis to inform strategy',
        'Managed vendor relationships and negotiated contracts with marketing agencies',
        'Led cross-functional teams on product launches and promotional campaigns',
        'Optimized marketing automation workflows and email marketing campaigns'
      ]
    },
    'Nurse': {
      achievements: [
        'Maintained 99% patient satisfaction scores across 500+ patient interactions',
        'Reduced medication errors by 40% through implementation of double-check protocols',
        'Led quality improvement initiative resulting in 20% faster patient discharge times',
        'Mentored 8 new graduate nurses, improving retention rate by 30%',
        'Achieved Advanced Cardiac Life Support (ACLS) certification with perfect scores',
        'Coordinated care for 30+ patients daily while maintaining excellent outcomes',
        'Implemented evidence-based practices improving patient recovery times by 15%',
        'Recognized as "Nurse of the Month" 3 times for exceptional patient care'
      ],
      responsibilities: [
        'Provided direct patient care including assessment, medication administration, and monitoring',
        'Collaborated with physicians and healthcare team to develop care plans',
        'Documented patient information accurately in electronic health records',
        'Educated patients and families on health conditions and treatment plans',
        'Operated medical equipment and assisted with diagnostic procedures',
        'Maintained infection control protocols and ensured patient safety',
        'Responded to medical emergencies and provided life-saving interventions',
        'Participated in quality improvement initiatives and continuing education'
      ]
    },
    'Project Manager': {
      achievements: [
        'Successfully delivered 15+ projects on time and 10% under budget over 2 years',
        'Improved team productivity by 30% through implementation of Agile methodologies',
        'Reduced project risks by 50% through proactive stakeholder communication',
        'Led cross-functional teams of up to 20 members across multiple departments',
        'Achieved 95% client satisfaction rating across all managed projects',
        'Streamlined project workflows reducing delivery time by 25%',
        'Obtained PMP certification and trained 5 team members in project management',
        'Managed project portfolios worth $5M+ with zero budget overruns'
      ],
      responsibilities: [
        'Planned, executed, and monitored projects from initiation to closure',
        'Coordinated resources and managed project timelines and deliverables',
        'Facilitated stakeholder meetings and provided regular project updates',
        'Identified and mitigated project risks throughout project lifecycle',
        'Managed project budgets and tracked financial performance',
        'Created project documentation including plans, schedules, and reports',
        'Led change management initiatives and ensured smooth transitions',
        'Coached team members and resolved conflicts to maintain project momentum'
      ]
    },
    'Sales Representative': {
      achievements: [
        'Exceeded sales quotas by 125% for three consecutive years',
        'Generated $3M+ in new business revenue within first 18 months',
        'Maintained 90% client retention rate through exceptional relationship management',
        'Closed 50+ new accounts including 5 enterprise-level contracts',
        'Ranked top 5% of sales team nationally for 2 consecutive years',
        'Increased territory revenue by 200% through strategic prospecting',
        'Built pipeline of $1.5M in qualified opportunities within 6 months',
        'Achieved President\'s Club recognition for outstanding sales performance'
      ],
      responsibilities: [
        'Prospected and qualified new business opportunities through cold calling and networking',
        'Managed full sales cycle from lead generation to contract closure',
        'Built and maintained relationships with key decision makers and stakeholders',
        'Conducted product demonstrations and presentations to potential clients',
        'Negotiated contracts and pricing terms to maximize revenue and client satisfaction',
        'Maintained accurate sales forecasts and pipeline data in CRM system',
        'Collaborated with technical teams to develop customized solutions',
        'Provided ongoing account management and support to existing clients'
      ]
    },
    'Data Scientist': {
      achievements: [
        'Developed machine learning models that improved prediction accuracy by 35%',
        'Built automated reporting system saving 20 hours of manual work per week',
        'Identified $500K in cost savings through data-driven operational insights',
        'Created customer segmentation model increasing marketing ROI by 40%',
        'Led data science team of 4 analysts on enterprise analytics platform',
        'Published 3 research papers on machine learning applications in industry',
        'Reduced model training time by 60% through feature engineering optimization',
        'Implemented A/B testing framework used across 50+ product experiments'
      ],
      responsibilities: [
        'Collected, cleaned, and analyzed large datasets to extract business insights',
        'Developed and deployed machine learning models for predictive analytics',
        'Created data visualizations and dashboards for stakeholder reporting',
        'Collaborated with engineering teams to implement data solutions in production',
        'Performed statistical analysis and hypothesis testing on business problems',
        'Designed and executed experiments to validate data science hypotheses',
        'Communicated complex analytical findings to non-technical stakeholders',
        'Maintained data pipelines and ensured data quality and integrity'
      ]
    },
    'Graphic Designer': {
      achievements: [
        'Increased client brand recognition by 80% through cohesive visual identity design',
        'Won 3 industry awards for creative excellence in brand design',
        'Completed 100+ design projects with 95% client satisfaction rating',
        'Reduced design iteration cycles by 40% through improved client communication',
        'Generated $200K in additional revenue through successful rebranding campaign',
        'Built design system used across 15+ marketing campaigns',
        'Mentored 2 junior designers, improving team productivity by 25%',
        'Created viral social media campaign reaching 2M+ impressions'
      ],
      responsibilities: [
        'Created visual concepts and designs for digital and print marketing materials',
        'Collaborated with marketing team to develop brand guidelines and style guides',
        'Designed website layouts, user interfaces, and user experience elements',
        'Prepared files for print production and coordinated with printing vendors',
        'Maintained brand consistency across all marketing touchpoints',
        'Created illustrations, infographics, and other visual content',
        'Presented design concepts to clients and incorporated feedback',
        'Managed multiple design projects simultaneously while meeting deadlines'
      ]
    },
    'Teacher': {
      achievements: [
        'Improved student test scores by 35% through innovative teaching methodologies',
        'Developed curriculum for 3 new courses adopted district-wide',
        'Mentored 12 new teachers, reducing first-year turnover by 40%',
        'Received "Teacher of the Year" award for outstanding student engagement',
        'Led professional development workshops attended by 100+ educators',
        'Implemented technology integration resulting in 50% increase in student participation',
        'Achieved 95% student satisfaction rating across 5 consecutive semesters',
        'Created assessment framework improving student learning outcomes by 25%'
      ],
      responsibilities: [
        'Planned and delivered engaging lessons aligned with curriculum standards',
        'Assessed student progress and provided constructive feedback',
        'Collaborated with colleagues to develop interdisciplinary learning experiences',
        'Communicated regularly with parents regarding student progress and concerns',
        'Participated in professional development and continuing education programs',
        'Maintained accurate records of attendance, grades, and behavioral observations',
        'Adapted teaching methods to accommodate diverse learning styles and needs',
        'Supervised students during classroom activities and field trips'
      ]
    },
    'Financial Analyst': {
      achievements: [
        'Identified $2M in cost savings through comprehensive financial analysis',
        'Improved forecasting accuracy by 40% through advanced modeling techniques',
        'Led budgeting process for $50M annual operating budget',
        'Developed automated reporting system reducing analysis time by 60%',
        'Provided financial insights supporting 3 major strategic business decisions',
        'Achieved CFA Level II certification while maintaining full-time role',
        'Built financial models used across 5 business units',
        'Streamlined month-end close process reducing timeline by 3 days'
      ],
      responsibilities: [
        'Analyzed financial data and prepared detailed reports for management',
        'Created financial models and forecasts to support business planning',
        'Monitored budget performance and investigated variances',
        'Conducted investment analysis and due diligence for potential acquisitions',
        'Collaborated with accounting team to ensure data accuracy and integrity',
        'Presented financial findings to executives and department heads',
        'Maintained financial databases and implemented process improvements',
        'Assisted with annual audit and regulatory compliance requirements'
      ]
    },
    'Human Resources Manager': {
      achievements: [
        'Reduced employee turnover by 45% through improved retention strategies',
        'Implemented new HRIS system improving efficiency by 50%',
        'Led diversity initiative increasing workplace diversity by 35%',
        'Developed training programs resulting in 90% employee satisfaction',
        'Successfully managed 200+ employee performance reviews annually',
        'Achieved 100% compliance with federal and state employment regulations',
        'Reduced time-to-hire by 30% through streamlined recruitment process',
        'Created employee wellness program adopted company-wide'
      ],
      responsibilities: [
        'Managed full-cycle recruitment including sourcing, interviewing, and onboarding',
        'Developed and implemented HR policies and procedures',
        'Conducted employee performance evaluations and disciplinary actions',
        'Administered benefits programs and resolved employee relations issues',
        'Ensured compliance with employment laws and regulations',
        'Provided HR guidance and support to managers and employees',
        'Coordinated training and professional development programs',
        'Maintained confidential employee records and HR databases'
      ]
    }
  },

  actionVerbsByCategory: {
    leadership: [
      'Led', 'Managed', 'Supervised', 'Directed', 'Coordinated', 'Oversaw', 
      'Guided', 'Mentored', 'Coached', 'Spearheaded', 'Orchestrated', 'Championed'
    ],
    achievement: [
      'Achieved', 'Exceeded', 'Delivered', 'Accomplished', 'Attained', 'Surpassed',
      'Completed', 'Realized', 'Secured', 'Generated', 'Produced', 'Earned'
    ],
    improvement: [
      'Improved', 'Enhanced', 'Optimized', 'Streamlined', 'Upgraded', 'Refined',
      'Strengthened', 'Accelerated', 'Boosted', 'Elevated', 'Advanced', 'Transformed'
    ],
    creation: [
      'Developed', 'Created', 'Built', 'Designed', 'Established', 'Implemented',
      'Launched', 'Initiated', 'Founded', 'Constructed', 'Formulated', 'Pioneered'
    ],
    analysis: [
      'Analyzed', 'Evaluated', 'Assessed', 'Researched', 'Investigated', 'Examined',
      'Studied', 'Reviewed', 'Audited', 'Diagnosed', 'Measured', 'Calculated'
    ],
    communication: [
      'Presented', 'Communicated', 'Negotiated', 'Collaborated', 'Facilitated', 'Consulted',
      'Advised', 'Trained', 'Educated', 'Influenced', 'Persuaded', 'Engaged'
    ],
    technical: [
      'Programmed', 'Configured', 'Integrated', 'Automated', 'Deployed', 'Maintained',
      'Troubleshot', 'Debugged', 'Installed', 'Operated', 'Monitored', 'Calibrated'
    ],
    problem_solving: [
      'Resolved', 'Solved', 'Addressed', 'Identified', 'Corrected', 'Fixed',
      'Remediated', 'Eliminated', 'Prevented', 'Mitigated', 'Handled', 'Tackled'
    ],
    innovation: [
      'Innovated', 'Redesigned', 'Modernized', 'Revolutionized', 'Pioneered', 'Transformed',
      'Reimagined', 'Evolved', 'Adapted', 'Customized', 'Personalized', 'Tailored'
    ]
  },

  atsKeywords: {
    'Software Engineer': [
      'developed', 'built', 'implemented', 'programmed', 'coded', 'designed',
      'API', 'database', 'cloud', 'agile', 'git', 'testing', 'debugging',
      'javascript', 'python', 'react', 'node.js', 'sql', 'aws', 'docker',
      'microservices', 'CI/CD', 'DevOps', 'full-stack', 'frontend', 'backend'
    ],
    'Electrician': [
      'installed', 'maintained', 'repaired', 'wired', 'electrical', 'safety',
      'code compliance', 'troubleshot', 'circuits', 'panels', 'conduit',
      'voltage', 'NFPA', 'OSHA', 'licensed', 'certified', 'blueprints',
      'residential', 'commercial', 'industrial', 'high voltage', 'low voltage'
    ],
    'Marketing Manager': [
      'campaign', 'strategy', 'brand', 'digital marketing', 'SEO', 'analytics',
      'lead generation', 'ROI', 'social media', 'content', 'email marketing',
      'budget', 'market research', 'A/B testing', 'conversion', 'engagement',
      'PPC', 'Google Ads', 'Facebook Ads', 'marketing automation', 'CRM'
    ],
    'Nurse': [
      'patient care', 'clinical', 'medication', 'assessment', 'documentation',
      'healthcare', 'medical', 'treatment', 'safety', 'infection control',
      'EHR', 'vital signs', 'emergency', 'collaboration', 'education', 'protocols',
      'HIPAA', 'quality improvement', 'evidence-based practice', 'patient advocacy'
    ],
    'Project Manager': [
      'project management', 'agile', 'scrum', 'stakeholder', 'budget', 'timeline',
      'deliverables', 'risk management', 'coordination', 'planning', 'PMP',
      'methodology', 'cross-functional', 'leadership', 'communication', 'quality',
      'waterfall', 'kanban', 'resource management', 'vendor management'
    ],
    'Sales Representative': [
      'sales', 'revenue', 'quota', 'prospects', 'leads', 'CRM', 'negotiation',
      'closing', 'pipeline', 'territory', 'client relationships', 'presentations',
      'account management', 'forecasting', 'business development', 'networking',
      'cold calling', 'consultative selling', 'B2B', 'B2C', 'Salesforce'
    ],
    'Data Scientist': [
      'machine learning', 'python', 'SQL', 'statistics', 'analytics', 'modeling',
      'data visualization', 'algorithms', 'big data', 'predictive analytics',
      'A/B testing', 'statistical analysis', 'data mining', 'pandas', 'scikit-learn',
      'tensorflow', 'deep learning', 'artificial intelligence', 'data engineering'
    ],
    'Graphic Designer': [
      'design', 'creative', 'visual', 'branding', 'Adobe Creative Suite', 'Photoshop',
      'Illustrator', 'InDesign', 'typography', 'layout', 'print design', 'web design',
      'user interface', 'brand identity', 'marketing materials', 'illustration',
      'UI/UX', 'wireframes', 'prototyping', 'creative direction', 'visual communication'
    ],
    'Teacher': [
      'curriculum', 'lesson planning', 'assessment', 'classroom management', 'education',
      'instruction', 'learning outcomes', 'student engagement', 'differentiation',
      'professional development', 'collaboration', 'parent communication', 'data analysis',
      'educational technology', 'special needs', 'inclusive education', 'pedagogy'
    ],
    'Financial Analyst': [
      'financial modeling', 'forecasting', 'budgeting', 'variance analysis', 'valuation',
      'Excel', 'financial statements', 'due diligence', 'investment analysis', 'reporting',
      'data analysis', 'cost analysis', 'risk assessment', 'market research', 'CFA',
      'GAAP', 'financial planning', 'treasury', 'capital budgeting', 'ROI analysis'
    ],
    'Human Resources Manager': [
      'recruitment', 'talent acquisition', 'employee relations', 'performance management',
      'HRIS', 'compliance', 'benefits administration', 'training and development',
      'organizational development', 'diversity and inclusion', 'employment law',
      'compensation', 'employee engagement', 'onboarding', 'succession planning',
      'policy development', 'conflict resolution', 'workforce planning', 'SHRM'
    ]
  }
};

// Single default export - this fixes the TypeScript error
export default experienceData;