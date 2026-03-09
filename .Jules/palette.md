## 2024-03-09 - Icon-only buttons lack ARIA labels
**Learning:** The application has several icon-only buttons (like the close button in TopBanner and chatbot) that lack descriptive `aria-label` attributes, which impairs accessibility for screen reader users.
**Action:** Always add an explicit, descriptive `aria-label` in Indonesian to icon-only buttons to ensure they are accessible.
