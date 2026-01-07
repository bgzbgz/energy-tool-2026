import { SpecificityValidator } from '@/domain/services/SpecificityValidator';
import type { SpecificityResult } from '@/domain/services/SpecificityValidator';

export function useSpecificityCheck() {
  const check = (text: string): SpecificityResult => {
    return SpecificityValidator.validate(text);
  };

  return { check };
}

