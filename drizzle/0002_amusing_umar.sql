CREATE TABLE "immersion_bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"immersion_slug" text NOT NULL,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"seats" integer DEFAULT 1 NOT NULL,
	"dietary" text,
	"heard" text,
	"member_status" text NOT NULL,
	"status" text DEFAULT 'requested' NOT NULL,
	"source" text,
	"utm" jsonb,
	"referrer" text
);
--> statement-breakpoint
CREATE UNIQUE INDEX "immersion_bookings_slug_email_idx" ON "immersion_bookings" USING btree ("immersion_slug",lower("email"));--> statement-breakpoint
CREATE INDEX "immersion_bookings_slug_status_idx" ON "immersion_bookings" USING btree ("immersion_slug","status");