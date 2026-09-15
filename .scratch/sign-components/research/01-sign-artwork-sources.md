# Research: Where does official sign artwork come from?

**Ticket:** [`../issues/01-where-does-official-sign-artwork-come-from.md`](../issues/01-where-does-official-sign-artwork-come-from.md)
**Map:** [`../map.md`](../map.md)
**Date of research:** 2026-09-15
**Status:** findings only — no recommendation (ticket 02 owns the pipeline decision)

> **Not legal advice.** Several points below are legal judgement calls. Where that
> is true it is flagged explicitly as **[judgement call]**. Nothing here has been
> reviewed by a lawyer.

**Confidence markers used below:**
`[verified]` = I fetched the page/file and the claim is on it.
`[inferred]` = reasonable deduction, not directly stated by a source.
`[unclear]` = genuinely ambiguous; do not build on it without checking.

---

## TL;DR

- Sweden: **official vector artwork exists and is downloadable** — Transportstyrelsen
  serves Adobe Illustrator EPS for every sign in the A–Y series, in a predictable
  URL pattern, alongside the PNGs the site links. Transportstyrelsen states in
  writing that road-sign files "may be used freely for various purposes without
  Transportstyrelsen's approval".
- The design itself is almost certainly not copyright-restricted in Sweden
  (Copyright Act §9), but the restriction that *does* exist is a different kind:
  the Vägmärkesförordning restricts who may **erect** signs and forbids devices
  that can be **confused with** real road signs. That is a road-traffic rule about
  physical roadside objects, not a copyright rule about pictures.
- Other jurisdictions, one line each (detail in Q4):
  **US** is the strongest — FHWA publishes SVG + EPS + PDF for the whole current
  sign set, free, and the MUTCD explicitly disclaims copyright in the designs
  (three named trade-mark carve-outs, chiefly the Interstate Shield).
  **GB** publishes ~600 EPS under OGL v3 but the set dates from 1995, so TSRGD
  2016 signs exist only as PDF working drawings.
  **AU** is the problem case — the authoritative spec (AS 1743) is paywalled by
  Standards Australia, no official vector set exists, and the open set is small
  and rests on a copyright theory Australian law appears hostile to.
- **The four jurisdictions agree on almost nothing about format.** Only the US
  ships SVG; none ships a sprite; none uses a shared canvas or normalised viewBox;
  each keys files by its own sign-code scheme; each specifies colour in a different
  system. Whatever ingests this will be four adapters, not one.

---

## Q1 — Does a Swedish official body publish sign artwork as vectors?

### Yes: Transportstyrelsen serves EPS for every sign series

The sign pages under `transportstyrelsen.se/sv/vagtrafik/trafikregler-och-vagmarken/vagmarken/`
list every sign, each linking through a redirector (`/link/<32-hex>.aspx`) to a
**PNG** in `/globalassets/global/vag/vagmarken2/…`. `[verified]`

Example (warning sign A1, dangerous curve):

```
https://www.transportstyrelsen.se/link/316e25e7b16d4eec97e8637bcfe61f33.aspx
  → 301 → /globalassets/global/vag/vagmarken2/a.-varningsmarken/a01.-varning-for-farlig-kurva/a1-1.png
```

**An EPS sits beside each PNG at the same path with the extension swapped.**
`[verified]` — I probed this directly:

| Series | Example asset path (swap `.png` → `.eps`) | EPS HTTP | EPS size |
|---|---|---|---|
| A Varningsmärken | `a.-varningsmarken/a01.-varning-for-farlig-kurva/a1-1` | 200 | 737 KB |
| B Väjningspliktsmärken | `b.-vajningspliktsmarken/b08.-cykeloverfart/b8-1` | 200 | 1.83 MB |
| C Förbudsmärken | `c.-forbudsmarken/c23.-begransat-axeltryck/c23-1` | 200 | 610 KB |
| D Påbudsmärken | `d.-pabudsmarken/d10.-…/d10-1` | 200 | 607 KB |
| E Anvisningsmärken | `e.-anvisningsmarken/e03.-motortrafikled/e3-1` | 200 | 680 KB |
| J Upplysningsmärken | `j.-upplysningsmarken/j02.-upplysningsmarke/j2-1` | 200 | 1.21 MB |
| S Symboler | `s.-symboler/s07.-motorcykel/s7-1` | 200 | 435 KB |
| T Tilläggstavlor | `t.-tillaggstavlor/t13.-flervagsvajning/t13-1` | 200 | 494 KB |

`.svg`, `.ai`, `.pdf` and `.jpg` all return 404 at those paths. **EPS is the only
vector format offered.** `[verified]`

I downloaded `a1-1.eps` and inspected it. `[verified]` Header:

```
%!PS-Adobe-3.0 EPSF-3.0
%%Creator: Adobe Illustrator(R) 8.0
%%AI8_CreatorVersion: 12.0.0
%%For: (Erik Kilström) (Kilström GF)
%%Title: (A1-1.eps)
%%CreationDate: 07-06-07 15.57
%%BoundingBox: 193 93 651 499
%%HiResBoundingBox: 193.7837 93.4414 650.0674 498.4683
%%DocumentCustomColors: (PANTONE 116 C) (PANTONE 185 C)
%%CMYKCustomColor: 0 0.16 1 0 (PANTONE 116 C)
%%+ 0 0.51 1 0.01 (PANTONE 152 C)
%%+ 0 0.91 0.76 0 (PANTONE 185 C)
%%+ 1 0.68 0 0.54 (PANTONE 282 C)
%%+ 1 0.58 0 0.21 (PANTONE 294 C)
%%+ 1 0 0.65 0.3 (PANTONE 335 C)
%%+ 0.05 0 0 0.45 (PANTONE 430 C)
%%+ 0 0.52 1 0.62 (PANTONE 469 C)
```

Two things worth noting: it is a genuine Illustrator-8 EPS (real vector paths,
dated 2007-06-07 — i.e. produced for the current Vägmärkesförordning, which came
into force 2007-06-01), and **its spot colours are exactly the official colour
table** (see Q5). This is production sign artwork, not a web illustration.

### The stated terms of use

Transportstyrelsen's press-images page carries two *separate* paragraphs — this
distinction matters. Verbatim from
<https://www.transportstyrelsen.se/sv/om-oss/pressrum/pressbilder/> `[verified]`:

> Här hittar du högupplösta bilder på exempelvis trafikslag och trängselskatt.
> Bilderna får användas fritt för redaktionellt syfte.
> Användning av bilderna i kommersiellt syfte är inte tillåtet. Bilderna får inte
> förvanskas och du måste alltid ange fotograf vid publicering om det finns
> angivet i anslutning till bilden.
>
> **Vägmärken**
> Du kan ladda ner filer av vägmärken och använda fritt för olika ändamål utan
> Transportstyrelsens godkännande. Ett önskemål är att vägmärken endast används i
> sitt rätta sammanhang på webb eller i tryck då deras budskap är viktigt. Regler
> för vem som får sätta upp vägmärken som riktar sig till trafikanter finns i
> vägmärkesförordningen.

