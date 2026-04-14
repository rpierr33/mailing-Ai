# MailFlow AI — Pitch Deck Script (12 Minutes)

---

## Slide 1: Hook (1 minute)

**[Open with the question on screen. Let it sit for 3 seconds. Then speak.]**

"What if writing a marketing email took 10 seconds instead of 2 hours?"

Not a rhetorical question. That's what we built.

I'm going to show you — actually show you, live — an AI writing a complete, professional marketing email from a single sentence. Subject line. Preview text. Full body copy. In under 10 seconds.

And then I'm going to tell you why the $12.6 billion email marketing industry is about to get rebuilt from scratch.

**[Move to Slide 2.]**

---

## Slide 2: The Problem (2 minutes)

**[Show logos: Mailchimp, ConvertKit, Klaviyo, Constant Contact]**

These tools have been running the same playbook since 2009. And it's a bad playbook.

Here's the problem in three parts.

**First: the pricing model is predatory.**

Mailchimp charges you $45 a month for 2,500 contacts. That's contacts you already paid to acquire. You ran the ads. You wrote the landing page. You got the opt-in. And now Mailchimp is charging you a monthly fee to store the people who already said yes to you. ConvertKit is $59. Klaviyo is $45.

Worse — most of them charge you for unsubscribed contacts. People who explicitly said "stop emailing me." You're paying to store people who don't want to hear from you. That's not a software bug. That's a business model.

**Second: the UX is stuck in 2015.**

**[Show a Mailchimp dashboard screenshot alongside a MailFlow AI dashboard screenshot — side by side]**

On the left: Mailchimp. Cluttered nav. Small text. Light mode only. Built for a desktop from 2014. On the right: MailFlow AI. Dark by default. Clean. Fast. Built for how people actually work in 2026.

This sounds like aesthetics. It's not. Tool quality signals trust. When your email marketing platform looks like legacy software, your users trust it less. They log in less. They use it less. They churn to whatever looks better.

**Third: the AI is fake.**

Every incumbent added an AI button in the last two years. Mailchimp's AI is a template filler. ConvertKit's is a wrapper around GPT. It's AI as a marketing claim, not AI as a core product experience. The fundamental workflow — open a doc, stare at a blank canvas, write for 2 hours — hasn't changed.

That's the problem. And it's the opportunity.

**[Move to Slide 3.]**

---

## Slide 3: Market Size (1 minute)

**[Show the three-circle TAM/SAM/SOM diagram]**

The email marketing software market is $12.6 billion today and growing at 13% a year.

Our serviceable addressable market — SMBs, creators, indie hackers, small e-commerce businesses under $1M ARR — is $3.1 billion. These are the accounts incumbents charge the most while serving the worst.

Our serviceable obtainable market in 36 months — 35,000 paid users at $29/month — is $31 million ARR.

We don't need to beat Mailchimp to build a generational company. We need to capture 1% of the segment they've been overcharging for 15 years.

**[Move to Slide 4.]**

---

## Slide 4: The Solution — Live Demo (2.5 minutes)

**[Screen share or live product demo]**

Let me show you MailFlow AI.

**[Navigate to dashboard.]**

This is the dashboard. Real-time campaign stats, open rate, click rate, audience growth over time — all visible the moment you log in. Dark by default. Fast. No loading spinners.

**[Click "New Campaign."]**

I'm going to create an email campaign right now. I'll type one sentence into the AI.

**[Type: "Write a promotional email for a summer flash sale, 30% off everything, casual and exciting tone."]**

**[Click Generate.]**

Ten seconds.

**[Email appears: subject line, preview text, full body copy.]**

That's a complete marketing email. Subject line. Preview text with urgency framing. Body copy with a clear CTA. I didn't write a single word of that.

Now watch what I can do next. I can edit it inline. I can switch the tone — professional, casual, promotional, storytelling — and regenerate. I can drag and drop layout blocks. I can preview it on mobile. I can A/B test two subject lines. I can schedule it.

The entire workflow — from idea to send — is 10 minutes, not 2 hours.

**[Move to Slide 5.]**

---

## Slide 5: How It Works (1 minute)

**[Simple three-step diagram: Prompt → AI → Send]**

The architecture is straightforward.

User types a one-sentence prompt. Our AI layer — built on Anthropic's Claude — generates a subject line, preview text, and full body copy tuned to the selected tone. The user edits, customizes in the template builder, sets their audience and schedule, and sends.

