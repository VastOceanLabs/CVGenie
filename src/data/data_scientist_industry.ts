// Data Scientist Industry-Specific Data - Type-Safe & Production Ready
// Comprehensive skills, salary, and career data for data science professionals

// ===== CORE TYPE DEFINITIONS =====
export type SkillCategory = 'technical' | 'soft' | 'tools' | 'certifications' | 'languages' | 'frameworks' | 'cloud';
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type DemandLevel = 'low' | 'medium' | 'high' | 'critical';
export type SalaryImpact = 'low' | 'medium' | 'high' | 'premium';
export type DemandTrend = 'declining' | 'stable' | 'growing' | 'exploding';
export type Currency = 'USD' | 'CAD' | 'GBP' | 'EUR' | 'AUD';

// Structured experience requirements instead of opaque strings
export interface ExperienceRequirement {
  min: number; // minimum years
  max?: number; // maximum years (undefined = no max)
  description: string; // human-readable description
}

export interface SkillWithMetadata {
  readonly name: string;
  readonly category: SkillCategory;
  readonly level: SkillLevel;
  readonly demandLevel: DemandLevel;
  readonly salaryImpact: SalaryImpact;
  readonly trending: boolean;
  readonly atsWeight: number; // 1-10, how important for ATS (10 = critical)
  readonly experienceRequired: ExperienceRequirement;
  readonly description?: string;
  readonly alternativeNames?: readonly string[];
}

export interface SalaryRange {
  readonly min: number;
  readonly max: number;
  readonly median: number;
}

export interface SalaryData {
  readonly location: string;
  readonly currency: Currency;
  readonly entryLevel: SalaryRange;
  readonly midLevel: SalaryRange;
  readonly seniorLevel: SalaryRange;
  readonly principalLevel: SalaryRange;
  readonly lastUpdated: string; // ISO date string
}

export interface CareerProgression {
  readonly level: string;
  readonly titles: readonly string[];
  readonly yearsExperience: string;
  readonly keySkills: readonly string[];
  readonly responsibilities: readonly string[];
  readonly salaryRange: string;
}

export interface Specialization {
  readonly name: string;
  readonly description: string;
  readonly keySkills: readonly string[];
  readonly salaryPremium: string;
  readonly demandTrend: DemandTrend;
  readonly jobTitles: readonly string[];
}

export interface TrendingSkillData {
  readonly name: string;
  readonly growth: string;
  readonly description: string;
}

export interface DecliningSkillData {
  readonly name: string;
  readonly decline: string;
  readonly reason: string;
}

// ===== CONSTANTS FOR TYPE SAFETY =====
const HIGH_SALARY_IMPACT: readonly SalaryImpact[] = ['premium', 'high'] as const;
const TRENDING_CATEGORIES: readonly SkillCategory[] = ['technical', 'frameworks', 'cloud'] as const;

// Module metadata
const MODULE_METADATA = {
  lastUpdated: '2024-12-11',
  version: '1.0.0',
  skillCount: 0, // Will be set programmatically
  dataSource: 'Industry surveys, job postings, salary reports 2024'
} as const;

