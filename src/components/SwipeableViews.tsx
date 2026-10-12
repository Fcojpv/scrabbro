import { Children, ReactNode, useEffect, useRef } from "react";

interface SwipeableViewsProps {
  children: ReactNode;
  currentView: number;
  onViewChange: (index: number) => void;
}

export function SwipeableViews({ children, currentView, onViewChange }: SwipeableViewsProps) {
  const childArray = Children.toArray(children);
  const containerRef = useRef<HTMLDivElement>(null);
  // Ref to track if the last view change came from a user scroll
  const isUserScrollingRef = useRef(false);
  const lastScrollTime = useRef(0);

  // Sincronizar prop currentView -> Posición de Scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Si el cambio de vista vino del usuario haciendo scroll (detectado en handleScroll),
    // NO forzamos un scrollTo programático para evitar pelear con la física nativa.
    if (isUserScrollingRef.current) {
      isUserScrollingRef.current = false;
      return;
    }

    const targetScrollLeft = currentView * container.clientWidth;

    // Solo desplazamos si hay una diferencia significativa
    if (Math.abs(container.scrollLeft - targetScrollLeft) > 10) {
      container.scrollTo({
        left: targetScrollLeft,
        behavior: "smooth"
      });
    }
  }, [currentView]);

  // Manejar evento de scroll nativo -> Actualizar prop onViewChange
  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    // Actualizamos timestamp para saber que hubo interacción "reciente"
    lastScrollTime.current = Date.now();

    // Calcular índice basado en la posición actual
    const index = Math.round(container.scrollLeft / container.clientWidth);

    // Si el índice cambió, notificamos al padre
    if (index !== currentView) {
      // Marcamos que este cambio fue provocado por el usuario
      isUserScrollingRef.current = true;
      onViewChange(index);
    }
  };

  return (
    <div className="h-full w-full overflow-hidden flex-1 relative">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex h-full w-full overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {childArray.map((child, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-full h-full snap-start snap-always overflow-hidden"
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
