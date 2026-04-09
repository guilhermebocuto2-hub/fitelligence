const UsuarioModel = require('../models/usuarioModel');
const AppError = require('../utils/AppError');

class UsuarioService {
  static async buscarPerfil(usuarioId) {
    const usuario = await UsuarioModel.findById(usuarioId);

    if (!usuario) {
      throw new AppError('Usuário não encontrado', 404);
    }

    return usuario;
  }
}

module.exports = UsuarioService;