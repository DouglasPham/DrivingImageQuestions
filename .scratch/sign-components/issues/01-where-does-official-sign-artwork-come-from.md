# 01 — Where does official sign artwork come from?

**Type:** research

**Blocked by:** none

**Status:** resolved

## Question

For at least one jurisdiction (Sweden, `SE`, is the working assumption), where can
Sign Component artwork be obtained that is accurate to the official standard, and
under what licence can it be redistributed inside this repo?

`AGENTS.md` forbids approximating sign faces ("Do not use AI-generated text for
sign faces; composite exact sign artwork after generation"), and `CONTEXT.md`
requires signs "drawn to the exact official standard" — so redrawing them by
hand is a correctness risk, not just extra work.

Surface, with sources:

- Does the Swedish Transport Agency (Transportstyrelsen) or another official body
  publish sign artwork as vectors, and on what terms?
- What do the open sign sets (e.g. Wikimedia Commons' Swedish road-sign category)
  actually contain, how faithful are they, and what licences apply?
- Is the *design* of a road sign itself subject to any restriction on
  reproduction, separate from the licence on a particular drawing of it?
- What is available for the other jurisdictions currently in the picker
  (GB, US, AU), so the answer isn't accidentally Sweden-only?

The decision this unblocks is whether the library ships sourced artwork,
commissioned/redrawn artwork, or something else — so report what exists and on
what terms, not a recommendation about the Editor's design.

## Answer

Full findings: [`../research/01-sign-artwork-sources.md`](../research/01-sign-artwork-sources.md)
(893 lines, organised by the five questions above, with sources and confidence
markers on every claim).

**Sweden has genuine official vector artwork, freely usable.** Transportstyrelsen
serves Adobe Illustrator EPS for every sign in the A–Y series at a predictable URL
(swap the linked PNG's extension), verified across 8 series. Files are dated 2007
(current Vägmärkesförordning), carry PANTONE spot colours matching
Transportstyrelsen's published colour table, and have text converted to outlines.
Transportstyrelsen states in writing the files "may be used freely for various
purposes without Transportstyrelsen's approval." Separately, Copyright Act
(1960:729) §9 excludes statutes from copyright and §26a permits reproducing
pictorial works within them. The one restriction that exists —
Vägmärkesförordning 8 kap. 4 § — bans *erecting* confusable physical signs; it is
a road-traffic rule about roadside objects, not a copyright rule about pictures.

**Caveat:** the EPS files are served publicly but linked from nowhere — the sign
pages link only PNGs. Best practice before shipping: one email to
Transportstyrelsen converting observed access into written confirmation.

**Other jurisdictions** (context for ticket 03, not blocking): US is strongest
(FHWA ships SVG+EPS+PDF, copyright in designs explicitly disclaimed). GB has EPS
under OGL v3 but only for the 1995 sign set — TSRGD 2016 signs are PDF-only. AU is
the problem case — spec paywalled, no official vectors, open set's
public-domain claim is contested.

**Format note carried forward to ticket 02:** the four jurisdictions agree on
nothing about format — only the US ships SVG, none ships a sprite, no shared
viewBox convention, each keys files by its own sign-code scheme. Whatever ingests
this needs to be built as adapters per jurisdiction, not one universal importer.
