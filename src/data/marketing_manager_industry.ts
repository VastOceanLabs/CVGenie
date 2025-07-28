// Marketing Manager Industry-Specific Data
// Enhanced with salary intelligence, demand metrics, and ATS optimization

// Type definitions for enhanced industry data
export type DemandLevel = 'low' | 'medium' | 'high' | 'very-high' | 'critical';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type SalaryImpactLevel = 'low' | 'medium' | 'high' | 'very-high' | 'critical';
export type MarketShare = 'low' | 'medium' | 'high' | 'very-high';
export type SkillCategory = 'strategic' | 'analytics' | 'technical' | 'advertising' | 'digital' | 'social' | 'content' | 'optimization';
export type SoftSkillCategory = 'leadership' | 'analytical' | 'creative' | 'teamwork' | 'financial' | 'organizational' | 'communication' | 'strategic';
export type ToolCategory = 'marketing-automation' | 'enterprise-automation' | 'advertising' | 'social-advertising' | 'analytics' | 'design' | 'email-marketing' | 'seo-tools' | 'social-media' | 'content' | 'technical' | 'leadership' | 'creative' | 'optimization' | 'communication' | 'teamwork' | 'financial' | 'strategic' | 'digital' | 'social' | 'analytical' | 'organizational';

// Enhanced skill interface with salary intelligence
export interface EnhancedSkill {
  name: string;
  category: SkillCategory | SoftSkillCategory;
  demandLevel: DemandLevel;
  salaryImpact: SalaryImpactLevel; // Using string enum for consistency
  salaryImpactPercent?: number; // Optional numeric value for calculations
  atsWeight: number; // 1-10 scale
  level: ExperienceLevel; // Keeping original property name
  trending?: boolean;
  description: string;
}

// Enhanced tool interface
export interface EnhancedTool extends Omit<EnhancedSkill, 'category'> {
  category: ToolCategory;
  marketShare?: MarketShare;
}

// Certification interface
export interface MarketingCertification {
  name: string;
  issuer: string;
  difficulty: ExperienceLevel;
  timeToComplete: string;
  salaryImpact: SalaryImpactLevel;
  salaryImpactPercent?: number;
  demandLevel: DemandLevel;
  cost: string;
  validityPeriod: string;
  description: string;
}

// Salary data interfaces
export interface SalaryRange {
  entry: number;
  mid: number;
  senior: number;
  executive?: number;
}

export interface LocationSalary {
  entry: number;
  mid: number;
  senior: number;
}

export interface TopPayingSkill {
  skill: string;
  salaryPremium: number; // Percentage
}

// Helper function to convert salary impact levels to percentages
export const getSalaryImpactPercent = (level: SalaryImpactLevel): number => {
  const mapping: Record<SalaryImpactLevel, number> = {
    'low': 5,
    'medium': 10,
    'high': 15,
    'very-high': 20,
    'critical': 25
  };
  return mapping[level];
};

