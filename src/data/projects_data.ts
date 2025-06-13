// Project types and examples database for resume builder
// Type-safe enums and configurations

// Design tokens for consistent theming
export const designTokens = {
  colors: {
    primary: 'bg-blue-100 text-blue-800',
    secondary: 'bg-green-100 text-green-800',
    accent: 'bg-purple-100 text-purple-800',
    warning: 'bg-orange-100 text-orange-800',
    info: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    neutral: 'bg-gray-100 text-gray-800',
    highlight: 'bg-indigo-100 text-indigo-800',
    success: 'bg-pink-100 text-pink-800'
  },
  statusIcons: {
    completed: '✓',
    inProgress: '🔄',
    onHold: '⏸️',
    concept: '💡',
    maintenance: '🔧'
  }
} as const;

// Project types with consistent camelCase naming
export const projectTypes = {
  professional: {
    label: 'Professional',
    description: 'Work-related projects completed for employers or clients',
    color: designTokens.colors.primary,
    priority: 1
  },
  personal: {
    label: 'Personal',
    description: 'Self-initiated projects to learn new skills or solve problems',
    color: designTokens.colors.secondary,
    priority: 2
  },
  openSource: {
    label: 'Open Source',
    description: 'Contributions to open source projects or community initiatives',
    color: designTokens.colors.accent,
    priority: 3
  },
  academic: {
    label: 'Academic',
    description: 'School or university projects, research, and coursework',
    color: designTokens.colors.warning,
    priority: 4
  },
  freelance: {
    label: 'Freelance',
    description: 'Client work completed as an independent contractor',
    color: designTokens.colors.info,
    priority: 5
  },
  startup: {
    label: 'Startup',
    description: 'Entrepreneurial ventures and business initiatives',
    color: designTokens.colors.danger,
    priority: 6
  },
  hackathon: {
    label: 'Hackathon',
    description: 'Projects built during coding competitions and events',
    color: designTokens.colors.highlight,
    priority: 7
  },
  volunteer: {
    label: 'Volunteer',
    description: 'Pro-bono work for non-profits and community organizations',
    color: designTokens.colors.success,
    priority: 8
  }
} as const;

// Project status with camelCase naming
export const projectStatus = {
  completed: {
    label: 'Completed',
    description: 'Project has been finished and deployed',
    color: designTokens.colors.secondary,
    icon: designTokens.statusIcons.completed
  },
  inProgress: {
    label: 'In Progress',
    description: 'Currently working on this project',
    color: designTokens.colors.primary,
    icon: designTokens.statusIcons.inProgress
  },
  onHold: {
    label: 'On Hold',
    description: 'Project temporarily paused',
    color: designTokens.colors.info,
    icon: designTokens.statusIcons.onHold
  },
  concept: {
    label: 'Concept',
    description: 'Project in planning or design phase',
    color: designTokens.colors.neutral,
    icon: designTokens.statusIcons.concept
  },
  maintenance: {
    label: 'Maintenance',
    description: 'Project completed but receiving ongoing updates',
    color: designTokens.colors.accent,
    icon: designTokens.statusIcons.maintenance
  }
} as const;