Translation of the road-sign paragraph: *"You can download files of road signs and
use them freely for various purposes without Transportstyrelsen's approval. A
request is that road signs are only used in their proper context on the web or in
print, since their message is important. Rules for who may erect road signs
directed at road users are in the Road Signs Ordinance."*

Reading of this:

- The "not permitted for commercial purposes" sentence belongs to the **photo**
  paragraph (trafikslag, trängselskatt, photographer credit). The **Vägmärken**
  paragraph is a separate heading with its own, unrestricted, wording.
  `[judgement call]` — the page does not say "the above does not apply to road
  signs", so someone could read the commercial restriction as covering the whole
  page. The structure (separate `<h2>`, different subject, different rationale)
  points the other way, and the Q3 analysis makes the point largely moot because
  the signs are probably not copyrightable at all.
- "Ett önskemål" = "a wish/request", explicitly not a condition. `[verified]`
- The only hard pointer is to the Vägmärkesförordning, and that governs **erecting
  physical signs**, not publishing pictures. See Q3.

**Important caveat `[verified]`:** the EPS files are *not linked* from the current
site UI — the sign pages link only the PNG. The page that promises downloadable
"filer av vägmärken" is the press room, which links back to the sign index. So the
EPS is served from the public asset tree but is effectively undocumented. It is
not behind auth and not disallowed, but nobody at Transportstyrelsen has written
"here are the EPS files" on a page I could find. `[unclear]` whether the EPS set
is an intentional public deliverable or a leftover from an older site version.
Worth an email to Transportstyrelsen to convert this into a written permission.

### Other official Swedish artefacts

- **Tratex** — the official road-sign typeface, free to download from
  Transportstyrelsen as TrueType and PostScript for Windows/Linux and Mac,
  including Sámi characters. `[verified]`
  <https://www.transportstyrelsen.se/sv/vagtrafik/trafikregler-och-vagmarken/trafikregler/om-vagmarken/teckensnitt/>
  Files: `/globalassets/global/vag/vagmarken/teckensnitt/tratex_win.zip`,
  `…/tratex_mac_2.zip`. Variants: Tratexsvart, Tratexvit, TRATEXPOSVERSAL,
  TRATEXNEGVERSAL. The page states only that quality cannot be guaranteed; **no
  formal licence text is given** `[unclear]`. Relevant because any sign carrying
  a numeral or legend (speed limits, distance plates) must use Tratex to be
  "exact".
- **Vägmärkesförordning (2007:90)** — the legal instrument that defines the signs.
  The riksdagen HTML full text is *without images*; Transportstyrelsen's own page
  says to consult the printed SFS for the appearance of the signs. `[verified]`
  <https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/vagmarkesforordning-200790_sfs-2007-90/>
