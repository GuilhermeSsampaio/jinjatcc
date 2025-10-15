# Template v2 - Guia Rápido

## Resumo

O **templatev2** é um conjunto completo de templates Jinja2 para gerar aplicações full-stack com:

- **Backend**: TypeScript, Express, TypeORM, PostgreSQL/MySQL, JWT
- **Frontend**: React, PrimeReact, React Router, Axios

Baseado na estrutura do boilerplate existente, mas totalmente parametrizável via JSON.

## Uso Rápido

### 1. Preparar especificação JSON

Crie ou edite um arquivo JSON (ex: `meu-projeto.json`):

```json
{
  "project": {
    "name": "Meu Sistema",
    "slug": "meu-sistema"
  },
  "entities": [
    {
      "name": "produto",
      "plural": "produtos",
      "fields": [
        {
          "name": "nome",
          "type": "string",
          "column_options": "{ length: 120 }"
        },
        {
          "name": "preco",
          "type": "number",
          "column_options": "{ type: 'decimal', precision: 10, scale: 2 }"
        }
      ]
    }
  ]
}
```

### 2. Gerar projeto

```bash
python generate_v2.py meu-projeto.json --out ./saida
```

### 3. Configurar Backend

```bash
cd saida/backend
npm install
cp .env.example .env
# Edite .env com suas credenciais de banco
npm run server
```

### 4. Configurar Frontend

```bash
cd saida/frontend
npm install
cp .env.example .env
# Edite .env: REACT_APP_API_URL=http://localhost:3001
npm start
```

## Estrutura Gerada

```
saida/
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── ormconfig.ts
│   ├── .env.example
│   └── src/
│       ├── servidor.ts
│       ├── entidades/
│       │   └── produto.ts
│       ├── rotas/
│       │   └── rotas_produto.ts
│       ├── servicos/
│       │   └── servicos_produto.ts
│       └── middlewares/
│           ├── verificar_token.ts
│           └── verificar_erro_conteudo_token.ts
└── frontend/
    ├── package.json
    ├── public/
    │   └── index.html
    └── src/
        ├── index.js
        ├── global.css
        ├── rotas/
        │   └── rotas_aplicacao.js
        ├── servicos/
        │   ├── servidor.js
        │   └── servicos_produto.js
        ├── utilitarios/
        │   ├── portugues.json
        │   └── mostrar_toast.js
        └── paginas/
            └── produto/
                └── produto_lista.jsx
```

## Endpoints Gerados (exemplo para "produto")

### Backend

- `GET /produtos` - Listar todos
- `GET /produtos/:id` - Buscar por ID
- `POST /produtos` - Criar (requer token)
- `PUT /produtos/:id` - Atualizar (requer token)
- `DELETE /produtos/:id` - Remover (requer token)

### Frontend

- `/` - Página inicial
- `/produtos` - Listagem de produtos
- `/produtos/novo` - Criar produto
- `/produtos/:id/editar` - Editar produto

## Variáveis de Ambiente

### Backend (.env)

```env
NODE_ENV=development
PORT=3001
CORS_ORIGIN=http://localhost:3000
TYPEORM_TYPE=postgres
TYPEORM_HOST=localhost
TYPEORM_PORT=5432
TYPEORM_USERNAME=postgres
TYPEORM_PASSWORD=sua_senha
TYPEORM_DATABASE=meu_sistema_db
SENHA_SISTEMA=chave_secreta
SENHA_JWT=jwt_secret_key
```

### Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:3001
```

## Exemplo Completo

Veja `spec.templatev2.example.json` para um exemplo com múltiplas entidades (usuário, produto, pedido).

```bash
python generate_v2.py spec.templatev2.example.json --out ./sistema-gestao
```

## Comparação com Template Original

| Aspecto   | Template Original    | Template v2                            |
| --------- | -------------------- | -------------------------------------- |
| Backend   | JavaScript (Express) | TypeScript (Express + TypeORM)         |
| Frontend  | React (Vite)         | React (Create React App + PrimeReact)  |
| UI        | Básico               | PrimeReact (componentes profissionais) |
| Auth      | Não incluído         | JWT + middlewares incluídos            |
| Banco     | Não incluído         | TypeORM (PostgreSQL/MySQL)             |
| Estrutura | Simples              | Completa (baseada em boilerplate real) |

## Próximas Melhorias

- [ ] Templates de formulário completos
- [ ] Sistema de autenticação completo (login/registro)
- [ ] Relacionamentos entre entidades
- [ ] Upload de arquivos
- [ ] Testes unitários e de integração
- [ ] Docker Compose para desenvolvimento
- [ ] CI/CD pipelines

## Documentação Completa

Consulte `templatev2/README.md` para documentação detalhada dos templates.
