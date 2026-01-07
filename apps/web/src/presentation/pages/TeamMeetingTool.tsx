import { useState } from 'react';
import { useGetSubmissions } from '../hooks/useSubmissions';
import { AggregateCalculator } from '@/domain/services/AggregateCalculator';
import { EnergySubmission } from '@/domain/entities/EnergySubmission';
import type { PillarName } from '@/lib/constants';
import type { Submission } from '../hooks/useSubmissions';

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

export function TeamMeetingTool() {
  const [companyId, setCompanyId] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());

  const { data, isLoading, error, refetch } = useGetSubmissions(companyId, companyId.length > 0);

  const handleSearch = () => {
    if (companyId.trim()) {
      refetch();
      setSelectedUserIds(new Set()); // Reset selection
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUserIds(prev => {
      const next = new Set(prev);
      if (next.has(userId)) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      return next;
    });
  };

  const selectAll = () => {
    if (submissions.length === 0) return;
    setSelectedUserIds(new Set(submissions.map(s => s.userId)));
  };

  const clearSelection = () => {
    setSelectedUserIds(new Set());
  };

  // Convert API submissions to EnergySubmission entities
  const submissions: EnergySubmission[] = data?.submissions?.map((sub: Submission) => {
    const brainHabits = sub.tool_data.audit.brain.routines || sub.tool_data.audit.brain.habits || '';
    
    return new EnergySubmission(
      sub.id,
      sub.tool_name,
      sub.user_id,
      sub.user_name,
      sub.company_id,
      new Date(sub.submitted_at),
      sub.status as 'completed' | 'draft' | 'deleted',
      {
        audit: {
          sleep: { rating: sub.tool_data.audit.sleep.rating, habits: sub.tool_data.audit.sleep.habits },
          food: { rating: sub.tool_data.audit.food.rating, habits: sub.tool_data.audit.food.habits },
          movement: { rating: sub.tool_data.audit.movement.rating, habits: sub.tool_data.audit.movement.habits },
          brain: { rating: sub.tool_data.audit.brain.rating, habits: brainHabits, routines: brainHabits },
        },
        drains: sub.tool_data.drains,
        protocols: sub.tool_data.protocols,
        first_win: sub.tool_data.first_win,
      },
      sub.company_name,
      undefined,
      sub.completion_percentage
    );
  }) || [];

  const selectedSubmissions = submissions.filter(s => selectedUserIds.has(s.userId));

  // Calculate team averages for selected members
  const teamAverages = AggregateCalculator.calculatePillarAverages(selectedSubmissions);
  const teamCommonDrains = AggregateCalculator.findCommonDrains(selectedSubmissions);

  // Find patterns
  const findTeamPatterns = () => {
    if (selectedSubmissions.length < 2) return null;

    const patterns = {
      lowestPillar: null as PillarName | null,
      highestPillar: null as PillarName | null,
      sharedDrains: [] as string[],
      sharedCommitments: [] as { pillar: PillarName; count: number }[],
    };

    // Find lowest and highest average pillars
    let minAvg = Infinity;
    let maxAvg = -Infinity;
    (['sleep', 'food', 'movement', 'brain'] as PillarName[]).forEach(pillar => {
      const avg = teamAverages[pillar];
      if (avg < minAvg) {
        minAvg = avg;
        patterns.lowestPillar = pillar;
      }
      if (avg > maxAvg) {
        maxAvg = avg;
        patterns.highestPillar = pillar;
      }
    });

    // Find shared drains (appearing in 2+ protocols)
    const drainCounts = new Map<string, number>();
    selectedSubmissions.forEach(sub => {
      const drain = sub.toolData.drains.biggest_drain.toLowerCase().trim().slice(0, 100);
      drainCounts.set(drain, (drainCounts.get(drain) || 0) + 1);
    });
    patterns.sharedDrains = Array.from(drainCounts.entries())
      .filter(([_, count]) => count >= 2)
      .map(([drain]) => drain)
      .slice(0, 3);

    return patterns;
  };

  const patterns = findTeamPatterns();

  const getRatingColor = (rating: number) => {
    if (rating <= 3) return 'bg-red-500';
    if (rating <= 7) return 'bg-ft-yellow';
    return 'bg-green-500';
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-ft-white">
      {/* Header */}
      <div className="bg-ft-black text-ft-white py-6 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-plaak font-bold text-3xl uppercase mb-2">Team Meeting Tool</h1>
          <p className="font-riforma text-ft-grey">Compare team members' energy protocols side-by-side</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Company Filter */}
        <div className="bg-gray-50 border border-ft-border rounded-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="company-id" className="block font-monument text-xs uppercase mb-2">
                Company ID
              </label>
              <input
                id="company-id"
                type="text"
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full p-3 border border-ft-border rounded-sm font-riforma focus:outline-none focus:ring-2 focus:ring-ft-yellow"
                placeholder="Enter company ID (e.g., acme-corp)"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                disabled={!companyId.trim() || isLoading}
                className={`px-8 py-3 font-plaak font-bold uppercase rounded-sm transition-colors ${
                  !companyId.trim() || isLoading
                    ? 'bg-ft-grey text-ft-black cursor-not-allowed'
                    : 'bg-ft-yellow text-ft-black hover:bg-ft-yellow-dark transition-colors duration-fast'
                }`}
              >
                {isLoading ? 'Loading...' : 'Load Team'}
              </button>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-sm p-4 mb-8">
            <p className="text-red-700 font-riforma">
              {error.message || 'Failed to load submissions. Please try again.'}
            </p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && companyId && data && data.count === 0 && (
          <div className="text-center py-12">
            <p className="font-riforma text-lg text-ft-grey">
              No submissions found for company ID: <strong>{companyId}</strong>
            </p>
          </div>
        )}

        {/* Team Selection */}
        {!isLoading && !error && submissions.length > 0 && (
          <div className="bg-white border border-ft-border rounded-sm p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-plaak font-bold text-xl uppercase">
                Select Team Members ({selectedUserIds.size} selected)
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={selectAll}
                  className="px-4 py-2 bg-ft-black text-ft-white font-plaak font-bold text-sm uppercase rounded-sm hover:bg-ft-grey transition-colors"
                >
                  Select All
                </button>
                <button
                  onClick={clearSelection}
                  className="px-4 py-2 bg-gray-200 text-ft-black font-plaak font-bold text-sm uppercase rounded-sm hover:bg-gray-300 transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {submissions.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => toggleUserSelection(sub.userId)}
                  className={`p-4 border-2 rounded-sm text-left transition-colors ${
                    selectedUserIds.has(sub.userId)
                      ? 'border-ft-black bg-ft-yellow'
                      : 'border-ft-border hover:border-ft-grey'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      checked={selectedUserIds.has(sub.userId)}
                      onChange={() => {}}
                      className="w-4 h-4"
                    />
                    <span className="font-plaak font-bold">{sub.userName}</span>
                  </div>
                  <div className="flex gap-2 text-xs">
                    {(['sleep', 'food', 'movement', 'brain'] as PillarName[]).map((pillar) => (
                      <div key={pillar} className="text-center">
                        <div>{pillarIcons[pillar]}</div>
                        <div className={`font-plaak font-bold ${getRatingColor(sub.toolData.audit[pillar].rating)}`}>
                          {sub.toolData.audit[pillar].rating}
                        </div>
                      </div>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Team Comparison */}
        {selectedSubmissions.length > 0 && (
          <>
            {/* Team Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Team Averages */}
              <div className="bg-white border border-ft-border rounded-sm p-6">
                <h2 className="font-plaak font-bold text-xl mb-4 uppercase">Team Average Ratings</h2>
                <div className="grid grid-cols-2 gap-4">
                  {(['sleep', 'food', 'movement', 'brain'] as PillarName[]).map((pillar) => (
                    <div key={pillar} className="text-center">
                      <div className="text-2xl mb-1">{pillarIcons[pillar]}</div>
                      <div className="font-monument text-xs text-ft-grey uppercase mb-1">
                        {pillarLabels[pillar]}
                      </div>
                      <div className={`font-plaak font-bold text-2xl ${getRatingColor(teamAverages[pillar])}`}>
                        {teamAverages[pillar].toFixed(1)}/10
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Team Patterns */}
              {patterns && (
                <div className="bg-white border border-ft-border rounded-sm p-6">
                  <h2 className="font-plaak font-bold text-xl mb-4 uppercase">Team Patterns</h2>
                  <div className="space-y-3">
                    {patterns.lowestPillar && (
                      <div>
                        <p className="font-monument text-xs uppercase text-ft-grey mb-1">Lowest Average</p>
                        <p className="font-riforma text-sm">
                          {pillarIcons[patterns.lowestPillar]} {pillarLabels[patterns.lowestPillar]} ({teamAverages[patterns.lowestPillar].toFixed(1)}/10)
                        </p>
                      </div>
                    )}
                    {patterns.highestPillar && (
                      <div>
                        <p className="font-monument text-xs uppercase text-ft-grey mb-1">Highest Average</p>
                        <p className="font-riforma text-sm">
                          {pillarIcons[patterns.highestPillar]} {pillarLabels[patterns.highestPillar]} ({teamAverages[patterns.highestPillar].toFixed(1)}/10)
                        </p>
                      </div>
                    )}
                    {patterns.sharedDrains.length > 0 && (
                      <div>
                        <p className="font-monument text-xs uppercase text-ft-grey mb-1">Shared Energy Drains</p>
                        <ul className="list-disc list-inside font-riforma text-sm space-y-1">
                          {patterns.sharedDrains.map((drain, i) => (
                            <li key={i}>{drain}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Side-by-Side Comparison */}
            <div className="bg-white border border-ft-border rounded-sm p-6">
              <h2 className="font-plaak font-bold text-xl mb-4 uppercase">
                Side-by-Side Comparison ({selectedSubmissions.length} members)
              </h2>
              <div className="overflow-x-auto">
                <div className="min-w-full" style={{ minWidth: `${selectedSubmissions.length * 300}px` }}>
                  <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${selectedSubmissions.length}, minmax(280px, 1fr))` }}>
                    {selectedSubmissions.map((sub) => (
                      <div key={sub.id} className="border border-ft-border rounded-sm p-4">
                        <h3 className="font-plaak font-bold text-lg mb-2">{sub.userName}</h3>
                        <p className="font-riforma text-xs text-ft-grey mb-4">{formatDate(sub.submittedAt)}</p>

                        {/* Pillar Ratings */}
                        <div className="mb-4">
                          <h4 className="font-monument text-xs uppercase text-ft-grey mb-2">Ratings</h4>
                          <div className="space-y-2">
                            {(['sleep', 'food', 'movement', 'brain'] as PillarName[]).map((pillar) => (
                              <div key={pillar} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span>{pillarIcons[pillar]}</span>
                                  <span className="font-monument text-xs uppercase">{pillarLabels[pillar]}</span>
                                </div>
                                <div className={`font-plaak font-bold ${getRatingColor(sub.toolData.audit[pillar].rating)}`}>
                                  {sub.toolData.audit[pillar].rating}/10
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Biggest Drain */}
                        <div className="mb-4">
                          <h4 className="font-monument text-xs uppercase text-ft-grey mb-1">Biggest Drain</h4>
                          <p className="font-riforma text-xs">{sub.toolData.drains.biggest_drain.slice(0, 100)}...</p>
                        </div>

                        {/* First Win */}
                        <div className="bg-ft-yellow p-3 rounded-sm">
                          <h4 className="font-plaak font-bold text-xs uppercase mb-1">First Win</h4>
                          <p className="font-riforma text-xs">{sub.toolData.first_win.action.slice(0, 80)}...</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* No Selection Message */}
        {!isLoading && !error && submissions.length > 0 && selectedSubmissions.length === 0 && (
          <div className="text-center py-12 bg-gray-50 border border-ft-border rounded-sm">
            <p className="font-riforma text-lg text-ft-grey">
              Select team members above to compare their protocols
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

