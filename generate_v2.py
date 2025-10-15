import argparse
import json
import os
import re
import shutil
from pathlib import Path
from jinja2 import Environment, FileSystemLoader, StrictUndefined

# Pasta padrão onde os projetos serão gerados
DEFAULT_OUTPUT_DIR = "./projetos_gerados"

def slugify(text: str) -> str:
    text = text.strip().lower()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return re.sub(r"-+", "-", text).strip("-")

def camel_case(text: str) -> str:
    parts = re.split(r"[^a-zA-Z0-9]", text)
    parts = [p for p in parts if p]
    if not parts:
        return ""
    return parts[0].lower() + "".join(p.capitalize() for p in parts[1:])

def pascal_case(text: str) -> str:
    parts = re.split(r"[^a-zA-Z0-9]", text)
    return "".join(p.capitalize() for p in parts if p)

def pluralize(name: str) -> str:
    if name.lower().endswith("s"):
        return name
    return name + "s"

def ensure_dir(path: Path):
    path.mkdir(parents=True, exist_ok=True)

def load_spec(path: Path) -> dict:
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)

def build_context(spec: dict) -> dict:
    project = spec.get("project", {})
    entities = spec.get("entities", [])

    norm_entities = []
    for e in entities:
        name = e["name"]
        plural = e.get("plural") or pluralize(name)
        norm_entities.append({
            **e,
            "name": name,
            "plural": plural,
            "name_camel": camel_case(name),
            "name_pascal": pascal_case(name),
            "plural_kebab": slugify(plural),
            "name_kebab": slugify(name),
        })

    project_slug = project.get("slug") or slugify(project.get("name", "app"))

    return {
        "project": {
            **project,
            "slug": project_slug
        },
        "entities": norm_entities
    }

def render_to(env: Environment, template_rel_path: str, out_path: Path, ctx: dict):
    # Não sobrescrever node_modules
    if "node_modules" in str(out_path):
        return
        
    tpl = env.get_template(template_rel_path)
    ensure_dir(out_path.parent)
    out_path.write_text(tpl.render(**ctx), encoding="utf-8")

def render_user_pages(env: Environment, frontend_root: Path, ctx: dict):
    """Renderiza as páginas padrão de usuário"""
    render_to(
        env,
        "frontend/src/paginas/usuario/logar_usuario.jsx.j2",
        frontend_root / "src" / "paginas" / "usuario" / "logar_usuario.jsx",
        ctx
    )
    render_to(
        env,
        "frontend/src/paginas/usuario/cadastrar_usuario.jsx.j2",
        frontend_root / "src" / "paginas" / "usuario" / "cadastrar_usuario.jsx",
        ctx
    )
    render_to(
        env,
        "frontend/src/paginas/usuario/pagina_inicial.jsx.j2",
        frontend_root / "src" / "paginas" / "usuario" / "pagina_inicial.jsx",
        ctx
    )

