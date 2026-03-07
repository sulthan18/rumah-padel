## PALETTE'S JOURNAL

## 2026-03-07 - Missing ARIA Labels on Icon-Only Buttons
**Learning:** Icon-only buttons (like those using `lucide-react` icons for Chatbot toggle, Banner close, and User Menu dropdown) often lack explicit `aria-label`s, making them invisible or poorly described to screen reader users in this app's component library.
**Action:** Consistently verify and add `aria-label` in Indonesian (e.g., "Tutup banner promo") to any `Button` or `button` component that relies solely on an icon for visual communication.