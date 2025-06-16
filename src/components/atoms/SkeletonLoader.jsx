import { motion } from 'framer-motion';

const SkeletonLoader = ({ 
  count = 1, 
  height = 'h-4', 
  width = 'w-full',
  className = '',
  variant = 'default'
}) => {
  const variants = {
    default: 'bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200',
    card: 'bg-gradient-to-r from-warm-200 via-warm-300 to-warm-200',
    text: 'bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200'
  };
  
  const shimmerVariants = {
    initial: { backgroundPosition: '-200px 0' },
    animate: { 
      backgroundPosition: '200px 0',
      transition: {
        repeat: Infinity,
        duration: 1.5,
        ease: 'linear'
      }
    }
  };
  
  return (
    <div className={`space-y-3 ${className}`}>
      {[...Array(count)].map((_, index) => (
        <motion.div
          key={index}
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
          className={`${height} ${width} ${variants[variant]} rounded-lg animate-pulse`}
          style={{
            backgroundSize: '400px 100%'
          }}
        />
      ))}
    </div>
  );
};

export default SkeletonLoader;