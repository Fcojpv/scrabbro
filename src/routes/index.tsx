import { createFileRoute, ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

const ScrabbleApp = lazy(() => import("@/components/ScrabbleApp"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ScrabBro - Contador de Puntos de Scrabble" },
      {
        name: "description",
        content:
          "Aplicación minimalista para llevar el puntaje de tus partidas de Scrabble. Diseño móvil, simple y eficiente.",
      },
      { property: "og:title", content: "ScrabBro - Contador de Puntos de Scrabble" },
      {
        property: "og:description",
        content: "Aplicación minimalista para llevar el puntaje de tus partidas de Scrabble",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const fallback = <div className="min-h-screen bg-background" />;
  return (
    <ClientOnly fallback={fallback}>
      <Suspense fallback={fallback}>
        <ScrabbleApp />
      </Suspense>
    </ClientOnly>
  );
}
