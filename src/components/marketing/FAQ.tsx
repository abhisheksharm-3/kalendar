"use client"
import { useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { RiAddLine, RiSubtractLine } from "@remixicon/react";

const items = [
  {
    question: "How does AI enhance scheduling in Kalendar?",
    answer: "Kalendar's AI analyzes your patterns, preferences, and priorities to suggest optimal scheduling times. It learns from your habits to minimize conflicts and maximize productivity.",
  },
  {
    "question": "Can Kalendar integrate with my existing calendar apps?",
    "answer": "Currently, Kalendar seamlessly integrates with Google Calendar, ensuring your schedules are synchronized between Kalendar and your Google Calendar. We're actively working on expanding our integration capabilities, and support for more calendar applications is coming soon."
  },
  {
    question: "Is my data secure with Kalendar's AI?",
    answer: "Absolutely. We prioritize your data security and privacy. Kalendar uses Google's Gemini API for AI processing, which adheres to strict security standards. We don't store any of your personal data or calendar information on our servers - only a refresh token is securely stored to provide seamless access to your Google Calendar. All data processing is done in real-time, and we are working on bringing out our own AI model to locally process data wherever possible.",
  },
  {
    "question": "How does the AI handle scheduling conflicts?",
    "answer": "Currently, Kalendar's AI analyzes your past scheduling history to intelligently resolve conflicts. It suggests alternative times based on your typical patterns. Support for more advanced conflict resolution, considering factors like priority and duration, is coming soon."
  },
  {
    "question": "Can I customize the AI's scheduling preferences?",
    "answer": "At present, Kalendar learns from your scheduling habits to adapt to your needs over time. We're actively working on introducing customizable preferences, such as preferred meeting times, break durations, and focus periods. These enhanced customization options will be available soon."
  }
];

const AccordionItem = ({ question, answer, isOpen, toggleOpen, index }: { 
  question: string, 
  answer: string, 
  isOpen: boolean, 
  toggleOpen: () => void,
  index: number
}) => {
  return (
    <motion.div 
      className="border-b border-purple-500/30"
      initial={false}
      animate={{ backgroundColor: isOpen ? "rgba(93, 44, 168, 0.1)" : "rgba(0, 0, 0, 0)" }}
      transition={{ duration: 0.3 }}
    >
      <button
        className="w-full py-6 flex items-center justify-between text-left"
        onClick={toggleOpen}
        aria-expanded={isOpen}
        aria-controls={`content-${index}`}
      >
        <span className="text-lg font-semibold pr-8">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? <RiSubtractLine className="w-6 h-6 text-purple-400" /> : <RiAddLine className="w-6 h-6 text-purple-400" />}
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`content-${index}`}
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: "auto", marginBottom: "16px" },
              collapsed: { opacity: 0, height: 0, marginBottom: "0px" }
            }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <div className="pb-6 text-purple-200">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export const FAQs = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="bg-gradient-to-b from-[#5D2CA8] to-black text-white py-24 sm:py-32">
      <div className="container max-w-4xl mx-auto px-4">
        <h2 className="text-5xl sm:text-6xl text-center font-bold tracking-tighter mb-12">
          Frequently Asked Questions
        </h2>
        <div className="mt-12">
          {items.map(({ question, answer }, index) => (
            <AccordionItem
              key={index}
              question={question}
              answer={answer}
              isOpen={openIndex === index}
              toggleOpen={() => setOpenIndex(openIndex === index ? null : index)}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  )
};