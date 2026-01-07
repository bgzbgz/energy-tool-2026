import { cn } from '@/lib/utils';
import type { PillarName } from '@/lib/constants';

interface FastTrackCanvasProps {
  protocol: {
    audit: {
      sleep: { rating: number; habits: string };
      food: { rating: number; habits: string };
      movement: { rating: number; habits: string };
      brain: { rating: number; routines: string };
    };
    drains: {
      biggest_drain: string;
      impact: string;
      peak_times: string;
      crash_times: string;
    };
    protocols: {
      sleep_commitment: string;
      food_commitment: string;
      movement_commitment: string;
      brain_commitment: string;
    };
    first_win: {
      action: string;
      timeframe: string;
      accountability_partner: string;
    };
  };
  userName: string;
  companyId: string;
  companyName?: string;
  submittedAt: Date;
  isPrintView?: boolean;
}

const pillarLabels: Record<PillarName, string> = {
  sleep: 'Sleep',
  food: 'Food',
  movement: 'Movement',
  brain: 'Brain Use',
};

const pillarIcons: Record<PillarName, string> = {
  sleep: '😴',
  food: '🍎',
  movement: '🏃',
  brain: '🧠',
};

export function FastTrackCanvas({
  protocol,
  userName,
  companyId,
  companyName,
  submittedAt,
  isPrintView = false,
}: FastTrackCanvasProps) {
  const getRatingColor = (rating: number) => {
    if (rating <= 3) return 'bg-red-500';
    if (rating <= 7) return 'bg-ft-yellow';
    return 'bg-green-500';
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  return (
    <div className={cn('max-w-4xl mx-auto p-8 bg-ft-white', isPrintView && 'print:p-0')}>
      {/* Header */}
      <div className="text-center mb-8 print:mb-6">
        <h1 className="font-plaak font-bold text-4xl mb-2 print:text-3xl">
          ENERGY BODY & MIND PROTOCOL
        </h1>
        <p className="font-riforma text-lg text-ft-grey print:text-base">
          {userName} {companyName && `• ${companyName}`} • {formatDate(submittedAt)}
        </p>
      </div>

      {/* Pillar Ratings */}
      <div className="mb-8 print:mb-6">
        <h2 className="font-plaak font-bold text-2xl mb-4 print:text-xl">PILLAR RATINGS</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(['sleep', 'food', 'movement', 'brain'] as PillarName[]).map((pillar) => {
            const rating = protocol.audit[pillar].rating;
            return (
              <div key={pillar} className="border border-ft-border rounded-sm p-4 print:p-2">
                <div className="text-center">
                  <div className="text-2xl mb-2 print:text-xl">{pillarIcons[pillar]}</div>
                  <div className="font-monument text-xs text-ft-grey mb-2 uppercase">
                    {pillarLabels[pillar]}
                  </div>
                  <div className={cn('font-plaak font-bold text-3xl mb-2 print:text-2xl', getRatingColor(rating))}>
                    {rating}/10
                  </div>
                  <div className={cn('h-2 rounded-full', getRatingColor(rating))} style={{ width: `${(rating / 10) * 100}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Biggest Energy Drain */}
      <div className="mb-8 print:mb-6">
        <h2 className="font-plaak font-bold text-2xl mb-4 print:text-xl">BIGGEST ENERGY DRAIN</h2>
        <div className="bg-red-50 border-2 border-red-300 rounded-sm p-6 print:p-4">
          <p className="font-riforma text-base print:text-sm leading-relaxed">
            {protocol.drains.biggest_drain}
          </p>
          <div className="mt-4 pt-4 border-t border-red-200">
            <p className="font-monument text-xs text-red-700 uppercase mb-1">Impact</p>
            <p className="font-riforma text-sm text-red-900">{protocol.drains.impact}</p>
          </div>
        </div>
      </div>

      {/* Protocol Commitments */}
      <div className="mb-8 print:mb-6">
        <h2 className="font-plaak font-bold text-2xl mb-4 print:text-xl">PROTOCOL COMMITMENTS</h2>
        <div className="space-y-4 print:space-y-3">
          {(['sleep', 'food', 'movement', 'brain'] as PillarName[]).map((pillar) => {
            const commitment = protocol.protocols[`${pillar}_commitment` as keyof typeof protocol.protocols];
            return (
              <div key={pillar} className="bg-ft-black text-ft-white rounded-sm p-6 print:p-4">
                <div className="flex items-center gap-2 mb-3 print:mb-2">
                  <span className="text-xl print:text-lg">{pillarIcons[pillar]}</span>
                  <h3 className="font-plaak font-bold text-lg uppercase print:text-base">
                    {pillarLabels[pillar]}
                  </h3>
                </div>
                <p className="font-riforma text-sm leading-relaxed print:text-xs">
                  {commitment}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* First Win */}
      <div className="mb-8 print:mb-6">
        <h2 className="font-plaak font-bold text-2xl mb-4 print:text-xl">FIRST 24-HOUR WIN</h2>
        <div className="bg-ft-yellow border-2 border-ft-black rounded-sm p-6 print:p-4 print:bg-white print:border-black">
          <div className="flex items-center gap-2 mb-3 print:mb-2">
            <span className="text-2xl print:text-xl">🎯</span>
            <h3 className="font-plaak font-bold text-lg print:text-base">ACTION</h3>
          </div>
          <p className="font-riforma text-base mb-4 print:text-sm print:mb-2 leading-relaxed">
            {protocol.first_win.action}
          </p>
          <div className="border-t border-ft-black pt-4 print:pt-2">
            <p className="font-monument text-xs uppercase mb-1 print:text-xs">Timeframe</p>
            <p className="font-riforma text-sm mb-3 print:text-xs">{protocol.first_win.timeframe}</p>
            <p className="font-monument text-xs uppercase mb-1 print:text-xs">Accountability Partner</p>
            <p className="font-riforma text-sm print:text-xs">{protocol.first_win.accountability_partner}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pt-8 border-t border-ft-border print:pt-4">
        <p className="font-monument text-xs text-ft-grey">
          Fast Track Energy Body & Mind Tool • {companyId}
        </p>
      </div>
    </div>
  );
}

