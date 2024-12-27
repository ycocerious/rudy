CREATE TABLE IF NOT EXISTS "daily_completions" (
	"daily_completion_id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"completion_date" date NOT NULL,
	"completion_percentage" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "feedbacks" (
	"feedback_id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"rating" integer NOT NULL,
	"feedback" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "task_completions" (
	"completion_id" serial PRIMARY KEY NOT NULL,
	"task_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"completed_date" date NOT NULL,
	"completed_count" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tasks" (
	"task_id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"name" varchar(20) NOT NULL,
	"frequency" varchar(20) NOT NULL,
	"category" varchar(20) NOT NULL,
	"daily_count_total" integer NOT NULL,
	"daily_count_finished" integer NOT NULL,
	"x_value" integer,
	"start_date" date,
	"week_days" varchar[],
	"month_days" integer[],
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"is_archived" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"user_id" serial PRIMARY KEY NOT NULL,
	"clerk_id" varchar(256) NOT NULL,
	"email" varchar(256) NOT NULL,
	"first_name" varchar(256),
	"last_name" varchar(256),
	"image_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_clerk_id_unique" UNIQUE("clerk_id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "daily_completions" ADD CONSTRAINT "daily_completions_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "feedbacks" ADD CONSTRAINT "feedbacks_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "task_completions" ADD CONSTRAINT "task_completions_task_id_tasks_task_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("task_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "task_completions" ADD CONSTRAINT "task_completions_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tasks" ADD CONSTRAINT "tasks_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "daily_completions_user_date_idx" ON "daily_completions" USING btree ("user_id","completion_date");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "feedback_user_id_idx" ON "feedbacks" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "task_date_idx" ON "task_completions" USING btree ("task_id","user_id","completed_date");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_date_idx" ON "task_completions" USING btree ("user_id","completed_date");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "task_user_id_idx" ON "tasks" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "clerk_id_idx" ON "users" USING btree ("clerk_id");