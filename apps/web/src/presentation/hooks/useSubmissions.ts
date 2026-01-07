import { useMutation, useQuery } from '@tanstack/react-query';
import { apiClient } from '@/infrastructure/api/client';
import type { SubmissionRequest } from '@/lib/validation-schemas';

interface SubmitResponse {
  success: boolean;
  id?: string;
  message?: string;
  error?: string;
}

export interface Submission {
  id: string;
  tool_name: string;
  user_id: string;
  user_name: string;
  company_id: string;
  company_name?: string;
  submitted_at: string;
  status: string;
  completion_percentage: number;
  tool_data: {
    audit: {
      sleep: { rating: number; habits: string };
      food: { rating: number; habits: string };
      movement: { rating: number; habits: string };
      brain: { rating: number; routines: string; habits?: string };
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
}

interface ListResponse {
  success: boolean;
  count: number;
  submissions: Submission[];
  message?: string;
  error?: string;
}

export function useSubmitProtocol() {
  return useMutation<SubmitResponse, Error, SubmissionRequest>({
    mutationFn: async (data: SubmissionRequest) => {
      return await apiClient.post<SubmitResponse>('/api/submissions/submit', data);
    },
  });
}

export function useGetSubmissions(companyId: string, enabled: boolean = true) {
  return useQuery<ListResponse, Error>({
    queryKey: ['submissions', companyId],
    queryFn: async () => {
      return await apiClient.get<ListResponse>(`/api/submissions/list?companyId=${encodeURIComponent(companyId)}`);
    },
    enabled: enabled && companyId.length > 0,
    staleTime: 30000, // 30 seconds
  });
}

