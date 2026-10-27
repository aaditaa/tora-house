CREATE TABLE "applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"city" text NOT NULL,
	"age_band" text NOT NULL,
	"occupation" text NOT NULL,
	"recent_attempts" text NOT NULL,
	"what_interrupts" text NOT NULL,
	"spend_band" text NOT NULL,
	"year_from_now" text NOT NULL,
	"trains_competitively" boolean NOT NULL,
	"referral_source" text NOT NULL,
	"offline_availability" text NOT NULL,
	"notes" text,
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