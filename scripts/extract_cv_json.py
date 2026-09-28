#!/usr/bin/env python3
"""Extract the CV data from index.html into a JSON document.

index.html is the single source of truth for the CV: the page has always shown
the real content (data/cv.template.json is a "John Doe" placeholder the page
deliberately ignores). The PDF build therefore reads the page rather than
duplicating the content in a second file that would silently drift.

Usage:
    python3 scripts/extract_cv_json.py [index.html] [-o data/cv.json]

Every string it emits is checked to exist in index.html (or humans.txt for the
contact block), so the extractor cannot invent content: if it ever does it
exits non-zero instead of shipping a CV with made-up text.
"""

from __future__ import annotations

import argparse
import html
import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link",
        "meta", "param", "source", "track", "wbr"}


class Node:
    __slots__ = ("tag", "attrs", "children", "parent", "content")

    def __init__(self, tag, attrs, parent=None):
        self.tag = tag
        self.attrs = attrs
        self.children: list[Node] = []
        self.parent = parent
        # Strings and child nodes interleaved in document order, so text sitting
        # around an inline element keeps its place ("<a>UNLP</a>, Argentina"
        # must not come out as ", Argentina UNLP").
        self.content: list = []

    @property
    def classes(self) -> set[str]:
        return set((self.attrs.get("class") or "").split())

    def walk(self):
        yield self
        for child in self.children:
            yield from child.walk()

    def find_all(self, tag=None, cls=None, pred=None) -> list:
        out = []
        for node in self.walk():
            if node is self:
                continue
            if tag and node.tag != tag:
                continue
            if cls and cls not in node.classes:
                continue
            if pred and not pred(node):
                continue
            out.append(node)
        return out

    def text_of(self) -> str:
        parts = []

        def rec(node):
            if node.tag == "br":
                parts.append(" ")
            for item in node.content:
                if isinstance(item, str):
                    parts.append(item)
                else:
                    rec(item)

        rec(self)
        return re.sub(r"\s+", " ", "".join(parts)).strip()

    def child(self, tag=None, cls=None):
        found = self.find_all(tag=tag, cls=cls)
        return found[0] if found else None