def main():
    parser = argparse.ArgumentParser(description="Gerador v2: TypeScript backend + React frontend")
    parser.add_argument("spec", help="Caminho do arquivo JSON de especificação")
    parser.add_argument("--out", default=DEFAULT_OUTPUT_DIR, help=f"Diretório de saída (default: {DEFAULT_OUTPUT_DIR})")
    args = parser.parse_args()

    root = Path(__file__).parent
    templates_dir = root / "templatev2"
    boilerplates_dir = root / "boilerplates"

    env = Environment(
        loader=FileSystemLoader(str(templates_dir)),
        undefined=StrictUndefined,
        trim_blocks=True,
        lstrip_blocks=True
    )

    spec = load_spec(Path(args.spec))
    ctx = build_context(spec)




    out_root = Path(args.out)
    backend_root = out_root / "backend"
    frontend_root = out_root / "frontend"



    # Limpa backend, preservando node_modules
    if backend_root.exists():
        for item in backend_root.iterdir():
            if item.name != "node_modules":
                if item.is_dir():
                    shutil.rmtree(item)
                else:
                    item.unlink()


    # Limpa frontend, preservando node_modules
    if frontend_root.exists():
        for item in frontend_root.iterdir():
            if item.name != "node_modules":
                if item.is_dir():
                    shutil.rmtree(item)
                else:
                    item.unlink()

    # Frontend: rotas protegidas (rotas_usuario_logado.js)
    rotas_dir = frontend_root / "src" / "rotas"
    ensure_dir(rotas_dir)
    render_to(env, "frontend/src/rotas/rotas_usuario_logado.js.j2", rotas_dir / "rotas_usuario_logado.js", ctx)

    # Backend: arquivos estáticos
    render_to(env, "backend/package.json.j2", backend_root / "package.json", ctx)
    render_to(env, "backend/tsconfig.json.j2", backend_root / "tsconfig.json", ctx)
    render_to(env, "backend/ormconfig.ts.j2", backend_root / "ormconfig.ts", ctx)
    render_to(env, "backend/.env.example.j2", backend_root / ".env.example", ctx)
    render_to(env, "backend/.gitignore.j2", backend_root / ".gitignore", ctx)
    render_to(env, "backend/src/servidor.ts.j2", backend_root / "src" / "servidor.ts", ctx)

    # Copiar .env do boilerplate backend
    backend_env_source = boilerplates_dir / "backend" / ".env"
    if backend_env_source.exists():
        ensure_dir(backend_root)
        shutil.copy2(backend_env_source, backend_root / ".env")
        print(f"✓ Copiado .env do backend do boilerplate")
    
    # Backend: middlewares
    render_to(env, "backend/src/middlewares/verificar_token.ts.j2", 
              backend_root / "src" / "middlewares" / "verificar_token.ts", ctx)
    render_to(env, "backend/src/middlewares/verificar_erro_conteudo_token.ts.j2",
              backend_root / "src" / "middlewares" / "verificar_erro_conteudo_token.ts", ctx)

    # Backend: arquivos específicos do usuário
    render_to(
        env,
        "backend/src/entidades/usuario.ts.j2",
        backend_root / "src" / "entidades" / "usuario.ts",
        ctx
    )
    render_to(
        env,
        "backend/src/rotas/rotas_usuario.ts.j2",
        backend_root / "src" / "rotas" / "rotas_usuario.ts",
        ctx
    )
    render_to(
        env,
        "backend/src/servicos/servicos_usuario.ts.j2",
        backend_root / "src" / "servicos" / "servicos_usuario.ts",
        ctx
    )

    # Backend: por entidade
    for e in ctx["entities"]:
        if e["name_kebab"] != "usuario":  # Pula usuário pois já foi gerado
            entity_ctx = {**ctx, "entity": e}
            render_to(
                env,
                "backend/src/entidades/entidade.ts.j2",
                backend_root / "src" / "entidades" / f"{e['name_kebab']}.ts",
                entity_ctx
            )
            render_to(
                env,
                "backend/src/rotas/rotas_entidade.ts.j2",
                backend_root / "src" / "rotas" / f"rotas_{e['name_kebab']}.ts",
                entity_ctx
            )
            render_to(
                env,
                "backend/src/servicos/servicos_entidade.ts.j2",
                backend_root / "src" / "servicos" / f"servicos_{e['name_kebab']}.ts",
                entity_ctx
            )

    # Frontend: arquivos estáticos
    render_to(env, "frontend/package.json.j2", frontend_root / "package.json", ctx)
    render_to(env, "frontend/.env.example.j2", frontend_root / ".env.example", ctx)
    render_to(env, "frontend/.gitignore.j2", frontend_root / ".gitignore", ctx)
    render_to(env, "frontend/public/index.html.j2", frontend_root / "public" / "index.html", ctx)
    render_to(env, "frontend/src/index.js.j2", frontend_root / "src" / "index.js", ctx)
    render_to(env, "frontend/src/global.css.j2", frontend_root / "src" / "global.css", ctx)
    
    # Frontend: rotas (agora usando o template Jinja2 para garantir sidebar)
    render_to(env, "frontend/src/rotas/rotas_aplicacao.js.j2", frontend_root / "src" / "rotas" / "rotas_aplicacao.js", ctx)

    # Frontend: componentes
    render_to(env, "frontend/src/componentes/menu_lateral.jsx.j2",
              frontend_root / "src" / "componentes" / "menu_lateral.jsx", ctx)
    render_to(env, "frontend/src/componentes/rota_protegida.jsx.j2",
              frontend_root / "src" / "componentes" / "rota_protegida.jsx", ctx)
              
    # Frontend: contextos
    render_to(env, "frontend/src/contextos/contexto_usuario.jsx.j2",
              frontend_root / "src" / "contextos" / "contexto_usuario.jsx", ctx)

    # Frontend: serviços básicos
    render_to(env, "frontend/src/servicos/servidor.js.j2",
              frontend_root / "src" / "servicos" / "servidor.js", ctx)
    render_to(env, "frontend/src/servicos/servicos_usuario.js.j2",
              frontend_root / "src" / "servicos" / "servicos_usuario.js", ctx)

    # Frontend: utilitários
    render_to(env, "frontend/src/utilitarios/portugues.json.j2",
              frontend_root / "src" / "utilitarios" / "portugues.json", ctx)
    render_to(env, "frontend/src/utilitarios/mostrar_toast.js.j2",
              frontend_root / "src" / "utilitarios" / "mostrar_toast.js", ctx)
    render_to(env, "frontend/src/utilitarios/estilos.js.j2",
              frontend_root / "src" / "utilitarios" / "estilos.js", ctx)
    render_to(env, "frontend/src/utilitarios/validacoes.js.j2",
              frontend_root / "src" / "utilitarios" / "validacoes.js", ctx)
    render_to(env, "frontend/src/utilitarios/mascaras.js.j2",
              frontend_root / "src" / "utilitarios" / "mascaras.js", ctx)
    render_to(env, "frontend/src/utilitarios/formatar_perfil.js.j2",
              frontend_root / "src" / "utilitarios" / "formatar_perfil.js", ctx)

    # Copiar .env do boilerplate frontend
    frontend_env_source = boilerplates_dir / "frontend" / ".env"
    if frontend_env_source.exists():
        ensure_dir(frontend_root)
        shutil.copy2(frontend_env_source, frontend_root / ".env")
        print(f"✓ Copiado .env do frontend do boilerplate")

    # Frontend: páginas padrão de usuário
    render_user_pages(env, frontend_root, ctx)

    # Frontend: por entidade
    for e in ctx["entities"]:
        if e["name_kebab"] != "usuario":  # Pula usuário pois já foi gerado
            entity_ctx = {**ctx, "entity": e, "entidade": e, "atributos": e.get("fields", [])}
            render_to(
                env,
                "frontend/src/servicos/servicos_entidade.js.j2",
                frontend_root / "src" / "servicos" / f"servicos_{e['name_kebab']}.js",
                entity_ctx
            )
        render_to(
            env,
            "frontend/src/paginas/pagina_lista.jsx.j2",
            frontend_root / "src" / "paginas" / e['name_kebab'] / f"{e['name_kebab']}_lista.jsx",
            entity_ctx
        )

    # Frontend: componentes de formulário para entidades
    for e in ctx["entities"]:
        if e["name_kebab"] != "usuario":  # Pula usuário pois já foi gerado
            entity_ctx = {
                **ctx,
                "entity": e,
                "entidade": e,
                "atributos": e.get("fields", []),
                "fields": e.get("fields", [])  # Adiciona os campos ao contexto
            }
            render_to(
                env,
                "frontend/src/componentes/TEMPLATE_formulario_entidade.jsx.j2",
                frontend_root / "src" / "componentes" / f"FormCadastro{e['name_pascal']}.jsx",
                entity_ctx
            )

    print(f"✓ Projeto gerado com sucesso em: {out_root.resolve()}")
    print(f"\nPróximos passos:")
    print(f"1. Backend:")
    print(f"   cd {backend_root}")
    if not (backend_root / "node_modules").exists():
        print(f"   npm install")
    print(f"   # Arquivo .env já copiado do boilerplate - configure as variáveis conforme necessário")
    print(f"   npm run server")
    print(f"\n2. Frontend:")
    print(f"   cd {frontend_root}")
    if not (frontend_root / "node_modules").exists():
        print(f"   npm install")
    print(f"   # Arquivo .env já copiado do boilerplate - configure REACT_APP_API_URL conforme necessário")
    print(f"   npm start")

if __name__ == "__main__":
    main()
