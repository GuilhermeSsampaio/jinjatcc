import servidor from "./servidor";

const recurso = "/usuarios";

export async function servicoListarUsuario(params = {}) {
  const resposta = await servidor.get(recurso, { params });
  return resposta.data;
}

export async function servicoBuscarUsuarioPorId(id) {
  const resposta = await servidor.get(`${recurso}/${id}`);
  return resposta.data;
}

export async function servicoCriarUsuario(payload) {
  const resposta = await servidor.post(recurso, payload);
  return resposta.data;
}

export async function servicoAtualizarUsuario(id, payload) {
  const resposta = await servidor.put(`${recurso}/${id}`, payload);
  return resposta.data;
}

export async function servicoRemoverUsuario(id) {
  const resposta = await servidor.delete(`${recurso}/${id}`);
  return resposta.data;
}