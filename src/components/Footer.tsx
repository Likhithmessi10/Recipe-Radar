'use client';

import { useEffect, useState } from 'react';

export function Footer() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="py-6 text-center text-sm text-muted-foreground border-t bg-background">
      <div className="container mx-auto">
        &copy; {year && <span>{year}</span>} Recipe Radar. All rights reserved.
      </div>
    </footer>
  );
}
