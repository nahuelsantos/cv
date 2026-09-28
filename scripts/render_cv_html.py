#!/usr/bin/env python3
"""Render index.html's content blocks from data/cv.json.

data/cv.json is the single source of truth for the CV: this script rewrites the
page's content (header, experience, skills, projects, education) from it, and
scripts/generate_cv_pdf.py renders the downloadable PDF from the same file. The
page's chrome (head, nav, contact modal, footer, scripts) is left untouched.

Usage:
    python3 scripts/render_cv_html.py            # update index.html in place
    python3 scripts/render_cv_html.py --check    # fail if index.html is stale

The --check mode runs in CI, so a JSON edit that never reached the page fails
the build instead of shipping a site that disagrees with its own data file.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from html import escape
from pathlib import Path

IND = "    "


def esc(value) -> str:
    """HTML text escaping. The page has always used escaped ampersands in its
    headings; normalising every generated string keeps that consistent."""
    return escape(str(value or ""), quote=False)


def esc_attr(value) -> str:
    return escape(str(value or ""), quote=True)


def header_block(d: dict) -> str:
    contact = d.get("contact", {})
    return f"""{IND}<header class="header">
{IND}{IND}<div class="container">
{IND}{IND}{IND}<h1 class="name">{esc(d.get('name'))}</h1>
{IND}{IND}{IND}<h2 class="title">{esc(d.get('title'))}</h2>
{IND}{IND}{IND}<div class="location">
{IND}{IND}{IND}{IND}<img src="assets/location-pin.svg" alt="location" class="icon">
{IND}{IND}{IND}{IND}{esc(d.get('location'))}
{IND}{IND}{IND}</div>
{IND}{IND}{IND}<div class="summary">
{IND}{IND}{IND}{IND}{esc(d.get('summary'))}
{IND}{IND}{IND}</div>
{IND}{IND}{IND}<div class="actions">
{IND}{IND}{IND}{IND}<button class="btn btn-outline" id="header-contact-btn">
{IND}{IND}{IND}{IND}{IND}<img src="assets/envelope.svg" alt="envelope" class="icon">
{IND}{IND}{IND}{IND}{IND}Contact Me
{IND}{IND}{IND}{IND}</button>
{IND}{IND}{IND}{IND}<a href="{esc_attr(contact.get('linkedin'))}" target="_blank" class="btn btn-outline">
{IND}{IND}{IND}{IND}{IND}<img src="assets/linkedin.svg" alt="linkedin" class="icon">
{IND}{IND}{IND}{IND}{IND}LinkedIn
{IND}{IND}{IND}{IND}</a>
{IND}{IND}{IND}{IND}<a href="{esc_attr(contact.get('github'))}" target="_blank" class="btn btn-outline">
{IND}{IND}{IND}{IND}{IND}<img src="assets/github.svg" alt="github" class="icon">
{IND}{IND}{IND}{IND}{IND}GitHub
{IND}{IND}{IND}{IND}</a>
{IND}{IND}{IND}{IND}<a href="assets/cv.pdf" id="download-cv" class="btn btn-outline">
{IND}{IND}{IND}{IND}{IND}<img src="assets/download-alt.svg" alt="download" class="icon">
{IND}{IND}{IND}{IND}{IND}Download CV
{IND}{IND}{IND}{IND}</a>
{IND}{IND}{IND}</div>
{IND}{IND}</div>
{IND}</header>"""


def experience_block(d: dict) -> str:
    cards = []
    for job in d.get("experience", []):
        bullets = "\n".join(
            f"{IND * 5}<li>{esc(item)}</li>" for item in job.get("responsibilities", []))
        cards.append(f"""{IND * 3}<div class="card experience-card">
{IND * 4}<div class="experience-header">
{IND * 5}<h3>{esc(job.get('role'))} @ <a href="{esc_attr(job.get('company_url'))}" target="_blank" class="company-link">{esc(job.get('company'))}</a></h3>
{IND * 5}<span class="period" data-full="{esc_attr(job.get('period'))}" data-short="{esc_attr(job.get('period_short') or job.get('period'))}">{esc(job.get('period'))}</span>
{IND * 4}</div>
{IND * 4}<p class="location">{esc(job.get('location'))}</p>
{IND * 4}<ul class="responsibilities">
{bullets}
{IND * 4}</ul>
{IND * 3}</div>""")
    body = f"\n\n".join(cards)
    return f"""{IND}<section class="section" id="experience">
{IND * 2}<div class="container">
{IND * 3}<h2 class="section-title">Experience</h2>
{IND * 3}
{body}
{IND * 2}</div>
{IND}</section>"""


def skills_block(d: dict) -> str:
    cards = []
    for group in d.get("skills", []):
        tags = "\n".join(f"{IND * 6}<span class=\"tag\">{esc(skill)}</span>"
                         for skill in group.get("skills", []))
        cards.append(f"""{IND * 4}<div class="card">
{IND * 5}<h3>{esc(group.get('title'))}</h3>
{IND * 5}<div class="tag-container">
{tags}
{IND * 5}</div>
{IND * 4}</div>""")
    body = "\n\n".join(cards)
    return f"""{IND}<section class="section section-alt" id="skills">
{IND * 2}<div class="container">
{IND * 3}<h2 class="section-title">Technical Skills</h2>
{IND * 3}
{IND * 3}<div class="skills-grid">
{body}
{IND * 3}</div>
{IND * 2}</div>
{IND}</section>"""


def projects_block(d: dict) -> str:
    cards = []
    for project in d.get("projects", []):
        tags = "\n".join(f"{IND * 6}<span class=\"tag\">{esc(tag)}</span>"
                         for tag in project.get("tags", []))
        label = project.get("link_label") or "View on GitHub"
        icon = project.get("link_icon")
        icon_line = f"\n{IND * 6}<img src=\"{esc_attr(icon)}\" alt=\"github\" class=\"icon\">" if icon else ""
        cards.append(f"""{IND * 4}<div class="card">
{IND * 5}<div class="card-header">
{IND * 6}<h3>{esc(project.get('name'))}</h3>
{IND * 5}</div>
{IND * 5}<p>{esc(project.get('description'))}</p>
{IND * 5}<div class="tag-container">
{tags}
{IND * 5}</div>
{IND * 5}<a href="{esc_attr(project.get('link'))}" target="_blank" class="btn btn-outline">{icon_line}
{IND * 6}{esc(label)}
{IND * 5}</a>
{IND * 4}</div>""")
    body = "\n\n".join(cards)
    return f"""{IND}<section class="section" id="projects">
{IND * 2}<div class="container">
{IND * 3}<h2 class="section-title">Projects</h2>

