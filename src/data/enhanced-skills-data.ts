// Enhanced skills database with salary data, demand levels, and ATS weights
// This data powers salary insights, skill recommendations, and ATS optimization

/**
 * USAGE EXAMPLES:
 * 
 * // Calculate salary impact
 * const salaryIncrease = salaryCalculators.calculateSkillValue(
 *   'python', ['javascript', 'html-css'], 'software-engineering', 'mid'
 * ); // Returns: 15000
 * 
 * // Get ATS score
 * const atsScore = atsOptimization.calculateATSScore(
 *   ['javascript', 'react', 'python'], 'software-engineering'
 * ); // Returns: 89
 * 
 * // Get skill recommendations
 * const recommendations = skillRecommendations.getRecommendedSkills(
 *   ['javascript', 'react'], 'software-engineering', 'mid', 5
 * ); // Returns: [{skillId: 'typescript', reason: '...', priority: 85}, ...]
 * 
 * // Validate skills safely
 * const validSkills = skillValidation.validateSkillIds(['python', 'invalid-skill']);
 * // Returns: ['python']
 */

// Define strict types for better type safety
export type IndustryKey = 'technology' | 'healthcare' | 'finance' | 'marketing' | 'sales' | 'education' | 'manufacturing' | 'consulting' | 'government' | 'nonprofit';
export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD';
export type ExperienceLevel = 'junior' | 'mid' | 'senior';
export type SkillCategory = 'technical' | 'soft' | 'tools' | 'certifications' | 'languages';
export type DemandLevel = 'critical' | 'high' | 'moderate' | 'low' | 'declining';
export type DemandTrend = 'rapidly-growing' | 'growing' | 'stable' | 'declining';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type ATSFrequency = 'very-high' | 'high' | 'moderate' | 'low';
export type SkillImportance = 'critical' | 'high' | 'moderate' | 'low';

// Map external industry IDs to internal relevance keys
export const industryKeyMap: Record<string, IndustryKey> = {
  'software-engineering': 'technology',
  'technology': 'technology',
  'healthcare': 'healthcare',
  'nursing': 'healthcare',
  'trades': 'manufacturing',
  'electrician': 'manufacturing',
  'marketing': 'marketing',
  'digital-marketing': 'marketing',
  'sales': 'sales',
  'finance': 'finance',
  'education': 'education',
  'consulting': 'consulting',
  'government': 'government',
  'nonprofit': 'nonprofit'
};

export interface EnhancedSkill {
  id: string;
  name: string;
  category: SkillCategory;
  
  // Salary Intelligence
  salaryImpact: {
    percentageIncrease: number; // % salary increase this skill typically provides (more conservative now)
    averageSalaryRange: {
      min: number;
      max: number;
      currency: CurrencyCode;
    };
    experienceMultiplier: {
      junior: number;     // 0-2 years (reduced multipliers to prevent compounding)
      mid: number;        // 3-5 years  
      senior: number;     // 6+ years
    };
  };
  
  // Market Demand
  demandLevel: DemandLevel;
  demandTrend: DemandTrend;
  demandScore: number; // 0-100, higher = more in-demand
  
  // ATS Optimization
  atsWeight: number; // 0-100, how important for ATS scoring
  atsKeywords: string[]; // Alternative names/keywords for this skill
  atsFrequency: ATSFrequency; // How often it appears in job descriptions
  
  // Skill Metadata
  difficultyLevel: DifficultyLevel;
  learningTimeMonths: number; // Estimated months to proficiency
  certificationAvailable: boolean;
  certificationValue: number; // 0-100, value of getting certified
  
  // Industry Relevance (0-100 score per industry)
  industryRelevance: Record<IndustryKey, number>;
  
  // Related Skills
  relatedSkills: string[]; // IDs of related skills
  prerequisiteSkills: string[]; // Skills that should be learned first
  careerProgression: string[]; // Next skills in career path
}

export interface IndustrySkillsData {
  industryId: string;
  industryName: string;
  averageSalary: Record<ExperienceLevel, number>;
  topPayingSkills: string[]; // Skill IDs
  criticalSkills: string[]; // Must-have skills
  emergingSkills: string[]; // Trending/new skills
  skillGroups: {
    [groupName: string]: {
      description: string;
      skills: string[]; // Skill IDs
      importance: SkillImportance;
    };
  };
}

