// Template configuration with comprehensive metadata for SEO and functionality
// Improved version with proper typing, consistency, and design tokens

// Design token system for colors (prevents hard-coding and enables theming)
export const designTokens = {
  colors: {
    // Primary brand colors
    brandPrimary: '#2563eb',
    brandSecondary: '#7c3aed',
    
    // Semantic colors
    trustBlue: '#2563eb',
    professionalNavy: '#1e3a8a', 
    modernCyan: '#0891b2',
    healthcareGreen: '#059669',
    creativeViolet: '#8b5cf6',
    energyOrange: '#d97706',
    academicIndigo: '#6366f1',
    governmentGray: '#374151',
    successGreen: '#10b981',
    
    // Text colors
    textPrimary: '#111827',
    textSecondary: '#374151',
    textTertiary: '#6b7280',
    
    // Background colors
    backgroundWhite: '#ffffff',
    backgroundGray: '#f9fafb',
    
    // Border colors
    borderLight: '#e5e7eb',
    borderMedium: '#d1d5db'
  }
} as const;

// Strict typing for template properties
export const templateCategories = {
  corporate: {
    name: 'Corporate & Business',
    description: 'Professional templates for corporate environments',
    icon: 'briefcase',
    color: designTokens.colors.trustBlue
  },
  creative: {
    name: 'Creative & Design', 
    description: 'Eye-catching templates for creative professionals',
    icon: 'palette',
    color: designTokens.colors.creativeViolet
  },
  tech: {
    name: 'Technology',
    description: 'Modern templates for tech professionals', 
    icon: 'code',
    color: designTokens.colors.modernCyan
  },
  healthcare: {
    name: 'Healthcare',
    description: 'Clean templates for medical professionals',
    icon: 'heart',
    color: designTokens.colors.healthcareGreen
  },
  trades: {
    name: 'Trades & Services',
    description: 'Practical templates for skilled trades',
    icon: 'wrench', 
    color: designTokens.colors.energyOrange
  },
  academic: {
    name: 'Academic & Research',
    description: 'Scholarly templates for academia',
    icon: 'graduation-cap',
    color: designTokens.colors.academicIndigo
  },
  government: {
    name: 'Government & Federal',
    description: 'Compliant templates for government positions',
    icon: 'shield',
    color: designTokens.colors.governmentGray
  }
} as const;

// Strict enums for consistent typing
export const experienceLevels = ['entry', 'mid', 'senior', 'executive', 'all'] as const;
export const layoutTypes = ['singleColumn', 'twoColumn', 'creative', 'minimal', 'sidebar', 'modern', 'classic'] as const;

// Type definitions
export type TemplateCategory = keyof typeof templateCategories;
export type ExperienceLevel = typeof experienceLevels[number];
export type LayoutType = typeof layoutTypes[number];

export interface TemplateColors {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  heading: string;
  background: string;
  border: string;
}

export interface TemplateFeatures {
  atsOptimized: boolean;
  multiPage: boolean; // Removed conflicting singlePage - multiPage: false means single page only
  photoSupport: boolean;
  colorCustomization: boolean;
  fontCustomization: boolean;
  sectionReordering: boolean;
  skillsRating: boolean;
  socialLinks: boolean;
  qrCode: boolean;
  portfolio: boolean;
  references: boolean;
}

export interface TemplateMetadata {
  readonly id: string;
  readonly name: string;
  readonly displayName: string;
  readonly category: TemplateCategory;
  readonly subcategory?: string;
  readonly description: string;
  readonly longDescription: string;
  readonly layout: LayoutType;
  readonly colors: TemplateColors;
  readonly features: TemplateFeatures;
  
  // SEO and Marketing
  readonly seoTitle: string;
  readonly seoDescription: string;
  readonly seoKeywords: readonly string[];
  readonly slug: string;
  
  // Targeting
  readonly targetIndustries: readonly string[];
  readonly targetRoles: readonly string[];
  readonly experienceLevel: ExperienceLevel;
  
  // Scoring and Analytics
  readonly atsScore: number;
  readonly popularityRank: number;
  readonly conversionRate: number;
  
  // Technical
  readonly previewImage: string;
  readonly thumbnailImage: string;
  readonly demoData?: boolean;
  readonly premium: boolean;
  readonly featured: boolean;
  readonly new: boolean;
  
  // Content hints
  readonly bestFor: readonly string[];
  readonly notRecommendedFor: readonly string[];
  readonly tips: readonly string[];
  
