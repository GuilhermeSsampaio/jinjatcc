import Produto from "../entidades/produto";

export default class ServicosProduto {
  static async listar(request, response) {
    try {
      const itens = await Produto.find();
      return response.json(itens);
    } catch (erro) {
      return response
        .status(500)
        .json({ mensagem: "Erro ao listar registros", detalhe: erro.message });
    }
  }

  static async buscarPorId(request, response) {
    try {
      const item = await Produto.findOne(request.params.id);
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
      const novo = Produto.create(dados);
      const salvo = await Produto.save(novo);
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
      const existente = await Produto.findOne(id);
      if (!existente) {
        return response
          .status(404)
          .json({ mensagem: "Registro nao encontrado" });
      }
      const atualizado = Produto.merge(existente, dados);
      const salvo = await Produto.save(atualizado);
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
      const existente = await Produto.findOne(id);
      if (!existente) {
        return response
          .status(404)
          .json({ mensagem: "Registro nao encontrado" });
      }
      await Produto.remove(existente);
      return response.status(204).send();
    } catch (erro) {
      return response
        .status(500)
        .json({ mensagem: "Erro ao remover registro", detalhe: erro.message });
    }
  }
}