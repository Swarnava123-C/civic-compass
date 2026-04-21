import { memo, useCallback } from "react";
import { Download } from "lucide-react";
import { generateRecapPdf, type RecapData } from "@/utils/pdfExport";

interface LearningRecapButtonProps {
  recapData: RecapData;
}

const LearningRecapButton = memo(function LearningRecapButton({ recapData }: LearningRecapButtonProps) {
  const handleDownload = useCallback(() => {
    generateRecapPdf(recapData);
  }, [recapData]);

  return (
    <button
      onClick={handleDownload}
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-accent-foreground text-sm font-medium font-sans transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring civic-glow-primary"
      aria-label="Download your learning recap as PDF"
    >
      <Download className="w-4 h-4" />
      Download Learning Recap
    </button>
  );
});

export default LearningRecapButton;
