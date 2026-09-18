import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { BookOpen } from "lucide-react";

import panelCityFamily from "@/assets/story/01-city-family.jpg";
import panelCountryRoad from "@/assets/story/02-country-road.jpg";
import panelCountryHouse from "@/assets/story/03-country-house.jpg";
import panelDevelopingApp from "@/assets/story/04-developing-app.jpg";
import panelSharingApp from "@/assets/story/05-sharing-app.jpg";
import panelThankYou from "@/assets/story/06-thank-you.jpg";

interface StoryPanel {
  image: string;
  alt: string;
  caption: string;
}

export const StoryContent = () => {
  const { t } = useLanguage();

  const panels: StoryPanel[] = [
    {
      image: panelCityFamily,
      alt: t.storyAlt1,
      caption: t.storyCaption1,
    },
    {
      image: panelCountryRoad,
      alt: t.storyAlt2,
      caption: t.storyCaption2,
    },
    {
      image: panelCountryHouse,
      alt: t.storyAlt3,
      caption: t.storyCaption3,
    },
    {
      image: panelDevelopingApp,
      alt: t.storyAlt4,
      caption: t.storyCaption4,
    },
    {
      image: panelSharingApp,
      alt: t.storyAlt5,
      caption: t.storyCaption5,
    },
    {
      image: panelThankYou,
      alt: t.storyAlt6,
      caption: t.storyCaption6,
    },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-4 animate-slide-up">
      <div className="flex items-center gap-2 pt-2 pb-1">
        <BookOpen className="w-5 h-5 text-foreground/70" />
        <h2 className="text-xl font-bold text-foreground">{t.storyTitle}</h2>
      </div>

      {panels.map((panel, index) => (
        <motion.article
          key={index}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="rounded-2xl overflow-hidden border border-border bg-card shadow-sm"
        >
          <div className="relative">
            <img
              src={panel.image}
              alt={panel.alt}
              width={1024}
              height={1024}
              loading={index === 0 ? "eager" : "lazy"}
              className="w-full aspect-square object-cover"
            />
            <div className="absolute top-2 left-2 w-8 h-8 rounded-full bg-background/90 border border-border flex items-center justify-center text-sm font-bold text-foreground shadow-sm">
              {index + 1}
            </div>
          </div>
          <p className="px-4 py-3 text-sm text-foreground/90 leading-relaxed">
            {panel.caption}
          </p>
        </motion.article>
      ))}
    </div>
  );
};