// Technology stacks organized by category (removed duplicates)
export const technologyStacks = {
  web: {
    frontend: [
      'React', 'Vue.js', 'Angular', 'Next.js', 'Nuxt.js', 'Svelte',
      'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Sass', 'Tailwind CSS',
      'Bootstrap', 'Material-UI', 'Chakra UI', 'Ant Design'
    ],
    backend: [
      'Node.js', 'Express.js', 'Django', 'Flask', 'FastAPI', 'Ruby on Rails',
      'ASP.NET', 'Spring Boot', 'Laravel', 'PHP', 'Go', 'Rust'
    ],
    database: [
      'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'DynamoDB',
      'Firebase', 'Supabase', 'Prisma', 'Sequelize'
    ],
    cloud: [
      'AWS', 'Google Cloud', 'Azure', 'Vercel', 'Netlify', 'Heroku',
      'DigitalOcean', 'Cloudflare'
    ]
  },
  mobile: {
    native: [
      'Swift', 'Kotlin', 'Java', 'Objective-C', 'Xcode', 'Android Studio'
    ],
    crossPlatform: [
      'React Native', 'Flutter', 'Ionic', 'Xamarin', 'Cordova', 'PhoneGap'
    ],
    tools: [
      'Expo', 'TestFlight', 'Firebase', 'App Store Connect', 'Google Play Console'
    ]
  },
  dataScience: {
    languages: [
      'Python', 'R', 'SQL', 'Scala', 'Julia', 'MATLAB'
    ],
    libraries: [
      'pandas', 'NumPy', 'scikit-learn', 'TensorFlow', 'PyTorch', 'Keras',
      'Matplotlib', 'Seaborn', 'Plotly', 'D3.js'
    ],
    tools: [
      'Jupyter', 'Apache Spark', 'Tableau', 'Power BI', 'Apache Airflow',
      'MLflow', 'Kubeflow'
    ]
  },
  devOps: {
    containerization: [
      'Docker', 'Kubernetes', 'Podman', 'LXC'
    ],
    cicd: [
      'Jenkins', 'GitHub Actions', 'GitLab CI', 'CircleCI', 'Travis CI',
      'Azure DevOps', 'TeamCity'
    ],
    monitoring: [
      'Prometheus', 'Grafana', 'ELK Stack', 'New Relic', 'DataDog',
      'Splunk', 'Nagios'
    ],
    infrastructure: [
      'Terraform', 'Ansible', 'Chef', 'Puppet', 'CloudFormation',
      'Helm', 'Istio'
    ]
  },
  design: {
    tools: [
      'Figma', 'Sketch', 'Adobe XD', 'Adobe Photoshop', 'Adobe Illustrator',
      'Canva', 'Framer', 'Principle', 'InVision'
    ],
    skills: [
      'UI/UX Design', 'Prototyping', 'Wireframing', 'User Research',
      'Design Systems', 'Responsive Design', 'Accessibility'
    ]
  }
} as const;

// Standardized industry keys (using consistent naming)
export const industryKeys = {
  softwareEngineer: 'Software Engineer',
  dataScientist: 'Data Scientist',
  marketingManager: 'Marketing Manager',
  projectManager: 'Project Manager',
  graphicDesigner: 'Graphic Designer',
  productManager: 'Product Manager',
  devOpsEngineer: 'DevOps Engineer'
} as const;

