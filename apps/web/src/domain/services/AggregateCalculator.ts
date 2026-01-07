import type { EnergySubmission } from '../entities/EnergySubmission';
import type { PillarName } from '@/lib/constants';

export class AggregateCalculator {
  static calculatePillarAverages(
    submissions: EnergySubmission[]
  ): Record<PillarName, number> {
    if (submissions.length === 0) {
      return { sleep: 0, food: 0, movement: 0, brain: 0 };
    }

    const totals = { sleep: 0, food: 0, movement: 0, brain: 0 };

    submissions.forEach(sub => {
      totals.sleep += sub.toolData.audit.sleep.rating;
      totals.food += sub.toolData.audit.food.rating;
      totals.movement += sub.toolData.audit.movement.rating;
      totals.brain += sub.toolData.audit.brain.rating;
    });

    const count = submissions.length;

    return {
      sleep: Math.round((totals.sleep / count) * 10) / 10,
      food: Math.round((totals.food / count) * 10) / 10,
      movement: Math.round((totals.movement / count) * 10) / 10,
      brain: Math.round((totals.brain / count) * 10) / 10,
    };
  }

  static findCommonDrains(
    submissions: EnergySubmission[]
  ): Array<{ drain: string; count: number }> {
    const drainCounts = new Map<string, number>();

    submissions.forEach(sub => {
      const drain = sub.toolData.drains.biggest_drain
        .toLowerCase()
        .trim()
        .slice(0, 100); // Normalize

      drainCounts.set(drain, (drainCounts.get(drain) || 0) + 1);
    });

    return Array.from(drainCounts.entries())
      .map(([drain, count]) => ({ drain, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5 common drains
  }

  static calculateCompletionRate(submissions: EnergySubmission[]): number {
    if (submissions.length === 0) return 0;

    const completed = submissions.filter(
      sub => sub.status === 'completed' && sub.completionPercentage === 100
    ).length;

    return Math.round((completed / submissions.length) * 100);
  }
}

