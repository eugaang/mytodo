-- Migration: Add memo field to todos table
-- Feature: memo-and-edit

ALTER TABLE todos ADD COLUMN IF NOT EXISTS memo TEXT;
