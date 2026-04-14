# MailFlow AI — Sales FAQ
## 40 Questions from Users, Creators, and Investors

---

## PRICING

**1. How much does MailFlow AI cost?**

Two tiers. Free forever: 500 contacts, 1,000 emails/month, 5 AI generations per day. Pro: $29/month flat. Unlimited contacts, 50,000 emails/month, unlimited AI, A/B testing, automation.

**2. Does the price change as my list grows?**

No. $29/month is $29/month whether you have 1,000 contacts or 100,000. We made this decision deliberately — the "pay per subscriber" model is how incumbents squeeze creators. We don't do it.

**3. Do you charge for unsubscribed contacts?**

Never. The moment someone unsubscribes, they're removed from your contact count. You pay for people who want to hear from you. Not people who don't.

**4. Is the free tier actually free, or is it crippled?**

It's real. 500 contacts and 1,000 emails/month is enough to run a genuine newsletter or small e-commerce store. No credit card required. No "free trial" countdown. Free means free.

**5. What happens if I go over my email limit on the free tier?**

You'll be prompted to upgrade to Pro. We don't auto-charge or silently throttle. You decide when to upgrade.

**6. Are there annual billing discounts?**

Not yet. Monthly billing only at launch. Annual plan with a discount (~17%) is on the roadmap.

**7. Can I cancel anytime?**

Yes. No contracts, no cancellation fees. Cancel from your account settings. Your data is yours — you can export contacts anytime.

**8. Do you have a refund policy?**

Yes. If you sign up for Pro and don't find value in the first 14 days, email us and we'll refund. No questions.

**9. What payment methods do you accept?**

All major credit cards via Stripe. No PayPal at launch.

**10. Is there a plan between Free and Pro?**

Not currently. Two tiers keeps the decision simple. If the gap feels wrong for your situation, tell us — feedback directly shapes the roadmap.

---

## AI FEATURES

**11. How does the AI email writer actually work?**

You type one sentence describing your email — what it's about, what tone you want, what the CTA is. The AI generates a subject line, preview text, and full body copy. It's built on Anthropic's Claude, tuned for marketing copy.

**12. Is this just ChatGPT with a wrapper?**

No. We use Anthropic's Claude, not OpenAI. And it's not just a wrapper — the prompting layer is specifically designed for email marketing. It understands conversion intent, subject line psychology, CTA placement, and tone variation. Generic ChatGPT doesn't produce marketing copy this focused.

**13. What are the four tones?**

Professional, casual, promotional, and storytelling. Each generates meaningfully different copy — not just the same email with an adjective swapped. You can regenerate with a different tone in one click.

**14. Can I edit the AI-generated copy?**

Yes. Everything is editable. The AI gives you a strong first draft. You take it from there. Nothing is locked.

**15. How many AI generations do I get?**

Free: 5 per day. Pro: unlimited. Rate limits exist to prevent abuse — per-user, not per-IP, so shared networks don't affect your limit.

**16. Can the AI write subject lines only?**

Yes. There are two separate generators: one for subject lines, one for full email content. You can use either independently.

**17. Does the AI get smarter about my brand voice over time?**

Not yet. Brand voice learning is on the roadmap. Currently, you guide tone through the prompt. If you have a consistent voice, describe it in the prompt: "casual and direct, like Indie Hackers, no fluff."

**18. What if the AI writes something wrong or off-brand?**

Regenerate. Or edit it manually. The AI is a first draft, not the final word. You're always in control.

---

## FEATURES & PRODUCT

**19. What features are included in Pro?**

Unlimited contacts, 50K emails/month, unlimited AI, drag-and-drop template builder, contact management with tags, real-time analytics with click heatmaps, campaign wizard, A/B testing, automation workflows, campaign scheduling.

**20. What is A/B testing and how does it work?**

You create two versions of a campaign — typically with different subject lines. MailFlow AI sends version A to a sample of your list, version B to another sample, waits for a configurable time window, then automatically sends the winner to the remaining contacts.

**21. What does the template builder include?**

Drag-and-drop content blocks: text, image, button, divider, columns. You can reorder, duplicate, delete, and style each block. Mobile preview is built in — see exactly how your email renders on phones before sending.

**22. What analytics do you track?**

Open rate, click rate, recipients, unsubscribes, audience growth over time, opens/clicks by campaign, and a click heatmap showing which links inside each email got clicked. All real-time.

**23. Does MailFlow AI support automation / drip campaigns?**

Yes, on Pro. You can set up trigger-based sequences — welcome series for new subscribers, re-engagement flows for inactive contacts, product onboarding drips. Set the trigger, write the sequence, it runs automatically.

