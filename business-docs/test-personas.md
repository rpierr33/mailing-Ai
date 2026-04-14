# MailFlow AI — Test Personas & E2E Use Cases

These personas define the runtime testing matrix. Each persona represents a distinct user type with a specific E2E flow that must pass before any release.

---

## Persona 1: Jasmine — Solo Creator / Newsletter Writer

**Profile:** 22, fashion/lifestyle Instagram creator, 800 followers, zero marketing experience, mobile-first

**Test Flow:**
1. Land on `/` — verify landing page renders (hero, features, AI demo, pricing, testimonials, footer)
2. Click "Start for Free" → verify redirect to `/dashboard` or `/login`
3. Click "Try Demo (No Account Needed)" on `/login` → verify redirect to `/dashboard` with session
4. Verify dashboard stats load (Total Contacts, Campaigns Sent, Avg Open Rate, Avg Click Rate)
5. Verify Audience Growth chart renders with data
6. Verify Recent Campaigns table populates
7. Click "Create Campaign" quick action → verify wizard opens
8. Step 1: Select "Regular" → verify Next enables
9. Step 2: Select "All Subscribers" → verify real contact count shows
10. Step 3: Type prompt, select "Casual" tone, click Generate → verify AI returns subject + preview + body
11. Click "AI Suggest" → verify 5 subject line alternatives appear, click one to select
12. Verify body textarea is editable (manual edit after AI generation)
13. Step 4: Verify review shows type, audience, subject, preview. Verify email preview renders in sandboxed iframe
14. Click "Send Now" → verify campaign created AND `/api/send` called (check network tab)
15. Navigate to `/analytics` → verify Opens & Clicks chart, Activity Heatmap, Top Performing Campaigns, Top Clicked Links all render
16. Toggle date range (7d, 14d, 30d) → verify chart data changes

**Covers:** Landing page, demo auth, dashboard, campaign wizard (full AI flow), analytics

---

## Persona 2: Marcus — E-commerce Side Hustle Owner

**Profile:** 26, Shopify store owner, ~300 subscribers, switching from Mailchimp, price-sensitive

**Test Flow:**
1. Navigate to `/login` → fill email + password "demo" → click "Sign In" → verify redirect to `/dashboard`
2. Navigate to `/contacts` → verify 12 contacts load with names, emails, tags, ratings, sources, dates
3. Verify tag filter chips render with counts (vip 5, newsletter 6, webinar-2024 4, customer 5)
4. Click a tag chip → verify table filters to only contacts with that tag
5. Click tag chip again → verify filter clears
6. Use search bar → type "sarah" → verify table filters to matching contacts
7. Clear search → verify all contacts return
8. Click "Add Contact" → verify slide-out panel opens from right
9. Try submitting empty → verify "Required" validation on first name and email
10. Try invalid email → verify "Invalid email" validation
11. Fill valid data (first name, last name, email, phone, select tags, notes) → click "Save Contact"
12. Verify new contact appears in the table immediately
13. Verify contact count updates (e.g., "13 contacts")
14. Click delete (trash icon) on a contact → verify contact removed from table
15. Navigate to `/templates` → verify 6 template cards render with gradient thumbnails
16. Click "Promo" template → verify editor opens with pre-loaded blocks (header, text, button, code text, footer)
17. Click a block → verify Properties panel populates on the right
18. Edit block content/colors → verify live preview updates
19. Toggle desktop/mobile preview → verify container width changes
20. Click "Save" → verify "Saved" confirmation appears
21. Click back arrow → verify return to template gallery
22. Navigate to `/campaigns` → click "Create Campaign" → complete full wizard flow → send
23. Verify campaign appears in campaigns table

**Covers:** Form auth, contacts (CRUD, search, filter, validate), templates (load pre-built, edit, save), campaigns

---

## Persona 3: Priya — SaaS Marketing Manager

**Profile:** 29, B2B SaaS marketing lead, data-driven, manages weekly campaigns, cares about analytics

