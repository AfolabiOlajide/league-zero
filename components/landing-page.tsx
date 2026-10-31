import Link from "next/link";
import { ArrowDown, ArrowRight, Check, CheckCheck, Gamepad2, LockKeyhole, ShieldCheck, Trophy, Users } from "lucide-react";

import { Brand } from "@/components/brand";
import { ModeToggle } from "@/components/mode-toggle";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function GetStarted({ className, label = "Get started" }: { className?: string; label?: string }) {
  return (
    <Link href="/sign-up" className={cn(buttonVariants(), "group min-h-12 gap-5 px-6 text-sm", className)}>
      {label}<ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
    </Link>
  );
}

const steps = [
  { number: "01", icon: Users, title: "Find your rival.", description: "Claim your username, find a friend, and send a rivalry request. Once they accept, your shared record begins." },
  { number: "02", icon: Gamepad2, title: "Play. Then log it.", description: "On the pitch or on the console, play your game. Add the score, the game, and the date when you’re done." },
  { number: "03", icon: ShieldCheck, title: "Make it official.", description: "Your opponent confirms the result. Only confirmed matches count toward your head-to-head record." },
];

function RivalryPreview() {
  return (
    <figure className="landing-record relative isolate bg-sidebar p-6 text-sidebar-accent-foreground sm:p-9 lg:p-10">
      <div aria-hidden="true" className="landing-pitch pointer-events-none absolute inset-5 -z-10 border border-sidebar-foreground/10 sm:inset-7">
        <div className="absolute inset-x-0 top-1/2 border-t border-sidebar-foreground/10" />
        <div className="absolute top-1/2 left-1/2 size-36 -translate-1/2 rounded-full border border-sidebar-foreground/10" />
      </div>
      <figcaption className="flex items-center justify-between gap-4 text-[10px] font-medium tracking-[0.18em] uppercase sm:text-xs">
        <span className="flex items-center gap-2"><Trophy className="size-4 text-chart-1" aria-hidden="true" /> The rivalry record</span>
        <span className="text-sidebar-foreground">Example</span>
      </figcaption>
      <div className="pt-12 pb-8 text-center sm:pt-14">
        <div className="mb-7 flex items-center justify-center gap-2 text-xs text-chart-1"><ShieldCheck className="size-4" aria-hidden="true" /> Opponent-confirmed result</div>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-5">
          <div className="min-w-0"><span className="mx-auto mb-4 grid size-12 place-items-center rounded-full bg-chart-1 text-lg font-semibold text-sidebar sm:size-16 sm:text-2xl">AJ</span><p className="text-sm font-semibold sm:text-lg">Alex</p><p className="mt-1 text-[11px] text-sidebar-foreground sm:text-xs">@alexplays</p></div>
          <div><p className="text-[clamp(3.2rem,6vw,5.5rem)] leading-none font-semibold tracking-[-0.08em] tabular-nums">3<span className="px-2 text-sidebar-foreground/50">:</span>2</p><p className="mt-4 text-[10px] tracking-[0.2em] text-sidebar-foreground uppercase">Full time</p></div>
          <div className="min-w-0"><span className="mx-auto mb-4 grid size-12 place-items-center rounded-full bg-sidebar-accent text-lg font-semibold sm:size-16 sm:text-2xl">SK</span><p className="text-sm font-semibold sm:text-lg">Sam</p><p className="mt-1 text-[11px] text-sidebar-foreground sm:text-xs">@samkicks</p></div>
        </div>
        <p className="mt-8 text-xs text-sidebar-foreground">EA Sports FC <span className="px-2" aria-hidden="true">/</span> Match 12</p>
      </div>
      <div className="grid grid-cols-3 border-y border-sidebar-border py-5 text-center">
        {[{ value: "7", label: "Alex wins" }, { value: "2", label: "Draws" }, { value: "3", label: "Sam wins" }].map(({ value, label }) => <div key={label}><p className="text-3xl font-medium tabular-nums">{value}</p><p className="mt-1 text-[11px] text-sidebar-foreground">{label}</p></div>)}
      </div>
      <div className="flex items-center justify-between gap-3 pt-5 text-[11px] text-sidebar-foreground"><span className="flex items-center gap-2"><LockKeyhole className="size-3.5" aria-hidden="true" /> Between you and your rival</span><CheckCheck className="size-5 text-chart-1" aria-label="Verified" /></div>
    </figure>
  );
}

