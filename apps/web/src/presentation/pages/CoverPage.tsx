import React from 'react';
import { useNavigate } from 'react-router-dom';

export function CoverPage() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/audit');
  };

  const handleClearData = () => {
    if (
      window.confirm(
        '⚠️ This will delete all saved protocol data and start fresh. Are you sure?'
      )
    ) {
      localStorage.removeItem('energy_audit');
      localStorage.removeItem('energy_drains');
      localStorage.removeItem('energy_protocols');
      localStorage.removeItem('energy_first_win');
      localStorage.removeItem('energy_protocol');
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-ft-black text-white flex items-center justify-center relative">
      {/* Background Pattern (optional) */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(255,255,255,0.03) 50px, rgba(255,255,255,0.03) 51px)`,
        }} />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-8 max-w-4xl">
        {/* Logo */}
        <div className="mb-8 animate-fade-in">
          <img
            src="/images/FastTrack_F_White_logo.png"
            alt="Fast Track"
            className="h-16 mx-auto"
          />
        </div>

        {/* Title */}
        <h1
          className="font-plaak text-7xl md:text-9xl mb-6 animate-fade-in leading-none"
          style={{ animationDelay: '0.1s' }}
        >
          ENERGY BODY & MIND TOOL
        </h1>

        {/* Subtitle */}
        <p
          className="text-2xl md:text-3xl mb-12 font-riforma animate-fade-in"
          style={{ animationDelay: '0.2s' }}
        >
          Design your personal energy protocol in 15 minutes
        </p>

        {/* What You'll Get */}
        <div
          className="grid md:grid-cols-4 gap-6 mb-12 animate-fade-in"
          style={{ animationDelay: '0.3s' }}
        >
          <div className="border-2 border-white p-6">
            <div className="text-5xl font-plaak mb-2">01</div>
            <p className="text-lg font-riforma">Energy Audit</p>
            <p className="text-sm text-gray-400 mt-1">3 minutes</p>
          </div>
          <div className="border-2 border-white p-6">
            <div className="text-5xl font-plaak mb-2">02</div>
            <p className="text-lg font-riforma">Identify Drains</p>
            <p className="text-sm text-gray-400 mt-1">4 minutes</p>
          </div>
          <div className="border-2 border-white p-6">
            <div className="text-5xl font-plaak mb-2">03</div>
            <p className="text-lg font-riforma">Design Protocol</p>
            <p className="text-sm text-gray-400 mt-1">5 minutes</p>
          </div>
          <div className="border-2 border-white p-6">
            <div className="text-5xl font-plaak mb-2">04</div>
            <p className="text-lg font-riforma">First Win</p>
            <p className="text-sm text-gray-400 mt-1">3 minutes</p>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleStart}
          className="bg-ft-yellow text-ft-black font-plaak text-3xl px-16 py-6 hover:bg-ft-yellow-dark transition-all duration-200 transform hover:scale-105 mb-8 animate-fade-in"
          style={{ animationDelay: '0.4s' }}
        >
          START
        </button>

        {/* Clear Data Link */}
        <div className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <button
            onClick={handleClearData}
            className="text-gray-400 hover:text-white text-sm underline transition-colors font-riforma"
          >
            Clear Saved Data
          </button>
        </div>
      </div>

      {/* Animation CSS */}
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
          animation: fade-in 0.6s ease-out backwards;
        }
      `}</style>
    </div>
  );
}

