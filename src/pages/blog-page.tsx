import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Clock, ArrowRight, BookOpen, Target, TrendingUp, 
  Filter, Eye, ThumbsUp, FileText, Briefcase, 
  Award, Users, Share2, Bookmark, ChevronRight
} from 'lucide-react';

// Blog article data structure
interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    title: string;
  };
  publishDate: string;
  readTime: number;
  category: string;
  tags: string[];
  featured: boolean;
  views: number;
  likes: number;
  seoKeywords: string[];
  metaDescription: string;
}

// Navigation props interface
interface BlogPageProps {
  onNavigateToBuilder?: () => void;
  onNavigateToTemplates?: () => void;
  onNavigateToExamples?: () => void;
}

// Sample blog articles with high-SEO value content
const blogArticles: BlogArticle[] = [
  {
    id: '1',
    title: 'How to Write a Resume That Gets You Hired in 2025',
    slug: 'how-to-write-a-resume-2025',
    excerpt: 'Master the art of resume writing with our comprehensive guide. Learn what hiring managers want to see and avoid common mistakes that cost you interviews.',
    content: `# How to Write a Resume That Gets You Hired in 2025

Writing a resume that stands out in today's competitive job market requires strategy, precision, and understanding of what employers actually want to see. This comprehensive guide will walk you through every step of creating a resume that gets results.

## The Modern Resume: What's Changed

The job market has evolved significantly, and so have resume expectations. Here's what matters most in 2025:

### 1. ATS Optimization is Non-Negotiable
- 98% of Fortune 500 companies use Applicant Tracking Systems
- Your resume must be ATS-friendly to even reach human eyes
- Use standard formatting, clear headings, and relevant keywords

### 2. Quantified Achievements Trump Job Duties
Instead of: &quot;Responsible for managing social media accounts&quot;
Write: &quot;Increased social media engagement by 150% and generated 200+ qualified leads monthly&quot;

### 3. Skills-First Approach
Modern resumes lead with skills and achievements, not just chronological work history.

## Step-by-Step Resume Writing Process

### Step 1: Choose the Right Format
- **Reverse Chronological**: Best for traditional career progression
- **Functional**: Good for career changers or employment gaps
- **Combination**: Ideal for experienced professionals with diverse skills

### Step 2: Craft a Compelling Professional Summary
Your summary should answer: &quot;Why should we hire you?&quot; in 3-4 sentences.

**Formula**: [Years of experience] + [Key skills] + [Notable achievement] + [Career goal]

**Example**: &quot;Results-driven marketing manager with 5+ years driving digital growth. Expertise in SEO, content marketing, and data analytics. Increased organic traffic by 300% and revenue by $2M annually. Seeking to leverage proven track record in a senior marketing role.&quot;

## Ready to Build Your Resume?

Now that you know what makes a winning resume, it's time to put these tips into practice. Use our free resume builder to create a professional, ATS-optimized resume that gets results.

**[Build My Resume Now →](#build-resume)**

---

*Last updated: ${new Date().toLocaleDateString()}*`,
    author: {
      name: 'Sarah Chen',
      avatar: '/avatars/sarah-chen.jpg',
      title: 'Senior Career Coach'
    },
    publishDate: '2024-12-20',
    readTime: 12,
    category: 'Resume Writing',
    tags: ['Resume Tips', 'Job Search', 'Career Advice', 'ATS Optimization'],
    featured: true,
    views: 45230,
    likes: 892,
    seoKeywords: ['how to write a resume', 'resume writing tips', 'resume guide 2025'],
    metaDescription: 'Learn how to write a resume that gets you hired in 2025. Complete guide with examples, templates, and ATS optimization tips from career experts.'
  },
  {
    id: '2',
    title: '15 ATS-Friendly Resume Tips That Actually Work',
    slug: 'ats-friendly-resume-tips',
    excerpt: 'Beat the bots and get your resume seen by human recruiters. Our proven ATS optimization strategies have helped thousands land interviews.',
    content: '# 15 ATS-Friendly Resume Tips That Actually Work\n\nComprehensive ATS optimization guide with actionable tips...',
    author: {
      name: 'Marcus Johnson',
      avatar: '/avatars/marcus-johnson.jpg',
      title: 'HR Technology Expert'
    },
    publishDate: '2024-12-18',
    readTime: 8,
    category: 'ATS Optimization',
    tags: ['ATS', 'Resume Scanning', 'Applicant Tracking'],
    featured: true,
    views: 32100,
    likes: 567,
    seoKeywords: ['ATS resume tips', 'ATS optimization', 'applicant tracking system'],
    metaDescription: '15 proven ATS-friendly resume tips that help your resume pass automated screening and reach human recruiters. Expert strategies that work.'
  },
  {
    id: '3',
    title: 'Resume Format Guide: Which Style Gets You Hired?',
    slug: 'resume-format-guide',
    excerpt: 'Chronological, functional, or combination? Choose the right resume format for your career situation and industry.',
    content: '# Resume Format Guide: Which Style Gets You Hired?\n\nComplete format comparison guide...',
    author: {
      name: 'Jennifer Park',
      avatar: '/avatars/jennifer-park.jpg',
      title: 'Professional Resume Writer'
    },
    publishDate: '2024-12-15',
    readTime: 10,
    category: 'Resume Writing',
    tags: ['Resume Format', 'Layout', 'Design'],
    featured: false,
    views: 28900,
    likes: 434,
    seoKeywords: ['resume format', 'resume layout', 'resume design'],
    metaDescription: 'Complete guide to resume formats. Learn which resume style works best for your career level and industry. Examples included.'
  },
  {
    id: '4',
    title: 'Cover Letter Tips: 10 Ways to Stand Out',
    slug: 'cover-letter-tips',
    excerpt: 'Transform your cover letter from generic to compelling. Learn what hiring managers want to read and how to make your application memorable.',
    content: '# Cover Letter Tips: 10 Ways to Stand Out\n\nCover letter optimization guide...',
    author: {
      name: 'David Miller',
      avatar: '/avatars/david-miller.jpg',
      title: 'Career Strategist'
    },
    publishDate: '2024-12-12',
    readTime: 7,
    category: 'Cover Letters',
    tags: ['Cover Letter', 'Job Applications', 'Writing'],
    featured: false,
    views: 24500,
    likes: 389,
    seoKeywords: ['cover letter tips', 'cover letter examples', 'how to write cover letter'],
    metaDescription: '10 proven cover letter tips that make hiring managers want to interview you. Examples and templates included.'
  },
  {
    id: '5',
    title: 'Job Interview Preparation: The Complete Checklist',
    slug: 'job-interview-preparation',
    excerpt: 'Ace your next interview with our comprehensive preparation guide. From research to follow-up, we cover everything you need to know.',
    content: '# Job Interview Preparation: The Complete Checklist\n\nInterview preparation guide...',
    author: {
      name: 'Lisa Thompson',
      avatar: '/avatars/lisa-thompson.jpg',
      title: 'Interview Coach'
    },
    publishDate: '2024-12-10',
    readTime: 15,
    category: 'Interview Tips',
    tags: ['Interview', 'Job Search', 'Preparation'],
    featured: false,
    views: 19800,
    likes: 312,
    seoKeywords: ['job interview tips', 'interview preparation', 'interview questions'],
    metaDescription: 'Complete job interview preparation checklist. Expert tips on research, questions, and follow-up to help you land the job.'
  },
  {
    id: '6',
    title: 'Remote Work Resume: How to Showcase Virtual Experience',
    slug: 'remote-work-resume-tips',
    excerpt: 'Stand out in the remote job market. Learn how to highlight your virtual collaboration skills and remote work achievements.',
    content: '# Remote Work Resume: How to Showcase Virtual Experience\n\nRemote work resume guide...',
    author: {
      name: 'Alex Rivera',
      avatar: '/avatars/alex-rivera.jpg',
      title: 'Remote Work Specialist'
    },
    publishDate: '2024-12-08',
    readTime: 9,
    category: 'Remote Work',
    tags: ['Remote Work', 'Virtual Collaboration', 'Digital Skills'],
    featured: false,
    views: 16700,
    likes: 278,
    seoKeywords: ['remote work resume', 'virtual experience', 'remote skills'],
    metaDescription: 'How to create a remote work resume that gets you hired. Tips for showcasing virtual collaboration and remote achievements.'
  }
];

