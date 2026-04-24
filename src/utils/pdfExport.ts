import jsPDF from "jspdf";
import type { UserProfile } from "@/types/civic";
import { SCENARIOS } from "@/data/scenarioData";

export interface RecapData {
  quizScore: number | null;
  quizTotal: number;
  completedScenarioIds: string[];
  profile: UserProfile | null;
}

export function generateRecapPdf(data: RecapData): void {
  const doc = new jsPDF();
  const margin = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const usableWidth = pageWidth - margin * 2;

  let y = margin;

  const ensurePageSpace = (requiredHeight: number): void => {
    if (y + requiredHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  };

  const addWrappedText = (
    text: string,
    x: number,
    fontSize = 10,
    color: [number, number, number] = [50, 50, 50]
  ): void => {
    doc.setFontSize(fontSize);
    doc.setTextColor(...color);

    const lines = doc.splitTextToSize(text, usableWidth - (x - margin));
    lines.forEach((line: string) => {
      ensurePageSpace(6);
      doc.text(line, x, y);
      y += 6;
    });
  };

  // Title
  doc.setFontSize(22);
  doc.setTextColor(11, 31, 58);
  doc.text("CivicFlow Pro — Learning Recap", margin, y);
  y += 12;

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(
    `Generated: ${new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}`,
    margin,
    y
  );
  y += 10;

  doc.setDrawColor(30, 58, 138);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  // Profile
  if (data.profile !== null) {
    doc.setFontSize(14);
    doc.setTextColor(11, 31, 58);
    doc.text("Your Profile", margin, y);
    y += 8;
    if (data.profile.state && data.profile.state.name) {
      addWrappedText(`State: ${data.profile.state.name}`, margin + 4);
    }
    if (typeof data.profile.age === "number") {
      addWrappedText(`Age: ${data.profile.age}`, margin + 4);
    }

    if (data.profile.needsRegistrationHelp === true) {
      addWrappedText("• Needs registration help", margin + 4);
    }

    if (data.profile.needsIdHelp === true) {
      addWrappedText("• Needs ID assistance", margin + 4);
    }

    y += 6;
  }

  // Quiz
  doc.setFontSize(14);
  doc.setTextColor(11, 31, 58);
  doc.text("Civic Quiz Results", margin, y);
  y += 8;

  if (data.quizScore !== null && data.quizTotal > 0) {
    const percentage = Math.round(
      (data.quizScore / data.quizTotal) * 100
    );
    addWrappedText(
      `Score: ${data.quizScore} / ${data.quizTotal} (${percentage}%)`,
      margin + 4,
      11
    );
  } else {
    addWrappedText("Quiz not yet completed", margin + 4, 11);
  }

  y += 6;

  // Scenarios
  doc.setFontSize(14);
  doc.setTextColor(11, 31, 58);
  doc.text("Explored Scenarios", margin, y);
  y += 8;

  if (data.completedScenarioIds.length === 0) {
    addWrappedText("No scenarios explored yet", margin + 4);
  } else {
    for (const id of data.completedScenarioIds) {
      const scenario = SCENARIOS.find((s) => s.id === id);
      if (scenario === undefined) continue;

      ensurePageSpace(12);

      doc.setFontSize(11);
      doc.setTextColor(30, 58, 138);
      doc.text(`${scenario.icon} ${scenario.title}`, margin + 4, y);
      y += 6;

      addWrappedText(scenario.description, margin + 8, 9, [
        100, 100, 100,
      ]);

      if (Array.isArray(scenario.officialResources)) {
        for (const url of scenario.officialResources) {
          ensurePageSpace(6);
          doc.setTextColor(37, 99, 235);
          doc.textWithLink(
            url.replace(/^https?:\/\//u, ""),
            margin + 8,
            y,
            { url }
          );
          y += 6;
        }
      }

      y += 4;
    }
  }

  // Footer
  ensurePageSpace(12);
  doc.setDrawColor(30, 58, 138);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(
    "CivicFlow Pro — Educational tool. Not an official government source. Always verify with your local election authority.",
    margin,
    y,
    { maxWidth: usableWidth }
  );

  doc.save("CivicFlow-Learning-Recap.pdf");
}