// ===== CORE SKILLS DATABASE =====
export const dataScientistSkills: readonly SkillWithMetadata[] = [
  // Programming Languages
  {
    name: 'Python',
    category: 'technical',
    level: 'advanced',
    demandLevel: 'critical',
    salaryImpact: 'high',
    trending: true,
    atsWeight: 10,
    experienceRequired: { min: 0, description: '0+ years' },
    description: 'Essential programming language for data science',
    alternativeNames: ['Python Programming', 'Python Development', 'Python Scripting', 'py']
  },
  {
    name: 'R',
    category: 'technical',
    level: 'advanced',
    demandLevel: 'high',
    salaryImpact: 'high',
    trending: true,
    atsWeight: 9,
    experienceRequired: { min: 1, description: '1+ years' },
    description: 'Statistical programming language for data analysis',
    alternativeNames: ['R Programming', 'R Statistical Computing', 'R Language', 'R Studio']
  },
  {
    name: 'SQL',
    category: 'technical',
    level: 'advanced',
    demandLevel: 'critical',
    salaryImpact: 'high',
    trending: true,
    atsWeight: 10,
    experienceRequired: { min: 0, description: '0+ years' },
    description: 'Database querying and data manipulation',
    alternativeNames: ['SQL Queries', 'Database Programming', 'PostgreSQL', 'MySQL', 'T-SQL']
  },
  {
    name: 'Scala',
    category: 'technical',
    level: 'intermediate',
    demandLevel: 'medium',
    salaryImpact: 'premium',
    trending: true,
    atsWeight: 7,
    experienceRequired: { min: 2, description: '2+ years' },
    description: 'Functional programming for big data processing',
    alternativeNames: ['Scala Programming', 'Functional Programming']
  },
  {
    name: 'Julia',
    category: 'technical',
    level: 'intermediate',
    demandLevel: 'medium',
    salaryImpact: 'high',
    trending: true,
    atsWeight: 6,
    experienceRequired: { min: 1, description: '1+ years' },
    description: 'High-performance language for numerical computing'
  },

  // Machine Learning & AI
  {
    name: 'Machine Learning',
    category: 'technical',
    level: 'advanced',
    demandLevel: 'critical',
    salaryImpact: 'premium',
    trending: true,
    atsWeight: 10,
    experienceRequired: { min: 1, description: '1+ years' },
    description: 'Core ML algorithms and model development',
    alternativeNames: ['ML', 'Supervised Learning', 'Unsupervised Learning', 'Predictive Modeling']
  },
  {
    name: 'Deep Learning',
    category: 'technical',
    level: 'advanced',
    demandLevel: 'high',
    salaryImpact: 'premium',
    trending: true,
    atsWeight: 9,
    experienceRequired: { min: 2, description: '2+ years' },
    description: 'Neural networks and deep learning architectures',
    alternativeNames: ['Neural Networks', 'CNN', 'RNN', 'Transformer Models', 'Artificial Neural Networks']
  },
  {
    name: 'Natural Language Processing',
    category: 'technical',
    level: 'advanced',
    demandLevel: 'high',
    salaryImpact: 'premium',
    trending: true,
    atsWeight: 9,
    experienceRequired: { min: 2, description: '2+ years' },
    description: 'Text analysis and language model development',
    alternativeNames: ['NLP', 'Text Mining', 'Language Models', 'LLM', 'Text Analysis', 'Sentiment Analysis']
  },
  {
    name: 'Computer Vision',
    category: 'technical',
    level: 'advanced',
    demandLevel: 'high',
    salaryImpact: 'premium',
    trending: true,
    atsWeight: 8,
    experienceRequired: { min: 2, description: '2+ years' },
    description: 'Image and video analysis using ML',
    alternativeNames: ['CV', 'Image Processing', 'Object Detection', 'Image Recognition']
  },
  {
    name: 'MLOps',
    category: 'technical',
    level: 'advanced',
    demandLevel: 'critical',
    salaryImpact: 'premium',
    trending: true,
    atsWeight: 9,
    experienceRequired: { min: 3, description: '3+ years' },
    description: 'Machine learning operations and deployment',
    alternativeNames: ['ML Operations', 'Model Deployment', 'ML Engineering', 'Model Operations']
  },

  // Frameworks & Libraries
  {
    name: 'TensorFlow',
    category: 'frameworks',
    level: 'advanced',
    demandLevel: 'high',
    salaryImpact: 'high',
    trending: true,
    atsWeight: 9,
    experienceRequired: { min: 1, description: '1+ years' },
    description: 'Google\'s machine learning framework',
    alternativeNames: ['TF', 'TensorFlow 2.0', 'Keras', 'tf']
  },
  {
    name: 'PyTorch',
    category: 'frameworks',
    level: 'advanced',
    demandLevel: 'high',
    salaryImpact: 'high',
    trending: true,
    atsWeight: 9,
    experienceRequired: { min: 1, description: '1+ years' },
    description: 'Facebook\'s deep learning framework',
    alternativeNames: ['Torch', 'PyTorch Lightning', 'torch']
  },
  {
    name: 'Scikit-learn',
    category: 'frameworks',
    level: 'advanced',
    demandLevel: 'high',
    salaryImpact: 'high',
    trending: true,
    atsWeight: 8,
    experienceRequired: { min: 0, description: '0+ years' },
    description: 'Python machine learning library',
    alternativeNames: ['sklearn', 'scikit learn', 'sk-learn']
  },
  {
    name: 'Pandas',
    category: 'frameworks',
    level: 'advanced',
    demandLevel: 'critical',
    salaryImpact: 'high',
    trending: true,
    atsWeight: 10,
    experienceRequired: { min: 0, description: '0+ years' },
    description: 'Python data manipulation and analysis',
    alternativeNames: ['Pandas DataFrame', 'Data Wrangling', 'pd']
  },
  {
    name: 'NumPy',
    category: 'frameworks',
    level: 'advanced',
    demandLevel: 'high',
    salaryImpact: 'medium',
    trending: true,
    atsWeight: 8,
    experienceRequired: { min: 0, description: '0+ years' },
    description: 'Numerical computing in Python',
    alternativeNames: ['Numerical Python', 'Scientific Computing', 'np', 'numpy']
  },
  {
    name: 'Apache Spark',
    category: 'frameworks',
    level: 'advanced',
    demandLevel: 'high',
    salaryImpact: 'premium',
    trending: true,
    atsWeight: 8,
    experienceRequired: { min: 2, description: '2+ years' },
    description: 'Big data processing framework',
    alternativeNames: ['Spark', 'PySpark', 'Spark SQL', 'Apache Spark SQL']
  },
  {
    name: 'Hugging Face',
    category: 'frameworks',
    level: 'intermediate',
    demandLevel: 'high',
    salaryImpact: 'high',
    trending: true,
    atsWeight: 7,
    experienceRequired: { min: 1, description: '1+ years' },
    description: 'Transformers and NLP model library',
    alternativeNames: ['Transformers', 'Hugging Face Transformers', 'HF', 'transformers']
  },

  // Data Visualization
  {
    name: 'Tableau',
    category: 'tools',
    level: 'advanced',
    demandLevel: 'high',
    salaryImpact: 'high',
    trending: true,
    atsWeight: 8,
    experienceRequired: { min: 1, description: '1+ years' },
    description: 'Business intelligence and data visualization',
    alternativeNames: ['Tableau Desktop', 'Tableau Server', 'Tableau Public']
  },
  {
    name: 'Power BI',
    category: 'tools',
    level: 'intermediate',
    demandLevel: 'high',
    salaryImpact: 'medium',
    trending: true,
    atsWeight: 7,
    experienceRequired: { min: 1, description: '1+ years' },
    description: 'Microsoft business analytics platform',
    alternativeNames: ['Microsoft Power BI', 'PowerBI', 'Power Business Intelligence']
  },
  {
    name: 'Matplotlib',
    category: 'frameworks',
    level: 'intermediate',
    demandLevel: 'medium',
    salaryImpact: 'medium',
    trending: false,
    atsWeight: 6,
    experienceRequired: { min: 0, description: '0+ years' },
    description: 'Python plotting library',
    alternativeNames: ['plt', 'matplotlib.pyplot']
  },
  {
    name: 'Seaborn',
    category: 'frameworks',
    level: 'intermediate',
    demandLevel: 'medium',
    salaryImpact: 'medium',
    trending: false,
    atsWeight: 6,
    experienceRequired: { min: 0, description: '0+ years' },
    description: 'Statistical data visualization in Python',
    alternativeNames: ['sns', 'seaborn plots']
  },
  {
    name: 'Plotly',
    category: 'frameworks',
    level: 'intermediate',
    demandLevel: 'medium',
    salaryImpact: 'medium',
    trending: true,
    atsWeight: 6,
    experienceRequired: { min: 0, description: '0+ years' },
    description: 'Interactive plotting and dashboards',
    alternativeNames: ['Plotly Dash', 'Interactive Visualization', 'Dash']
  },

  // Cloud Platforms
  {
    name: 'AWS',
    category: 'cloud',
    level: 'advanced',
    demandLevel: 'critical',
    salaryImpact: 'premium',
    trending: true,
    atsWeight: 9,
    experienceRequired: { min: 1, description: '1+ years' },
    description: 'Amazon Web Services cloud platform',
    alternativeNames: ['Amazon Web Services', 'AWS SageMaker', 'AWS ML', 'Amazon Cloud']
  },
  {
    name: 'Azure',
    category: 'cloud',
    level: 'advanced',
    demandLevel: 'high',
    salaryImpact: 'high',
    trending: true,
    atsWeight: 8,
    experienceRequired: { min: 1, description: '1+ years' },
    description: 'Microsoft Azure cloud services',
    alternativeNames: ['Microsoft Azure', 'Azure ML', 'Azure Data Factory', 'Azure Cloud']
  },
  {
    name: 'Google Cloud Platform',
    category: 'cloud',
    level: 'advanced',
    demandLevel: 'high',
    salaryImpact: 'high',
    trending: true,
    atsWeight: 8,
    experienceRequired: { min: 1, description: '1+ years' },
    description: 'Google cloud computing services',
    alternativeNames: ['GCP', 'Google Cloud', 'BigQuery', 'Vertex AI', 'Google Cloud ML']
  },
  {
    name: 'Databricks',
    category: 'cloud',
    level: 'advanced',
    demandLevel: 'high',
    salaryImpact: 'premium',
    trending: true,
    atsWeight: 7,
    experienceRequired: { min: 2, description: '2+ years' },
    description: 'Unified analytics platform for big data and ML'
  },
  {
    name: 'Snowflake',
    category: 'cloud',
    level: 'intermediate',
    demandLevel: 'high',
    salaryImpact: 'high',
    trending: true,
    atsWeight: 7,
    experienceRequired: { min: 1, description: '1+ years' },
    description: 'Cloud data warehouse platform'
  },

  // Statistics & Mathematics
  {
    name: 'Statistics',
    category: 'technical',
    level: 'advanced',
    demandLevel: 'critical',
    salaryImpact: 'high',
    trending: true,
    atsWeight: 9,
    experienceRequired: { min: 0, description: '0+ years' },
    description: 'Statistical analysis and inference',
    alternativeNames: ['Statistical Analysis', 'Descriptive Statistics', 'Inferential Statistics', 'Stats']
  },
  {
    name: 'A/B Testing',
    category: 'technical',
    level: 'advanced',
    demandLevel: 'high',
    salaryImpact: 'high',
    trending: true,
    atsWeight: 8,
    experienceRequired: { min: 1, description: '1+ years' },
    description: 'Experimental design and statistical testing',
    alternativeNames: ['Hypothesis Testing', 'Experimental Design', 'Statistical Testing', 'Split Testing']
  },

  // Version Control & DevOps
  {
    name: 'Git',
    category: 'tools',
    level: 'advanced',
    demandLevel: 'critical',
    salaryImpact: 'medium',
    trending: true,
    atsWeight: 9,
    experienceRequired: { min: 0, description: '0+ years' },
    description: 'Version control for code and models',
    alternativeNames: ['GitHub', 'GitLab', 'Version Control', 'Source Control']
  },
  {
    name: 'Docker',
    category: 'tools',
    level: 'advanced',
    demandLevel: 'high',
    salaryImpact: 'high',
    trending: true,
    atsWeight: 8,
    experienceRequired: { min: 1, description: '1+ years' },
    description: 'Containerization for model deployment',
    alternativeNames: ['Containerization', 'Docker Containers']
  },
  {
    name: 'Kubernetes',
    category: 'tools',
    level: 'advanced',
    demandLevel: 'high',
    salaryImpact: 'premium',
    trending: true,
    atsWeight: 7,
    experienceRequired: { min: 2, description: '2+ years' },
    description: 'Container orchestration platform',
    alternativeNames: ['K8s', 'Container Orchestration']
  },

  // Soft Skills
  {
    name: 'Communication',
    category: 'soft',
    level: 'advanced',
    demandLevel: 'critical',
    salaryImpact: 'high',
    trending: true,
    atsWeight: 9,
    experienceRequired: { min: 0, description: '0+ years' },
    description: 'Explaining complex technical concepts to stakeholders',
    alternativeNames: ['Technical Communication', 'Stakeholder Communication', 'Presentation Skills']
  },
  {
    name: 'Business Acumen',
    category: 'soft',
    level: 'advanced',
    demandLevel: 'critical',
    salaryImpact: 'premium',
    trending: true,
    atsWeight: 9,
    experienceRequired: { min: 2, description: '2+ years' },
    description: 'Understanding business context and impact',
    alternativeNames: ['Business Understanding', 'Domain Expertise', 'Business Intelligence']
  },
  {
    name: 'Problem Solving',
    category: 'soft',
    level: 'advanced',
    demandLevel: 'critical',
    salaryImpact: 'high',
    trending: true,
    atsWeight: 8,
    experienceRequired: { min: 0, description: '0+ years' },
    description: 'Analytical thinking and solution development',
    alternativeNames: ['Analytical Thinking', 'Critical Thinking', 'Strategic Thinking']
  },
  {
    name: 'Leadership',
    category: 'soft',
    level: 'advanced',
    demandLevel: 'high',
    salaryImpact: 'premium',
    trending: true,
    atsWeight: 8,
    experienceRequired: { min: 3, description: '3+ years' },
    description: 'Leading data science teams and initiatives',
    alternativeNames: ['Team Leadership', 'Technical Leadership', 'Project Leadership']
  },

  // Certifications
  {
    name: 'AWS Certified Machine Learning',
    category: 'certifications',
    level: 'advanced',
    demandLevel: 'high',
    salaryImpact: 'premium',
    trending: true,
    atsWeight: 8,
    experienceRequired: { min: 2, description: '2+ years' },
    description: 'AWS machine learning specialty certification'
  },
  {
    name: 'Google Cloud ML Engineer',
    category: 'certifications',
    level: 'advanced',
    demandLevel: 'high',
    salaryImpact: 'high',
    trending: true,
    atsWeight: 7,
    experienceRequired: { min: 2, description: '2+ years' },
    description: 'Google Cloud machine learning certification'
  },
  {
    name: 'Microsoft Azure AI Engineer',
    category: 'certifications',
    level: 'advanced',
    demandLevel: 'high',
    salaryImpact: 'high',
    trending: true,
    atsWeight: 7,
    experienceRequired: { min: 2, description: '2+ years' },
    description: 'Azure AI and ML certification'
  }
] as const;

