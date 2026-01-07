import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useSpecificityCheck } from '../../hooks/useSpecificityCheck';

interface CommitmentInputProps {
  value: string;
  onChange: (value: string) => void;
  minLength: number;
  placeholder?: string;
  label: string;
  id: string;
  className?: string;
}

export function CommitmentInput({
  value,
  onChange,
  minLength,
  placeholder,
  label,
  id,
  className,
}: CommitmentInputProps) {
  const { check } = useSpecificityCheck();
  const [specificityResult, setSpecificityResult] = useState<{ isSpecific: boolean; feedback?: string } | null>(null);
  const [hasBlurred, setHasBlurred] = useState(false);

  useEffect(() => {
    if (value.length >= minLength) {
      const result = check(value);
      setSpecificityResult(result);
    } else {
      setSpecificityResult(null);
    }
  }, [value, minLength, check]);

  const showError = hasBlurred && value.length >= minLength && specificityResult && !specificityResult.isSpecific;
  const showSuccess = value.length >= minLength && specificityResult && specificityResult.isSpecific;

  return (
    <div className={cn('space-y-2', className)}>
      <label htmlFor={id} className="block font-monument text-sm font-medium">
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setHasBlurred(true)}
        placeholder={placeholder}
        className={cn(
          'w-full min-h-[120px] p-4 border rounded-sm font-riforma transition-colors focus:outline-none focus:ring-2',
          showError
            ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
            : showSuccess
            ? 'border-green-500 focus:border-green-500 focus:ring-green-200'
            : value.length === 0
            ? 'border-ft-border focus:border-ft-black focus:ring-ft-yellow'
            : 'border-ft-border focus:border-ft-black focus:ring-ft-yellow'
        )}
      />
      
      {/* Character Counter */}
      <div className="flex items-center justify-between">
        <p className={cn(
          'text-xs font-monument',
          value.length < minLength ? 'text-ft-grey' : 'text-ft-black'
        )}>
          {value.length}/{minLength} characters
        </p>
        {showSuccess && (
          <span className="text-xs font-monument text-green-500 flex items-center gap-1">
            ✓ Specific
          </span>
        )}
      </div>

      {/* Vague Language Feedback */}
      {showError && specificityResult?.feedback && (
        <div className="bg-red-50 border border-red-200 rounded-sm p-3">
          <p className="text-sm font-riforma text-red-700">
            {specificityResult.feedback}
          </p>
        </div>
      )}
    </div>
  );
}