// Enhanced Skills Database
export const enhancedSkillsDatabase: Record<string, EnhancedSkill> = {
  
  // ===== PROGRAMMING LANGUAGES =====
  'javascript': {
    id: 'javascript',
    name: 'JavaScript',
    category: 'technical',
    salaryImpact: {
      percentageIncrease: 15, // Reduced from 25 for more realistic compounding
      averageSalaryRange: { min: 70000, max: 140000, currency: 'USD' },
      experienceMultiplier: { junior: 0.9, mid: 1.0, senior: 1.1 } // Reduced multipliers
    },
    demandLevel: 'critical',
    demandTrend: 'stable',
    demandScore: 95,
    atsWeight: 90,
    atsKeywords: ['javascript', 'js', 'ecmascript', 'es6', 'es2015', 'vanilla js'],
    atsFrequency: 'very-high',
    difficultyLevel: 'intermediate',
    learningTimeMonths: 6,
    certificationAvailable: false,
    certificationValue: 30,
    industryRelevance: {
      technology: 100, healthcare: 30, finance: 70, marketing: 60, sales: 20,
      education: 40, manufacturing: 25, consulting: 50, government: 40, nonprofit: 30
    },
    relatedSkills: ['react', 'nodejs', 'typescript', 'html-css'],
    prerequisiteSkills: ['html-css'],
    careerProgression: ['react', 'nodejs', 'typescript', 'vue']
  },

  'python': {
    id: 'python',
    name: 'Python',
    category: 'technical',
    salaryImpact: {
      percentageIncrease: 20, // Reduced from 30
      averageSalaryRange: { min: 75000, max: 150000, currency: 'USD' },
      experienceMultiplier: { junior: 0.9, mid: 1.0, senior: 1.1 }
    },
    demandLevel: 'critical',
    demandTrend: 'rapidly-growing',
    demandScore: 98,
    atsWeight: 95,
    atsKeywords: ['python', 'python3', 'py', 'django', 'flask', 'pandas', 'numpy'],
    atsFrequency: 'very-high',
    difficultyLevel: 'beginner',
    learningTimeMonths: 4,
    certificationAvailable: true,
    certificationValue: 70,
    industryRelevance: {
      technology: 100, healthcare: 60, finance: 90, marketing: 50, sales: 30,
      education: 70, manufacturing: 40, consulting: 60, government: 50, nonprofit: 35
    },
    relatedSkills: ['data-science', 'machine-learning', 'django', 'flask'],
    prerequisiteSkills: [],
    careerProgression: ['django', 'data-science', 'machine-learning', 'tensorflow']
  },

  // Add missing referenced skills as stubs
  'html-css': {
    id: 'html-css',
    name: 'HTML/CSS',
    category: 'technical',
    salaryImpact: {
      percentageIncrease: 8,
      averageSalaryRange: { min: 45000, max: 85000, currency: 'USD' },
      experienceMultiplier: { junior: 1.0, mid: 0.9, senior: 0.8 }
    },
    demandLevel: 'high',
    demandTrend: 'stable',
    demandScore: 85,
    atsWeight: 70,
    atsKeywords: ['html', 'css', 'html5', 'css3', 'responsive design', 'frontend'],
    atsFrequency: 'very-high',
    difficultyLevel: 'beginner',
    learningTimeMonths: 3,
    certificationAvailable: false,
    certificationValue: 20,
    industryRelevance: {
      technology: 90, healthcare: 20, finance: 40, marketing: 70, sales: 15,
      education: 30, manufacturing: 15, consulting: 35, government: 25, nonprofit: 25
    },
    relatedSkills: ['javascript', 'react', 'css-frameworks'],
    prerequisiteSkills: [],
    careerProgression: ['javascript', 'react', 'vue', 'angular']
  },

  'git': {
    id: 'git',
    name: 'Git Version Control',
    category: 'tools',
    salaryImpact: {
      percentageIncrease: 5,
      averageSalaryRange: { min: 60000, max: 120000, currency: 'USD' },
      experienceMultiplier: { junior: 1.0, mid: 1.0, senior: 1.0 }
    },
    demandLevel: 'critical',
    demandTrend: 'stable',
    demandScore: 90,
    atsWeight: 75,
    atsKeywords: ['git', 'github', 'gitlab', 'version control', 'source control'],
    atsFrequency: 'very-high',
    difficultyLevel: 'intermediate',
    learningTimeMonths: 2,
    certificationAvailable: false,
    certificationValue: 30,
    industryRelevance: {
      technology: 100, healthcare: 15, finance: 60, marketing: 25, sales: 10,
      education: 20, manufacturing: 20, consulting: 40, government: 35, nonprofit: 15
    },
    relatedSkills: ['github', 'devops', 'ci-cd'],
    prerequisiteSkills: [],
    careerProgression: ['github', 'ci-cd', 'devops']
  },

  'problem-solving': {
    id: 'problem-solving',
    name: 'Problem Solving',
    category: 'soft',
    salaryImpact: {
      percentageIncrease: 10,
      averageSalaryRange: { min: 50000, max: 120000, currency: 'USD' },
      experienceMultiplier: { junior: 0.8, mid: 1.0, senior: 1.2 }
    },
    demandLevel: 'critical',
    demandTrend: 'stable',
    demandScore: 95,
    atsWeight: 80,
    atsKeywords: ['problem solving', 'analytical thinking', 'troubleshooting', 'critical thinking'],
    atsFrequency: 'very-high',
    difficultyLevel: 'intermediate',
    learningTimeMonths: 12,
    certificationAvailable: false,
    certificationValue: 40,
    industryRelevance: {
      technology: 100, healthcare: 90, finance: 95, marketing: 85, sales: 80,
      education: 85, manufacturing: 90, consulting: 100, government: 85, nonprofit: 80
    },
    relatedSkills: ['critical-thinking', 'analytical-skills', 'debugging'],
    prerequisiteSkills: [],
    careerProgression: ['analytical-skills', 'strategic-thinking', 'innovation']
  },

  'vue': {
    id: 'vue',
    name: 'Vue.js',
    category: 'technical',
    salaryImpact: {
      percentageIncrease: 15,
      averageSalaryRange: { min: 70000, max: 130000, currency: 'USD' },
      experienceMultiplier: { junior: 0.9, mid: 1.0, senior: 1.1 }
    },
    demandLevel: 'high',
    demandTrend: 'growing',
    demandScore: 80,
    atsWeight: 75,
    atsKeywords: ['vue', 'vuejs', 'vue.js', 'nuxt', 'composition api'],
    atsFrequency: 'moderate',
    difficultyLevel: 'intermediate',
    learningTimeMonths: 4,
    certificationAvailable: false,
    certificationValue: 40,
    industryRelevance: {
      technology: 85, healthcare: 20, finance: 50, marketing: 60, sales: 15,
      education: 30, manufacturing: 15, consulting: 40, government: 25, nonprofit: 20
    },
    relatedSkills: ['javascript', 'react', 'typescript'],
    prerequisiteSkills: ['javascript', 'html-css'],
    careerProgression: ['nuxt', 'typescript', 'full-stack']
  },

  'kubernetes': {
    id: 'kubernetes',
    name: 'Kubernetes',
    category: 'technical',
    salaryImpact: {
      percentageIncrease: 25,
      averageSalaryRange: { min: 95000, max: 170000, currency: 'USD' },
      experienceMultiplier: { junior: 1.0, mid: 1.1, senior: 1.2 }
    },
    demandLevel: 'high',
    demandTrend: 'rapidly-growing',
    demandScore: 88,
    atsWeight: 85,
    atsKeywords: ['kubernetes', 'k8s', 'container orchestration', 'helm'],
    atsFrequency: 'high',
    difficultyLevel: 'advanced',
    learningTimeMonths: 6,
    certificationAvailable: true,
    certificationValue: 90,
    industryRelevance: {
      technology: 95, healthcare: 25, finance: 70, marketing: 20, sales: 10,
      education: 20, manufacturing: 30, consulting: 60, government: 40, nonprofit: 15
    },
    relatedSkills: ['docker', 'aws', 'devops', 'terraform'],
    prerequisiteSkills: ['docker', 'linux'],
    careerProgression: ['devops', 'cloud-architecture', 'site-reliability']
  },

  'crm': {
    id: 'crm',
    name: 'CRM Systems',
    category: 'tools',
    salaryImpact: {
      percentageIncrease: 12,
      averageSalaryRange: { min: 45000, max: 95000, currency: 'USD' },
      experienceMultiplier: { junior: 0.9, mid: 1.0, senior: 1.1 }
    },
    demandLevel: 'high',
    demandTrend: 'stable',
    demandScore: 80,
    atsWeight: 75,
    atsKeywords: ['crm', 'salesforce', 'hubspot', 'customer relationship management'],
    atsFrequency: 'high',
    difficultyLevel: 'beginner',
    learningTimeMonths: 3,
    certificationAvailable: true,
    certificationValue: 70,
    industryRelevance: {
      technology: 60, healthcare: 50, finance: 70, marketing: 90, sales: 100,
      education: 40, manufacturing: 40, consulting: 80, government: 35, nonprofit: 60
    },
    relatedSkills: ['salesforce', 'sales-automation', 'data-analysis'],
    prerequisiteSkills: [],
    careerProgression: ['sales-automation', 'marketing-automation', 'business-analysis']
  },

  // Add forecast skills
  'ai': {
    id: 'ai',
    name: 'Artificial Intelligence',
    category: 'technical',
    salaryImpact: {
      percentageIncrease: 35,
      averageSalaryRange: { min: 110000, max: 250000, currency: 'USD' },
      experienceMultiplier: { junior: 1.1, mid: 1.3, senior: 1.5 }
    },
    demandLevel: 'critical',
    demandTrend: 'rapidly-growing',
    demandScore: 99,
    atsWeight: 95,
    atsKeywords: ['ai', 'artificial intelligence', 'machine learning', 'deep learning', 'neural networks'],
    atsFrequency: 'high',
    difficultyLevel: 'expert',
    learningTimeMonths: 24,
    certificationAvailable: true,
    certificationValue: 95,
    industryRelevance: {
      technology: 100, healthcare: 80, finance: 85, marketing: 70, sales: 60,
      education: 65, manufacturing: 60, consulting: 90, government: 55, nonprofit: 35
    },
    relatedSkills: ['machine-learning', 'python', 'data-science', 'tensorflow'],
    prerequisiteSkills: ['machine-learning', 'python', 'statistics'],
    careerProgression: ['ai-research', 'machine-learning-engineering', 'ai-ethics']
  },

  'cybersecurity': {
    id: 'cybersecurity',
    name: 'Cybersecurity',
    category: 'technical',
    salaryImpact: {
      percentageIncrease: 30,
      averageSalaryRange: { min: 85000, max: 180000, currency: 'USD' },
      experienceMultiplier: { junior: 1.0, mid: 1.2, senior: 1.4 }
    },
    demandLevel: 'critical',
    demandTrend: 'rapidly-growing',
    demandScore: 95,
    atsWeight: 90,
    atsKeywords: ['cybersecurity', 'information security', 'network security', 'penetration testing'],
    atsFrequency: 'high',
    difficultyLevel: 'advanced',
    learningTimeMonths: 18,
    certificationAvailable: true,
    certificationValue: 95,
    industryRelevance: {
      technology: 100, healthcare: 85, finance: 100, marketing: 60, sales: 50,
      education: 70, manufacturing: 75, consulting: 80, government: 100, nonprofit: 55
    },
    relatedSkills: ['network-security', 'ethical-hacking', 'risk-management'],
    prerequisiteSkills: ['networking', 'linux'],
    careerProgression: ['security-architecture', 'incident-response', 'security-management']
  },

  'quantum-computing': {
    id: 'quantum-computing',
    name: 'Quantum Computing',
    category: 'technical',
    salaryImpact: {
      percentageIncrease: 50,
      averageSalaryRange: { min: 150000, max: 300000, currency: 'USD' },
      experienceMultiplier: { junior: 1.2, mid: 1.5, senior: 2.0 }
    },
    demandLevel: 'moderate',
    demandTrend: 'rapidly-growing',
    demandScore: 60,
    atsWeight: 70,
    atsKeywords: ['quantum computing', 'quantum algorithms', 'qiskit', 'quantum programming'],
    atsFrequency: 'low',
    difficultyLevel: 'expert',
    learningTimeMonths: 36,
    certificationAvailable: true,
    certificationValue: 90,
    industryRelevance: {
      technology: 80, healthcare: 40, finance: 60, marketing: 10, sales: 5,
      education: 70, manufacturing: 30, consulting: 50, government: 80, nonprofit: 15
    },
    relatedSkills: ['physics', 'mathematics', 'programming', 'algorithms'],
    prerequisiteSkills: ['physics', 'linear-algebra', 'python'],
    careerProgression: ['quantum-research', 'quantum-algorithms', 'quantum-hardware']
  },

  'react': {
    id: 'react',
    name: 'React',
    category: 'technical',
    salaryImpact: {
      percentageIncrease: 20,
      averageSalaryRange: { min: 80000, max: 145000, currency: 'USD' },
      experienceMultiplier: { junior: 0.85, mid: 1.1, senior: 1.35 }
    },
    demandLevel: 'critical',
    demandTrend: 'growing',
    demandScore: 92,
    atsWeight: 88,
    atsKeywords: ['react', 'reactjs', 'react.js', 'jsx', 'hooks', 'redux'],
    atsFrequency: 'very-high',
    difficultyLevel: 'intermediate',
    learningTimeMonths: 5,
    certificationAvailable: false,
    certificationValue: 45,
    industryRelevance: {
      technology: 95, healthcare: 25, finance: 60, marketing: 70, sales: 15,
      education: 35, manufacturing: 20, consulting: 45, government: 30, nonprofit: 25
    },
    relatedSkills: ['javascript', 'redux', 'nextjs', 'typescript'],
    prerequisiteSkills: ['javascript', 'html-css'],
    careerProgression: ['redux', 'nextjs', 'react-native', 'typescript']
  },

  // ===== CLOUD & DEVOPS =====
  'aws': {
    id: 'aws',
    name: 'Amazon Web Services (AWS)',
    category: 'technical',
    salaryImpact: {
      percentageIncrease: 35,
      averageSalaryRange: { min: 90000, max: 180000, currency: 'USD' },
      experienceMultiplier: { junior: 1.0, mid: 1.2, senior: 1.5 }
    },
    demandLevel: 'critical',
    demandTrend: 'rapidly-growing',
    demandScore: 96,
    atsWeight: 92,
    atsKeywords: ['aws', 'amazon web services', 'ec2', 's3', 'lambda', 'cloud'],
    atsFrequency: 'very-high',
    difficultyLevel: 'intermediate',
    learningTimeMonths: 8,
    certificationAvailable: true,
    certificationValue: 90,
    industryRelevance: {
      technology: 100, healthcare: 50, finance: 80, marketing: 40, sales: 25,
      education: 45, manufacturing: 35, consulting: 70, government: 60, nonprofit: 30
    },
    relatedSkills: ['docker', 'kubernetes', 'terraform', 'devops'],
    prerequisiteSkills: ['linux', 'networking'],
    careerProgression: ['kubernetes', 'terraform', 'docker', 'devops']
  },

  'docker': {
    id: 'docker',
    name: 'Docker',
    category: 'technical',
    salaryImpact: {
      percentageIncrease: 25,
      averageSalaryRange: { min: 85000, max: 160000, currency: 'USD' },
      experienceMultiplier: { junior: 0.9, mid: 1.1, senior: 1.4 }
    },
    demandLevel: 'high',
    demandTrend: 'growing',
    demandScore: 88,
    atsWeight: 85,
    atsKeywords: ['docker', 'containerization', 'containers', 'dockerfile'],
    atsFrequency: 'high',
    difficultyLevel: 'intermediate',
    learningTimeMonths: 4,
    certificationAvailable: true,
    certificationValue: 75,
    industryRelevance: {
      technology: 95, healthcare: 30, finance: 70, marketing: 20, sales: 10,
      education: 25, manufacturing: 30, consulting: 60, government: 45, nonprofit: 20
    },
    relatedSkills: ['kubernetes', 'aws', 'devops', 'linux'],
    prerequisiteSkills: ['linux'],
    careerProgression: ['kubernetes', 'aws', 'terraform', 'devops']
  },

  // ===== DATA SCIENCE & AI =====
  'data-science': {
    id: 'data-science',
    name: 'Data Science',
    category: 'technical',
    salaryImpact: {
      percentageIncrease: 40,
      averageSalaryRange: { min: 95000, max: 200000, currency: 'USD' },
      experienceMultiplier: { junior: 1.0, mid: 1.3, senior: 1.6 }
    },
    demandLevel: 'critical',
    demandTrend: 'rapidly-growing',
    demandScore: 97,
    atsWeight: 90,
    atsKeywords: ['data science', 'data analysis', 'analytics', 'big data', 'statistics'],
    atsFrequency: 'very-high',
    difficultyLevel: 'advanced',
    learningTimeMonths: 12,
    certificationAvailable: true,
    certificationValue: 85,
    industryRelevance: {
      technology: 100, healthcare: 80, finance: 95, marketing: 85, sales: 70,
      education: 60, manufacturing: 55, consulting: 90, government: 65, nonprofit: 45
    },
    relatedSkills: ['python', 'machine-learning', 'sql', 'tableau'],
    prerequisiteSkills: ['python', 'statistics', 'sql'],
    careerProgression: ['machine-learning', 'ai', 'deep-learning', 'mlops']
  },

  'machine-learning': {
    id: 'machine-learning',
    name: 'Machine Learning',
    category: 'technical',
    salaryImpact: {
      percentageIncrease: 45,
      averageSalaryRange: { min: 105000, max: 220000, currency: 'USD' },
      experienceMultiplier: { junior: 1.1, mid: 1.4, senior: 1.7 }
    },
    demandLevel: 'critical',
    demandTrend: 'rapidly-growing',
    demandScore: 99,
    atsWeight: 93,
    atsKeywords: ['machine learning', 'ml', 'ai', 'artificial intelligence', 'deep learning'],
    atsFrequency: 'high',
    difficultyLevel: 'expert',
    learningTimeMonths: 18,
    certificationAvailable: true,
    certificationValue: 95,
    industryRelevance: {
      technology: 100, healthcare: 85, finance: 90, marketing: 75, sales: 60,
      education: 70, manufacturing: 65, consulting: 85, government: 60, nonprofit: 40
    },
    relatedSkills: ['python', 'data-science', 'tensorflow', 'pytorch'],
    prerequisiteSkills: ['python', 'data-science', 'statistics', 'linear-algebra'],
    careerProgression: ['deep-learning', 'ai-research', 'mlops', 'computer-vision']
  },

  // ===== SOFT SKILLS =====
  'leadership': {
    id: 'leadership',
    name: 'Leadership',
    category: 'soft',
    salaryImpact: {
      percentageIncrease: 30,
      averageSalaryRange: { min: 80000, max: 200000, currency: 'USD' },
      experienceMultiplier: { junior: 0.5, mid: 1.0, senior: 1.8 }
    },
    demandLevel: 'critical',
    demandTrend: 'stable',
    demandScore: 90,
    atsWeight: 80,
    atsKeywords: ['leadership', 'team lead', 'management', 'team management', 'people management'],
    atsFrequency: 'very-high',
    difficultyLevel: 'advanced',
    learningTimeMonths: 24,
    certificationAvailable: true,
    certificationValue: 70,
    industryRelevance: {
      technology: 90, healthcare: 95, finance: 95, marketing: 85, sales: 90,
      education: 95, manufacturing: 85, consulting: 100, government: 90, nonprofit: 95
    },
    relatedSkills: ['project-management', 'communication', 'conflict-resolution'],
    prerequisiteSkills: ['communication', 'teamwork'],
    careerProgression: ['strategic-planning', 'executive-leadership', 'change-management']
  },

  'communication': {
    id: 'communication',
    name: 'Communication',
    category: 'soft',
    salaryImpact: {
      percentageIncrease: 15,
      averageSalaryRange: { min: 50000, max: 120000, currency: 'USD' },
      experienceMultiplier: { junior: 0.8, mid: 1.0, senior: 1.2 }
    },
    demandLevel: 'critical',
    demandTrend: 'stable',
    demandScore: 95,
    atsWeight: 85,
    atsKeywords: ['communication', 'verbal communication', 'written communication', 'presentation'],
    atsFrequency: 'very-high',
    difficultyLevel: 'intermediate',
    learningTimeMonths: 6,
    certificationAvailable: false,
    certificationValue: 40,
    industryRelevance: {
      technology: 85, healthcare: 95, finance: 90, marketing: 100, sales: 100,
      education: 100, manufacturing: 75, consulting: 100, government: 90, nonprofit: 95
    },
    relatedSkills: ['presentation', 'writing', 'interpersonal-skills'],
    prerequisiteSkills: [],
    careerProgression: ['public-speaking', 'leadership', 'training', 'coaching']
  },

  // ===== HEALTHCARE SPECIFIC =====
  'patient-care': {
    id: 'patient-care',
    name: 'Patient Care',
    category: 'technical',
    salaryImpact: {
      percentageIncrease: 10,
      averageSalaryRange: { min: 45000, max: 85000, currency: 'USD' },
      experienceMultiplier: { junior: 0.9, mid: 1.0, senior: 1.2 }
    },
    demandLevel: 'critical',
    demandTrend: 'growing',
    demandScore: 85,
    atsWeight: 95,
    atsKeywords: ['patient care', 'bedside manner', 'patient advocacy', 'clinical care'],
    atsFrequency: 'very-high',
    difficultyLevel: 'intermediate',
    learningTimeMonths: 12,
    certificationAvailable: true,
    certificationValue: 80,
    industryRelevance: {
      technology: 5, healthcare: 100, finance: 5, marketing: 5, sales: 5,
      education: 10, manufacturing: 5, consulting: 10, government: 15, nonprofit: 20
    },
    relatedSkills: ['medical-terminology', 'clinical-documentation', 'empathy'],
    prerequisiteSkills: ['medical-terminology'],
    careerProgression: ['specialized-nursing', 'nurse-management', 'clinical-leadership']
  },

  // ===== TRADE SKILLS =====
  'electrical-systems': {
    id: 'electrical-systems',
    name: 'Electrical Systems',
    category: 'technical',
    salaryImpact: {
      percentageIncrease: 20,
      averageSalaryRange: { min: 55000, max: 95000, currency: 'USD' },
      experienceMultiplier: { junior: 0.8, mid: 1.0, senior: 1.3 }
    },
    demandLevel: 'high',
    demandTrend: 'stable',
    demandScore: 80,
    atsWeight: 90,
    atsKeywords: ['electrical systems', 'wiring', 'electrical installation', 'power distribution'],
    atsFrequency: 'high',
    difficultyLevel: 'intermediate',
    learningTimeMonths: 24,
    certificationAvailable: true,
    certificationValue: 95,
    industryRelevance: {
      technology: 20, healthcare: 30, finance: 10, marketing: 5, sales: 5,
      education: 15, manufacturing: 90, consulting: 15, government: 40, nonprofit: 10
    },
    relatedSkills: ['safety-compliance', 'blueprint-reading', 'troubleshooting'],
    prerequisiteSkills: ['safety-compliance'],
    careerProgression: ['master-electrician', 'electrical-contractor', 'project-supervision']
  },

  // ===== SALES & MARKETING =====
  'digital-marketing': {
    id: 'digital-marketing',
    name: 'Digital Marketing',
    category: 'technical',
    salaryImpact: {
      percentageIncrease: 25,
      averageSalaryRange: { min: 50000, max: 110000, currency: 'USD' },
      experienceMultiplier: { junior: 0.8, mid: 1.1, senior: 1.4 }
    },
    demandLevel: 'critical',
    demandTrend: 'rapidly-growing',
    demandScore: 92,
    atsWeight: 88,
    atsKeywords: ['digital marketing', 'online marketing', 'seo', 'sem', 'social media marketing'],
    atsFrequency: 'very-high',
    difficultyLevel: 'intermediate',
    learningTimeMonths: 6,
    certificationAvailable: true,
    certificationValue: 80,
    industryRelevance: {
      technology: 70, healthcare: 60, finance: 65, marketing: 100, sales: 85,
      education: 55, manufacturing: 40, consulting: 75, government: 35, nonprofit: 70
    },
    relatedSkills: ['seo', 'google-ads', 'social-media', 'content-marketing'],
    prerequisiteSkills: ['marketing-fundamentals'],
    careerProgression: ['marketing-automation', 'growth-hacking', 'marketing-analytics']
  },

  'sales-strategy': {
    id: 'sales-strategy',
    name: 'Sales Strategy',
    category: 'technical',
    salaryImpact: {
      percentageIncrease: 28,
      averageSalaryRange: { min: 60000, max: 150000, currency: 'USD' },
      experienceMultiplier: { junior: 0.7, mid: 1.1, senior: 1.6 }
    },
    demandLevel: 'high',
    demandTrend: 'stable',
    demandScore: 88,
    atsWeight: 85,
    atsKeywords: ['sales strategy', 'sales planning', 'business development', 'revenue growth'],
    atsFrequency: 'high',
    difficultyLevel: 'advanced',
    learningTimeMonths: 12,
    certificationAvailable: true,
    certificationValue: 75,
    industryRelevance: {
      technology: 80, healthcare: 60, finance: 85, marketing: 70, sales: 100,
      education: 40, manufacturing: 65, consulting: 90, government: 30, nonprofit: 45
    },
    relatedSkills: ['crm', 'negotiation', 'account-management', 'prospecting'],
    prerequisiteSkills: ['sales-fundamentals', 'communication'],
    careerProgression: ['sales-management', 'business-development', 'revenue-operations']
  }
};

