import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SubtitleOverlayProps {
  text: string;
  isVisible: boolean;
  chunkIndex?: number;
  totalChunks?: number;
}

const SubtitleOverlay = memo(function SubtitleOverlay({
  text,
  isVisible,
  chunkIndex = 0,
  totalChunks = 0,
}: SubtitleOverlayProps) {
  return (
    <AnimatePresence>
      {isVisible && text && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-xl w-[90vw] pointer-events-none"
          role="status"
          aria-live="polite"
          aria-label="AI is speaking"
        >
          <div className="rounded-2xl bg-foreground/90 backdrop-blur-xl px-6 py-4 shadow-2xl border border-border/20">
            <div className="flex items-start gap-3">
              <div className="flex items-center gap-0.5 pt-1.5 shrink-0" aria-hidden="true">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-[3px] rounded-full bg-accent"
                    animate={{ height: [6, 16, 6] }}
                    transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.12 }}
                  />
                ))}
              </div>
              <div className="flex-1 min-w-0">
                <motion.p
                  key={text}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-background text-sm font-sans leading-relaxed"
                >
                  {text}
                </motion.p>
                {totalChunks > 1 && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1 rounded-full bg-background/20 overflow-hidden">
                      <motion.div
                        className="h-full bg-accent rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${((chunkIndex + 1) / totalChunks) * 100}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <span className="text-background/50 text-[10px] font-sans tabular-nums">
                      {chunkIndex + 1}/{totalChunks}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export default SubtitleOverlay;