  // Usage stats
  readonly monthlyDownloads?: number;
  readonly userRating?: number;
  readonly totalUsage?: number;
}

// Template configurations with camelCase keys and consistent data
export const templates = {
  atsFriendly: {
    id: 'atsFriendly',
    name: 'ATS-Friendly',
    displayName: 'ATS-Optimized Resume Template',
    category: 'corporate',
    description: 'Ultra-clean template designed to pass through any ATS system with 99% success rate',
    longDescription: 'Our ATS-Friendly template is specifically engineered to beat Applicant Tracking Systems used by 98% of Fortune 500 companies. Features simple formatting, standard fonts, and optimized keyword placement to ensure your resume gets seen by human recruiters.',
    layout: 'singleColumn',
    colors: {
      primary: '#000000',
      secondary: '#333333', 
      accent: '#666666',
      text: designTokens.colors.textPrimary,
      heading: designTokens.colors.textPrimary,
      background: designTokens.colors.backgroundWhite,
      border: designTokens.colors.borderMedium
    },
    features: {
      atsOptimized: true,
      multiPage: true,
      photoSupport: false,
      colorCustomization: false,
      fontCustomization: false,
      sectionReordering: true,
      skillsRating: false,
      socialLinks: true,
      qrCode: false,
      portfolio: false,
      references: true
    },
    seoTitle: 'Free ATS-Friendly Resume Template - 99% ATS Pass Rate | FreeResume',
    seoDescription: 'Download our ATS-optimized resume template for free. Guaranteed to pass through any applicant tracking system. Simple, clean design preferred by 95% of recruiters.',
    seoKeywords: ['ats resume template', 'ats friendly resume', 'applicant tracking system resume', 'ats optimized template', 'free ats resume'],
    slug: 'ats-friendly-resume-template',
    targetIndustries: ['All Industries'],
    targetRoles: ['All Roles'],
    experienceLevel: 'all',
    atsScore: 99,
    popularityRank: 1,
    conversionRate: 89,
    previewImage: '/templates/previews/ats-friendly-preview.jpg',
    thumbnailImage: '/templates/thumbnails/ats-friendly-thumb.jpg',
    premium: false,
    featured: true,
    new: false,
    bestFor: [
      'Corporate job applications',
      'Large company applications', 
      'Government positions',
      'When ATS compatibility is critical',
      'Conservative industries (finance, law, consulting)'
    ],
    notRecommendedFor: [
      'Creative industries',
      'Startup environments',
      'Portfolio-based roles', 
      'When visual appeal is primary'
    ],
    tips: [
      'Use standard section headings like "Work Experience" and "Education"',
      'Avoid tables, graphics, and complex formatting',
      'Include relevant keywords from job descriptions',
      'Use standard fonts like Arial or Calibri',
      'Keep file format as .docx or .pdf'
    ],
    monthlyDownloads: 45000,
    userRating: 4.8,
    totalUsage: 180000
  },

  twoColumnProfessional: {
    id: 'twoColumnProfessional',
    name: 'Two-Column Professional',
    displayName: 'Two-Column Professional Resume Template',
    category: 'corporate',
    description: 'Space-efficient professional template with sidebar for skills and contact information',
    longDescription: 'Perfect balance of modern design and ATS compatibility. The two-column layout maximizes space utilization while maintaining professional appearance. Left sidebar highlights key skills and contact info, while the main column focuses on experience and achievements.',
    layout: 'twoColumn',
    colors: {
      primary: designTokens.colors.trustBlue,
      secondary: '#1e40af',
      accent: '#3b82f6',
      text: designTokens.colors.textSecondary,
      heading: designTokens.colors.textPrimary,
      background: designTokens.colors.backgroundWhite,
      border: designTokens.colors.borderLight
    },
    features: {
      atsOptimized: true,
      multiPage: true,
      photoSupport: true,
      colorCustomization: true,
      fontCustomization: true,
      sectionReordering: true,
      skillsRating: true,
      socialLinks: true,
      qrCode: false,
      portfolio: true,
      references: true
    },
    seoTitle: 'Free Two-Column Resume Template - Professional Modern Design | FreeResume',
    seoDescription: 'Download our two-column professional resume template. Space-efficient design with sidebar layout. ATS-friendly and perfect for modern professionals.',
    seoKeywords: ['two column resume template', 'professional resume template', 'modern resume layout', 'sidebar resume template', 'space efficient resume'],
    slug: 'two-column-professional-resume-template',
    targetIndustries: ['Technology', 'Finance', 'Consulting', 'Marketing', 'Healthcare'],
    targetRoles: ['Software Engineer', 'Marketing Manager', 'Business Analyst', 'Project Manager', 'Consultant'],
    experienceLevel: 'mid',
    atsScore: 85,
    popularityRank: 2,
    conversionRate: 78,
    previewImage: '/templates/previews/two-column-professional-preview.jpg',
    thumbnailImage: '/templates/thumbnails/two-column-professional-thumb.jpg',
    premium: false,
    featured: true,
    new: false,
    bestFor: [
      'Mid-career professionals',
      'Technical roles with many skills',
      'Modern companies',
      'Roles requiring skill demonstration',
      'Space-conscious applications'
    ],
    notRecommendedFor: [
      'Very traditional industries',
      'Government positions',
      'Entry-level with limited experience',
      'Academic positions',
      'When ATS compatibility is critical'
    ],
    tips: [
      'Use the sidebar for technical skills and certifications',
      'Keep contact information prominent in the sidebar',
      'Balance content between columns for visual appeal',
      'Use bullet points for easy scanning',
      'Customize colors to match your industry'
    ],
    monthlyDownloads: 38000,
    userRating: 4.7,
    totalUsage: 156000
  },

  executive: {
    id: 'executive',
    name: 'Executive',
    displayName: 'Executive Resume Template',
    category: 'corporate',
    subcategory: 'leadership',
    description: 'Premium template designed for C-level, VP, and Director positions',
    longDescription: 'Sophisticated template that commands attention for senior leadership roles. Features prominent executive summary, achievement-focused layout, and premium styling that reflects executive-level professionalism. Perfect for C-suite, VP, and director applications.',
    layout: 'singleColumn',
    colors: {
      primary: designTokens.colors.professionalNavy,
      secondary: '#1e40af',
      accent: '#3730a3',
      text: designTokens.colors.textSecondary,
      heading: designTokens.colors.textPrimary,
      background: designTokens.colors.backgroundWhite,
      border: designTokens.colors.borderMedium
    },
    features: {
      atsOptimized: true,
      multiPage: true,
      photoSupport: true,
      colorCustomization: true,
      fontCustomization: true,
      sectionReordering: true,
      skillsRating: false,
      socialLinks: true,
      qrCode: false,
      portfolio: false,
      references: true
    },
    seoTitle: 'Free Executive Resume Template - C-Level & VP Resume Format | FreeResume',
    seoDescription: 'Professional executive resume template for C-level, VP, and director positions. Premium design that showcases leadership experience and achievements.',
    seoKeywords: ['executive resume template', 'ceo resume template', 'vp resume format', 'director resume template', 'c-level resume', 'leadership resume'],
    slug: 'executive-resume-template',
    targetIndustries: ['All Industries'],
    targetRoles: ['CEO', 'CTO', 'VP', 'Director', 'General Manager', 'Division Head'],
    experienceLevel: 'executive',
    atsScore: 94,
    popularityRank: 3,
    conversionRate: 82,
    previewImage: '/templates/previews/executive-preview.jpg',
    thumbnailImage: '/templates/thumbnails/executive-thumb.jpg',
    premium: false,
    featured: true,
    new: false,
    bestFor: [
      'C-level executives',
      'Vice Presidents',
      'Directors and senior managers',
      'Board positions',
      'Senior consulting roles',
      'High-level government positions'
    ],
    notRecommendedFor: [
      'Entry-level positions',
      'Individual contributor roles',
      'Creative industries',
      'Startup environments',
      'Technical specialist roles'
    ],
    tips: [
      'Lead with a powerful executive summary',
      'Focus on business impact and P&L responsibility',
      'Include board memberships and speaking engagements',
      'Quantify achievements with dollar amounts and percentages',
      'Use premium paper for printed copies'
    ],
    monthlyDownloads: 12000,
    userRating: 4.9,
    totalUsage: 48000
  },

  entryLevel: {
    id: 'entryLevel',
    name: 'Entry Level',
    displayName: 'Entry-Level Resume Template',
    category: 'corporate',
    subcategory: 'student',
    description: 'Perfect template for recent graduates and career changers with limited experience',
    longDescription: 'Designed specifically for job seekers with limited work experience. Emphasizes education, internships, projects, and transferable skills. Clean layout that makes the most of what you have while maintaining professional appearance.',
    layout: 'singleColumn',
    colors: {
      primary: designTokens.colors.successGreen,
      secondary: '#047857',
      accent: '#10b981',
      text: designTokens.colors.textSecondary,
      heading: designTokens.colors.textPrimary,
      background: designTokens.colors.backgroundWhite,
      border: designTokens.colors.borderLight
    },
    features: {
      atsOptimized: true,
      multiPage: false, // Single page only for entry-level
      photoSupport: false,
      colorCustomization: true,
      fontCustomization: true,
      sectionReordering: true,
      skillsRating: true,
      socialLinks: true,
      qrCode: false,
      portfolio: true,
      references: false
    },
    seoTitle: 'Free Entry-Level Resume Template - Recent Graduate & Student Resume | FreeResume',
    seoDescription: 'Perfect resume template for recent graduates and entry-level job seekers. Emphasizes education, internships, and skills over work experience.',
    seoKeywords: ['entry level resume template', 'recent graduate resume', 'student resume template', 'first job resume', 'college graduate resume', 'internship resume'],
    slug: 'entry-level-resume-template',
    targetIndustries: ['All Industries'],
    targetRoles: ['Recent Graduate', 'Entry Level', 'Intern', 'Associate', 'Junior'],
    experienceLevel: 'entry',
    atsScore: 90,
    popularityRank: 4,
    conversionRate: 72,
    previewImage: '/templates/previews/entry-level-preview.jpg',
    thumbnailImage: '/templates/thumbnails/entry-level-thumb.jpg',
    premium: false,
    featured: true,
    new: false,
    bestFor: [
      'Recent college graduates',
      'Career changers',
      'First-time job seekers',
      'Internship applications',
      'Part-time to full-time transitions',
      'Students with limited experience'
    ],
    notRecommendedFor: [
      'Experienced professionals',
      'Senior-level positions',
      'Executive roles',
      'Positions requiring extensive experience',
      'Industry expert roles'
    ],
    tips: [
      'Lead with education section if it\'s your strongest asset',
      'Include relevant coursework and academic projects',
      'Highlight internships, part-time work, and volunteer experience',
      'Focus on transferable skills and achievements',
      'Include extracurricular activities that show leadership'
    ],
    monthlyDownloads: 42000,
    userRating: 4.6,
    totalUsage: 168000
  },

  softwareEngineer: {
    id: 'softwareEngineer',
    name: 'Software Engineer',
    displayName: 'Software Engineer Resume Template',
    category: 'tech',
    description: 'Technical resume template optimized for software developers and engineers',
    longDescription: 'Specifically designed for software engineers, developers, and technical professionals. Features dedicated sections for technical skills, programming languages, frameworks, and project portfolios. Clean, modern design that appeals to tech companies.',
    layout: 'twoColumn',
    colors: {
      primary: designTokens.colors.modernCyan,
      secondary: '#0e7490',
      accent: '#06b6d4',
      text: designTokens.colors.textSecondary,
      heading: designTokens.colors.textPrimary,
      background: designTokens.colors.backgroundWhite,
      border: designTokens.colors.borderLight
    },
    features: {
      atsOptimized: true,
      multiPage: true,
      photoSupport: false,
      colorCustomization: true,
      fontCustomization: true,
      sectionReordering: true,
      skillsRating: true,
      socialLinks: true,
      qrCode: false,
      portfolio: true,
      references: false
    },
    seoTitle: 'Free Software Engineer Resume Template - Developer Resume | FreeResume',
    seoDescription: 'Professional software engineer resume template. Perfect for developers, programmers, and tech professionals. Includes technical skills and portfolio sections.',
    seoKeywords: ['software engineer resume template', 'developer resume template', 'programmer resume', 'tech resume template', 'coding resume', 'full stack developer resume'],
    slug: 'software-engineer-resume-template',
    targetIndustries: ['Technology', 'Software', 'Fintech', 'Gaming', 'E-commerce'],
    targetRoles: ['Software Engineer', 'Full Stack Developer', 'Frontend Developer', 'Backend Developer', 'DevOps Engineer', 'Software Architect'],
    experienceLevel: 'all',
    atsScore: 93,
    popularityRank: 5,
    conversionRate: 85,
    previewImage: '/templates/previews/software-engineer-preview.jpg',
    thumbnailImage: '/templates/thumbnails/software-engineer-thumb.jpg',
    premium: false,
    featured: true,
    new: false,
    bestFor: [
      'Software developers',
      'Full-stack engineers',
      'DevOps engineers',
      'Technical leads',
      'Startup applications',
      'Tech company positions'
    ],
    notRecommendedFor: [
      'Non-technical roles',
      'Traditional industries',
      'Management positions',
      'Sales roles',
      'Healthcare positions'
    ],
    tips: [
      'List programming languages and frameworks prominently',
      'Include links to GitHub and portfolio projects',
      'Quantify technical achievements with metrics',
      'Highlight specific technologies used in each role',
      'Include open source contributions'
    ],
    monthlyDownloads: 28000,
    userRating: 4.8,
    totalUsage: 112000
  },

  healthcareNursing: {
    id: 'healthcareNursing',
    name: 'Healthcare Professional', 
    displayName: 'Healthcare & Nursing Resume Template',
    category: 'healthcare',
    description: 'Clinical resume template for nurses, doctors, and healthcare professionals',
    longDescription: 'Designed for healthcare professionals including nurses, doctors, medical assistants, and clinical staff. Features sections for certifications, clinical experience, and medical specializations. Clean, trustworthy design appropriate for healthcare environments.',
    layout: 'singleColumn',
    colors: {
      primary: designTokens.colors.healthcareGreen,
      secondary: '#047857',
      accent: '#10b981',
      text: designTokens.colors.textSecondary,
      heading: designTokens.colors.textPrimary,
      background: designTokens.colors.backgroundWhite,
      border: designTokens.colors.borderLight
    },
    features: {
      atsOptimized: true,
      multiPage: true,
      photoSupport: false,
      colorCustomization: true,
      fontCustomization: true,
      sectionReordering: true,
      skillsRating: false,
      socialLinks: false,
      qrCode: false,
      portfolio: false,
      references: true
    },
    seoTitle: 'Free Healthcare Resume Template - Nursing & Medical Professional | FreeResume',
    seoDescription: 'Professional healthcare resume template for nurses, doctors, and medical professionals. Includes clinical experience and certification sections.',
    seoKeywords: ['nursing resume template', 'healthcare resume template', 'medical resume template', 'rn resume template', 'doctor resume', 'clinical resume'],
    slug: 'healthcare-nursing-resume-template',
    targetIndustries: ['Healthcare', 'Medical', 'Nursing', 'Clinical Research', 'Pharmaceuticals'],
    targetRoles: ['Registered Nurse', 'Licensed Practical Nurse', 'Medical Assistant', 'Healthcare Administrator', 'Clinical Coordinator'],
    experienceLevel: 'all',
    atsScore: 95,
    popularityRank: 6,
    conversionRate: 79,
    previewImage: '/templates/previews/healthcare-nursing-preview.jpg',
    thumbnailImage: '/templates/thumbnails/healthcare-nursing-thumb.jpg',
    premium: false,
    featured: true,
    new: false,
    bestFor: [
      'Registered nurses',
      'Licensed practical nurses',
      'Medical assistants',
      'Healthcare administrators',
      'Clinical coordinators',
      'Medical technologists'
    ],
    notRecommendedFor: [
      'Non-healthcare roles',
      'Creative positions',
      'Tech roles',
      'Sales positions',
      'Academic research (non-medical)'
    ],
    tips: [
      'Prominently display nursing license and certifications',
      'Include clinical rotations and specializations',
      'Quantify patient care achievements',
      'List medical software and equipment experience',
      'Highlight continuing education and training'
    ],
    monthlyDownloads: 22000,
    userRating: 4.7,
    totalUsage: 88000
  },

  tradesProfessional: {
    id: 'tradesProfessional',
    name: 'Trades Professional',
    displayName: 'Trades & Blue-Collar Resume Template',
    category: 'trades',
    description: 'Practical template for electricians, plumbers, mechanics, and skilled trades',
    longDescription: 'Specifically designed for skilled trades professionals including electricians, plumbers, HVAC technicians, mechanics, and construction workers. Emphasizes certifications, safety training, apprenticeships, and hands-on experience.',
    layout: 'singleColumn',
    colors: {
      primary: designTokens.colors.energyOrange,
      secondary: '#b45309',
      accent: '#f59e0b',
      text: designTokens.colors.textSecondary,
      heading: designTokens.colors.textPrimary,
      background: designTokens.colors.backgroundWhite,
      border: designTokens.colors.borderLight
    },
    features: {
      atsOptimized: true,
      multiPage: true,
      photoSupport: false,
      colorCustomization: true,
      fontCustomization: true,
      sectionReordering: true,
      skillsRating: false,
      socialLinks: false,
      qrCode: false,
      portfolio: false,
      references: true
    },
    seoTitle: 'Free Trades Resume Template - Electrician, Plumber, Mechanic | FreeResume',
    seoDescription: 'Professional trades resume template for electricians, plumbers, mechanics, and skilled workers. Emphasizes certifications and hands-on experience.',
    seoKeywords: ['electrician resume template', 'plumber resume template', 'mechanic resume template', 'trades resume template', 'blue collar resume', 'skilled worker resume'],
    slug: 'trades-blue-collar-resume-template',
    targetIndustries: ['Construction', 'Manufacturing', 'Utilities', 'Automotive', 'Maintenance'],
    targetRoles: ['Electrician', 'Plumber', 'HVAC Technician', 'Mechanic', 'Welder', 'Carpenter'],
    experienceLevel: 'all',
    atsScore: 88,
    popularityRank: 7,
    conversionRate: 74,
    previewImage: '/templates/previews/trades-professional-preview.jpg',
    thumbnailImage: '/templates/thumbnails/trades-professional-thumb.jpg',
    premium: false,
    featured: false,
    new: false,
    bestFor: [
      'Licensed electricians',
      'Plumbing professionals',
      'HVAC technicians',
      'Automotive mechanics',
      'Welders and fabricators',
      'Construction workers'
    ],
    notRecommendedFor: [
      'Office-based roles',
      'Management positions',
      'Creative roles',
      'Healthcare positions',
      'Academic positions'
    ],
    tips: [
      'List all relevant licenses and certifications prominently',
      'Include safety training and OSHA certifications',
      'Highlight apprenticeship and on-the-job training',
      'Quantify projects completed and efficiency improvements',
      'Include union memberships if applicable'
    ],
    monthlyDownloads: 18000,
    userRating: 4.5,
    totalUsage: 72000
  },

  salesMarketing: {
    id: 'salesMarketing',
    name: 'Sales Professional',
    displayName: 'Sales & Marketing Resume Template',
    category: 'corporate',
    subcategory: 'sales',
    description: 'Results-driven template for sales representatives and marketing professionals',
    longDescription: 'Designed for sales professionals, marketing managers, and business development roles. Features achievement-focused layout with metrics, quotas, and revenue generation. Perfect for demonstrating sales performance and marketing ROI.',
    layout: 'singleColumn',
    colors: {
      primary: '#dc2626',
      secondary: '#b91c1c',
      accent: '#ef4444',
      text: designTokens.colors.textSecondary,
      heading: designTokens.colors.textPrimary,
      background: designTokens.colors.backgroundWhite,
      border: designTokens.colors.borderLight
    },
    features: {
      atsOptimized: true,
      multiPage: true,
      photoSupport: true,
      colorCustomization: true,
      fontCustomization: true,
      sectionReordering: true,
      skillsRating: true,
      socialLinks: true,
      qrCode: false,
      portfolio: false,
      references: true
    },
    seoTitle: 'Free Sales Resume Template - Marketing & Business Development | FreeResume',
    seoDescription: 'Professional sales resume template for sales representatives, marketing managers, and business development roles. Achievement-focused design.',
    seoKeywords: ['sales resume template', 'marketing resume template', 'sales rep resume', 'business development resume', 'account manager resume'],
    slug: 'sales-marketing-resume-template',
    targetIndustries: ['Sales', 'Marketing', 'Business Development', 'Real Estate', 'Insurance'],
    targetRoles: ['Sales Representative', 'Account Manager', 'Marketing Manager', 'Business Development Manager', 'Sales Manager'],
    experienceLevel: 'all',
    atsScore: 91,
    popularityRank: 8,
    conversionRate: 81,
    previewImage: '/templates/previews/sales-marketing-preview.jpg',
    thumbnailImage: '/templates/thumbnails/sales-marketing-thumb.jpg',
    premium: false,
    featured: false,
    new: false,
    bestFor: [
      'Sales representatives',
      'Account managers',
      'Marketing managers',
      'Business development roles',
      'Customer success managers',
      'Real estate agents'
    ],
    notRecommendedFor: [
      'Technical roles',
      'Healthcare positions',
      'Academic roles',
      'Government positions',
      'Creative industries'
    ],
    tips: [
      'Lead with quantified sales achievements',
      'Include quota attainment percentages',
      'Highlight revenue generated and accounts managed',
      'Show progression in sales targets over time',
      'Include CRM and sales tool proficiency'
    ],
    monthlyDownloads: 24000,
    userRating: 4.6,
    totalUsage: 96000
  },

  creativeProfessional: {
    id: 'creativeProfessional',
    name: 'Creative Professional',
    displayName: 'Creative Professional Resume Template',
    category: 'creative',
    description: 'Artistic template for designers, artists, and creative professionals',
    longDescription: 'Visually striking template designed for creative professionals including graphic designers, artists, photographers, and marketing creatives. Features portfolio integration, creative layout elements, and customizable color schemes.',
    layout: 'creative',
    colors: {
      primary: designTokens.colors.creativeViolet,
      secondary: '#7c3aed',
      accent: '#a78bfa',
      text: designTokens.colors.textSecondary,
      heading: designTokens.colors.textPrimary,
      background: designTokens.colors.backgroundWhite,
      border: designTokens.colors.borderLight
    },
    features: {
      atsOptimized: false,
      multiPage: true,
      photoSupport: true,
      colorCustomization: true,
      fontCustomization: true,
      sectionReordering: true,
      skillsRating: true,
      socialLinks: true,
      qrCode: true,
      portfolio: true,
      references: false
    },
    seoTitle: 'Free Creative Resume Template - Graphic Designer & Artist Resume | FreeResume',
    seoDescription: 'Creative resume template for designers, artists, and creative professionals. Features portfolio sections and artistic design elements.',
    seoKeywords: ['creative resume template', 'graphic designer resume', 'artist resume template', 'creative professional resume', 'designer cv template'],
    slug: 'creative-professional-resume-template',
    targetIndustries: ['Design', 'Advertising', 'Media', 'Entertainment', 'Fashion'],
    targetRoles: ['Graphic Designer', 'Art Director', 'Creative Director', 'Photographer', 'Illustrator'],
    experienceLevel: 'all',
    atsScore: 70,
    popularityRank: 9,
    conversionRate: 68,
    previewImage: '/templates/previews/creative-professional-preview.jpg',
    thumbnailImage: '/templates/thumbnails/creative-professional-thumb.jpg',
    premium: false,
    featured: false,
    new: true,
    bestFor: [
      'Graphic designers',
      'Art directors',
      'Photographers',
      'Illustrators',
      'Creative agencies',
      'Portfolio-based roles'
    ],
    notRecommendedFor: [
      'Corporate environments',
      'Traditional industries',
      'Government positions',
      'Healthcare roles',
      'Finance positions'
    ],
    tips: [
      'Include a strong portfolio section with project images',
      'Use the template as a showcase of your design skills',
      'Link to online portfolio and social media',
      'Customize colors to reflect your personal brand',
      'Keep some versions more conservative for different clients'
    ],
    monthlyDownloads: 15000,
    userRating: 4.4,
    totalUsage: 60000
  },

  academicResearch: {
    id: 'academicResearch',
    name: 'Academic',
    displayName: 'Academic & Research Resume Template',
    category: 'academic',
    description: 'Scholarly template for professors, researchers, and academic professionals',
    longDescription: 'Comprehensive template designed for academic professionals, researchers, and educators. Features sections for publications, research experience, grants, conferences, and teaching experience. Formal design appropriate for academic institutions.',
    layout: 'singleColumn',
    colors: {
      primary: designTokens.colors.academicIndigo,
      secondary: '#4f46e5',
      accent: '#818cf8',
      text: designTokens.colors.textSecondary,
      heading: designTokens.colors.textPrimary,
      background: designTokens.colors.backgroundWhite,
      border: designTokens.colors.borderLight
    },
    features: {
      atsOptimized: true,
      multiPage: true,
      photoSupport: false,
      colorCustomization: true,
      fontCustomization: true,
      sectionReordering: true,
      skillsRating: false,
      socialLinks: true,
      qrCode: false,
      portfolio: true,
      references: true
    },
    seoTitle: 'Free Academic Resume Template - Professor & Researcher CV | FreeResume',
    seoDescription: 'Academic resume template for professors, researchers, and educators. Includes sections for publications, research, and teaching experience.',
    seoKeywords: ['academic resume template', 'professor resume template', 'researcher cv template', 'academic cv', 'faculty resume', 'phd resume'],
    slug: 'academic-research-resume-template',
    targetIndustries: ['Education', 'Research', 'Academia', 'Non-profit', 'Think Tanks'],
    targetRoles: ['Professor', 'Research Scientist', 'Post-doctoral Researcher', 'Academic Administrator', 'Research Associate'],
    experienceLevel: 'mid',
    atsScore: 92,
    popularityRank: 10,
    conversionRate: 76,
    previewImage: '/templates/previews/academic-research-preview.jpg',
    thumbnailImage: '/templates/thumbnails/academic-research-thumb.jpg',
    premium: false,
    featured: false,
    new: false,
    bestFor: [
      'University professors',
      'Research scientists',
      'Post-doctoral researchers',
      'Academic administrators',
      'PhD candidates',
      'Research associates'
    ],
    notRecommendedFor: [
      'Corporate positions',
      'Sales roles',
      'Creative industries',
      'Trades positions',
      'Entry-level positions'
    ],
    tips: [
      'List publications in chronological order',
      'Include grant funding amounts and sources',
      'Highlight conference presentations and keynotes',
      'Show progression in academic rank',
      'Include peer review and editorial experience'
    ],
    monthlyDownloads: 8000,
    userRating: 4.8,
    totalUsage: 32000
  }
} as const;

