// Database types (generated from Supabase)
// These types match the energy_submissions table structure

export interface Database {
  public: {
    Tables: {
      energy_submissions: {
        Row: {
          id: string;
          tool_name: string;
          user_id: string;
          user_name: string;
          company_id: string;
          company_name: string | null;
          sprint_number: string;
          submitted_at: string;
          status: string;
          completion_percentage: number;
          tool_data: Record<string, unknown>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tool_name?: string;
          user_id: string;
          user_name: string;
          company_id: string;
          company_name?: string | null;
          sprint_number?: string;
          submitted_at?: string;
          status?: string;
          completion_percentage?: number;
          tool_data: Record<string, unknown>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tool_name?: string;
          user_id?: string;
          user_name?: string;
          company_id?: string;
          company_name?: string | null;
          sprint_number?: string;
          submitted_at?: string;
          status?: string;
          completion_percentage?: number;
          tool_data?: Record<string, unknown>;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

