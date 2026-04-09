CREATE TABLE daily_plan_executions (
  id INT NOT NULL AUTO_INCREMENT,
  usuario_id INT NOT NULL,
  data DATE NOT NULL,
  treino_concluido BOOLEAN NOT NULL DEFAULT 0,
  refeicoes_registradas INT NOT NULL DEFAULT 0,
  agua_consumida_ml INT NOT NULL DEFAULT 0,
  passos_realizados INT NOT NULL DEFAULT 0,
  checkin_realizado BOOLEAN NOT NULL DEFAULT 0,
  habitos_concluidos_json JSON NULL,
  score_dia INT NOT NULL DEFAULT 0,
  streak_dias INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_daily_plan_executions_usuario_data (usuario_id, data),
  KEY idx_daily_plan_executions_usuario_id (usuario_id),
  CONSTRAINT fk_daily_plan_executions_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE CASCADE
);
