import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGenerateRecipe, useSaveRecipe } from "@/hooks/use-recipes";
import { Loader2, Plus, X, Sparkles, ChefHat, Save, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export function RecipeGenerator() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState("");
  const [mealType, setMealType] = useState<"breakfast" | "lunch" | "dinner" | "snack" | "dessert">("dinner");
  const [generatedRecipe, setGeneratedRecipe] = useState<any>(null);

  const generate = useGenerateRecipe();
  const save = useSaveRecipe();

  const handleAddIngredient = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (currentIngredient.trim()) {
      setIngredients([...ingredients, currentIngredient.trim()]);
      setCurrentIngredient("");
    }
  };

  const handleGenerate = () => {
    if (ingredients.length === 0) return;
    
    generate.mutate(
      { ingredients, mealType },
      {
        onSuccess: (data) => {
          setGeneratedRecipe(data);
        },
      }
    );
  };

  const handleSave = () => {
    if (!generatedRecipe) return;
    
    save.mutate({
      title: generatedRecipe.title,
      ingredients: generatedRecipe.ingredients,
      instructions: generatedRecipe.instructions,
      preparationTime: generatedRecipe.preparationTime,
      servings: generatedRecipe.servings,
    }, {
      onSuccess: () => {
        setGeneratedRecipe(null);
        setIngredients([]);
      }
    });
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8 items-start max-w-6xl mx-auto">
      {/* Input Section - The Order Slip */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-[#F8F5F2] border-2 border-primary/10 rounded-lg shadow-xl p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-2 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#8B0000_10px,#8B0000_20px)] opacity-10" />
        
        <div className="text-center mb-8 border-b-2 border-primary/20 pb-4 border-double">
          <h2 className="text-3xl font-display text-primary mb-2">Place Your Order</h2>
          <p className="text-muted-foreground font-script text-xl">What ingredients do you have today?</p>
        </div>

        <form onSubmit={handleAddIngredient} className="mb-8">
          <div className="flex gap-2">
            <input
              value={currentIngredient}
              onChange={(e) => setCurrentIngredient(e.target.value)}
              placeholder="e.g., Chicken breast, tomatoes..."
              className="flex-1 bg-white border-b-2 border-primary/20 px-4 py-3 font-body focus:outline-none focus:border-primary transition-colors text-lg placeholder:text-muted-foreground/60"
            />
            <button
              type="submit"
              disabled={!currentIngredient.trim()}
              className="bg-primary text-primary-foreground p-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 shadow-md vintage-button"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
        </form>

        <div className="flex flex-wrap gap-2 mb-8 min-h-[100px] content-start bg-white/50 p-4 rounded-lg border border-primary/5">
          <AnimatePresence>
            {ingredients.map((ing, i) => (
              <motion.span
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="bg-white border border-primary/20 text-primary px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm font-sans text-sm"
              >
                {ing}
                <button
                  onClick={() => setIngredients(ingredients.filter((_, idx) => idx !== i))}
                  className="hover:text-red-500 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.span>
            ))}
            {ingredients.length === 0 && (
              <span className="text-muted-foreground/40 italic w-full text-center mt-8">
                Your basket is empty...
              </span>
            )}
          </AnimatePresence>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-bold uppercase tracking-wider text-primary/60 mb-3">Meal Course</label>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {(["breakfast", "lunch", "dinner", "snack", "dessert"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setMealType(type)}
                className={cn(
                  "px-4 py-2 rounded-full border text-sm font-medium transition-all whitespace-nowrap vintage-button",
                  mealType === type
                    ? "bg-primary text-primary-foreground border-primary shadow-md"
                    : "bg-transparent border-primary/20 text-primary/70 hover:border-primary/50"
                )}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={ingredients.length === 0 || generate.isPending}
          className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground py-4 rounded-lg font-display text-xl font-bold flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:transform-none disabled:shadow-none"
        >
          {generate.isPending ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Consulting the Chef...</span>
            </>
          ) : (
            <>
              <ChefHat className="w-6 h-6" />
              <span>Create Recipe</span>
            </>
          )}
        </button>
      </motion.div>

      {/* Result Section - The Special */}
      <div className="relative min-h-[400px]">
        <AnimatePresence mode="wait">
          {generatedRecipe ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20, rotate: 1 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white paper-texture rounded-lg p-8 shadow-2xl relative"
            >
               {/* "Today's Special" Stamp */}
              <div className="absolute -top-4 -right-4 bg-secondary text-secondary-foreground w-24 h-24 rounded-full flex items-center justify-center transform rotate-12 shadow-lg z-10 border-4 border-white/50 border-double">
                <span className="font-script text-2xl text-center leading-none pt-2">Chef's<br/>Choice</span>
              </div>

              <div className="text-center mb-6">
                <h3 className="text-3xl font-display text-primary font-bold mb-2">{generatedRecipe.title}</h3>
                <div className="flex justify-center gap-6 text-sm text-muted-foreground font-sans uppercase tracking-widest border-y border-primary/10 py-2">
                  <span>{generatedRecipe.preparationTime} Mins</span>
                  <span>•</span>
                  <span>{generatedRecipe.servings} Servings</span>
                </div>
              </div>

              <div className="prose prose-stone max-w-none font-body">
                <p className="italic text-center text-foreground/70 mb-6 px-4">
                  "{generatedRecipe.summary}"
                </p>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div className="bg-primary/5 p-4 rounded-lg">
                    <h4 className="font-bold text-primary uppercase tracking-wider text-sm mb-3">Ingredients</h4>
                    <ul className="list-disc pl-4 space-y-1 text-sm marker:text-secondary">
                      {generatedRecipe.ingredients.map((ing: string, i: number) => (
                        <li key={i}>{ing}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-primary uppercase tracking-wider text-sm mb-3">Instructions</h4>
                    <ol className="list-decimal pl-4 space-y-2 text-sm marker:text-primary marker:font-bold">
                      {generatedRecipe.instructions.map((step: string, i: number) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-6 border-t border-primary/10">
                <button
                  onClick={handleSave}
                  disabled={save.isPending}
                  className="flex-1 bg-primary text-primary-foreground py-3 rounded font-bold font-sans uppercase tracking-wider hover:bg-primary/90 transition-all flex items-center justify-center gap-2 vintage-button"
                >
                  {save.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Add to Menu
                </button>
                <button
                  onClick={handleGenerate}
                  className="px-4 py-3 border-2 border-primary/20 text-primary rounded hover:bg-primary/5 transition-colors"
                  aria-label="Regenerate"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-primary/20 rounded-lg bg-primary/5"
            >
              <div className="bg-white p-6 rounded-full shadow-sm mb-4">
                <Sparkles className="w-12 h-12 text-secondary" />
              </div>
              <h3 className="text-xl font-display text-primary mb-2">Awaiting Your Order</h3>
              <p className="text-muted-foreground font-body max-w-xs">
                Add your ingredients on the left and let our AI chef craft something special for you.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
