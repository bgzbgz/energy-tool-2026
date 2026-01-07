import type { VercelRequest, VercelResponse } from '@vercel/node';
import { SubmissionRequestSchema } from '../../src/lib/validation-schemas';
import { createServerSupabaseClient } from '../_lib/db';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  try {
    // Validate request body
    const validationResult = SubmissionRequestSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validationResult.error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message
        }))
      });
    }

    const { userId, userName, companyId, companyName, sprintNumber, toolData } = validationResult.data;

    // Create Supabase client with service role key (server-side only)
    const supabase = createServerSupabaseClient();

    // Insert submission
    const { data, error } = await supabase
      .from('energy_submissions')
      .insert({
        tool_name: 'energy_body_mind',
        user_id: userId,
        user_name: userName,
        company_id: companyId,
        company_name: companyName,
        sprint_number: sprintNumber || 'energy',
        tool_data: toolData,
        status: 'completed',
        completion_percentage: 100,
        submitted_at: new Date().toISOString(),
      })
      .select('id')
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to save submission. Please try again.'
      });
    }

    return res.status(200).json({
      success: true,
      id: data.id,
      message: 'Protocol submitted successfully'
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({
      success: false,
      error: 'An unexpected error occurred'
    });
  }
}