{IND * 3}<div class="projects-grid">
{body}
{IND * 3}</div>
{IND * 2}</div>
{IND}</section>"""


def education_block(d: dict) -> str:
    groups: list[tuple[str, list]] = []
    for entry in d.get("education", []):
        name = entry.get("group") or "Education"
        if groups and groups[-1][0] == name:
            groups[-1][1].append(entry)
        else:
            groups.append((name, [entry]))

    sections = []
    for name, entries in groups:
        cards = []
        for entry in entries:
            link = entry.get("institution_url")
            if link:
                institution = (f'<a href="{esc_attr(link)}" target="_blank" '
                               f'class="institution-link">{esc(entry.get("institution"))}</a>')
            else:
                institution = esc(entry.get("institution"))
            location = entry.get("location")
            if location:
                institution += f", {esc(location)}"
            cards.append(f"""{IND * 5}<div class="card education-card">
{IND * 6}<div class="education-header">
{IND * 7}<h4>{esc(entry.get('degree'))}</h4>
{IND * 7}<span class="period" data-full="{esc_attr(entry.get('period'))}" data-short="{esc_attr(entry.get('period_short') or entry.get('period'))}">{esc(entry.get('period'))}</span>
{IND * 6}</div>
{IND * 6}<p class="institution">{institution}</p>
{IND * 6}<p>{esc(entry.get('details'))}</p>
{IND * 5}</div>""")
        body = "\n\n".join(cards)
        sections.append(f"""{IND * 4}<div class="education-section">
{IND * 5}<h3>{esc(name)}</h3>
{IND * 5}
{body}
{IND * 4}</div>""")
    body = "\n\n".join(sections)
    return f"""{IND}<section class="section section-alt" id="education">
{IND * 2}<div class="container">
{IND * 3}<h2 class="section-title">Education &amp; Certifications</h2>
{IND * 3}
{IND * 3}<div class="education-grid">
{body}
{IND * 3}</div>
{IND * 2}</div>
{IND}</section>"""


BLOCKS = (
    (re.compile(r'^    <header class="header">\n.*?\n    </header>$', re.S | re.M), header_block),
    (re.compile(r'^    <section class="section" id="experience">\n.*?\n    </section>$', re.S | re.M), experience_block),
    (re.compile(r'^    <section class="section section-alt" id="skills">\n.*?\n    </section>$', re.S | re.M), skills_block),
    (re.compile(r'^    <section class="section" id="projects">\n.*?\n    </section>$', re.S | re.M), projects_block),
    (re.compile(r'^    <section class="section section-alt" id="education">\n.*?\n    </section>$', re.S | re.M), education_block),
)


def render(page: str, data: dict) -> str:
    for pattern, builder in BLOCKS:
        matches = pattern.findall(page)
        if len(matches) != 1:
            raise SystemExit(f"render_cv_html: expected exactly one match for {pattern.pattern[:60]!r}, "
                             f"found {len(matches)}")
        page = pattern.sub(lambda _m, b=builder: b(data), page, count=1)
    return page


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description="Render index.html from data/cv.json")
    ap.add_argument("--data", default="data/cv.json")
    ap.add_argument("--html", default="index.html")
    ap.add_argument("--check", action="store_true",
                    help="exit 1 if the page is not already in sync (no write)")
    args = ap.parse_args(argv)

    data_path, html_path = Path(args.data), Path(args.html)
    if not data_path.exists():
        raise SystemExit(f"render_cv_html: {data_path} not found")
    data = json.loads(data_path.read_text(encoding="utf-8"))
    if not data.get("name") or not data.get("experience"):
        raise SystemExit("render_cv_html: refusing to render from data without a name/experience")

    current = html_path.read_text(encoding="utf-8")
    rendered = render(current, data)

    if rendered == current:
        print(f"render_cv_html: {html_path} is in sync with {data_path}")
        return 0
    if args.check:
        print(f"render_cv_html: {html_path} is OUT OF SYNC with {data_path} "
              f"(run: python3 scripts/render_cv_html.py)", file=sys.stderr)
        return 1

    html_path.write_text(rendered, encoding="utf-8")
    print(f"render_cv_html: wrote {html_path} from {data_path} "
          f"({len(current)} -> {len(rendered)} bytes)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