**24. Can I import my existing contacts from Mailchimp?**

Yes. Export your contacts from Mailchimp as CSV, import into MailFlow AI. If you need help with the migration, email us and we'll walk you through it.

**25. Is there a mobile app?**

No native mobile app at launch. The web app is fully responsive and works well on mobile browsers. A native app is on the roadmap.

**26. Can I use a custom domain for sending?**

Custom sending domains (e.g., hello@yourbrand.com instead of a MailFlow AI domain) are on the roadmap for Pro users. At launch, email is sent through MailFlow AI's verified domain via Resend.

**27. What is deliverability like?**

We use Resend for email delivery — their deliverability is among the best in the industry. Your open rates depend on your domain reputation, list hygiene, and email content. We give you the tools; you maintain the list.

**28. Is there an API?**

Not at public launch. API access is planned for a future tier aimed at developers and agencies.

---

## TECHNICAL / SECURITY

**29. How is my data protected?**

All data is stored with multi-tenant isolation — your contacts and campaigns are only visible to your account. API routes are auth-guarded with NextAuth JWT sessions. Write endpoints use an allowlist to prevent mass-assignment vulnerabilities. We don't sell your data.

**30. What happens to my data if I cancel?**

Your data stays accessible for 30 days after cancellation. You can export contacts as CSV anytime. After 30 days on a cancelled account, data is purged.

**31. Is MailFlow AI GDPR compliant?**

We respect GDPR principles: you can export and delete contact data, unsubscribes are honored immediately, and we don't share contact data with third parties. Full GDPR documentation is in progress.

**32. Where is my data stored?**

In the US, on Vercel infrastructure. EU data residency options are on the roadmap.

**33. What technology powers this?**

Next.js 15 App Router, TypeScript, Anthropic Claude, Resend for email delivery, NextAuth for authentication. Production-grade from day one.

---

## COMPARISON / MIGRATION

**34. How does this compare to Mailchimp?**

| | Mailchimp | MailFlow AI |
|---|---|---|
| 10K contacts | $135/month | $29/month |
| AI email writing | Limited add-on | Built in, unlimited |
| Charges for unsubscribed contacts | Yes | Never |
| Dark mode | No | Default |
| Modern UI | No | Yes |

Mailchimp is powerful for large enterprise teams. MailFlow AI is built for individual creators and small teams who want the same power without the legacy pricing and UI.

**35. How does this compare to ConvertKit / Kit?**

ConvertKit is $59/month for 1,000 subscribers, $99/month for 5,000. MailFlow AI is $29/month for unlimited contacts. ConvertKit's AI is minimal. Ours is core. ConvertKit's strength is in visual automations for course creators — if that's your primary use case, it's worth evaluating both. If you want AI-first email creation at a lower price point, MailFlow AI wins.

**36. How does this compare to Beehiiv?**

Beehiiv is great for newsletter monetization and has a generous free tier. If your primary goal is newsletter monetization (ads, paid subscriptions), Beehiiv has features we don't have yet. If your primary need is AI-powered email creation and campaign management, MailFlow AI is the better fit. Many creators will use both.

**37. How long does migration take?**

Exporting contacts from most platforms is one button. Importing into MailFlow AI is a CSV upload. Realistically, 30 minutes to be fully operational with your existing list. Templates and past campaigns stay on your old platform — you start fresh in MailFlow AI.

---

## INVESTOR-FOCUSED

**38. What's the current traction?**

Production application deployed and live. Feature-complete: AI email writer, template builder, contact management, real-time analytics with heatmaps, A/B testing, automation. TypeScript clean codebase, auth-hardened API surface, multi-tenant isolation. Pre-revenue, going to market now.

**39. What's the business model and why will it work?**

Freemium with a strong free tier (enough to create genuine habit) and a $29/month Pro conversion. Target: 8% free-to-paid conversion rate, consistent with top-quartile PLG SaaS. At 4,000 paid users — less than 0.01% of the creator economy — MRR is $116K. Gross margin ~82% due to API cost economics at volume.

The model works because: (1) the incumbents are genuinely overpriced — migration motivation is real; (2) AI value delivery creates habit faster than traditional tools; (3) product-led growth with a viral "made with MailFlow AI" badge creates organic acquisition.

**40. What's the exit strategy?**

Three paths: (1) Build to profitability as a lean team — $116K MRR is achievable with a small team and no external capital; (2) Series A on meaningful traction to accelerate growth and add integrations/partnerships; (3) Strategic acquisition — Resend, Anthropic ecosystem companies, or a marketing platform looking to add AI-native email.

We're not building to flip. We're building to compete. An exit is a consequence of winning, not the goal.
