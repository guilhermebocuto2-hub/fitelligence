CREATE TABLE analises_corporais (
  id INT NOT NULL AUTO_INCREMENT,
  usuario_id INT NOT NULL,
  imagem_id INT NOT NULL,
  imagem_anterior_id INT NULL,
  resumo_visual TEXT NULL,
  pontos_de_evolucao JSON NULL,
  pontos_de_atencao JSON NULL,
  consistencia_percebida VARCHAR(100) NULL,
  recomendacao_curta VARCHAR(255) NULL,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_analises_corporais_usuario (usuario_id),
  KEY idx_analises_corporais_imagem (imagem_id),
  KEY idx_analises_corporais_imagem_anterior (imagem_anterior_id),
  CONSTRAINT fk_analises_corporais_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_analises_corporais_imagem
    FOREIGN KEY (imagem_id) REFERENCES imagens(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_analises_corporais_imagem_anterior
    FOREIGN KEY (imagem_anterior_id) REFERENCES imagens(id)
    ON DELETE CASCADE
);
