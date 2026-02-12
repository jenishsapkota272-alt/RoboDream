
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Menu, 
  X, 
  Cpu, 
  Eye, 
  Zap, 
  Users, 
  ChevronRight, 
  ArrowRight, 
  Github, 
  Twitter, 
  Linkedin, 
  MessageSquare,
  Moon,
  Sun,
  Bot,
  Globe,
  ShieldCheck,
  Code,
  PlayCircle,
  Video,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from "@google/genai";

// --- Components ---

const Navbar: React.FC<{ 
  isDarkMode: boolean; 
  toggleDarkMode: () => void;
  scrolled: boolean;
}> = ({ isDarkMode, toggleDarkMode, scrolled }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Tech', href: '#tech' },
    { name: 'Demos', href: '#demos' },
    { name: 'Roadmap', href: '#roadmap' },
    { name: 'Team', href: '#team' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'py-4 glass-dark shadow-2xl shadow-cyan-900/10' : 'py-6 bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center glow-cyan shadow-lg shadow-cyan-500/20">
            <Bot className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tighter font-heading text-white">
            ROBO<span className="text-cyan-400">DREAM</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center space-x-6">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="text-xs font-semibold text-slate-300 hover:text-cyan-400 transition-colors uppercase tracking-[0.15em]"
            >
              {link.name}
            </a>
          ))}
          <div className="h-4 w-[1px] bg-white/10 mx-2"></div>
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <a href="#contact" className="px-5 py-2.5 bg-cyan-500 text-white rounded-full font-bold text-xs hover:bg-cyan-400 hover:scale-105 transition-all shadow-lg shadow-cyan-500/20 tracking-wider">
            SUPPORT US
          </a>
        </div>

        {/* Mobile Nav Toggle */}
        <div className="lg:hidden flex items-center space-x-4">
          <button onClick={toggleDarkMode} className="p-2">
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button onClick={() => setIsOpen(!isOpen)} className="text-white">
            {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 w-full glass-dark border-t border-white/10 p-6 lg:hidden overflow-hidden"
          >
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setIsOpen(false)}
                  className="text-base font-medium text-slate-300 hover:text-cyan-400 transition-colors py-2 border-b border-white/5"
                >
                  {link.name}
                </a>
              ))}
              <a href="#contact" onClick={() => setIsOpen(false)} className="w-full py-3 bg-cyan-500 text-white text-center rounded-xl font-bold mt-4 shadow-lg shadow-cyan-500/20">
                SUPPORT US
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState<{role: 'user' | 'bot', text: string}[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    const userText = query;
    setQuery('');
    setHistory(prev => [...prev, { role: 'user', text: userText }]);
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are the AI assistant for RoboDream (DreamRobo), a humanoid robotics project by students of Srijana Secondary School. 
        Lead: Jenish Sapkota. Team members include Jenish Sapkota (Lead), Anup Ale (Hardware), Kristina Shrestha (AI), Anisha Baraili (UX), Rhythm Adhikari (Electronics), Aaditya Acharya (Dev), and Obir Thapa Magar (Mechanics).
        Partner: ING Innovation Group. 
        Question: ${userText}`,
      });
      setHistory(prev => [...prev, { role: 'bot', text: response.text || "I'm sorry, I couldn't process that." }]);
    } catch (err) {
      setHistory(prev => [...prev, { role: 'bot', text: "Service temporarily unavailable. Please try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-[calc(100vw-3rem)] md:w-96 h-[500px] glass-dark border border-cyan-500/30 rounded-2xl flex flex-col mb-4 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
          >
            <div className="p-4 bg-gradient-to-r from-cyan-600 to-blue-600 flex justify-between items-center text-white">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5" />
                <span className="font-bold tracking-tight">DreamRobo AI</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              <div className="bg-white/5 rounded-2xl rounded-tl-none p-4 text-sm leading-relaxed border border-white/5">
                Hello! I'm the RoboDream virtual assistant. How can I help you today regarding our humanoid project?
              </div>
              {history.map((item, idx) => (
                <div key={idx} className={`flex ${item.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${item.role === 'user' ? 'bg-cyan-500 text-white rounded-tr-none shadow-md' : 'bg-white/10 text-slate-200 rounded-tl-none border border-white/5'}`}>
                    {item.text}
                  </div>
                </div>
              ))}
              {loading && <div className="text-xs text-cyan-400 animate-pulse flex items-center space-x-2"><div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"></div><span>Processing neural data...</span></div>}
            </div>

            <form onSubmit={handleAsk} className="p-4 border-t border-white/10 flex space-x-2 bg-slate-900/50">
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about v0.1..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-cyan-500 transition-all"
              />
              <button className="bg-cyan-500 p-2.5 rounded-xl text-white hover:bg-cyan-400 transition-all shadow-md">
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all text-white glow-cyan group relative"
      >
        <MessageSquare className="w-7 h-7 group-hover:scale-110 transition-transform" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-slate-950 rounded-full"></span>
      </button>
    </div>
  );
};

const Hero = () => (
  <section id="home" className="relative pt-32 pb-20 overflow-hidden min-h-screen flex items-center">
    <div className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] bg-cyan-500/10 blur-[150px] rounded-full -z-10"></div>
    <div className="absolute bottom-1/4 right-1/4 w-[45rem] h-[45rem] bg-blue-600/10 blur-[150px] rounded-full -z-10"></div>
    
    <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="inline-flex items-center space-x-3 px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-8">
          <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.8)]"></span>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400">RoboDream Humanoid Prototype v0.1</span>
        </div>
        <h1 className="text-5xl md:text-8xl font-black font-heading mb-8 leading-[1.1] tracking-tighter">
          The <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500">Dream</span> of Machine Sentience.
        </h1>
        <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-xl leading-relaxed">
          The pioneering student-led AI robotics platform from Srijana Secondary School, redefining human-machine collaboration in Nepal.
        </p>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
          <a href="#demos" className="px-10 py-5 bg-white text-slate-950 rounded-full font-bold hover:bg-cyan-400 hover:text-white hover:scale-105 transition-all flex items-center justify-center group shadow-xl shadow-white/5">
            View Live Demo
            <PlayCircle className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
          </a>
          <a href="#contact" className="px-10 py-5 bg-transparent border-2 border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/5 text-white rounded-full font-bold transition-all flex items-center justify-center">
            Partner With Us
          </a>
        </div>

        <div className="mt-20 flex items-center space-x-12 opacity-50 grayscale hover:grayscale-0 transition-all">
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Global Partners</div>
          <div className="flex items-center space-x-8">
            <span className="font-heading font-bold text-2xl tracking-tighter hover:text-cyan-400 transition-colors">ING INNOVATION</span>
            <span className="font-heading font-medium text-xl border-l border-white/20 pl-8">SRIJANA SCHOOL</span>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative perspective-1000"
      >
        <div className="relative z-10 animate-float">
          <div className="relative group">
            <img 
              src="https://images.unsplash.com/photo-1546776310-eef45dd6d63c?q=80&w=1000&auto=format&fit=crop" 
              alt="RoboDream Humanoid" 
              className="rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/10 object-cover aspect-square relative z-10 grayscale hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 rounded-[3rem] z-20"></div>
          </div>
          
          {/* Futuristic Scan Lines */}
          <div className="absolute inset-0 z-30 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
          
          <div className="absolute -top-12 -right-12 w-48 h-48 border-t-2 border-r-2 border-cyan-500/30 rounded-tr-[4rem] pointer-events-none"></div>
          <div className="absolute -bottom-12 -left-12 w-48 h-48 border-b-2 border-l-2 border-cyan-500/30 rounded-bl-[4rem] pointer-events-none"></div>
        </div>
        
        {/* Real-time Telemetry Overlay */}
        <motion.div 
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 -right-8 glass p-5 rounded-2xl z-40 border-cyan-500/20 shadow-2xl backdrop-blur-xl"
        >
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-2 border-cyan-500/30 border-t-cyan-500 animate-spin"></div>
              <Cpu className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-0.5">CPU Core Load</div>
              <div className="text-sm font-black text-white">12.8% Nominal</div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 -left-12 glass p-5 rounded-2xl z-40 border-blue-500/20 shadow-2xl backdrop-blur-xl"
        >
          <div className="flex items-center space-x-4">
             <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl">
               <Eye className="w-6 h-6 animate-pulse" />
             </div>
             <div>
               <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-0.5">Neural Vision</div>
               <div className="text-sm font-black text-white">4K Real-time</div>
             </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

const Features = () => {
  const features = [
    {
      icon: <Cpu className="w-8 h-8 text-cyan-400" />,
      title: "Modular AI Brain",
      desc: "Distributed cognitive architecture enabling simultaneous task processing and learning."
    },
    {
      icon: <Eye className="w-8 h-8 text-blue-400" />,
      title: "Vision Engines",
      desc: "Advanced SLAM and object detection algorithms for autonomous navigation."
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-400" />,
      title: "Precision Kinematics",
      desc: "Custom-designed linear actuators providing smooth, human-like joint movements."
    },
    {
      icon: <Globe className="w-8 h-8 text-green-400" />,
      title: "Linguistic Core",
      desc: "Multi-lingual NLP engine capable of understanding nuances in human conversation."
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-red-400" />,
      title: "Safety Protocols",
      desc: "Rigorous hardware-level safeguards to ensure safe human interaction at all times."
    },
    {
      icon: <Code className="w-8 h-8 text-purple-400" />,
      title: "OSS Integration",
      desc: "Fully compatible with ROS2 and common AI frameworks for rapid development."
    }
  ];

  return (
    <section id="tech" className="py-24 bg-slate-950 relative">
      <div className="absolute inset-0 bg-grid-white/[0.02] -z-10"></div>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em] mb-4">Core Technology</h2>
          <h3 className="text-4xl md:text-6xl font-heading font-black mb-8 text-white">Engineering the Future.</h3>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
            RoboDream is more than a robot; it's an evolving platform built on a stack of high-performance components.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-10 glass rounded-[2.5rem] hover:border-cyan-500/50 transition-all duration-500 group relative overflow-hidden"
            >
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-cyan-500/5 blur-3xl rounded-full group-hover:bg-cyan-500/10 transition-colors"></div>
              <div className="mb-8 p-5 bg-white/5 rounded-2xl w-fit group-hover:scale-110 group-hover:rotate-6 transition-all shadow-inner">
                {f.icon}
              </div>
              <h4 className="text-2xl font-black mb-4 text-white group-hover:text-cyan-400 transition-colors">{f.title}</h4>
              <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const DemoSection = () => {
  const demos = [
    { title: "Voice Recognition v1", type: "Demo", img: "https://images.unsplash.com/photo-1589254065878-42c9da997008?q=80&w=800&auto=format&fit=crop" },
    { title: "Gesture Mapping", type: "Video", img: "https://images.unsplash.com/photo-1531746790731-6c087fecd05a?q=80&w=800&auto=format&fit=crop" },
    { title: "Object Analysis", type: "Demo", img: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800&auto=format&fit=crop" }
  ];

  return (
    <section id="demos" className="py-24 bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-xl">
             <h2 className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em] mb-4">Prototypes & Media</h2>
             <h3 className="text-4xl md:text-5xl font-heading font-black text-white leading-tight">Interactive Showcase</h3>
          </div>
          <a href="#contact" className="text-cyan-400 font-bold flex items-center hover:underline group pb-2">
            Request Full Demo Access <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform" />
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {demos.map((d, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-video rounded-3xl overflow-hidden mb-6 border border-white/10 shadow-xl">
                <img src={d.img} alt={d.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-all flex items-center justify-center">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group-hover:scale-125 transition-all shadow-2xl">
                    <PlayCircle className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-cyan-500 text-[10px] font-black uppercase tracking-widest text-white rounded-full shadow-lg">
                    {d.type}
                  </span>
                </div>
              </div>
              <h4 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">{d.title}</h4>
              <p className="text-slate-500 text-sm">Experience the raw processing power of DreamRobo v0.1.</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Roadmap = () => {
  const steps = [
    {
      version: "v0.1",
      title: "Core Foundation",
      status: "Operational",
      desc: "Establishing neural interface, vision stack, and preliminary skeletal structure.",
      completed: true
    },
    {
      version: "v1.0",
      title: "Somatic Integration",
      status: "Upcoming Q4",
      desc: "Full torso and limb articulation with advanced tactile feedback sensors.",
      completed: false
    },
    {
      version: "v2.0",
      title: "Cognitive Synergy",
      status: "FY 2026",
      desc: "Deployment of autonomous reasoning and cross-modal learning algorithms.",
      completed: false
    },
    {
      version: "v3.0",
      title: "DreamRobo Global",
      status: "Future Vision",
      desc: "Decentralized robotic network for large-scale social implementation.",
      completed: false
    }
  ];

  return (
    <section id="roadmap" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-xl">
            <h2 className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em] mb-4">Milestones</h2>
            <h3 className="text-4xl md:text-5xl font-heading font-black text-white">Our Evolutionary Path.</h3>
          </div>
          <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl">
             <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Current Progress</div>
             <div className="flex items-center space-x-3">
               <div className="h-1.5 w-32 bg-slate-800 rounded-full overflow-hidden">
                 <div className="h-full w-1/4 bg-cyan-500"></div>
               </div>
               <span className="text-sm font-bold text-white">25% Done</span>
             </div>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="relative group">
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[calc(4rem+2rem)] w-[calc(100%-4rem-2rem)] h-[2px] bg-gradient-to-r from-cyan-500/50 to-transparent z-0"></div>
              )}
              <div className="relative z-10 flex flex-col h-full">
                <div className={`w-20 h-20 rounded-3xl mb-8 flex items-center justify-center font-black text-xl transition-all duration-500 shadow-2xl ${step.completed ? 'bg-cyan-500 text-white glow-cyan' : 'bg-white/5 text-slate-500 border border-white/10 group-hover:border-cyan-500/50'}`}>
                  {step.version}
                </div>
                <h4 className="text-2xl font-black mb-3 text-white">{step.title}</h4>
                <div className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-cyan-500 uppercase tracking-widest mb-6 w-fit">
                  {step.status}
                </div>
                <p className="text-slate-400 leading-relaxed text-sm group-hover:text-slate-300 transition-colors">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Team = () => {
  const members = [
    { 
      name: "Jenish Sapkota", 
      role: "Project Lead / Architect", 
      img: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=600&h=600&auto=format&fit=crop", 
      desc: "Lead boy with vision and strategy.",
      style: "Boy, back view, nature background",
      gender: "boy"
    },
    { 
      name: "Anup Ale", 
      role: "Hardware Lead", 
      img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600&h=600&auto=format&fit=crop", 
      desc: "Hardware genius designing the core skeleton.",
      style: "Boy, back view, nature background",
      gender: "boy"
    },
    { 
      name: "Obir Thapa Magar", 
      role: "Mechanical Specialist", 
      img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=300&h=300&auto=format&fit=crop",
      gender: "boy"
    },
    { 
      name: "Aaditya Acharya", 
      role: "Full Stack Dev", 
      img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=300&h=300&auto=format&fit=crop",
      gender: "boy"
    },
    { 
      name: "Kristina Shrestha", 
      role: "AI Software Lead", 
      img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&h=300&auto=format&fit=crop",
      gender: "girl"
    },
    { 
      name: "Anisha Baraili", 
      role: "UX & System Design", 
      img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&h=300&auto=format&fit=crop",
      gender: "girl"
    },
    { 
      name: "Rhythm Adhikari", 
      role: "Electronics Specialist", 
      img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=300&h=300&auto=format&fit=crop",
      gender: "girl"
    },
  ];

  return (
    <section id="team" className="py-24 bg-slate-950 relative overflow-hidden">
       <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-cyan-500/5 blur-[120px] rounded-full"></div>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em] mb-4">Our Team</h2>
          <h3 className="text-4xl md:text-6xl font-heading font-black text-white mb-8">The Architects of RoboDream</h3>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
            A diverse collective of young engineers and designers from Srijana Secondary School, united by a singular vision.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-6">
          {members.map((m, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="flex flex-col items-center group"
            >
              <div className="relative mb-6">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2rem] overflow-hidden border-2 border-white/10 group-hover:border-cyan-500 group-hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-all duration-500">
                  <img 
                    src={m.img} 
                    alt={m.name} 
                    className={`w-full h-full object-cover transition-all duration-700 ${m.style ? 'grayscale group-hover:grayscale-0' : 'grayscale group-hover:grayscale-0'}`}
                    title={m.style || m.name}
                  />
                  {m.style && (
                    <div className="absolute inset-0 bg-slate-950/20 group-hover:opacity-0 transition-opacity"></div>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 p-1.5 bg-slate-950 rounded-lg border border-white/10 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">
                  <Bot className="w-3.5 h-3.5 text-cyan-400" />
                </div>
              </div>
              <h4 className="text-sm font-black text-white mb-1 tracking-tight text-center leading-tight">{m.name}</h4>
              <p className="text-[8px] text-slate-500 font-bold uppercase tracking-[0.2em] text-center leading-tight">{m.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact = () => (
  <section id="contact" className="py-24 bg-slate-900/30 relative">
    <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
      <motion.div
         initial={{ opacity: 0, x: -30 }}
         whileInView={{ opacity: 1, x: 0 }}
         viewport={{ once: true }}
      >
        <h2 className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em] mb-4">Collaborate</h2>
        <h3 className="text-4xl md:text-6xl font-heading font-black text-white mb-10 leading-tight">Bring the Dream to Life.</h3>
        <p className="text-slate-400 mb-12 text-lg leading-relaxed">
          We are seeking partners, sponsors, and contributors to accelerate our phase-wise development. Reach out to the core team today.
        </p>

        <div className="space-y-8">
          <div className="flex items-start space-x-6 group">
            <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl group-hover:bg-cyan-500 group-hover:text-white transition-all">
              <Users className="w-6 h-6 text-cyan-400 group-hover:text-white" />
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Innovation Lead</div>
              <div className="text-xl font-bold text-white">ING Innovation Group</div>
              <p className="text-sm text-slate-500">Official Strategic Partner</p>
            </div>
          </div>
          <div className="flex items-start space-x-6 group">
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl group-hover:bg-blue-500 group-hover:text-white transition-all">
              <Globe className="w-6 h-6 text-blue-400 group-hover:text-white" />
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Primary Base</div>
              <div className="text-xl font-bold text-white">Srijana Secondary School</div>
              <p className="text-sm text-slate-500">Kaski, Nepal</p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass p-10 md:p-14 rounded-[3rem] border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.5)] relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[80px] rounded-full group-hover:bg-cyan-500/20 transition-all"></div>
        <form className="space-y-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Full Name</label>
              <input type="text" placeholder="John Doe" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-cyan-500 transition-all placeholder:text-slate-700" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Email Address</label>
              <input type="email" placeholder="john@example.com" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-cyan-500 transition-all placeholder:text-slate-700" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Inquiry Type</label>
            <select className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-cyan-500 transition-all text-slate-400">
              <option>Sponsorship / Funding</option>
              <option>Technical Collaboration</option>
              <option>Demo Request</option>
              <option>General Inquiry</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Project Interest</label>
            <textarea rows={4} placeholder="Tell us how you want to contribute to the dream..." className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-cyan-500 transition-all placeholder:text-slate-700"></textarea>
          </div>
          <button className="w-full py-5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-black rounded-2xl hover:scale-[1.02] transition-all flex items-center justify-center group shadow-2xl shadow-cyan-500/20 uppercase tracking-[0.2em] text-xs">
            Initiate Contact
            <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </button>
        </form>
      </motion.div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="py-16 bg-slate-950 border-t border-white/5">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-2">
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Bot className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tighter font-heading text-white uppercase">ROBODREAM</span>
          </div>
          <p className="text-slate-500 max-w-sm leading-relaxed mb-8">
            A high-performance humanoid robotics project from the hearts of Nepalese students. Engineering a bridge between human biology and machine intelligence.
          </p>
          <div className="flex space-x-5">
            <div className="p-3 bg-white/5 rounded-full hover:bg-white/10 cursor-pointer transition-colors text-slate-400 hover:text-white border border-white/10"><Github className="w-5 h-5" /></div>
            <div className="p-3 bg-white/5 rounded-full hover:bg-white/10 cursor-pointer transition-colors text-slate-400 hover:text-white border border-white/10"><Twitter className="w-5 h-5" /></div>
            <div className="p-3 bg-white/5 rounded-full hover:bg-white/10 cursor-pointer transition-colors text-slate-400 hover:text-white border border-white/10"><Linkedin className="w-5 h-5" /></div>
          </div>
        </div>
        <div>
          <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Platform</h4>
          <ul className="space-y-4 text-sm text-slate-500">
            <li><a href="#tech" className="hover:text-cyan-400 transition-colors">Technology Stack</a></li>
            <li><a href="#roadmap" className="hover:text-cyan-400 transition-colors">Public Roadmap</a></li>
            <li><a href="#demos" className="hover:text-cyan-400 transition-colors">Prototype Demos</a></li>
            <li><a href="#about" className="hover:text-cyan-400 transition-colors">Mission Vision</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Legal & Support</h4>
          <ul className="space-y-4 text-sm text-slate-500">
            <li><a href="#" className="hover:text-cyan-400 transition-colors">Research Papers</a></li>
            <li><a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-cyan-400 transition-colors">Terms of Use</a></li>
            <li><a href="#contact" className="hover:text-cyan-400 transition-colors">Contact Center</a></li>
          </ul>
        </div>
      </div>
      <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-slate-600 text-[10px] font-black uppercase tracking-widest">
          © 2024 RoboDream Foundation. Srijana Secondary School & ING Innovation.
        </div>
        <div className="flex space-x-8 text-[10px] font-black uppercase tracking-widest text-slate-600">
          <span className="hover:text-slate-400 cursor-pointer transition-colors">Innovation Hub Nepal</span>
          <span className="hover:text-slate-400 cursor-pointer transition-colors">Global AI Ethics</span>
        </div>
      </div>
    </div>
  </footer>
);

// --- Main App ---

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <div className={`${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-950'} min-h-screen transition-colors duration-300 selection:bg-cyan-500/30`}>
      <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} scrolled={scrolled} />
      
      <main>
        <Hero />
        
        <div className="bg-slate-900/40 border-y border-white/5 py-14 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-transparent to-slate-950 z-10"></div>
          <div className="flex space-x-16 animate-[marquee_30s_linear_infinite] whitespace-nowrap">
             {Array(10).fill(0).map((_, i) => (
               <span key={i} className="text-5xl md:text-7xl font-heading font-black opacity-10 uppercase tracking-tighter flex items-center">
                 <Bot className="inline-block mr-8 w-12 h-12" />
                 DREAM ROBO • NEURAL NETWORKS • KINEMATICS • SRIJANA SCHOOL • ING GROUP • 
               </span>
             ))}
          </div>
        </div>

        <Features />

        <section id="about" className="py-24 overflow-hidden bg-slate-950 relative">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="w-full aspect-square bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-[4rem] p-1 shadow-inner">
                <div className="w-full h-full glass rounded-[3.9rem] flex items-center justify-center p-16 overflow-hidden relative">
                  <img src="https://images.unsplash.com/photo-1535223289827-42f1e9919769?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover rounded-3xl opacity-40 mix-blend-overlay" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
                     <div className="p-4 bg-cyan-500 rounded-2xl mb-6 shadow-xl shadow-cyan-500/20">
                        <Zap className="w-10 h-10 text-white" />
                     </div>
                     <p className="text-3xl md:text-4xl font-heading font-black text-white leading-tight uppercase tracking-tighter">"Nepal's first step into the humanoid era."</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-20 h-20 bg-cyan-500/5 blur-3xl rounded-full"></div>
              <h2 className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em] mb-4">The Vision</h2>
              <h3 className="text-4xl md:text-6xl font-heading font-black text-white mb-10 leading-tight">More than Robotics.</h3>
              <div className="space-y-8 text-slate-400 leading-relaxed text-lg">
                <p>
                  RoboDream (DreamRobo) was born from a simple question: <em>"Can students from Nepal build the future?"</em> Our answer is a high-fidelity humanoid capable of complex analysis and physical interaction.
                </p>
                <p>
                  Through our partnership with <strong>ING Innovation Group</strong>, we merge academic curiosity with industrial engineering standards to build a modular platform that grows with every version.
                </p>
                <div className="grid grid-cols-2 gap-10 pt-10 border-t border-white/5">
                  <div className="group">
                    <div className="text-4xl md:text-5xl font-black text-white mb-2 group-hover:text-cyan-400 transition-colors tracking-tighter">100%</div>
                    <div className="text-[9px] uppercase tracking-[0.3em] font-black text-slate-600">Student Engineered</div>
                  </div>
                  <div className="group">
                    <div className="text-4xl md:text-5xl font-black text-white mb-2 group-hover:text-blue-400 transition-colors tracking-tighter">V0.1</div>
                    <div className="text-[9px] uppercase tracking-[0.3em] font-black text-slate-600">Active Stage</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <DemoSection />

        <Roadmap />
        
        <Team />
        
        <Contact />
      </main>

      <Footer />
      <AIChat />

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(6, 182, 212, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(6, 182, 212, 0.4);
        }
        .dark .glass {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .bg-grid-white {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='white' stroke-opacity='0.1'%3E%3Cpath d='M0 .5H31.5V32'/%3E%3C/svg%3E");
        }
      `}</style>
    </div>
  );
}
