import { Router } from "express";
import ServicosProduto from "../servicos/servicos_produto";
import verificarToken from "../middlewares/verificar_token";

const RotasProduto = Router();
export default RotasProduto;

// Rotas públicas
RotasProduto.get("/", ServicosProduto.listar);
RotasProduto.get("/:id", ServicosProduto.buscarPorId);

// Rotas protegidas
RotasProduto.post("/", verificarToken, ServicosProduto.criar);
RotasProduto.put("/:id", verificarToken, ServicosProduto.atualizar);
RotasProduto.delete("/:id", verificarToken, ServicosProduto.remover);