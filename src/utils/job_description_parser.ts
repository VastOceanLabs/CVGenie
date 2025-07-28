/**
 * Job Description Parser and Resume Matching Utilities
 * Adapted for JobDescriptionMatcher component compatibility
 */

// TypeScript Interfaces - Updated for component compatibility
interface ResumeData {
  personalInfo: {
    summary?: string;
    jobTitle?: string;
    yearsExperience?: string;
    [key: string]: any;
  };
  experience: Array<{
    title?: string;
    description?: string;
    company?: string;
    [key: string]: any;
  }>;
  education: Array<{
    degree?: string;
    field?: string;
    institution?: string;
    [key: string]: any;
  }>;
  skills: Array<{
    name: string;
    category?: string;
    level?: string;
    [key: string]: any;
  }>;
  certifications: Array<{
    name?: string;
    issuer?: string;
    [key: string]: any;
  }>;
}

// Interface that matches what JobDescriptionMatcher component expects
interface ComponentMatchResult {
  overallScore: number;
  matchedKeywords: string[];
  missingKeywords: Array<{
    keyword: string;
    category: 'technical' | 'soft' | 'tools';
  }>;
  detectedIndustry: string;
  experienceScore: number;
  skillsScore: number;
  recommendations: Array<{
    type: string;
    priority: string;
    title: string;
    description: string;
    keywords?: string[];
  }>;
  keywordCategories: {
    technical: string[];
    softSkills: string[];
    tools: string[];
  };
}

interface IndustryProfile {
  name: string;
  technicalKeywords: string[];
  softSkills: string[];
  toolKeywords: string[]; // Added tools as separate category
  experienceKeywords: string[];
  educationKeywords: string[];
  certificationKeywords: string[];
  salaryRanges: {
    junior: [number, number];
    mid: [number, number];
    senior: [number, number];
    lead: [number, number];
  };
}

