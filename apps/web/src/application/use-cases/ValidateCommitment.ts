import { SpecificityValidator } from '@/domain/services/SpecificityValidator';
import type { SpecificityResult } from '@/domain/services/SpecificityValidator';

export class ValidateCommitment {
  execute(commitment: string): SpecificityResult {
    return SpecificityValidator.validate(commitment);
  }
}

