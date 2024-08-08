import { motion } from 'framer-motion';
import { RiRocketLine, RiEmotionSadLine } from '@remixicon/react';
import { Button } from '@nextui-org/react';

const FailureComponent = ({ onRetry }: { onRetry: () => void }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#200D42] to-black text-white flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Oops, something went wrong!
          </h1>
          <p className="text-xl text-purple-200 mb-8">
            Don&apos;t worry, we&apos;ll get it sorted out.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white/10 rounded-lg p-8 mb-8"
        >
          <div className="flex items-center mb-4 text-purple-300">
            <RiEmotionSadLine className="w-6 h-6 mr-2" />
            <h2 className="text-xl font-semibold">We encountered an issue</h2>
          </div>
          <p className="text-purple-200 mb-4">
            Looks like there was a problem loading your calendar events. Don&apos;t worry, we&apos;ll get it fixed in no time!
          </p>
          <div className="flex items-center text-purple-300">
            <RiRocketLine className="w-6 h-6 mr-2" />
            <p>Let&apos;s try again and get you back on track!</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center"
        >
          <Button
            onClick={onRetry}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-8 rounded-full text-lg font-semibold shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center mx-auto"
          >
            <RiRocketLine className="w-5 h-5 mr-2" />
            <span>Blast Off Again!</span>
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default FailureComponent;