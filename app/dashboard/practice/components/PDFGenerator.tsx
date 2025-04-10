"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button" 
import { FileDown } from "lucide-react"
import { QuizWithRelations } from "../types"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

interface PDFGeneratorProps {
  quiz: QuizWithRelations
  answers: Record<string, string[]>
  score: number
  timeTaken: number
  correct: number
  incorrect: number
  skipped: number
}

export default function PDFGenerator({
  quiz,
  answers,
  score,
  timeTaken,
  correct,
  incorrect,
  skipped,
}: PDFGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  // Format time from seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const generatePDF = async () => {
    try {
      setIsGenerating(true)
      
      // Create new PDF document
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })
      
      // Set font
      doc.setFont("helvetica")
      
      // Add header
      doc.setFontSize(22)
      doc.setTextColor(44, 62, 80)
      doc.text("Quiz Results", 105, 20, { align: "center" })
      
      // Add date 
      doc.setFontSize(10)
      doc.setTextColor(100, 100, 100)
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 27, { align: "center" })
      
      // Add quiz title
      doc.setFontSize(16)
      doc.setTextColor(44, 62, 80)
      doc.text(quiz.title, 105, 40, { align: "center" })
      
      // Add separator line
      doc.setDrawColor(200, 200, 200)
      doc.line(20, 45, 190, 45)
      
      // Add score summary
      doc.setFontSize(14)
      doc.setTextColor(44, 62, 80)
      doc.text("Score Summary", 20, 55)
      
      // Set up the score data
      doc.setFontSize(12)
      doc.text(`Overall Score: ${score}%`, 25, 65)
      doc.text(`Time Taken: ${formatTime(timeTaken)}`, 25, 72)
      doc.text(`Questions: ${quiz.questions.length}`, 25, 79)
      doc.text(`Correct: ${correct}`, 25, 86)
      doc.text(`Incorrect: ${incorrect}`, 25, 93)
      doc.text(`Skipped: ${skipped}`, 25, 100)
      
      // Add another separator line
      doc.line(20, 110, 190, 110)
      
      // Add question analysis heading
      doc.setFontSize(14)
      doc.text("Question Analysis", 20, 120)
      
      // Initialize Y position for questions
      let yPos = 130
      
      // Loop through each question
      quiz.questions.forEach((question, index) => {
        const userAnswer = answers[question.id] || []
        const isCorrect = 
          userAnswer.length === question.correctAnswer.length && 
          userAnswer.every(ans => question.correctAnswer.includes(ans))
        const isSkipped = userAnswer.length === 0
        
        // Add question number and text (truncate if too long)
        doc.setFontSize(12)
        doc.setTextColor(44, 62, 80)
        
        const questionText = `Q${index + 1}: ${question.content}`
        // Split long text into multiple lines if needed (max 70 chars per line)
        const splitTitle = doc.splitTextToSize(questionText, 160)
        doc.text(splitTitle, 25, yPos)
        
        // Move yPos based on number of lines
        yPos += 7 * splitTitle.length
        
        // Add status
        doc.setFontSize(10)
        if (isSkipped) {
          doc.setTextColor(245, 171, 53) // Orange for skipped
          doc.text("Status: Skipped", 25, yPos)
        } else if (isCorrect) {
          doc.setTextColor(46, 204, 113) // Green for correct
          doc.text("Status: Correct", 25, yPos)
        } else {
          doc.setTextColor(231, 76, 60) // Red for incorrect
          doc.text("Status: Incorrect", 25, yPos)
        }
        
        yPos += 7
        
        // Add user's answer if not skipped
        if (!isSkipped) {
          doc.setTextColor(44, 62, 80)
          
          // Get the content of selected options
          const selectedOptions = question.options
            .filter(option => userAnswer.includes(option.id))
            .map(option => option.content)
          
          const yourAnswer = `Your answer: ${selectedOptions.join(", ")}`
          const splitAnswer = doc.splitTextToSize(yourAnswer, 160)
          doc.text(splitAnswer, 25, yPos)
          
          yPos += 7 * splitAnswer.length
        }
        
        // Add correct answer
        doc.setTextColor(46, 204, 113) // Green for correct answer
        
        const correctOptions = question.options
          .filter(option => question.correctAnswer.includes(option.id))
          .map(option => option.content)
        
        const correctAnswerText = `Correct answer: ${correctOptions.join(", ")}`
        const splitCorrect = doc.splitTextToSize(correctAnswerText, 160)
        doc.text(splitCorrect, 25, yPos)
        
        yPos += 7 * splitCorrect.length + 7
        
        // Add page if needed
        if (yPos > 270) {
          doc.addPage()
          yPos = 20
        }
      })
      
      // Add footer
      const pageCount = doc.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(10)
        doc.setTextColor(150, 150, 150)
        doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: "center" })
      }
      
      // Save the PDF
      doc.save(`${quiz.title}_results.pdf`)
    } catch (error) {
      console.error("Error generating PDF:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Button
      variant="outline"
      className="flex items-center gap-2 border-emerald-600 border-dashed text-emerald-700 border-2 hover:border-emerald-700 hover:text-emerald-700 hover:bg-emerald-50"
      onClick={generatePDF}
      disabled={isGenerating}
    >
      <FileDown className="h-4 w-4 text-emerald-700" />
      {isGenerating ? "Generating..." : "Download PDF"}
    </Button>
  )
} 