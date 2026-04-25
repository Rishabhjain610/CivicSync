import { jsPDF } from "jspdf";

const categoryColors = {
  Infrastructure: [59, 130, 246],   // blue
  Sanitation:     [16, 185, 129],   // emerald
  Safety:         [244, 63, 94],    // rose
  Greenery:       [34, 197, 94],    // green
};

const statusColors = {
  New:           [245, 158, 11],
  "In Progress": [59, 130, 246],
  Resolved:      [16, 185, 129],
};

/**
 * Strips markdown formatting characters from text for clean PDF output
 */
const stripMarkdown = (text) => {
  if (!text) return "";
  return text
    .replace(/(\*\*|__)(.*?)\1/g, "$2") // Bold
    .replace(/(\*|_)(.*?)\1/g, "$2")    // Italic
    .replace(/#+\s?(.*)/g, "$1")         // Headers
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")  // Links
    .replace(/`{1,3}.*?`{1,3}/g, "")     // Code blocks
    .replace(/>\s?(.*)/g, "$1")          // Blockquotes
    .replace(/([-*+])\s?(.*)/g, "$2")    // Lists
    .replace(/[\/*]/g, "");              // Residual slashes and stars
};

/**
 * Generate a PDF report for a civic issue
 */
export const generateIssuePDF = (issue, aiReport = null) => {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  const [catR, catG, catB] = categoryColors[issue.category] || [99, 102, 241];
  const location = [issue.town, issue.city, issue.state].filter(Boolean).join(" › ") || issue.location;

  // ── Background ────────────────────────────────────────────────────────────
  doc.setFillColor(248, 250, 252);
  doc.rect(0, 0, pageW, pageH, "F");

  // ── Header gradient block ─────────────────────────────────────────────────
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(0, 0, pageW, 48, 0, 0, "F");

  doc.setFillColor(catR, catG, catB);
  doc.rect(0, 44, pageW, 4, "F");

  // Title: Project Polis
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Project Polis", 14, 22);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(148, 163, 184);
  doc.text("Civic Issue Management System  ·  PS-03", 14, 32);

  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225);
  doc.text("ISSUE REPORT", pageW - 14, 22, { align: "right" });
  doc.setFontSize(8);
  doc.text(new Date(issue.createdAt).toLocaleDateString("en-IN"), pageW - 14, 30, { align: "right" });

  // ── Category badge ────────────────────────────────────────────────────────
  const badgeY = 58;
  doc.setFillColor(catR, catG, catB);
  doc.roundedRect(14, badgeY, 42, 8, 2, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text(issue.category.toUpperCase(), 35, badgeY + 5.5, { align: "center" });

  const [stR, stG, stB] = statusColors[issue.status] || [107, 114, 128];
  doc.setFillColor(stR, stG, stB);
  doc.roundedRect(60, badgeY, 36, 8, 2, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.text(issue.status.toUpperCase(), 78, badgeY + 5.5, { align: "center" });

  // ── Issue title ───────────────────────────────────────────────────────────
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(17);
  doc.setFont("helvetica", "bold");
  const titleLines = doc.splitTextToSize(issue.title, pageW - 28);
  doc.text(titleLines, 14, 78);

  let y = 78 + titleLines.length * 8;

  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(14, y, pageW - 14, y);
  y += 8;

  const drawInfoCell = (label, value, x, cellY, w = 85) => {
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(x, cellY, w, 22, 3, 3, "FD");

    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(148, 163, 184);
    doc.text(label.toUpperCase(), x + 5, cellY + 7);

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59);
    const valLines = doc.splitTextToSize(String(value), w - 10);
    doc.text(valLines[0], x + 5, cellY + 16);
  };

  drawInfoCell("Category",    issue.category,   14,        y);
  drawInfoCell("Status",      issue.status,      14 + 90,  y);
  y += 28;
  drawInfoCell("Votes",       `👍 ${issue.votes}`, 14,      y);
  drawInfoCell("Reported On", new Date(issue.createdAt).toLocaleDateString("en-IN"), 14 + 90, y);
  y += 28;

  doc.setFillColor(239, 246, 255);
  doc.setDrawColor(191, 219, 254);
  doc.roundedRect(14, y, pageW - 28, 22, 3, 3, "FD");
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(148, 163, 184);
  doc.text("LOCATION", 19, y + 7);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 64, 175);
  doc.text(location, 19, y + 16);
  y += 28;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(catR, catG, catB);
  doc.setLineWidth(0.8);

  const descText = stripMarkdown(issue.description || "No description provided.");
  const descLines = doc.splitTextToSize(descText, pageW - 44);
  const descH = Math.max(30, descLines.length * 5.5 + 20);

  doc.roundedRect(14, y, pageW - 28, descH, 3, 3, "F");
  doc.line(14, y, 14, y + descH);

  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(148, 163, 184);
  doc.text("DESCRIPTION", 20, y + 9);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text(descLines, 20, y + 17);
  y += descH + 10;

  if (aiReport) {
    doc.addPage();
    const p = doc.internal.pageSize;
    const pw = p.getWidth();
    const ph = p.getHeight();

    doc.setFillColor(15, 23, 42);
    doc.roundedRect(0, 0, pw, 36, 0, 0, "F");
    doc.setFillColor(catR, catG, catB);
    doc.rect(0, 32, pw, 4, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(15);
    doc.setFont("helvetica", "bold");
    doc.text("AI Analysis Report", 14, 18);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(148, 163, 184);
    doc.text(`Generated by ${process.env.GEMMA_MODEL || "Gemma"} · Project Polis`, 14, 27);

    let ay = 50;
    const cleanReport = stripMarkdown(aiReport);
    const reportLines = doc.splitTextToSize(cleanReport, pw - 28);
    
    for (const line of reportLines) {
      if (ay > ph - 20) {
        doc.addPage();
        ay = 20;
      }
      doc.setFont("helvetica", "normal");
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(9);
      doc.text(line, 14, ay);
      ay += 5.5;
    }

    doc.setFillColor(15, 23, 42);
    doc.rect(0, ph - 16, pw, 16, "F");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "normal");
    doc.text("Project Polis · AI Analysis powered by Gemma", pw / 2, ph - 7, { align: "center" });
  }

  const arrayBuffer = doc.output("arraybuffer");
  return Buffer.from(arrayBuffer);
};

