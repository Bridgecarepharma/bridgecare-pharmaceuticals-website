CREATE TYPE "ArticleStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

CREATE TABLE "HealthCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "HealthCategory_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "HealthTag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "HealthTag_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "HealthArticle" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "contentHtml" TEXT NOT NULL,
    "featuredImageUrl" TEXT,
    "featuredImageAlt" TEXT,
    "authorName" TEXT NOT NULL DEFAULT 'Bridgecare Health Team',
    "status" "ArticleStatus" NOT NULL DEFAULT 'DRAFT',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "seoTitle" TEXT,
    "metaDescription" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "categoryId" TEXT,
    CONSTRAINT "HealthArticle_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "HealthArticleTag" (
    "articleId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    CONSTRAINT "HealthArticleTag_pkey" PRIMARY KEY ("articleId","tagId")
);

CREATE UNIQUE INDEX "HealthCategory_name_key" ON "HealthCategory"("name");
CREATE UNIQUE INDEX "HealthCategory_slug_key" ON "HealthCategory"("slug");
CREATE INDEX "HealthCategory_name_idx" ON "HealthCategory"("name");
CREATE UNIQUE INDEX "HealthTag_name_key" ON "HealthTag"("name");
CREATE UNIQUE INDEX "HealthTag_slug_key" ON "HealthTag"("slug");
CREATE INDEX "HealthTag_name_idx" ON "HealthTag"("name");
CREATE UNIQUE INDEX "HealthArticle_slug_key" ON "HealthArticle"("slug");
CREATE INDEX "HealthArticle_status_publishedAt_idx" ON "HealthArticle"("status", "publishedAt");
CREATE INDEX "HealthArticle_categoryId_status_idx" ON "HealthArticle"("categoryId", "status");
CREATE INDEX "HealthArticle_isFeatured_status_idx" ON "HealthArticle"("isFeatured", "status");
CREATE INDEX "HealthArticleTag_tagId_idx" ON "HealthArticleTag"("tagId");

ALTER TABLE "HealthArticle" ADD CONSTRAINT "HealthArticle_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "HealthCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "HealthArticleTag" ADD CONSTRAINT "HealthArticleTag_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "HealthArticle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "HealthArticleTag" ADD CONSTRAINT "HealthArticleTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "HealthTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
