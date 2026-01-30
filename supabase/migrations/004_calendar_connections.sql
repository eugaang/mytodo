-- Migration: Create calendar_connections table for Google Calendar sync
-- Feature: 004-gcal-sync

CREATE TABLE calendar_connections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  google_email TEXT NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  token_expiry BIGINT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: 모든 작업 허용 (단일 사용자 환경)
ALTER TABLE calendar_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations" ON calendar_connections
  FOR ALL USING (true) WITH CHECK (true);
