CREATE TABLE "applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"email" text,
	"age_band" text NOT NULL,
	"city" text NOT NULL,
	"interests" text[] NOT NULL,
	"practices_today" text[] NOT NULL,
	"workout_mode" text NOT NULL,
	"recent_attempts" text NOT NULL,
	"what_interrupts" text NOT NULL,
	"spend_band" text NOT NULL,
	"year_from_now" text NOT NULL,
	"next_steps" text[] NOT NULL,
	"consent_contact" boolean NOT NULL,
	"research_optin" boolean DEFAULT false NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"utm" jsonb,
	"referrer" text,
	"user_agent" text
);
--> statement-breakpoint
CREATE TABLE "waitlist" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"city" text NOT NULL,
	"note" text,
	"consent_contact" boolean NOT NULL,
	"source" text,
	"utm" jsonb,
	"referrer" text
);
--> statement-breakpoint
CREATE INDEX "applications_created_at_idx" ON "applications" USING btree ("created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE UNIQUE INDEX "applications_email_idx" ON "applications" USING btree (lower("email"));--> statement-breakpoint
CREATE UNIQUE INDEX "waitlist_email_idx" ON "waitlist" USING btree (lower("email"));