import { motion, PanInfo } from "framer-motion";
import { Children, ReactNode } from "react";

interface SwipeableViewsProps {
  children: ReactNode;
  currentView: number;
  onViewChange: (index: number) => void;
}

export function SwipeableViews({ children, currentView, onViewChange }: SwipeableViewsProps) {
  const childArray = Children.toArray(children);
  const viewCount = childArray.length;
  
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50;
    const velocity = info.velocity.x;
    const offset = info.offset.x;
    
    if (offset < -threshold || velocity < -500) {
      // Swipe left → next view
      onViewChange(Math.min(currentView + 1, viewCount - 1));
    } else if (offset > threshold || velocity > 500) {
      // Swipe right → previous view
      onViewChange(Math.max(currentView - 1, 0));
    }
  };

  return (
    <div className="h-full w-full overflow-hidden flex-1">
      <motion.div
        className="flex h-full touch-pan-y"
        style={{ width: `${viewCount * 100}%` }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        animate={{ x: `-${currentView * (100 / viewCount)}%` }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {childArray.map((child, index) => (
          <div 
            key={index} 
            className="h-full flex-shrink-0" 
            style={{ width: `${100 / viewCount}%` }}
          >
            {child}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
