import argparse
import json
import os
import re
from pathlib import Path
from jinja2 import Environment, FileSystemLoader, StrictUndefined

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
    # Simplista; use seu próprio pluralizador conforme necessário
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
    pages = spec.get("pages", [])

    # Enriquecer entidades com nomes derivados
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

    norm_pages = []
    for p in pages:
        comp = p["component"]
        norm_pages.append({
            **p,
            "component": pascal_case(comp),
            "route_path": p.get("path", f"/{slugify(comp)}")
        })

    project_slug = project.get("slug") or slugify(project.get("name", "app"))

    return {
        "project": {
            **project,
            "slug": project_slug
        },
        "entities": norm_entities,
        "pages": norm_pages
    }

def render_to(env: Environment, template_rel_path: str, out_path: Path, ctx: dict):
    tpl = env.get_template(template_rel_path)
    ensure_dir(out_path.parent)
    out_path.write_text(tpl.render(**ctx), encoding="utf-8")

def main():
    parser = argparse.ArgumentParser(description="Gerador de boilerplate (Express + React) a partir de JSON")
    parser.add_argument("spec", help="Caminho do arquivo JSON de especificação")
    parser.add_argument("--out", default="./saida", help="Diretório de saída (default: ./saida)")
    args = parser.parse_args()

    root = Path(__file__).parent
    templates_dir = root / "templates"

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

    # Backend: estáticos
    render_to(env, "backend/package.json.j2", backend_root / "package.json", ctx)
    render_to(env, "backend/src/index.js.j2", backend_root / "src" / "index.js", ctx)

    # Backend: por entidade
    for e in ctx["entities"]:
        entity_ctx = {**ctx, "entity": e}
        # routes
        render_to(
            env,
            "backend/entity/routes.js.j2",
            backend_root / "src" / "routes" / f"{e['plural_kebab']}.routes.js",
            entity_ctx
        )
        # controllers
        render_to(
            env,
            "backend/entity/controller.js.j2",
            backend_root / "src" / "controllers" / f"{e['name_kebab']}.controller.js",
            entity_ctx
        )

    # Frontend: estáticos
    render_to(env, "frontend/package.json.j2", frontend_root / "package.json", ctx)
    render_to(env, "frontend/index.html.j2", frontend_root / "index.html", ctx)
    render_to(env, "frontend/src/main.jsx.j2", frontend_root / "src" / "main.jsx", ctx)
    render_to(env, "frontend/src/App.jsx.j2", frontend_root / "src" / "App.jsx", ctx)
    render_to(env, "frontend/src/services/api.js.j2", frontend_root / "src" / "services" / "api.js", ctx)

    # Frontend: páginas
    for p in ctx["pages"]:
        page_ctx = {**ctx, "page": p}
        render_to(
            env,
            "frontend/src/pages/Page.jsx.j2",
            frontend_root / "src" / "pages" / f"{p['component']}.jsx",
            page_ctx
        )

    print(f"Projeto gerado em: {out_root.resolve()}")

if __name__ == "__main__":
    main()