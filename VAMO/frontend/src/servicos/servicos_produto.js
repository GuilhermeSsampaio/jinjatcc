import servidor from "./servidor";

const recurso = "/produtos";

export async function servicoListarProduto(params = {}) {
  const resposta = await servidor.get(recurso, { params });
  return resposta.data;
}

export async function servicoBuscarProdutoPorId(id) {
  const resposta = await servidor.get(`${recurso}/${id}`);
  return resposta.data;
}

export async function servicoCriarProduto(payload) {
  const resposta = await servidor.post(recurso, payload);
  return resposta.data;
}

export async function servicoAtualizarProduto(id, payload) {
  const resposta = await servidor.put(`${recurso}/${id}`, payload);
  return resposta.data;
}

export async function servicoRemoverProduto(id) {
  const resposta = await servidor.delete(`${recurso}/${id}`);
  return resposta.data;
}