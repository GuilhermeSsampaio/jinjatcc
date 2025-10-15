import Usuario from "../entidades/usuario";

export default class ServicosUsuario {
  static async listar(request, response) {
    try {
      const itens = await Usuario.find();
      return response.json(itens);
    } catch (erro) {
      return response
        .status(500)
        .json({ mensagem: "Erro ao listar registros", detalhe: erro.message });
    }
  }

  static async buscarPorId(request, response) {
    try {
      const item = await Usuario.findOne(request.params.id);
      if (!item) {
        return response
          .status(404)
          .json({ mensagem: "Registro nao encontrado" });
      }
      return response.json(item);
    } catch (erro) {
      return response
        .status(500)
        .json({ mensagem: "Erro ao buscar registro", detalhe: erro.message });
    }
  }

  static async criar(request, response) {
    try {
      const dados = request.body;
      const novo = Usuario.create(dados);
      const salvo = await Usuario.save(novo);
      return response.status(201).json(salvo);
    } catch (erro) {
      return response
        .status(500)
        .json({ mensagem: "Erro ao criar registro", detalhe: erro.message });
    }
  }

  static async atualizar(request, response) {
    try {
      const { id } = request.params;
      const dados = request.body;
      const existente = await Usuario.findOne(id);
      if (!existente) {
        return response
          .status(404)
          .json({ mensagem: "Registro nao encontrado" });
      }
      const atualizado = Usuario.merge(existente, dados);
      const salvo = await Usuario.save(atualizado);
      return response.json(salvo);
    } catch (erro) {
      return response
        .status(500)
        .json({
          mensagem: "Erro ao atualizar registro",
          detalhe: erro.message,
        });
    }
  }

  static async remover(request, response) {
    try {
      const { id } = request.params;
      const existente = await Usuario.findOne(id);
      if (!existente) {
        return response
          .status(404)
          .json({ mensagem: "Registro nao encontrado" });
      }
      await Usuario.remove(existente);
      return response.status(204).send();
    } catch (erro) {
      return response
        .status(500)
        .json({ mensagem: "Erro ao remover registro", detalhe: erro.message });
    }
  }
}