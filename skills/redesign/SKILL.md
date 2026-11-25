---
name: redesign
description: 'Use when the user asks to redesign, refresh, restyle or polish existing pages, or says the site looks generic, dated or unfinished: it keeps the content and behaviour and changes the design system across every page. Not for a new site or a new page (use hallmark or frontend-design), animation work alone (use motion), an accessibility review alone (use accessibility), or legal pages (use legal-pages).'
---

# Redesign

Redesigns or polishes a site that already exists. The pages, their words and their behaviour are the material; the design system around them is what changes. A redesign that loses a link, a form field or a sentence has failed, however good it looks.

Work in this order. Do not skip a step.

## 1. Read everything first

Before changing anything, read every page, layout, shared component and stylesheet in the project, and the design tokens if there are any: CSS custom properties, the Tailwind theme, a theme file. Note how the styles are organised and which values repeat.

Then list what must survive, page by page:

- all text, word for word, including headings, button labels, alt text, metadata and the page titles;
- every link and its target, and every URL the site serves (paths, anchors, redirects);
- every form, its fields, their names, types and validation, and where it submits;
- every image and media file, with its alt text;
- the language of each page, and its direction when it is a right-to-left language;
- scripts and integrations the pages load, and any behaviour (menus, toggles, tabs, dialogs).

This list is the contract. Check against it at the end.

## 2. Decide the depth

Read the request and pick one:

- **Polish.** Keep the identity: the palette, the typefaces, the logo, the overall layout. Fix what is below the bar: hierarchy, type scale, spacing, colour use, alignment, consistency between pages, missing states.
- **Redesign.** A new identity: a new palette, new type, a new layout system. Content and behaviour still stay.

"Clean up", "polish", "tidy", "make it consistent" mean polish. "Redesign", "new look", "it looks generic", "start fresh on the design" mean redesign. When the request does not settle it, ask once, naming the two options in one line each, then proceed with the answer.

## 3. State the direction

Before editing, state the direction in a few lines:

- for polish: what you keep, and the three to five problems you will fix;
- for a redesign: the palette as a few named colours, the typefaces and their roles, the layout idea, and the one thing that will make the site memorable.

When another design skill active in the project sets a direction (for example `hallmark` or `frontend-design`), take the direction from it and the process from this skill. Do not mix two directions.

A redesign avoids the defaults every generated page shares, unless the user asks for them: a warm cream page with a terracotta accent, a near-black page with one acid accent, identical rounded cards with the same soft shadow, an all-caps eyebrow above every heading, gradient washes as decoration.

## 4. Change the system, not single elements

Fix the cause at the narrowest level that removes it. Before changing a value, decide what kind of drift it is:

- a **missing token**: the system needs a reusable value;
- a **one-off implementation**: an existing shared component should replace it;
- a **local defect**: the element is simply unfinished.

Then work from the bottom up:

1. **Tokens.** Colours, type, spacing, radii, shadows, as CSS custom properties or in the Tailwind theme, whichever the project uses. Name them by role (`--color-text`, `--color-accent`, `--space-section`), not by value. Replace hard-coded values with the tokens.
2. **Type scale.** The fewest roles and families that make the hierarchy unmistakable: display, heading, body, small text. Body text at least 16px, prose lines 45–75 characters, line height tuned to the face and the measure. `text-wrap: balance` on headings, `text-wrap: pretty` on body copy. Load only the weights you use, and load fonts only the way the project already does.
3. **Spacing scale.** One documented scale (a 4px base gives the useful middle steps). Related items close, distinct groups far apart; a rhythm of tight and generous intervals, not one value everywhere. Use `gap` for sibling rhythm.
4. **Components.** Buttons, links, inputs, cards, navigation, footer: one definition each, with default, hover, focus, active and disabled states, used everywhere.
5. **Pages.** Apply the system page by page. Check the reading order with the squint test: with the detail blurred, the primary element, the secondary element and the main groups still read in order.

Every page ends consistent: the same role looks the same on every page. Do not finish one page perfectly and leave the others behind.

Keep the change inside the design. Do not rename routes, rewrite copy, restructure the information or change behaviour unless the user asked for it. If the content itself has a problem, say so in the report instead of changing it.

## 5. Keep or improve accessibility

The redesign must not make anything less accessible, and should leave it better:

- text contrast at least 4.5:1, large text and interface boundaries at least 3:1, checked against every background the text sits on, in every theme the site has;
- a visible focus indicator on every interactive element; never remove an outline without a replacement;
- headings that form an outline, one `<main>`, labels on every form field;
- every new animation respects `prefers-reduced-motion`;
- layouts that reflow at 320px width without horizontal scrolling and survive 200% text size;
- touch targets at least 24×24px, larger where the layout allows.

For a deeper check, the `accessibility` skill has the full rules.

## 6. Check against the contract

Walk the list from step 1 and confirm each item is still there and still works: text, links, URLs, form fields and their behaviour, images, the language. Remove the code the redesign made unused: obsolete styles, dead classes, unused font files. Run the project's own checks (build, lint, tests) if it has them.

## 7. Report

Finish with a short report in the chat:

- **Changed:** the tokens, type, spacing and components, in a few lines.
- **Kept:** what you deliberately preserved.
- **Could not verify:** what needs someone to look at the rendered page, such as contrast over images, the look at narrow and wide widths, font rendering, animations. Say plainly that you could not see the page if you could not.

Keep it short. The site is the deliverable.
