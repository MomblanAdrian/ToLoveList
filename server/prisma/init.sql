-- ToLoveList Database Initialization
-- This script runs automatically on first database creation

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- The schema is managed by Prisma migrations.
-- This file serves as a reference for the database structure.

-- Key tables managed by Prisma:
--   users, profiles, groups, group_profiles,
--   categories, questions, answers,
--   recommendations, recommendation_history, refresh_tokens

-- Notes:
-- - All tables use UUID primary keys
-- - Soft deletes are not used; records are physically deleted via cascade
-- - Timestamps are managed automatically by Prisma's @updatedAt
-- - JSON fields store flexible metadata for recommendations

COMMENT ON DATABASE tolovelist IS 'ToLoveList - AI-Powered Recommendation Platform';
