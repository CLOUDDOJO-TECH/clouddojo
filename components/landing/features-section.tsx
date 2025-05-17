"use client";
import { motion } from "framer-motion";

const FeaturesSection = () => {
  const features = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="#FFD700" strokeWidth="2"/>
          <path d="M12 6V12L16 14" stroke="#FFD700" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      title: "Adaptive learning paths",
      description: "Our AI customizes your study plan based on your knowledge gaps and learning pace."
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="#FFD700" strokeWidth="2"/>
          <path d="M8 12H16" stroke="#FFD700" strokeWidth="2" strokeLinecap="round"/>
          <path d="M12 8V16" stroke="#FFD700" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      title: "Realistic exam simulation",
      description: "Practice with exam-like questions and timed environments to build confidence and reduce test anxiety."
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 3H8C6.89543 3 6 3.89543 6 5V19C6 20.1046 6.89543 21 8 21H16C17.1046 21 18 20.1046 18 19V5C18 3.89543 17.1046 3 16 3Z" stroke="#FFD700" strokeWidth="2"/>
          <path d="M12 18H12.01" stroke="#FFD700" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      title: "Mobile-optimized study",
      description: "Study anywhere with our responsive platform that syncs across all your devices."
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#FFD700" strokeWidth="2"/>
          <path d="M2 12H22" stroke="#FFD700" strokeWidth="2"/>
          <path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" stroke="#FFD700" strokeWidth="2"/>
        </svg>
      ),
      title: "Multi-cloud expertise",
      description: "Comprehensive coverage for AWS, Azure, Google Cloud, Oracle, and other major certification paths."
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20.24 12.24C21.3658 11.1142 21.9983 9.58722 21.9983 7.99504C21.9983 6.40285 21.3658 4.87585 20.24 3.75004C19.1142 2.62423 17.5872 1.9917 15.995 1.9917C14.4028 1.9917 12.8758 2.62423 11.75 3.75004L5 10.5V19H13.5L20.24 12.24Z" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 8L2 22" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M17.5 15H9" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Spaced repetition system",
      description: "Optimize knowledge retention with our scientifically-backed spaced repetition review system."
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 4H3C1.89543 4 1 4.89543 1 6V18C1 19.1046 1.89543 20 3 20H21C22.1046 20 23 19.1046 23 18V6C23 4.89543 22.1046 4 21 4Z" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M1 10H23" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Detailed performance analytics",
      description: "Track your progress with comprehensive analytics and identify areas needing improvement."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const featureVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 20 
      } 
    }
  };

  return (
    <section className="bg-cstm_teal text-white py-16 md:py-24 px-6 md:px-12 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
      </div>
      
      <div className="container mx-auto relative z-10">
        <motion.h2 
          className="text-2xl md:text-3xl font-bold mb-4"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Why CloudDojo
        </motion.h2>
        
        <motion.p 
          className="max-w-2xl mb-12 text-white/80"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          Our platform combines cutting-edge technology with expert-curated content to deliver the most effective cloud certification preparation experience available.
        </motion.p>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={featureVariants}>
              <div className="h-full bg-white/10 backdrop-blur border border-white/20 hover:bg-white/15 transition-all duration-300 hover:shadow-lg hover:shadow-white/5 group rounded-lg p-6">
                <div className="pb-2">
                  <div className="mb-2 flex items-center">
                    <div className="text-yellow-300 bg-yellow-300/10 p-2 rounded-lg group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-white group-hover:text-yellow-300 transition-colors duration-300">{feature.title}</h3>
                </div>
                <div>
                  <p className="text-white/80 text-sm">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;