// Update metadata with actual skill count
const updatedMetadata = {
  ...MODULE_METADATA,
  skillCount: dataScientistSkills.length
} as const;

// ===== SALARY DATA =====
export const salaryData: readonly SalaryData[] = [
  {
    location: 'United States (National Average)',
    currency: 'USD',
    entryLevel: { min: 85000, max: 120000, median: 102000 },
    midLevel: { min: 120000, max: 160000, median: 140000 },
    seniorLevel: { min: 160000, max: 220000, median: 190000 },
    principalLevel: { min: 220000, max: 350000, median: 285000 },
    lastUpdated: '2024-12-01'
  },
  {
    location: 'San Francisco Bay Area, CA',
    currency: 'USD',
    entryLevel: { min: 120000, max: 160000, median: 140000 },
    midLevel: { min: 160000, max: 220000, median: 190000 },
    seniorLevel: { min: 220000, max: 300000, median: 260000 },
    principalLevel: { min: 300000, max: 500000, median: 400000 },
    lastUpdated: '2024-12-01'
  },
  {
    location: 'New York City, NY',
    currency: 'USD',
    entryLevel: { min: 100000, max: 140000, median: 120000 },
    midLevel: { min: 140000, max: 190000, median: 165000 },
    seniorLevel: { min: 190000, max: 260000, median: 225000 },
    principalLevel: { min: 260000, max: 400000, median: 330000 },
    lastUpdated: '2024-12-01'
  },
  {
    location: 'Canada (National Average)',
    currency: 'CAD',
    entryLevel: { min: 75000, max: 100000, median: 87000 },
    midLevel: { min: 100000, max: 135000, median: 117000 },
    seniorLevel: { min: 135000, max: 180000, median: 157000 },
    principalLevel: { min: 180000, max: 250000, median: 215000 },
    lastUpdated: '2024-12-01'
  },
  {
    location: 'United Kingdom',
    currency: 'GBP',
    entryLevel: { min: 35000, max: 50000, median: 42000 },
    midLevel: { min: 50000, max: 70000, median: 60000 },
    seniorLevel: { min: 70000, max: 100000, median: 85000 },
    principalLevel: { min: 100000, max: 150000, median: 125000 },
    lastUpdated: '2024-12-01'
  }
] as const;

