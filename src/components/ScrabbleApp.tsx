import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ScrabbleGame from "@/components/ScrabbleGame";

export default function ScrabbleApp() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <ScrabbleGame />
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
