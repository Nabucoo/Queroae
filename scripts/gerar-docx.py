"""Gera docs/registro-de-mudancas.docx a partir de docs/registro-de-mudancas.md.

O .md é o original; o .docx é só para entregar/imprimir. Rodar sempre que o
registro for atualizado:

    python3 scripts/gerar-docx.py

Entende o Markdown usado no registro: títulos (#, ##, ###), parágrafos,
listas (- e 1.), tabelas, blocos de código (```), **negrito**, *itálico* e
`código`. Comentários HTML (<!-- -->) são ignorados.
"""

import re
from pathlib import Path

from docx import Document
from docx.shared import Pt

RAIZ = Path(__file__).resolve().parent.parent
ORIGEM = RAIZ / "docs" / "registro-de-mudancas.md"
DESTINO = RAIZ / "docs" / "registro-de-mudancas.docx"

# **negrito**, *itálico* ou `código`
TRECHO = re.compile(r"(\*\*.+?\*\*|\*.+?\*|`.+?`)")


def escrever_trechos(paragrafo, texto):
    """Escreve o texto no parágrafo aplicando negrito, itálico e código."""
    for parte in TRECHO.split(texto):
        if not parte:
            continue
        if parte.startswith("**") and parte.endswith("**"):
            paragrafo.add_run(parte[2:-2]).bold = True
        elif parte.startswith("`") and parte.endswith("`"):
            run = paragrafo.add_run(parte[1:-1])
            run.font.name = "Consolas"
        elif parte.startswith("*") and parte.endswith("*"):
            paragrafo.add_run(parte[1:-1]).italic = True
        else:
            paragrafo.add_run(parte)


def celulas(linha):
    return [c.strip() for c in linha.strip().strip("|").split("|")]


def gerar():
    linhas = ORIGEM.read_text(encoding="utf-8").splitlines()
    linhas = re.sub(r"<!--.*?-->", "", "\n".join(linhas), flags=re.S).splitlines()

    doc = Document()
    doc.styles["Normal"].font.name = "Calibri"
    doc.styles["Normal"].font.size = Pt(11)

    i = 0
    while i < len(linhas):
        linha = linhas[i]
        limpa = linha.strip()

        if not limpa or limpa == "---":
            i += 1
            continue

        # Bloco de código
        if limpa.startswith("```"):
            i += 1
            codigo = []
            while i < len(linhas) and not linhas[i].strip().startswith("```"):
                codigo.append(linhas[i])
                i += 1
            p = doc.add_paragraph()
            run = p.add_run("\n".join(codigo))
            run.font.name = "Consolas"
            run.font.size = Pt(9)
            i += 1
            continue

        # Títulos
        titulo = re.match(r"^(#{1,3})\s+(.*)", limpa)
        if titulo:
            nivel = len(titulo.group(1)) - 1  # '#' vira o título do documento
            h = doc.add_heading(level=nivel)
            escrever_trechos(h, titulo.group(2))
            i += 1
            continue

        # Tabela: linha com | seguida de linha separadora |---|
        if limpa.startswith("|") and i + 1 < len(linhas) and re.match(
            r"^\|?\s*:?-{3,}", linhas[i + 1].strip()
        ):
            cabecalho = celulas(limpa)
            i += 2
            corpo = []
            while i < len(linhas) and linhas[i].strip().startswith("|"):
                corpo.append(celulas(linhas[i]))
                i += 1
            tabela = doc.add_table(rows=1, cols=len(cabecalho))
            tabela.style = "Table Grid"
            for celula, texto in zip(tabela.rows[0].cells, cabecalho):
                p = celula.paragraphs[0]
                escrever_trechos(p, texto)
                for run in p.runs:
                    run.bold = True
            for valores in corpo:
                linha_tabela = tabela.add_row().cells
                for celula, texto in zip(linha_tabela, valores):
                    escrever_trechos(celula.paragraphs[0], texto)
            continue

        # Listas
        item = re.match(r"^(\s*)([-*]|\d+\.)\s+(.*)", linha)
        if item:
            numerada = item.group(2)[0].isdigit()
            estilo = "List Number" if numerada else "List Bullet"
            if len(item.group(1)) >= 2:
                estilo += " 2"
            escrever_trechos(doc.add_paragraph(style=estilo), item.group(3))
            i += 1
            continue

        # Parágrafo: junta linhas seguidas até uma linha vazia ou outro bloco
        texto = [limpa]
        i += 1
        while i < len(linhas):
            prox = linhas[i].strip()
            if not prox or re.match(r"^(#|```|\||[-*]\s|\d+\.\s|---)", prox):
                break
            texto.append(prox)
            i += 1
        # Cada linha do .md vira uma linha do parágrafo (ex.: **Data:** e **Telas:**)
        p = doc.add_paragraph()
        for n, parte in enumerate(texto):
            if n:
                p.add_run().add_break()
            escrever_trechos(p, parte)

    doc.save(DESTINO)
    print(f"Gerado: {DESTINO.relative_to(RAIZ)}")


if __name__ == "__main__":
    gerar()
