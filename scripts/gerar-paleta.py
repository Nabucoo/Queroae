"""Gera docs/paleta-de-cores.html a partir das cores de src/index.css.

O index.css é o original; a paleta é só para consultar e entregar. Rodar sempre
que uma cor mudar:

    python3 scripts/gerar-paleta.py

Também mede o contraste dos pares usados no app. Se algum ficar abaixo do mínimo,
o script avisa e termina com erro.
"""

import html
import re
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
ORIGEM = RAIZ / "src" / "index.css"
DESTINO = RAIZ / "docs" / "paleta-de-cores.html"

# (texto, fundo, mínimo, descrição). Texto pede 4,5:1 (7:1 no alto contraste); contorno de elemento, 3:1.
PARES = [
    ("texto", "fundo", 4.5, "Texto no fundo da página"),
    ("texto", "painel", 4.5, "Texto no painel"),
    ("texto", "elevado", 4.5, "Texto no cartão"),
    ("suave", "fundo", 4.5, "Texto suave no fundo da página"),
    ("suave", "painel", 4.5, "Texto suave no painel"),
    ("suave", "elevado", 4.5, "Texto suave no cartão"),
    ("suave", "ativo", 4.5, "Texto suave no selo"),
    ("destaque", "fundo", 4.5, "Link no fundo da página"),
    ("destaque", "painel", 4.5, "Link no painel"),
    ("destaque", "elevado", 4.5, "Link no cartão"),
    ("fundo", "primario", 4.5, "Botão principal"),
    ("texto", "ativo", 4.5, "Botão secundário"),
    ("negativo", "negativo-claro", 4.5, "Botão de perigo"),
    ("fundo", "destaque", 4.5, "Selo azul"),
    ("contorno", "painel", 3, "Contorno do cartão no painel"),
    ("contorno", "fundo", 3, "Contorno do cartão no fundo da página"),
] + [(f"confete-{n}-tinta", f"confete-{n}", 4.5, f"Avatar, cor {n}") for n in range(1, 7)]


