"use client";
import { motion } from "framer-motion";
import {
  BookOpen,
  BrainIcon,
  Cloud,
  LayoutDashboard,
  LibraryBigIcon,
  MedalIcon,
} from "lucide-react";
import { FaHandsWash } from "react-icons/fa";

const FeaturesSection = () => {
  const features = [
    {
      icon: BrainIcon,
      title: "AI-Powered Reports",
      description:
        "Our AI analyzes your recent performances and generates detailed reports highlighting your strengths and tailored recommendations to help you maximize your score.",
    },
    {
      icon: LibraryBigIcon,
      title: "Extensive Resource Library",
      description:
        "Access a vast collection of resources including video lectures, practice exams, and interactive quizzes, all customized to suit your chosen certification path.",
    },
    {
      icon: BookOpen,
      title: "Detailed Performance Insights",
      description:
        "Track your progress with in-depth analytics that pinpoint areas needing improvement and celebrate your mastery milestones.",
    },
    {
      icon: Cloud,
      title: "Multiple Certification Providers",
      description:
        "Prepare confidently for certifications across AWS, Azure, GCP, Oracle, Docker, and more—empowering you to enter any IT industry.",
    },
    {
      icon: MedalIcon,
      title: "Global Leaderboard",
      description:
        "Compete on weekly and monthly leaderboards, earn badges, and gain rewards as you climb the ranks of cloud certification achievers worldwide.",
    },
    {
      icon: LayoutDashboard,
      title: "Comprehensive Analytics Dashboard",
      description:
        "Gain clear visibility into your performance trends and growth trajectory to identify exactly where to focus your learning effort.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const featureVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
  };

  return (
    <section className="text-foreground py-16 md:py-24 px-6 md:px-12 relative overflow-hidden">
      <div className="container mx-auto flex flex-col items-center justify-center relative z-10">
        <motion.h2
          className="text-2xl md:text-5xl font-bold mb-4"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Why CloudDojo
        </motion.h2>

        <motion.p
          className="max-w-2xl mb-12 text-gray-950  dark:text-zinc-400 text-center"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          CloudDojo combines cutting-edge AI technology with expertly curated
          content to deliver the most effective and efficient cloud
          certification preparation experience.
        </motion.p>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div key={index} variants={featureVariants}>
                <div className="h-full dark:bg-white/10 backdrop-blur border dark:border-white/20 hover:bg-foreground/5 transition-all duration-300 hover:shadow-lg hover:shadow-white/5 group rounded-lg p-6">
                  <div className="pb-2">
                    <div className="mb-2 flex items-center">
                      <Icon className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-forground group-hover:text-emerald-400 transition-colors duration-300">
                      {feature.title}
                    </h3>
                  </div>
                  <div>
                    <p className="text-foreground/80 text-sm  font-light">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
