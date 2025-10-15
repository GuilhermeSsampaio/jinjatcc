import servidor from "./servidor";

const recurso = "/pedidos";

export async function servicoListarPedido(params = {}) {
  const resposta = await servidor.get(recurso, { params });
  return resposta.data;
}

export async function servicoBuscarPedidoPorId(id) {
  const resposta = await servidor.get(`${recurso}/${id}`);
  return resposta.data;
}

export async function servicoCriarPedido(payload) {
  const resposta = await servidor.post(recurso, payload);
  return resposta.data;
}

export async function servicoAtualizarPedido(id, payload) {
  const resposta = await servidor.put(`${recurso}/${id}`, payload);
  return resposta.data;
}

export async function servicoRemoverPedido(id) {
  const resposta = await servidor.delete(`${recurso}/${id}`);
  return resposta.data;
}