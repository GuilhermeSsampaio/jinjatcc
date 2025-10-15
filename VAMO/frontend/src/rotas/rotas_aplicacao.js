import { Route, BrowserRouter, Routes } from "react-router-dom";
import LogarUsuario from "../paginas/usuario/logar_usuario";
import CadastrarUsuario from "../paginas/usuario/cadastrar_usuario";
import PaginaInicial from "../paginas/usuario/pagina_inicial";
import RotasUsuariosLogados from "./rotas_usuario_logado";
import PaginaUsuarioLista from "../paginas/usuario/usuario_lista";
import PaginaProdutoLista from "../paginas/produto/produto_lista";
import PaginaPedidoLista from "../paginas/pedido/pedido_lista";
export default function Rotas() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LogarUsuario />} path="/" />
        <Route element={<CadastrarUsuario />} path="/criar-usuario" />
        
        {/* Rotas protegidas com sidebar */}
        <Route element={<RotasUsuariosLogados />}>
          <Route element={<PaginaInicial />} path="/pagina-inicial" />
<Route element={<PaginaUsuarioLista />} path="/usuarios" />
<Route element={<PaginaProdutoLista />} path="/produtos" />
<Route element={<PaginaPedidoLista />} path="/pedidos" />
</Route>
      </Routes>
    </BrowserRouter>
  );
}