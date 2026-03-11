
## 2024-05-15 - [Avoid Redundant ARIA Labels]
**Learning:** Adding `aria-label` to elements that already have child image `alt` text (like `user-menu.tsx` Avatar) or an `sr-only` text span (like `mobile-nav.tsx` SheetTrigger) creates redundant or conflicting screen reader output. It's important to only add `aria-label` to genuinely icon-only links that lack any hidden text or alt text mechanism.
**Action:** Before adding an `aria-label` to a component, check its children for existing accessibility mechanisms like `<span className="sr-only">` or `<img alt="..." />`. Only apply `aria-label` if no other descriptive text exists in the DOM for that element.
