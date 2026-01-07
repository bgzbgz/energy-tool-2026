import { EnergySubmission } from '@/domain/entities/EnergySubmission';
import type { SubmissionRepository } from '@/application/ports/SubmissionRepository';
import type { EnergyToolData } from '@/lib/validation-schemas';
import { createSupabaseClient } from './client';

export class SupabaseSubmissionRepository implements SubmissionRepository {
  async save(submission: EnergySubmission): Promise<EnergySubmission> {
    const supabase = createSupabaseClient();

    const { data, error } = await supabase
      .from('energy_submissions')
      .insert({
        tool_name: submission.toolName,
        user_id: submission.userId,
        user_name: submission.userName,
        company_id: submission.companyId,
        company_name: submission.companyName,
        sprint_number: submission.sprintNumber || 'energy',
        tool_data: submission.toolData,
        status: submission.status,
        completion_percentage: submission.completionPercentage,
        submitted_at: submission.submittedAt.toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to save submission: ${error.message}`);
    }

    return this.mapToEntity(data);
  }

  async findByCompany(companyId: string, status: string = 'completed', limit: number = 100): Promise<EnergySubmission[]> {
    const supabase = createSupabaseClient();

    const { data, error } = await supabase
      .from('energy_submissions')
      .select('*')
      .eq('company_id', companyId)
      .eq('status', status)
      .order('submitted_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch submissions: ${error.message}`);
    }

    return data.map(row => this.mapToEntity(row));
  }

  async findById(id: string): Promise<EnergySubmission | null> {
    const supabase = createSupabaseClient();

    const { data, error } = await supabase
      .from('energy_submissions')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return null;
    }

    return this.mapToEntity(data);
  }

  private mapToEntity(row: any): EnergySubmission {
    return new EnergySubmission(
      row.id,
      row.tool_name,
      row.user_id,
      row.user_name,
      row.company_id,
      new Date(row.submitted_at),
      row.status,
      row.tool_data as EnergyToolData,
      row.company_name,
      row.sprint_number,
      row.completion_percentage
    );
  }
}

