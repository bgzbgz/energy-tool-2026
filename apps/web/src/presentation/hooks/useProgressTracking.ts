import { useState, useMemo } from 'react';

interface UseProgressTrackingOptions {
  totalSections: number;
}

export function useProgressTracking({ totalSections }: UseProgressTrackingOptions) {
  const [completedSections, setCompletedSections] = useState<number[]>([]);

  const currentSection = useMemo(() => {
    if (completedSections.length === 0) return 1;
    const lastCompleted = completedSections[completedSections.length - 1];
    if (lastCompleted === undefined) return 1;
    return Math.min(lastCompleted + 1, totalSections);
  }, [completedSections, totalSections]);

  const percentage = useMemo(() => {
    return Math.round((completedSections.length / totalSections) * 100);
  }, [completedSections.length, totalSections]);

  const markSectionComplete = (sectionNumber: number) => {
    setCompletedSections(prev => {
      if (!prev.includes(sectionNumber)) {
        return [...prev, sectionNumber].sort((a, b) => a - b);
      }
      return prev;
    });
  };

  const isSectionComplete = (sectionNumber: number) => {
    return completedSections.includes(sectionNumber);
  };

  return {
    currentSection,
    completedSections,
    percentage,
    markSectionComplete,
    isSectionComplete,
  };
}

