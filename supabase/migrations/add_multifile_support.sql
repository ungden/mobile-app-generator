-- Add columns for multi-file project support
-- Run this migration in Supabase SQL Editor

-- Add files column (JSONB) to store multi-file project structure
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS files JSONB;

-- Add dependencies column to store npm dependencies
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS dependencies JSONB DEFAULT '{}';

-- Add version column to distinguish between single-file (v1) and multi-file (v2) projects
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;

-- Add index on version for faster queries
CREATE INDEX IF NOT EXISTS idx_projects_version ON projects(version);

-- Comment on columns
COMMENT ON COLUMN projects.files IS 'Multi-file project structure: {"path": {"contents": "...", "type": "CODE"}}';
COMMENT ON COLUMN projects.dependencies IS 'NPM dependencies: {"package-name": "version"}';
COMMENT ON COLUMN projects.version IS 'Project version: 1 = single-file (legacy), 2 = multi-file';
