import { Link } from "react-router-dom";
import { ArrowLeft, Heart } from "lucide-react";
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
          <div className="absolute bottom-0 left-0 right-0 bg-background/95 border-t-4 border-foreground/80 p-3 md:p-4">
            <p className="text-sm md:text-base font-comic text-foreground leading-relaxed">
              {text}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function Story() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Volver</span>
          </Link>
          <h1 className="text-xl font-bold text-foreground">La Historia de ScrabBro</h1>
          <div className="w-20" />
        </div>
      </header>

      {/* Comic Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Title Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-4 font-comic tracking-tight">
            ScrabBro
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground italic">
            Una historia de familia, sueños y comunidad
          </p>
          <div className="mt-4 flex justify-center gap-2">
            {[...Array(5)].map((_, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="text-2xl"
              >
                ⭐
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Comic Grid - Marvel Style Panels */}
        <div className="grid grid-cols-2 gap-4 md:gap-6">
          {/* Panel 1 - City Life (Full Width) */}
          <ComicPanel
            image={panel1}
            text="En una ciudad bulliciosa, una pequeña familia soñaba con una vida diferente. Papá, mamá y su hijo de 10 años miraban por la ventana, imaginando horizontes más verdes..."
            layout="full"
            delay={0}
          />

          {/* Panel 2 - The Journey (Full Width - Wide) */}
          <ComicPanel
            image={panel2}
            text="Un día, tomaron la decisión. Empacaron sus sueños en un pequeño auto y emprendieron el viaje hacia lo desconocido. Las montañas les daban la bienvenida."
            layout="full"
            delay={0.1}
          />

          {/* Panel 3 - New Home (Left) */}
          <ComicPanel
            image={panel3}
            text="Al final del camino, encontraron su nuevo hogar: una acogedora casa de campo rodeada de naturaleza. Era el comienzo de una nueva aventura."
            layout="left"
            delay={0.2}
          />

          {/* Panel 4 - Creating (Right) */}
          <ComicPanel
            image={panel4}
            text="Papá, inspirado por las tardes jugando Scrabble con su familia, comenzó a crear algo especial. Línea por línea, nació ScrabBro."
            layout="right"
            delay={0.3}
          />

          {/* Panel 5 - Sharing with World (Full Width) */}
          <ComicPanel
            image={panel5}
            text="Desde la ventana de su casa en el campo, papá lanzó su creación al mundo. Como mariposas mágicas, ScrabBro voló hacia todos los rincones del planeta."
            layout="full"
            delay={0.4}
          />

          {/* Panel 6 - Gratitude (Full Width) */}
          <ComicPanel
            image={panel6}
            text="Ahora, cada atardecer, la familia contempla juntos el horizonte. Las donaciones de la comunidad les permiten seguir mejorando ScrabBro y vivir su sueño."
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
          className="mt-12 text-center p-8 bg-background rounded-2xl border-4 border-foreground/20 shadow-lg"
        >
          <p className="text-lg md:text-xl text-foreground mb-6 leading-relaxed">
            ScrabBro nació del amor por los juegos de palabras y la familia.
            <br />
            <span className="text-muted-foreground">
              Cada partida que juegas nos ayuda a seguir creando.
            </span>
          </p>
          <div className="flex items-center justify-center gap-2 text-primary">
            <Heart className="w-6 h-6 fill-current" />
            <span className="font-medium">Gracias por ser parte de esta historia</span>
            <Heart className="w-6 h-6 fill-current" />
          </div>
        </motion.div>

        {/* Back to Game Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold text-lg hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl"
          >
            <span>¡A Jugar!</span>
            <span className="text-2xl">🎮</span>
          </Link>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-muted-foreground text-sm">
        <p>Hecho con ❤️ desde el campo</p>
      </footer>
    </div>
  );
}
