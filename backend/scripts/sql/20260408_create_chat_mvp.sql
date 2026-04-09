CREATE TABLE conversas (
  id INT NOT NULL AUTO_INCREMENT,
  usuario_id INT NOT NULL,
  status ENUM('aberta', 'fechada', 'aguardando_suporte') NOT NULL DEFAULT 'aberta',
  origem ENUM('ia', 'humano', 'sistema') NOT NULL DEFAULT 'ia',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_conversas_usuario_id (usuario_id),
  KEY idx_conversas_status (status),
  CONSTRAINT fk_conversas_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE CASCADE
);

CREATE TABLE mensagens (
  id INT NOT NULL AUTO_INCREMENT,
  conversa_id INT NOT NULL,
  remetente ENUM('user', 'ia', 'suporte', 'sistema') NOT NULL,
  mensagem TEXT NOT NULL,
  tipo ENUM('texto', 'sistema') NOT NULL DEFAULT 'texto',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_mensagens_conversa_id (conversa_id),
  KEY idx_mensagens_created_at (created_at),
  CONSTRAINT fk_mensagens_conversa
    FOREIGN KEY (conversa_id) REFERENCES conversas(id)
    ON DELETE CASCADE
);