export const marketingManagerIndustry = {
  // Industry metadata
  industryInfo: {
    name: 'Marketing Manager',
    category: 'Marketing & Communications',
    description: 'Strategic marketing professionals who plan, develop, and execute marketing campaigns',
    averageSalary: {
      entry: 45_000,
      mid: 75_000,
      senior: 120_000,
      executive: 180_000
    },
    jobGrowthRate: 8.2, // Percentage growth projected
    demandLevel: 'high', // high, medium, low
    keywords: ['marketing', 'digital marketing', 'brand management', 'campaign management', 'analytics']
  },

  // Job titles and career progression
  jobTitles: {
    entry: [
      'Marketing Coordinator',
      'Digital Marketing Associate',
      'Marketing Specialist',
      'Content Marketing Associate',
      'Social Media Coordinator',
      'Marketing Analyst',
      'Campaign Coordinator',
      'Brand Associate'
    ],
    mid: [
      'Marketing Manager',
      'Digital Marketing Manager',
      'Brand Manager',
      'Product Marketing Manager',
      'Content Marketing Manager',
      'Social Media Manager',
      'Campaign Manager',
      'Marketing Operations Manager'
    ],
    senior: [
      'Senior Marketing Manager',
      'Marketing Director',
      'Head of Marketing',
      'VP of Marketing',
      'Chief Marketing Officer (CMO)',
      'Brand Director',
      'Global Marketing Manager',
      'Strategic Marketing Leader'
    ]
  },

  // Enhanced skills with salary impact and demand metrics
  skills: {
    // High-impact technical skills
    technical: [
      {
        name: 'Digital Marketing Strategy',
        category: 'strategic' as SkillCategory,
        demandLevel: 'very-high' as DemandLevel,
        salaryImpact: 'high' as SalaryImpactLevel,
        salaryImpactPercent: 15,
        atsWeight: 10,
        level: 'intermediate' as ExperienceLevel,
        trending: true,
        description: 'Developing comprehensive digital marketing strategies across channels'
      },
      {
        name: 'Google Analytics 4 (GA4)',
        category: 'analytics' as SkillCategory,
        demandLevel: 'very-high' as DemandLevel,
        salaryImpact: 'medium' as SalaryImpactLevel,
        salaryImpactPercent: 12,
        atsWeight: 9,
        level: 'intermediate' as ExperienceLevel,
        trending: true,
        description: 'Advanced web analytics and data-driven marketing insights'
      },
      {
        name: 'Marketing Automation',
        category: 'technical' as SkillCategory,
        demandLevel: 'high' as DemandLevel,
        salaryImpact: 'very-high' as SalaryImpactLevel,
        salaryImpactPercent: 18,
        atsWeight: 8,
        level: 'advanced' as ExperienceLevel,
        trending: true,
        description: 'HubSpot, Marketo, Salesforce Marketing Cloud automation'
      },
      {
        name: 'Paid Advertising (PPC)',
        category: 'advertising' as SkillCategory,
        demandLevel: 'very-high' as DemandLevel,
        salaryImpact: 'high' as SalaryImpactLevel,
        salaryImpactPercent: 14,
        atsWeight: 9,
        level: 'intermediate' as ExperienceLevel,
        trending: false,
        description: 'Google Ads, Facebook Ads, LinkedIn Ads management'
      },
      {
        name: 'Search Engine Optimization (SEO)',
        category: 'digital' as SkillCategory,
        demandLevel: 'high' as DemandLevel,
        salaryImpact: 'medium' as SalaryImpactLevel,
        salaryImpactPercent: 10,
        atsWeight: 8,
        level: 'intermediate' as ExperienceLevel,
        trending: false,
        description: 'Organic search optimization and content strategy'
      },
      {
        name: 'Social Media Marketing',
        category: 'social' as SkillCategory,
        demandLevel: 'high' as DemandLevel,
        salaryImpact: 'low' as SalaryImpactLevel,
        salaryImpactPercent: 8,
        atsWeight: 7,
        level: 'beginner' as ExperienceLevel,
        trending: false,
        description: 'Multi-platform social media strategy and content creation'
      },
      {
        name: 'Content Marketing',
        category: 'content' as SkillCategory,
        demandLevel: 'high' as DemandLevel,
        salaryImpact: 'medium' as SalaryImpactLevel,
        salaryImpactPercent: 11,
        atsWeight: 8,
        level: 'intermediate' as ExperienceLevel,
        trending: false,
        description: 'Strategic content creation, storytelling, and distribution'
      },
      {
        name: 'Email Marketing',
        category: 'digital' as SkillCategory,
        demandLevel: 'medium' as DemandLevel,
        salaryImpact: 'low' as SalaryImpactLevel,
        salaryImpactPercent: 7,
        atsWeight: 6,
        level: 'beginner' as ExperienceLevel,
        trending: false,
        description: 'Email campaign creation, segmentation, and automation'
      },
      {
        name: 'Marketing Analytics & Data Visualization',
        category: 'analytics' as SkillCategory,
        demandLevel: 'very-high' as DemandLevel,
        salaryImpact: 'high' as SalaryImpactLevel,
        salaryImpactPercent: 16,
        atsWeight: 9,
        level: 'advanced' as ExperienceLevel,
        trending: true,
        description: 'Tableau, Power BI, advanced marketing performance analysis'
      },
      {
        name: 'Customer Relationship Management (CRM)',
        category: 'technical' as SkillCategory,
        demandLevel: 'high' as DemandLevel,
        salaryImpact: 'medium' as SalaryImpactLevel,
        salaryImpactPercent: 9,
        atsWeight: 7,
        level: 'intermediate' as ExperienceLevel,
        trending: false,
        description: 'Salesforce, HubSpot CRM management and optimization'
      },
      {
        name: 'Marketing Attribution & ROI Analysis',
        category: 'analytics' as SkillCategory,
        demandLevel: 'high' as DemandLevel,
        salaryImpact: 'very-high' as SalaryImpactLevel,
        salaryImpactPercent: 17,
        atsWeight: 8,
        level: 'advanced' as ExperienceLevel,
        trending: true,
        description: 'Multi-touch attribution modeling and campaign ROI measurement'
      },
      {
        name: 'Conversion Rate Optimization (CRO)',
        category: 'optimization' as SkillCategory,
        demandLevel: 'high' as DemandLevel,
        salaryImpact: 'medium' as SalaryImpactLevel,
        salaryImpactPercent: 13,
        atsWeight: 7,
        level: 'intermediate' as ExperienceLevel,
        trending: true,
        description: 'A/B testing, landing page optimization, user experience'
      },
      {
        name: 'Brand Management',
        category: 'strategic' as SkillCategory,
        demandLevel: 'medium' as DemandLevel,
        salaryImpact: 'medium' as SalaryImpactLevel,
        salaryImpactPercent: 12,
        atsWeight: 7,
        level: 'intermediate' as ExperienceLevel,
        trending: false,
        description: 'Brand strategy, positioning, and identity management'
      },
      {
        name: 'Influencer Marketing',
        category: 'social' as SkillCategory,
        demandLevel: 'medium' as DemandLevel,
        salaryImpact: 'low' as SalaryImpactLevel,
        salaryImpactPercent: 8,
        atsWeight: 6,
        level: 'intermediate' as ExperienceLevel,
        trending: true,
        description: 'Influencer partnerships, campaign management, and ROI tracking'
      },
      {
        name: 'Video Marketing',
        category: 'content' as SkillCategory,
        demandLevel: 'high' as DemandLevel,
        salaryImpact: 'medium' as SalaryImpactLevel,
        salaryImpactPercent: 9,
        atsWeight: 6,
        level: 'intermediate' as ExperienceLevel,
        trending: true,
        description: 'Video content strategy, production, and performance optimization'
      }
    ] as EnhancedSkill[],

    // Essential soft skills
    soft: [
      {
        name: 'Strategic Thinking',
        category: 'leadership' as SoftSkillCategory,
        demandLevel: 'very-high' as DemandLevel,
        salaryImpact: 'critical' as SalaryImpactLevel,
        salaryImpactPercent: 20,
        atsWeight: 8,
        level: 'advanced' as ExperienceLevel,
        description: 'Long-term planning and strategic decision-making abilities'
      },
      {
        name: 'Data-Driven Decision Making',
        category: 'analytical' as SoftSkillCategory,
        demandLevel: 'very-high' as DemandLevel,
        salaryImpact: 'high' as SalaryImpactLevel,
        salaryImpactPercent: 15,
        atsWeight: 9,
        level: 'intermediate' as ExperienceLevel,
        description: 'Using analytics and metrics to guide marketing strategies'
      },
      {
        name: 'Creative Problem Solving',
        category: 'creative' as SoftSkillCategory,
        demandLevel: 'high' as DemandLevel,
        salaryImpact: 'medium' as SalaryImpactLevel,
        salaryImpactPercent: 12,
        atsWeight: 7,
        level: 'intermediate' as ExperienceLevel,
        description: 'Innovative approaches to marketing challenges and campaigns'
      },
      {
        name: 'Cross-Functional Collaboration',
        category: 'teamwork' as SoftSkillCategory,
        demandLevel: 'high' as DemandLevel,
        salaryImpact: 'medium' as SalaryImpactLevel,
        salaryImpactPercent: 10,
        atsWeight: 7,
        level: 'intermediate' as ExperienceLevel,
        description: 'Working effectively with sales, product, and other departments'
      },
      {
        name: 'Budget Management',
        category: 'financial' as SoftSkillCategory,
        demandLevel: 'high' as DemandLevel,
        salaryImpact: 'high' as SalaryImpactLevel,
        salaryImpactPercent: 14,
        atsWeight: 8,
        level: 'intermediate' as ExperienceLevel,
        description: 'Marketing budget planning, allocation, and ROI optimization'
      },
      {
        name: 'Project Management',
        category: 'organizational' as SoftSkillCategory,
        demandLevel: 'high' as DemandLevel,
        salaryImpact: 'medium' as SalaryImpactLevel,
        salaryImpactPercent: 11,
        atsWeight: 7,
        level: 'intermediate' as ExperienceLevel,
        description: 'Managing complex marketing campaigns and timelines'
      },
      {
        name: 'Communication & Presentation',
        category: 'communication' as SoftSkillCategory,
        demandLevel: 'very-high' as DemandLevel,
        salaryImpact: 'medium' as SalaryImpactLevel,
        salaryImpactPercent: 13,
        atsWeight: 8,
        level: 'intermediate' as ExperienceLevel,
        description: 'Stakeholder presentations and clear marketing communication'
      },
      {
        name: 'Customer-Centric Mindset',
        category: 'strategic' as SoftSkillCategory,
        demandLevel: 'high' as DemandLevel,
        salaryImpact: 'medium' as SalaryImpactLevel,
        salaryImpactPercent: 12,
        atsWeight: 7,
        level: 'intermediate' as ExperienceLevel,
        description: 'Understanding customer needs and behavior patterns'
      }
    ] as EnhancedSkill[],

    // Marketing tools and platforms
    tools: [
      {
        name: 'HubSpot',
        category: 'marketing-automation' as ToolCategory,
        demandLevel: 'very-high' as DemandLevel,
        salaryImpact: 'medium' as SalaryImpactLevel,
        salaryImpactPercent: 12,
        atsWeight: 9,
        level: 'intermediate' as ExperienceLevel,
        marketShare: 'high' as MarketShare,
        description: 'All-in-one marketing, sales, and service platform'
      },
      {
        name: 'Salesforce Marketing Cloud',
        category: 'enterprise-automation' as ToolCategory,
        demandLevel: 'high' as DemandLevel,
        salaryImpact: 'very-high' as SalaryImpactLevel,
        salaryImpactPercent: 18,
        atsWeight: 8,
        level: 'advanced' as ExperienceLevel,
        marketShare: 'medium' as MarketShare,
        description: 'Enterprise-level marketing automation and customer journey mapping'
      },
      {
        name: 'Google Ads',
        category: 'advertising' as ToolCategory,
        demandLevel: 'very-high' as DemandLevel,
        salaryImpact: 'medium' as SalaryImpactLevel,
        salaryImpactPercent: 11,
        atsWeight: 9,
        level: 'intermediate' as ExperienceLevel,
        marketShare: 'very-high' as MarketShare,
        description: 'Google search, display, and video advertising platform'
      },
      {
        name: 'Facebook Ads Manager',
        category: 'social-advertising' as ToolCategory,
        demandLevel: 'high' as DemandLevel,
        salaryImpact: 'medium' as SalaryImpactLevel,
        salaryImpactPercent: 9,
        atsWeight: 8,
        level: 'intermediate' as ExperienceLevel,
        marketShare: 'high' as MarketShare,
        description: 'Meta (Facebook/Instagram) advertising platform'
      },
      {
        name: 'Tableau',
        category: 'analytics' as ToolCategory,
        demandLevel: 'high' as DemandLevel,
        salaryImpact: 'high' as SalaryImpactLevel,
        salaryImpactPercent: 16,
        atsWeight: 7,
        level: 'advanced' as ExperienceLevel,
        marketShare: 'medium' as MarketShare,
        description: 'Advanced data visualization and business intelligence'
      },
      {
        name: 'Adobe Creative Suite',
        category: 'design' as ToolCategory,
        demandLevel: 'medium' as DemandLevel,
        salaryImpact: 'low' as SalaryImpactLevel,
        salaryImpactPercent: 8,
        atsWeight: 6,
        level: 'intermediate' as ExperienceLevel,
        marketShare: 'high' as MarketShare,
        description: 'Photoshop, Illustrator, InDesign for marketing materials'
      },
      {
        name: 'Mailchimp',
        category: 'email-marketing' as ToolCategory,
        demandLevel: 'medium' as DemandLevel,
        salaryImpact: 'low' as SalaryImpactLevel,
        salaryImpactPercent: 6,
        atsWeight: 6,
        level: 'beginner' as ExperienceLevel,
        marketShare: 'high' as MarketShare,
        description: 'Email marketing automation and audience management'
      },
      {
        name: 'SEMrush',
        category: 'seo-tools' as ToolCategory,
        demandLevel: 'medium' as DemandLevel,
        salaryImpact: 'low' as SalaryImpactLevel,
        salaryImpactPercent: 8,
        atsWeight: 6,
        level: 'intermediate' as ExperienceLevel,
        marketShare: 'medium' as MarketShare,
        description: 'SEO, PPC, and competitive analysis platform'
      },
      {
        name: 'Hootsuite',
        category: 'social-media' as ToolCategory,
        demandLevel: 'medium' as DemandLevel,
        salaryImpact: 'low' as SalaryImpactLevel,
        salaryImpactPercent: 5,
        atsWeight: 5,
        level: 'beginner' as ExperienceLevel,
        marketShare: 'medium' as MarketShare,
        description: 'Social media management and scheduling platform'
      },
      {
        name: 'Marketo',
        category: 'marketing-automation' as ToolCategory,
        demandLevel: 'medium' as DemandLevel,
        salaryImpact: 'high' as SalaryImpactLevel,
        salaryImpactPercent: 15,
        atsWeight: 7,
        level: 'advanced' as ExperienceLevel,
        marketShare: 'medium' as MarketShare,
        description: 'Adobe marketing automation for B2B lead nurturing'
      }
    ] as EnhancedTool[]
  },

  // Industry certifications with value metrics
  certifications: {
    // High-value digital marketing certifications
    digital: [
      {
        name: 'Google Ads Certified',
        issuer: 'Google',
        difficulty: 'intermediate' as ExperienceLevel,
        timeToComplete: '2-4 weeks',
        salaryImpact: 'low' as SalaryImpactLevel,
        salaryImpactPercent: 8,
        demandLevel: 'very-high' as DemandLevel,
        cost: 'free',
        validityPeriod: '1 year',
        description: 'Demonstrates proficiency in Google Ads campaign management'
      },
      {
        name: 'Google Analytics Individual Qualification (IQ)',
        issuer: 'Google',
        difficulty: 'beginner' as ExperienceLevel,
        timeToComplete: '1-2 weeks',
        salaryImpact: 'low' as SalaryImpactLevel,
        salaryImpactPercent: 6,
        demandLevel: 'very-high' as DemandLevel,
        cost: 'free',
        validityPeriod: '1 year',
        description: 'Analytics platform proficiency and data analysis skills'
      },
      {
        name: 'Facebook Blueprint Certification',
        issuer: 'Meta',
        difficulty: 'intermediate' as ExperienceLevel,
        timeToComplete: '3-6 weeks',
        salaryImpact: 'low' as SalaryImpactLevel,
        salaryImpactPercent: 7,
        demandLevel: 'high' as DemandLevel,
        cost: 'free',
        validityPeriod: '1 year',
        description: 'Facebook and Instagram advertising expertise'
      },
      {
        name: 'HubSpot Content Marketing Certification',
        issuer: 'HubSpot',
        difficulty: 'beginner' as ExperienceLevel,
        timeToComplete: '1-2 weeks',
        salaryImpact: 'low' as SalaryImpactLevel,
        salaryImpactPercent: 5,
        demandLevel: 'high' as DemandLevel,
        cost: 'free',
        validityPeriod: '2 years',
        description: 'Content strategy, creation, and optimization'
      },
      {
        name: 'HubSpot Inbound Marketing Certification',
        issuer: 'HubSpot',
        difficulty: 'intermediate' as ExperienceLevel,
        timeToComplete: '2-3 weeks',
        salaryImpact: 'low' as SalaryImpactLevel,
        salaryImpactPercent: 8,
        demandLevel: 'high' as DemandLevel,
        cost: 'free',
        validityPeriod: '2 years',
        description: 'Inbound methodology and lead generation strategies'
      }
    ] as MarketingCertification[],

    // Professional and industry certifications
    professional: [
      {
        name: 'Digital Marketing Institute (DMI) Certification',
        issuer: 'Digital Marketing Institute',
        difficulty: 'advanced' as ExperienceLevel,
        timeToComplete: '3-6 months',
        salaryImpact: 'high' as SalaryImpactLevel,
        salaryImpactPercent: 15,
        demandLevel: 'medium' as DemandLevel,
        cost: '$1,500-3,000',
        validityPeriod: '3 years',
        description: 'Comprehensive digital marketing strategy and execution'
      },
      {
        name: 'American Marketing Association (AMA) PCM',
        issuer: 'American Marketing Association',
        difficulty: 'advanced' as ExperienceLevel,
        timeToComplete: '6-12 months',
        salaryImpact: 'very-high' as SalaryImpactLevel,
        salaryImpactPercent: 18,
        demandLevel: 'medium' as DemandLevel,
        cost: '$2,000-4,000',
        validityPeriod: '3 years',
        description: 'Professional Certified Marketer credential'
      },
      {
        name: 'Content Marketing Institute Certification',
        issuer: 'Content Marketing Institute',
        difficulty: 'intermediate' as ExperienceLevel,
        timeToComplete: '2-4 months',
        salaryImpact: 'medium' as SalaryImpactLevel,
        salaryImpactPercent: 10,
        demandLevel: 'medium' as DemandLevel,
        cost: '$500-1,500',
        validityPeriod: '2 years',
        description: 'Content strategy and storytelling expertise'
      },
      {
        name: 'Salesforce Marketing Cloud Certification',
        issuer: 'Salesforce',
        difficulty: 'advanced' as ExperienceLevel,
        timeToComplete: '3-6 months',
        salaryImpact: 'critical' as SalaryImpactLevel,
        salaryImpactPercent: 20,
        demandLevel: 'high' as DemandLevel,
        cost: '$200 per exam',
        validityPeriod: '1 year',
        description: 'Enterprise marketing automation platform expertise'
      }
    ] as MarketingCertification[],

    // Specialized and emerging certifications
    specialized: [
      {
        name: 'Adobe Certified Expert (ACE)',
        issuer: 'Adobe',
        difficulty: 'advanced' as ExperienceLevel,
        timeToComplete: '4-8 months',
        salaryImpact: 'medium' as SalaryImpactLevel,
        salaryImpactPercent: 12,
        demandLevel: 'medium' as DemandLevel,
        cost: '$150 per exam',
        validityPeriod: '2 years',
        description: 'Advanced proficiency in Adobe marketing tools'
      },
      {
        name: 'Amazon Advertising Certified',
        issuer: 'Amazon',
        difficulty: 'intermediate' as ExperienceLevel,
        timeToComplete: '2-4 weeks',
        salaryImpact: 'medium' as SalaryImpactLevel,
        salaryImpactPercent: 9,
        demandLevel: 'high' as DemandLevel,
        cost: 'free',
        validityPeriod: '1 year',
        description: 'Amazon advertising platform and e-commerce marketing'
      },
      {
        name: 'LinkedIn Marketing Solutions Certification',
        issuer: 'LinkedIn',
        difficulty: 'beginner' as ExperienceLevel,
        timeToComplete: '1-2 weeks',
        salaryImpact: 'low' as SalaryImpactLevel,
        salaryImpactPercent: 6,
        demandLevel: 'medium' as DemandLevel,
        cost: 'free',
        validityPeriod: '1 year',
        description: 'LinkedIn advertising and B2B marketing strategies'
      },
      {
        name: 'Shopify Partner Certification',
        issuer: 'Shopify',
        difficulty: 'intermediate' as ExperienceLevel,
        timeToComplete: '2-3 weeks',
        salaryImpact: 'low' as SalaryImpactLevel,
        salaryImpactPercent: 8,
        demandLevel: 'medium' as DemandLevel,
        cost: 'free',
        validityPeriod: '1 year',
        description: 'E-commerce marketing and Shopify platform expertise'
      }
    ] as MarketingCertification[]
  },

  // Experience phrases for different levels
  experiencePhrases: {
    achievements: {
      entry: [
        'Increased social media engagement by 45% through strategic content planning and community management',
        'Supported email marketing campaigns that generated $50K in additional revenue',
        'Improved website traffic by 30% through SEO optimization and content marketing initiatives',
        'Managed social media accounts across 4 platforms, growing follower base by 60% in 6 months',
        'Assisted in campaign development that resulted in 25% increase in lead generation',
        'Created and executed content calendar that improved brand awareness by 35%'
      ],
      mid: [
        'Led digital marketing campaigns that generated $500K in revenue and 150% ROI',
        'Increased conversion rates by 40% through A/B testing and landing page optimization',
        'Managed marketing budget of $200K, consistently delivering campaigns under budget with 120% ROI',
        'Developed marketing automation workflows that improved lead nurturing efficiency by 65%',
        'Launched product marketing campaign that exceeded sales targets by 180%',
        'Built and managed cross-functional team of 5 marketing specialists',
        'Implemented marketing analytics dashboard that improved campaign performance by 35%',
        'Increased qualified leads by 85% through integrated digital marketing strategy'
      ],
      senior: [
        'Developed comprehensive marketing strategy that increased company revenue by $2M annually',
        'Led marketing team of 12 professionals across multiple channels and campaigns',
        'Implemented marketing technology stack that improved campaign efficiency by 70%',
        'Launched global brand campaign that increased market share by 15% in target demographics',
        'Managed $1M+ marketing budget while maintaining 200%+ ROI across all channels',
        'Established marketing attribution model that improved budget allocation efficiency by 50%',
        'Led company rebrand initiative that resulted in 40% increase in brand recognition',
        'Developed strategic partnerships that generated $3M in additional revenue streams'
      ]
    },

    responsibilities: {
      entry: [
        'Executed social media content strategy across multiple platforms',
        'Assisted in email marketing campaign creation and performance tracking',
        'Conducted market research and competitive analysis to inform campaign strategies',
        'Supported lead generation initiatives through various digital channels',
        'Created marketing materials including graphics, copy, and presentations',
        'Tracked and reported on campaign performance metrics and KPIs'
      ],
      mid: [
        'Developed and executed integrated digital marketing campaigns across multiple channels',
        'Managed relationships with external vendors, agencies, and technology partners',
        'Led cross-functional collaboration with sales, product, and customer success teams',
        'Analyzed marketing performance data to optimize campaigns and improve ROI',
        'Oversaw content creation and brand messaging across all marketing materials',
        'Implemented and managed marketing automation platforms and workflows'
      ],
      senior: [
        'Established marketing strategy and annual planning in alignment with business objectives',
        'Led marketing team development, hiring, and performance management',
        'Presented marketing performance and strategy updates to executive leadership',
        'Developed marketing budget and resource allocation across channels and campaigns',
        'Built strategic partnerships and vendor relationships to expand marketing capabilities',
        'Implemented marketing technology stack and data analytics infrastructure'
      ]
    }
  },

  // ATS-optimized keywords for marketing manager roles
  atsKeywords: {
    primary: [
      'marketing strategy', 'digital marketing', 'campaign management', 'marketing analytics',
      'lead generation', 'brand management', 'marketing automation', 'CRM',
      'content marketing', 'social media marketing', 'email marketing', 'SEO', 'SEM',
      'paid advertising', 'Google Analytics', 'A/B testing', 'conversion optimization'
    ],
    secondary: [
      'cross-functional collaboration', 'budget management', 'project management',
      'data-driven', 'performance metrics', 'customer acquisition', 'market research',
      'competitive analysis', 'stakeholder management', 'vendor management',
      'marketing qualified leads', 'customer journey', 'attribution modeling'
    ],
    tools: [
      'HubSpot', 'Salesforce', 'Google Ads', 'Facebook Ads', 'Mailchimp', 'Marketo',
      'Tableau', 'Google Analytics', 'SEMrush', 'Hootsuite', 'Adobe Creative Suite',
      'WordPress', 'Slack', 'Asana', 'Trello', 'Canva', 'Buffer'
    ],
    metrics: [
      'ROI', 'ROAS', 'CAC', 'LTV', 'CTR', 'conversion rate', 'engagement rate',
      'cost per lead', 'revenue growth', 'market share', 'brand awareness',
      'customer retention', 'pipeline velocity', 'attribution'
    ]
  },

  // Salary insights by location and experience
  salaryInsights: {
    byLocation: {
      'San Francisco, CA': { entry: 55_000, mid: 95_000, senior: 150_000 } as LocationSalary,
      'New York, NY': { entry: 52_000, mid: 88_000, senior: 140_000 } as LocationSalary,
      'Seattle, WA': { entry: 48_000, mid: 82_000, senior: 130_000 } as LocationSalary,
      'Austin, TX': { entry: 45_000, mid: 75_000, senior: 115_000 } as LocationSalary,
      'Chicago, IL': { entry: 43_000, mid: 72_000, senior: 110_000 } as LocationSalary,
      'Denver, CO': { entry: 42_000, mid: 70_000, senior: 108_000 } as LocationSalary,
      'Atlanta, GA': { entry: 40_000, mid: 68_000, senior: 105_000 } as LocationSalary,
      'Remote': { entry: 41_000, mid: 71_000, senior: 112_000 } as LocationSalary
    } as Record<string, LocationSalary>,
    topPayingSkills: [
      { skill: 'Marketing Analytics & Data Science', salaryPremium: 25 },
      { skill: 'Marketing Technology (MarTech) Stack', salaryPremium: 22 },
      { skill: 'Enterprise Marketing Automation', salaryPremium: 20 },
      { skill: 'Performance Marketing & Attribution', salaryPremium: 18 },
      { skill: 'Growth Marketing & Experimentation', salaryPremium: 16 }
    ] as TopPayingSkill[]
  },

  // Industry trends and emerging skills
  trends: {
    emerging: [
      'AI-Powered Marketing Automation',
      'Customer Data Platforms (CDP)',
      'Privacy-First Marketing (iOS 14.5+)',
      'Voice Search Optimization',
      'Interactive Content Marketing',
      'Marketing Mix Modeling (MMM)',
      'Conversational Marketing & Chatbots',
      'Influencer Marketing Platforms'
    ],
    declining: [
      'Traditional Display Advertising',
      'Basic Email Marketing',
      'Generic Social Media Posting',
      'Interruptive Marketing Tactics'
    ],
    stable: [
      'Content Marketing',
      'SEO/SEM',
      'Email Marketing Automation',
      'Social Media Strategy',
      'Brand Management',
      'Marketing Analytics'
    ]
  }
};