// Project examples by industry (using standardized keys)
export const projectExamplesByIndustry = {
  [industryKeys.softwareEngineer]: {
    professional: [
      {
        title: 'E-commerce Platform Redesign',
        description: 'Led complete redesign of company\'s e-commerce platform, improving user experience and increasing conversion rates by 35%. Implemented responsive design, optimized checkout flow, and integrated new payment systems.',
        technologies: ['React', 'Node.js', 'PostgreSQL', 'AWS', 'Stripe'],
        role: 'Lead Frontend Developer',
        metrics: '35% increase in conversion rate, 50% reduction in cart abandonment',
        teamSize: '8 developers',
        type: 'professional',
        status: 'completed'
      },
      {
        title: 'Microservices Migration',
        description: 'Migrated monolithic application to microservices architecture, improving scalability and reducing deployment time from hours to minutes. Implemented containerization and CI/CD pipelines.',
        technologies: ['Docker', 'Kubernetes', 'Node.js', 'MongoDB', 'Jenkins'],
        role: 'Backend Developer',
        metrics: '90% reduction in deployment time, 99.9% uptime achieved',
        teamSize: '12 developers',
        type: 'professional',
        status: 'completed'
      }
    ],
    personal: [
      {
        title: 'Personal Finance Tracker',
        description: 'Built a comprehensive personal finance application with expense tracking, budget management, and investment portfolio analysis. Features include data visualization and automated categorization.',
        technologies: ['React', 'Express.js', 'MongoDB', 'Chart.js', 'Plaid API'],
        role: 'Full Stack Developer',
        metrics: '500+ active users, 4.8/5 app store rating',
        teamSize: 'Solo project',
        type: 'personal',
        status: 'maintenance'
      },
      {
        title: 'Task Management CLI Tool',
        description: 'Created a command-line task management tool with features like project organization, time tracking, and progress reporting. Published as an npm package.',
        technologies: ['Node.js', 'Commander.js', 'SQLite', 'Chalk'],
        role: 'Creator',
        metrics: '1000+ npm downloads, featured in dev newsletters',
        teamSize: 'Solo project',
        type: 'personal',
        status: 'completed'
      }
    ],
    openSource: [
      {
        title: 'React UI Component Library',
        description: 'Contributed to popular React component library by adding new components, fixing bugs, and improving documentation. Maintained backward compatibility while adding new features.',
        technologies: ['React', 'TypeScript', 'Storybook', 'Jest', 'Rollup'],
        role: 'Contributor',
        metrics: '15+ merged PRs, 200+ GitHub stars gained',
        teamSize: 'Community project',
        type: 'openSource',
        status: 'maintenance'
      }
    ]
  },
  [industryKeys.dataScientist]: {
    professional: [
      {
        title: 'Customer Churn Prediction Model',
        description: 'Developed machine learning model to predict customer churn with 92% accuracy. Implemented feature engineering pipeline and deployed model to production, resulting in 25% reduction in churn rate.',
        technologies: ['Python', 'scikit-learn', 'pandas', 'AWS SageMaker', 'Docker'],
        role: 'Lead Data Scientist',
        metrics: '92% model accuracy, 25% churn reduction',
        teamSize: '4 data scientists',
        type: 'professional',
        status: 'completed'
      },
      {
        title: 'Sales Forecasting Dashboard',
        description: 'Built real-time sales forecasting system with interactive dashboard for executive team. Integrated multiple data sources and implemented time series forecasting models.',
        technologies: ['Python', 'TensorFlow', 'Tableau', 'Snowflake', 'Apache Airflow'],
        role: 'Senior Data Scientist',
        metrics: '15% improvement in forecast accuracy',
        teamSize: '6 analysts',
        type: 'professional',
        status: 'maintenance'
      }
    ],
    personal: [
      {
        title: 'Stock Market Analysis Tool',
        description: 'Created automated stock analysis tool using machine learning to identify trading opportunities. Includes sentiment analysis of news and social media data.',
        technologies: ['Python', 'pandas', 'TensorFlow', 'Alpha Vantage API', 'Twitter API'],
        role: 'Creator',
        metrics: '15% portfolio outperformance vs S&P 500',
        teamSize: 'Solo project',
        type: 'personal',
        status: 'inProgress'
      }
    ]
  },
  [industryKeys.marketingManager]: {
    professional: [
      {
        title: 'Marketing Automation Platform',
        description: 'Implemented comprehensive marketing automation system including email campaigns, lead scoring, and customer journey mapping. Increased qualified leads by 150%.',
        technologies: ['HubSpot', 'Salesforce', 'Google Analytics', 'Zapier'],
        role: 'Marketing Operations Manager',
        metrics: '150% increase in qualified leads, 40% improvement in ROI',
        teamSize: '5 marketers',
        type: 'professional',
        status: 'completed'
      }
    ],
    personal: [
      {
        title: 'Social Media Analytics Dashboard',
        description: 'Built custom dashboard to track social media performance across multiple platforms. Provides insights into engagement trends and content optimization.',
        technologies: ['Python', 'Streamlit', 'Facebook API', 'Twitter API', 'Instagram API'],
        role: 'Creator',
        metrics: 'Used by 50+ small businesses',
        teamSize: 'Solo project',
        type: 'personal',
        status: 'completed'
      }
    ]
  },
  [industryKeys.projectManager]: {
    professional: [
      {
        title: 'Digital Transformation Initiative',
        description: 'Led company-wide digital transformation project involving 50+ stakeholders across 8 departments. Delivered project 2 months ahead of schedule and 15% under budget.',
        technologies: ['Jira', 'Confluence', 'Microsoft Project', 'Slack', 'Tableau'],
        role: 'Senior Project Manager',
        metrics: '2 months ahead of schedule, 15% under budget',
        teamSize: '50+ stakeholders',
        type: 'professional',
        status: 'completed'
      }
    ]
  },
  [industryKeys.graphicDesigner]: {
    professional: [
      {
        title: 'Brand Identity Redesign',
        description: 'Complete brand identity redesign for Fortune 500 company including logo, color palette, typography, and brand guidelines. Improved brand recognition by 40%.',
        technologies: ['Adobe Illustrator', 'Adobe Photoshop', 'Figma', 'InDesign'],
        role: 'Lead Designer',
        metrics: '40% improvement in brand recognition',
        teamSize: '4 designers',
        type: 'professional',
        status: 'completed'
      }
    ],
    personal: [
      {
        title: 'Design System for Startups',
        description: 'Created comprehensive design system template for early-stage startups. Includes UI components, style guides, and implementation documentation.',
        technologies: ['Figma', 'Adobe XD', 'Principle', 'Sketch'],
        role: 'Creator',
        metrics: '500+ downloads, featured on design blogs',
        teamSize: 'Solo project',
        type: 'personal',
        status: 'completed'
      }
    ]
  }
} as const;