// ===== TRENDING SKILLS DATA =====
export const trendingSkills = {
  emergingTech: [
    { name: 'Large Language Models (LLMs)', growth: '+300%', description: 'GPT, Claude, and custom language models' },
    { name: 'Generative AI', growth: '+250%', description: 'DALL-E, Midjourney, and generative model development' },
    { name: 'Vector Databases', growth: '+200%', description: 'Pinecone, Weaviate, ChromaDB for similarity search' },
    { name: 'MLOps Platforms', growth: '+150%', description: 'Comprehensive ML lifecycle management' },
    { name: 'Edge AI', growth: '+120%', description: 'Deploying AI models on edge devices' }
  ] as const,
  decliningSkills: [
    { name: 'Hadoop MapReduce', decline: '-40%', reason: 'Replaced by Spark and cloud solutions' },
    { name: 'Traditional BI Tools', decline: '-25%', reason: 'Moving to self-service analytics' },
    { name: 'SAS Programming', decline: '-30%', reason: 'Python/R ecosystem dominance' }
  ] as const,
  stableHighDemand: [
    'Python Programming',
    'SQL Database Management', 
    'Cloud Platform Expertise',
    'Statistical Analysis',
    'Machine Learning Fundamentals'
  ] as const
} as const;

// ===== ATS KEYWORDS =====
export const atsKeywords = {
  technical: [
    'machine learning', 'data science', 'python', 'sql', 'statistics', 'deep learning',
    'artificial intelligence', 'data analysis', 'predictive modeling', 'data mining',
    'big data', 'cloud computing', 'mlops', 'data engineering', 'analytics'
  ] as const,
  soft: [
    'problem solving', 'communication', 'leadership', 'collaboration', 'project management',
    'business acumen', 'stakeholder management', 'strategic thinking', 'innovation'
  ] as const,
  tools: [
    'tensorflow', 'pytorch', 'scikit-learn', 'pandas', 'numpy', 'jupyter',
    'tableau', 'power bi', 'aws', 'azure', 'gcp', 'docker', 'kubernetes'
  ] as const
} as const;

