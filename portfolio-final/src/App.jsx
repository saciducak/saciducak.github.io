import React, { useState, useEffect, useRef } from 'react';

// ============================================
// SACID UÇAK - AI ENGINEER PORTFOLIO
// Final Version - Production Ready
// ============================================

const scrollToSection = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

// Custom Hooks
const useInView = (threshold = 0.1) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, isInView];
};

const useMousePosition = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handler = (e) => setPosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);
  return position;
};

// ============================================
// CURSOR FOLLOWER
// ============================================
const CursorFollower = () => {
  const mouse = useMousePosition();
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleHover = (e) => {
      const target = e.target;
      setIsHovering(
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('.hoverable')
      );
    };
    document.addEventListener('mouseover', handleHover);
    return () => document.removeEventListener('mouseover', handleHover);
  }, []);

  return (
    <div 
      className="fixed pointer-events-none z-50 hidden lg:block transition-transform duration-150"
      style={{
        left: mouse.x - 4,
        top: mouse.y - 4,
        transform: isHovering ? 'scale(3)' : 'scale(1)',
      }}
    >
      <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${isHovering ? 'bg-amber-400/50' : 'bg-neutral-400/30'}`} />
    </div>
  );
};

// ============================================
// SCROLL PROGRESS
// ============================================
const ScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress((scrollTop / docHeight) * 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-px z-50">
      <div 
        className="h-full bg-amber-400 transition-all duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

// ============================================
// NAVIGATION
// ============================================
const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = ['hero', 'venture', 'blog', 'experience', 'work', 'contact'];
      for (const section of sections.reverse()) {
        const el = document.getElementById(section);
        if (el && window.scrollY >= el.offsetTop - 200) {
          setActiveSection(section);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Venture', id: 'venture' },
    { label: 'Blog', id: 'blog' },
    { label: 'Experience', id: 'experience' },
    { label: 'Work', id: 'work' },
    { label: 'Contact', id: 'contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-700 ${scrolled ? 'bg-neutral-950/80 backdrop-blur-md' : ''}`}>
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <button onClick={() => scrollToSection('hero')} className="group text-lg tracking-tight font-medium text-neutral-100 hover:text-amber-400 transition-colors">
            <span className="inline-block group-hover:-translate-y-0.5 transition-transform">sacid</span>
            <span className="text-amber-400">.</span>
          </button>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`relative px-4 py-2 text-sm transition-colors duration-300 ${
                  activeSection === item.id ? 'text-neutral-100' : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-400 rounded-full" />
                )}
              </button>
            ))}
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden w-10 h-10 flex items-center justify-center">
            <div className="w-5 flex flex-col gap-1">
              <span className={`h-px bg-neutral-300 transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-[3px]' : ''}`} />
              <span className={`h-px bg-neutral-300 transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[2px]' : ''}`} />
            </div>
          </button>
        </div>

        <div className={`md:hidden overflow-hidden transition-all duration-500 ${menuOpen ? 'max-h-64 pb-6' : 'max-h-0'}`}>
          {navItems.map((item, i) => (
            <button 
              key={item.id} 
              onClick={() => { scrollToSection(item.id); setMenuOpen(false); }} 
              className="block w-full py-3 text-left text-neutral-400 hover:text-neutral-100 transition-colors"
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

// ============================================
// HERO SECTION - Rotating Typewriter
// ============================================
const HeroSection = () => {
  const phrases = [
    'Building intelligent systems.',
    'From research to production.',
    'Computer vision meets LLM.',
    'Transforming data into decisions.',
  ];
  
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  
  useEffect(() => {
    const currentPhrase = phrases[currentPhraseIndex];
    
    const typeSpeed = isDeleting ? 30 : 80;
    const pauseTime = isDeleting ? 500 : 3000;
    
    if (!isDeleting && displayText === currentPhrase) {
      // Pause before deleting
      const timeout = setTimeout(() => setIsDeleting(true), pauseTime);
      return () => clearTimeout(timeout);
    }
    
    if (isDeleting && displayText === '') {
      // Move to next phrase
      setIsDeleting(false);
      setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
      return;
    }
    
    const timeout = setTimeout(() => {
      if (isDeleting) {
        setDisplayText(currentPhrase.slice(0, displayText.length - 1));
      } else {
        setDisplayText(currentPhrase.slice(0, displayText.length + 1));
      }
    }, typeSpeed);
    
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentPhraseIndex, phrases]);
  
  useEffect(() => {
    const cursorInterval = setInterval(() => setShowCursor(prev => !prev), 530);
    return () => clearInterval(cursorInterval);
  }, []);

  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="hero" className="min-h-screen flex flex-col justify-center relative overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `
            linear-gradient(rgba(251, 191, 36, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(251, 191, 36, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }} />
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-transparent to-neutral-950" />
      </div>

      {/* Floating Geometric */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 opacity-20 hidden lg:block">
        <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-slow">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-amber-400/30" strokeDasharray="4 4" />
          <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-neutral-600" strokeDasharray="2 6" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-32 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-end">
          <div className="lg:col-span-8">
            {/* Status */}
            <div className="inline-flex items-center gap-3 mb-8">
              <span className="flex items-center gap-2 text-xs text-neutral-500 uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Istanbul, Turkey
              </span>
              <span className="text-neutral-700">•</span>
              <span className="text-xs text-neutral-500 font-mono">
                {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Europe/Istanbul' })}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem] font-light text-neutral-100 leading-[0.95] tracking-tight mb-6">
              <span className="block overflow-hidden">
                <span className="block animate-slide-up">Muhammed Sacid</span>
              </span>
              <span className="block overflow-hidden">
                <span className="block animate-slide-up animation-delay-100 text-neutral-500">Uçak</span>
              </span>
            </h1>

            {/* Rotating Typewriter */}
            <div className="mb-8 h-8">
              <p className="text-lg sm:text-xl text-amber-400/80 font-mono">
                {'> '}{displayText}
                <span className={`inline-block w-2 h-5 ml-1 bg-amber-400 ${showCursor ? 'opacity-100' : 'opacity-0'}`} />
              </p>
            </div>

            {/* Description */}
            <p className="text-lg text-neutral-400 max-w-xl leading-relaxed font-light mb-12">
              AI Engineer crafting production systems—from YOLO-powered computer vision 
              to multi-agent LLM architectures. Turning applied research into real-world impact.
            </p>

            {/* CTA */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => scrollToSection('venture')}
                className="hoverable group relative px-7 py-3.5 bg-neutral-100 text-neutral-900 text-sm font-medium overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Explore
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-amber-400 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>
              <a
                href="mailto:saciducak1@gmail.com"
                className="hoverable px-7 py-3.5 border border-neutral-700 text-neutral-300 text-sm font-medium hover:border-amber-400/50 hover:text-amber-400 transition-all duration-300"
              >
                Get in Touch
              </a>
            </div>
          </div>

          {/* Side Panel */}
          <div className="lg:col-span-4">
            <div className="space-y-8 lg:border-l lg:border-neutral-800 lg:pl-8">
              <div>
                <p className="text-[10px] text-neutral-600 uppercase tracking-widest mb-2">Specialization</p>
                <div className="flex flex-wrap gap-2">
                  {['Computer Vision', 'LLM Systems', 'Multi-Agent', 'Deep Learning'].map((skill) => (
                    <span key={skill} className="px-2 py-1 text-xs text-neutral-400 border border-neutral-800 hover:border-neutral-700 transition-colors">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] text-neutral-600 uppercase tracking-widest mb-2">Current Role</p>
                <p className="text-neutral-300 text-sm">Co-Founder & AI Engineer</p>
                <p className="text-neutral-500 text-sm">@ Shetland Tech</p>
              </div>
              <div>
                <p className="text-[10px] text-neutral-600 uppercase tracking-widest mb-2">Background</p>
                <p className="text-neutral-500 text-sm">B.Sc. Computer Engineering</p>
                <p className="text-neutral-600 text-xs">Marmara University</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-[10px] text-neutral-600 uppercase tracking-widest">Scroll</span>
        <div className="w-px h-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-amber-400 to-transparent animate-scroll-line" />
        </div>
      </div>
    </section>
  );
};

// ============================================
// VENTURE SECTION - Shetland Tech (First after Hero)
// ============================================
const VentureSection = () => {
  const [ref, isInView] = useInView();

  return (
    <section id="venture" className="py-32 relative bg-neutral-900/40">
      <div ref={ref} className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-16">
          {/* Content */}
          <div className={`lg:col-span-3 transition-all duration-1000 ${isInView ? 'opacity-100' : 'opacity-0 -translate-x-8'}`}>
            <div className="flex items-center gap-4 mb-6">
              <p className="text-amber-400 text-xs tracking-[0.3em] uppercase">Venture</p>
              <div className="flex-1 h-px bg-neutral-800" />
            </div>
            
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light text-neutral-100 mb-4">
              Shetland Tech
            </h2>
            <p className="text-neutral-500 text-lg mb-8">
              Marmara University Incubation Graduate • Active Investment Stage
            </p>
            
            <p className="text-neutral-400 leading-relaxed mb-10 max-w-xl">
              Building the future of agriculture through AI. Our FlorGarden platform 
              combines computer vision diagnostics with LLM-powered decision support, 
              helping farmers make data-driven decisions at every growth stage.
            </p>

            {/* Feature Cards */}
            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              {[
                { icon: '◈', title: 'Disease Detection', desc: 'YOLO-based early diagnosis' },
                { icon: '◇', title: 'Farmer AI Assistant', desc: 'LLM treatment guidance' },
                { icon: '○', title: 'Real-time Monitoring', desc: 'Crop health dashboards' },
                { icon: '□', title: 'Business Intelligence', desc: 'TÜBİTAK BİGG aligned' },
              ].map((feature) => (
                <div key={feature.title} className="group p-4 border border-neutral-800 hover:border-neutral-700 transition-colors">
                  <span className="text-amber-400/60 text-lg">{feature.icon}</span>
                  <h4 className="text-neutral-200 font-medium mt-2">{feature.title}</h4>
                  <p className="text-neutral-500 text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>

            <a
              href="https://www.linkedin.com/company/shetland-tech"
              target="_blank"
              rel="noopener noreferrer"
              className="hoverable inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-amber-400 transition-colors group"
            >
              <span>Learn more on LinkedIn</span>
              <span className="group-hover:translate-x-1 transition-transform">↗</span>
            </a>
          </div>

          {/* Visual */}
          <div className={`lg:col-span-2 transition-all duration-1000 delay-200 ${isInView ? 'opacity-100' : 'opacity-0 translate-x-8'}`}>
            <div className="relative aspect-[3/4] flex items-center justify-center">
              <div className="absolute inset-8 border border-neutral-800" />
              <div className="absolute inset-4 border border-amber-400/20" />
              
              <div className="relative z-10 text-center px-8">
                <div className="w-24 h-24 mx-auto mb-6 relative">
                  <div className="absolute inset-0 border border-amber-400/30 animate-spin-slow" style={{ animationDuration: '20s' }} />
                  <div className="absolute inset-2 border border-neutral-700 rotate-45" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl text-amber-400/60">◊</span>
                  </div>
                </div>
                <p className="text-neutral-500 text-sm leading-relaxed max-w-xs">
                  Transforming agriculture through intelligent systems and sustainable technology
                </p>
              </div>

              <div className="absolute top-0 left-0 w-4 h-4 border-l border-t border-amber-400/40" />
              <div className="absolute top-0 right-0 w-4 h-4 border-r border-t border-amber-400/40" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-l border-b border-amber-400/40" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-r border-b border-amber-400/40" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// BLOG SECTION (Second - renamed from Writing)
// ============================================
const BlogSection = () => {
  const [ref, isInView] = useInView();

  const articles = [
    {
      title: 'DevDay in OpenAI: The Earthquake that Shook the Automation World',
      date: 'Jun 2025',
      read: '8 min',
      description: 'How DevDay became a turning point for Automation startups.',
      tag: 'Analysis',
    },
    {
      title: 'AI Wars #2: Game of Thrones',
      date: 'Feb 2025',
      read: '6 min',
      description: 'OpenAI\'s response to o3-mini. DeepSeek\'s market impact.',
      tag: 'Industry',
    },
    {
      title: 'AI Wars #1: DeepSeek R1 Phenomenon',
      date: 'Jan 2025',
      read: '7 min',
      description: 'China\'s DeepSeek R1—10x faster, rose to #2 in AppStore.',
      tag: 'Research',
    },
  ];

  return (
    <section id="blog" className="py-32 relative">
      <div className="absolute top-0 left-6 lg:left-8 right-6 lg:right-8 h-px bg-neutral-800" />
      
      <div ref={ref} className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className={`flex items-end justify-between mb-16 transition-all duration-1000 ${isInView ? 'opacity-100' : 'opacity-0 translate-y-8'}`}>
          <div>
            <p className="text-amber-400 text-xs tracking-[0.3em] uppercase mb-3">Insights</p>
            <h2 className="text-4xl sm:text-5xl font-light text-neutral-100">
              Blog
            </h2>
          </div>
          <a
            href="https://medium.com/@saciducak1"
            target="_blank"
            rel="noopener noreferrer"
            className="hoverable hidden sm:flex items-center gap-2 text-sm text-neutral-500 hover:text-amber-400 transition-colors"
          >
            All articles <span>↗</span>
          </a>
        </div>

        {/* Articles */}
        <div className="grid md:grid-cols-3 gap-6">
          {articles.map((article, i) => (
            <a
              key={article.title}
              href="https://medium.com/@saciducak1"
              target="_blank"
              rel="noopener noreferrer"
              className={`hoverable group block p-6 border border-neutral-800 hover:border-amber-400/30 transition-all duration-500 ${
                isInView ? 'opacity-100' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${200 + i * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 text-xs text-neutral-600">
                  <span>{article.date}</span>
                  <span>•</span>
                  <span>{article.read} read</span>
                </div>
                <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider border border-neutral-700 text-neutral-500">
                  {article.tag}
                </span>
              </div>
              <h3 className="text-lg text-neutral-200 font-medium mb-3 group-hover:text-amber-400 transition-colors leading-tight">
                {article.title}
              </h3>
              <p className="text-neutral-500 text-sm mb-4">{article.description}</p>
              <div className="flex items-center gap-2 text-neutral-600 group-hover:text-amber-400 transition-colors">
                <span className="text-sm">Read article</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// EXPERIENCE SECTION (Third)
// ============================================
const ExperienceSection = () => {
  const [ref, isInView] = useInView();
  const [hoveredExp, setHoveredExp] = useState(null);

  const experiences = [
    {
      id: 'shetland',
      period: '2025 —',
      role: 'AI Engineer & Co-Founder',
      company: 'Shetland Tech',
      type: 'Venture',
      description: 'Leading AI products for smart agriculture. Computer vision disease detection combined with LLM-powered decision support.',
      highlights: ['Plant disease detection', 'Farmer AI assistant', 'End-to-end platform'],
      current: true,
    },
    {
      id: 'baykar',
      period: '2024 — 2025',
      role: 'AI Engineer',
      company: 'Baykar Technologies',
      type: 'Defense',
      description: 'Video object detection pipelines for UAV systems. Small-object detection solutions with rule-based and deep learning approaches.',
      highlights: ['UAV data annotation', 'Tracker models', 'mAP optimization'],
    },
    {
      id: 'ejder',
      period: '2024 — 2025',
      role: 'AI Engineer',
      company: 'Ejder Turizm',
      type: 'Enterprise',
      description: 'Company-wide tooling for Finance, CRM, and operations. Process automation and decision-support systems.',
      highlights: ['Workflow automation', 'CRM tools', 'Reporting systems'],
    },
    {
      id: 'intertech',
      period: '2022 — 2023',
      role: 'AI Engineer Intern',
      company: 'Intertech',
      type: 'Fintech',
      description: 'Deep learning pipelines for face recognition and ID extraction. YOLOv8-10 fine-tuning achieving 97%+ accuracy.',
      highlights: ['Face recognition', 'ID extraction', '97% accuracy'],
    },
  ];

  return (
    <section id="experience" className="py-32 relative bg-neutral-900/40">
      <div ref={ref} className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className={`mb-16 transition-all duration-1000 ${isInView ? 'opacity-100' : 'opacity-0 translate-y-8'}`}>
          <p className="text-amber-400 text-xs tracking-[0.3em] uppercase mb-3">Journey</p>
          <h2 className="text-4xl sm:text-5xl font-light text-neutral-100">
            Experience
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-neutral-800 md:-translate-x-1/2" />

          {experiences.map((exp, i) => (
            <div
              key={exp.id}
              className={`relative mb-12 last:mb-0 transition-all duration-700 ${isInView ? 'opacity-100' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${200 + i * 100}ms` }}
              onMouseEnter={() => setHoveredExp(exp.id)}
              onMouseLeave={() => setHoveredExp(null)}
            >
              <div className={`md:grid md:grid-cols-2 gap-8 ${i % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
                <div className={`${i % 2 === 0 ? 'md:text-right md:pr-12' : 'md:col-start-2 md:pl-12'} pl-8 md:pl-0`}>
                  <div className={`transition-all duration-300 ${hoveredExp === exp.id ? 'transform md:scale-[1.02]' : ''}`}>
                    <div className={`flex items-center gap-3 mb-2 ${i % 2 === 0 ? 'md:justify-end' : ''}`}>
                      {i % 2 !== 0 && <span className={`px-2 py-0.5 text-[10px] uppercase tracking-wider border ${exp.current ? 'border-amber-400/50 text-amber-400' : 'border-neutral-700 text-neutral-500'}`}>{exp.type}</span>}
                      <span className="text-neutral-600 text-sm font-mono">{exp.period}</span>
                      {exp.current && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                      {i % 2 === 0 && <span className={`px-2 py-0.5 text-[10px] uppercase tracking-wider border ${exp.current ? 'border-amber-400/50 text-amber-400' : 'border-neutral-700 text-neutral-500'}`}>{exp.type}</span>}
                    </div>
                    
                    <h3 className="text-xl lg:text-2xl text-neutral-100 font-medium mb-1">{exp.role}</h3>
                    <p className="text-amber-400/80 mb-3">{exp.company}</p>
                    <p className="text-neutral-500 text-sm leading-relaxed mb-4">{exp.description}</p>
                    
                    <div className={`flex flex-wrap gap-2 ${i % 2 === 0 ? 'md:justify-end' : ''}`}>
                      {exp.highlights.map((h) => (
                        <span key={h} className="px-2 py-1 bg-neutral-800/50 text-neutral-500 text-xs">
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                {i % 2 === 0 && <div className="hidden md:block" />}
              </div>

              <div className={`absolute left-0 md:left-1/2 top-1 w-3 h-3 -translate-x-1/2 transition-all duration-300 ${
                hoveredExp === exp.id || exp.current ? 'bg-amber-400 scale-125' : 'bg-neutral-700'
              }`} style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
            </div>
          ))}
        </div>

        {/* Education */}
        <div className={`mt-20 pt-12 border-t border-neutral-800/50 transition-all duration-1000 delay-500 ${isInView ? 'opacity-100' : 'opacity-0'}`}>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-[10px] text-neutral-600 uppercase tracking-widest mb-2">Education</p>
              <h3 className="text-xl text-neutral-200">B.Sc. Computer Engineering</h3>
              <p className="text-neutral-500">Marmara University • 2020 — 2025</p>
            </div>
            <div className="md:text-right">
              <p className="text-neutral-500 text-sm">
                Thesis: Comparison of YOLO Models in Plant Disease Detection
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// WORK SECTION (Fourth - Projects)
// ============================================
const WorkSection = () => {
  const [ref, isInView] = useInView();
  const [expandedProject, setExpandedProject] = useState(null);

  const projects = [
    {
      id: 'plant',
      number: '01',
      title: 'Plant Disease Detection System',
      subtitle: 'Computer Vision',
      description: 'Production-ready YOLO-based detection achieving 0.92 mAP. Automated analysis with treatment recommendations, reducing manual inspection by 70%.',
      details: [
        'Fine-tuned YOLOv8/v9 models with custom augmentation',
        'Integrated LLM layer for diagnosis interpretation',
        'Real-time inference with monitoring dashboards',
      ],
      metrics: { mAP: '0.92', f1: '+12%', efficiency: '-70%' },
      tech: ['YOLO', 'Python', 'Deep Learning', 'LLM'],
      color: 'from-emerald-500/10 to-transparent',
    },
    {
      id: 'agents',
      number: '02',
      title: 'Multi-Agent Decision System',
      subtitle: 'LLM Architecture',
      description: 'Task-based LLM orchestration with CrewAI-style coordination. Document analysis, summarization, and action recommendations with RAG retrieval.',
      details: [
        'Agent behaviors with task breakdown and state handling',
        'Tool-triggered actions via Python control logic',
        'Lightweight retrieval over internal knowledge bases',
      ],
      metrics: { agents: 'Multi', pipeline: 'RAG', tools: 'Yes' },
      tech: ['LLM', 'CrewAI', 'Python', 'RAG'],
      color: 'from-violet-500/10 to-transparent',
    },
    {
      id: 'proline',
      number: '03',
      title: 'ProLine Workforce Platform',
      subtitle: 'Full-Stack SaaS',
      description: 'Real-time personnel management with Firebase. Live tracking, approval workflows, and automated reporting—SaaS-ready for cross-industry deployment.',
      details: [
        'Real-time check-in/out and break tracking',
        'Approval workflows with automated notifications',
        'Export to Excel/PDF for HR reporting',
      ],
      metrics: { type: 'Real-Time', scale: 'SaaS', scope: 'Enterprise' },
      tech: ['React', 'Firebase', 'TypeScript'],
      color: 'from-amber-500/10 to-transparent',
    },
    {
      id: 'fraud',
      number: '04',
      title: 'Fraud Detection & Onboarding',
      subtitle: 'Identity Verification',
      description: 'AI-based verification for digital onboarding. ID-card face matching with optimized small-object detection on high-resolution documents.',
      details: [
        'Reduced false positives by 50%',
        'Improved recall by 25% on edge cases',
        'Production deployment in financial workflows',
      ],
      metrics: { fps: '-50%', recall: '+25%', status: 'Prod' },
      tech: ['YOLOv8', 'Face Recognition', 'Deep Learning'],
      color: 'from-rose-500/10 to-transparent',
    },
    {
      id: 'stock',
      number: '05',
      title: 'Stock Price Prediction',
      subtitle: 'ML Finance',
      description: 'Real-time prediction integrating yfinance API with deep learning. 92% directional accuracy with FinBERT sentiment analysis in development.',
      details: [
        'Live market data integration via yfinance',
        'Reduced MSE by 35% vs baseline models',
        'Sentiment layer with financial news streams',
      ],
      metrics: { accuracy: '92%', mse: '-35%', nlp: 'FinBERT' },
      tech: ['Deep Learning', 'yfinance', 'NLP'],
      color: 'from-cyan-500/10 to-transparent',
    },
  ];

  return (
    <section id="work" className="py-32 relative">
      <div className="absolute top-0 left-6 lg:left-8 right-6 lg:right-8 h-px bg-neutral-800" />
      
      <div ref={ref} className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className={`flex items-end justify-between mb-16 transition-all duration-1000 ${isInView ? 'opacity-100' : 'opacity-0 translate-y-8'}`}>
          <div>
            <p className="text-amber-400 text-xs tracking-[0.3em] uppercase mb-3">Portfolio</p>
            <h2 className="text-4xl sm:text-5xl font-light text-neutral-100">
              Selected Work
            </h2>
          </div>
          <p className="hidden sm:block text-neutral-600 text-sm">
            {projects.length} Projects
          </p>
        </div>

        {/* Projects */}
        <div className="space-y-4">
          {projects.map((project, i) => (
            <div
              key={project.id}
              className={`group relative transition-all duration-700 ${isInView ? 'opacity-100' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${200 + i * 100}ms` }}
            >
              <div 
                className={`hoverable relative p-6 lg:p-8 border border-neutral-800 cursor-pointer transition-all duration-500 ${
                  expandedProject === project.id ? 'bg-neutral-900/50 border-neutral-700' : 'hover:border-neutral-700 hover:bg-neutral-900/30'
                }`}
                onClick={() => setExpandedProject(expandedProject === project.id ? null : project.id)}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${project.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
                
                <div className="relative grid md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-1">
                    <span className="text-neutral-700 font-mono text-sm">{project.number}</span>
                  </div>

                  <div className="md:col-span-5">
                    <h3 className="text-xl lg:text-2xl text-neutral-100 font-medium group-hover:text-amber-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-neutral-500 text-sm mt-1">{project.subtitle}</p>
                  </div>

                  <div className="md:col-span-4 hidden md:flex gap-4">
                    {Object.entries(project.metrics).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <p className="text-neutral-300 text-sm font-medium">{value}</p>
                        <p className="text-neutral-600 text-[10px] uppercase tracking-wider">{key}</p>
                      </div>
                    ))}
                  </div>

                  <div className="md:col-span-2 flex justify-end">
                    <div className={`w-8 h-8 border border-neutral-700 flex items-center justify-center transition-all duration-300 ${
                      expandedProject === project.id ? 'bg-amber-400 border-amber-400 rotate-45' : 'group-hover:border-neutral-500'
                    }`}>
                      <span className={`text-lg transition-colors ${expandedProject === project.id ? 'text-neutral-900' : 'text-neutral-500'}`}>+</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`overflow-hidden transition-all duration-500 ${expandedProject === project.id ? 'max-h-96' : 'max-h-0'}`}>
                <div className="p-6 lg:p-8 border border-t-0 border-neutral-800 bg-neutral-900/30">
                  <div className="grid md:grid-cols-12 gap-8">
                    <div className="md:col-span-7">
                      <p className="text-neutral-400 leading-relaxed mb-6">{project.description}</p>
                      <ul className="space-y-2">
                        {project.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-sm text-neutral-500">
                            <span className="text-amber-400 mt-1">→</span>
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="md:col-span-5">
                      <p className="text-[10px] text-neutral-600 uppercase tracking-widest mb-3">Technologies</p>
                      <div className="flex flex-wrap gap-2">
                        {project.tech.map((t) => (
                          <span key={t} className="px-3 py-1.5 bg-neutral-800 text-neutral-400 text-xs">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// UNITED WE SECTION
// ============================================
const UnitedWeSection = () => {
  const [ref, isInView] = useInView();

  return (
    <section className="py-24 relative bg-neutral-900/40">
      <div ref={ref} className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className={`max-w-2xl transition-all duration-1000 ${isInView ? 'opacity-100' : 'opacity-0 translate-y-8'}`}>
          <p className="text-neutral-600 text-xs tracking-[0.3em] uppercase mb-4">Philosophy</p>
          <h2 className="text-3xl sm:text-4xl font-light text-neutral-200 mb-6">
            United We<span className="text-amber-400">.</span>
          </h2>
          <p className="text-neutral-400 leading-relaxed mb-8">
            An ecosystem built on collective growth—learning, coding, and developing together. 
            The belief that shared knowledge accelerates everyone's progress.
          </p>
          <div className="flex gap-12">
            {[
              { word: 'Learn', sub: 'Continuous' },
              { word: 'Code', sub: 'Together' },
              { word: 'Develop', sub: 'Collectively' },
            ].map((item) => (
              <div key={item.word} className="group">
                <p className="text-neutral-300 font-medium group-hover:text-amber-400 transition-colors">{item.word}</p>
                <p className="text-neutral-600 text-sm">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// CONTACT SECTION
// ============================================
const ContactSection = () => {
  const [ref, isInView] = useInView();

  const links = [
    { name: 'Email', href: 'mailto:saciducak1@gmail.com', value: 'saciducak1@gmail.com' },
    { name: 'LinkedIn', href: 'https://www.linkedin.com/in/muhammed-sacid-uçak-1baa31172/', value: '/muhammed-sacid-uçak' },
    { name: 'GitHub', href: 'https://github.com/saciducak', value: '/saciducak' },
    { name: 'Medium', href: 'https://medium.com/@saciducak1', value: '/@saciducak1' },
  ];

  return (
    <section id="contact" className="py-32 relative">
      <div className="absolute top-0 left-6 lg:left-8 right-6 lg:right-8 h-px bg-neutral-800" />
      
      <div ref={ref} className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16">
          <div className={`transition-all duration-1000 ${isInView ? 'opacity-100' : 'opacity-0 -translate-x-8'}`}>
            <p className="text-amber-400 text-xs tracking-[0.3em] uppercase mb-3">Contact</p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light text-neutral-100 mb-6">
              Let's build<br />something.
            </h2>
            <p className="text-neutral-400 leading-relaxed max-w-md">
              Open to AI projects, collaborations, and interesting challenges. 
              Based in Istanbul, working globally.
            </p>
          </div>

          <div className={`transition-all duration-1000 delay-200 ${isInView ? 'opacity-100' : 'opacity-0 translate-x-8'}`}>
            <div className="space-y-0">
              {links.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target={link.href.startsWith('mailto') ? undefined : '_blank'}
                  rel={link.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                  className="hoverable group flex items-center justify-between py-5 border-b border-neutral-800 hover:border-neutral-700 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] text-neutral-600 uppercase tracking-widest w-16">{link.name}</span>
                    <span className="text-neutral-300 group-hover:text-amber-400 transition-colors">{link.value}</span>
                  </div>
                  <span className="text-neutral-600 group-hover:text-amber-400 group-hover:translate-x-1 transition-all">↗</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// FOOTER
// ============================================
const Footer = () => (
  <footer className="py-8 border-t border-neutral-800/50">
    <div className="max-w-6xl mx-auto px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-neutral-600 text-sm">
          © {new Date().getFullYear()} Sacid Uçak
        </p>
        <p className="text-neutral-700 text-xs">
          Crafted with precision
        </p>
      </div>
    </div>
  </footer>
);

// ============================================
// MAIN APP
// ============================================
export default function App() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 antialiased cursor-default">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400&display=swap');
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        html {
          scroll-behavior: smooth;
          font-family: 'Inter', -apple-system, sans-serif;
        }
        
        body {
          background-color: #0a0a0a;
          color: #fafafa;
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
        }
        
        ::selection {
          background-color: rgba(251, 191, 36, 0.2);
          color: #fafafa;
        }
        
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0a0a; }
        ::-webkit-scrollbar-thumb { background: #262626; }
        ::-webkit-scrollbar-thumb:hover { background: #404040; }

        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes scroll-line {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        .animation-delay-100 {
          animation-delay: 0.1s;
        }
        
        .animate-scroll-line {
          animation: scroll-line 1.5s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>

      <CursorFollower />
      <ScrollProgress />
      <Navigation />
      <HeroSection />
      <VentureSection />
      <BlogSection />
      <ExperienceSection />
      <WorkSection />
      <UnitedWeSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