export function LandingPage() {
  return (
    <div className="landing-page overflow-clip bg-background text-foreground">
      <a href="#main-content" className="sr-only z-50 rounded-lg bg-background p-4 focus:not-sr-only focus:fixed focus:top-3 focus:left-3">Skip to content</a>
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-3 px-5 sm:px-8 lg:px-12">
          <Brand href="/" />
          <nav aria-label="Main navigation" className="flex items-center gap-3 sm:gap-7">
            <a href="#how-it-works" className="landing-text-link hidden text-sm md:inline-flex">How it works</a>
            <Link href="/sign-in" className="landing-text-link inline-flex min-h-11 items-center text-sm">Sign in</Link>
            <GetStarted className="hidden min-h-11 px-5 sm:inline-flex" />
            <ModeToggle />
          </nav>
        </div>
      </header>

      <main id="main-content">
        <section aria-labelledby="hero-title" className="relative border-b border-border">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pt-12 pb-12 sm:px-8 sm:py-16 lg:grid-cols-[1.1fr_1fr] lg:gap-14 lg:px-12 lg:py-20">
            <div className="landing-entrance">
              <p className="mb-6 flex items-center gap-3 text-[11px] font-medium tracking-[0.18em] uppercase"><span className="h-px w-8 bg-foreground" aria-hidden="true" /> For the games between friends</p>
              <h1 id="hero-title" className="text-[clamp(3.4rem,7vw,6rem)] leading-[0.95] font-semibold tracking-[-0.065em]">League<span className="text-primary dark:text-chart-1">Zero</span><span className="mt-5 block text-[0.61em] leading-[1.08] tracking-[-0.045em]">Good games.<br />Great rivalries.<br /><span className="text-muted-foreground">A record to prove it.</span></span></h1>
              <p className="mt-7 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">Turn your football and console matches into a shared history. Find your rival, log the score, and let the results do the talking.</p>
              <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4"><GetStarted label="Start your rivalry" /><a href="#how-it-works" className="landing-text-link flex min-h-12 items-center gap-2 text-sm">How it works <ArrowDown className="size-4" aria-hidden="true" /></a></div>
              <p className="mt-6 flex items-center gap-2 text-xs text-muted-foreground"><ShieldCheck className="size-4" aria-hidden="true" /> Two players. Both agree. One official record.</p>
            </div>
            <div className="landing-entrance landing-entrance-delayed min-w-0"><RivalryPreview /><p className="mt-4 text-center text-[11px] text-muted-foreground">A little friendly competition. A history that lasts.</p></div>
          </div>
          <div className="border-t border-border bg-muted/40"><div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-8 gap-y-4 px-5 py-5 sm:px-8 lg:px-12"><p className="text-[10px] font-medium tracking-[0.16em] text-muted-foreground uppercase">Same rivalry. Your game.</p><ul className="flex flex-wrap gap-x-7 gap-y-2 text-sm font-medium sm:gap-x-10"><li>EA Sports FC</li><li>eFootball / PES</li><li>Football</li><li className="text-muted-foreground">And your own game</li></ul></div></div>
        </section>

        <section id="how-it-works" aria-labelledby="steps-title" className="mx-auto max-w-7xl scroll-mt-28 px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="mb-4 text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">From kick-off to the record book</p><h2 id="steps-title" className="text-4xl leading-tight font-medium tracking-[-0.045em] sm:text-5xl">The game is offline.<br />The history lives here.</h2></div><p className="max-w-xs text-sm leading-relaxed text-muted-foreground">No league to set up. No spreadsheet to maintain. Just you, your rival, and the next match.</p></div>
          <ol className="mt-12 grid gap-9 md:grid-cols-3 md:gap-10">{steps.map(({ number, icon: Icon, title, description }) => <li key={number} className="landing-step border-t border-border pt-6"><div className="mb-7 flex items-center justify-between"><span className="text-sm tabular-nums text-muted-foreground">{number}</span><Icon className="size-5 text-foreground" aria-hidden="true" /></div><h3 className="text-2xl font-medium tracking-tight">{title}</h3><p className="mt-3 max-w-sm text-sm leading-7 text-muted-foreground">{description}</p></li>)}</ol>
        </section>

        <section aria-labelledby="trust-title" className="bg-sidebar text-sidebar-accent-foreground">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 sm:py-20 md:grid-cols-2 md:gap-20 lg:px-12">
            <div><ShieldCheck className="mb-7 size-9 text-chart-1" strokeWidth={1.4} aria-hidden="true" /><p className="mb-4 text-xs tracking-[0.18em] text-chart-1 uppercase">Friendly competition. Trusted history.</p><h2 id="trust-title" className="max-w-md text-4xl leading-[1.1] font-medium tracking-[-0.045em] sm:text-5xl">Bragging rights.<br />Backed by both of you.</h2></div>
            <div className="self-center"><p className="max-w-md text-base leading-7 text-sidebar-foreground">A score only becomes official when your opponent confirms it. Until then, it stays pending and out of your stats.</p><ul className="mt-8 space-y-5 text-sm">{["Head-to-head wins, draws, and losses", "Recent form, streaks, and memorable scorelines", "A private record shared with your rival"].map(item => <li key={item} className="flex items-start gap-3"><Check className="size-4 shrink-0 text-chart-1" aria-hidden="true" />{item}</li>)}</ul></div>
          </div>
        </section>

        <section aria-labelledby="start-title" className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-5 py-20 sm:px-8 sm:py-24 md:flex-row md:items-center lg:px-12"><div><p className="mb-4 text-xs tracking-[0.18em] text-muted-foreground uppercase">Every rivalry starts somewhere</p><h2 id="start-title" className="text-4xl font-medium tracking-[-0.045em] sm:text-5xl">Make the next game count.</h2><p className="mt-4 text-sm text-muted-foreground">Create your profile. Find your friend. Start your record.</p></div><GetStarted label="Get started with LeagueZero" className="max-w-full" /></section>
      </main>

      <footer className="border-t border-border"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 px-5 py-8 sm:flex-row sm:items-center sm:px-8 lg:px-12"><Brand href="/" /><p className="text-xs text-muted-foreground">Play together. Keep the record.</p><Link href="/sign-in" className="landing-text-link inline-flex min-h-11 items-center text-xs">Already a rival? Sign in <ArrowRight className="ml-2 size-3.5" aria-hidden="true" /></Link></div></footer>
    </div>
  );
}
