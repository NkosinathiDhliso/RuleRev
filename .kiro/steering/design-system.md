# RuleRev design system

Operational rules, not aspiration. This file exists because AI-assisted builds converge on the
statistical median of their training data, and that median is now recognisable on sight. Every rule
below records a decision that was made on purpose. If you change one, change it here first and say
why.

Measured with `tools/verify/scripts/slop-score.mjs`. Target: band CLEAN (0-1 findings) on every
public page. Baseline before this system existed: homepage 7 (HEAVY), `/omni-risk-readiness` 4 (MILD).

## Who this is for

Compliance officers, risk heads, FinOps and exco at South African FSPs, insurers, retirement funds
and their auditors. People who read FSCA circulars, board packs, actuarial reports and audit
findings for a living.

Two consequences:

1. **Credibility beats distinctiveness.** Visual appeal drives a credibility judgment in roughly
   50ms and that verdict is stable (Lindgaard et al., *Behaviour & Information Technology*). We are
   not trying to be memorable. We are trying to survive the first 50ms with a regulated buyer.
2. **Sober is not the same as generic.** High-compliance products often default to conservative
   corporate styling on the assumption formality signals safety. That is a different failure. The
   rule is deliberate, not timid.

## The reference

**South African financial regulatory and professional-services documents.** FSCA board notices and
circulars, actuarial reports, JSE listing documents, audit technical bulletins.

This is a real reference, chosen deliberately, and it is the source of every decision below. It is
not "minimal", not "editorial", not "tasteful startup". It is a document.

What that reference actually looks like: white stock, high-contrast black text, a serif text face,
numbered sections, ruled tables, tabular figures, one institutional accent used structurally,
left-aligned everything, sentence case. No ornament, because ornament is not what the form is for.

## Decisions

### Ground

White. `#ffffff`.

Not cream, not sage, not beige. Warm neutrals are the current second-wave AI default and a working
designer is on record saying the tone now reads as reflexively off-putting regardless of merit.
Documents are printed on white. That is the whole justification.

### Colour

One dominant, one accent. Near-black ink on white is dominant. `#1F3D5C` deep navy is the accent.

- The accent is used **structurally**: section rules, section numbers, links, primary actions.
- The accent is never a gradient, glow or decorative panel fill. A filled primary action and the
  filled Cannot control are the two functional exceptions; both use white text at verified AA contrast.
- No three-tone ramp. A ramp at even weight is the "timid palette" tell.
- Assessment state is monochrome. It is encoded by a text label, rule weight and control treatment,
  not by a traffic-light palette or a full-row tint. System uses a `#C4C9CD` hairline and muted text;
  manual uses a `#7A8B9C` 2px rule and a navy outlined control; cannot-produce uses the `#1F3D5C`
  structural accent as a 3px rule and filled control; not-applicable uses a `#E2E5E7` hairline and
  muted text. Rows remain on the same neutral ground in every state and no state reduces row opacity.
  This follows the ruled-table hierarchy of the document reference while keeping labels, rather than
  colour alone, as the primary carrier of meaning.
- Ink is two tones, not four: `#101418` and `#3A4249`, with `#4D5560` for muted labels. The previous
  four-step grey ramp read as a timid palette and its lightest steps failed contrast.
- `#1F3D5C` measures 11.17:1 on white. Verified ratios are in `tools/verify/scripts/contrast.mjs`,
  which reads the tokens out of the published file rather than hardcoding them.

### Type

Two families with a stated division of labour:

- **Source Serif 4** for headings and body prose. This is the document voice.
- **Public Sans** for interface chrome: navigation, buttons, labels, table headers, metadata. This
  is the instrument voice. Public Sans is the US Web Design System face, which is exactly the
  register we want.
- **JetBrains Mono** on `/omni-risk-readiness` only, and only for data-point codes and figures.

Rules:

- Inter, Geist, Space Grotesk and Instrument Serif are prohibited. All four are named AI defaults.
  Instrument Serif in particular is the current display reflex.
