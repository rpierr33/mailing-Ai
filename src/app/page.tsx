"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Send,
  Sparkles,
  BarChart3,
  Users,
  Zap,
  ArrowRight,
  Check,
  Star,
  Mail,
  MousePointer,
  Eye,
  Globe,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
              <Send className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-foreground">MailFlow</span>
            <span className="text-xs bg-brand-500/20 text-brand-400 px-2 py-0.5 rounded-full font-semibold">
              AI
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </a>
            <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Testimonials
            </a>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/login"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 text-sm font-medium gradient-bg text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Background gradient orbs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl" />

        <motion.div
          className="max-w-5xl mx-auto text-center relative z-10"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeUp} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-500/10 text-brand-400 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered Email Marketing
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-foreground mb-6"
          >
            Write emails that{" "}
            <span className="gradient-text">convert</span>
            <br />
            in seconds, not hours
          </motion.h1>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Type a one-liner. Get a complete email campaign with subject line,
            preview text, and body copy. Powered by AI that understands your
            brand.
          </motion.p>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-8 py-3.5 gradient-bg text-white text-base font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-brand-500/25"
            >
              Start for Free <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#features"
              className="px-8 py-3.5 text-base font-medium text-foreground border border-border rounded-xl hover:bg-secondary transition-colors"
            >
              See How It Works
            </a>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-8 mt-16 text-muted-foreground"
          >
            {[
              { value: "50K+", label: "Emails Sent" },
              { value: "98.2%", label: "Delivery Rate" },
              { value: "4.9/5", label: "User Rating" },
              { value: "2,000+", label: "Active Users" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Everything you need to{" "}
              <span className="gradient-text">grow your audience</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From AI-generated copy to advanced analytics, MailFlow gives you the tools to
              create campaigns that actually get opened.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Sparkles,
                title: "AI Email Writer",
                desc: "Type a one-liner, get a complete email. Subject line, preview text, and body — all AI-generated with multiple tone options.",
                gradient: "from-brand-500 to-accent-500",
              },
              {
                icon: Users,
                title: "Audience Management",
                desc: "Import contacts, segment your audience, and personalize every email. Smart tags and filters keep your lists organized.",
                gradient: "from-cyan-500 to-blue-500",
              },
              {
                icon: BarChart3,
                title: "Real-time Analytics",
                desc: "Track opens, clicks, and engagement in real-time. Heatmaps show you the best times to send.",
                gradient: "from-emerald-500 to-teal-500",
              },
              {
                icon: Zap,
                title: "Campaign Automation",
                desc: "Set up welcome series, re-engagement flows, and trigger-based campaigns that run on autopilot.",
                gradient: "from-amber-500 to-orange-500",
              },
              {
                icon: Mail,
                title: "Template Builder",
                desc: "Drag-and-drop email builder with pre-built templates. Create beautiful emails without touching code.",
                gradient: "from-pink-500 to-rose-500",
              },
              {
                icon: Globe,
                title: "Deliverability",
                desc: "98.2% average delivery rate. Built-in spam testing, authentication, and reputation monitoring.",
                gradient: "from-violet-500 to-purple-500",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                className="glass-card rounded-2xl p-6 hover:border-brand-500/30 transition-colors group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Demo Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 gradient-bg opacity-5" />
        <div className="max-w-5xl mx-auto relative">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Watch AI write your next email
            </h2>
            <p className="text-muted-foreground text-lg">
              Just describe what you want to say. AI does the rest.
            </p>
          </motion.div>

          <motion.div
            className="glass-card rounded-2xl p-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm text-muted-foreground ml-2">
                AI Email Generator
              </span>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-xl">
                <Sparkles className="w-5 h-5 text-brand-400 shrink-0" />
                <p className="text-foreground">
                  &quot;Announce our summer sale, 20% off everything, ends Sunday&quot;
                </p>
              </div>
              <div className="border-l-2 border-brand-500 pl-4 ml-2">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      Subject Line
                    </p>
                    <p className="text-foreground font-medium">
                      Summer is calling — 20% off everything this weekend only
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      Preview Text
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Don&apos;t miss our biggest summer sale. Ends Sunday at midnight.
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      Email Body
                    </p>
                    <div className="bg-card rounded-lg p-4 text-sm text-muted-foreground space-y-2">
                      <p>Hey there,</p>
                      <p>
                        Summer&apos;s here, and we&apos;re celebrating with our biggest sale of
                        the season. Take <strong className="text-foreground">20% off everything</strong> in
                        our store — no code needed.
                      </p>
                      <p>
                        From bestsellers to new arrivals, everything is on sale. But
                        hurry — this deal ends Sunday at midnight.
                      </p>
                      <div className="pt-2">
                        <span className="inline-block px-6 py-2 gradient-bg text-white rounded-lg font-medium text-sm">
                          Shop the Sale
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Loved by marketers everywhere
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Alex Rivera",
                role: "Marketing Lead, TechStart",
                quote:
                  "MailFlow's AI writer saved us 10+ hours per week on email copy. Our open rates jumped 40% in the first month.",
                avatar: "AR",
              },
              {
                name: "Priya Sharma",
                role: "Founder, StyleBox",
                quote:
                  "The best email tool I've used. The AI understands our brand voice perfectly. It's like having a copywriter on staff 24/7.",
                avatar: "PS",
              },
              {
                name: "Jordan Chen",
                role: "Growth, NovaPay",
                quote:
                  "We switched from Mailchimp and never looked back. The analytics are way better and the AI features are game-changing.",
                avatar: "JC",
              },
            ].map((testimonial, i) => (
              <motion.div
                key={testimonial.name}
                className="glass-card rounded-2xl p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className="w-4 h-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  &quot;{testimonial.quote}&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 gradient-bg rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-muted-foreground text-lg">
              Start free. Upgrade when you need more.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free */}
            <motion.div
              className="glass-card rounded-2xl p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold text-foreground mb-1">Free</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Perfect for getting started
              </p>
              <p className="text-4xl font-bold text-foreground mb-6">
                $0<span className="text-base font-normal text-muted-foreground">/month</span>
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "500 contacts",
                  "1,000 emails/month",
                  "AI email writer (5/day)",
                  "Basic templates",
                  "Email analytics",
                  "Email support",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/dashboard"
                className="block w-full py-3 text-center text-sm font-medium border border-border rounded-xl hover:bg-secondary transition-colors"
              >
                Get Started Free
              </Link>
            </motion.div>

            {/* Pro */}
            <motion.div
              className="relative rounded-2xl p-8 gradient-bg text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-amber-400 text-gray-900 text-xs font-bold rounded-full">
                MOST POPULAR
              </span>
              <h3 className="text-lg font-semibold mb-1">Pro</h3>
              <p className="text-white/70 text-sm mb-4">
                For growing businesses
              </p>
              <p className="text-4xl font-bold mb-6">
                $29<span className="text-base font-normal text-white/70">/month</span>
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Unlimited contacts",
                  "50,000 emails/month",
                  "Unlimited AI writer",
                  "Premium templates",
                  "Advanced analytics & heatmaps",
                  "A/B testing",
                  "Automation workflows",
                  "Priority support",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-white/90">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/dashboard"
                className="block w-full py-3 text-center text-sm font-bold bg-white text-brand-600 rounded-xl hover:bg-white/90 transition-colors"
              >
                Start Pro Trial
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-4xl mx-auto text-center glass-card rounded-3xl p-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Ready to supercharge your email marketing?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Join 2,000+ marketers using AI to write better emails faster.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-3.5 gradient-bg text-white text-base font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-brand-500/25"
          >
            Get Started Free <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 gradient-bg rounded-lg flex items-center justify-center">
              <Send className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold text-foreground">MailFlow AI</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} MailFlow AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
