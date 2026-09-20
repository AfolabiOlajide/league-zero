import { Brand } from "@/components/brand";
import { ModeToggle } from "@/components/mode-toggle";

type AuthShellProps = {
  children: React.ReactNode;
  eyebrow: string;
  title: string;
  description: string;
};

export function AuthShell({
  children,
  eyebrow,
  title,
  description,
}: AuthShellProps) {
  return (
    <main className="grid min-h-svh lg:grid-cols-[minmax(0,1.05fr)_minmax(28rem,0.95fr)]">
      <section className="relative hidden overflow-hidden border-r border-border bg-foreground px-12 py-10 text-background lg:flex lg:flex-col lg:justify-between">
        <div
          aria-hidden="true"
          className="absolute -right-32 -top-28 size-[32rem] rounded-full border-[7rem] border-primary/20"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-44 -left-40 size-[30rem] rounded-full border-[6rem] border-primary/10"
        />
        <Brand
          href="/"
          className="relative z-10 [&_span:last-child]:text-background"
        />
        <div className="relative z-10 max-w-xl pb-8">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-primary">
            {eyebrow}
          </p>
          <h1 className="max-w-lg text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.055em]">
            {title}
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-background/65">
            {description}
          </p>
        </div>
        <p className="relative z-10 text-sm text-background/45">
          Every official result is confirmed by both rivals.
        </p>
      </section>

      <section className="relative flex min-h-svh flex-col bg-background">
        <div className="flex items-center justify-between px-5 py-5 lg:justify-end lg:px-8">
          <Brand href="/" className="lg:hidden" />
          <ModeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center px-5 pb-16 pt-4 sm:px-8">
          {children}
        </div>
      </section>
    </main>
  );
}
