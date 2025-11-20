"use client"
import { motion } from "framer-motion";

const StatsSection = () => {
  const stats = [
    {
      value: "+94%",
      description: "Users who follow CloudDojo’s learning path pass on their first attempt",
      detail: "Our AI-powered learning path identifies your knowledge gaps and creates a personalized study plan that maximizes success rates.",
      bgColor: "#ffd6dc", // Pink
      iconColor: "#be185d"
    },
    {
      value: "-40%",
      description: "Less time spent studying compared to traditional prep methods",
      detail: "Focus only on what you need to learn. Our adaptive platform eliminates wasted time on concepts you've already mastered.",
      bgColor: "#e5deff", // Purple
      iconColor: "#7e22ce"
    },
    {
      value: "+4K",
      description: "Cloud professionals certified using CloudDojo in the last 12 months",
      detail: "Join thousands of successful professionals who have advanced their careers with our certification preparation platform.",
      bgColor: "#fef7cd", // Yellow
      iconColor: "#eab308"
    },
    {
      value: "+7",
      description: "Cloud platforms supported—including AWS, Azure, Google Cloud, and others",
      detail: "Prepare for certifications across all major cloud providers with a single platform, keeping your skills relevant in a multi-cloud world.",
      bgColor: "#e5f9cd", // Green
      iconColor: "#65a30d"
    }
  ];
  
  const icons = [
    <svg key="1" className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 17L17 7M17 7H10M17 7V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>,
    <svg key="2" className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
      <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>,
    <svg key="3" className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 10V3L4 14H11V21L20 10H13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>,
    <svg key="4" className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="2"/>
      <circle cx="16" cy="16" r="3" stroke="currentColor" strokeWidth="2"/>
      <path d="M10.5 10.5L13.5 13.5" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ];
  
  return (
    <section className="py-16 md:py-24 px-6 md:px-12 bg-white">
      <div className="container mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-cstm_teal mb-4 max-w-2xl">
            CloudDojo helps you pass cloud certification exams faster—on your first try
        </h2>
        
        <p className="text-gray-700 mb-12 max-w-2xl">
        Our AI-powered platform personalizes your learning journey with smart practice exams and targeted feedback. Focus on what actually matters, save time, and build real confidence for AWS, Azure, GCP, and more.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div 
              key={index}
              style={{ 
                backgroundColor: stat.bgColor,
                borderRadius: '0.75rem',
                padding: '1.5rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                transition: 'all 0.3s ease'
              }}
              className="transform hover:-translate-y-1 duration-300 hover:scale-105"
            >
              <div className="flex items-center mb-4">
                <span className="text-3xl font-bold" style={{ color: "#1d3b4a" }}>{stat.value}</span>
                <div 
                  className="ml-2 p-1 rounded-full" 
                  style={{ 
                    backgroundColor: 'white',
                    color: stat.iconColor
                  }}
                >
                  {icons[index]}
                </div>
              </div>
              <p className="text-sm text-gray-700">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;