// Project description templates with consistent industry keys
export const projectDescriptionTemplates = {
  [industryKeys.softwareEngineer]: [
    'Developed {{technology}} application that {{achievement}}. Implemented {{features}} resulting in {{impact}}. Used {{techStack}} to ensure {{qualities}}.',
    'Led development of {{projectType}} with team of {{teamSize}} developers. Architected {{approach}} to solve {{problem}}. Achieved {{metrics}} through {{innovations}}.',
    'Built {{applicationType}} using {{technologies}} that {{function}}. Integrated {{services}} and implemented {{features}}. Project resulted in {{businessImpact}}.'
  ],
  [industryKeys.dataScientist]: [
    'Developed {{modelType}} using {{algorithms}} to {{objective}}. Achieved {{metrics}} through {{approach}}. Deployed solution using {{tools}} resulting in {{impact}}.',
    'Analyzed {{dataType}} to identify {{insights}}. Built {{analysisType}} using {{tools}} that {{outcome}}. Findings led to {{improvements}}.',
    'Created {{dashboardType}} for {{stakeholders}} using {{tools}}. Integrated {{dataSources}} to provide {{insights}}. Solution enabled {{capabilities}} and improved {{metrics}}.'
  ],
  [industryKeys.marketingManager]: [
    'Launched {{campaignType}} across {{channels}} targeting {{audience}}. Implemented {{strategies}} resulting in {{metrics}}. Used {{tools}} to optimize performance.',
    'Developed {{initiative}} to {{objective}}. Collaborated with {{teams}} to execute {{activities}}. Campaign achieved {{results}} and exceeded targets by {{percentage}}.',
    'Created {{contentType}} for {{audience}}. Utilized {{platforms}} to {{strategy}}. Content generated {{engagement}} and contributed to {{goals}}.'
  ],
  [industryKeys.projectManager]: [
    'Managed {{projectType}} with budget of {{budget}} and timeline of {{duration}}. Coordinated {{teamSize}} team members across {{scope}}. Delivered project {{performance}}.',
    'Led {{initiative}} involving {{complexity}}. Implemented {{methodology}} to ensure {{outcomes}}. Project resulted in {{benefits}} and {{impact}}.',
    'Oversaw {{projectDetails}} from {{startPhase}} to {{endPhase}}. Managed {{challenges}} and maintained {{standards}}. Successfully delivered {{deliverables}} meeting {{criteria}}.'
  ],
  [industryKeys.graphicDesigner]: [
    'Designed {{designType}} for {{client}} focusing on {{goals}}. Created {{deliverables}} using {{tools}}. Design improved {{metrics}} and received {{recognition}}.',
    'Led {{designProcess}} for {{scope}}. Conducted {{research}} and created {{assets}}. Solution enhanced {{userExperience}} and achieved {{goals}}.',
    'Developed {{visualAssets}} supporting {{initiative}}. Collaborated with {{stakeholders}} to ensure {{requirements}}. Designs contributed to {{outcomes}}.'
  ]
} as const;

// Metric templates with proper placeholders for rendering
export const projectMetricTemplates = {
  performance: [
    'Improved application performance by {{percentage}}%',
    'Reduced loading time from {{oldTime}} to {{newTime}}',
    'Increased system throughput by {{factor}}x',
    'Achieved {{percentage}}% uptime',
    'Reduced response time by {{percentage}}%'
  ],
  business: [
    'Increased revenue by ${{amount}}',
    'Improved conversion rate by {{percentage}}%',
    'Reduced costs by ${{amount}} annually',
    'Generated {{number}}+ new leads',
    'Increased user engagement by {{percentage}}%',
    'Expanded user base to {{number}}+ active users'
  ],
  technical: [
    'Achieved {{percentage}}% test coverage',
    'Reduced bug reports by {{percentage}}%',
    'Implemented {{number}}+ automated tests',
    'Decreased deployment time by {{percentage}}%',
    'Improved code quality score to {{score}}'
  ],
  team: [
    'Led team of {{number}} developers',
    'Mentored {{number}} junior developers',
    'Collaborated with {{number}} stakeholders',
    'Managed {{number}} cross-functional teams',
    'Coordinated with {{number}} departments'
  ]
} as const;

