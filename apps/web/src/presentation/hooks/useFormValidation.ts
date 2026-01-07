import { useState, useCallback } from 'react';
import { MIN_CHARS } from '@/lib/constants';

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  custom?: (value: string) => string | null;
}

interface ValidationRules {
  [key: string]: ValidationRule;
}

interface ValidationErrors {
  [key: string]: string | null;
}

export function useFormValidation(rules: ValidationRules) {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validate = useCallback((fieldName: string, value: string): boolean => {
    const rule = rules[fieldName];
    if (!rule) return true;

    let error: string | null = null;

    // Required check
    if (rule.required && (!value || value.trim().length === 0)) {
      error = 'This field is required';
    }
    // Min length check
    else if (rule.minLength && value.length < rule.minLength) {
      error = `Must be at least ${rule.minLength} characters`;
    }
    // Custom validation
    else if (rule.custom) {
      error = rule.custom(value);
    }

    setErrors(prev => ({ ...prev, [fieldName]: error }));
    return !error;
  }, [rules]);

  const validateAll = useCallback((values: Record<string, string>): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    Object.keys(rules).forEach(fieldName => {
      const value = values[fieldName] || '';
      const rule = rules[fieldName];
      
      if (!rule) return;
      
      let error: string | null = null;

      if (rule.required && (!value || value.trim().length === 0)) {
        error = 'This field is required';
        isValid = false;
      } else if (rule.minLength && value.length < rule.minLength) {
        error = `Must be at least ${rule.minLength} characters`;
        isValid = false;
      } else if (rule.custom) {
        error = rule.custom(value);
        if (error) isValid = false;
      }

      newErrors[fieldName] = error;
    });

    setErrors(newErrors);
    return isValid;
  }, [rules]);

  const clearError = useCallback((fieldName: string) => {
    setErrors(prev => ({ ...prev, [fieldName]: null }));
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    errors,
    validate,
    validateAll,
    clearError,
    clearAllErrors,
  };
}

