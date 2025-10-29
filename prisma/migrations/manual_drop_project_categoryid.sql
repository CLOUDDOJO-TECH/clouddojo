-- Drop categoryId from Project table
-- This is a manual migration to clean up the old Category relationship

ALTER TABLE "Project" DROP COLUMN IF EXISTS "categoryId";
