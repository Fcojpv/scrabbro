import { Settings, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme, ColorTheme } from "@/contexts/ThemeContext";
import { Language, languageFlags, languageNames } from "@/i18n/translations";

const themeColors: Record<ColorTheme, string[]> = {
  classic: ['#8B4F47', '#E8D4C0', '#A8C7D8'],
  deluxe: ['#2C5F2D', '#FFD700', '#8B0000'],
  vintage: ['#5D4E37', '#D4AF37', '#8B7355'],
};

export const SettingsMenu = () => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();

  const languages: Language[] = ['en', 'es', 'zh', 'hi', 'ar', 'pt'];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
          <Settings className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-72 bg-card/95 backdrop-blur-sm border-2 z-50"
      >
        <DropdownMenuLabel className="text-base font-semibold">
          {t.settings}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Color Theme Section */}
        <div className="p-3 space-y-3">
          <div className="text-sm font-medium text-muted-foreground">
            {t.colorTheme}
          </div>
          <div className="space-y-2">
            {(['classic', 'deluxe', 'vintage'] as ColorTheme[]).map((themeOption) => (
              <button
                key={themeOption}
                onClick={() => setTheme(themeOption)}
                className={`
                  w-full flex items-center justify-between p-3 rounded-lg border-2 
                  transition-all hover:scale-[1.02]
                  ${theme === themeOption
                    ? 'bg-primary/10 border-primary shadow-sm'
                    : 'bg-card border-border hover:border-primary/30'
                  }
                `}
              >
                <span className="text-sm font-medium capitalize">
                  {t[themeOption]}
                </span>
                <div className="flex gap-1.5">
                  {themeColors[themeOption].map((color, idx) => (
                    <div
                      key={idx}
                      className="w-5 h-5 rounded-full border-2 border-background shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Language Section */}
        <div className="p-3 space-y-3">
          <div className="text-sm font-medium text-muted-foreground">
            {t.language}
          </div>
          <div className="space-y-1.5">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`
                  w-full flex items-center justify-between p-2.5 rounded-lg
                  transition-all hover:bg-accent/50
                  ${language === lang ? 'bg-primary/10 border border-primary' : 'hover:bg-muted/50'}
                `}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{languageFlags[lang]}</span>
                  <span className="text-sm font-medium">
                    {languageNames[lang]}
                  </span>
                </div>
                {language === lang && (
                  <div className="w-2 h-2 rounded-full bg-primary" />
                )}
              </button>
            ))}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
