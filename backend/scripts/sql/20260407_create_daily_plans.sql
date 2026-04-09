CREATE TABLE daily_plans (
  id INT NOT NULL AUTO_INCREMENT,
  usuario_id INT NOT NULL,
  data DATE NOT NULL,
  plano_json JSON NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'gerado',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_daily_plans_usuario_data (usuario_id, data),
  KEY idx_daily_plans_usuario_id (usuario_id),
  CONSTRAINT fk_daily_plans_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE CASCADE
);
