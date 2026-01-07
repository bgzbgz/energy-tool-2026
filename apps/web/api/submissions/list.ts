import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { createServerSupabaseClient } from '../_lib/db';

const ListQuerySchema = z.object({
  companyId: z.string().min(1).max(50),
  status: z.enum(['completed', 'draft', 'deleted']).optional().default('completed'),
  limit: z.coerce.number().int().min(1).max(500).optional().default(100),
});

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  try {
    // Validate query parameters
    const validationResult = ListQuerySchema.safeParse(req.query);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: validationResult.error.issues[0]?.message || 'Invalid query parameters'
      });
    }

    const { companyId, status, limit } = validationResult.data;

    // Create Supabase client with service role key (server-side only)
    const supabase = createServerSupabaseClient();

    // Fetch submissions
    const { data, error } = await supabase
      .from('energy_submissions')
      .select('*')
      .eq('company_id', companyId)
      .eq('status', status)
      .order('submitted_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch submissions. Please try again.'
      });
    }

    // Return results (even if empty array)
    return res.status(200).json({
      success: true,
      count: data.length,
      submissions: data,
      ...(data.length === 0 && { message: 'No submissions found for this company' })
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({
      success: false,
      error: 'An unexpected error occurred'
    });
  }
}

