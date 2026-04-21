import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SubtitleOverlayProps {
  text: string;
  isVisible: boolean;
}

const SubtitleOverlay = memo(function SubtitleOverlay({ text, isVisible }: SubtitleOverlayProps) {
  return (
    <AnimatePresence>
      {isVisible && text && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 max-w-xl w-[90vw] pointer-events-none"
          role="status"
          aria-live="polite"
          aria-label="Speech subtitle"
        >
          <div className="bg-foreground/85 backdrop-blur-sm text-background rounded-xl px-5 py-3 text-sm font-sans text-center shadow-lg">
            {text}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export default SubtitleOverlay;
