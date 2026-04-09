ALTER TABLE usuarios
  ADD COLUMN provider VARCHAR(20) NOT NULL DEFAULT 'local' AFTER senha,
  ADD COLUMN provider_id VARCHAR(191) NULL AFTER provider,
  ADD COLUMN email_verificado TINYINT(1) NOT NULL DEFAULT 0 AFTER provider_id,
  ADD COLUMN avatar_url VARCHAR(500) NULL AFTER email_verificado;

ALTER TABLE usuarios
  ADD UNIQUE KEY uq_usuarios_provider_provider_id (provider, provider_id);
