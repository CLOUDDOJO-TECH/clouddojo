"use client";
import { motion } from "framer-motion";
import TrustBadge from "./trust-badge";

const HeroSection = () => {
    return (
        <section className="bg-mint py-10 md:py-24 px-6 md:px-12">
            <div className="container mx-auto">
                <div className="flex flex-col md:flex-row items-center">
                    <motion.div
                        className="md:w-1/2 mb-8 md:mb-0"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        <span className="flex items-start mb-2 w-full justify-center sm:justify-start">
                            <TrustBadge />
                        </span>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-cstm_teal leading-tight mb-6">
                            Nail Your Cloud Certification Exams
                        </h1>
                        <p className="text-teal-900 mb-8 max-w-md">
                            Prepare for AWS, Azure, and Google Cloud certifications the intelligent way.
                            CloudDojo gives you personalized learning paths, real exam simulations, and progress analytics powered by AI to help you study smarter and pass faster.
                        </p>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <button className="rounded-full bg-cstm_teal text-white hover:bg-teal-700 px-8 py-3">
                                Start now for free
                            </button>
                        </motion.div>
                    </motion.div>
                    <motion.div
                        className="md:w-1/2 relative"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                    >
                        <div className="rounded-3xl overflow-hidden shadow-lg">
                            <img
                                src="https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80"
                                alt="Person studying cloud computing"
                                className="w-full object-cover"
                            />
                        </div>
                        <motion.div
                            className="absolute -bottom-4 -left-4 md:-left-8 w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden shadow-md border-4 border-white"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.8 }}
                        >
                            <img
                                src="https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
                                alt="Cloud certification badge"
                                className="w-full h-full object-cover"
                            />
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;