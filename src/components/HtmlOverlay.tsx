import { useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Globe2, Rocket, Shield, Star, Zap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function HtmlOverlay() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    // Animate sections on scroll
    const sections = gsap.utils.toArray('.animate-section');
    
    sections.forEach((section: any) => {
      gsap.fromTo(section, 
        { 
          opacity: 0, 
          y: 80,
          scale: 0.98,
          filter: 'blur(10px)'
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          duration: 1.5,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            end: 'bottom 15%',
            toggleActions: 'play reverse play reverse',
          }
        }
      );
    });

    // Parallax elements
    const parallaxElements = gsap.utils.toArray('.parallax');
    parallaxElements.forEach((el: any) => {
      const speed = el.dataset.speed || 1;
      gsap.to(el, {
        y: () => -150 * speed,
        ease: 'none',
        scrollTrigger: {
          trigger: el.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        }
      });
    });

    // Scroll progress bar
    gsap.to('.progress-bar', {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: '#scroll-container',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.1,
      }
    });

  }, { scope: containerRef });

  // Magnetic button effect
  useEffect(() => {
    const magneticElements = document.querySelectorAll('.magnetic');
    
    magneticElements.forEach((el) => {
      const htmlEl = el as HTMLElement;
      htmlEl.addEventListener('mousemove', (e) => {
        const rect = htmlEl.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        gsap.to(htmlEl, {
          x: x * 0.3,
          y: y * 0.3,
          duration: 0.4,
          ease: 'power2.out'
        });
      });
      
      htmlEl.addEventListener('mouseleave', () => {
        gsap.to(htmlEl, {
          x: 0,
          y: 0,
          duration: 0.7,
          ease: 'elastic.out(1, 0.3)'
        });
      });
    });
  }, []);

  return (
    <div ref={containerRef} id="scroll-container" className="relative z-10 w-full">
      {/* Global Scroll Progress Bar */}
      <div className="fixed top-0 left-0 h-1 bg-gradient-to-r from-neon-blue to-neon-purple origin-left scale-x-0 z-[100] w-full progress-bar"></div>
      
      {/* 1. HERO SECTION */}
      <section id="home" className="min-h-screen flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.05)_0%,transparent_50%)] pointer-events-none"></div>
        <div className="animate-section max-w-5xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8">
            <span className="w-2 h-2 rounded-full bg-neon-blue animate-pulse glow-box"></span>
            <span className="text-xs font-mono uppercase tracking-widest text-white/80">System Online</span>
          </div>
          <h1 className="font-display text-7xl md:text-[10rem] font-bold tracking-tighter mb-6 glow-text text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/30 leading-none">
            WHITE-SPACE
          </h1>
          <p className="text-xl md:text-3xl font-light text-starlight/70 max-w-2xl mx-auto mb-12 tracking-wide">
            Explore the Infinite Universe
          </p>
          <button 
            onClick={() => document.getElementById('mission')?.scrollIntoView({ behavior: 'smooth' })}
            className="magnetic group relative inline-flex items-center justify-center px-10 py-5 font-medium tracking-widest text-white uppercase transition-all duration-300 ease-out bg-transparent border border-neon-blue/50 rounded-full hover:bg-neon-blue/10 glow-box overflow-hidden"
          >
            <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-neon-blue"></span>
            <span className="absolute -inset-full w-[200%] h-[200%] bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-[shimmer_1.5s_infinite] rotate-45"></span>
            <span className="relative flex items-center gap-3">
              Begin Journey <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
            </span>
          </button>
        </div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-50">
          <span className="text-xs uppercase tracking-widest font-mono">Scroll to explore</span>
          <div className="w-[1px] h-16 bg-gradient-to-b from-white via-white/50 to-transparent animate-pulse"></div>
        </div>
      </section>

      {/* 2. ABOUT SPACE */}
      <section id="mission" className="min-h-screen flex items-center py-24 px-4 md:px-12 lg:px-24 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-neon-purple/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center w-full max-w-7xl mx-auto relative z-10">
          <div className="animate-section space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
              <Star className="w-4 h-4 text-neon-purple" />
              <span className="text-xs font-mono uppercase tracking-widest text-white/70">The Frontier</span>
            </div>
            <h2 className="font-display text-5xl md:text-7xl font-bold leading-tight">
              Beyond the <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple glow-text">
                Known Limits
              </span>
            </h2>
            <p className="text-lg text-white/60 leading-relaxed max-w-lg font-light">
              Journey through uncharted territories. Our advanced spatial mapping reveals the hidden structures of the cosmos, bringing distant galaxies within your reach.
            </p>
          </div>
          
          <div className="relative h-[600px] w-full flex items-center justify-center">
            {/* Glass cards floating */}
            <div className="parallax absolute top-10 right-10 glass-panel p-8 rounded-3xl w-72 transform rotate-6 hover:rotate-0 transition-transform duration-500" data-speed="2">
              <div className="w-12 h-12 rounded-full bg-neon-blue/20 flex items-center justify-center mb-6 border border-neon-blue/30 glow-box">
                <Globe2 className="text-neon-blue w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Exoplanets</h3>
              <p className="text-sm text-white/50 leading-relaxed">Discover habitable zones across millions of lightyears.</p>
            </div>
            
            <div className="parallax absolute bottom-20 left-0 glass-panel p-8 rounded-3xl w-80 transform -rotate-3 hover:rotate-0 transition-transform duration-500" data-speed="1.5">
              <div className="w-12 h-12 rounded-full bg-neon-purple/20 flex items-center justify-center mb-6 border border-neon-purple/30 glow-box">
                <Zap className="text-neon-purple w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Energy Signatures</h3>
              <p className="text-sm text-white/50 leading-relaxed">Track cosmic radiation and stellar phenomena in real-time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PLANET EXPLORATION */}
      <section id="discoveries" className="min-h-screen py-24 px-4 md:px-12 lg:px-24 flex flex-col justify-center relative">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-neon-blue/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="animate-section text-center mb-24">
            <h2 className="font-display text-4xl md:text-6xl font-bold mb-6">Planetary Systems</h2>
            <p className="text-white/60 max-w-2xl mx-auto font-light text-lg">Analyze atmospheric compositions and orbital mechanics of newly discovered celestial bodies.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Kepler-186f', type: 'Terrestrial', temp: '-85°C', status: 'Scanning', color: 'neon-blue' },
              { name: 'Gliese 581g', type: 'Super-Earth', temp: '-37°C', status: 'Analyzed', color: 'neon-purple' },
              { name: 'TRAPPIST-1e', type: 'Rocky', temp: '-22°C', status: 'Target Locked', color: 'white' }
            ].map((planet, i) => (
              <div key={i} className="animate-section glass-panel p-8 rounded-3xl hover:bg-white/5 transition-all duration-500 group cursor-pointer border-t border-white/10 hover:-translate-y-2">
                <div className="flex justify-between items-start mb-12">
                  <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-neon-blue transition-colors duration-500">
                    <span className="font-mono text-xs">0{i + 1}</span>
                  </div>
                  <span className={`text-xs font-mono text-${planet.color} uppercase tracking-widest`}>{planet.status}</span>
                </div>
                <h3 className="font-display text-3xl font-bold mb-4 group-hover:text-neon-blue transition-colors duration-300">{planet.name}</h3>
                <div className="flex justify-between text-sm text-white/50 font-mono pt-4 border-t border-white/10">
                  <span>{planet.type}</span>
                  <span>{planet.temp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SPACE TECHNOLOGY */}
      <section id="fleet" className="min-h-screen flex items-center py-24 px-4 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div className="order-2 lg:order-1 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-neon-blue/20 to-transparent rounded-full blur-[100px]"></div>
            <div className="animate-section grid grid-cols-2 gap-6 relative z-10">
              <div className="glass-panel p-8 rounded-3xl space-y-6 mt-12 hover:border-neon-blue/30 transition-colors">
                <Rocket className="w-10 h-10 text-white/80" />
                <h4 className="font-semibold text-lg">Propulsion</h4>
                <p className="text-sm text-white/50 leading-relaxed">Quantum vacuum plasma thrusters enabling near-light speed travel.</p>
              </div>
              <div className="glass-panel p-8 rounded-3xl space-y-6 hover:border-neon-purple/30 transition-colors">
                <Shield className="w-10 h-10 text-white/80" />
                <h4 className="font-semibold text-lg">Shielding</h4>
                <p className="text-sm text-white/50 leading-relaxed">Electromagnetic deflection fields for micro-meteoroid protection.</p>
              </div>
              <div className="glass-panel p-8 rounded-3xl space-y-6 col-span-2 hover:border-white/30 transition-colors">
                <div className="flex justify-between items-end mb-2">
                  <h4 className="font-semibold text-lg">System Integrity</h4>
                  <span className="text-xs font-mono text-neon-blue">100%</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden mb-4">
                  <div className="h-full bg-gradient-to-r from-neon-blue to-neon-purple w-full"></div>
                </div>
                <p className="text-sm text-white/50 font-mono">All systems nominal. Core temperature stable at 2.7K.</p>
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2 animate-section flex flex-col justify-center">
            <h2 className="font-display text-5xl md:text-7xl font-bold mb-8">Next-Gen <br/>Technology</h2>
            <p className="text-xl text-white/60 mb-12 font-light leading-relaxed">
              Equipped with state-of-the-art sensory arrays and quantum computing cores, our vessels are designed to withstand the harshest environments in the known universe.
            </p>
            <ul className="space-y-6 font-mono text-sm text-white/70">
              <li className="flex items-center gap-6 group">
                <span className="w-2 h-2 rounded-full bg-neon-blue glow-box group-hover:scale-150 transition-transform"></span>
                <span className="group-hover:text-white transition-colors">FTL Communication Array</span>
              </li>
              <li className="flex items-center gap-6 group">
                <span className="w-2 h-2 rounded-full bg-neon-purple glow-box group-hover:scale-150 transition-transform"></span>
                <span className="group-hover:text-white transition-colors">Dark Matter Harvesting</span>
              </li>
              <li className="flex items-center gap-6 group">
                <span className="w-2 h-2 rounded-full bg-white glow-box group-hover:scale-150 transition-transform"></span>
                <span className="group-hover:text-white transition-colors">AI-Assisted Navigation</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 5. GALAXY SECTION */}
      <section className="min-h-screen flex items-center justify-center py-24 px-4 text-center relative">
        <div className="animate-section max-w-4xl mx-auto z-10">
          <h2 className="font-display text-6xl md:text-9xl font-bold mb-8 tracking-tighter">
            The Great <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neon-blue to-neon-purple glow-text">
              Expanse
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-white/60 max-w-2xl mx-auto font-light leading-relaxed">
            Witness the birth of stars and the collision of galaxies. The universe is not silent; it is a symphony of cosmic events waiting to be observed.
          </p>
        </div>
      </section>

      {/* 6. FINAL CTA */}
      <section id="join" className="min-h-screen flex flex-col items-center justify-center py-24 px-4 text-center relative border-t border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(0,240,255,0.1)_0%,transparent_50%)]"></div>
        <div className="animate-section max-w-3xl mx-auto z-10 space-y-12">
          <h2 className="font-display text-6xl md:text-8xl font-bold">
            Ready to Launch?
          </h2>
          <p className="text-xl md:text-2xl text-white/60 font-light">
            Join the elite group of explorers charting the unknown. Your journey begins here.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
            <button 
              onClick={() => document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' })}
              className="magnetic z-20 relative px-12 py-6 font-bold tracking-widest text-space-900 uppercase bg-white rounded-full hover:scale-105 transition-transform duration-300 glow-box"
            >
              Back to Start
            </button>
            <button 
              onClick={() => document.getElementById('fleet')?.scrollIntoView({ behavior: 'smooth' })}
              className="magnetic z-20 relative px-12 py-6 font-bold tracking-widest text-white uppercase border border-white/20 rounded-full hover:bg-white/5 transition-colors duration-300"
            >
              View Fleet Specifications
            </button>
          </div>
        </div>
        
        <footer className="absolute bottom-8 left-0 w-full text-center text-xs font-mono text-white/30 uppercase tracking-widest">
          © 2025-2026 WHITE-SPACE EXPLORATION INITIATIVE. ALL RIGHTS RESERVED.
        </footer>
      </section>

    </div>
  );
}
