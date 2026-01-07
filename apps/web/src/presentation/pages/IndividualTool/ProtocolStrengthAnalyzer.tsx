import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SpecificityValidator } from '../../../domain/services/SpecificityValidator';

interface CompleteProtocol {
  audit: any;
  drains: any[];
  protocols: any;
  firstWin: any;
}

export function ProtocolStrengthAnalyzer() {
  const navigate = useNavigate();
  const [protocol, setProtocol] = useState<CompleteProtocol | null>(null);
  const [scores, setScores] = useState({
    drainScore: 0,
    protocolScore: 0,
    overallScore: 0,
  });

  useEffect(() => {
    // Load protocol data
    const audit = JSON.parse(localStorage.getItem('energy_audit') || '{}');
    const drains = JSON.parse(localStorage.getItem('energy_drains') || '[]');
    const protocols = JSON.parse(localStorage.getItem('energy_protocols') || '{}');
    const firstWin = JSON.parse(localStorage.getItem('energy_first_win') || '{}');

    const protocolData: CompleteProtocol = { audit, drains, protocols, firstWin };
    setProtocol(protocolData);

    // Calculate scores
    const drainScore = calculateDrainSpecificity(drains);
    const protocolScore = calculateProtocolClarity(protocols);
    const overallScore = Math.round((drainScore + protocolScore) / 2);

    setScores({ drainScore, protocolScore, overallScore });
  }, []);

  const calculateDrainSpecificity = (drains: any[]): number => {
    if (!drains || drains.length === 0) return 0;

    let totalScore = 0;

    drains.forEach((drain) => {
      const result = SpecificityValidator.validate(drain.description || '');
      // Score: 100 if specific, 50 if not
      const score = result.isSpecific ? 100 : 50;
      totalScore += score;
    });

    return Math.round(totalScore / drains.length);
  };

  const calculateProtocolClarity = (protocols: any): number => {
    if (!protocols) return 0;

    const protocolTexts = [
      protocols.sleep || '',
      protocols.food || '',
      protocols.movement || '',
      protocols.brain || '',
    ];

    let totalScore = 0;
    let count = 0;

    protocolTexts.forEach((text) => {
      if (text.length > 0) {
        const result = SpecificityValidator.validate(text);
        const score = result.isSpecific ? 100 : 50;
        totalScore += score;
        count++;
      }
    });

    return count > 0 ? Math.round(totalScore / count) : 0;
  };

  const getOverallLabel = (score: number): { label: string; color: string } => {
    if (score >= 80) return { label: '🔥 CATEGORY-DEFINING', color: '#10B981' };
    if (score >= 65) return { label: '✓ BOLD', color: '#10B981' };
    if (score >= 50) return { label: '⚠️ GETTING THERE', color: '#F59E0B' };
    return { label: '❌ NEEDS WORK', color: '#EF4444' };
  };

  const getSuggestions = (): string[] => {
    const suggestions: string[] = [];

    if (scores.drainScore < 60) {
      suggestions.push('Make your energy drains more specific - add exact times, quantities, or situations');
    }
    if (scores.protocolScore < 60) {
      suggestions.push('Add specific details to your protocols - include when, where, and how much');
    }
    if (scores.overallScore < 70) {
      suggestions.push('Replace vague words like "better", "more", "try" with concrete actions and numbers');
    }

    return suggestions;
  };

  const overall = getOverallLabel(scores.overallScore);
  const suggestions = getSuggestions();

  return (
    <div className="min-h-screen bg-ft-black text-white p-8 md:p-16">
      <div className="max-w-5xl mx-auto">
        <h1
          className="font-plaak text-6xl md:text-8xl mb-12 text-center text-ft-yellow animate-fade-in"
        >
          PROTOCOL STRENGTH ANALYSIS
        </h1>

        {/* Score Grid */}
        <div
          className="bg-white text-ft-black border-8 border-white p-8 md:p-12 mb-12 animate-fade-in"
          style={{ animationDelay: '0.2s' }}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="text-sm mb-2 text-gray-600 font-monument uppercase">Drain Clarity</div>
              <div className="font-plaak text-5xl" style={{ color: scores.drainScore >= 60 ? '#10B981' : '#F59E0B' }}>
                {scores.drainScore}%
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm mb-2 text-gray-600 font-monument uppercase">Protocol Specificity</div>
              <div className="font-plaak text-5xl" style={{ color: scores.protocolScore >= 60 ? '#10B981' : '#F59E0B' }}>
                {scores.protocolScore}%
              </div>
            </div>
            <div className="text-center col-span-2 md:col-span-1">
              <div className="text-sm mb-2 text-gray-600 font-monument uppercase">Ambition Level</div>
              <div className="font-plaak text-5xl" style={{ color: '#10B981' }}>
                {protocol?.audit ? Math.round((protocol.audit.sleep + protocol.audit.food + protocol.audit.movement + protocol.audit.brain) / 4) : 0}/10
              </div>
            </div>
          </div>

          {/* Overall Score */}
          <div className="border-t-4 border-ft-black pt-8 mb-8">
            <div className="text-center">
              <div className="text-sm mb-2 text-gray-600 font-monument uppercase">OVERALL PROTOCOL STRENGTH</div>
              <div className="font-plaak text-5xl md:text-7xl mb-4" style={{ color: overall.color }}>
                {overall.label}
              </div>
              <div className="h-8 bg-gray-200 rounded max-w-md mx-auto overflow-hidden">
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${scores.overallScore}%`,
                    background: 'linear-gradient(to right, #EF4444, #F59E0B, #10B981)',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="bg-gray-100 border-l-4 border-ft-black p-6">
              <p className="font-bold mb-3 font-riforma">💡 SUGGESTIONS TO STRENGTHEN YOUR PROTOCOL</p>
              <ul className="space-y-2 font-riforma">
                {suggestions.map((s, i) => (
                  <li key={i}>• {s}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <button
            onClick={() => navigate('/first-win')}
            className="bg-white text-ft-black font-riforma text-lg py-3 px-6 hover:bg-gray-200 transition-colors"
          >
            ← Improve Protocol
          </button>
          <button
            onClick={() => navigate('/canvas')}
            className="flex-1 bg-ft-yellow text-ft-black font-plaak text-xl py-4 px-8 hover:bg-ft-yellow-dark transition-colors"
          >
            Continue to Protocol Canvas →
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

