import { motion } from 'framer-motion';
import CourseCard from '@/components/molecules/CourseCard';

const CourseGrid = ({ 
  courses = [], 
  showProgress = false,
  progressData = {},
  className = ''
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}
    >
      {courses.map((course) => (
        <motion.div
          key={course.Id}
          variants={itemVariants}
        >
          <CourseCard
            course={course}
            progress={showProgress ? progressData[course.Id] : null}
            showProgress={showProgress}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default CourseGrid;