ALTER TABLE "applications" ALTER COLUMN "next_steps" SET DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN "phone" text;--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN "hear_more" boolean DEFAULT false NOT NULL;