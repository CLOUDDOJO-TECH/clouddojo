"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";

const AiPredictionSection = () => {
  const chartRef = useRef(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate the chart line
      gsap.from(".chart-line", {
        strokeDashoffset: 1000,
        duration: 2,
        ease: "power3.out"
      });
      
      // Animate the prediction marker
      gsap.from(".prediction-marker", {
        scale: 0,
        opacity: 0,
        delay: 1.5,
        duration: 0.8,
        ease: "elastic.out(1, 0.5)"
      });
      
      // Animate the progress markers
      gsap.from(".progress-marker", {
        y: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.4,
        delay: 0.5,
        ease: "power2.out"
      });
    }, chartRef);
    
    return () => ctx.revert();
  }, []);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.3 
      } 
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };
  
  return (
    <section className="py-16 md:py-24 px-6 md:px-12 bg-lightPurple relative">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <motion.div 
            className="md:w-1/2"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.h2 variants={itemVariants} className="text-2xl md:text-3xl font-bold text-cstm_teal mb-6">
              Our AI predicts exactly when you'll be ready to ace your exam
            </motion.h2>
            <motion.p variants={itemVariants} className="text-gray-700 mb-8">
              CloudDojo's proprietary machine learning algorithm analyzes your performance across thousands of practice questions to determine your readiness and predict your exam score with remarkable accuracy.
            </motion.p>
            
            <motion.div variants={containerVariants} className="space-y-4">
              <motion.div variants={itemVariants} className="flex items-start gap-4">
                <div className="bg-cstm_teal rounded-full p-2 text-white mt-1">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-cstm_teal">Performance Analysis</h3>
                  <p className="text-sm text-gray-700">Analyzes your speed, accuracy, and consistency across different topics</p>
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants} className="flex items-start gap-4">
                <div className="bg-cstm_teal rounded-full p-2 text-white mt-1">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-cstm_teal">Personalized Timeline</h3>
                  <p className="text-sm text-gray-700">Creates a custom study schedule with target exam date</p>
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants} className="flex items-start gap-4">
                <div className="bg-cstm_teal rounded-full p-2 text-white mt-1">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-cstm_teal">Confidence Scoring</h3>
                  <p className="text-sm text-gray-700">Measures your readiness with a proprietary confidence score</p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
          
          <div className="md:w-1/2" ref={chartRef}>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-bold text-cstm_teal">Your Exam Readiness</h3>
                <div className="bg-cardGreen text-cstm_teal text-sm px-3 py-1 rounded-full font-medium prediction-marker">
                  Ready in 12 Days
                </div>
              </div>
              
              <div className="relative h-60">
                <svg width="100%" height="100%" viewBox="0 0 400 200" fill="none">
                  {/* Grid lines */}
                  <line x1="0" y1="40" x2="400" y2="40" stroke="#f1f1f1" strokeWidth="1" />
                  <line x1="0" y1="80" x2="400" y2="80" stroke="#f1f1f1" strokeWidth="1" />
                  <line x1="0" y1="120" x2="400" y2="120" stroke="#f1f1f1" strokeWidth="1" />
                  <line x1="0" y1="160" x2="400" y2="160" stroke="#f1f1f1" strokeWidth="1" />
                  
                  {/* The chart line */}
                  <path className="chart-line" d="M0,180 C50,170 70,120 120,110 C170,100 210,140 250,100 C290,60 350,40 400,20" 
                    stroke="#1d3b4a" strokeWidth="3" fill="none" strokeDasharray="1000" strokeDashoffset="0" />
                  
                  {/* The filled area under the line */}
                  <path d="M0,180 C50,170 70,120 120,110 C170,100 210,140 250,100 C290,60 350,40 400,20 L400,200 L0,200 Z" 
                    fill="rgba(29, 59, 74, 0.1)" />
                  
                  {/* Prediction point */}
                  <circle cx="250" cy="100" r="8" fill="#e5f9cd" stroke="#1d3b4a" strokeWidth="2" className="prediction-marker" />
                  
                  {/* Progress markers */}
                  <circle cx="50" cy="170" r="4" fill="#1d3b4a" className="progress-marker" />
                  <circle cx="120" cy="110" r="4" fill="#1d3b4a" className="progress-marker" />
                  <circle cx="210" cy="140" r="4" fill="#1d3b4a" className="progress-marker" />
                </svg>
                
                {/* X-axis labels */}
                <div className="flex justify-between text-xs text-gray-500 absolute bottom-0 w-full">
                  <span>Start</span>
                  <span>Week 1</span>
                  <span>Week 2</span>
                  <span>Today</span>
                  <span>Target</span>
                </div>
              </div>
              
              <div className="mt-8 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-cardPink"></div>
                  <span className="text-gray-700">Your progress</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-cardGreen"></div>
                  <span className="text-gray-700">Predicted ready date</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AiPredictionSection;