// ===== SPECIALIZATION DATA =====
export const specializations: readonly Specialization[] = [
  {
    name: 'Machine Learning Engineering',
    description: 'Focus on production ML systems, MLOps, and scalable infrastructure',
    keySkills: ['MLOps', 'Kubernetes', 'Docker', 'CI/CD', 'Model Deployment', 'System Design'],
    salaryPremium: '+15% above average',
    demandTrend: 'exploding',
    jobTitles: ['ML Engineer', 'MLOps Engineer', 'AI Platform Engineer', 'ML Infrastructure Engineer']
  },
  {
    name: 'Natural Language Processing',
    description: 'Specializing in text analysis, language models, and conversational AI',
    keySkills: ['NLP', 'Transformers', 'Hugging Face', 'BERT', 'GPT', 'Language Models'],
    salaryPremium: '+20% above average',
    demandTrend: 'exploding',
    jobTitles: ['NLP Engineer', 'Conversational AI Engineer', 'Language Model Researcher']
  },
  {
    name: 'Computer Vision',
    description: 'Image and video analysis, object detection, and visual AI systems',
    keySkills: ['Computer Vision', 'OpenCV', 'CNN', 'Object Detection', 'Image Processing'],
    salaryPremium: '+18% above average',
    demandTrend: 'growing',
    jobTitles: ['Computer Vision Engineer', 'AI Vision Specialist', 'Autonomous Systems Engineer']
  }
] as const;