// Enhanced industry profiles with tools separated
const industryProfiles: Record<string, IndustryProfile> = {
  'Software Engineer': {
    name: 'Software Engineer',
    technicalKeywords: [
      'JavaScript', 'TypeScript', 'Python', 'Java', 'React', 'Node.js', 'Angular', 'Vue.js',
      'SQL', 'NoSQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Docker', 'Kubernetes',
      'AWS', 'Azure', 'GCP', 'Git', 'CI/CD', 'DevOps', 'Microservices', 'API', 'REST',
      'GraphQL', 'HTML', 'CSS', 'SCSS', 'Webpack', 'Babel', 'npm', 'yarn', 'Linux',
      'TDD', 'Unit Testing', 'Integration Testing', 'Jest', 'Cypress'
    ],
    softSkills: [
      'problem solving', 'analytical thinking', 'communication', 'teamwork', 'collaboration',
      'leadership', 'mentoring', 'code review', 'debugging', 'troubleshooting',
      'project management', 'time management', 'adaptability', 'learning agility'
    ],
    toolKeywords: [
      'Jira', 'Confluence', 'Slack', 'GitHub', 'GitLab', 'Postman', 'Figma',
      'Jenkins', 'Terraform', 'VS Code', 'IntelliJ', 'Docker Desktop',
      'npm', 'yarn', 'Webpack', 'Vite', 'ESLint', 'Prettier'
    ],
    experienceKeywords: [
      'full-stack', 'frontend', 'backend', 'web development', 'software development',
      'application development', 'system design', 'architecture', 'scalability',
      'performance optimization', 'security', 'deployment', 'monitoring'
    ],
    educationKeywords: [
      'Computer Science', 'Software Engineering', 'Information Technology', 'Mathematics',
      'Electrical Engineering', 'Bachelor', 'Master', 'PhD', 'bootcamp', 'certification'
    ],
    certificationKeywords: [
      'AWS Certified', 'Azure Certified', 'Google Cloud', 'Oracle Certified',
      'Microsoft Certified', 'Cisco', 'CompTIA', 'Salesforce', 'Kubernetes'
    ],
    salaryRanges: {
      junior: [60000, 85000],
      mid: [85000, 130000],
      senior: [130000, 180000],
      lead: [180000, 250000]
    }
  },
  'Marketing Manager': {
    name: 'Marketing Manager',
    technicalKeywords: [
      'SEO', 'SEM', 'Google Analytics', 'Social Media Marketing', 'Content Marketing',
      'Email Marketing', 'Marketing Automation', 'A/B Testing', 'Conversion Optimization',
      'PPC', 'Pay Per Click', 'Influencer Marketing', 'Brand Management',
      'Digital Marketing', 'Growth Hacking', 'Funnel Optimization', 'Lead Generation'
    ],
    softSkills: [
      'strategic planning', 'creative thinking', 'data analysis', 'project management',
      'team leadership', 'communication', 'budget management', 'customer insights',
      'presentation skills', 'negotiation', 'relationship building'
    ],
    toolKeywords: [
      'Google Ads', 'Facebook Ads', 'HubSpot', 'Mailchimp', 'Hootsuite', 'Canva',
      'Adobe Creative Suite', 'Salesforce', 'Tableau', 'SEMrush', 'Ahrefs',
      'Buffer', 'Sprout Social', 'Google Tag Manager', 'WordPress', 'Shopify'
    ],
    experienceKeywords: [
      'campaign management', 'brand management', 'content creation', 'lead generation',
      'customer acquisition', 'retention marketing', 'growth hacking', 'marketing strategy',
      'digital strategy', 'omnichannel marketing', 'performance marketing', 'attribution'
    ],
    educationKeywords: [
      'Marketing', 'Business Administration', 'Communications', 'Journalism',
      'Advertising', 'Public Relations', 'Digital Media', 'Bachelor', 'Master', 'MBA'
    ],
    certificationKeywords: [
      'Google Ads Certified', 'Google Analytics Certified', 'Facebook Blueprint',
      'HubSpot Certified', 'Hootsuite Certified', 'Salesforce Certified'
    ],
    salaryRanges: {
      junior: [45000, 65000],
      mid: [65000, 90000],
      senior: [90000, 130000],
      lead: [130000, 180000]
    }
  },
  'Project Manager': {
    name: 'Project Manager',
    technicalKeywords: [
      'Project Planning', 'Risk Management', 'Budget Management', 'Agile', 'Scrum',
      'Stakeholder Management', 'Resource Allocation', 'Timeline Management',
      'Quality Assurance', 'Change Management', 'Waterfall', 'Kanban',
      'Sprint Planning', 'Backlog Management', 'PMP', 'PRINCE2'
    ],
    softSkills: [
      'leadership', 'communication', 'negotiation', 'problem solving', 'team building',
      'conflict resolution', 'decision making', 'adaptability', 'time management',
      'strategic thinking', 'attention to detail', 'motivation'
    ],
    toolKeywords: [
      'Microsoft Project', 'Jira', 'Asana', 'Trello', 'Slack', 'Confluence',
      'Excel', 'PowerPoint', 'Teams', 'Monday.com', 'Notion', 'Smartsheet',
      'Gantt Charts', 'Burndown Charts'
    ],
    experienceKeywords: [
      'project development', 'project launch', 'go-to-market', 'stakeholder management',
      'cross-functional collaboration', 'requirement gathering', 'prioritization',
      'feature specification', 'project optimization', 'delivery management'
    ],
    educationKeywords: [
      'Business Administration', 'Engineering', 'Computer Science', 'Marketing',
      'Economics', 'Design', 'Psychology', 'Bachelor', 'Master', 'MBA'
    ],
    certificationKeywords: [
      'Certified Product Manager', 'Agile Certified', 'Scrum Master', 'Design Thinking',
      'Google Analytics', 'Product School', 'Mind the Product'
    ],
    salaryRanges: {
      junior: [85000, 110000],
      mid: [110000, 150000],
      senior: [150000, 200000],
      lead: [200000, 300000]
    }
  },
  'Nurse': {
    name: 'Nurse',
    technicalKeywords: [
      'Patient Assessment', 'Medication Administration', 'IV Therapy', 'Wound Care',
      'Electronic Health Records', 'Vital Signs Monitoring', 'Emergency Response',
      'Infection Control', 'Patient Education', 'Clinical Documentation',
      'Phlebotomy', 'Catheter Care', 'Ventilator Management', 'Cardiac Monitoring'
    ],
    softSkills: [
      'compassionate care', 'critical thinking', 'communication', 'stress management',
      'team collaboration', 'attention to detail', 'time management', 'empathy',
      'problem solving', 'patience', 'multitasking', 'cultural sensitivity'
    ],
    toolKeywords: [
      'Electronic Health Records', 'EHR', 'Epic', 'Cerner', 'Medical Equipment', 
      'Infusion Pumps', 'Patient Monitors', 'Glucometers', 'Blood Pressure Cuffs', 
      'Thermometers', 'Defibrillators', 'Ventilators', 'IV Pumps', 'Pulse Oximeters'
    ],
    experienceKeywords: [
      'patient care', 'clinical experience', 'healthcare', 'medical', 'nursing care',
      'patient advocacy', 'clinical excellence', 'bedside manner', 'emergency care'
    ],
    educationKeywords: [
      'Nursing', 'Bachelor of Science in Nursing', 'BSN', 'RN', 'Associate Degree',
      'ADN', 'Master of Science in Nursing', 'MSN', 'Doctor of Nursing Practice', 'DNP'
    ],
    certificationKeywords: [
      'RN License', 'BLS Certification', 'ACLS Certification', 'PALS Certification',
      'Specialty Certifications', 'CPR Certification'
    ],
    salaryRanges: {
      junior: [55000, 70000],
      mid: [70000, 85000],
      senior: [85000, 105000],
      lead: [105000, 130000]
    }
  },
  'Sales Representative': {
    name: 'Sales Representative',
    technicalKeywords: [
      'Lead Generation', 'CRM Management', 'Sales Analytics', 'Pipeline Management',
      'Prospecting', 'Closing Techniques', 'Account Management', 'Territory Management',
      'Sales Forecasting', 'Competitive Analysis', 'Proposal Writing', 'Contract Negotiation',
      'Cold Calling', 'Warm Calling', 'Follow-up Strategies'
    ],
    softSkills: [
      'relationship building', 'negotiation', 'persuasion', 'active listening',
      'resilience', 'goal-oriented', 'time management', 'customer service',
      'communication', 'adaptability', 'persistence', 'empathy'
    ],
    toolKeywords: [
      'Salesforce', 'HubSpot', 'LinkedIn Sales Navigator', 'Zoom', 'Slack',
      'Excel', 'PowerPoint', 'Outreach', 'ZoomInfo', 'Calendly', 'Pipedrive',
      'Monday.com', 'Gong', 'Chorus', 'Dialpad'
    ],
    experienceKeywords: [
      'quota achievement', 'revenue generation', 'account management', 'territory management',
      'B2B sales', 'B2C sales', 'inside sales', 'outside sales', 'enterprise sales',
      'consultative selling', 'solution selling', 'closing deals', 'upselling', 'cross-selling'
    ],
    educationKeywords: [
      'Business Administration', 'Marketing', 'Communications', 'Psychology',
      'Economics', 'Finance', 'Bachelor', 'Master', 'MBA'
    ],
    certificationKeywords: [
      'Salesforce Certified', 'HubSpot Sales', 'Challenger Sale', 'SPIN Selling',
      'Sandler Sales', 'Miller Heiman', 'Solution Selling'
    ],
    salaryRanges: {
      junior: [40000, 60000],
      mid: [60000, 90000],
      senior: [90000, 130000],
      lead: [130000, 200000]
    }
  }
};