// Industry-specific skill groupings and data
export const industriesSkillsData: Record<string, IndustrySkillsData> = {
  'software-engineering': {
    industryId: 'software-engineering',
    industryName: 'Software Engineering',
    averageSalary: { junior: 75000, mid: 110000, senior: 160000 },
    topPayingSkills: ['machine-learning', 'aws', 'data-science', 'python', 'react'],
    criticalSkills: ['javascript', 'python', 'git', 'problem-solving', 'communication'],
    emergingSkills: ['machine-learning', 'kubernetes', 'terraform', 'ai'],
    skillGroups: {
      'Frontend Development': {
        description: 'Client-side web development skills',
        skills: ['javascript', 'react', 'html-css', 'typescript', 'vue'],
        importance: 'critical'
      },
      'Backend Development': {
        description: 'Server-side development and APIs',
        skills: ['python', 'nodejs', 'java', 'sql', 'rest-apis'],
        importance: 'critical'
      },
      'Cloud & DevOps': {
        description: 'Cloud platforms and deployment',
        skills: ['aws', 'docker', 'kubernetes', 'terraform', 'ci-cd'],
        importance: 'high'
      },
      'Data & AI': {
        description: 'Data science and machine learning',
        skills: ['data-science', 'machine-learning', 'python', 'sql', 'tensorflow'],
        importance: 'high'
      }
    }
  },

  'healthcare': {
    industryId: 'healthcare',
    industryName: 'Healthcare',
    averageSalary: { junior: 45000, mid: 65000, senior: 95000 },
    topPayingSkills: ['nurse-practitioner', 'icu-certification', 'anesthesia', 'surgical-assistance'],
    criticalSkills: ['patient-care', 'medical-terminology', 'clinical-documentation', 'empathy', 'communication'],
    emergingSkills: ['telehealth', 'health-informatics', 'ai-diagnostics', 'electronic-health-records'],
    skillGroups: {
      'Clinical Skills': {
        description: 'Direct patient care and medical procedures',
        skills: ['patient-care', 'medication-administration', 'iv-therapy', 'wound-care'],
        importance: 'critical'
      },
      'Technology': {
        description: 'Healthcare technology and informatics',
        skills: ['electronic-health-records', 'medical-devices', 'health-informatics'],
        importance: 'high'
      },
      'Certifications': {
        description: 'Required healthcare certifications',
        skills: ['bls-certification', 'acls-certification', 'pals-certification'],
        importance: 'critical'
      }
    }
  },

  'trades': {
    industryId: 'trades',
    industryName: 'Skilled Trades',
    averageSalary: { junior: 40000, mid: 65000, senior: 95000 },
    topPayingSkills: ['master-electrician', 'industrial-automation', 'renewable-energy', 'project-management'],
    criticalSkills: ['electrical-systems', 'safety-compliance', 'blueprint-reading', 'troubleshooting'],
    emergingSkills: ['renewable-energy', 'smart-home-technology', 'industrial-automation', 'green-building'],
    skillGroups: {
      'Core Technical': {
        description: 'Essential trade-specific technical skills',
        skills: ['electrical-systems', 'wiring', 'motor-controls', 'power-distribution'],
        importance: 'critical'
      },
      'Safety & Compliance': {
        description: 'Safety protocols and regulatory compliance',
        skills: ['safety-compliance', 'osha-compliance', 'electrical-codes', 'arc-flash-safety'],
        importance: 'critical'
      },
      'Specialized Systems': {
        description: 'Advanced and emerging technologies',
        skills: ['renewable-energy', 'home-automation', 'industrial-controls', 'fire-alarm-systems'],
        importance: 'high'
      }
    }
  },

  'marketing': {
    industryId: 'marketing',
    industryName: 'Marketing',
    averageSalary: { junior: 45000, mid: 70000, senior: 120000 },
    topPayingSkills: ['marketing-automation', 'data-analytics', 'growth-hacking', 'digital-strategy'],
    criticalSkills: ['digital-marketing', 'content-marketing', 'analytics', 'communication', 'creativity'],
    emergingSkills: ['marketing-automation', 'ai-marketing', 'voice-search-optimization', 'influencer-marketing'],
    skillGroups: {
      'Digital Marketing': {
        description: 'Online marketing channels and tactics',
        skills: ['digital-marketing', 'seo', 'sem', 'social-media-marketing', 'email-marketing'],
        importance: 'critical'
      },
      'Analytics & Data': {
        description: 'Marketing analytics and data-driven decision making',
        skills: ['google-analytics', 'data-analysis', 'marketing-metrics', 'a-b-testing'],
        importance: 'high'
      },
      'Content & Creative': {
        description: 'Content creation and creative skills',
        skills: ['content-marketing', 'copywriting', 'graphic-design', 'video-marketing'],
        importance: 'high'
      }
    }
  },

  'sales': {
    industryId: 'sales',
    industryName: 'Sales',
    averageSalary: { junior: 45000, mid: 75000, senior: 140000 },
    topPayingSkills: ['enterprise-sales', 'sales-strategy', 'account-management', 'negotiation'],
    criticalSkills: ['sales-strategy', 'communication', 'crm', 'negotiation', 'prospecting'],
    emergingSkills: ['sales-automation', 'social-selling', 'video-selling', 'ai-sales-tools'],
    skillGroups: {
      'Core Sales': {
        description: 'Fundamental sales skills and processes',
        skills: ['sales-strategy', 'prospecting', 'lead-qualification', 'closing-techniques'],
        importance: 'critical'
      },
      'Technology': {
        description: 'Sales technology and CRM systems',
        skills: ['crm', 'sales-automation', 'linkedin-sales-navigator', 'sales-analytics'],
        importance: 'high'
      },
      'Relationship Building': {
        description: 'Customer relationship and account management',
        skills: ['account-management', 'customer-success', 'relationship-building', 'networking'],
        importance: 'high'
      }
    }
  }
};

