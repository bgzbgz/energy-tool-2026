-- Migration: Create energy_submissions table
-- Date: 2026-01-07
-- Description: Stores energy protocol submissions with JSONB tool_data

CREATE TABLE IF NOT EXISTS energy_submissions (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Tool Identification
  tool_name TEXT NOT NULL DEFAULT 'energy_body_mind',
  
  -- User Identification
  user_id TEXT NOT NULL,              -- Email address (unique identifier)
  user_name TEXT NOT NULL,            -- Display name
  company_id TEXT NOT NULL,           -- Organization identifier
  company_name TEXT,                  -- Organization display name (optional)
  sprint_number TEXT DEFAULT 'energy', -- Sprint/batch identifier
  
  -- Submission Metadata
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT DEFAULT 'completed',    -- 'completed', 'draft', 'deleted'
  completion_percentage INTEGER DEFAULT 100,
  
  -- Tool Data (JSONB)
  tool_data JSONB NOT NULL,
  
  -- Audit Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_energy_company ON energy_submissions(company_id);
CREATE INDEX IF NOT EXISTS idx_energy_user ON energy_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_energy_submitted ON energy_submissions(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_energy_status ON energy_submissions(status);

-- GIN Index for JSONB Queries (optional, for future analytics)
CREATE INDEX IF NOT EXISTS idx_energy_tool_data ON energy_submissions USING GIN (tool_data);

-- Trigger for Updated Timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_energy_submissions_updated_at 
  BEFORE UPDATE ON energy_submissions
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

