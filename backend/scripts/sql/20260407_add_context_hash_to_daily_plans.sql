ALTER TABLE daily_plans
  ADD COLUMN context_hash VARCHAR(255) NULL AFTER plano_json,
  ADD COLUMN updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP
    AFTER created_at;

CREATE INDEX idx_daily_plans_context_hash
  ON daily_plans (context_hash);