// Skill demand forecasting data
export const skillDemandForecast = {
  nextYear: {
    'machine-learning': { demandIncrease: 25, salaryIncrease: 15 },
    'ai': { demandIncrease: 35, salaryIncrease: 20 },
    'cybersecurity': { demandIncrease: 20, salaryIncrease: 12 },
    'cloud-computing': { demandIncrease: 18, salaryIncrease: 10 },
    'data-science': { demandIncrease: 22, salaryIncrease: 14 },
    'renewable-energy': { demandIncrease: 30, salaryIncrease: 18 },
    'telehealth': { demandIncrease: 28, salaryIncrease: 16 }
  },
  nextFiveYears: {
    'quantum-computing': { demandIncrease: 200, salaryIncrease: 100 },
    'ar-vr': { demandIncrease: 150, salaryIncrease: 80 },
    'blockchain': { demandIncrease: 100, salaryIncrease: 60 },
    'robotics': { demandIncrease: 120, salaryIncrease: 70 },
    'biotechnology': { demandIncrease: 90, salaryIncrease: 50 }
  }
};

// Salary calculation utilities with proper type safety
export const salaryCalculators = {
  // Helper to get valid industry key
  getValidIndustryKey: (industry: string): IndustryKey => {
    return industryKeyMap[industry] || 'technology';
  },

  // Calculate potential salary with specific skills
  calculatePotentialSalary: (
    baseSkills: string[], 
    industry: string, 
    experienceLevel: ExperienceLevel
  ): number => {
    // Use the mapped industry key for consistent lookups
    const validIndustryKey = salaryCalculators.getValidIndustryKey(industry);
    const industryData = industriesSkillsData[industry];
    if (!industryData) return 50000; // Default base salary
    
    const baseSalary = industryData.averageSalary[experienceLevel];
    let totalIncrease = 0;
    
    baseSkills.forEach(skillId => {
      const skill = enhancedSkillsDatabase[skillId];
      if (skill) {
        // Use validIndustryKey for industry relevance lookup
        const industryRelevance = skill.industryRelevance[validIndustryKey] || 0;
        // More conservative calculation to prevent excessive compounding
        const skillIncrease = baseSalary * (skill.salaryImpact.percentageIncrease / 100);
        const experienceMultiplier = skill.salaryImpact.experienceMultiplier[experienceLevel];
        // Apply industry relevance as additional factor
        const relevanceFactor = Math.max(0.5, industryRelevance / 100); // Minimum 50% relevance
        totalIncrease += skillIncrease * experienceMultiplier * relevanceFactor * 0.7; // 30% discount for compounding
      }
    });
    
    return Math.round(baseSalary + totalIncrease);
  },

  // Calculate skill value (how much adding this skill could increase salary)
  calculateSkillValue: (
    skillId: string, 
    currentSkills: string[], 
    industry: string, 
    experienceLevel: ExperienceLevel
  ): number => {
    const currentSalary = salaryCalculators.calculatePotentialSalary(currentSkills, industry, experienceLevel);
    const newSalary = salaryCalculators.calculatePotentialSalary([...currentSkills, skillId], industry, experienceLevel);
    return newSalary - currentSalary;
  },

  // Get top paying skills for an industry with proper type safety
  getTopPayingSkills: (industry: string, limit: number = 10): Array<{skillId: string, salaryImpact: number}> => {
    const validIndustryKey = salaryCalculators.getValidIndustryKey(industry);
    
    const relevantSkills = Object.entries(enhancedSkillsDatabase)
      .filter(([_, skill]) => {
        const relevance = skill.industryRelevance[validIndustryKey];
        return relevance >= 50;
      })
      .map(([skillId, skill]) => ({
        skillId,
        salaryImpact: skill.salaryImpact.percentageIncrease
      }))
      .sort((a, b) => b.salaryImpact - a.salaryImpact)
      .slice(0, limit);
    
    return relevantSkills;
  }
};

