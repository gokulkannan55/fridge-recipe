import { motion } from "framer-motion";
import { Clock, Users, Heart, Trash2, ChefHat } from "lucide-react";
import type { Recipe } from "@shared/schema";
import { cn } from "@/lib/utils";

interface MenuCardProps {
  recipe: Recipe;
  onToggleFavorite: (id: number, isFavorite: boolean) => void;
  onDelete: (id: number) => void;
}

export function MenuCard({ recipe, onToggleFavorite, onDelete }: MenuCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -5 }}
      className="paper-texture rounded-lg p-6 flex flex-col h-full relative group transition-colors duration-300"
    >
      {/* Decorative corner accents */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/20 rounded-tl-lg" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary/20 rounded-tr-lg" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary/20 rounded-bl-lg" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary/20 rounded-br-lg" />

      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-secondary/10 rounded-full text-secondary-foreground border border-secondary/20">
          <ChefHat className="w-5 h-5" />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onToggleFavorite(recipe.id, !recipe.isFavorite)}
            className={cn(
              "p-2 rounded-full transition-all duration-200 hover:bg-primary/5",
              recipe.isFavorite ? "text-red-600 scale-110" : "text-muted-foreground hover:text-red-500"
            )}
            aria-label={recipe.isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className={cn("w-5 h-5", recipe.isFavorite && "fill-current")} />
          </button>
          <button
            onClick={() => onDelete(recipe.id)}
            className="p-2 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors"
            aria-label="Delete recipe"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <h3 className="text-2xl font-display text-primary mb-2 leading-tight">
        {recipe.title}
      </h3>

      <div className="flex items-center gap-4 text-sm font-sans text-muted-foreground mb-6 border-b border-primary/10 pb-4">
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4" />
          <span>{recipe.preparationTime} mins</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Users className="w-4 h-4" />
          <span>{recipe.servings} servings</span>
        </div>
      </div>

      <div className="mb-6 flex-grow">
        <h4 className="font-bold text-sm uppercase tracking-wider text-primary/80 mb-2">Ingredients</h4>
        <ul className="text-sm space-y-1 text-foreground/80 leading-relaxed font-body italic">
          {recipe.ingredients.slice(0, 4).map((ing, i) => (
            <li key={i}>• {ing}</li>
          ))}
          {recipe.ingredients.length > 4 && (
            <li className="text-primary/60 text-xs mt-1">
              + {recipe.ingredients.length - 4} more ingredients...
            </li>
          )}
        </ul>
      </div>

      <div className="mt-auto pt-4 border-t border-dashed border-primary/20 flex justify-center">
        <span className="font-script text-2xl text-secondary-foreground transform -rotate-2">
          Bon Appétit
        </span>
      </div>
    </motion.div>
  );
}
