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
  let y = margin;

  // Title
  doc.setFontSize(22);
  doc.setTextColor(11, 31, 58); // civic navy
  doc.text("CivicFlow Pro — Learning Recap", margin, y);
  y += 12;

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, margin, y);
  y += 10;

  // Divider
  doc.setDrawColor(30, 58, 138);
  doc.setLineWidth(0.5);
  doc.line(margin, y, 190, y);
  y += 10;

  // Profile
  if (data.profile) {
    doc.setFontSize(14);
    doc.setTextColor(11, 31, 58);
    doc.text("Your Profile", margin, y);
    y += 8;
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    if (data.profile.state) doc.text(`State: ${data.profile.state.name}`, margin + 4, y), y += 6;
    if (data.profile.age) doc.text(`Age: ${data.profile.age}`, margin + 4, y), y += 6;
    if (data.profile.needsRegistrationHelp) doc.text("• Needs registration help", margin + 4, y), y += 6;
    if (data.profile.needsIdHelp) doc.text("• Needs ID assistance", margin + 4, y), y += 6;
    y += 6;
  }

  // Quiz Score
  doc.setFontSize(14);
  doc.setTextColor(11, 31, 58);
  doc.text("Civic Quiz Results", margin, y);
  y += 8;
  doc.setFontSize(11);
  doc.setTextColor(50, 50, 50);
  if (data.quizScore !== null) {
    doc.text(`Score: ${data.quizScore} / ${data.quizTotal} (${Math.round((data.quizScore / data.quizTotal) * 100)}%)`, margin + 4, y);
  } else {
    doc.text("Quiz not yet completed", margin + 4, y);
  }
  y += 12;

  // Completed Scenarios
  doc.setFontSize(14);
  doc.setTextColor(11, 31, 58);
  doc.text("Explored Scenarios", margin, y);
  y += 8;
  doc.setFontSize(10);
  doc.setTextColor(50, 50, 50);

  if (data.completedScenarioIds.length === 0) {
    doc.text("No scenarios explored yet", margin + 4, y);
    y += 8;
  } else {
    for (const id of data.completedScenarioIds) {
      const scenario = SCENARIOS.find((s) => s.id === id);
      if (!scenario) continue;
      if (y > 260) { doc.addPage(); y = margin; }
      doc.setFontSize(11);
      doc.setTextColor(30, 58, 138);
      doc.text(`${scenario.icon} ${scenario.title}`, margin + 4, y);
      y += 6;
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(scenario.description, margin + 8, y);
      y += 5;
      if (scenario.officialResources) {
        for (const url of scenario.officialResources) {
          doc.setTextColor(37, 99, 235);
          doc.textWithLink(url.replace(/^https?:\/\//, ""), margin + 8, y, { url });
          y += 5;
        }
      }
      y += 4;
    }
  }

  // Footer
  y += 6;
  if (y > 270) { doc.addPage(); y = margin; }
  doc.setDrawColor(30, 58, 138);
  doc.line(margin, y, 190, y);
  y += 6;
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text("CivicFlow Pro — Educational tool. Not an official government source. Always verify with your local election authority.", margin, y);

  doc.save("CivicFlow-Learning-Recap.pdf");
}
