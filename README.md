# Gerador de Boilerplate (Express + React) via JSON

Este gerador cria automaticamente um projeto full stack JavaScript seguindo o layout:

```
<saida>/
  backend/
    package.json
    src/
      index.js
      routes/
      controllers/
  frontend/
    package.json
    index.html
    src/
      main.jsx
      App.jsx
      pages/
      services/
```

A configuração é feita por um arquivo JSON com `project`, `entities` e `pages`.

## Requisitos

- Python 3.10+
- Node.js 18+
- pip install -r requirements.txt

## Uso

1. Edite `spec.example.json` ou crie o seu arquivo JSON.
2. Rode:

```bash
python generate.py spec.example.json --out ./saida
```

3. Inicie os apps:

```bash
cd ./saida/backend
npm install
npm run dev

cd ../frontend
npm install
npm run dev
```

> Para apontar o frontend para o backend, use a env `VITE_API_URL` (por padrão `http://localhost:3001/api`).

## Estrutura do JSON

```json
{
  "project": {
    "name": "My App",
    "slug": "my-app"
  },
  "entities": [
    {
      "name": "User",
      "plural": "users",
      "fields": [
        { "name": "id", "type": "string" },
        { "name": "name", "type": "string", "required": true }
      ]
    }
  ],
  "pages": [
    { "component": "Home", "path": "/", "title": "Home" },
    { "component": "UsersList", "path": "/users", "title": "Users" }
  ]
}
```

- `project.slug` define o prefixo dos `package.json` (frontend/backend).
- `entities[].plural` é opcional (se ausente, será inferido com `s`).
- `pages[]` define as rotas do React Router.

## Personalização

- Ajuste os templates em `templates/backend` e `templates/frontend`.
- Adicione novos templates por entidade em `templates/backend/entity` e `templates/frontend/page`/`component`.