"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"

const flashcards = [
  {
    id: 1,
    front: "What is Amazon S3?",
    back: "Amazon Simple Storage Service - Object storage built to store and retrieve any amount of data",
  },
  { id: 2, front: "What is Amazon EC2?", back: "Amazon Elastic Compute Cloud - Scalable virtual servers in the cloud" },
  {
    id: 3,
    front: "What is AWS Lambda?",
    back: "Serverless compute service that runs your code in response to events and automatically manages the underlying compute resources",
  },
  {
    id: 4,
    front: "What is Amazon RDS?",
    back: "Amazon Relational Database Service - Managed relational database service supporting multiple database engines",
  },
  {
    id: 5,
    front: "What is Amazon VPC?",
    back: "Amazon Virtual Private Cloud - Logically isolated section of the AWS Cloud where you can launch AWS resources in a virtual network",
  },
]

export default function FlashcardsPage() {
  const [currentCard, setCurrentCard] = useState(0)
  const [flipped, setFlipped] = useState(false)

  const nextCard = () => {
    setFlipped(false)
    setCurrentCard((prev) => (prev + 1) % flashcards.length)
  }

  const prevCard = () => {
    setFlipped(false)
    setCurrentCard((prev) => (prev - 1 + flashcards.length) % flashcards.length)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8 text-white">AWS Flashcards</h1>
      <div className="w-full max-w-lg">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCard}
            initial={{ opacity: 0, rotateY: -180 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0, rotateY: 180 }}
            transition={{ duration: 0.5 }}
            className={`flashcard ${flipped ? "flipped" : ""} cursor-pointer`}
            onClick={() => setFlipped(!flipped)}
          >
            <div className="flashcard-inner bg-white rounded-lg shadow-lg p-8 h-64 flex items-center justify-center">
              <div className="flashcard-front absolute w-full h-full flex items-center justify-center backface-hidden">
                <h2 className="text-2xl font-semibold text-purple-600 text-center">{flashcards[currentCard].front}</h2>
              </div>
              <div className="flashcard-back absolute w-full h-full flex items-center justify-center backface-hidden">
                <p className="text-xl text-gray-700 text-center">{flashcards[currentCard].back}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="mt-8 flex justify-between w-full max-w-lg">
        <Button onClick={prevCard} className="bg-green-400 hover:bg-green-500 text-gray-800">
          Previous
        </Button>
        <Button onClick={nextCard} className="bg-yellow-400 hover:bg-yellow-500 text-gray-800">
          Next
        </Button>
      </div>
    </div>
  )
}