// ATS optimization utilities with fixed scoring logic
export const atsOptimization = {
  // Calculate ATS score for a set of skills (FIXED: was always returning 100%)
  calculateATSScore: (skills: string[], targetIndustry: string): number => {
    if (!skills.length) return 0;
    
    const validIndustryKey = salaryCalculators.getValidIndustryKey(targetIndustry);
    let totalWeight = 0;
    let weightedScore = 0;
    
    skills.forEach(skillId => {
      const skill = enhancedSkillsDatabase[skillId];
      if (skill) {
        const industryRelevance = skill.industryRelevance[validIndustryKey] || 0;
        const weight = industryRelevance / 100; // Normalize to 0-1
        totalWeight += weight;
        // FIXED: Use actual ATS weight instead of just the weight itself
        weightedScore += (skill.atsWeight * industryRelevance / 100) * weight;
      }
    });
    
    return totalWeight > 0 ? Math.round(weightedScore / totalWeight) : 0;
  },

  // Get missing critical skills for ATS optimization
  getMissingCriticalSkills: (currentSkills: string[], targetIndustry: string): string[] => {
    const industryData = industriesSkillsData[targetIndustry];
    if (!industryData) return [];
    
    return industryData.criticalSkills.filter(skillId => !currentSkills.includes(skillId));
  },

  // Get ATS keyword suggestions
  getATSKeywords: (skills: string[]): string[] => {
    const keywords = new Set<string>();
    
    skills.forEach(skillId => {
      const skill = enhancedSkillsDatabase[skillId];
      if (skill) {
        skill.atsKeywords.forEach(keyword => keywords.add(keyword));
      }
    });
    
    return Array.from(keywords);
  }
};

