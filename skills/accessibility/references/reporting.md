# Reporting

The severity ladder for a review.

**Severity.** `HIGH` prevents a task, hides content from assistive technology or creates a systemic failure. `MEDIUM` makes an interaction meaningfully harder. `LOW` is isolated polish. These escalation triggers are `HIGH` on sight: a missing accessible name, a missing focus indicator, a pointer path with no keyboard path, motion ignoring reduced motion, loss at 320px or 200% and meaning carried by color alone.

**Report.** Summarise in your own words, ordered by severity: each finding with its location (`path/to/file:line`), the WCAG criterion or principle it breaks, the user impact and the fix, one entry per root cause with every location it appears in. Then say what you verified from the code and list every check you could not run as `Not verified`. Never present coverage you did not inspect as verified.