// Utility functions for working with the marketing manager data
export const marketingUtils = {
  // Get salary data for a specific location (use bracket notation due to spaces/commas in keys)
  getSalaryForLocation: (location: string): LocationSalary | null => {
    return marketingManagerIndustry.salaryInsights.byLocation[location] || null;
  },

  // Get skills by salary impact level
  getSkillsBySalaryImpact: (impactLevel: SalaryImpactLevel): EnhancedSkill[] => {
    return [
      ...marketingManagerIndustry.skills.technical,
      ...marketingManagerIndustry.skills.soft
    ].filter(skill => skill.salaryImpact === impactLevel);
  },

  // Get high-demand skills (very-high or critical demand)
  getHighDemandSkills: (): EnhancedSkill[] => {
    return [
      ...marketingManagerIndustry.skills.technical,
      ...marketingManagerIndustry.skills.soft
    ].filter(skill => skill.demandLevel === 'very-high' || skill.demandLevel === 'critical');
  },

  // Get trending skills
  getTrendingSkills: (): EnhancedSkill[] => {
    return marketingManagerIndustry.skills.technical.filter(skill => skill.trending);
  },

  // Get free certifications
  getFreeCertifications: (): MarketingCertification[] => {
    return [
      ...marketingManagerIndustry.certifications.digital,
      ...marketingManagerIndustry.certifications.specialized
    ].filter(cert => cert.cost === 'free');
  },

  // Calculate potential salary increase based on skills
  calculateSkillsSalaryBoost: (userSkills: string[]): number => {
    const uniqueSkills = new Set(userSkills); // Prevent counting duplicates
    const matchingSkills = [
      ...marketingManagerIndustry.skills.technical,
      ...marketingManagerIndustry.skills.soft
    ].filter(skill => uniqueSkills.has(skill.name));
    
    return matchingSkills.reduce((total, skill) => {
      return total + (skill.salaryImpactPercent || getSalaryImpactPercent(skill.salaryImpact));
    }, 0);
  },

  // Get ATS keywords by category
  getATSKeywords: (category: 'primary' | 'secondary' | 'tools' | 'metrics'): string[] => {
    return marketingManagerIndustry.atsKeywords[category];
  },

  // Get all available locations for salary data
  getAvailableLocations: (): string[] => {
    return Object.keys(marketingManagerIndustry.salaryInsights.byLocation);
  }
};

export default marketingManagerIndustry;