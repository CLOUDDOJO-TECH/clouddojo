"use client" 
 
import { useState, useEffect } from "react" 
import { motion, AnimatePresence } from "framer-motion" 
import { Check } from 'lucide-react' 
 
const cloudPlatforms = [ 
  "AWS", 
  "Azure", 
  "GCP", 
  "Terraform", 
] 

// Map platform names to topic IDs that match the existing filter system
const platformToTopicMap: Record<string, string> = {
  "AWS": "aws", // Using existing AWS topic ID
  "Azure": "azure",
  "GCP": "google",
  "Terraform": "terraform" // You may need to add this to topicOptions in filter-component.tsx
}
 
const transitionProps = { 
  type: "spring", 
  stiffness: 500, 
  damping: 30, 
  mass: 0.5, 
} 
 
interface MainFiltersProps {
  onFilter: (filters: { topics: string[], level: string }) => void;
}
 
export default function MainFilters({ onFilter }: MainFiltersProps) { 
  const [selected, setSelected] = useState<string[]>([]) 
 
  const togglePlatform = (platform: string) => { 
    setSelected((prev) => {
      const newSelected = prev.includes(platform) 
        ? prev.filter((p) => p !== platform) 
        : [...prev, platform];
      
      // Convert platform names to topic IDs and pass to onFilter
      const topicIds = newSelected.map(platform => platformToTopicMap[platform]).filter(Boolean);
      onFilter({topics: topicIds, level: "all"});
      
      return newSelected;
    });
  } 
 
  return ( 
    <div className="p-4">
      <div className="w-full"> 
        <motion.div 
          className="flex gap-3 overflow-visible" 
          layout 
          transition={{ 
            type: "spring", 
            stiffness: 500, 
            damping: 30, 
            mass: 0.5, 
          }} 
        > 
          {cloudPlatforms.map((platform) => { 
            const isSelected = selected.includes(platform) 
            return ( 
              <motion.button 
                key={platform} 
                onClick={() => togglePlatform(platform)} 
                layout 
                initial={false} 
                animate={{ 
                  backgroundColor: isSelected ? "#2a1711" : "rgba(39, 39, 42, 0.5)", 
                }} 
                whileHover={{ 
                  backgroundColor: isSelected ? "#2a1711" : "rgba(39, 39, 42, 0.8)", 
                }} 
                whileTap={{ 
                  backgroundColor: isSelected ? "#1f1209" : "rgba(39, 39, 42, 0.9)", 
                }} 
                transition={{ 
                  type: "spring", 
                  stiffness: 500, 
                  damping: 30, 
                  mass: 0.5, 
                  backgroundColor: { duration: 0.1 }, 
                }} 
                className={` 
                  inline-flex items-center px-4 py-2 rounded-full text-base font-medium 
                  whitespace-nowrap overflow-hidden ring-1 ring-inset 
                  ${isSelected 
                    ? "text-[#ff9066] ring-[hsla(0,0%,100%,0.12)]" 
                    : "text-zinc-400 ring-[hsla(0,0%,100%,0.06)]"} 
                `} 
              > 
                <motion.div 
                  className="relative flex items-center" 
                  animate={{ 
                    width: isSelected ? "auto" : "100%", 
                    paddingRight: isSelected ? "1.5rem" : "0", 
                  }} 
                  transition={{ 
                    ease: [0.175, 0.885, 0.32, 1.275], 
                    duration: 0.3, 
                  }} 
                > 
                  <span>{platform}</span> 
                  <AnimatePresence> 
                    {isSelected && ( 
                      <motion.span 
                        initial={{ scale: 0, opacity: 0 }} 
                        animate={{ scale: 1, opacity: 1 }} 
                        exit={{ scale: 0, opacity: 0 }} 
                        transition={{ 
                          type: "spring", 
                          stiffness: 500, 
                          damping: 30, 
                          mass: 0.5 
                        }} 
                        className="absolute right-0" 
                      > 
                        <div className="w-4 h-4 rounded-full bg-[#ff9066] flex items-center justify-center"> 
                          <Check className="w-3 h-3 text-[#2a1711]" strokeWidth={1.5} /> 
                        </div> 
                      </motion.span> 
                    )} 
                  </AnimatePresence> 
                </motion.div> 
              </motion.button> 
            ) 
          })} 
        </motion.div> 
      </div> 
    </div> 
  ) 
}