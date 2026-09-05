-- Backfill: existing "system" values become tags (skip duplicates via unique constraint)
INSERT INTO "CharacterTag" ("id", "characterId", "tag")
SELECT gen_random_uuid()::text, c."id", c."system"
FROM "Character" c
WHERE c."system" <> ''
ON CONFLICT ("characterId", "tag") DO NOTHING;

-- Backfill: existing "campaign" values become tags (skip NULL/empty and duplicates)
INSERT INTO "CharacterTag" ("id", "characterId", "tag")
SELECT gen_random_uuid()::text, c."id", c."campaign"
FROM "Character" c
WHERE c."campaign" IS NOT NULL AND c."campaign" <> ''
ON CONFLICT ("characterId", "tag") DO NOTHING;

-- AlterTable
ALTER TABLE "Character" DROP COLUMN "campaign",
DROP COLUMN "status",
DROP COLUMN "system",
ADD COLUMN     "designedBy" TEXT,
ADD COLUMN     "pronouns" TEXT,
ADD COLUMN     "tagline" TEXT;

-- DropEnum
DROP TYPE "CharacterStatus";