// Enhanced patterns with tools category
const technicalPatterns = [
  /\b(javascript|js|typescript|ts|python|java|c\+\+|c#|ruby|php|swift|kotlin|go|rust)\b/gi,
  /\b(react|angular|vue|node\.?js|express|django|flask|spring|laravel|rails)\b/gi,
  /\b(aws|amazon web services|azure|microsoft azure|gcp|google cloud|cloud computing)\b/gi,
  /\b(sql|mysql|postgresql|mongodb|redis|elasticsearch|oracle|sqlite)\b/gi,
  /\b(docker|kubernetes|jenkins|git|github|gitlab|ci\/cd|devops)\b/gi,
  /\b(html|css|sass|scss|less|bootstrap|tailwind|webpack|vite)\b/gi
];

const toolPatterns = [
  /\b(jira|confluence|slack|github|gitlab|postman|figma|jenkins|terraform|vs code|intellij)\b/gi,
  /\b(google ads|facebook ads|hubspot|mailchimp|hootsuite|canva|adobe|salesforce|tableau|semrush)\b/gi,
  /\b(microsoft project|asana|trello|excel|powerpoint|teams|monday\.com|notion|smartsheet)\b/gi,
  /\b(epic|cerner|ehr|electronic health records|medical equipment)\b/gi
];

const softSkillPatterns = [
  'communication', 'leadership', 'teamwork', 'problem solving', 'analytical',
  'creative', 'detail oriented', 'self motivated', 'organized', 'adaptable',
  'collaborative', 'innovative', 'strategic', 'customer focused', 'results driven',
  'time management', 'project management', 'critical thinking', 'decision making',
  'conflict resolution', 'negotiation', 'presentation skills', 'mentoring'
];

// Stop words to exclude from keyword matching
const stopWords = new Set([
  'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one',
  'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now', 'old', 'see',
  'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use', 'will',
  'work', 'years', 'experience', 'team', 'company', 'role', 'position', 'job', 'opportunity'
]);

// Utility functions
const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const extractWordsAndPhrases = (text: string): Set<string> => {
  const normalized = normalizeText(text);
  const words = new Set<string>();
  
  // Extract individual words
  normalized.split(/\s+/).forEach(word => {
    if (word.length > 2 && !stopWords.has(word)) {
      words.add(word);
    }
  });
  
  // Extract 2-word phrases
  const wordArray = normalized.split(/\s+/);
  for (let i = 0; i < wordArray.length - 1; i++) {
    const phrase = `${wordArray[i]} ${wordArray[i + 1]}`;
    if (!stopWords.has(wordArray[i]) && !stopWords.has(wordArray[i + 1])) {
      words.add(phrase);
    }
  }
  
  return words;
};

const detectIndustry = (jobDescription: string): string => {
  const text = normalizeText(jobDescription);
  const scores: Record<string, number> = {};
  
  // Score each industry based on keyword matches
  Object.entries(industryProfiles).forEach(([industry, profile]) => {
    let score = 0;
    
    [...profile.technicalKeywords, ...profile.softSkills, ...profile.toolKeywords, ...profile.experienceKeywords].forEach(keyword => {
      if (text.includes(normalizeText(keyword))) {
        score += 1;
      }
    });
    
    scores[industry] = score;
  });
  
  // Return industry with highest score, or default to Software Engineer
  const topIndustry = Object.entries(scores).reduce((a, b) => scores[a[0]] > scores[b[0]] ? a : b);
  return topIndustry[1] > 0 ? topIndustry[0] : 'Software Engineer';
};

const detectSeniority = (jobDescription: string): string => {
  const text = normalizeText(jobDescription);
  
  if (text.includes('senior') || text.includes('lead') || text.includes('principal') || text.includes('staff')) {
    return 'senior';
  } else if (text.includes('junior') || text.includes('entry') || text.includes('associate')) {
    return 'junior';
  } else if (text.includes('manager') || text.includes('director')) {
    return 'lead';
  }
  
  return 'mid';
};

const extractKeywordsByCategory = (text: string): { technical: string[], tools: string[], soft: string[] } => {
  const technical: string[] = [];
  const tools: string[] = [];
  const soft: string[] = [];
  
  // Extract technical keywords
  technicalPatterns.forEach(pattern => {
    const matches = text.match(pattern) || [];
    technical.push(...matches.map(m => m.toLowerCase().trim()));
  });
  
  // Extract tool keywords
  toolPatterns.forEach(pattern => {
    const matches = text.match(pattern) || [];
    tools.push(...matches.map(m => m.toLowerCase().trim()));
  });
  
  // Extract soft skills
  softSkillPatterns.forEach(skill => {
    if (text.includes(skill.toLowerCase())) {
      soft.push(skill);
    }
  });
  
  return {
    technical: [...new Set(technical)],
    tools: [...new Set(tools)],
    soft: [...new Set(soft)]
  };
};

const calculateCategoryScore = (
  resumeKeywords: Set<string>,
  jobKeywords: string[]
): { score: number; matched: string[]; missing: string[] } => {
  const matched: string[] = [];
  const missing: string[] = [];
  
  jobKeywords.forEach(keyword => {
    const normalizedKeyword = normalizeText(keyword);
    const found = Array.from(resumeKeywords).some(resumeKeyword => 
      resumeKeyword.includes(normalizedKeyword) || normalizedKeyword.includes(resumeKeyword)
    );
    
    if (found) {
      matched.push(keyword);
    } else {
      missing.push(keyword);
    }
  });
  
  const score = jobKeywords.length > 0 ? Math.round((matched.length / jobKeywords.length) * 100) : 100;
  
  return { score, matched, missing };
};

const calculateExperienceScore = (resumeData: ResumeData): number => {
  const experienceCount = (resumeData.experience || []).length;
  const yearsExperience = resumeData.personalInfo?.yearsExperience;
  
  let score = 50; // Base score
  
  // Score based on number of positions
  if (experienceCount >= 3) score += 25;
  else if (experienceCount >= 1) score += 15;
  
  // Score based on years of experience
  if (yearsExperience) {
    const years = parseInt(yearsExperience) || 0;
    if (years >= 5) score += 25;
    else if (years >= 2) score += 15;
    else if (years >= 1) score += 10;
  }
  
  return Math.min(100, score);
};

const calculateSkillsScore = (resumeData: ResumeData): number => {
  const skillCount = (resumeData.skills || []).length;
  
  if (skillCount >= 15) return 100;
  if (skillCount >= 10) return 85;
  if (skillCount >= 7) return 70;
  if (skillCount >= 5) return 55;
  if (skillCount >= 3) return 40;
  return skillCount > 0 ? 25 : 0;
};

const generateRecommendations = (
  missingKeywords: Array<{ keyword: string; category: string }>,
  industry: string
): Array<{ type: string; priority: string; title: string; description: string; keywords?: string[] }> => {
  const recommendations = [];
  
  // Group missing keywords by category
  const technicalMissing = missingKeywords.filter(mk => mk.category === 'technical').slice(0, 5);
  const softMissing = missingKeywords.filter(mk => mk.category === 'soft').slice(0, 3);
  const toolsMissing = missingKeywords.filter(mk => mk.category === 'tools').slice(0, 3);
  
  if (technicalMissing.length > 0) {
    recommendations.push({
      type: 'technical',
      priority: 'high',
      title: 'Add Technical Skills',
      description: `Add these technical skills commonly required for ${industry} roles`,
      keywords: technicalMissing.map(mk => mk.keyword)
    });
  }
  
  if (softMissing.length > 0) {
    recommendations.push({
      type: 'soft',
      priority: 'medium',
      title: 'Include Soft Skills',
      description: 'Add relevant soft skills that employers value',
      keywords: softMissing.map(mk => mk.keyword)
    });
  }
  
  if (toolsMissing.length > 0) {
    recommendations.push({
      type: 'tools',
      priority: 'medium',
      title: 'Add Tool Experience',
      description: 'Include experience with industry-standard tools',
      keywords: toolsMissing.map(mk => mk.keyword)
    });
  }
  
  return recommendations;
};

// Main function adapted for component compatibility
export const matchResumeToJob = (resumeData: ResumeData, jobDescription: string): ComponentMatchResult => {
  if (!jobDescription.trim()) {
    throw new Error('Job description cannot be empty');
  }
  
  // Extract resume content
  const resumeText = [
    resumeData.personalInfo.summary || '',
    resumeData.experience.map(exp => `${exp.title || ''} ${exp.description || ''}`).join(' '),
    resumeData.skills.map(skill => skill.name).join(' '),
    resumeData.certifications.map(cert => cert.name || '').join(' '),
    resumeData.education.map(edu => `${edu.degree || ''} ${edu.field || ''}`).join(' ')
  ].join(' ');
  
  // Detect industry from job description
  const detectedIndustry = detectIndustry(jobDescription);
  const profile = industryProfiles[detectedIndustry] || industryProfiles['Software Engineer'];
  
  // Extract keywords from resume and job description
  const resumeKeywords = extractWordsAndPhrases(resumeText);
  const jobKeywordsByCategory = extractKeywordsByCategory(jobDescription);
  
  // Calculate category scores using profile keywords combined with extracted keywords
  const allTechnical = [...new Set([...profile.technicalKeywords, ...jobKeywordsByCategory.technical])];
  const allSoft = [...new Set([...profile.softSkills, ...jobKeywordsByCategory.soft])];
  const allTools = [...new Set([...profile.toolKeywords, ...jobKeywordsByCategory.tools])];
  
  const technicalAnalysis = calculateCategoryScore(resumeKeywords, allTechnical);
  const softAnalysis = calculateCategoryScore(resumeKeywords, allSoft);
  const toolsAnalysis = calculateCategoryScore(resumeKeywords, allTools);
  
  // Combine all matched and missing keywords
  const allMatched = [
    ...technicalAnalysis.matched,
    ...softAnalysis.matched,
    ...toolsAnalysis.matched
  ];
  
  const allMissing = [
    ...technicalAnalysis.missing.map(keyword => ({ keyword, category: 'technical' as const })),
    ...softAnalysis.missing.map(keyword => ({ keyword, category: 'soft' as const })),
    ...toolsAnalysis.missing.map(keyword => ({ keyword, category: 'tools' as const }))
  ];
  
  // Calculate overall score (weighted by category importance)
  const overallScore = Math.round(
    (technicalAnalysis.score * 0.4 +
     softAnalysis.score * 0.2 +
     toolsAnalysis.score * 0.3 +
     90 * 0.1) // Base score for having a resume
  );
  
  // Calculate additional scores
  const experienceScore = calculateExperienceScore(resumeData);
  const skillsScore = calculateSkillsScore(resumeData);
  
  // Generate recommendations
  const recommendations = generateRecommendations(allMissing, detectedIndustry);
  
  // Return in the format expected by JobDescriptionMatcher component
  return {
    overallScore,
    matchedKeywords: allMatched,
    missingKeywords: allMissing,
    detectedIndustry,
    experienceScore,
    skillsScore,
    recommendations,
    keywordCategories: {
      technical: allTechnical,
      softSkills: allSoft,
      tools: allTools
    }
  };
};

// Export additional utility functions
export const extractJobKeywords = (jobDescription: string): string[] => {
  const keywords = extractKeywordsByCategory(jobDescription);
  return [...keywords.technical, ...keywords.soft, ...keywords.tools];
};

export const getIndustryProfile = (industry: string): IndustryProfile | null => {
  return industryProfiles[industry] || null;
};

export const getAllIndustries = (): string[] => {
  return Object.keys(industryProfiles);
};

export const analyzeTechnicalSkillGaps = (
  resumeSkills: string[],
  targetIndustry: string
): { missing: string[]; matched: string[]; recommendations: string[] } => {
  const profile = industryProfiles[targetIndustry];
  if (!profile) {
    return { missing: [], matched: [], recommendations: [] };
  }
  
  const resumeSkillsNormalized = resumeSkills.map(skill => normalizeText(skill));
  const matched: string[] = [];
  const missing: string[] = [];
  
  profile.technicalKeywords.forEach(skill => {
    const normalizedSkill = normalizeText(skill);
    const found = resumeSkillsNormalized.some(resumeSkill => 
      resumeSkill.includes(normalizedSkill) || normalizedSkill.includes(resumeSkill)
    );
    
    if (found) {
      matched.push(skill);
    } else {
      missing.push(skill);
    }
  });
  
  const recommendations = missing.slice(0, 5).map(skill => 
    `Consider learning ${skill} - it's commonly required in ${targetIndustry} roles`
  );
  
  return { missing, matched, recommendations };
};

// Export types for external use
export type {
  ResumeData,
  ComponentMatchResult as JobMatchResult,
  IndustryProfile
};