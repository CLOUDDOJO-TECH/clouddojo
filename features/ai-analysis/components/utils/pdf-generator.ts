import jsPDF from "jspdf"
import { ReportData } from "../types"

export const generateAnalysisPDF = async (report: ReportData) => {
  try {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })
    
    doc.setFont("helvetica")
    doc.setFontSize(22)
    doc.setTextColor(44, 62, 80)
    doc.text("AI Analysis Report by CloudDojo", 105, 20, { align: "center" })
    
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 27, { align: "center" })
    
    doc.setDrawColor(200, 200, 200)
    doc.line(20, 45, 190, 45)
    
    doc.setFontSize(14)
    doc.setTextColor(44, 62, 80)
    doc.text("Performance Summary", 20, 55)
    
    doc.setFontSize(12)
    doc.text(`Overall Score: ${report.summary.overallScore}%`, 25, 65)
    doc.text(`Total Questions: ${report.summary.totalQuestions}`, 25, 72)
    doc.text(`Correct Answers: ${report.summary.correctAnswers}`, 25, 79)
    doc.text(`Incorrect Answers: ${report.summary.incorrectAnswers}`, 25, 86)
    doc.text(`Time Spent: ${report.summary.timeSpent}`, 25, 93)
    
    doc.setFontSize(14)
    doc.text("Strengths", 20, 120)
    let yPos = 130
    report.strengths.forEach((strength) => {
      doc.setFontSize(12)
      const lines = doc.splitTextToSize(strength, 160)
      doc.text(lines, 25, yPos)
      yPos += 10 * lines.length
    })
    
    yPos += 10
    doc.setFontSize(14)
    doc.text("Areas for Improvement", 20, yPos)
    yPos += 10
    report.weaknesses.forEach((weakness) => {
      doc.setFontSize(12)
      const lines = doc.splitTextToSize(weakness, 160)
      doc.text(lines, 25, yPos)
      yPos += 10 * lines.length
    })
    
    if (yPos > 250) {
      doc.addPage()
      yPos = 20
    }
    yPos += 10
    doc.setFontSize(14)
    doc.text("Recommendations", 20, yPos)
    yPos += 10
    report.recommendations.forEach((recommendation) => {
      doc.setFontSize(12)
      const lines = doc.splitTextToSize(recommendation, 160)
      doc.text(lines, 25, yPos)
      yPos += 10 * lines.length
    })
    
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(10)
      doc.setTextColor(150, 150, 150)
      doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: "center" })
    }
    
    doc.save("ai-analysis-report.pdf")
    return true
  } catch (error) {
    console.error("Error generating PDF:", error)
    return false
  }
} 