// Improved regex patterns
export const projectValidation = {
  required: ['title', 'description', 'role'],
  optional: ['technologies', 'metrics', 'githubUrl', 'liveUrl', 'teamSize'],
  // Fixed URL pattern: proper end anchor, supports all TLDs including new ones
  urlPattern: /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,63}\b(?:[-a-zA-Z0-9()@:%_+.~#?&=]*)$/,
  // More flexible GitHub pattern: supports org URLs, subpaths, and various GitHub URL formats
  githubPattern: /^https?:\/\/(?:www\.)?github\.com\/[A-Za-z0-9_.-]+(?:\/[A-Za-z0-9_.-]+)?(?:\/.*)?$/,
  minDescriptionLength: 100,
  maxDescriptionLength: 500,
  maxTechnologies: 10
} as const;

// ATS keywords with consistent industry keys
export const projectAtsKeywords = {
  [industryKeys.softwareEngineer]: [
    'developed', 'built', 'implemented', 'designed', 'architected', 'optimized',
    'deployed', 'integrated', 'maintained', 'scaled', 'automated', 'collaborated',
    'led', 'managed', 'delivered', 'achieved', 'improved', 'reduced'
  ],
  [industryKeys.dataScientist]: [
    'analyzed', 'modeled', 'predicted', 'optimized', 'visualized', 'implemented',
    'deployed', 'trained', 'validated', 'discovered', 'insights', 'patterns',
    'machine learning', 'statistical', 'data mining', 'predictive analytics'
  ],
  [industryKeys.projectManager]: [
    'managed', 'led', 'coordinated', 'delivered', 'executed', 'planned',
    'organized', 'monitored', 'controlled', 'facilitated', 'stakeholders',
    'budget', 'timeline', 'scope', 'quality', 'risk management'
  ],
  [industryKeys.graphicDesigner]: [
    'designed', 'created', 'developed', 'conceptualized', 'prototyped',
    'collaborated', 'user experience', 'user interface', 'visual design',
    'brand identity', 'typography', 'color theory', 'accessibility'
  ]
} as const;

// Project showcase tips
export const projectShowcaseTips = {
  general: [
    'Start with the most impressive and relevant projects',
    'Focus on projects that demonstrate skills for your target role',
    'Include quantifiable results and business impact',
    'Show progression of complexity and responsibility',
    'Highlight collaborative and leadership experiences'
  ],
  technical: [
    'Include links to live demos or repositories when possible',
    'Mention specific technologies and frameworks used',
    'Describe your specific role and contributions',
    'Explain the problem solved and approach taken',
    'Include metrics on performance, scale, or usage'
  ],
  presentation: [
    'Use action verbs to start each bullet point',
    'Keep descriptions concise but informative',
    'Group similar types of projects together',
    'Use consistent formatting and structure',
    'Proofread for technical accuracy and grammar'
  ]
} as const;

// Type definitions for better TypeScript support
export type ProjectTypeKey = keyof typeof projectTypes;
export type ProjectStatusKey = keyof typeof projectStatus;
export type IndustryKey = keyof typeof projectExamplesByIndustry;
export type TechnologyCategory = keyof typeof technologyStacks;

// Helper function to render template strings with variables
export const renderTemplate = (template: string, variables: Record<string, string>): string => {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return variables[key] || match;
  });
};

// Helper function to get industry-safe key
export const getIndustryKey = (industry: string): string => {
  return Object.values(industryKeys).includes(industry as any) 
    ? industry 
    : industryKeys.softwareEngineer; // fallback
};

export default {
  designTokens,
  projectTypes,
  projectStatus,
  technologyStacks,
  industryKeys,
  projectExamplesByIndustry,
  projectDescriptionTemplates,
  projectMetricTemplates,
  projectValidation,
  projectAtsKeywords,
  projectShowcaseTips,
  renderTemplate,
  getIndustryKey
} as const;