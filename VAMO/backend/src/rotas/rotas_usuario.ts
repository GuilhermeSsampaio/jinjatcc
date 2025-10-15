import { Router } from "express";
import ServicosUsuario from "../servicos/servicos_usuario";
import verificarToken from "../middlewares/verificar_token";

const RotasUsuario = Router();
export default RotasUsuario;

// Rotas públicas
RotasUsuario.get("/", ServicosUsuario.listar);
RotasUsuario.get("/:id", ServicosUsuario.buscarPorId);

// Rotas protegidas
RotasUsuario.post("/", verificarToken, ServicosUsuario.criar);
RotasUsuario.put("/:id", verificarToken, ServicosUsuario.atualizar);
RotasUsuario.delete("/:id", verificarToken, ServicosUsuario.remover);