// Type derivation from the const assertion
export type TemplateId = keyof typeof templates;
export type Template = typeof templates[TemplateId];

// Improved utility functions with proper typing and duplicate prevention
export const getTemplatesByCategory = (category: TemplateCategory): Template[] => {
  return Object.values(templates).filter(template => template.category === category);
};

export const getTemplatesByExperienceLevel = (level: ExperienceLevel): Template[] => {
  return Object.values(templates).filter(template => 
    template.experienceLevel === level || template.experienceLevel === 'all'
  );
};

export const getTemplatesByIndustry = (industry: string): Template[] => {
  // Use Set to prevent duplicates when templates include both specific industry and "All Industries"
  const matchingTemplates = new Set<Template>();
  
  Object.values(templates).forEach(template => {
    if (template.targetIndustries.includes(industry) || template.targetIndustries.includes('All Industries')) {
      matchingTemplates.add(template);
    }
  });
  
  return Array.from(matchingTemplates);
};

export const getFeaturedTemplates = (): Template[] => {
  return Object.values(templates).filter(template => template.featured);
};

export const getPopularTemplates = (limit = 6): Template[] => {
  return Object.values(templates)
    .sort((a, b) => a.popularityRank - b.popularityRank)
    .slice(0, limit);
};

// Enhanced search that includes all relevant fields
export const searchTemplates = (query: string): Template[] => {
  const searchTerm = query.toLowerCase();
  return Object.values(templates).filter(template => 
    template.name.toLowerCase().includes(searchTerm) ||
    template.displayName.toLowerCase().includes(searchTerm) ||
    template.description.toLowerCase().includes(searchTerm) ||
    template.longDescription.toLowerCase().includes(searchTerm) ||
    template.seoKeywords.some(keyword => keyword.toLowerCase().includes(searchTerm)) ||
    template.slug.toLowerCase().includes(searchTerm) ||
    template.targetIndustries.some(industry => industry.toLowerCase().includes(searchTerm)) ||
    template.targetRoles.some(role => role.toLowerCase().includes(searchTerm)) ||
    template.bestFor.some(item => item.toLowerCase().includes(searchTerm))
  );
};

// Get template by ID with type safety
export const getTemplateById = (id: string): Template | undefined => {
  return templates[id as TemplateId];
};

// URL validation helper (improved regex)
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return /^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(url);
  } catch {
    return false;
  }
};

// Export template statistics with proper calculations
export const templateStats = {
  totalTemplates: Object.keys(templates).length,
  totalCategories: Object.keys(templateCategories).length,
  averageAtsScore: Math.round(
    Object.values(templates).reduce((sum, t) => sum + t.atsScore, 0) / Object.values(templates).length
  ),
  totalDownloads: Object.values(templates).reduce((sum, t) => sum + (t.monthlyDownloads || 0), 0),
  featuredCount: Object.values(templates).filter(t => t.featured).length,
  newCount: Object.values(templates).filter(t => t.new).length,
  averageRating: Number((
    Object.values(templates)
      .filter(t => t.userRating)
      .reduce((sum, t) => sum + (t.userRating || 0), 0) / 
    Object.values(templates).filter(t => t.userRating).length
  ).toFixed(1))
} as const;

export default templates;