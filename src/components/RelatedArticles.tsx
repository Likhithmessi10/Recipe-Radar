import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, BookOpen } from 'lucide-react';
import Link from 'next/link';

const articles = [
  {
    title: '10 Essential Cooking Tips for Beginners',
    url: 'https://www.foodandwine.com/cooking-techniques/10-essential-cooking-tips-for-beginners',
  },
  {
    title: 'Common Ingredient Substitutions',
    url: 'https://www.allrecipes.com/article/common-ingredient-substitutions/',
  },
  {
    title: 'How to Stock Your Pantry Like a Pro',
    url: 'https://www.bonappetit.com/story/how-to-stock-your-pantry',
  },
  {
    title: 'Mastering Knife Skills',
    url: 'https://www.seriouseats.com/knife-skills-fundamentals',
  },
];

export function RelatedArticles() {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex items-center gap-3">
          <BookOpen className="h-6 w-6 text-primary"/>
          <CardTitle className="font-headline text-xl">Articles & Tips</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {articles.map((article) => (
            <li key={article.title}>
              <Link href={article.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between text-sm group">
                <span className="group-hover:text-accent transition-colors">{article.title}</span>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors" />
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
