"use client"

import { Flag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { QuestionProps } from "../types"

export default function Question({
  question,
  questionIndex,
  totalQuestions,
  userAnswer,
  onAnswerSelect,
  isMarked,
  onToggleMark,
  type,
}: QuestionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Question {questionIndex + 1}</h2>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "flex items-center gap-1",
            isMarked ? "text-brand-beige-800" : ""
          )}
          onClick={onToggleMark}
        >
          <Flag className="h-4 w-4" />
          {isMarked ? "Unmark" : "Mark for Review"}
        </Button>
      </div>

      <div className="md:text-lg text-md ">{question.content}</div>

      <div className="mt-4 text-lg">
        {type === "single" ? (
          <RadioGroup
            value={userAnswer?.[0] || ""}
            onValueChange={(value) => onAnswerSelect(question.id, value)}
            className="space-y-3"
          >
            {question.options.map((option) => (
              <div 
                key={option.id} 
                className={cn(
                  "flex items-center space-x-2 rounded-md border p-3 hover:bg-accent dark:hover:bg-brand-beige-100/10",
                  userAnswer?.[0] === option.id ? "border-2 border-primary" : ""
                )}
              >
                <RadioGroupItem 
                  value={option.id} 
                  id={option.id} 
                  className="text-emerald-600 border-emerald-400 focus:ring-emerald-300 "
                  style={{ 
                    '--tw-ring-color': 'rgb(147 197 253)', 
                    '--tw-ring-offset-color': 'rgb(147 197 253)' 
                  } as React.CSSProperties}
                />
                <Label htmlFor={option.id} className="flex-1 cursor-pointer py-2 text-sm  md:text-md font-light">
                  {option.content}
                </Label>
              </div>
            ))}
          </RadioGroup>
        ) : (
          <div className="space-y-3">
            {question.options.map((option) => (
              <div 
                key={option.id} 
                className={cn(
                  "flex items-center space-x-2 rounded-md border p-3 hover:bg-accent dark:hover:bg-brand-beige-100/10",
                  userAnswer?.includes(option.id) ? "border-2 border-emerald-500" : ""
                )}
              >
                <Checkbox
                  id={option.id}
                  checked={userAnswer?.includes(option.id)}
                  onCheckedChange={() => onAnswerSelect(question.id, option.id)}
                  className="text-emerald-500 border-emerald-300 focus:ring-emerald-300  data-[state=checked]:border-emerald-500"
                  style={{ 
                    '--tw-ring-color': 'rgb(147 197 253)', 
                    '--tw-ring-offset-color': 'rgb(147 197 253)' 
                  } as React.CSSProperties}
                />
                <Label htmlFor={option.id} className="flex-1 cursor-pointer py-2 text-sm md:text-md font-light">
                  {option.content}
                </Label>
              </div>
            ))}
          </div>
        )}

        {type === "multiple" && (
          <p className="text-sm text-muted-foreground mt-2">Select all that apply</p>
        )}
      </div>
    </div>
  )
} 