**Test Flow:**
1. Login → navigate to `/analytics`
2. Verify 6 stat cards render: Emails Sent, Delivered %, Open Rate %, Click Rate %, Bounce Rate %, Unsubscribe %
3. Verify Opens & Clicks line chart renders with two lines (opens=purple, clicks=cyan)
4. Click "7 days" → verify chart shows fewer data points
5. Click "14 days" → verify chart shows more data points
6. Click "30 days" → verify chart shows full 30-day range
7. Verify Activity Heatmap renders (7 rows × 24 columns, color intensity varies)
8. Hover heatmap cell → verify tooltip shows day, hour, activity %
9. Verify Top Performing Campaigns table renders, sorted by open rate descending
10. Verify score bars render proportionally
11. Verify Top Clicked Links table renders with URL, clicks, unique, rate bars
12. Navigate to `/campaigns`
13. Use status dropdown → select "Sent" → verify only sent campaigns show
14. Use type dropdown → select "A/B Test" → verify only A/B test campaigns show
15. Reset both filters → verify all campaigns return
16. Type "Friday" in search → verify "Black Friday Sale" appears, others hidden
17. Clear search → click Duplicate on "Black Friday Sale" → verify "(Copy)" campaign appears at top
18. Click Delete on the copy → verify it's removed
19. Create new campaign: Type "A/B Test", Audience "VIP", use AI with "Professional" tone, then generate again with "Playful" tone to compare
20. Step 4: Select "Schedule", pick a date and time → verify schedule fields appear
21. Click "Schedule" → verify campaign created with "Scheduled" status
22. Navigate to `/settings` → verify 4 tabs render (Account, Billing, Integrations, AI & API)
23. Account tab: verify form fields (Org Name, From Name, From Email, Website, Industry dropdown, Timezone dropdown)
24. Click "Save Changes" → verify "Saved" confirmation
25. Billing tab: verify plan display (Free Plan, $0/month), usage bars (contacts, monthly sends)
26. Integrations tab: verify 8 integration cards render, 2 show "Connected"
27. Click "Connect" on an unconnected integration → verify it toggles to "Connected"
28. AI & API tab: verify AI configuration status shows, API keys table renders

**Covers:** Analytics (all charts, filters, tables), campaigns (filter, search, duplicate, delete, A/B test, schedule), settings (all 4 tabs)

---

## Persona 4: Derek — Indie Hacker Building in Public

**Profile:** 24, technical, building a SaaS, dark mode enthusiast, $0 budget, creates from scratch

**Test Flow:**
1. Navigate to `/` → verify dark mode is default (dark background, light text)
2. Click theme toggle → verify switches to light mode (light background, dark text, all components adapt)
3. Click theme toggle again → verify returns to dark mode
4. Navigate to `/login` → verify dark mode persists across pages
5. Login → navigate to `/templates`
6. Click "Create Template" → verify editor opens with blank canvas
7. Verify "Click a block type to start building" empty state shows
8. Click "Header" in blocks panel → verify header block appears in canvas
9. Click the header block → verify Properties panel shows Content, Background color, Text color fields
10. Edit content to "The Build Log — Week 12" → verify live preview updates
11. Change background color → verify block color changes
12. Click "Text" → verify text block added below header
13. Edit text content → adjust font size slider → verify size changes
14. Change alignment (left/center/right) → verify text alignment changes
15. Click "Divider" → verify divider appears
16. Click "2 Column" → verify two-column block appears
17. Edit left and right column content → verify both update
18. Click "Button" → verify button block appears
19. Edit label, URL, corner radius → verify button updates
20. Click "Footer" → verify footer block appears
21. Use move up/down arrows on a block → verify block reorders
22. Click delete (trash) on a block → verify block removed
23. Toggle mobile preview → verify canvas narrows to 384px width
24. Toggle back to desktop → verify canvas returns to full width
25. Name the template "Weekly Build Log" → click Save → verify "Saved" shows
26. Click back arrow → verify template gallery shows, new template appears in list
27. Navigate to `/contacts` → add 3 contacts with tags "beta-tester" and "newsletter"
28. Navigate to `/campaigns` → create campaign → type prompt → verify AI generates content
29. Edit body textarea manually (add personal details) → verify changes persist to Step 4 preview

**Covers:** Theme toggle (dark/light persistence), template builder (all 7 block types, all properties, reorder, delete, preview modes, save), contacts add, campaign with manual edit

