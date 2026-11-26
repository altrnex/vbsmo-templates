# Building Animations

Turn a request for motion into an implementation that would survive a strict review of the rules in [SKILL.md](../SKILL.md).

## Operating Posture

You are a senior design engineer building the animation yourself. Write it so it passes a strict review the first time.

Two failure modes, and the first is worse:

1. **Animating something that shouldn't animate.** The gate below exists to produce zero lines of code sometimes. That's a success, not a dodge.
2. **Animating the right thing with the wrong ingredients** — `ease-in` on an entrance, `scale(0)`, keyframes on a toast, a duration that makes a dropdown feel sluggish.

Never present motion options as a menu. Make the call, state the reasoning in one line, write the code.

## Hard Rules

1. **Run the sequence in order.** Steps 1 and 2 gate everything. Don't reach for a curve before you know whether it animates at all.
2. **No approximated values.** Every curve, duration, and spring config comes from the codebase's existing tokens or the tables below. Never invent `cubic-bezier(0.4, 0, 0.2, 1)` because it looks familiar.
3. **Extend the codebase's tokens, don't fork them.** If `--ease-out` or a duration scale already exists, use it. Adding a parallel system is a defect.
4. **Reduced motion and hover gating ship with the animation**, not as a follow-up.
5. **Cheapest tool that works.** Never add a motion library; use one only when the project already has it.

## The Build Sequence

### 1. Should this animate at all?

| Frequency                                                   | Decision                                              |
| ----------------------------------------------------------- | ----------------------------------------------------- |
| 100+ times/day (keyboard shortcuts, command palette toggle) | **No animation. Ever.** Stop here.                    |
| Tens of times/day (hover effects, list navigation)          | Near-imperceptible only — fast and subtle, or nothing |
| Occasional (modals, drawers, toasts)                        | Standard animation                                    |
| Rare / first-time (onboarding, success, celebration)        | The delight budget lives here                         |

**Keyboard-initiated actions are a disqualifier, not a judgment call.** A launcher opened hundreds of times a day correctly has no open/close animation.

If the request fails this gate, say so plainly and don't write the animation. Offer the non-motion alternative (instant state change, a static affordance) instead.

### 2. What is the purpose?

Name it in one of these words before continuing:

- **Feedback** — confirming the interface heard the user
- **Spatial consistency** — showing where something came from or went
- **State indication** — making a state change legible
- **Preventing a jarring change** — bridging content that would otherwise teleport
- **Explanation** — demonstrating how something works (marketing/onboarding only)
- **Delight** — allowed _only_ at the rare/first-time tier

Can't name it? Don't build it. "It looks cool" on a frequently-seen element is a reason to stop.

Also check **function**: data the user is reading or acting on should not move for style. A decorative mouse-tracking effect belongs on a marketing page, not on a graph in a banking app.

### 3. Pick the tool — cheapest that works

Walk down; stop at the first that fits.

| Need                                                                      | Tool                                                                                               |
| ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Hover, press, color, a state toggle you control with a class or attribute | **CSS transition**                                                                                 |
| Entry animation on mount, no JS state                                     | **CSS `@starting-style`**                                                                          |
| Predetermined motion that must stay smooth while the page is busy loading | **CSS animation** (`transform`/`opacity` run on the compositor)                                    |
| Programmatic control with CSS performance, no library                     | **WAAPI** (`element.animate()`)                                                                    |
| Springs, layout animations, exit animations, gesture-driven values        | **The motion library the project already has.** Without one, use WAAPI or CSS and drop the spring. |

CSS animations beat JS under load — on `transform`/`opacity` they run on the compositor, while `requestAnimationFrame`-based animation drops frames while the browser loads, scripts, or paints. Use CSS for predetermined motion, JS for dynamic and interruptible motion.

If the task needs a _component_ rather than an animation — a toast, a drawer, a command menu, a dropdown — use the one the project's component kit already provides. Hand-rolling those is how you end up with a `<div>` dropdown and no focus management.

### 4. Pick the properties

