const AppError = require("../utils/AppError");

// ======================================================
// Middleware de perfil
// Responsável por:
// - restringir acesso conforme o tipo de usuário
// - proteger áreas específicas do sistema
//
// Exemplo de uso:
// perfilMiddleware("personal")
// perfilMiddleware("nutricionista")
// perfilMiddleware("usuario")
// ======================================================
function perfilMiddleware(...perfisPermitidos) {
  return (req, res, next) => {
    // ==================================================
    // Garante que o usuário autenticado exista na request
    // ==================================================
    if (!req.usuario) {
      return next(new AppError("Usuário não autenticado", 401));
    }

    // ==================================================
    // Recupera o tipo do usuário autenticado
    // ==================================================
    const tipoUsuario = req.usuario.tipo_usuario || "usuario";

    // ==================================================
    // Verifica se o perfil atual está entre os permitidos
    // ==================================================
    if (!perfisPermitidos.includes(tipoUsuario)) {
      return next(
        new AppError(
          "Você não tem permissão para acessar esta área",
          403
        )
      );
    }

    // ==================================================
    // Se estiver autorizado, segue normalmente
    // ==================================================
    return next();
  };
}

module.exports = perfilMiddleware;