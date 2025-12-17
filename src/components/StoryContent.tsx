import { Heart } from "lucide-react";
import { motion } from "framer-motion";

import panel1 from "@/assets/story/panel-1-city.jpg";
import panel2 from "@/assets/story/panel-2-journey.jpg";
import panel3 from "@/assets/story/panel-3-countryside.jpg";
import panel4 from "@/assets/story/panel-4-creating.jpg";
import panel5 from "@/assets/story/panel-5-sharing.jpg";
import panel6 from "@/assets/story/panel-6-gratitude.jpg";

interface ComicPanelProps {
  image: string;
  text: string;
  layout?: "full" | "left" | "right" | "center";
  className?: string;
  delay?: number;
}

function ComicPanel({ image, text, layout = "full", className = "", delay = 0 }: ComicPanelProps) {
  const layoutClasses = {
    full: "col-span-2",
    left: "col-span-1",
    right: "col-span-1",
    center: "col-span-2 max-w-md mx-auto",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay }}
      className={`${layoutClasses[layout]} ${className}`}
    >
      <div className="relative overflow-hidden rounded-lg border-4 border-foreground/80 shadow-[4px_4px_0px_0px_hsl(var(--foreground)/0.3)]">
        <img
          src={image}
          alt=""
          className="w-full h-full object-cover"
        />
        {text && (
          <div className="absolute bottom-0 left-0 right-0 bg-background/95 border-t-4 border-foreground/80 p-3">
            <p className="text-sm font-medium text-foreground leading-relaxed">
              {text}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function StoryContent() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-foreground mb-2 tracking-tight">
          La Historia de ScrabBro
        </h2>
        <p className="text-sm text-muted-foreground italic">
          Una historia de familia, sueños y comunidad
        </p>
        <div className="mt-2 flex justify-center gap-1">
          {[...Array(5)].map((_, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="text-lg"
            >
              ⭐
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* Comic Grid - Marvel Style Panels */}
      <div className="grid grid-cols-2 gap-3">
        {/* Panel 1 - City Life */}
        <ComicPanel
          image={panel1}
          text="En una ciudad bulliciosa, una pequeña familia soñaba con una vida diferente..."
          layout="full"
          delay={0}
        />

        {/* Panel 2 - The Journey */}
        <ComicPanel
          image={panel2}
          text="Un día, empacaron sus sueños y emprendieron el viaje hacia lo desconocido."
          layout="full"
          delay={0.1}
        />

        {/* Panel 3 - New Home */}
        <ComicPanel
          image={panel3}
          text="Al final del camino, encontraron su nuevo hogar rodeado de naturaleza."
          layout="left"
          delay={0.2}
        />

        {/* Panel 4 - Creating */}
        <ComicPanel
          image={panel4}
          text="Papá, inspirado por las tardes jugando Scrabble, creó ScrabBro."
          layout="right"
          delay={0.3}
        />

        {/* Panel 5 - Sharing with World */}
        <ComicPanel
          image={panel5}
          text="Desde el campo, lanzó su creación al mundo como mariposas mágicas."
          layout="full"
          delay={0.4}
        />

        {/* Panel 6 - Gratitude */}
        <ComicPanel
          image={panel6}
          text="Las donaciones de la comunidad les permiten seguir mejorando ScrabBro."
          layout="full"
          delay={0.5}
        />
      </div>

      {/* Epilogue */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="text-center p-6 bg-background rounded-xl border-2 border-foreground/20"
      >
        <p className="text-sm text-foreground mb-4 leading-relaxed">
          ScrabBro nació del amor por los juegos de palabras y la familia.
          <br />
          <span className="text-muted-foreground">
            Cada partida que juegas nos ayuda a seguir creando.
          </span>
        </p>
        <div className="flex items-center justify-center gap-2 text-primary">
          <Heart className="w-5 h-5 fill-current" />
          <span className="font-medium text-sm">Gracias por ser parte de esta historia</span>
          <Heart className="w-5 h-5 fill-current" />
        </div>
      </motion.div>

      {/* Footer */}
      <p className="text-center text-muted-foreground text-xs pb-4">
        Hecho con ❤️ desde el campo
      </p>
    </div>
  );
}
