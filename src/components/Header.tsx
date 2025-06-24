import Link from 'next/link';
import { UtensilsCrossed } from 'lucide-react';

export function Header() {
  return (
    <header className="py-4 px-4 sm:px-6 md:px-8 border-b sticky top-0 bg-background/80 backdrop-blur-sm z-10">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2" aria-label="Recipe Radar Home">
          <UtensilsCrossed className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold font-headline text-foreground">
            Recipe Radar
          </h1>
        </Link>
        <nav>
          <Link href="/saved" className="text-sm font-medium text-accent-foreground hover:text-accent transition-colors">
            Saved Recipes
          </Link>
        </nav>
      </div>
    </header>
  );
}
