# Gerador de Projeto Fullstack (TypeScript + React)

Este gerador cria automaticamente a estrutura de um sistema completo com backend em TypeScript (Node.js) e frontend em React, a partir de um arquivo de especificação JSON.

## Estrutura Gerada

- `backend/` — API REST em TypeScript (Node.js)
  - `src/entidades/` — Entidades do banco de dados
  - `src/rotas/` — Rotas da API
  - `src/servicos/` — Serviços de negócio
  - `src/middlewares/` — Middlewares de autenticação e validação
  - `ormconfig.ts` — Configuração do TypeORM
  - `package.json`, `tsconfig.json`, `.env.example`, `.gitignore`
- `frontend/` — Aplicação React
  - `src/componentes/` — Componentes reutilizáveis (inclui menu lateral, formulários dinâmicos, modais)
  - `src/paginas/` — Páginas de listagem e cadastro para cada entidade
  - `src/contextos/` — Contextos globais (ex: usuário)
  - `src/rotas/` — Rotas protegidas e públicas
  - `src/servicos/` — Serviços de acesso à API
  - `src/utilitarios/` — Estilos, validações, máscaras, helpers
  - `public/index.html`, `global.css`, `package.json`, `.env.example`, `.gitignore`

## Como Usar

1. **Prepare o arquivo de especificação** (exemplo: `spec.playlists.example.json`).
2. **Execute o gerador:**

```sh
python generate_v2.py spec.playlists.example.json
```

- Por padrão, o projeto será gerado na pasta `projetos_gerados`.

### Gerar em uma nova pasta (nível do script)

Use a flag `--novo=sim` para criar o projeto em uma nova pasta com o nome do projeto (slug) no mesmo nível do script:

```sh
python generate_v2.py spec.playlists.example.json --novo=sim
```

Isso criará, por exemplo, a pasta `playlists-musicais/` com as subpastas `backend/` e `frontend/`.

### Outras opções

- `--out=CAMINHO` — Define o diretório de saída (padrão: `./projetos_gerados`).

## Templates e Customização

Os templates Jinja2 estão em `templatev2/` e podem ser customizados conforme a necessidade:

- Backend: `templatev2/backend/`
- Frontend: `templatev2/frontend/`

## Exemplo de Especificação (`spec.playlists.example.json`)

```json
{
  "project": {
    "name": "Gerenciador de Playlists Musicais",
    "slug": "playlists-musicais",
    "description": "Sistema para criar, gerenciar e compartilhar playlists de músicas."
  },
  "entities": [
    {
      "name": "usuario",
      "plural": "usuarios",
      "fields": [
        { "name": "nome", "type": "string" },
        { "name": "email", "type": "string" },
        { "name": "senha", "type": "string" }
      ]
    },
    {
      "name": "playlist",
      "plural": "playlists",
      "fields": [
        { "name": "nome", "type": "string" },
        { "name": "descricao", "type": "string" },
        { "name": "privada", "type": "boolean" }
      ],
      "relationships": [
        {
          "type": "many-to-one",
          "target": "usuario",
          "inverseField": "playlists"
        }
      ]
    }
  ]
}
```

## Observações

- O gerador ignora a entidade `usuario` para menus e CRUDs genéricos, pois já gera páginas e serviços específicos para autenticação e cadastro de usuário.
- As tabelas de listagem no frontend são dinâmicas e exibem todos os campos definidos na spec.
- Os formulários de cadastro também são gerados dinamicamente.

## Requisitos

- Python 3.x
- Node.js e npm (para rodar backend e frontend)
- Dependências Python: `jinja2`

---

Para dúvidas ou customizações, edite os templates em `templatev2/` ou consulte o código-fonte do gerador.
