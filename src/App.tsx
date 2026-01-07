import React, { useState, useRef, useEffect } from 'react';
import { 
  Github, 
  Linkedin, 
  Mail, 
  Phone, 
  ExternalLink, 
  Cloud, 
  Database, 
  Code, 
  Layout, 
  Server, 
  Award,
  Menu,
  X,
  Briefcase,
  GraduationCap,
  MessageSquare,
  Sparkles,
  Send,
  Bot,
  Loader2,
  Moon,
  Sun,
  ArrowRight,
  Maximize2,
  CheckCircle2,
  FileText,
  Users,
  Image as ImageIcon,
  ZoomIn
} from 'lucide-react';

// --- GEMINI API CONFIGURATION ---
const apiKey = ""; // The execution environment provides the key at runtime.

const TAUFIK_CONTEXT = `
  You are an AI assistant for Taufik Zhang's portfolio website. 
  Your goal is to represent Taufik professionally and enthusiastically to potential employers.
  
  PROFILE:
  - Name: Taufik Zhang
  - Education: Bachelor of Information Systems at BINUS University (Expected 2027)
  - Major: Information Systems, Minor in Cloud Computing
  - GPA: 3.42 / 4.0
  - Tagline: "Bridging the gap between business problems and technical solutions."
  
  SKILLS:
  - Cloud: AWS (Foundations, Architecting, Data Engineering), Cloud Machine Learning.
  - Languages: Java, HTML5, CSS3, SQL.
  - Analysis: System Architecture, ERD, Sequence Diagrams, BPMN, Business Process Analysis.
  - Tools: Figma (High-fidelity prototyping), Visual Paradigm, VSCode.
  
  PROJECTS:
  1. UD. Buana Henjo Lestari Automation (Sep-Dec 2025):
     - Role: System Analyst & Designer.
     - Tech: System Architecture, B2B Analysis, Figma.
     - Detail: Automated manual invoicing and credit management workflows. Designed ERDs and Sequence diagrams.
  
  2. OptiResume - AI CV Analyzer (Jun 2025):
     - Role: System Designer.
     - Tech: AI Concepts, Mobile UI/UX, Deployment Diagrams.
     - Detail: Designed an AI-powered app to help fresh grads optimize CVs based on job descriptions.
  
  3. Cabut - Travel & Booking App (Dec 2024):
     - Role: Product Design.
     - Tech: Product Strategy, Figma Prototyping.
     - Detail: Personalized travel recommendation app. Created pitch deck and value proposition canvas.
  
  CERTIFICATIONS:
  - AWS Academy Graduate: Cloud Foundations, Cloud Architecting, Data Engineering, Machine Learning Foundations.
  - Udemy (Ongoing).

  Tone: Professional, confident, helpful, and concise. 
  If asked about contact info, provide: taufikzhang21@gmail.com.
`;

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedDiagram, setSelectedDiagram] = useState(null); // New state for diagram preview
  const [viewMode, setViewMode] = useState('case-study'); // 'case-study' or 'diagrams'
  
  // --- AI State ---
  const [pitch, setPitch] = useState("");
  const [isPitchLoading, setIsPitchLoading] = useState(false);
  
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'system', text: "Hi! I'm Taufik's AI Assistant. Ask me anything about his projects, skills, or experience!" }
  ]);
  const [userQuery, setUserQuery] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Smooth scroll handler
  const scrollToSection = (id) => {
    setIsMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  // Toggle Dark Mode
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // --- GEMINI API HANDLERS ---

  const generateElevatorPitch = async () => {
    setIsPitchLoading(true);
    setPitch("");
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ 
              parts: [{ 
                text: `Based on the following profile, generate a compelling, professional 2-sentence elevator pitch explaining why a company should hire Taufik Zhang as a Cloud or System Analyst intern. Start with "You should hire Taufik because..." \n\n${TAUFIK_CONTEXT}` 
              }] 
            }]
          })
        }
      );
      
      const data = await response.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (generatedText) {
        setPitch(generatedText);
      } else {
        setPitch("Specializing in Cloud Computing and System Analysis, I bridge the technical and business worlds to build scalable solutions.");
      }
    } catch (error) {
      console.error("Error generating pitch:", error);
      setPitch("Specializing in Cloud Computing and System Analysis, I bridge the technical and business worlds to build scalable solutions.");
    } finally {
      setIsPitchLoading(false);
    }
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!userQuery.trim()) return;

    const newMessages = [...chatMessages, { role: 'user', text: userQuery }];
    setChatMessages(newMessages);
    setUserQuery("");
    setIsChatLoading(true);

    try {
      // Construct conversation history for context
      const historyPrompt = newMessages.slice(-5).map(m => `${m.role === 'user' ? 'User' : 'AI'}: ${m.text}`).join('\n');
      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ 
              parts: [{ 
                text: `CONTEXT:\n${TAUFIK_CONTEXT}\n\nCONVERSATION HISTORY:\n${historyPrompt}\n\nUSER QUESTION: ${userQuery}\n\nAnswer the user's question concisely based on Taufik's profile.` 
              }] 
            }]
          })
        }
      );

      const data = await response.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm having trouble connecting right now, but feel free to email Taufik directly!";
      
      setChatMessages(prev => [...prev, { role: 'system', text: reply }]);
    } catch (error) {
      console.error("Chat error:", error);
      setChatMessages(prev => [...prev, { role: 'system', text: "Sorry, I encountered an error. Please try again later." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // --- DATA ---
  const certifications = [
    { title: "AWS Academy Graduate - Cloud Foundations", issuer: "Amazon Web Services", status: "Completed" },
    { title: "AWS Academy Graduate - Cloud Architecting", issuer: "Amazon Web Services", status: "Completed" },
    { title: "AWS Academy Graduate - Data Engineering", issuer: "Amazon Web Services", status: "Completed" },
    { title: "AWS Academy Graduate - Machine Learning Foundations", issuer: "Amazon Web Services", status: "Completed" },
    { title: "Build Responsive Real-World Websites with HTML and CSS", issuer: "Udemy by Jonas Schmedtmann", status: "Ongoing" }
  ];

  const projects = [
    {
      title: "UD. Buana Henjo Lestari Automation",
      role: "System Analyst & Designer",
      period: "Sep 2025 - Dec 2025",
      description: "Designed a new internal application to automate workflows for invoicing and credit management. Analyzed B2B processes and created complete system architecture including ERDs and Sequence Diagrams.",
      tags: ["System Architecture", "B2B Analysis", "Figma", "Process Automation"],
      icon: <Briefcase className="w-6 h-6" />,
      caseStudy: [
        {
          phase: "1. The Problem & Requirements",
          icon: <Users className="w-5 h-5" />,
          content: "The client, UD. Buana Henjo Lestari (a raincoat distributor), was facing significant operational risks. Manual invoicing led to delays, and a lack of real-time tracking caused 'Piutang Macet' (Bad Debt). Furthermore, predicting stock demand during rainy seasons was based on gut feeling, leading to overstocking. I conducted interviews with the Owner (Hendra) and Staff (Hurri & Nia) to gather requirements for a digital solution."
        },
        {
          phase: "2. Solution Architecture",
          icon: <Server className="w-5 h-5" />,
          content: "I designed a comprehensive internal B2B application. The system architecture supports three distinct user roles: Staff (for operations), Owner (for approvals), and Customers (for tracking orders). The solution includes 16 core use cases, ranging from 'Credit Limit Application' to 'Formal Warning Letter Escalation' for late payments. I also integrated an AI module for demand prediction based on historical sales data."
        },
        {
          phase: "3. Logic & Database Design",
          icon: <Database className="w-5 h-5" />,
          content: "The backbone of the system is a complex Entity Relationship Diagram (ERD). I mapped out critical entities such as `FormPengajuanKredit` (Credit Application), `TermPembayaran` (Payment Terms), and `SuratPeringatanResmi` (Warning Letters). I also created System Sequence Diagrams to define the logic for the 'Credit Lifecycle', ensuring that no credit is issued without a signed digital agreement and Owner approval."
        },
        {
          phase: "4. Final Prototype (High Fidelity)",
          icon: <Layout className="w-5 h-5" />,
          content: "The final deliverable was a set of interactive Figma prototypes. Key screens included an 'Owner Dashboard' for one-click credit approvals, a 'Collector View' for tracking overdue invoices and recording 'Promise to Pay' dates, and a 'Customer Portal' where clients can view their debt status and request returns digitally."
        }
      ],
      diagrams: [
        { title: "Entity Relationship Diagram (ERD)", type: "Database", description: "Complex relationship mapping for Credit, Invoice, and Payment entities.", driveLink: "https://drive.google.com/file/d/1AJgF3Ltno34Y19jq8VNfRHFhzQSRQ0Xs/view?usp=drive_link" },
        { title: "Use Case Diagram", type: "Logic", description: "16 Core Use Cases defining actor interactions (Admin, Staff, Owner, Customer).", driveLink: "https://drive.google.com/file/d/1jvmUu-B7Iuwn4Z2mpAMjjsWcrP4j8q6t/view", previewUrl: "https://via.placeholder.com/800x450.png?text=Use+Case+Diagram+Preview" },
        { title: "System Sequence Diagram", type: "Flow", description: "Detailed logic flow for the 'Credit Limit Approval' lifecycle.", driveLink: "https://drive.google.com/file/d/example-sequence" },
        { title: "Information Architecture", type: "Structure", description: "Sitemap and navigation flow for the multi-role application.", driveLink: "https://drive.google.com/file/d/example-ia" }
      ],
      details: {
        narration: "UD. Buana Henjo Lestari, a raincoat distributor, faced critical operational bottlenecks due to manual invoicing and credit management. This led to 'piutang macet' (bad debt) and inefficiencies in tracking receivables across their B2B client base. My role was to digitize this entire ecosystem.",
        useCase: "The system covers 16 core use cases, but the 'Credit Limit Lifecycle' is central. It starts with a Staff member submitting a 'Credit Limit Application' for a new store. The Owner reviews this via a dedicated dashboard. Once approved, the system generates a digital 'Term of Payment' agreement.",
        prototype: "The technical deliverables were comprehensive. I designed the Entity Relationship Diagram (ERD) connecting complex entities like 'FormPengajuanKredit', 'Invoice', and 'SuratPeringatanResmi'. The prototype, built in Figma, features distinct interfaces for three user roles."
      },
      figmaEmbed: "https://embed.figma.com/design/tGIvpy35kn8l5fmXtZ13iw/ABAD-UD.-Bahari?node-id=123-3199&embed-host=share"
    },
    {
      title: "OptiResume - AI CV Analyzer",
      role: "System Designer",
      period: "Jun 2025",
      description: "Designed an AI-powered mobile application architecture to analyze job descriptions and optimize CV keywords for fresh graduates. Created high-fidelity UI/UX prototypes and deployment diagrams.",
      tags: ["AI Concepts", "Mobile UI/UX", "Database Design", "System Design"],
      icon: <Code className="w-6 h-6" />,
      caseStudy: [
        {
           phase: "1. Problem",
           icon: <Users className="w-5 h-5" />,
           content: "Fresh graduates struggle to optimize CVs for ATS systems."
        },
        {
           phase: "2. Solution",
           icon: <Layout className="w-5 h-5" />,
           content: "An AI-powered mobile app that scans job descriptions and suggests keyword improvements."
        }
      ],
      diagrams: [
          { title: "System Architecture", type: "Architecture", description: "High-level view of AI Engine and Database integration.", driveLink: "https://drive.google.com/file/d/example-arch" },
          { title: "Deployment Diagram", type: "Infrastructure", description: "Cloud infrastructure planning.", driveLink: "https://drive.google.com/file/d/example-deploy" }
      ],
      details: {
        narration: "Fresh graduates often struggle to tailor their CVs effectively for specific job descriptions, leading to missed opportunities. I conceived OptiResume to bridge this gap using AI.",
        useCase: "The primary use case is 'Keyword Optimization'. A user uploads their CV and a job description. The AI engine analyzes the gap and provides actionable recommendations.",
        prototype: "The project deliverables included High-Fidelity Mobile UI/UX Prototypes in Figma to demonstrate the user journey. On the technical side, I designed the System Architecture involving an AI engine and Database integration."
      }
    },
    {
      title: "Cabut - Travel & Booking App",
      role: "Product Design",
      period: "Dec 2024",
      description: "Conceptualized a personalized travel recommendation app. Developed product pitch deck, value proposition canvas, and interactive high-fidelity mobile prototypes.",
      tags: ["Product Strategy", "Figma", "Prototyping", "User Research"],
      icon: <Layout className="w-6 h-6" />,
       caseStudy: [
        {
           phase: "1. Concept",
           icon: <Users className="w-5 h-5" />,
           content: "Travel planning is overwhelming due to too many choices."
        },
        {
           phase: "2. Design",
           icon: <Layout className="w-5 h-5" />,
           content: "A personalized recommendation engine that learns from user preferences."
        }
      ],
      diagrams: [
          { title: "User Flow", type: "UX", description: "User journey from search to booking.", driveLink: "https://drive.google.com/file/d/example-userflow" },
          { title: "Value Proposition Canvas", type: "Strategy", description: "Mapping customer pains and gains.", driveLink: "https://drive.google.com/file/d/example-vpc" }
      ],
      details: {
        narration: "Travel planning can be overwhelming due to the sheer volume of choices. 'Cabut' was designed to address this complexity by offering personalized destination, hotel, and restaurant recommendations.",
        useCase: "Key use cases focused on 'Personalized Discovery' and 'Ease of Booking'. The app needed to recommend trending hotels and promotions based on user preferences.",
        prototype: "I developed a complete Product Pitch Deck and Value Proposition Canvas to define the business strategy. For the design, I created High-Fidelity, interactive mobile app prototypes in Figma."
      }
    }
  ];

  const skills = [
    { category: "Cloud & Backend", items: ["AWS (Foundations/Architecting)", "Java", "SQL", "Database Design"], icon: <Cloud className="w-5 h-5" /> },
    { category: "Frontend & Design", items: ["HTML5", "CSS3", "Figma", "UI/UX Prototyping"], icon: <Layout className="w-5 h-5" /> },
    { category: "Analysis & Tools", items: ["Visual Paradigm", "VSCode", "System Architecture", "BPMN"], icon: <Server className="w-5 h-5" /> }
  ];

  const openProjectModal = (project, mode = 'case-study') => {
      setSelectedProject(project);
      setViewMode(mode);
  };

  const closeProjectModal = () => {
    setSelectedProject(null);
    setSelectedDiagram(null);
  }

  return (
    <div className={`${isDarkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
        
        {/* Navigation */}
        <nav className="fixed w-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md shadow-sm border-b border-slate-100 dark:border-zinc-800 z-50 transition-colors duration-300">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex-shrink-0 flex items-center gap-2">
                <Cloud className="w-8 h-8 text-black dark:text-white" />
                <span className="font-bold text-xl text-slate-900 dark:text-white">Taufik Zhang</span>
              </div>
              
              {/* Desktop Menu */}
              <div className="hidden md:flex items-center space-x-8">
                {['About', 'Projects', 'Skills', 'Contact'].map((item) => (
                  <button 
                    key={item}
                    onClick={() => scrollToSection(item.toLowerCase())}
                    className="text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white font-medium transition-colors"
                  >
                    {item}
                  </button>
                ))}
                
                {/* Theme Toggle */}
                <button 
                  onClick={toggleTheme}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors text-slate-700 dark:text-slate-300"
                  aria-label="Toggle Dark Mode"
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden flex items-center gap-4">
                <button 
                  onClick={toggleTheme}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors text-slate-700 dark:text-slate-300"
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-600 dark:text-slate-300">
                  {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-white dark:bg-zinc-900 border-t border-slate-100 dark:border-zinc-800 p-4 shadow-lg">
              <div className="flex flex-col space-y-4">
                {['About', 'Projects', 'Skills', 'Contact'].map((item) => (
                  <button 
                    key={item}
                    onClick={() => scrollToSection(item.toLowerCase())}
                    className="text-left text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white font-medium"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}
        </nav>

        {/* Hero Section */}
        <section id="about" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1 text-center md:text-left">
                <div className="inline-block px-4 py-1.5 bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-slate-200 rounded-full text-sm font-semibold mb-6">
                  Bridging Business & Tech
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                  Information Systems <br />
                  <span className="text-slate-500 dark:text-slate-400">Cloud Specialist</span>
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto md:mx-0">
                  Hi, I'm Taufik. I bridge the gap between business problems and technical solutions. 
                  Currently an undergraduate at BINUS University with a passion for Cloud Computing, 
                  System Analysis, and Full-Stack Concepts.
                </p>
                
                <div className="flex flex-wrap gap-4 justify-center md:justify-start mb-8">
                  <button 
                    onClick={() => scrollToSection('contact')}
                    className="bg-black hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 text-white px-8 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
                  >
                    Contact Me
                  </button>
                  <button 
                    onClick={() => scrollToSection('projects')}
                    className="bg-white dark:bg-transparent border border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-slate-300 px-8 py-3 rounded-lg font-semibold hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all"
                  >
                    View Work
                  </button>
                </div>

                {/* AI Elevator Pitch Generator */}
                <div className="max-w-xl mx-auto md:mx-0 bg-white dark:bg-zinc-900 p-5 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                     <Sparkles className="w-16 h-16 text-black dark:text-white" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-5 h-5 text-black dark:text-white animate-pulse" />
                      <h3 className="font-bold text-slate-800 dark:text-white">Why Hire Taufik? (AI Generated)</h3>
                    </div>
                    
                    {pitch ? (
                      <div className="bg-slate-100 dark:bg-zinc-800 p-3 rounded-lg text-slate-700 dark:text-slate-300 text-sm italic animate-in fade-in duration-500">
                        "{pitch}"
                      </div>
                    ) : (
                      <button 
                        onClick={generateElevatorPitch}
                        disabled={isPitchLoading}
                        className="text-sm text-slate-600 dark:text-slate-400 font-medium hover:text-black dark:hover:text-white flex items-center gap-2 disabled:opacity-50"
                      >
                        {isPitchLoading ? (
                          <><Loader2 className="w-4 h-4 animate-spin" /> Generating pitch...</>
                        ) : (
                          <>Click to generate an elevator pitch based on my profile stats!</>
                        )}
                      </button>
                    )}
                  </div>
                </div>

              </div>
              
                     {/* Simple Avatar/Visual Representation */}
              <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-slate-700 to-black dark:from-slate-400 dark:to-slate-600 p-1 shadow-2xl shrink-0">
                <div className="w-full h-full rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center overflow-hidden">
                   <span className="text-6xl font-bold text-slate-300 dark:text-zinc-700">TZ</span>
                </div>
              </div>
            </div>
          </div>
        </section>

  {/* 2. Glow */}
  <div className="absolute -bottom-4 -right-4 w-full h-full bg-blue-500/20 rounded-full blur-2xl -z-10"></div>
</div>
  
        {/* Education & Stats */}
        <section className="py-12 bg-white dark:bg-zinc-900 border-y border-slate-100 dark:border-zinc-800 transition-colors duration-300">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-slate-50 dark:bg-zinc-950 rounded-xl border border-transparent dark:border-zinc-800">
                <div className="flex items-center gap-3 mb-2">
                  <GraduationCap className="w-6 h-6 text-black dark:text-white" />
                  <h3 className="font-bold text-lg dark:text-white">Education</h3>
                </div>
                <p className="font-semibold text-slate-900 dark:text-slate-200">BINUS University</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Bachelor of Information Systems</p>
                <p className="text-sm text-slate-800 dark:text-slate-300 mt-1 font-mono">GPA: 3.42 / 4.0</p>
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Expected 2027</p>
              </div>
              <div className="p-6 bg-slate-50 dark:bg-zinc-950 rounded-xl border border-transparent dark:border-zinc-800">
                 <div className="flex items-center gap-3 mb-2">
                  <Database className="w-6 h-6 text-black dark:text-white" />
                  <h3 className="font-bold text-lg dark:text-white">Focus</h3>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Specializing in:</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded text-xs font-medium dark:text-slate-300">Cloud Computing</span>
                  <span className="px-2 py-1 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded text-xs font-medium dark:text-slate-300">System Analysis</span>
                  <span className="px-2 py-1 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded text-xs font-medium dark:text-slate-300">Machine Learning</span>
                </div>
              </div>
              <div className="p-6 bg-slate-50 dark:bg-zinc-950 rounded-xl border border-transparent dark:border-zinc-800">
                 <div className="flex items-center gap-3 mb-2">
                  <Award className="w-6 h-6 text-black dark:text-white" />
                  <h3 className="font-bold text-lg dark:text-white">Certifications</h3>
                </div>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">4+</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">AWS Academy Graduates & Udemy Courses</p>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-20 px-4 bg-slate-50 dark:bg-zinc-950 transition-colors duration-300">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Technical Expertise</h2>
              <p className="text-slate-600 dark:text-slate-400">My technical toolkit for building scalable solutions</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {skills.map((skillGroup, index) => (
                <div key={index} className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center mb-6 text-black dark:text-white">
                    {skillGroup.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4 dark:text-white">{skillGroup.category}</h3>
                  <ul className="space-y-2">
                    {skillGroup.items.map((skill, idx) => (
                      <li key={idx} className="flex items-center text-slate-600 dark:text-slate-400">
                        <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-600 rounded-full mr-3"></span>
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-20 px-4 bg-white dark:bg-zinc-900 transition-colors duration-300">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Featured Projects</h2>
                <p className="text-slate-600 dark:text-slate-400">End-to-end solutions from analysis to architecture</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {projects.map((project, index) => (
                <div 
                  key={index} 
                  className="group bg-slate-50 dark:bg-zinc-950 rounded-2xl p-8 border border-slate-100 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-600 transition-all hover:shadow-lg relative flex flex-col h-full"
                >
                   <div className="absolute top-8 right-8 text-slate-300 dark:text-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity">
                     <Maximize2 className="w-6 h-6" />
                   </div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-white dark:bg-zinc-900 rounded-xl shadow-sm text-black dark:text-white">
                      {project.icon}
                    </div>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-zinc-900 px-3 py-1 rounded-full border border-slate-200 dark:border-zinc-800 whitespace-nowrap">
                      {project.period}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{project.title}</h3>
                  <p className="text-slate-800 dark:text-slate-200 font-medium mb-4 text-sm">{project.role}</p>
                  <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed flex-grow">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mt-auto mb-6">
                    {project.tags.map((tag, tIndex) => (
                      <span key={tIndex} className="px-3 py-1 bg-white dark:bg-zinc-900 text-slate-600 dark:text-slate-300 text-xs font-medium rounded-md border border-slate-200 dark:border-zinc-800">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-3 mt-auto">
                    <button 
                      onClick={() => openProjectModal(project, 'case-study')}
                      className="flex items-center text-sm font-semibold text-white bg-black dark:bg-white dark:text-black px-4 py-2 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
                    >
                      View Case Study Process <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                    
                    {/* Add View Diagrams button if diagrams exist */}
                    {project.diagrams && project.diagrams.length > 0 && (
                      <button 
                        onClick={() => openProjectModal(project, 'diagrams')}
                        className="flex items-center text-sm font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
                      >
                         <ImageIcon className="w-4 h-4 mr-2" /> View Diagrams
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Project Modal */}
        {selectedProject && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-zinc-900 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl relative animate-in zoom-in-95 duration-200">
              {/* Close Button */}
              <button 
                onClick={closeProjectModal}
                className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-zinc-800 rounded-full hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors z-10"
              >
                <X className="w-6 h-6 text-black dark:text-white" />
              </button>

              <div className="p-8">
                {/* Modal Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-slate-100 dark:bg-zinc-800 rounded-xl">
                     {selectedProject.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{selectedProject.title}</h2>
                    <div className="flex items-center gap-3">
                      <p className="text-slate-600 dark:text-slate-400">{selectedProject.role}</p>
                      {/* View Mode Toggles inside Modal */}
                      <div className="flex bg-slate-100 dark:bg-zinc-800 rounded-lg p-1 ml-4">
                        <button
                          onClick={() => setViewMode('case-study')}
                          className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${viewMode === 'case-study' ? 'bg-white dark:bg-zinc-700 shadow-sm text-black dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
                        >
                          Case Study
                        </button>
                        {selectedProject.diagrams && (
                          <button
                            onClick={() => setViewMode('diagrams')}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${viewMode === 'diagrams' ? 'bg-white dark:bg-zinc-700 shadow-sm text-black dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
                          >
                            Diagrams
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-slate-200 dark:bg-zinc-800 mb-8" />

                {/* --- VIEW MODE: DIAGRAMS --- */}
                {viewMode === 'diagrams' && selectedProject.diagrams && (
                  <div className="space-y-8">
                     <div className="flex justify-between items-center">
                       <h3 className="text-xl font-bold text-slate-900 dark:text-white">System Diagrams</h3>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {selectedProject.diagrams.map((diagram, idx) => (
                          <div 
                            key={idx} 
                            onClick={() => setSelectedDiagram(diagram)}
                            className="group bg-slate-50 dark:bg-zinc-950 rounded-xl border border-slate-200 dark:border-zinc-800 overflow-hidden hover:shadow-lg transition-all cursor-pointer relative"
                          >
                            {/* Placeholder for Diagram Image */}
                            <div className="h-48 bg-slate-200 dark:bg-zinc-800 flex items-center justify-center relative overflow-hidden">
                               {diagram.previewUrl ? (
                                 <img src={diagram.previewUrl} alt={diagram.title} className="w-full h-full object-cover" />
                               ) : (
                                 <ImageIcon className="w-12 h-12 text-slate-400 dark:text-slate-600 opacity-50" />
                               )}
                               
                               <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <div className="text-white font-medium flex items-center gap-2">
                                    <ZoomIn className="w-6 h-6" /> Preview
                                  </div>
                               </div>
                            </div>
                            <div className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-slate-900 dark:text-white">{diagram.title}</h4>
                                <span className="text-xs px-2 py-1 bg-white dark:bg-zinc-900 rounded border border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-slate-400">
                                  {diagram.type}
                                </span>
                              </div>
                              <p className="text-sm text-slate-600 dark:text-slate-400">{diagram.description}</p>
                            </div>
                          </div>
                        ))}
                     </div>
                  </div>
                )}


                {/* --- VIEW MODE: CASE STUDY --- */}
                {viewMode === 'case-study' && (
                  <div className="space-y-8">
                     {/* If the project has a structured case study array, render that */}
                     {selectedProject.caseStudy ? (
                       <div className="space-y-8">
                          {selectedProject.caseStudy.map((step, idx) => (
                             <div key={idx} className="relative pl-8 border-l-2 border-slate-200 dark:border-zinc-800 pb-2">
                               <span className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-black dark:bg-white ring-4 ring-white dark:ring-zinc-900 flex items-center justify-center">
                               </span>
                               <div className="flex items-center gap-3 mb-2">
                                  <div className="p-1.5 bg-slate-100 dark:bg-zinc-800 rounded-md text-slate-700 dark:text-slate-300">
                                     {step.icon}
                                  </div>
                                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{step.phase}</h3>
                               </div>
                               <p className="text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-zinc-950 p-4 rounded-lg border border-slate-100 dark:border-zinc-800">
                                 {step.content}
                               </p>
                             </div>
                          ))}
                          
                          {/* Final Prototype / Figma Embed */}
                          <div className="relative pl-8 border-l-2 border-transparent">
                               <span className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-black dark:bg-white ring-4 ring-white dark:ring-zinc-900" />
                               <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Prototype Visualization</h3>
                               
                               {selectedProject.figmaEmbed ? (
                                 <div className="w-full h-[450px] bg-slate-100 dark:bg-zinc-950 rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-800">
                                    <iframe 
                                      style={{ border: 'none' }}
                                      width="100%" 
                                      height="100%" 
                                      src={selectedProject.figmaEmbed} 
                                      allowFullScreen
                                      title="Figma Prototype"
                                    ></iframe>
                                 </div>
                               ) : (
                                 <div className="w-full h-64 bg-slate-100 dark:bg-zinc-950 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-zinc-800 text-slate-400 dark:text-zinc-600 gap-2">
                                    <Layout className="w-12 h-12 opacity-50" />
                                    <span className="text-sm font-medium">Interactive Prototype / Figma Embed</span>
                                 </div>
                               )}
                          </div>
  
                       </div>
                     ) : (
                        // Fallback for projects without structured case studies
                        <>
                          <div className="relative pl-8 border-l-2 border-slate-200 dark:border-zinc-800">
                             <span className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-black dark:bg-white ring-4 ring-white dark:ring-zinc-900" />
                             <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Narration</h3>
                             <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                               {selectedProject.details.narration}
                             </p>
                          </div>
                          <div className="relative pl-8 border-l-2 border-slate-200 dark:border-zinc-800">
                             <span className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-black dark:bg-white ring-4 ring-white dark:ring-zinc-900" />
                             <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Use Case</h3>
                             <p className="text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-zinc-950 p-4 rounded-lg border border-slate-100 dark:border-zinc-800">
                               {selectedProject.details.useCase}
                             </p>
                          </div>
                          <div className="relative pl-8 border-l-2 border-transparent">
                             <span className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-black dark:bg-white ring-4 ring-white dark:ring-zinc-900" />
                             <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Final Prototype</h3>
                             <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                               {selectedProject.details.prototype}
                             </p>
                             <div className="w-full h-64 bg-slate-100 dark:bg-zinc-950 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-zinc-800 text-slate-400 dark:text-zinc-600 gap-2">
                                <Layout className="w-12 h-12 opacity-50" />
                                <span className="text-sm font-medium">Prototype Visualization / Figma Embed</span>
                             </div>
                          </div>
                        </>
                     )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- DIAGRAM PREVIEW LIGHTBOX --- */}
        {selectedDiagram && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
             <button 
                onClick={() => setSelectedDiagram(null)}
                className="absolute top-6 right-6 p-2 bg-zinc-800 rounded-full hover:bg-zinc-700 transition-colors text-white z-20"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="max-w-5xl w-full flex flex-col items-center">
                 <div className="w-full aspect-video bg-zinc-900 rounded-lg border border-zinc-800 flex items-center justify-center mb-6 relative overflow-hidden">
                    {selectedDiagram.previewUrl ? (
                       <img src={selectedDiagram.previewUrl} alt={selectedDiagram.title} className="w-full h-full object-contain" />
                    ) : (
                       <ImageIcon className="w-24 h-24 text-zinc-700" />
                    )}
                 </div>
                 
                 <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-white">
                    <div>
                       <h3 className="text-2xl font-bold">{selectedDiagram.title}</h3>
                       <p className="text-zinc-400 mt-1">{selectedDiagram.description}</p>
                    </div>
                    {selectedDiagram.driveLink && (
                       <a 
                         href={selectedDiagram.driveLink} 
                         target="_blank" 
                         rel="noreferrer"
                         className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-lg font-bold hover:bg-zinc-200 transition-colors"
                       >
                          <ExternalLink className="w-5 h-5" /> View HD on Drive
                       </a>
                    )}
                 </div>
              </div>
          </div>
        )}

        {/* Certifications List */}
        <section className="py-20 px-4 bg-slate-50 dark:bg-zinc-950 transition-colors duration-300">
           <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 text-center">Certifications</h2>
              <div className="space-y-4">
                {certifications.map((cert, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 rounded-lg border border-slate-200 dark:border-zinc-800 shadow-sm">
                    <div className="flex items-center gap-4">
                      <Award className="w-5 h-5 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white">{cert.title}</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{cert.issuer}</p>
                      </div>
                    </div>
                    <div className="hidden sm:block">
                       {cert.status === 'Completed' ? (
                         <span className="px-3 py-1 bg-black text-white dark:bg-white dark:text-black text-xs rounded-full font-medium">
                           {cert.status}
                         </span>
                       ) : (
                         <span className="px-3 py-1 bg-transparent border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-xs rounded-full font-medium">
                           {cert.status}
                         </span>
                       )}
                    </div>
                  </div>
                ))}
              </div>
           </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 px-4 bg-slate-900 dark:bg-black text-white transition-colors duration-300">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-white">Let's Connect</h2>
            <p className="text-slate-300 mb-12 max-w-xl mx-auto">
              I am always open to discussing new projects, internships, or opportunities to apply my Cloud Computing and System Analysis skills.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <a href="mailto:taufikzhang21@gmail.com" className="p-6 bg-slate-800 dark:bg-zinc-900 rounded-xl hover:bg-slate-700 dark:hover:bg-zinc-800 transition-colors flex flex-col items-center">
                <Mail className="w-8 h-8 mb-4 text-slate-400" />
                <span className="text-sm text-slate-400">Email Me</span>
                <span className="font-semibold mt-1 text-white">taufikzhang21@gmail.com</span>
              </a>
              
              <a href="https://linkedin.com/in/taufik-zhang-1a4460385" target="_blank" rel="noreferrer" className="p-6 bg-slate-800 dark:bg-zinc-900 rounded-xl hover:bg-slate-700 dark:hover:bg-zinc-800 transition-colors flex flex-col items-center">
                <Linkedin className="w-8 h-8 mb-4 text-slate-400" />
                <span className="text-sm text-slate-400">Connect on</span>
                <span className="font-semibold mt-1 text-white">LinkedIn</span>
              </a>

              <div className="p-6 bg-slate-800 dark:bg-zinc-900 rounded-xl hover:bg-slate-700 dark:hover:bg-zinc-800 transition-colors flex flex-col items-center">
                <Phone className="w-8 h-8 mb-4 text-slate-400" />
                <span className="text-sm text-slate-400">Call Me</span>
                <span className="font-semibold mt-1 text-white">+62 851 7513 3620</span>
              </div>
            </div>

            <div className="mt-16 text-slate-500 text-sm">
              © {new Date().getFullYear()} Taufik Zhang. All rights reserved.
            </div>
          </div>
        </section>

        {/* --- AI CHATBOT WIDGET --- */}
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
          {isChatOpen && (
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-zinc-800 w-80 sm:w-96 mb-4 overflow-hidden flex flex-col h-[500px] animate-in slide-in-from-bottom-5 fade-in duration-300">
              {/* Chat Header */}
              <div className="bg-black dark:bg-zinc-800 p-4 flex justify-between items-center text-white">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  <div>
                    <h3 className="font-bold text-sm">Taufik's AI Assistant</h3>
                    <p className="text-xs text-slate-400">Ask me anything about my portfolio!</p>
                  </div>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="hover:bg-slate-800 p-1 rounded">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-zinc-950">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
                      msg.role === 'user' 
                        ? 'bg-black dark:bg-white text-white dark:text-black rounded-br-none' 
                        : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-slate-300 rounded-bl-none shadow-sm'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isChatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-3 rounded-lg rounded-bl-none shadow-sm">
                      <Loader2 className="w-4 h-4 animate-spin text-black dark:text-white" />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <form onSubmit={handleChatSubmit} className="p-3 bg-white dark:bg-zinc-900 border-t border-slate-100 dark:border-zinc-800 flex gap-2">
                <input
                  type="text"
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  placeholder="Ask about my AWS skills..."
                  className="flex-1 bg-slate-100 dark:bg-zinc-800 border-none rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-slate-500 dark:text-white outline-none"
                />
                <button 
                  type="submit" 
                  disabled={isChatLoading || !userQuery.trim()}
                  className="bg-black dark:bg-white text-white dark:text-black p-2 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 disabled:opacity-50 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* Floating Toggle Button */}
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="bg-black dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-black p-4 rounded-full shadow-lg transition-all hover:scale-110 flex items-center justify-center group"
          >
            {isChatOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <>
                <MessageSquare className="w-6 h-6" />
                <span className="absolute right-full mr-3 bg-slate-900 dark:bg-white text-white dark:text-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Chat with my AI Assistant
                </span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default App;