- A real scale with real steps. Not one family at one weight.
- `font-variant-numeric: tabular-nums` on every figure that sits in a column.
- Monospace is for codes and figures. Never for body copy, labels or section headings. Mono as
  texture makes a page read like a terminal.

### Case

**Sentence case.** Everywhere.

No tracked-out all-caps labels. This is called out specifically in the field guide as a current
tell, and small letter-spaced caps are also the worst case for legibility at the sizes we use them.
Regulatory documents do not shout.

Exactly one exception is permitted: the wordmark.

### Surfaces

One edge treatment: **a crisp rule**. `1px solid` hairlines, or a `2px`/`3px` rule where it carries
structural weight.

- No shadows. Not soft, not elevated, not coloured. A border and a shadow on the same element is a
  named tell, and the document reference has no shadows in it at all.
- No glassmorphism, no frosted layers, no gradient borders, no gradient mesh, no film grain.
- `border-radius: 0` by default. Radius is opt-in per element with a reason, not a global default.
- A left-border strip is permitted **only** to encode semantic state. It is prohibited on ordinary
  content cards, where it is one of the most reliable AI tells.

### Layout

- Left-aligned. No centered hero.
- Section count follows the content. Four features get four items, not three. Never resolve to
  three equal cards by reflex, and a bento grid is the same reflex wearing a different hat.
- Numbered sections where there is a sequence, following the document reference.
- Vary spacing for rhythm and emphasis. One uniform section padding everywhere reads as flat.
- No eyebrow chip or pill above a headline unless it carries real information a reader needs.

### Motion

One orchestrated moment per page at most. Motion must communicate state or direct attention.

- No fade-up-on-scroll applied uniformly to every section.
- No drifting gradient blobs.
- `prefers-reduced-motion: reduce` must disable all of it.

### Copy

- Say what the thing is. No headline that could describe any other business.
- Banned: seamless, robust, cutting-edge, future-ready, best-in-class, unlock, unleash, empower,
  supercharge, streamline, world-class, enterprise-grade, elevate, "in today's fast-paced world".
- No em dashes. Use a comma, a colon, a parenthesis, or split the sentence. The character is fine
  in isolation; the density is the tell, and we have chosen to avoid it entirely.
- No "it's not just X, it's Y" pivot. No aphorism to close a section.
- No invented precision. No "10x faster", no "99.9%", no "trusted by 5,000+ teams", no testimonials
  from people who do not exist. If the number is not sourced, cut it.
- No vanity metrics dressed as data. A stat that exists to make a rhetorical point is worse than no
  stat.
- No emoji in product UI, ever. Not as icons, not as bullets.

### Accessibility

Not negotiable and not a design tradeoff.

- Body text and controls meet WCAG AA: 4.5:1 normal, 3:1 for large text.
- Visible focus indicator on every interactive element.
- Colour is never the only carrier of state. State always has a text label too.
- Keyboard operable throughout, tab order following visual order.
- Usable at 320px width (WCAG 1.4.10 reflow), not just 375px.
- Touch targets 44px minimum.

## Verification

Nothing ships without these passing:

```
node tools/verify/scripts/slop-score.mjs <url>     # target: band CLEAN
node tools/verify/scripts/functional.mjs <url>     # 63 checks, Omni-Risk
node tools/verify/scripts/privacy-audit.mjs <url>  # same-origin only, no storage
node tools/verify/scripts/csp-check.mjs            # CSP hash has not drifted
node tools/verify/scripts/contrast.mjs             # token contrast ratios
```

If you edit the inline script in `public/omni-risk-readiness/index.html`, its CSP SHA-256 changes
and `netlify.toml` must be updated. `csp-check.mjs` will fail the build if you forget.

## The one rule

De-slop toward the reference, never toward another generic. Removing a purple gradient and
installing a cream palette is a failed run. If a decision here cannot be traced back to how a
financial regulatory document behaves, it is decoration and it does not belong.