- **`transform` and `opacity` only.** They skip layout and paint and run on the GPU. `width`/`height`/`margin`/`padding`/`top`/`left` trigger all three. (`clip-path` is the sanctioned fourth — see the recipes below. `height` is tolerated only for accordions, where there's no transform equivalent.)
- **Never `scale(0)`.** Start from `scale(0.9–0.97)` + `opacity: 0`. Nothing in the real world appears from nothing.
- **`transform-origin` at the trigger** for popovers, dropdowns, menus, tooltips — `var(--transform-origin)` when a component library supplies it, otherwise an origin you set. **Modals are exempt**; they're not anchored to a trigger, so they stay centered.
- **Percentages in `translate()`** are relative to the element's own size — `translateY(100%)` moves by its own height whatever the content. Prefer over hardcoded pixels.
- **When the project uses Motion, use the full `transform` string for the installed version** when the animation must stay smooth under load; whether the `x`/`y`/`scale`/`rotate` shorthands are accelerated depends on the version.

```jsx
// reduce: from useReducedMotion(); under reduced motion the static state applies at once
<motion.div
  animate={{ transform: reduce ? 'none' : 'translateX(100px)' }}
  transition={reduce ? { duration: 0 } : undefined}
/>
```

- **Never drive a child's transform from a CSS variable on the parent** — it recalculates styles for every child. Set `transform` on the element directly.

### 5. Easing and duration — or a spring

**Easing**, in decision order:

| Situation                           | Easing        |
| ----------------------------------- | ------------- |
| Entering or exiting                 | `ease-out`    |
| Moving / morphing on screen         | `ease-in-out` |
| Hover / color change                | `ease`        |
| Constant motion (marquee, progress) | `linear`      |
| Default                             | `ease-out`    |

**Never `ease-in` on UI.** It starts slow, delaying the exact moment the user is watching. `ease-out` at 200ms _feels_ faster than `ease-in` at 200ms.

Built-in CSS easings are too weak. Use these:

```css
--ease-out: cubic-bezier(0.23, 1, 0.32, 1); /* strong ease-out for UI */
--ease-in-out: cubic-bezier(
  0.77,
  0,
  0.175,
  1
); /* strong ease-in-out for on-screen movement */
--ease-drawer: cubic-bezier(
  0.32,
  0.72,
  0,
  1
); /* iOS-like drawer curve (Ionic) */
```

Need a curve that isn't here? Derive a stronger variant of the nearest standard curve from these; don't hand-roll one from nothing.

**Duration:**

| Element                  | Duration      |
| ------------------------ | ------------- |
| Button press feedback    | 100–160ms     |
| Tooltips, small popovers | 125–200ms     |
| Dropdowns, selects       | 150–250ms     |
| Modals, drawers          | 200–500ms     |
| Marketing / explanatory  | Can be longer |

**UI animations stay under 300ms. Modals, drawers, sheets, and toasts are the documented exceptions.** A 180ms dropdown feels more responsive than a 400ms one.

**Reach for a spring instead**, when the project already has a motion library, for drag with momentum, an element that should feel alive, a gesture the user can interrupt or reverse, or decorative mouse-tracking:

```js
{ type: "spring", duration: 0.5, bounce: 0.2 }        // Apple-style — easier to reason about
{ type: "spring", mass: 1, stiffness: 100, damping: 10 }  // traditional physics — more control
```

Keep bounce at 0.1–0.3, and avoid bounce in most UI — reserve it for drag-to-dismiss and playful interactions.

### 6. Interruption and exit

- **Transitions, not keyframes, for anything triggered rapidly** — toasts, toggles, anything a user can fire twice in a second. Transitions retarget from the current value; keyframes restart from zero.
- **Springs for gestures**, because they carry velocity through an interruption.
- **Exit the way it entered.** A toast that slides in from the bottom leaves through the bottom. Symmetric paths are what make swipe-to-dismiss feel obvious.
- **Asymmetric timing where the user is deciding.** Slow on the deliberate phase (a hold-to-confirm press: 2s linear), snappy on the system response (release: 200ms ease-out).

### 7. Reduced motion and pointer gating

Ships with the animation, every time. Use the same pattern as the `accessibility` skill: movement and scale are opt-in under `@media (prefers-reduced-motion: no-preference)`; under reduced motion only opacity and colour change.

```css
.element {
  transition: opacity 200ms ease;
}

@media (prefers-reduced-motion: no-preference) {
  .element {
    transition:
      opacity 200ms ease,
      transform 200ms var(--ease-out);
  }
}

@media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
  .element:hover {
    transform: scale(1.05);
  } /* touch fires false hovers on tap */
}
```

```js
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const closedX = reduce ? 0 : '-100%';
```

## Never Ship

Self-check before you finish:

| Never                                                           | Instead                                        |
| --------------------------------------------------------------- | ---------------------------------------------- |
| `transition: all`                                               | Name the exact properties                      |
| `transform: scale(0)` entrance                                  | `scale(0.95)` + `opacity: 0`                   |
| `ease-in` on a UI element                                       | `ease-out` or a strong custom curve            |
| Built-in `ease-out` on a deliberate animation                   | `cubic-bezier(0.23, 1, 0.32, 1)`               |
| Animation on a keyboard shortcut or 100+/day action             | No animation                                   |
| UI duration over 300ms with no reason                           | 150–250ms                                      |
| `transform-origin: center` on a trigger-anchored popover        | `var(--transform-origin)` (modals exempt)      |
| Keyframes on toasts, toggles, rapidly-triggered elements        | CSS transitions                                |
| Animating `width`/`height`/`margin`/`padding`/`top`/`left`      | `transform` / `opacity`                        |
| Motion `x`/`y`/`scale` props under load | The full `transform` string for the installed version |
| Ungated `:hover` motion                                         | `@media (hover: hover) and (pointer: fine)`    |
| Missing `prefers-reduced-motion` | Movement and scale inside `no-preference`; only opacity and colour remain |
| Everything entering at once                                     | 30–80ms stagger                                |
| A new motion library added for the animation                    | CSS, `@starting-style` or WAAPI                |

## Output

Write the code. Then say briefly, in your own words: whether the request passed the gate (how often it is seen and its purpose, or what you rejected and why), the ingredients you chose (tool, properties, curve, duration or spring), and what the user should check by eye because you cannot see the page, such as a crossfade, a spring's bounce or a gesture on a real touch device. The code is the deliverable; don't pad this into a report.

Opinionated and brief. When the honest answer is "this shouldn't animate," give it. When feel genuinely can't be settled from code, say so instead of guessing at a value.

## Recipes

Ready-to-build implementations for the cases that come up most. Start from the recipe, then adapt — don't rebuild from scratch. Curves are the `--ease-out`, `--ease-in-out`, and `--ease-drawer` tokens above.

Every recipe keeps movement and scale inside `@media (prefers-reduced-motion: no-preference)`; under reduced motion only opacity and colour change. The `data-starting-style`, `data-ending-style`, `data-instant` and `data-closed` attributes and `var(--transform-origin)` exist only with a component library that sets them; without one, use `@starting-style`, a class or attribute the project sets, and a `transform-origin` you set yourself.

### Button press

Any pressable element. Instant feedback that the interface heard the user.

```css
@media (prefers-reduced-motion: no-preference) {
  .button {
    transition: transform 160ms var(--ease-out);
  }

  .button:active {
    transform: scale(0.97);
  }
}
```

`scale()` scales children too — the label and icons come along, which is what makes it read as a physical press.

No hover gating needed here: `:active` is a real press on touch. Gate any `:hover` styling separately.

### Dropdown, popover, menu, select

Scales out of its trigger, not out of thin air.

```css
.popover {
  transform-origin: var(--transform-origin);
  transition: opacity 200ms var(--ease-out);
}

.popover[data-starting-style],
.popover[data-ending-style] {
  opacity: 0;
}

@media (prefers-reduced-motion: no-preference) {
  .popover {
    transition:
      opacity 200ms var(--ease-out),
      transform 200ms var(--ease-out);
  }

  .popover[data-starting-style],
  .popover[data-ending-style] {
    transform: scale(0.95);
  }
}
```

The `transform-origin` is the whole point — the panel should look like it came out of the thing you clicked.

### Tooltip

Same shape as a popover, faster, plus the detail most implementations miss.

```css
.tooltip {
  transform-origin: var(--transform-origin);
  transition: opacity 125ms var(--ease-out);
}

.tooltip[data-starting-style],
.tooltip[data-ending-style] {
  opacity: 0;
}

@media (prefers-reduced-motion: no-preference) {
  .tooltip {
    transition:
      transform 125ms var(--ease-out),
      opacity 125ms var(--ease-out);
  }

  .tooltip[data-starting-style],
  .tooltip[data-ending-style] {
    transform: scale(0.97);
  }
}

/* Once one tooltip is open, neighbours open instantly */
.tooltip[data-instant] {
  transition-duration: 0ms;
}
```

The initial delay prevents accidental activation. After that, skipping both the delay and the animation makes the whole toolbar feel faster.

### Modal

The one popover that stays centered.

```css
.modal {
  transform-origin: center; /* exempt — not anchored to a trigger */
  transition: opacity 250ms var(--ease-out);
}

.modal[data-starting-style],
.modal[data-ending-style] {
  opacity: 0;
}

@media (prefers-reduced-motion: no-preference) {
  .modal {
    transition:
      opacity 250ms var(--ease-out),
      transform 250ms var(--ease-out);
  }

  .modal[data-starting-style],
  .modal[data-ending-style] {
    transform: scale(0.96);
  }
}

.backdrop {
  transition: opacity 250ms var(--ease-out);
}
```

Animate the backdrop's opacity alongside it so they read as one surface.

### Drawer / sheet

```css
.drawer {
  transform: translateY(0);
}

.drawer[data-closed] {
  transform: translateY(100%);
}

@media (prefers-reduced-motion: no-preference) {
  .drawer {
    transition: transform 500ms var(--ease-drawer);
  }
}
```

Under reduced motion the drawer opens and closes at once. Add drag and it becomes a gesture problem — see **Drag to dismiss** below.

### Toast

```css
.toast {
  opacity: 1;
  transition: opacity 400ms ease;

  @starting-style {
    opacity: 0;
  }
}

@media (prefers-reduced-motion: no-preference) {
  .toast {
    transform: translateY(0);
    transition:
      opacity 400ms ease,
      transform 400ms ease;

    @starting-style {
      transform: translateY(100%);
    }
  }
}
```

- `ease` rather than `ease-out`, slightly slower than typical UI: a toast reads as elegant when its motion is tuned to the component's personality rather than to the generic UI budget.
- If `@starting-style` isn't available, fall back to a mount flag set from script after the element is inserted, styled as the entered state:

```js
requestAnimationFrame(() => toast.setAttribute('data-mounted', ''));
```

When toasts stack and the list reflows, the opacity change has to work against the height change. There's no formula for that pair — adjust until it feels right.

### Accordion / collapse

```css
.content {
  overflow: hidden;
  transition:
    height 200ms var(--ease-out),
    opacity 200ms var(--ease-out);
}

@media (prefers-reduced-motion: reduce) {
  .content {
    transition: opacity 200ms var(--ease-out);
  }
}
```

Keep it short — this is one of the few animations that costs layout on every frame, so a long duration is expensive as well as sluggish. Measure the content height in JS (or use a headless primitive that supplies it) rather than animating to `auto`.

### Stagger a group entrance

For a list or grid the user sees occasionally — not for a list they scroll past all day. Give the group one entrance per container, with non-uniform delays.

```css
@media (prefers-reduced-motion: no-preference) {
  .item {
    opacity: 0;
    transform: translateY(8px);
    animation: fadeIn 300ms var(--ease-out) forwards;
  }

  .item:nth-child(2) {
    animation-delay: 50ms;
  }
  .item:nth-child(3) {
    animation-delay: 90ms;
  }
  .item:nth-child(4) {
    animation-delay: 120ms;
  }
}

@keyframes fadeIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

Under reduced motion the items are simply visible. Stagger is decorative — it must never block interaction while it plays.

### Hold to confirm

For destructive actions where a plain click is too easy to fire by accident.

```css
.overlay {
  clip-path: inset(0 100% 0 0);
}

.button:active .overlay,
.button[data-holding] .overlay {
  clip-path: inset(0 0 0 0);
}

@media (prefers-reduced-motion: no-preference) {
  .overlay {
    transition: clip-path 200ms var(--ease-out); /* release: snappy */
  }

  .button:active .overlay,
  .button[data-holding] .overlay {
    transition: clip-path 2s linear; /* press: slow and deliberate */
  }

  .button:active {
    transform: scale(0.97);
  }
}
```

`linear` is correct here — the fill is a progress indicator, and progress shouldn't ease. Give it a keyboard path: holding Enter or Space sets `data-holding` from script and completes after the same 2s, or the button opens a plain confirm step. Under reduced motion the fill does not animate, so show the remaining time as text or use the plain confirm step.

### Tab indicator with a color transition

Timing individual color transitions across a tab list never quite lands. Clip instead.

Duplicate the tab list. Style the copy as the active state — different background, different text color. Give the copy `aria-hidden="true"` and `inert`, so screen readers and the keyboard meet only the real tabs. Clip the copy so only the active tab shows, and animate the clip on change:

```css
.tabs-active-copy {
  clip-path: inset(0 60% 0 20%); /* driven by the active tab's position */
}

@media (prefers-reduced-motion: no-preference) {
  .tabs-active-copy {
    transition: clip-path 250ms var(--ease-in-out);
  }
}
```

The text and background change together, in perfect sync, because they're one element being revealed rather than two colors being interpolated.

### Scroll reveal

Marketing surfaces only. Don't do this to functional UI a user visits daily.

Content is visible by default. The hidden state applies only once script has set a `js-reveal` class on the root, and only when motion is allowed, so the content stays visible without script and under reduced motion:

```css
@media (prefers-reduced-motion: no-preference) {
  .js-reveal .reveal {
    clip-path: inset(0 0 100% 0);
    transition: clip-path 600ms var(--ease-in-out);
  }

  .js-reveal .reveal[data-visible] {
    clip-path: inset(0 0 0 0);
  }
}
```

Trigger with `IntersectionObserver` (a root margin of about `-100px`), or the in-view helper of a motion library the project already has. Fire it once — re-animating on every scroll-by is an interface fighting its reader.

### Drag to dismiss

The gesture recipe. Springs, not durations, because the user can reverse mid-motion.

```js
// Dismiss on a flick, not just on distance
const timeTaken = Date.now() - dragStartTime.current;
const velocity = Math.abs(swipeAmount) / timeTaken;

if (Math.abs(swipeAmount) >= SWIPE_THRESHOLD || velocity > 0.11) {
  dismiss();
}
```

```js
// Set transform on the dragged element directly.
// Driving it through a CSS variable on the parent recalcs styles for every child.
element.style.transform = `translateY(${distance}px)`;
```

Four details that separate a good drag from a bad one:

- **Pointer capture** once the drag starts, so it continues when the pointer leaves the element's bounds.
- **Multi-touch protection** — `if (isDragging) return` on new touch points, or switching fingers mid-drag makes the element jump.
- **Damping past boundaries** — dragging beyond a natural edge moves the element less the further it goes. Real things slow before they stop.
- **Friction, not a wall** — allow the over-drag with rising resistance rather than refusing it.

Settle with a spring when the project has a motion library, so an interrupted drag keeps its velocity:

```js
{ type: "spring", duration: 0.5, bounce: 0.2 }
```

Without one, settle with a CSS transition on `transform` using `--ease-drawer`.

### Masking a crossfade that won't settle

When two states overlap visibly during a transition and no amount of easing or duration tuning fixes it, blur the seam:

```css
.content {
  transition:
    filter 200ms ease,
    opacity 200ms ease;
}

.content.transitioning {
  filter: blur(2px);
  opacity: 0.7;
}
```

Without blur the eye reads two distinct objects swapping. Blur blends them into one perceived transformation. Keep it under 20px — heavy blur is expensive, especially in Safari.

### Programmatic, without a library

When the motion needs JS control but not a dependency, WAAPI gives you CSS-grade performance:

```js
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  element.animate(
    [{ clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0 0)' }],
    {
      duration: 1000,
      fill: 'forwards',
      easing: 'cubic-bezier(0.77, 0, 0.175, 1)',
    },
  );
}
```

Hardware-accelerated, interruptible, no bundle cost.
