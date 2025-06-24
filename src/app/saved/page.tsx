import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { SavedRecipesList } from '@/components/SavedRecipesList';

export default function SavedPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="space-y-2 mb-8">
            <h1 className="text-3xl font-bold font-headline">Your Saved Recipes</h1>
            <p className="text-muted-foreground">Recipes you've saved for later.</p>
        </div>
        <SavedRecipesList />
      </main>
      <Footer />
    </div>
  );
}
