import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';

export function AdBanner() {
  return (
    <Card>
      <CardContent className="p-2">
        <Link href="#" aria-label="Advertisement">
          <div className="aspect-video relative overflow-hidden rounded-md">
            <Image
              src="https://placehold.co/600x300.png"
              alt="Advertisement"
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
              data-ai-hint="kitchen cooking"
            />
            <div className="absolute bottom-2 right-2 bg-background/80 text-foreground text-xs px-2 py-1 rounded-sm">
              Ad
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}