// Skill recommendation engine with proper type safety
export const skillRecommendations = {
  // Get recommended skills based on current skills and career goals
  getRecommendedSkills: (
    currentSkills: string[],
    targetIndustry: string,
    careerLevel: ExperienceLevel,
    limit: number = 5
  ): Array<{skillId: string, reason: string, priority: number}> => {
    const recommendations: Array<{skillId: string, reason: string, priority: number}> = [];
    
    // Get industry-specific recommendations
    const industryData = industriesSkillsData[targetIndustry];
    if (industryData) {
      // Recommend critical skills that are missing
      industryData.criticalSkills.forEach(skillId => {
        if (!currentSkills.includes(skillId)) {
          const skill = enhancedSkillsDatabase[skillId];
          if (skill) {
            recommendations.push({
              skillId,
              reason: 'Critical skill for your industry',
              priority: skill.demandScore
            });
          }
        }
      });
      
      // Recommend emerging skills
      industryData.emergingSkills.forEach(skillId => {
        if (!currentSkills.includes(skillId)) {
          const skill = enhancedSkillsDatabase[skillId];
          if (skill && skill.demandTrend === 'rapidly-growing') {
            recommendations.push({
              skillId,
              reason: 'Rapidly growing skill in your industry',
              priority: skill.demandScore + 10 // Bonus for trending
            });
          }
        }
      });
    }
    
    // Recommend skills based on career progression from current skills
    currentSkills.forEach(currentSkillId => {
      const currentSkill = enhancedSkillsDatabase[currentSkillId];
      if (currentSkill) {
        currentSkill.careerProgression.forEach(nextSkillId => {
          if (!currentSkills.includes(nextSkillId)) {
            const nextSkill = enhancedSkillsDatabase[nextSkillId];
            if (nextSkill) {
              recommendations.push({
                skillId: nextSkillId,
                reason: `Natural progression from ${currentSkill.name}`,
                priority: nextSkill.salaryImpact.percentageIncrease
              });
            }
          }
        });
      }
    });
    
    // Sort by priority and return top recommendations
    return recommendations
      .sort((a, b) => b.priority - a.priority)
      .slice(0, limit);
  },

  // Get skills that complement existing skills well
  getComplementarySkills: (currentSkills: string[], limit: number = 5): string[] => {
    const complementary = new Set<string>();
    
    currentSkills.forEach(skillId => {
      const skill = enhancedSkillsDatabase[skillId];
      if (skill) {
        skill.relatedSkills.forEach(relatedSkillId => {
          if (!currentSkills.includes(relatedSkillId)) {
            complementary.add(relatedSkillId);
          }
        });
      }
    });
    
    return Array.from(complementary).slice(0, limit);
  }
};

