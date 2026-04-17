# Support Page & Email Migration

## Overview

Add a `/support` page to the Quillium landing site for the App Store "Support URL" requirement. Replace all existing references to `thatxliner@gmail.com` with `support@quillium.bryanhu.com`.

## Support Page (`/support`)

**Route:** `src/routes/support/+page.svelte`

**Structure:** Matches existing page patterns (pricing, terms, privacy):
- `<Nav />` at top
- Centered `max-w-2xl` content area with `pt-32 pb-20` spacing
- `<Footer />` at bottom

**SEO head:** Title "Support – Quillium", canonical URL, OG/Twitter meta tags. Same Google Fonts preconnect as other pages.

**Content:**
- Headline in Newsreader serif: "Need help?"
- One paragraph: "Quillium is in public beta. If you run into a bug, have a question, or just want to say hi — email us at support@quillium.bryanhu.com."
- The email is a `mailto:` link styled consistently with existing link styles (`text-[#3b82f6]`).

No form, no FAQ sections, no JavaScript required.

## Email Migration

Replace `thatxliner@gmail.com` → `support@quillium.bryanhu.com` in these 4 files:

1. `src/routes/pricing/+page.svelte` — two mailto links (Custom Build card, "Have a better idea?" row)
2. `src/routes/terms/+page.svelte` — contact reference
3. `src/routes/privacy/+page.svelte` — contact reference
4. `src/lib/components/Footer.svelte` — footer email

## App Store URL

The resulting page at `https://quillium.bryanhu.com/support` is the value to enter in the App Store Connect "Support URL" field.