def luminancia(cor):
    canais = [int(cor[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    r, g, b = [c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4 for c in canais]
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def contraste(a, b):
    maior, menor = sorted((luminancia(a), luminancia(b)), reverse=True)
    return (maior + 0.05) / (menor + 0.05)


def bloco(css, inicio):
    """Devolve o conteúdo das chaves do bloco que começa em `inicio`."""
    posicao = css.index(inicio)
    abre = css.index("{", posicao)
    return css[abre + 1 : css.index("\n}", abre)]


def ler_grupos(texto):
    """Lê as cores do @theme: [(grupo, [(nome, valor, uso), ...]), ...]."""
    grupos, atual = [], None
    for linha in texto.splitlines():
        titulo = re.match(r"\s*/\*\s*([^*:]+?)(?::[^*]*)?\s*\*/\s*$", linha)
        if titulo:
            atual = (titulo.group(1), [])
            grupos.append(atual)
            continue
        # O comentário vale para todas as cores da linha (ex.: fundo e tinta de um confete)
        comentario = re.search(r"/\*\s*(.*?)\s*\*/", linha)
        uso = comentario.group(1) if comentario else ""
        for nome, valor in re.findall(r"--color-([\w-]+):\s*(#[0-9a-fA-F]{6});", linha):
            if atual is None:
                atual = ("Cores", [])
                grupos.append(atual)
            atual[1].append((nome, valor.lower(), uso))
    return [g for g in grupos if g[1]]


def ler_cores(texto):
    return {n: v.lower() for n, v in re.findall(r"--color-([\w-]+):\s*(#[0-9a-fA-F]{6});", texto)}


def amostra(cor):
    return f'<td class="cor"><span class="am" style="background:{cor}"></span><code>{cor}</code></td>'


def tabela_contraste(titulo, cores, minimo_texto=4.5):
    linhas, falhas = [], []
    for a, b, minimo, descricao in PARES:
        if minimo == 4.5:
            minimo = minimo_texto
        valor = contraste(cores[a], cores[b])
        passou = valor >= minimo
        if not passou:
            falhas.append(f"{titulo}: {descricao} ({valor:.2f}:1, mínimo {minimo}:1)")
        texto = f"{valor:.2f}".replace(".", ",")
        minimo_txt = str(minimo).replace(".", ",")
        linhas.append(
            f'<tr><td><span class="par" style="background:{cores[b]};color:{cores[a]}">Aa</span>{html.escape(descricao)}</td>'
            f'<td class="num {"ok" if passou else "falha"}">{texto}:1 {"✓" if passou else "✗"}</td><td class="num">{minimo_txt}:1</td></tr>'
        )
    corpo = "".join(linhas)
    return (
        f'<div class="bloco"><h3>{titulo}</h3><table><thead><tr><th>Uso</th><th>Contraste</th><th>Mínimo</th></tr></thead>'
        f"<tbody>{corpo}</tbody></table></div>",
        falhas,
    )


def main():
    css = ORIGEM.read_text(encoding="utf-8")
    tema = bloco(css, "@theme")
    claro = ler_cores(tema)
    escuro = {**claro, **ler_cores(bloco(css, ':root[data-tema="escuro"]'))}
    # O alto contraste redefine todas as cores
    alto_claro = {**claro, **ler_cores(bloco(css, ':root[data-contraste="alto"] {'))}
    alto_escuro = {**escuro, **ler_cores(bloco(css, ':root[data-contraste="alto"][data-tema="escuro"] {'))}

    secoes = []
    for grupo, cores in ler_grupos(tema):
        linhas = "".join(
            f"<tr><td><code>{nome}</code></td><td>{html.escape(uso)}</td>{amostra(valor)}{amostra(escuro[nome])}{amostra(alto_claro[nome])}{amostra(alto_escuro[nome])}</tr>"
            for nome, valor, uso in cores
        )
        secoes.append(
            f'<div class="bloco"><h3>{html.escape(grupo)}</h3><table><thead><tr><th>Nome</th><th>Uso</th>'
            f"<th>Claro</th><th>Escuro</th><th>Alto contraste claro</th><th>Alto contraste escuro</th></tr></thead><tbody>{linhas}</tbody></table></div>"
        )

    t_claro, f_claro = tabela_contraste("Tema claro", claro)
    t_escuro, f_escuro = tabela_contraste("Tema escuro", escuro)
    t_alto_claro, f_alto_claro = tabela_contraste("Alto contraste claro", alto_claro, 7)
    t_alto_escuro, f_alto_escuro = tabela_contraste("Alto contraste escuro", alto_escuro, 7)

    DESTINO.write_text(
        f"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>QueroAê: paleta de cores</title>
<style>
  * {{ box-sizing: border-box; margin: 0; }}
  body {{ background: #f4f4f2; color: #1f201d; font: 15px/1.45 system-ui, sans-serif; }}
  main {{ max-width: 1000px; margin: 0 auto; padding: 32px 16px 64px; }}
  h1 {{ font-size: 26px; line-height: 1.2; }}
  h2 {{ margin-top: 36px; font-size: 20px; }}
  h3 {{ margin-bottom: 8px; font-size: 16px; }}
  p {{ margin-top: 8px; max-width: 70ch; color: #4a4a47; }}
  .bloco {{ margin-top: 16px; padding: 16px; background: #fff; border: 1px solid #d9d9d6; border-radius: 14px; overflow-x: auto; }}
  table {{ width: 100%; border-collapse: collapse; font-size: 14px; }}
  th, td {{ padding: 8px 10px 8px 0; border-top: 1px solid #eee; text-align: left; vertical-align: middle; }}
  th {{ border-top: 0; }}
  code {{ font: 13px ui-monospace, SFMono-Regular, Menlo, monospace; }}
  .cor {{ white-space: nowrap; }}
  .am {{ display: inline-block; width: 28px; height: 28px; margin-right: 8px; vertical-align: middle; border: 1px solid rgba(0, 0, 0, .25); border-radius: 8px; }}
  .par {{ display: inline-flex; width: 36px; height: 28px; margin-right: 10px; align-items: center; justify-content: center; border: 1px solid rgba(0, 0, 0, .25); border-radius: 8px; font-weight: 600; }}
  .num {{ white-space: nowrap; font-variant-numeric: tabular-nums; }}
  .ok {{ color: #1f6b25; font-weight: 600; }}
  .falha {{ color: #a02117; font-weight: 600; }}
</style>
</head>
<body>
<main>
  <h1>QueroAê: paleta de cores</h1>
  <p>As cores do sistema nos temas claro e escuro, com e sem alto contraste. Arquivo gerado: as cores vêm de <code>src/index.css</code>. Para atualizar, rode <code>python3 scripts/gerar-paleta.py</code>.</p>
  <h2>Cores</h2>
  {"".join(secoes)}
  <h2>Contraste</h2>
  <p>Medido com a fórmula da WCAG. Texto precisa de 4,5:1, ou 7:1 no alto contraste, e o contorno de elementos da interface, de 3:1.</p>
  {t_claro}
  {t_escuro}
  {t_alto_claro}
  {t_alto_escuro}
</main>
</body>
</html>
""",
        encoding="utf-8",
    )
    print(f"Gerado: {DESTINO.relative_to(RAIZ)}")

    falhas = f_claro + f_escuro + f_alto_claro + f_alto_escuro
    for falha in falhas:
        print(f"ABAIXO DO MÍNIMO: {falha}", file=sys.stderr)
    return 1 if falhas else 0


if __name__ == "__main__":
    sys.exit(main())
