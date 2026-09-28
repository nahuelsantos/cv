#!/usr/bin/env python3
"""Render data/cv.json to an ATS-friendly PDF CV.

Usage:
    python3 scripts/generate_cv_pdf.py [data/cv.json] [-o assets/cv.pdf] [--no-verify]

ATS rules this deliberately follows:
  * one column, no tables, no text boxes, no images or icons
  * real text in the standard Helvetica family, so every character is
    extractable by parsers (no outlines, no vectors, no font subsets)
  * conventional section headings ("Experience", "Education", "Skills")
  * contact details as literal text, including the URLs, not only as links
  * no page headers/footers that parsers may merge into the content
  * consistent "Role - Company" then "Location | Period | domain" ordering

With --verify (the default) the produced file is re-read and every string from
the data must be findable in the extracted text. A layout bug that silently
drops content therefore fails the build instead of shipping a truncated CV.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from xml.sax.saxutils import escape

from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (HRFlowable, KeepTogether, Paragraph,
                                SimpleDocTemplate, Spacer)

INK = HexColor("#111111")
MUTED = HexColor("#444444")

BODY = ParagraphStyle("body", fontName="Helvetica", fontSize=10, leading=13.4,
                      textColor=INK, alignment=TA_LEFT, spaceAfter=3)
NAME = ParagraphStyle("name", parent=BODY, fontName="Helvetica-Bold", fontSize=19,
                      leading=22, spaceAfter=1)
ROLE_TITLE = ParagraphStyle("role_title", parent=BODY, fontName="Helvetica-Bold",
                            fontSize=11.5, leading=14, spaceAfter=1)
META = ParagraphStyle("meta", parent=BODY, fontSize=9.5, leading=12,
                      textColor=MUTED, spaceAfter=4)
SECTION = ParagraphStyle("section", parent=BODY, fontName="Helvetica-Bold",
                         fontSize=11, leading=13, spaceBefore=12, spaceAfter=1,
                         textColor=HexColor("#000000"))
SKILLS = ParagraphStyle("skills", parent=BODY, spaceAfter=2.5)
BULLET = ParagraphStyle("bullet", parent=BODY, leftIndent=11, bulletIndent=1,
                        spaceAfter=2.2, alignment=TA_LEFT)
PROJECT_META = ParagraphStyle("project_meta", parent=BODY, fontSize=9.5,
                              leading=12, textColor=MUTED, spaceAfter=0)

# Fields that exist for the page's markup and are intentionally not printed.
NOT_PRINTED = ("group", "period_short", "link_label", "link_icon")
URL_FIELDS = ("company_url", "institution_url", "link", "linkedin", "github", "website")


def esc(value) -> str:
    return escape(str(value or ""))


def link(url: str, text: str | None = None) -> str:
    """Clickable, but the visible text is the URL itself so parsers can read it."""
    return f'<link href="{esc(url)}">{esc(text or url)}</link>'


def bare_domain(url: str) -> str:
    out = (url or "").strip()
    for prefix in ("https://", "http://"):
        if out.startswith(prefix):
            out = out[len(prefix):]
    if out.startswith("www."):
        out = out[4:]
    return out.rstrip("/")


def build_story(data: dict) -> list:
    story: list = []

    story.append(Paragraph(esc(data.get("name")), NAME))
    if data.get("title"):
        story.append(Paragraph(esc(data["title"]), ParagraphStyle(
            "subtitle", parent=BODY, fontSize=11, leading=13, textColor=MUTED)))

    contact = data.get("contact", {})
    bits = []
    if data.get("location"):
        bits.append(esc(data["location"]))
    if contact.get("email"):
        bits.append(link(f"mailto:{contact['email']}", contact["email"]))
    for key in ("linkedin", "github", "website"):
        if contact.get(key):
            bits.append(link(contact[key], bare_domain(contact[key])))
    if bits:
        story.append(Paragraph(" &nbsp;|&nbsp; ".join(bits), META))
    story.append(HRFlowable(width="100%", thickness=0.6, color=HexColor("#999999"),
                            spaceBefore=2, spaceAfter=2))

    if data.get("summary"):
        story.append(Paragraph("PROFESSIONAL SUMMARY", SECTION))
        story.append(Paragraph(esc(data["summary"]), BODY))

    if data.get("experience"):
        story.append(Paragraph("EXPERIENCE", SECTION))
        for job in data["experience"]:
            head = esc(job.get("role"))
            if job.get("company"):
                head += f" &mdash; {esc(job['company'])}"
            block = [Paragraph(head, ROLE_TITLE)]
            meta = [esc(job.get("location"))] if job.get("location") else []
            if job.get("period"):
                meta.append(esc(job["period"]))
            if job.get("company_url"):
                meta.append(esc(bare_domain(job["company_url"])))
            if meta:
                block.append(Paragraph(" | ".join(meta), META))
            for item in job.get("responsibilities", []):
                block.append(Paragraph(esc(item), BULLET, bulletText="\u2022"))
            story.append(KeepTogether(block[:2]))
            story.extend(block[2:])
            story.append(Spacer(1, 4))

    if data.get("skills"):
        story.append(Paragraph("TECHNICAL SKILLS", SECTION))
        for group in data["skills"]:
            line = f"<b>{esc(group.get('title'))}:</b> {esc(', '.join(group.get('skills', [])))}"
            story.append(Paragraph(line, SKILLS))

    if data.get("projects"):
        story.append(Paragraph("PROJECTS", SECTION))
        for project in data["projects"]:
            block = [Paragraph(f"<b>{esc(project.get('name'))}</b>", BODY)]
            if project.get("description"):
                block.append(Paragraph(esc(project["description"]), BODY))
            meta = []
            if project.get("tags"):
                meta.append(esc(", ".join(project["tags"])))
            if project.get("link"):
                meta.append(link(project["link"], bare_domain(project["link"])))
            if meta:
                block.append(Paragraph(" &nbsp;|&nbsp; ".join(meta), PROJECT_META))
            story.append(KeepTogether(block))
            story.append(Spacer(1, 4))

    education = [e for e in data.get("education", []) if "certif" not in (e.get("group") or "").lower()]
    certs = [e for e in data.get("education", []) if "certif" in (e.get("group") or "").lower()]

    def entries(title: str, items: list):
        if not items:
            return
        story.append(Paragraph(title, SECTION))
        for entry in items:
            head = esc(entry.get("degree"))
            if entry.get("institution"):
                head += f" &mdash; {esc(entry['institution'])}"
                if entry.get("location"):
                    head += f", {esc(entry['location'])}"
            block = [Paragraph(head, ROLE_TITLE)]
            meta = []
            if entry.get("period"):
                meta.append(esc(entry["period"]))
            if entry.get("institution_url"):
                meta.append(esc(bare_domain(entry["institution_url"])))
            if meta:
                block.append(Paragraph(" | ".join(meta), META))
            if entry.get("details"):
                block.append(Paragraph(esc(entry["details"]), BODY))
            story.append(KeepTogether(block))
            story.append(Spacer(1, 3))

    entries("EDUCATION", education)
    entries("CERTIFICATIONS", certs)
    return story


def build(data: dict, out: Path) -> None:
    out.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(
        str(out), pagesize=A4,
        leftMargin=18 * mm, rightMargin=18 * mm, topMargin=15 * mm, bottomMargin=15 * mm,
        title=f"{data.get('name', 'CV')} - CV",
        author=data.get("name", ""),
        subject="Curriculum Vitae",
        keywords=", ".join(item for group in data.get("skills", []) for item in group.get("skills", [])),
        compression=1,
    )
    doc.build(build_story(data))


def verify(data: dict, path: Path) -> list:
    try:
        from pypdf import PdfReader
    except ImportError:
        return ["pypdf is not installed: cannot verify the generated PDF"]

    reader = PdfReader(str(path))
    flat = re.sub(r"\s+", " ", " ".join((page.extract_text() or "") for page in reader.pages)).strip()

    problems = []
    if not reader.pages:
        problems.append("the PDF has no pages")
    if re.search(r"john doe", flat, re.I):
        problems.append("the placeholder template content leaked into the PDF")

    def walk(obj, prefix=""):
        if isinstance(obj, dict):
            for k, v in obj.items():
                yield from walk(v, f"{prefix}.{k}" if prefix else k)
        elif isinstance(obj, list):
            for i, v in enumerate(obj):
                yield from walk(v, f"{prefix}[{i}]")
        elif isinstance(obj, str):
            yield prefix, obj

    for key, value in walk(data):
        field = key.rsplit(".", 1)[-1]
        if len(value) < 4 or field in NOT_PRINTED:
            continue
        # URLs are rendered in bare-domain form (readable text beats a scheme
        # nobody reads); section headings come from the generator, not the data.
        needle = bare_domain(value) if field in URL_FIELDS else value
        if needle not in flat:
            problems.append(f"{key}: missing from the PDF text ({needle[:70]!r})")
    return problems


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description="Generate the ATS-friendly CV PDF")
    ap.add_argument("data", nargs="?", default="data/cv.json")
    ap.add_argument("-o", "--out", default="assets/cv.pdf")
    ap.add_argument("--no-verify", action="store_true")
    args = ap.parse_args(argv)

    data_path, out_path = Path(args.data), Path(args.out)
    if not data_path.exists():
        raise SystemExit(f"generate_cv_pdf: {data_path} not found")

    data = json.loads(data_path.read_text(encoding="utf-8"))
    if not data.get("name"):
        raise SystemExit("generate_cv_pdf: the data has no name; refusing to build a CV")

    build(data, out_path)
    size = out_path.stat().st_size

    if not args.no_verify:
        problems = verify(data, out_path)
        if problems:
            print("generate_cv_pdf: the PDF does not match the data:", file=sys.stderr)
            for problem in problems:
                print(f"  - {problem}", file=sys.stderr)
            return 2

    msg = (f"generate_cv_pdf: wrote {out_path} ({size} bytes): {len(data['experience'])} roles, "
           f"{sum(len(j['responsibilities']) for j in data['experience'])} highlights, "
           f"{len(data.get('projects', []))} projects")
    print(msg + (", ATS text layer verified" if not args.no_verify else ""))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
