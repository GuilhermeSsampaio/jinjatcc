import { Router } from "express";
import ServicosPedido from "../servicos/servicos_pedido";
import verificarToken from "../middlewares/verificar_token";

const RotasPedido = Router();
export default RotasPedido;

// Rotas públicas
RotasPedido.get("/", ServicosPedido.listar);
RotasPedido.get("/:id", ServicosPedido.buscarPorId);

// Rotas protegidas
RotasPedido.post("/", verificarToken, ServicosPedido.criar);
RotasPedido.put("/:id", verificarToken, ServicosPedido.atualizar);
RotasPedido.delete("/:id", verificarToken, ServicosPedido.remover);