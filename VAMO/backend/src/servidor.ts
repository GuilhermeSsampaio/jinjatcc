import cors from "cors";
import express from "express";
import "reflect-metadata";
import { createConnection } from "typeorm";
import RotasUsuario from "./rotas/rotas_usuario";
import RotasUsuario from "./rotas/rotas_usuario";
import RotasProduto from "./rotas/rotas_produto";
import RotasPedido from "./rotas/rotas_pedido";
const app = express();
const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

// Rota de usuario (autenticacao)
app.use("/usuarios", RotasUsuario);

// Rotas por entidade
app.use("/usuarios", RotasUsuario);
app.use("/produtos", RotasProduto);
app.use("/pedidos", RotasPedido);
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

const conexao = createConnection();
export default conexao;