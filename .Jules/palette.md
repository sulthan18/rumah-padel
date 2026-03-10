## 2024-05-14 - Add ARIA Labels to Chatbot Icon-Only Buttons
**Learning:** Found that the custom Chatbot component had icon-only buttons (`MessageCircle`, `X`, `Send`) without any ARIA labels. Since screen readers won't read the icons properly, it creates an accessibility barrier for users trying to get help from the virtual assistant.
**Action:** When adding new interactive components or floating action buttons that rely solely on icons, always include descriptive `aria-label` attributes in Indonesian (the primary language of this application) to ensure they are accessible to all users.
