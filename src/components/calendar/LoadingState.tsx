import { motion } from 'framer-motion';

const LoadingState = () => {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-b from-[#200D42] to-black">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center"
      >
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500 mb-6"></div>
        <h2 className="text-2xl text-white font-semibold">Loading...</h2>
      </motion.div>
    </div>
  );
};

export default LoadingState;