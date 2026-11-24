import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';

const LINKS = [
  { to: '/#analyze', label: 'Analyze' },
  { to: '/#how-it-works', label: 'How it works' },
  { to: '/about', label: 'About the model' },
];

const linkClass = 'rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground';

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b transition-colors',
        scrolled ? 'border-border bg-background/85 backdrop-blur-md' : 'border-transparent bg-background/60 backdrop-blur-sm',
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" aria-label="NeuroScan AI home" className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) =>
            l.to.startsWith('/#') ? (
              <Link key={l.to} to={l.to} className={linkClass}>
                {l.label}
              </Link>
            ) : (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) => cn(linkClass, isActive && 'bg-accent text-accent-foreground hover:text-accent-foreground')}
              >
                {l.label}
              </NavLink>
            ),
          )}
          <div className="ml-2 border-l border-border pl-2">
            <ThemeToggle />
          </div>
        </nav>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <Sheet key={pathname}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription className="sr-only">Site navigation</SheetDescription>
              <nav aria-label="Mobile" className="mt-6 flex flex-col gap-1">
                {LINKS.map((l) => (
                  <SheetClose asChild key={l.to}>
                    <Link to={l.to} className="rounded-md px-3 py-3 text-base font-medium hover:bg-accent hover:text-accent-foreground">
                      {l.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
