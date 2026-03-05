## 2024-05-24 - Missing ARIA labels on Icon-only Buttons
**Learning:** Multiple UI components in this app (e.g., Chatbot, TopBanner) use icon-only `<button>` elements or buttons from the UI library (like `variant="ghost" size="icon"`) without proper `aria-label`s. This makes the actions inaccessible to screen reader users, who will just hear "button" without context.
**Action:** Always verify that icon-only interactive elements (especially floating action buttons and close/dismiss buttons) include an explicit, descriptive `aria-label` in the local language (Indonesian in this case).