// Utility function to convert category name to URL-safe slug
const categoryToSlug = (category: string): string => 
  category.toLowerCase().replace(/\s+/g, '-');

export default function BlogPage({ 
  onNavigateToBuilder = () => {},
  onNavigateToTemplates = () => {},
  onNavigateToExamples = () => {}
}: BlogPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState<BlogArticle | null>(null);

  // Modal functions
  const openModal = (article: BlogArticle) => {
    setSelectedArticle(article);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedArticle(null);
    document.body.style.overflow = 'unset';
  };

  // Simple markdown parser function
  const parseMarkdown = (content: string): string => {
    return content
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-gray-900 mt-6 mb-3">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-gray-900 mt-8 mb-4">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-gray-900 mt-8 mb-6">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/^- (.*$)/gim, '<li class="mb-1">$1</li>')
      .replace(/^✅ (.*$)/gim, '<div class="flex items-start mb-2"><span class="text-green-500 mr-2">✅</span><span>$1</span></div>')
      .replace(/^❌ (.*$)/gim, '<div class="flex items-start mb-2"><span class="text-red-500 mr-2">❌</span><span>$1</span></div>')
      .replace(/\[([^\]]+)\]\((#[^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-700 underline">$1</a>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/^(?!<[h|l|d])/gm, '<p class="mb-4">')
      .replace(/\n/g, '<br>');
  };

  // Search handler
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Dynamically compute categories with correct counts
  const categories = useMemo(() => {
    const categoryMap = new Map<string, number>();
    
    // Count articles per category
    blogArticles.forEach(article => {
      const slug = categoryToSlug(article.category);
      categoryMap.set(slug, (categoryMap.get(slug) || 0) + 1);
    });

    // Create category objects with proper icons
    const iconMap: Record<string, any> = {
      'resume-writing': FileText,
      'ats-optimization': Target,
      'cover-letters': Award,
      'interview-tips': Users,
      'remote-work': Briefcase,
      'resume-formats': BookOpen
    };

    return [
      { id: 'all', name: 'All Articles', count: blogArticles.length, icon: BookOpen },
      ...Array.from(categoryMap.entries()).map(([slug, count]) => {
        // Convert slug back to display name
        const displayName = slug
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        
        return {
          id: slug,
          name: displayName,
          count,
          icon: iconMap[slug] || FileText
        };
      })
    ];
  }, []);

  // Filter articles based on search and category using useMemo for performance
  const filteredArticles = useMemo(() => {
    let filtered = blogArticles;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => 
        categoryToSlug(article.category) === selectedCategory
      );
    }

    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchLower) ||
        article.excerpt.toLowerCase().includes(searchLower) ||
        article.content.toLowerCase().includes(searchLower) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    return filtered;
  }, [searchTerm, selectedCategory]);

  // Get featured articles
  const featuredArticles = useMemo(() => 
    blogArticles.filter(article => article.featured), 
    []
  );

  // Featured topics for quick navigation - computed dynamically
  const featuredTopics = useMemo(() => [
    {
      title: 'Resume Writing Basics',
      description: 'Master the fundamentals of effective resume writing',
      articleCount: blogArticles.filter(a => a.category === 'Resume Writing').length,
      icon: FileText,
      color: 'bg-blue-50 text-blue-600'
    },
    {
      title: 'ATS Optimization',
      description: 'Get past applicant tracking systems',
      articleCount: blogArticles.filter(a => a.category === 'ATS Optimization').length,
      icon: Target,
      color: 'bg-green-50 text-green-600'
    },
    {
      title: 'Interview Preparation',
      description: 'Ace your next job interview',
      articleCount: blogArticles.filter(a => a.category === 'Interview Tips').length,
      icon: Users,
      color: 'bg-purple-50 text-purple-600'
    },
    {
      title: 'Career Transitions',
      description: 'Navigate career changes successfully',
      articleCount: blogArticles.filter(a => a.category === 'Remote Work').length,
      icon: TrendingUp,
      color: 'bg-orange-50 text-orange-600'
    }
  ], []);

  // Cleanup effect for body scroll
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO Meta Tags would go in document head */}
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Resume Tips & Career Advice
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Expert guidance to help you land your dream job. Get insider tips from hiring managers, 
              career coaches, and industry professionals.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search resume tips, career advice, interview guides..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 text-lg focus:ring-4 focus:ring-blue-200 border-0"
                />
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-200">50+</div>
                <div className="text-blue-100">Expert Articles</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-200">500K+</div>
                <div className="text-blue-100">Readers Helped</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-200">95%</div>
                <div className="text-blue-100">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-200">Free</div>
                <div className="text-blue-100">Forever</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Topics */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Topics</h2>
            <p className="text-xl text-gray-600">Find exactly what you're looking for</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredTopics.map((topic) => {
              const IconComponent = topic.icon;
              return (
                <button
                  key={topic.title}
                  onClick={() => {
                    // Set category filter based on topic
                    const categoryMap: Record<string, string> = {
                      'Resume Writing Basics': 'resume-writing',
                      'ATS Optimization': 'ats-optimization',
                      'Interview Preparation': 'interview-tips',
                      'Career Transitions': 'remote-work'
                    };
                    const categorySlug = categoryMap[topic.title];
                    if (categorySlug) {
                      setSelectedCategory(categorySlug);
                    }
                  }}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow text-left"
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${topic.color}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{topic.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{topic.description}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>{topic.articleCount} articles</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                
                {/* Categories Filter */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Filter className="w-4 h-4 mr-2" />
                    Categories
                  </h3>
                  <div className="space-y-2">
                    {categories.map(category => {
                      const IconComponent = category.icon;
                      return (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                            selectedCategory === category.id
                              ? 'bg-blue-50 text-blue-600 border border-blue-200'
                              : 'hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          <div className="flex items-center">
                            <IconComponent className="w-4 h-4 mr-2" />
                            <span className="text-sm font-medium">{category.name}</span>
                          </div>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            {category.count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Newsletter Signup */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Get Weekly Tips</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Join 50,000+ job seekers getting our best resume and career tips.
                  </p>
                  <div className="space-y-3">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                      Subscribe Free
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    No spam. Unsubscribe anytime.
                  </p>
                </div>

                {/* Quick Links */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button
                      onClick={onNavigateToBuilder}
                      className="flex items-center p-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors w-full"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">Build Resume</span>
                      <ArrowRight className="w-4 h-4 ml-auto" />
                    </button>
                    <button
                      onClick={onNavigateToTemplates}
                      className="flex items-center p-3 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors w-full"
                    >
                      <Award className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">Browse Templates</span>
                      <ArrowRight className="w-4 h-4 ml-auto" />
                    </button>
                    <button
                      onClick={onNavigateToExamples}
                      className="flex items-center p-3 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors w-full"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">View Examples</span>
                      <ArrowRight className="w-4 h-4 ml-auto" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Articles Grid */}
            <div className="lg:col-span-3">
              
              {/* Featured Articles */}
              {selectedCategory === 'all' && !searchTerm && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Articles</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {featuredArticles.slice(0, 2).map((article) => (
                      <article key={article.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="p-6">
                          <div className="flex items-center mb-4">
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                              {article.category}
                            </span>
                            <span className="mx-2 text-gray-300">•</span>
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="w-4 h-4 mr-1" />
                              {article.readTime} min read
                            </div>
                          </div>
                          
                          <h3 className="text-xl font-bold text-gray-900 mb-3" style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
                            {article.title}
                          </h3>
                          
                          <p className="text-gray-600 mb-4" style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
                            {article.excerpt}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <img 
                                src={article.author.avatar} 
                                alt={`${article.author.name} profile`}
                                className="w-8 h-8 bg-gray-200 rounded-full mr-3 object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                  const next = (e.target as HTMLImageElement).nextElementSibling;
                                  if (next) next.classList.remove('hidden');
                                }}
                              />
                              <div className="w-8 h-8 bg-gray-200 rounded-full mr-3 flex items-center justify-center text-gray-500 text-xs font-medium hidden">
                                {article.author.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{article.author.name}</p>
                                <p className="text-xs text-gray-500">{article.author.title}</p>
                              </div>
                            </div>
                            
                            <button 
                              onClick={() => openModal(article)}
                              className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
                            >
                              Read More
                              <ArrowRight className="w-4 h-4 ml-1" />
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}

              {/* Search Results / All Articles */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {searchTerm ? `Search Results for "${searchTerm}"` : 
                     selectedCategory === 'all' ? 'Latest Articles' : 
                     categories.find(c => c.id === selectedCategory)?.name || 'Articles'}
                  </h2>
                  <div className="text-sm text-gray-500">
                    {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''}
                  </div>
                </div>

                {filteredArticles.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
                    <p className="text-gray-600 mb-6">
                      Try adjusting your search or browse our featured topics above.
                    </p>
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory('all');
                      }}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Show All Articles
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6">
                    {filteredArticles.map((article) => (
                      <article key={article.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start space-x-4">
                          <div className="flex-1">
                            <div className="flex items-center mb-3">
                              <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                {article.category}
                              </span>
                              <span className="mx-2 text-gray-300">•</span>
                              <div className="flex items-center text-sm text-gray-500">
                                <Clock className="w-4 h-4 mr-1" />
                                {article.readTime} min read
                              </div>
                              <span className="mx-2 text-gray-300">•</span>
                              <div className="flex items-center text-sm text-gray-500">
                                <Eye className="w-4 h-4 mr-1" />
                                {article.views.toLocaleString()} views
                              </div>
                            </div>
                            
                            <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer"
                                onClick={() => openModal(article)}>
                              {article.title}
                            </h3>
                            
                            <p className="text-gray-600 mb-4">
                              {article.excerpt}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <img 
                                  src={article.author.avatar} 
                                  alt={`${article.author.name} profile`}
                                  className="w-10 h-10 bg-gray-200 rounded-full mr-3 object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                    const next = (e.target as HTMLImageElement).nextElementSibling;
                                    if (next) next.classList.remove('hidden');
                                  }}
                                />
                                <div className="w-10 h-10 bg-gray-200 rounded-full mr-3 flex items-center justify-center text-gray-500 text-sm font-medium hidden">
                                  {article.author.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{article.author.name}</p>
                                  <div className="flex items-center text-xs text-gray-500">
                                    <span>{article.author.title}</span>
                                    <span className="mx-1">•</span>
                                    <span>{new Date(article.publishDate).toLocaleDateString()}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center text-sm text-gray-500">
                                  <ThumbsUp className="w-4 h-4 mr-1" />
                                  {article.likes}
                                </div>
                                <button 
                                  onClick={() => openModal(article)}
                                  className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
                                >
                                  Read Article
                                  <ArrowRight className="w-4 h-4 ml-1" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">Ready to Build Your Perfect Resume?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Put these tips into action with our free, professional resume builder. 
            No credit card required, no hidden fees.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onNavigateToBuilder}
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              <FileText className="w-5 h-5 mr-2" />
              Start Building Now
            </button>
            <button
              onClick={onNavigateToTemplates}
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-semibold"
            >
              <Award className="w-5 h-5 mr-2" />
              Browse Templates
            </button>
          </div>
        </div>
      </section>

      {/* Article Modal */}
      {selectedArticle && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="bg-white rounded-xl max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{selectedArticle.title}</h1>
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-3">
                      {selectedArticle.category}
                    </span>
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{selectedArticle.readTime} min read</span>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  aria-label="Close article"
                  className="text-gray-400 hover:text-gray-600 text-2xl p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div 
                className="prose max-w-none"
                onClick={(e) => {
                  const target = e.target as HTMLElement;
                  if (target.tagName === 'A' && target.getAttribute('href') === '#build-resume') {
                    e.preventDefault();
                    closeModal();
                    onNavigateToBuilder();
                  }
                }}
                dangerouslySetInnerHTML={{ __html: parseMarkdown(selectedArticle.content) }}
              />
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img 
                      src={selectedArticle.author.avatar} 
                      alt={`${selectedArticle.author.name} profile`}
                      className="w-12 h-12 bg-gray-200 rounded-full mr-4 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        const next = (e.target as HTMLImageElement).nextElementSibling;
                        if (next) next.classList.remove('hidden');
                      }}
                    />
                    <div className="w-12 h-12 bg-gray-200 rounded-full mr-4 flex items-center justify-center text-gray-500 text-sm font-medium hidden">
                      {selectedArticle.author.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{selectedArticle.author.name}</p>
                      <p className="text-sm text-gray-600">{selectedArticle.author.title}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      {selectedArticle.likes}
                    </button>
                    <button className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                      <Share2 className="w-4 h-4 mr-1" />
                      Share
                    </button>
                    <button className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                      <Bookmark className="w-4 h-4 mr-1" />
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}