---

## Persona 5: Rosa — Non-Technical Small Business Owner

**Profile:** 45, bakery owner in Miami, ~200 customer emails, not technical, mobile user, needs everything obvious

**Test Flow:**
1. Navigate to `/` on mobile viewport (375px) → verify:
   - Nav collapses to hamburger (hidden md:flex)
   - Hero text is readable, not clipped
   - "Start for Free" and "See How It Works" buttons stack vertically
   - Features grid is single column
   - Pricing cards stack vertically
   - Footer is single column
2. Navigate to `/login` → verify split layout collapses (form only, visual panel hidden on mobile via `hidden lg:flex`)
3. Click "Try Demo" → verify redirect works on mobile
4. Verify dashboard sidebar is hidden on mobile, hamburger menu visible
5. Click hamburger → verify sidebar slides in with overlay
6. Click "Contacts" → verify sidebar closes, contacts page loads
7. Verify contacts table hides non-essential columns on mobile (tags hidden md:, source hidden sm:, rating hidden lg:, subscribed hidden lg:)
8. Click "Add Contact" → verify slide-out panel works on mobile (full width)
9. Add a contact with just first name + email (minimum required) → verify saves
10. Navigate to `/campaigns` via hamburger menu
11. Verify campaigns table hides columns on mobile (type hidden sm:, recipients hidden md:, clicks hidden lg:, date hidden lg:)
12. Click "Create Campaign" → verify wizard modal is usable on mobile
13. Step 1: Select "Regular" → step indicators show numbers (step names hidden sm:block)
14. Step 2: Select "All Subscribers"
15. Step 3: Type a simple prompt: "Mother's Day cakes now available, order by May 8th"
16. Select "Casual" tone → click Generate → verify AI returns full email
17. Do NOT edit anything (non-technical user takes AI output as-is)
18. Step 4: Review → click "Send Now" → verify no errors, campaign created
19. Navigate to `/dashboard` → verify "Campaigns Sent" stat incremented
20. Navigate to `/analytics` → verify page renders correctly on mobile (charts resize, heatmap scrolls horizontally)
21. Click logout button in sidebar → verify redirect to landing page, session destroyed

**Covers:** Mobile responsiveness (375px), hamburger navigation, column hiding, mobile modals, AI generation without editing, logout

---

## Test Matrix Summary

| Feature | Jasmine | Marcus | Priya | Derek | Rosa |
|---------|---------|--------|-------|-------|------|
| Landing page | x | | | x | x (mobile) |
| Demo login | x | | | | x |
| Form login | | x | x | x | |
| Wrong password rejection | | x | | | |
| Dashboard stats | x | | | | x |
| Dashboard chart | x | | | | |
| Campaign wizard (full) | x | x | x | x | x |
| AI email generation | x | x | x | x | x |
| AI subject suggestions | x | | | | |
| Manual body editing | | | | x | |
| Campaign scheduling | | | x | | |
| Campaign duplicate | | | x | | |
| Campaign delete | | | x | | |
| Campaign search | | | x | | |
| Campaign filters | | | x | | |
| Contacts list | | x | | x | x |
| Contact add | | x | | x | x |
| Contact validation | | x | | | |
| Contact delete | | x | | | |
| Contact search | | x | | | |
| Contact tag filter | | x | | | |
| Template gallery | | x | | x | |
| Template pre-built load | | x | | | |
| Template create blank | | | | x | |
| Template block editing | | x | | x | |
| Template block reorder | | | | x | |
| Template save | | x | | x | |
| Template mobile preview | | | | x | |
| Analytics stats | x | | x | | |
| Analytics charts | x | | x | | x |
| Analytics heatmap | x | | x | | |
| Analytics date range | | | x | | |
| Analytics top campaigns | | | x | | |
| Settings account | | | x | | |
| Settings billing | | | x | | |
| Settings integrations | | | x | | |
| Settings AI/API | | | x | | |
| Theme toggle | | | | x | |
| Mobile responsive | | | | | x |
| Logout | | | | | x |
| Send (api/send wired) | x | x | x | x | x |
