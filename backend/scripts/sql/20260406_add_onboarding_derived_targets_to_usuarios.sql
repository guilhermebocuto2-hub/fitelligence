ALTER TABLE usuarios
  ADD COLUMN meta_calorica INT NULL AFTER onboarding_concluido_em,
  ADD COLUMN meta_agua INT NULL AFTER meta_calorica,
  ADD COLUMN meta_passos INT NULL AFTER meta_agua,
  ADD COLUMN nivel_usuario VARCHAR(30) NULL AFTER meta_passos,
  ADD COLUMN frequencia_treino_base INT NULL AFTER nivel_usuario,
  ADD COLUMN intensidade_treino_base VARCHAR(30) NULL AFTER frequencia_treino_base,
  ADD COLUMN tipo_treino_base VARCHAR(80) NULL AFTER intensidade_treino_base;
