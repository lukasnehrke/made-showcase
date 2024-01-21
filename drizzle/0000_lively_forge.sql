CREATE TABLE IF NOT EXISTS "projects" (
	"id" varchar PRIMARY KEY NOT NULL,
	"semester" varchar NOT NULL,
	"score" integer DEFAULT 0 NOT NULL,
	"title" varchar NOT NULL,
	"summary" text NOT NULL,
	"repository_url" varchar NOT NULL,
	"report_url" varchar,
	"presentation_url" varchar,
	"banner_url" varchar,
	"stars_count" integer DEFAULT 0 NOT NULL,
	"owner_id" serial NOT NULL,
	"owner_name" varchar,
	"owner_username" varchar NOT NULL,
	"owner_url" varchar NOT NULL,
	"owner_avatar_url" varchar NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "projects_semester_score_idx" ON "projects" ("semester", "score" DESC);