- **TSFS 2019:74** — Transportstyrelsen's föreskrifter och allmänna råd om
  vägmärken och andra anordningar; this is where sizes, proportions,
  retroreflection and placement live. Consolidated PDF (3.9 MB):
  <https://www.transportstyrelsen.se/TSFS/TSFS%202019_74k.pdf> `[verified: file
  downloads, 200]`. Amended by TSFS 2024:4 (ändr. 7 kap. 11 §, 8 kap. 2 §; ny
  8 kap. 45 a §), in force 2024-03-01 — an amendment, **not** a replacement.
  `[verified]` I did not read the PDF body, so treat "this is where the
  dimensions are" as `[inferred]` from its title and from the regulation index.
- **Colour table** — see Q5.
- **Sveriges vägmärken (affisch)** — a printed poster is now the only printed
  road-sign material Transportstyrelsen publishes; the old brochure is
  discontinued. `[verified]`

### Sign taxonomy (useful for library scoping)

The official series, from the Transportstyrelsen index `[verified]`:
A Varningsmärken · B Väjningspliktsmärken · C Förbudsmärken · D Påbudsmärken ·
E Anvisningsmärken · F Lokaliseringsmärken för vägvisning (+ separate F for
gång- och cykeltrafik) · G Lokaliseringsmärken för allmänna inrättningar ·
H Serviceanläggningar · I Turistiskt intressanta mål · J Upplysningsmärken ·
M Vägmarkeringar · P Tecken av polisman · S Symboler · T Tilläggstavlor ·
SIG Trafiksignaler · V Tecken av vakt · X Andra anordningar för anvisningar ·
Y Signaler vid korsning med järnväg.

Link counts I observed per section page: A=41, B=8, C=46, D=12, E=34, J=2, S=13,
T=25. `[verified]` The F/G/H/I *lokaliseringsmärken* index page returned **0**
asset links — those are route-guidance signs whose content is composed
(place names, numbers) rather than fixed artwork, so they may be handled
differently. `[unclear]`

---

## Q2 — What do the open sets contain for Sweden?

### Wikimedia Commons

- `Category:Road signs of Sweden` is a **redirect** to
  [`Category:Road signs in Sweden`](https://commons.wikimedia.org/wiki/Category:Road_signs_in_Sweden).
  `[verified]`
- `Category:Road signs in Sweden` — ~139 files, 24 subcategories, but these are
  mostly **photographs** of signs in situ. `[verified]`
- The useful one is
  [`Category:SVG road signs in Sweden`](https://commons.wikimedia.org/wiki/Category:SVG_road_signs_in_Sweden)
  — 85 files directly, 10 subcategories: SVG additional (86 F), warning (91 F),
  prohibitory (91 F), information (100 F), mandatory (43 F), priority (11 F),
  service (44 F), tourist (4 F), historic (4 F), unofficial (1 F). Order of
  400–500 SVG files total. `[verified]`

### Fidelity

Sampled three files `[verified]`:

| File | Licence | Source claimed | Author claimed | Nominal size |
|---|---|---|---|---|
| `Sweden_road_sign_B1.svg` (väjningsplikt) | `PD-Transportstyrelsen` | Swedish Transport Agency | "Government of the Kingdom of Sweden" | 806.87 × 716.5 |
| `Sweden_road_sign_A1-1.svg` | `PD-Transportstyrelsen` | transportstyrelsen.se | Government of Sweden | 608 × 540 |
| `Sweden_road_sign_C31-3.svg` (30 km/h) | `PD-Transportstyrelsen` | Transportstyrelsen | Transportstyrelsen | 1000 × 1000 |

Notes:

- Several files **claim Transportstyrelsen as the source**, i.e. they are traced
  or converted from the official artwork rather than eyeballed. `[verified: the
  file pages say so]` — but "source: Transportstyrelsen" on a Commons page is an
  uploader's assertion, not a verified provenance chain. `[judgement call]`
- `A1-1.svg` at 608 × 540 has aspect ratio 1.1259; the official `A1-1.eps`
  bounding box is 456.28 × 405.03 pt = 1.1266. Consistent to ~0.06%, which is
  what you'd expect from an EPS→SVG conversion. `[inferred]` — good evidence for
  that file specifically, nothing about the other 400.
- **Fidelity is per-file, not per-set.** There is no Commons-wide QA process
  against TSFS 2019:74. Some files are hand-authored in a text editor
  (`A1-1.svg`'s description says exactly that). Anything that matters for a
  correct answer — stroke widths, corner radii, arrow geometry, the exact
  Tratex glyphs on a numeral sign — would need per-sign checking against the
  official EPS. This is the single biggest practical caveat on the open set.

### Licences on the drawings

- `{{PD-Transportstyrelsen}}` is the dominant template. Verbatim `[verified]`:
  > "This image is in the **public domain** because it depicts a Swedish road sign
  > produced by the Swedish Transport Agency (Transportstyrelsen). The image may
  > be used freely (see Template talk:PD-Transportstyrelsen for proof). Other
  > images than road signs published by Vägverket are not necessarily free from
  > copyright."
  <https://commons.wikimedia.org/wiki/Template:PD-Transportstyrelsen>
- The "proof" on
  [Template talk:PD-Transportstyrelsen](https://commons.wikimedia.org/wiki/Template_talk:PD-Transportstyrelsen)
  is `[verified]`: (a) the Transportstyrelsen website statement quoted in Q1
  (recorded on the talk page 2012-05-16, URL updated December 2016); (b) an
  earlier email a user reported from the road administration saying road signs
  have no copyright and are free to distribute, the only limit being that they
  must not be placed on actual roads so as to confuse drivers (citing the old
  Vägmärkesförordningen 1978:1001 § 85). Only minor dissent was recorded (one
  user asking whether press images are restricted to news use; answered by
  observing the signs are not copyrightable anyway).
  **Note:** (b) is a second-hand report of an email, not a published permission.
  Treat it as weak evidence. `[judgement call]`
- Commons' own territory page lists `{{PD-Transportstyrelsen}}` under Sweden
  explicitly for "Swedish road signs from the website of the Swedish Transport
  Agency", alongside `{{PD-Sweden-URL9}}` (works excluded by §9) and
  `{{PD-Sjöfartsverket}}`. `[verified]`
  <https://commons.wikimedia.org/wiki/Commons:Copyright_rules_by_territory/Sweden>
- Commons site-wide: structured data is CC0, unstructured text CC BY-SA; **file
  licences are per-file** and you must read each file page. `[verified]`

### Other open sets

Third-party commercial/clip-art vector packs of Swedish signs exist (e.g.
Vectorportal) but they are redrawings of unverified fidelity under their own
terms, and they add licence risk without adding accuracy. Noted for completeness
only; not investigated further. `[verified: they exist]` / `[inferred: fidelity]`

---

## Q3 — Licence on a *drawing* vs restriction on the *design* (Sweden)

These are genuinely two separate questions and it is worth keeping them apart.

### (a) Copyright in the design

The relevant law is **lag (1960:729) om upphovsrätt till litterära och
konstnärliga verk (URL)**, § 9. Verbatim `[verified]`:

> **9 §** Upphovsrätt gäller inte till
> 1. författningar,
> 2. beslut av myndigheter,
> 3. yttranden av svenska myndigheter och
> 4. officiella översättningar av sådant som avses i 1–3.

So statutes and authority decisions are outside copyright. But § 9 has a
**second paragraph that claws some things back**: copyright *does* subsist in
works that are contained in such documents and are (1) maps, (2) **alster av
bildkonst** (works of pictorial art), (3) musical works, or (4) poetic works.
`[verified]`

And § 26 a then partially re-opens even those `[verified]`:

> **26 a §** Var och en får återge verk, vilka ingår i de handlingar som avses i
> 9 § första stycket och är av de slag som anges i 9 § andra stycket 2–4.

i.e. anyone may reproduce pictorial-art / musical / poetic works contained in
statutes and authority decisions — with a remuneration rule attached in the rest
of the section, subject to exceptions for public-authority activity and legal
proceedings.

What this means for road signs `[judgement call]`:

1. The sign designs are defined in Vägmärkesförordningen (2007:90) — a
   *författning* — so § 9 first paragraph engages.
2. Whether a sign pictogram is an "alster av bildkonst" is the live question.
   Sweden applies a comparatively **low threshold of originality** (Commons'
   territory page notes Swedish courts are stricter than the US about how easily
   something qualifies as a protected work) `[verified: that Commons says so]`,
   so you cannot simply assume a pictogram falls below it. But road-sign
   pictograms are functional, standardised and largely inherited from the Vienna
   Convention; the usual view is they are not protected. `[judgement call]`
3. Even if a pictogram *were* an alster av bildkonst, § 26 a gives everyone the
   right to reproduce it, because it is contained in a författning. The
   remuneration rule in § 26 a is the residual exposure and I have not chased its
   exact scope. `[unclear]`
4. Separately from all of that, Transportstyrelsen has published an explicit
   statement that the files may be used freely (Q1). **That statement is the
   strongest practical basis** — it does not depend on winning the § 9 argument.

Bottom line: I could find **no copyright-based restriction on reproducing Swedish
road-sign designs**, and an affirmative official statement permitting free use.
The residual legal uncertainty is narrow and is a judgement call, not a finding.

### (b) Non-copyright restrictions: the Vägmärkesförordning

This is the restriction that actually exists, and it is **not about pictures**.

**Vägmärkesförordning (2007:90)** `[verified]`
<https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/vagmarkesforordning-200790_sfs-2007-90/>
and <https://lagen.nu/2007:90>:

- **1 kap. 6 §** assigns responsibility for erecting, maintaining and removing
  traffic devices — municipalities inside built-up areas, the state road
  authority on state roads, railway/tram operators at crossings, police and
  customs for enforcement signage:
  > "Den som anges nedan ansvarar för att sådana anordningar och tecken för
  > anvisning för trafiken som avses i 1 § sätts upp, tas bort, underhålls och
  > utförs i den omfattning som anges för respektive plats."
- **1 kap. 5 §** forbids adding anything to a sign or its supporting structure
  that is unrelated to the sign's purpose `[verified verbatim]`:
  > "Ett vägmärke, en annan anordning för anvisningar för trafiken, en stolpe
  > eller motsvarande som är avsedd att bära upp eller visa ett märke eller en
  > anordning får inte förses med någonting som saknar samband med märkets eller
  > anordningens ändamål. Förordning (2017:923)."
- **8 kap. 4 §** is the key provision. `[verified verbatim, anchor `K8P4` on
  lagen.nu]`:
  > "Anordningar enligt denna förordning får inte sättas upp, underhållas eller
  > tas bort av någon annan än den som enligt 1 kap. 6 § ansvarar för åtgärden
  > eller av den som han eller hon anlitar. Sådana åtgärder får inte heller
  > utföras på något annat sätt än som anges i denna förordning eller i
  > föreskrifter som meddelats med stöd av den. **Inte heller får någon sätta upp
  > en anordning som kan förväxlas med eller har samma innebörd som en anordning
  > enligt denna förordning.**"

  Note the operative verb throughout is **"sätta upp"** — *to erect*. The
  prohibition is on physically putting up a confusable device, not on drawing,
  publishing or reproducing one. The predecessor provision was VMF 1978:1001
  § 85, cited on the Commons talk page. `[verified]`

The whole apparatus is about **physical objects at the roadside that a driver
could mistake for a real instruction** — 8 kap. 4 § reaches only the act of
*erecting* ("sätta upp"). It is `[inferred, but with high confidence]` irrelevant
to a static image in an exam question, a diagram, or a generated scene, and
nothing I found suggests otherwise. Transportstyrelsen's own
press-room wording points to exactly this distinction: it permits free use of the
files and then says "rules for **who may erect** road signs directed at road users
are in the Vägmärkesförordning".

`[judgement call]` The one grey zone is a photorealistic generated image that
someone could physically print and put beside a road. That is a *use* question,
not a *sourcing* question, and Transportstyrelsen's "önskemål" about using signs
"in their proper context" gestures at it without creating a rule.

### (c) No trade-mark-style restriction found

I found **no** Swedish equivalent of a "must not imply official authority"
trademark regime over sign designs, and no Crown-copyright-style claim. `[verified:
absence of evidence after searching official sources]` — an absence, so weaker
than a positive finding.

---

## Q4 — GB, US and AU

`src/scene/jurisdictions.ts` currently lists SE, GB, US, AU. `[verified]` Note the
GB entry is **labelled "United Kingdom" but coded `GB`** — a real distinction here,
because TSRGD 2016 covers England, Scotland and Wales only; **Northern Ireland has
its own traffic signs regulations**. If the label is taken literally the library
would be under-specified for NI. `[verified: code] / [inferred: the NI consequence]`

### Summary table

| | SE | GB | US | AU |
|---|---|---|---|---|
| Official vector, editable | **EPS**, complete A–Y, current | **EPS** (~600 signs, 1995-era, pre-2016 coverage) + vector PDF working drawings | **SVG + EPS + PDF**, complete, current, free | **None** — vector PDF drawings only |
| Licence position | Official statement: free use, no approval needed; designs likely outside copyright (URL § 9) | OGL v3 / Crown copyright, plus "accurate + non-misleading" conditions | Public domain per MUTCD's own clause + 17 USC § 105 | Paywalled standard (AS 1743); state sites CC BY 4.0 with caveats |
| Naming key | Official sign code (`a1-1`, `c31-3`) | TSRGD diagram number (`602`, `583.1`) | MUTCD code, zero-padded (`W02-03a`) + size in inches | AS code (`R1-1`) |
| Biggest risk | EPS set is served but undocumented/unlinked | Two extra DfT conditions; stale EPS coverage post-2016 | Interstate Shield / 511 / Scenic Byway trade marks only | Standards Australia copyright; contested Commons PD claim; TfNSW "illustrations" carve-out |
| Confidence | High | High | High | **Moderate** — several unresolved points |

### GB — Great Britain

**Official vector artwork: yes, two distinct DfT sources, both Crown copyright /
OGL.**

1. **"Road traffic sign images for reproduction"** —
   <https://www.gov.uk/guidance/traffic-sign-images> `[verified]`
   - "more than 600 traffic-sign images" from *Know your traffic signs*, offered as
     **JPG and EPS** (no SVG, no AI, no DWG), in **17 subject-category ZIPs** (one
     JPG edition and one EPS edition each) plus a "Traffic signs image details"
     spreadsheet index. `[verified]`
   - e.g. <https://assets.publishing.service.gov.uk/media/5a7dd96740f0b65d88634c93/warning-signs-eps.zip>
     — 3.2 MB, **120 EPS files**. `[verified: downloaded]`
   - Terms, verbatim from the page `[verified]`:
     > "You may reproduce traffic-sign images free of charge and without having to
     > seek permission, but you must reproduce them **accurately** and **not in a
     > misleading context** (eg not on roadside billboards where they could mislead
     > drivers). You should also include a statement that these images are Crown
     > copyright."

     Footer: "All content is available under the Open Government Licence v3.0,
     except where otherwise stated."
2. **TSRGD 2016 working drawings** — one GOV.UK publication per schedule, e.g.
   <https://www.gov.uk/government/publications/traffic-signs-working-drawings-tsrgd-2016-schedule-9>
   `[verified]`
   - **PDF only.** Naming:
     `traffic-sign-drawing-schedule-09-part-02-item-02-p602.pdf`. `[verified]`
   - p602 was downloaded and parsed: A4 MediaBox (595×842 pt), **zero raster image
     XObjects, zero embedded fonts** → genuinely vector, text converted to
     outlines. `[verified]`
   - Footer licence: OGL v3.0 + Crown copyright. `[verified]`

Design rules: **Traffic Signs Manual Ch. 7 (2018)** —
<https://www.gov.uk/government/publications/traffic-signs-manual> (sign-face
layout, x-height, spacing, colour coding). `[verified]`

**Open sets.** `Category:SVG_road_signs_in_the_United_Kingdom` — 124 files
directly, 15 subcategories (route diagrams ~449, warning ~186, information ~154).
Naming: **`UK traffic sign <diagram number>.svg`** (`UK traffic sign 602.svg`),
deprecated signs get the year appended. `[verified]`
<https://commons.wikimedia.org/wiki/File:UK_traffic_sign_602.svg> carries **OGL
v1.0** with the Crown-copyright attribution text; the file history records the
current version as based on the "Official working drawing from TSRGD".
`[verified]` The community guide
<https://commons.wikimedia.org/wiki/Commons:Making_road_signs_of_the_United_Kingdom>
instructs contributors to work from TSRGD 2016, the Traffic Signs Manual and the
Working Drawings PDFs, and to use genuine Transport Medium / Transport Heavy /
Motorway fonts (explicitly warning off the roads.org.uk font vectorisations as
error-prone). So fidelity is *intended* to be working-drawing-accurate but is
**contributor-asserted, not DfT-certified**. `[verified] / [inferred: the
"not certified" part]`

**Drawing licence vs. design restriction.** Both DfT sets are Crown copyright
under OGL (≈ CC BY 4.0). `[verified]` The DfT page attaches **two conditions that
are not standard OGL** — reproduce accurately, not in a misleading context.
Whether these are contractual conditions, a restatement of OGL's non-misleading
clause, or advisory is not stated. `[unclear — judgement call]` Separately,
**Road Traffic Regulation Act 1984 s.64** defines "traffic sign" and s.64(4)
provides that no traffic sign shall be placed on or near a road except by or with
authority — <https://www.legislation.gov.uk/ukpga/1984/27/section/64>.
`[unclear: direct fetch of s.64 returned empty/HTTP 202, so the exact wording is
from a search snippet, not read first-hand]` As in Sweden, the statutory
restriction is on **placing physical signs**, not on publishing pictures.
`[inferred]`

### US — United States

**The best of the four, by a distance.**

- Current manual: **MUTCD 11th Edition, December 2023** — <https://mutcd.fhwa.dot.gov/>
  `[verified]`
- Artwork: **Standard Highway Signs (SHS), 2024 Edition**, released in six phases.
  Hub: <https://mutcd.fhwa.dot.gov/kno-shs_2024-release-status/index.htm>
  `[verified]`
- The page states verbatim `[verified]`:
  > "Full-size, vector-based, undimensioned sign layouts in **PDF, EPS, and SVG**
  > formats. Layouts are to actual scale for each standard sign size indicated and
  > can be transmitted directly to an electronic vinyl cutter for fabrication
  > purposes."
- **Release 6 (10 Feb 2026) is the final phase.** Releases: 1 (2024-06-07, new
  warning), 2 (2024-09-27, new regulatory/TTC/school), 3 (2024-12-20, two parts),
  4 (2025-03-12), 5 (2025-08-29, guide signs M/I/EM), 6 (2026-02-10, regulatory +
  guide D/E). ZIPs at
  `https://mutcd.fhwa.dot.gov/kno-shs_2024-release-status/zip_files/…` `[verified]`
