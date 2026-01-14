import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Hero3D = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-96 h-96 rounded-full bg-blue-200/20 blur-3xl"
          style={{
            top: `${50 + mousePosition.y}%`,
            left: `${50 + mousePosition.x}%`,
            transform: 'translate(-50%, -50%)',
            transition: 'all 0.3s ease-out',
          }}
        />
        <div 
          className="absolute w-96 h-96 rounded-full bg-purple-200/20 blur-3xl"
          style={{
            top: `${30 - mousePosition.y}%`,
            right: `${20 - mousePosition.x}%`,
            transform: 'translate(50%, -50%)',
            transition: 'all 0.3s ease-out',
          }}
        />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
        style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className={`space-y-8 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/5 rounded-full backdrop-blur-sm border border-black/10">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">New Collection</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-brand-black leading-[0.95] tracking-tight">
                <span className="block">Create</span>
                <span className="block bg-gradient-to-r from-brand-blue to-purple-600 bg-clip-text text-transparent">
                  Your Style
                </span>
                <span className="block">In 3D</span>
              </h1>
              
              <p className="text-xl text-gray-600 max-w-lg leading-relaxed mt-6">
                Design custom apparel with powerful tools. 
                <span className="font-semibold text-brand-black"> See it. Customize it. Own it.</span>
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/designs">
                <button className="group relative px-8 py-4 bg-brand-black text-white rounded-full font-bold text-base hover:bg-gray-800 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl">
                  <span className="relative z-10">Start Designing</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-brand-blue to-purple-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                </button>
              </Link>
              <Link to="/shop">
                <button className="px-8 py-4 border-2 border-brand-black text-brand-black rounded-full font-bold text-base hover:bg-brand-black hover:text-white transition-all">
                  Explore Collection
                </button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-8 border-t border-gray-200">
              <div>
                <div className="text-3xl font-black text-brand-black">100+</div>
                <div className="text-sm text-gray-500 mt-1">Designs</div>
              </div>
              <div>
                <div className="text-3xl font-black text-brand-black">Custom</div>
                <div className="text-sm text-gray-500 mt-1">Designs</div>
              </div>
              <div>
                <div className="text-3xl font-black text-brand-black">3D</div>
                <div className="text-sm text-gray-500 mt-1">Preview</div>
              </div>
            </div>
          </div>

          {/* Right Image Panel - Cool Design */}
          <div className="relative h-[600px] lg:h-[700px] rounded-3xl overflow-hidden group">
            {/* Main Image Container */}
            <div className="absolute inset-0">
              <img 
                src="https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1200&q=80"
                alt="Fashion Design"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/10 via-transparent to-purple-600/10"></div>
            </div>

            {/* Floating Elements */}
            <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-xl border border-gray-200/50">
              <span className="text-xs font-bold text-brand-black uppercase tracking-wider">New Drop</span>
            </div>

            <div className="absolute bottom-8 left-8 right-8">
              <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-gray-200/50">
                <h3 className="text-2xl font-black text-brand-black mb-2">Premium Quality</h3>
                <p className="text-sm text-gray-600 mb-4">100% organic cotton. Sustainably sourced. Built to last.</p>
                <div className="flex gap-2">
                  <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-brand-blue to-purple-600 w-3/4"></div>
                  </div>
                  <span className="text-xs font-bold text-gray-500">75% Sold</span>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-white/20 rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-white/30 rounded-full"></div>
            
            {/* Animated Rings */}
            <div className="absolute top-1/4 right-1/4 w-20 h-20 border border-brand-blue/30 rounded-full animate-pulse"></div>
            <div className="absolute bottom-1/4 left-1/4 w-16 h-16 border border-purple-600/30 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2"></div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Hero3D;
