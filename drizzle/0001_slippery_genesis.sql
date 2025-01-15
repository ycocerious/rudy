CREATE UNIQUE INDEX IF NOT EXISTS "unique_task_completion" ON "task_completions" USING btree ("task_id","user_id",DATE("completed_date"));