- Legacy interim set for 2009-MUTCD signs (PDF + EPS, no SVG):
  <https://mutcd.fhwa.dot.gov/shsm_interim/index.htm> — to be superseded.
  `[verified]`
- `https://mutcd.fhwa.dot.gov/kno-shs.htm` **404s**; the live index is
  `kno-shs_2024.htm`. `[verified]`
- FHWA Federal Lands "Signs Library"
  (<https://highways.dot.gov/federal-lands/cadd-support/signs-library>) returned
  **HTTP 403** — contents and formats unverified. `[unclear]`

**Open sets.** `Category:Diagrams_of_road_signs_of_the_United_States` — 86 files
top-level, **46 subcategories** by state / sign type / MUTCD series; "SVG road
signs in the United States" holds 13 subcats / 168 files. Naming follows MUTCD
codes (`MUTCD R1-1.svg`), state overlays as `MUTCD-OH R16-H1.svg`. `[verified]`

**Drawing licence vs. design restriction — cleanest position of the four, with two
named carve-outs.**

1. The MUTCD's own clause (11th Ed.): *"Any traffic control device design or
   application provision contained in this Manual shall be considered to be in the
   public domain. Traffic control devices contained in this Manual shall not be
   protected by a patent, trademark, or copyright, except for the Interstate
   Shield and any other items owned by FHWA."* The full passage also excepts the
   511 Travel Information pictograph and the National Scenic Byway graphic, and
   notes the limitation does not extend to individual elements (manufacturing and
   assembly methods can be protected). `[unclear: wording obtained via search
   snippet of mutcd.fhwa.dot.gov/pdfs/11th_Edition/part1.pdf; the PDF itself was
   not read first-hand]`
2. **17 U.S.C. § 105** independently puts US federal government works outside
   copyright. `[inferred — not fetched; the MUTCD's own clause is the stronger,
   directly-cited basis]`
3. **The Interstate Shield is a registered trade mark** — USPTO Reg. **835,635**,
   issued 19 September 1967, held by AASHTO. FHWA states it "has been used several
   times over the years to prevent or remove Interstate-like signs near the
   Interstate highways, where they might confuse the traveling public and cause
   accidents." <https://www.fhwa.dot.gov/infrastructure/50sheild.cfm> `[verified]`
4. Depicting an I-shield in an educational/reference app is very likely fine
   (nominative, non-confusing); using it as branding or on roadside signage is the
   trade-mark risk. `[judgement call]`

This is the clearest illustration of the Q3 distinction in the whole document: the
US explicitly disclaims **copyright** in the designs while retaining a
**trade-mark** restriction on three specific marks.

### AU — Australia

**The worst of the four, and the only one where I would flag real legal risk.**

- The authoritative artwork spec is **AS 1743 "Road signs — Specifications"**,
  Standards Australia; current edition **AS 1743:2023** (superseding AS 1743:2018).
  It specifies graphics, fonts, layout and size for the standard signs in the
  AS 1742 series. `[verified: search] / [unclear: the Standards Australia store
  page returned empty content]`
- **It is paywalled.** AS 1743:2018 listed at **US$410** via the ANSI store;
  Standards Australia distributes via a login-gated one-device Web Reader and
  limited protected PDF. <https://webstore.ansi.org/standards/sai/17432018>
  `[verified: search result quoting the store]`
- **No open vector artwork set from Standards Australia or Austroads was found.**
  `[verified: absence after multiple searches — a negative finding, moderate
  confidence only]`
- **Transport for NSW sign register** is the most usable official source:
  <https://www.transport.nsw.gov.au/operations/roads-and-waterways/traffic-signs>
  — searchable by name, AS code (`R1-1`) or type, with "detailed design plans
  included for most signs"; G-series omitted as site-specific. `[verified via
  curl; the host 403s WebFetch]`
  Per-sign example → `…/trafficsigns/pdf/r1-1.pdf` (221 KB). Parsed: **A3
  (842×1191 pt), zero raster image XObjects, zero embedded fonts** → vector line
  work with text as outlines. So NSW design plans are **vector PDF dimensioned
  working drawings — no SVG, EPS, AI or DWG.** `[verified: downloaded and parsed]`
- **Queensland TMR**: Queensland MUTCD Part 1 (sign illustrations) and standard
  drawings at
  <https://www.tmr.qld.gov.au/business-industry/Technical-standards-publications/Standard-drawings-roads>
  — PDF. `[verified: search; PDF text extraction failed]`
- **VicRoads / DTP Victoria**: Traffic Engineering Manual and a "Manual of Standard
  Drawings for Road Signs" exist; **no downloadable vector sign-artwork library
  found**. `[unclear — negative finding, low-to-moderate confidence; the Victorian
  technical-documents portal was not exhausted]`
- **Main Roads WA** "Guideline — Sign Standards" PDF exists but text extraction
  failed. `[unclear]`

**Open sets.** Much thinner. `Category:Road signs in Australia` is explicitly for
photographs (44 files, 17 subcats); diagrams live at `Category:Diagrams of road
signs of Australia` (14 subcats, 14 files). `Category:Road_signs_of_Australia` is
an empty redirect; `Category:Diagrams_of_road_signs_in_Australia` (with "in") does
not exist. `[verified]` Naming: `Australia road sign R1-1.svg`,
`Australia road sign R4-1 (100).svg` — AS code with variable legend in parentheses.
`[verified]`

**Drawing licence vs. design restriction — the shakiest of the four.**

1. **Source works are commercially copyrighted.** AS 1743 is sold for hundreds of
   dollars; there is no open licence on it. `[verified: paywalled listings] /
   [inferred: the copyright assertion itself, not read from a Standards Australia
   legal page]`
2. **The Commons PD claim is contested.**
   <https://commons.wikimedia.org/wiki/File:Australia_road_sign_R1-1.svg> lists
   **Author: "Standards Australia", Source: "AS 1742 / AS 1743"**, licensed
   **`{{PD-ineligible}}`** ("simple geometry… consists entirely of information that
   is common property and contains no original authorship"). `[verified]` But a
   deletion discussion
   (<https://commons.wikimedia.org/wiki/Commons:Deletion_requests/files_in_Category:State_Route_shields_of_Australia>)
   records the argument that Australian route signs are **not** PD-ineligible,
   because Australia's originality threshold is very low and government works are
   copyrightable; files were kept only for numeral-only cases. `[verified: search
   summarising the DR]`
3. Commons' Australia territory page notes the **very low originality threshold**,
   citing the Aboriginal Flag case — a simple geometric design held copyrightable.
   <https://commons.wikimedia.org/wiki/Commons:Copyright_rules_by_territory/Australia>
   `[verified]` That cuts directly against "it's just simple geometry" for
   symbol-bearing Australian signs.
4. **State-agency licensing helps, with a carve-out that may bite.** Transport for
   NSW (<https://www.transport.nsw.gov.au/about-us/legal>): "Unless otherwise
   stated, all Transport for NSW material on this website is licensed under the
   **Creative Commons Attribution 4.0 licence**", attribution "© State of New South
   Wales (Transport for NSW)". **But the exclusions list includes "Any photography,
   illustrations, animations and sound files used by TfNSW."** Whether a sign
   *design plan* is an excluded "illustration" or ordinary CC BY material is
   **genuinely unresolved on the face of the page**. `[verified: fetched] /
   [unclear — judgement call]`
5. Queensland TMR: "Unless otherwise noted, all copyright material available on or
   through the tmr.qld.gov.au website is licensed under a Creative Commons
   Attribution 4.0 International licence" — <https://www.tmr.qld.gov.au/help/copyright>.
   Cleaner wording than NSW's; no illustrations carve-out found. `[verified: search
   quoting the page; not fetched directly]`
6. Each state's road rules restrict erecting/displaying signs resembling official
   traffic control devices (the AU analogue of VMF 8 kap. 4 §). **Not researched.**
   `[unclear]`

**Net AU position:** authoritative artwork sits behind a commercial standards
paywall; the Commons set is small and rests on a copyright theory Australian law
appears unusually hostile to; and the most permissive route (a state agency's
CC BY 4.0 — Queensland TMR's wording is cleanest, NSW's depends on reading the
"illustrations" carve-out narrowly) still yields **PDF working drawings, not clean
single-sign SVGs**.

---

## Q5 — Practical format notes

### Sweden

**Format.** Adobe Illustrator 8 EPS (PostScript). One file per sign *variant*.
`[verified]`

**Naming.** Filename is the official sign code, lowercased, with the variant
suffix: `a1-1.eps`, `a14.eps` (no suffix where there is only one variant),
`c23-1.eps`, `d10-1.eps`, `e3-1.eps`, `j2-1.eps`, `s7-1.eps`, `t13-1.eps`.
`[verified]`

**Directory layout.** `/globalassets/global/vag/vagmarken2/<letter>.-<seriesname>/<code2digit>.-<slugified-swedish-name>/<code>-<variant>.<ext>`
— e.g.
`…/a.-varningsmarken/a01.-varning-for-farlig-kurva/a1-1.eps`. Note the folder
uses a **zero-padded** two-digit code (`a01`, `c23`) while the filename uses the
**unpadded** code (`a1-1`, `c23-1`). Directory listing is 404, so the index must
come from scraping the section pages' `/link/<hash>.aspx` redirectors.
`[verified]`

**No sprite.** One asset per file; no sheet, no atlas. `[verified]`

**No viewBox convention.** EPS has a `%%BoundingBox` / `%%HiResBoundingBox` in
PostScript points, tight to the artwork, and it differs per sign (A1-1 is
`193 93 651 499`, i.e. 456.28 × 405.03 pt at an arbitrary origin offset). There is
no shared canvas, no consistent origin, and no normalised size. **Any pipeline
would have to normalise.** `[verified]`

**Colour.** The EPS uses **PANTONE spot colours**, and they match
Transportstyrelsen's published colour table exactly. From
<https://www.transportstyrelsen.se/sv/vagtrafik/trafikregler-och-vagmarken/trafikregler/om-vagmarken/farger-for-illustrationer/>,
headed *"Vägmärken, tilläggstavlor och trafikanordningar för illustrationer och
trycksaker"* `[verified]`:

| Colour | PMS | RGB | CMYK |
|---|---|---|---|
| Ljusblå | 294 C | 0, 80, 146 | 100, 58, 0, 21 |
| Mörkblå | 282 C | 0, 46, 95 | 100, 68, 0, 54 |
| Grön | 335 C | 0, 120, 95 | 100, 0, 65, 30 |
| Röd | 185 C | 231, 49, 55 | 0, 91, 76, 0 |
| Gul | 116 C | 225, 211, 0 | 0, 16, 100, 0 |
| Ljusgrå | 430 C | 161, 165, 167 | 5, 0, 0, 45 |
| Orange | 152 C | 241, 143, 0 | 0, 51, 100, 1 |
| Brun | 469 C | 122, 74, 0 | 0, 52, 100, 62 |

NCS, RAL and hex are **not** given. `[verified]` The CMYK values in that table are
byte-identical to the `%%CMYKCustomColor` lines in `a1-1.eps`, which is strong
evidence the EPS set and the colour table are the same artwork programme.
`[verified]`

**Typeface.** Tratex (see Q1) is the official face. **The EPS files appear to have
text converted to outlines** `[verified]`: I downloaded `c31-3.eps` (the 30 km/h
speed-limit sign, i.e. a sign that definitely carries numerals) and it contains
**no `%%DocumentFonts` comment, no `%%DocumentNeededResources`, no Tratex
reference and no PostScript text operators** — the numerals are paths. Good news:
downstream rendering cannot substitute a wrong font. Tratex is still needed for
*composed* signs (route numbers, destination plates) that the official set does
not ship pre-made.

`c31-3.eps` also has `%%BoundingBox: 126 137 467 478` — 341 × 341 pt, vs A1-1's
456 × 405 pt. Different canvas, different origin. Reinforces: **no shared
coordinate system across the set.** `[verified]`

**EPS → SVG.** EPS is not web-renderable. Conversion (Inkscape, Illustrator,
`pstoedit`, Ghostscript) is a known-good path but is a *transformation step* with
its own fidelity risk, and it will not preserve spot colours — they become
CMYK/RGB. `[inferred]`

**Commons SVGs** by contrast are already SVG, already use the official codes in
filenames (`Sweden_road_sign_A1-1.svg`, `Sweden_road_sign_C31-3.svg`,
`Sweden_road_sign_B1.svg`) — but naming is **inconsistent** across the set
(`Sweden road sign …`, `Swedish road sign …`, `SE road sign …`, and plain Swedish
names like `Markeringsskärm sidohinder, höger.gif`), and dimensions are
inconsistent (608×540, 807×717, 1000×1000). `[verified]`

### GB

- **EPS set is old.** Header of `563.eps`: `%%Creator: Adobe Illustrator(TM) for
  Windows, version 4.0`, `%%CreationDate: (12/14/95)`. `[verified]`
- **One file per sign**, flat, named by **TSRGD diagram number**: `563.eps`,
  `583.1.eps`, `602.eps`, `601.1.eps`, `817.2L.eps`. Suffixes encode variants
  (`V2`…`V14`; `L`/`LA`/`LL` for left-hand versions). `[verified]`
- **No uniform viewBox** — `%%BoundingBox` differs per sign (602: `185 301 421 506`;
  601.1: `164 266 442 541`). Normalisation required, same as Sweden. `[verified]`
- **Colour is process CMYK, not spot.** Red is `0 1 1 0 k`. Some signs are
  `%%ColorUsage: Black&White`. `[verified]` Physical colorimetry is governed
  separately by BS EN 12899-1 chromaticity boxes, not by these files. `[verified]`
- **Coverage gap:** the EPS set derives from *Know your traffic signs* and dates
  from 1995; **TSRGD 2016 signs are only in the PDF working drawings.** Expect to
  trace or redraw post-2016 signs. `[inferred, well-supported by the 1995 EPS
  timestamps]`
- Distribution is **ZIP-per-category**, not per-sign download — 17 categories.
  `[verified]`

### US

From a partial download of the SHS Release 1 vector ZIP (server slow; download
truncated at ~209 KB, so the archive was not fully enumerated) `[verified: partial
download + byte inspection]`:

- **One folder per sign designation**, named `<CODE> <Descriptive name>/`, e.g.
  `W02-03a Intersection Warning - Oblique Side Road (Acute)/`
- **One file per size and handedness inside**, e.g.
  `W02-03aL Intersection Warning - Oblique Side Road (Acute) 18x18.eps` — code +
  `L`/`R` variant + descriptive name + **size in inches**.
- A dimensioned working-drawing PDF sits alongside the artwork.
- **Codes are zero-padded in filenames** (`W02-03a`, not `W2-3a`) — important if
  you key on MUTCD codes, which are conventionally written unpadded. `[verified]`
- `.eps` and `.pdf` observed in the sample; the release-status page asserts SVG is
  also included. `[verified page claim; not verified by extraction]`
- **Critical caveat from the page: sign layouts do not scale uniformly between
  sizes.** You must take the file for the specific sign size rather than rescale
  one — stroke weights and legend proportions differ per size. `[verified]` This
  is the one format fact most likely to cause a subtly-wrong US sign face.
- Colour: MUTCD colours are defined by **CIE chromaticity coordinate boxes and
  daytime luminance factors**, not Pantone. `[inferred — standard MUTCD practice;
  the colour table itself was not fetched]`

### AU

- **No SVG/EPS/AI/DWG set located from any Australian authority.** `[verified:
  negative finding]`
- Best available official artefact: a **per-sign vector PDF working drawing**, A3,
  dimensioned, text outlined (TfNSW). `[verified]`
- Naming: TfNSW uses the AS sign code as the filename — `r1-1.pdf`. Codes follow
  AS 1742 conventions: `R` regulatory, `W` warning, `G` guide (site-specific,
  largely undrawn). `[verified]`
- **Size variants are named sizes on one drawing, not separate files** (R1-1:
  600×600, 750×750, 900×900 mm) — the opposite of FHWA's one-file-per-size model.
  `[verified]`
- Colour: Australian sign colours are defined by AS 2700 / AS 1743 colour
  references rather than Pantone. `[inferred — AS 1743 is paywalled and was not
  read]`

### Cross-jurisdiction format observations

- **No jurisdiction ships SVG except the US.** SE and GB ship EPS; AU ships only
  dimensioned PDF.
- **No jurisdiction ships a sprite or atlas.** Every official set is one file per
  sign (or per sign+size).
- **No jurisdiction uses a shared canvas or normalised viewBox.** Every set has
  per-sign bounding boxes at arbitrary offsets.
- **Filename keys differ per jurisdiction and are the natural component id**:
  SE `a1-1`, GB `602`, US `W02-03a` (zero-padded), AU `R1-1`.
- **Size/variant modelling differs fundamentally**: US = one file per physical
  size (non-uniform scaling); AU = one drawing listing named sizes; SE/GB = variant
  suffixes on the code with no size dimension in the artwork.
- **Colour is specified in a different system in every jurisdiction**: SE Pantone
  + CMYK + RGB; GB process CMYK with BS EN 12899-1 for the physical sign; US CIE
  chromaticity boxes; AU AS 2700 / AS 1743.

---

## Open questions / things I could not settle

1. **`[unclear]` Is the Transportstyrelsen EPS set an intended public download?**
   The files are served publicly at stable URLs but are not linked from any page I
   found. The press-room text promises "filer av vägmärken" without naming a
   format. An email to Transportstyrelsen asking them to confirm the EPS set and
   restate the licence in writing would convert the best finding in this document
   from "observed" to "documented".
2. **`[unclear]` Fidelity of the Commons SVG set, sign by sign.** No systematic
   check exists. If the open set is used, each sign needs comparing against the
   official EPS or TSFS 2019:74.
3. ~~Whether the official EPS files contain live text or outlines.~~ **Resolved:
   outlines** (checked on `c31-3.eps`; see Q5). Tratex is still needed for signs
   whose legend is composed rather than fixed.
4. ~~Exact §-number of the VMF prohibition on confusable devices.~~ **Resolved:
   8 kap. 4 §** (see Q3(b)).
5. **`[unclear]` Coverage of the F/G/H/I lokaliseringsmärken** — the index page
   exposed no asset links, and those signs are compositional (place names,
   numbers) rather than fixed faces.
6. **`[unclear]` Scope of the URL § 26 a remuneration rule** if a sign pictogram
   were ever held to be an alster av bildkonst.

### GB / US / AU

7. **`[unclear]` GB:** the legal status of DfT's two extra conditions ("accurately",
   "not in a misleading context") relative to plain OGL v3. Judgement call.
8. **`[unclear]` GB:** exact wording of RTRA 1984 s.64(4) — legislation.gov.uk
   returned empty/HTTP 202 on direct fetch; wording came from a search snippet.
9. **`[unclear]` GB:** how much of the post-2016 TSRGD sign set is missing from the
   1995-era EPS library. Not quantified.
10. **`[unclear]` US:** the MUTCD public-domain clause was read from a search
    snippet of `part1.pdf`, not from the PDF directly. Worth re-reading first-hand
    before relying on it.
11. **`[unclear]` US:** the FHWA Federal Lands CADD "Signs Library" returned HTTP
    403; contents and formats unknown.
12. **`[unclear]` US:** the SHS Release ZIP was only partially downloaded, so the
    presence of SVG alongside EPS/PDF rests on the release page's claim rather
    than on extraction.
13. **`[unclear]` AU:** whether TfNSW's CC BY 4.0 licence covers sign design plans
    or excludes them as "illustrations". This is the single decisive question for
    Australia and it is unresolved on the face of the page.
14. **`[unclear]` AU:** Victoria's and WA's positions (PDF text extraction failed;
    portals not exhausted), and the state-law provisions restricting display of
    devices resembling official traffic signs.
15. **`[unclear]` Scope:** the picker's GB entry is labelled "United Kingdom".
    Northern Ireland has separate traffic signs regulations. Whether the product
    means GB or UK is a product question, not a research one, but it changes what
    artwork is needed.

---

## Sources

**Sweden — official**

- Transportstyrelsen, Vägmärken index — <https://www.transportstyrelsen.se/sv/vagtrafik/trafikregler-och-vagmarken/vagmarken/>
- Transportstyrelsen, Pressbilder (terms of use, road-sign paragraph) — <https://www.transportstyrelsen.se/sv/om-oss/pressrum/pressbilder/>
- Transportstyrelsen, Färger för illustrationer — <https://www.transportstyrelsen.se/sv/vagtrafik/trafikregler-och-vagmarken/trafikregler/om-vagmarken/farger-for-illustrationer/>
- Transportstyrelsen, Teckensnitt (Tratex) — <https://www.transportstyrelsen.se/sv/vagtrafik/trafikregler-och-vagmarken/trafikregler/om-vagmarken/teckensnitt/>
- TSFS 2019:74 consolidated — <https://www.transportstyrelsen.se/TSFS/TSFS%202019_74k.pdf>
- TSFS 2024:4 (amendment) — <https://www.transportstyrelsen.se/sv/om-oss/dina-rattigheter-lagar-och-regler/forfattningssamling/sok-ts-foreskrifter/details?RuleNumber=2024:4&ruleprefix=TSFS>
- Example EPS — <https://www.transportstyrelsen.se/globalassets/global/vag/vagmarken2/a.-varningsmarken/a01.-varning-for-farlig-kurva/a1-1.eps>

**Sweden — law**

- Vägmärkesförordning (2007:90) — <https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/vagmarkesforordning-200790_sfs-2007-90/> · <https://lagen.nu/2007:90>
- Lag (1960:729) om upphovsrätt, §§ 9 and 26 a — <https://lagen.nu/1960:729#P9> · <https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/lag-1960729-om-upphovsratt-till-litterara-och_sfs-1960-729/>

**Sweden — open sets**

- <https://commons.wikimedia.org/wiki/Commons:Copyright_rules_by_territory/Sweden>
- <https://commons.wikimedia.org/wiki/Template:PD-Transportstyrelsen>
- <https://commons.wikimedia.org/wiki/Template_talk:PD-Transportstyrelsen>
- <https://commons.wikimedia.org/wiki/Category:Road_signs_in_Sweden>
- <https://commons.wikimedia.org/wiki/Category:SVG_road_signs_in_Sweden>
- <https://commons.wikimedia.org/wiki/Category:Diagrams_of_road_signs_of_Sweden>

**GB**

- DfT, Road traffic sign images for reproduction — <https://www.gov.uk/guidance/traffic-sign-images>
- Example EPS ZIP — <https://assets.publishing.service.gov.uk/media/5a7dd96740f0b65d88634c93/warning-signs-eps.zip>
- TSRGD 2016 working drawings (Schedule 9) — <https://www.gov.uk/government/publications/traffic-signs-working-drawings-tsrgd-2016-schedule-9>
- Traffic Signs Manual — <https://www.gov.uk/government/publications/traffic-signs-manual>
- Road Traffic Regulation Act 1984 s.64 — <https://www.legislation.gov.uk/ukpga/1984/27/section/64>
- <https://commons.wikimedia.org/wiki/Category:SVG_road_signs_in_the_United_Kingdom>
- <https://commons.wikimedia.org/wiki/File:UK_traffic_sign_602.svg>
- <https://commons.wikimedia.org/wiki/Commons:Making_road_signs_of_the_United_Kingdom>

**US**

- MUTCD — <https://mutcd.fhwa.dot.gov/>
- Standard Highway Signs 2024 release status (vector downloads) — <https://mutcd.fhwa.dot.gov/kno-shs_2024-release-status/index.htm>
- SHS interim (2009 MUTCD) — <https://mutcd.fhwa.dot.gov/shsm_interim/index.htm>
- Interstate Shield trade mark — <https://www.fhwa.dot.gov/infrastructure/50sheild.cfm>
- <https://commons.wikimedia.org/wiki/Category:Diagrams_of_road_signs_of_the_United_States>
- <https://commons.wikimedia.org/wiki/File:MUTCD_R1-1.svg>

**AU**

- AS 1743:2018 store listing (price/paywall) — <https://webstore.ansi.org/standards/sai/17432018>
- Transport for NSW traffic signs register — <https://www.transport.nsw.gov.au/operations/roads-and-waterways/traffic-signs>
- TfNSW legal/copyright — <https://www.transport.nsw.gov.au/about-us/legal>
- Queensland TMR standard drawings — <https://www.tmr.qld.gov.au/business-industry/Technical-standards-publications/Standard-drawings-roads>
- Queensland TMR copyright — <https://www.tmr.qld.gov.au/help/copyright>
- <https://commons.wikimedia.org/wiki/Commons:Copyright_rules_by_territory/Australia>
- <https://commons.wikimedia.org/wiki/File:Australia_road_sign_R1-1.svg>
- <https://commons.wikimedia.org/wiki/Commons:Deletion_requests/files_in_Category:State_Route_shields_of_Australia>
