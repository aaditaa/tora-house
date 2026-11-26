ALTER TABLE "immersion_bookings" ADD COLUMN "amount_inr" integer;--> statement-breakpoint
ALTER TABLE "immersion_bookings" ADD COLUMN "payment_link_id" text;--> statement-breakpoint
ALTER TABLE "immersion_bookings" ADD COLUMN "payment_link_url" text;--> statement-breakpoint
ALTER TABLE "immersion_bookings" ADD COLUMN "hold_until" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "immersion_bookings" ADD COLUMN "payment_id" text;--> statement-breakpoint
ALTER TABLE "immersion_bookings" ADD COLUMN "paid_at" timestamp with time zone;--> statement-breakpoint
CREATE UNIQUE INDEX "immersion_bookings_payment_link_idx" ON "immersion_bookings" USING btree ("payment_link_id");