CREATE TABLE IF NOT EXISTS "projects" (
	"id" varchar PRIMARY KEY NOT NULL,
	"claimed" boolean DEFAULT false NOT NULL,
	"hidden" boolean DEFAULT false NOT NULL,
	"excluded" boolean DEFAULT false NOT NULL,
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
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "readme_hashes" (
	"commit" varchar PRIMARY KEY NOT NULL,
	"readme" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "status" (
	"id" integer PRIMARY KEY NOT NULL,
	"last_readme_update" timestamp NOT NULL
);
