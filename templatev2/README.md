# Template v2 - Boilerplate Generator

Este diretório contém templates Jinja2 para geração de projetos full-stack com backend TypeScript/Express/TypeORM e frontend React/PrimeReact.

## Estrutura

```
templatev2/
├── backend/
│   ├── package.json.j2
│   ├── tsconfig.json.j2
│   ├── ormconfig.ts.j2
│   ├── .env.example.j2
│   ├── .gitignore.j2
│   └── src/
│       ├── servidor.ts.j2
│       ├── entidades/
│       │   └── entidade.ts.j2          # Template para cada entidade
│       ├── rotas/
│       │   └── rotas_entidade.ts.j2    # Template para rotas por entidade
│       ├── servicos/
│       │   └── servicos_entidade.ts.j2 # Template para serviços por entidade
│       └── middlewares/
│           ├── verificar_token.ts.j2
│           └── verificar_erro_conteudo_token.ts.j2
└── frontend/
    ├── package.json.j2
    ├── .env.example.j2
    ├── .gitignore.j2
    ├── public/
    │   └── index.html.j2
    └── src/
        ├── index.js.j2
        ├── global.css.j2
        ├── rotas/
        │   └── rotas_aplicacao.js.j2
        ├── servicos/
        │   ├── servidor.js.j2
        │   └── servicos_entidade.js.j2    # Template para serviços API por entidade
        ├── utilitarios/
        │   ├── portugues.json.j2
        │   └── mostrar_toast.js.j2
        └── paginas/
            └── pagina_lista.jsx.j2         # Template para página de listagem

```

## Como Usar

### 1. Estrutura do JSON de Entrada

O gerador espera um JSON com a seguinte estrutura:

```json
{
  "project": {
    "name": "Nome do Projeto",
    "slug": "slug-do-projeto"
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

### 2. Executar o Gerador

O script `generate.py` precisa ser atualizado para usar `templatev2` ao invés de `templates`:

```python
# No generate.py, altere:
templates_dir = root / "templatev2"  # ao invés de "templates"
```

Execute:

```bash
python generate.py spec.json --out ./saida
```

### 3. Arquivos Gerados

#### Backend

- **Arquivos estáticos**: package.json, tsconfig.json, ormconfig.ts, .env.example, .gitignore, servidor.ts
- **Por entidade**:
  - `src/entidades/{entidade}.ts` - Modelo TypeORM
  - `src/rotas/rotas_{entidade}.ts` - Rotas Express
  - `src/servicos/servicos_{entidade}.ts` - Lógica de negócio

#### Frontend

- **Arquivos estáticos**: package.json, index.html, index.js, global.css, etc.
- **Por entidade**:
  - `src/servicos/servicos_{entidade}.js` - Funções de API
  - `src/paginas/{entidade}/{entidade}_lista.jsx` - Página de listagem

## Tecnologias

### Backend

- **TypeScript** - Linguagem
- **Express** - Framework web
- **TypeORM** - ORM para banco de dados
- **PostgreSQL/MySQL** - Bancos suportados
- **JWT** - Autenticação
- **bcrypt** - Hash de senhas

### Frontend

- **React** - Biblioteca UI
- **PrimeReact** - Componentes UI
- **PrimeFlex** - Utilitários CSS
- **React Router** - Roteamento
- **Axios** - Cliente HTTP

## Variáveis Disponíveis nos Templates

### project

- `project.name` - Nome do projeto
- `project.slug` - Nome no formato kebab-case

### entity (em templates de entidade)

- `entity.name` - Nome original
- `entity.name_pascal` - PascalCase (ex: Usuario)
- `entity.name_camel` - camelCase (ex: usuario)
- `entity.name_kebab` - kebab-case (ex: usuario)
- `entity.plural` - Nome no plural
- `entity.plural_kebab` - Plural em kebab-case
- `entity.fields` - Array de campos

### entities

- Lista de todas as entidades para iteração

## Próximos Passos

Para expandir os templates:

1. **Backend**: Adicionar validações, relacionamentos entre entidades, upload de arquivos
2. **Frontend**: Criar templates de formulário, modais de confirmação, contextos de estado
3. **Autenticação**: Implementar sistema completo de login/registro baseado em usuário
4. **Testes**: Adicionar templates para testes unitários e de integração

## Observações

- Os templates usam convenções de nomenclatura consistentes (kebab-case para arquivos, PascalCase para classes)
- Middlewares de autenticação já estão incluídos
- Frontend usa PrimeReact para UI consistente
- Backend suporta PostgreSQL e MySQL via TypeORM