// ===== TYPE-SAFE HELPER FUNCTIONS =====
export const dataScientistHelpers = {
  // Fixed: Type-safe category filtering
  getSkillsByCategory: (category: SkillCategory): readonly SkillWithMetadata[] =>
    dataScientistSkills.filter(skill => skill.category === category),

  // Fixed: Proper boolean logic for salary impact filtering
  getHighSalaryImpactSkills: (): readonly SkillWithMetadata[] =>
    dataScientistSkills.filter(skill => HIGH_SALARY_IMPACT.includes(skill.salaryImpact)),

  // Fixed: Type-safe trending skills filtering
  getTrendingSkills: (): readonly SkillWithMetadata[] =>
    dataScientistSkills.filter(skill => skill.trending),

  // Fixed: Numerical experience comparison instead of string parsing
  getSkillsForExperienceLevel: (experienceYears: number): readonly SkillWithMetadata[] =>
    dataScientistSkills.filter(skill => {
      const req = skill.experienceRequired;
      return experienceYears >= req.min && (req.max === undefined || experienceYears <= req.max);
    }),

  // Type-safe location-based salary lookup
  getSalaryForLocation: (location: string): SalaryData | undefined =>
    salaryData.find(data => data.location.toLowerCase().includes(location.toLowerCase())),

  // Type-safe specialization lookup
  getSpecializationByName: (name: string): Specialization | undefined =>
    specializations.find(spec => spec.name.toLowerCase().includes(name.toLowerCase())),

  // Get skills by demand level
  getSkillsByDemandLevel: (demandLevel: DemandLevel): readonly SkillWithMetadata[] =>
    dataScientistSkills.filter(skill => skill.demandLevel === demandLevel),

  // Get critical ATS skills (weight >= 8)
  getCriticalATSSkills: (): readonly SkillWithMetadata[] =>
    dataScientistSkills.filter(skill => skill.atsWeight >= 8),

  // Get skills suitable for beginners (0 years experience)
  getBeginnerSkills: (): readonly SkillWithMetadata[] =>
    dataScientistSkills.filter(skill => skill.experienceRequired.min === 0),

  // Validate skill category
  isValidSkillCategory: (category: string): category is SkillCategory =>
    (['technical', 'soft', 'tools', 'certifications', 'languages', 'frameworks', 'cloud'] as const)
      .includes(category as SkillCategory),

  // Get all alternative names for ATS matching
  getAllSkillNames: (): readonly string[] => {
    const allNames: string[] = [];
    dataScientistSkills.forEach(skill => {
      allNames.push(skill.name);
      if (skill.alternativeNames) {
        allNames.push(...skill.alternativeNames);
      }
    });
    return allNames;
  }
} as const;

// ===== MAIN EXPORT =====
export default {
  metadata: updatedMetadata,
  skills: dataScientistSkills,
  salaryData,
  specializations,
  trendingSkills,
  atsKeywords,
  helpers: dataScientistHelpers
} as const;

// All types and interfaces are already exported when defined above