// Industry-specific certifications database
export const certificationsByIndustry = {
  'Software Engineer': {
    technical: [
      'AWS Certified Solutions Architect',
      'AWS Certified Developer',
      'Microsoft Azure Fundamentals',
      'Google Cloud Professional',
      'Certified Kubernetes Administrator',
      'Docker Certified Associate',
      'MongoDB Certified Developer',
      'Oracle Certified Professional',
      'Salesforce Certified Administrator',
      'Cisco Certified Network Associate'
    ],
    professional: [
      'Certified ScrumMaster (CSM)',
      'Project Management Professional (PMP)',
      'Certified Agile Practitioner',
      'ITIL Foundation',
      'Certified Ethical Hacker (CEH)',
      'CompTIA Security+',
      'Six Sigma Green Belt'
    ],
    platforms: [
      'HubSpot Certified',
      'Google Analytics Certified',
      'Shopify Partner Certified',
      'Stripe Certified',
      'Tableau Desktop Certified'
    ]
  },
  'Electrician': {
    technical: [
      'Journeyman Electrician License',
      'Master Electrician License',
      'Electrical Contractor License',
      'Low Voltage Technician',
      'Fire Alarm Certification',
      'Solar Installation Certification',
      'Industrial Maintenance Certification',
      'Motor Control Certification'
    ],
    safety: [
      'OSHA 10-Hour Construction',
      'OSHA 30-Hour Construction',
      'NFPA 70E Arc Flash Training',
      'First Aid/CPR Certification',
      'Confined Space Entry',
      'Lockout/Tagout (LOTO)',
      'Aerial Lift Certification'
    ],
    specialized: [
      'Fiber Optic Installation',
      'Security System Installation',
      'Home Automation Systems',
      'Electric Vehicle Charging',
      'Renewable Energy Systems'
    ]
  },
  'Marketing Manager': {
    digital: [
      'Google Ads Certified',
      'Google Analytics Certified',
      'Facebook Blueprint Certified',
      'HubSpot Content Marketing',
      'Hootsuite Social Media',
      'Semrush SEO Toolkit',
      'Mailchimp Email Marketing',
      'Salesforce Marketing Cloud'
    ],
    professional: [
      'Digital Marketing Institute (DMI)',
      'American Marketing Association (AMA)',
      'Content Marketing Institute',
      'Project Management Professional (PMP)',
      'Certified ScrumMaster (CSM)'
    ],
    specialized: [
      'Adobe Certified Expert',
      'Shopify Partner Certified',
      'Amazon Advertising Certified',
      'LinkedIn Marketing Solutions'
    ]
  },
  'Nurse': {
    clinical: [
      'Basic Life Support (BLS)',
      'Advanced Cardiac Life Support (ACLS)',
      'Pediatric Advanced Life Support (PALS)',
      'Critical Care Registered Nurse (CCRN)',
      'Certified Emergency Nurse (CEN)',
      'Oncology Certified Nurse (OCN)',
      'Wound Ostomy Continence Nurse',
      'IV Therapy Certification'
    ],
    specialized: [
      'Certified Operating Room Nurse',
      'Neonatal Intensive Care',
      'Psychiatric Mental Health Nurse',
      'Infection Control Certification',
      'Case Management Certification',
      'Diabetes Education Certification'
    ],
    administrative: [
      'Certified Nurse Manager (CNM)',
      'Healthcare Quality Certification',
      'Joint Commission Standards',
      'HIPAA Compliance Training'
    ]
  },
  'Project Manager': {
    methodology: [
      'Project Management Professional (PMP)',
      'Certified ScrumMaster (CSM)',
      'Certified Scrum Product Owner',
      'SAFe Agilist Certification',
      'Prince2 Foundation',
      'Certified Associate in Project Management',
      'Lean Six Sigma Green Belt',
      'Lean Six Sigma Black Belt'
    ],
    technical: [
      'Microsoft Project Certified',
      'Jira Administrator',
      'Confluence Administrator',
      'Smartsheet Certified',
      'Asana Certified Pro'
    ],
    industry: [
      'Construction Project Management',
      'IT Project Management',
      'Healthcare Project Management',
      'Change Management Certification'
    ]
  },
  'Sales Representative': {
    methodology: [
      'Challenger Sale Certified',
      'SPIN Selling Certified',
      'Sandler Sales Training',
      'Miller Heiman Strategic Selling',
      'Solution Selling Certified',
      'Consultative Selling Program'
    ],
    platforms: [
      'Salesforce Certified Administrator',
      'HubSpot Sales Certified',
      'LinkedIn Sales Navigator',
      'Outreach Certified',
      'Gong Revenue Intelligence'
    ],
    industry: [
      'Pharmaceutical Sales Certification',
      'Real Estate License',
      'Insurance License',
      'Financial Services License'
    ]
  }
};

// Certification validation patterns
export const certificationValidation = {
  hasExpirationDate: [
    'OSHA', 'CPR', 'First Aid', 'BLS', 'ACLS', 'PALS', 'CEN', 'CCRN',
    'AWS', 'Microsoft', 'Google', 'Cisco', 'CompTIA', 'Oracle'
  ],
  requiresRenewal: [
    'PMP', 'CSM', 'Six Sigma', 'ITIL', 'Prince2', 'Salesforce'
  ],
  hasCredentialID: [
    'AWS', 'Microsoft Azure', 'Google Cloud', 'Salesforce', 'Cisco',
    'Oracle', 'Adobe', 'VMware'
  ]
};

// ATS keywords for certifications
export const certificationKeywords = {
  'Software Engineer': ['certified', 'aws', 'azure', 'cloud', 'kubernetes', 'docker', 'scrum', 'agile'],
  'Electrician': ['licensed', 'journeyman', 'master', 'osha', 'nfpa', 'electrical', 'safety'],
  'Marketing Manager': ['google ads', 'analytics', 'facebook', 'hubspot', 'digital marketing', 'certified'],
  'Nurse': ['bls', 'acls', 'pals', 'registered nurse', 'certified', 'healthcare', 'clinical'],
  'Project Manager': ['pmp', 'scrum', 'agile', 'six sigma', 'certified', 'project management'],
  'Sales Representative': ['sales', 'certified', 'crm', 'salesforce', 'revenue', 'quota']
};

export default {
  certificationsByIndustry,
  certificationValidation,
  certificationKeywords
};