// Skill validation and utility functions
export const skillValidation = {
  // Check if a skill ID exists in the database
  isValidSkillId: (skillId: string): boolean => {
    return skillId in enhancedSkillsDatabase;
  },

  // Get skill safely with fallback
  getSkill: (skillId: string): EnhancedSkill | null => {
    return enhancedSkillsDatabase[skillId] || null;
  },

  // Validate array of skill IDs, return only valid ones
  validateSkillIds: (skillIds: string[]): string[] => {
    return skillIds.filter(skillId => skillValidation.isValidSkillId(skillId));
  },

  // Get missing skills from a list of skill IDs
  getMissingSkills: (skillIds: string[]): string[] => {
    return skillIds.filter(skillId => !skillValidation.isValidSkillId(skillId));
  },

  // Safe skill lookup with error logging
  safeSkillLookup: <T>(
    skillIds: string[], 
    processor: (skill: EnhancedSkill, skillId: string) => T
  ): T[] => {
    const results: T[] = [];
    const missingSkills: string[] = [];

    skillIds.forEach(skillId => {
      const skill = enhancedSkillsDatabase[skillId];
      if (skill) {
        results.push(processor(skill, skillId));
      } else {
        missingSkills.push(skillId);
      }
    });

    // Log missing skills for debugging (in development)
    if (missingSkills.length > 0 && process.env.NODE_ENV === 'development') {
      console.warn('Missing skills in database:', missingSkills);
    }

    return results;
  }
};

// Export main database and utilities
export default {
  enhancedSkillsDatabase,
  industriesSkillsData,
  skillDemandForecast,
  salaryCalculators,
  atsOptimization,
  skillRecommendations,
  skillValidation,
  industryKeyMap
};