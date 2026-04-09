-- ======================================================
-- Billing base tables (non-destructive)
-- Fitelligence - fase base para assinaturas mobile
-- ======================================================

CREATE TABLE IF NOT EXISTS subscriptions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  platform ENUM('ios', 'android') NOT NULL,
  product_id VARCHAR(191) NOT NULL,
  status ENUM('active', 'canceled', 'expired', 'grace_period', 'revoked') NOT NULL DEFAULT 'expired',
  is_premium TINYINT(1) NOT NULL DEFAULT 0,
  current_period_start DATETIME NULL,
  current_period_end DATETIME NULL,
  purchase_token VARCHAR(255) NULL,
  original_transaction_id VARCHAR(255) NULL,
  environment ENUM('production', 'sandbox') NOT NULL DEFAULT 'production',
  last_validated_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_subscriptions_user_id (user_id),
  KEY idx_subscriptions_user_status (user_id, status, is_premium),
  KEY idx_subscriptions_period_end (current_period_end),
  KEY idx_subscriptions_platform_product (platform, product_id),
  UNIQUE KEY ux_subscriptions_platform_purchase_token (platform, purchase_token),
  UNIQUE KEY ux_subscriptions_platform_original_tx (platform, original_transaction_id),
  CONSTRAINT fk_subscriptions_user
    FOREIGN KEY (user_id) REFERENCES usuarios(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS subscription_events (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  platform ENUM('ios', 'android') NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  external_id VARCHAR(255) NULL,
  payload_json JSON NOT NULL,
  processed_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_subscription_events_user_id (user_id),
  KEY idx_subscription_events_platform_type (platform, event_type),
  KEY idx_subscription_events_external_id (external_id),
  KEY idx_subscription_events_created_at (created_at),
  CONSTRAINT fk_subscription_events_user
    FOREIGN KEY (user_id) REFERENCES usuarios(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