class Tree(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = Node("#document", {})
        self.stack = [self.root]

    def handle_starttag(self, tag, attrs):
        node = Node(tag, {k: (v or "") for k, v in attrs}, self.stack[-1])
        self.stack[-1].children.append(node)
        self.stack[-1].content.append(node)
        if tag not in VOID:
            self.stack.append(node)

    def handle_startendtag(self, tag, attrs):
        node = Node(tag, {k: (v or "") for k, v in attrs}, self.stack[-1])
        self.stack[-1].children.append(node)
        self.stack[-1].content.append(node)

    def handle_endtag(self, tag):
        for i in range(len(self.stack) - 1, 0, -1):
            if self.stack[i].tag == tag:
                del self.stack[i:]
                return

    def handle_data(self, data):
        node = self.stack[-1]
        if node.content and isinstance(node.content[-1], str):
            node.content[-1] += data
        else:
            node.content.append(data)


def parse(path: Path) -> Node:
    tree = Tree()
    tree.feed(path.read_text(encoding="utf-8"))
    return tree.root


def contact_from_humans(path: Path) -> dict:
    """humans.txt declares the public contact details (email is obfuscated)."""
    out = {}
    if not path.exists():
        return out
    for line in path.read_text(encoding="utf-8").splitlines():
        if ":" not in line:
            continue
        key, _, value = line.partition(":")
        key, value = key.strip().lower(), value.strip()
        if key == "contact" and value:
            out["email"] = re.sub(r"\s*\[at\]\s*", "@", value, flags=re.I)
        elif key == "linkedin" and value:
            out["linkedin"] = value
        elif key == "github" and value:
            out["github"] = value
    return out


def extract(root: Node, humans: dict) -> dict:
    def one(cls: str) -> Node:
        node = root.child(cls=cls)
        if node is None:
            raise SystemExit(f"extract_cv_json: could not find .{cls} in index.html")
        return node

    def period(node: Node) -> str:
        span = node.find_all("span", cls="period")
        if not span:
            return ""
        return span[0].attrs.get("data-full") or span[0].text_of()

    def in_grid(grid: str):
        return lambda n: "card" in n.classes and n.parent is not None and grid in n.parent.classes

    header = root.child(tag="header")
    if header is None:
        raise SystemExit("extract_cv_json: no <header> in index.html")

    data = {
        "name": one("name").text_of(),
        "title": one("title").text_of(),
        "location": header.find_all("div", cls="location")[0].text_of(),
        "summary": one("summary").text_of(),
        "contact": dict(humans),
    }
    data["contact"].setdefault("website", "https://nahuelsantos.com")

    data["experience"] = []
    for card in root.find_all("div", pred=lambda n: {"card", "experience-card"} <= n.classes):
        h3 = card.find_all("h3")[0]
        link = h3.find_all("a")
        role, sep, company = h3.text_of().rpartition(" @ ")
        if not sep:
            role, company = h3.text_of(), ""
        loc = card.find_all("p", cls="location")
        item = {
            "role": role.strip(),
            "company": company.strip(),
            "company_url": link[0].attrs.get("href", "") if link else "",
            "location": loc[0].text_of() if loc else "",
            "period": period(card),
            "highlights": [li.text_of() for li in card.find_all("li")],
        }
        if not item["role"] or not item["highlights"]:
            raise SystemExit(f"extract_cv_json: incomplete experience entry: {h3.text_of()!r}")
        data["experience"].append(item)

    data["skills"] = []
    for card in root.find_all("div", pred=in_grid("skills-grid")):
        h3 = card.find_all("h3")
        data["skills"].append({
            "category": h3[0].text_of() if h3 else "",
            "items": [t.text_of() for t in card.find_all("span", cls="tag")],
        })

    data["projects"] = []
    for card in root.find_all("div", pred=in_grid("projects-grid")):
        h3 = card.find_all("h3")
        paras = card.find_all("p")
        links = [a.attrs.get("href", "") for a in card.find_all("a") if a.attrs.get("href")]
        data["projects"].append({
            "name": h3[0].text_of() if h3 else "",
            "description": paras[0].text_of() if paras else "",
            "technologies": [t.text_of() for t in card.find_all("span", cls="tag")],
            "url": links[0] if links else "",
        })

    data["education"] = []
    for section in root.find_all("div", cls="education-section"):
        titles = section.find_all("h3")
        items = []
        for card in section.find_all("div", cls="education-card"):
            h4 = card.find_all("h4")
            inst = card.find_all("p", cls="institution")
            inst_link = inst[0].find_all("a") if inst else []
            desc = [p.text_of() for p in card.find_all("p") if "institution" not in p.classes]
            items.append({
                "title": h4[0].text_of() if h4 else "",
                "institution": inst[0].text_of() if inst else "",
                "institution_url": inst_link[0].attrs.get("href", "") if inst_link else "",
                "period": period(card),
                "description": desc[0] if desc else "",
            })
        data["education"].append({"group": titles[0].text_of() if titles else "Education",
                                  "items": items})

    return data


def strings(obj, path=""):
    out = []
    if isinstance(obj, dict):
        for k, v in obj.items():
            out += strings(v, f"{path}.{k}" if path else k)
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            out += strings(v, f"{path}[{i}]")
    elif isinstance(obj, str):
        out.append((path, obj))
    return out


def self_check(data: dict, root: Node, humans_txt: Path, min_len: int = 4) -> list:
    """Every emitted string must exist verbatim in the page itself.

    Sources: the page's rendered text (tags stripped — "<a>UNLP</a>, Argentina"
    legitimately reads "UNLP, Argentina") plus every attribute value, since the
    company/project/institution URLs live in href="" and are never visible text.
    """
    attrs = [value for node in root.walk() for value in node.attrs.values()]
    haystack = root.text_of() + " " + " ".join(attrs)
    haystack_l = haystack.lower()
    if humans_txt.exists():
        haystack_l += " " + re.sub(r"\s+", " ", humans_txt.read_text(encoding="utf-8")).lower()

    problems = []
    for path, value in strings(data):
        if len(value) < min_len or path.startswith("contact."):
            continue
        if value not in haystack:
            problems.append(f"{path}: {value[:80]!r} not found in index.html")
    email = data.get("contact", {}).get("email", "")
    if email and "@" in email:
        local, _, domain = email.partition("@")
        if f"{local} [at] {domain}".lower() not in haystack_l:
            problems.append(f"contact.email: {email!r} not derivable from humans.txt")
    return problems


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description="Extract CV data from index.html")
    ap.add_argument("html", nargs="?", default="index.html")
    ap.add_argument("-o", "--out", default="data/cv.json")
    ap.add_argument("--stdout", action="store_true", help="print instead of writing")
    ap.add_argument("--no-self-check", action="store_true")
    args = ap.parse_args(argv)

    index_html = Path(args.html)
    humans_txt = index_html.with_name("humans.txt")
    if not index_html.exists():
        raise SystemExit(f"extract_cv_json: {index_html} not found")

    root = parse(index_html)
    data = extract(root, contact_from_humans(humans_txt))

    if not args.no_self_check:
        problems = self_check(data, root, humans_txt)
        if problems:
            print("extract_cv_json: refusing to emit content that is not in the page:", file=sys.stderr)
            for problem in problems:
                print(f"  - {problem}", file=sys.stderr)
            return 2

    text = json.dumps(data, indent=2, ensure_ascii=False) + "\n"
    if args.stdout:
        sys.stdout.write(text)
        return 0

    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(text, encoding="utf-8")
    n_bullets = sum(len(j["highlights"]) for j in data["experience"])
    n_edu = sum(len(g["items"]) for g in data["education"])
    print(f"extract_cv_json: wrote {out} ({len(text)} bytes): {len(data['experience'])} roles / "
          f"{n_bullets} highlights / {len(data['skills'])} skill groups / "
          f"{len(data['projects'])} projects / {n_edu} education entries")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