Under the hood: Next.js 15 App Router, Anthropic Claude, Resend for email delivery, multi-tenant data isolation, per-user rate limiting, Zod validation on every write. TypeScript clean. Auth-hardened API surface. Production-grade from day one.

We chose Resend because their deliverability is best-in-class and the per-email cost at volume drops to fractions of a cent. Our gross margin at scale is ~82%.

**[Move to Slide 6.]**

---

## Slide 6: Business Model (1 minute)

**[Show pricing table: Free vs Pro]**

We're freemium. Free to start, convert on value.

Free: 500 contacts, 1,000 emails per month, 5 AI generations per day. Generous enough to get real use. Limited enough to create upgrade pressure.

Pro: $29 per month. Unlimited contacts, 50,000 emails per month, unlimited AI, A/B testing, automation workflows.

$29 is the sweet spot. It's cheaper than every major competitor. It's below the psychological threshold where small businesses start shopping around. And it's enough to generate serious MRR at modest user counts.

Critical differentiator: we never charge for unsubscribed contacts. Ever. A principle, not a feature.

Target free-to-paid conversion: 8%. Industry average for PLG SaaS is 4-8%. With genuine AI value delivery — not fake AI — we have strong conviction we hit the high end.

**[Move to Slide 7.]**

---

## Slide 7: Go-to-Market (1 minute)

**[Three pillars: Product-Led Growth, Social Virality, Creator Communities]**

We are product-led. Our go-to-market strategy is simple: make the product so good that users tell other people.

**Product Hunt launch** — targeting top 5 Product of the Day. Email marketing tools consistently perform well on PH because the audience is founders and indie builders — our exact ICP.

**Social amplification** — every email created with MailFlow AI has an optional "made with MailFlow AI" badge in the footer. Viral loop built into the product.

**Creator community seeding** — Indie Hackers, X/Twitter dev community, YouTube tech reviewers. We're running a targeted 50-creator direct outreach campaign at launch.

**Newsletter/content partnerships** — co-marketing with newsletter platforms and creator tooling communities.

No paid acquisition until MRR is at $10K. Every dollar before that goes into product and community.

**[Move to Slide 8.]**

---

## Slide 8: Traction (45 seconds)

**[Show GitHub-style activity graph or product screenshots]**

We are pre-revenue and proud of where we are.

Production application: live and deployed. Feature-complete: AI email writer, template builder with drag-and-drop blocks, contact management with tagging, real-time analytics with heatmaps and click tracking, campaign wizard, A/B testing, automation.

TypeScript clean codebase. Zero open type errors. Auth-hardened API surface. Multi-tenant data isolation. The infrastructure is production-grade today.

We are not showing a prototype. This is a real product ready for real users.

**[Move to Slide 9.]**

---

## Slide 9: Financial Projections (1 minute)

**[Show projection table]**

| Month | Free Users | Paid Users | MRR |
|---|---|---|---|
| Month 3 | 500 | 40 | $1,160 |
| Month 6 | 2,000 | 160 | $4,640 |
| Month 12 | 8,000 | 640 | $18,560 |
| Month 24 | 50,000 | 4,000 | $116,000 |

These are honest numbers, not hockey sticks. 8% free-to-paid conversion. Blended CAC of $40 in year one scaling to $25 in year two as word-of-mouth compounds. Gross margin ~82%.

At $116K MRR we're profitable as a lean team. We don't need external capital to survive at that point. We'd want it to accelerate.

**[Move to Slide 10.]**

---

## Slide 10: Team + Ask (1 minute)

**[Photo of Ralph Pierre]**

I'm Ralph Pierre. I built this. All of it.

I'm a full-stack engineer and product builder. I run Kalocode — an indie software studio that ships modern products across SaaS, fintech, and the creator economy.

I built MailFlow AI from zero: architecture, design, AI integration, auth hardening, email delivery, analytics, and deployment. The product you saw today is not a mockup. It's production code I wrote and shipped.

**The ask: $150,000 pre-seed.**

Use of funds: infrastructure build-out for scale ($18K), 12 months of creator marketing ($55K), product development — automation engine, integrations ($52K), operations and legal ($15K), reserve ($10K).

At 24 months: $116K MRR and Series A ready.

The email marketing industry needs a reset. The tools are too expensive, too ugly, and too dumb. We've built the replacement. We're ready to go get users.

Questions?

---

*Total runtime: ~12 minutes. Adjust demo section (Slide 4) to live conditions — pre-recorded backup recommended.*
