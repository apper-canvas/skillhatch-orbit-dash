import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import ProgressRing from '@/components/atoms/ProgressRing';
import Button from '@/components/atoms/Button';

const CourseCard = ({ 
  course, 
  progress = null,
  showProgress = false,
  className = ''
}) => {
  const navigate = useNavigate();
  
  const handleViewCourse = () => {
    navigate(`/course/${course.Id}`);
  };
  
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner': return 'text-success bg-success/10';
      case 'intermediate': return 'text-warning bg-warning/10';
      case 'advanced': return 'text-error bg-error/10';
      default: return 'text-gray-600 bg-gray-100';
    }
  };
  
  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'farming': return 'Sprout';
      case 'health': return 'Heart';
      case 'finance': return 'DollarSign';
      default: return 'BookOpen';
    }
  };
  
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };
  
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={`bg-white rounded-xl shadow-card overflow-hidden border border-warm-200 ${className}`}
    >
      {/* Course Image */}
      <div className="relative h-48 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="absolute inset-0 flex items-center justify-center">
          <ApperIcon 
            name={getCategoryIcon(course.category)} 
            className="w-16 h-16 text-primary/40" 
          />
        </div>
        
        {/* Featured badge */}
        {course.featured && (
          <div className="absolute top-3 left-3">
            <span className="bg-accent text-white text-xs font-medium px-2 py-1 rounded-full">
              Featured
            </span>
          </div>
        )}
        
        {/* Progress ring */}
        {showProgress && progress && (
          <div className="absolute top-3 right-3">
            <ProgressRing size={40} progress={progress.progress} />
          </div>
        )}
      </div>
      
      {/* Course Content */}
      <div className="p-6">
        {/* Category and Difficulty */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-primary capitalize">
            {course.category}
          </span>
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${getDifficultyColor(course.difficulty)}`}>
            {course.difficulty}
          </span>
        </div>
        
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {course.title}
        </h3>
        
        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {course.description}
        </p>
        
        {/* Course Stats */}
        <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <ApperIcon name="Clock" className="w-4 h-4 mr-1" />
              {formatDuration(course.duration)}
            </div>
            <div className="flex items-center">
              <ApperIcon name="BookOpen" className="w-4 h-4 mr-1" />
              {course.totalLessons} lessons
            </div>
          </div>
          
          {course.instructor && (
            <div className="flex items-center">
              <ApperIcon name="User" className="w-4 h-4 mr-1" />
              <span className="truncate max-w-20">{course.instructor}</span>
            </div>
          )}
        </div>
        
        {/* Skills */}
        {course.skills && course.skills.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {course.skills.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="text-xs bg-warm-100 text-gray-600 px-2 py-1 rounded-full"
                >
                  {skill}
                </span>
              ))}
              {course.skills.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{course.skills.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
        
        {/* Progress Bar */}
        {showProgress && progress && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Progress</span>
              <span className="text-primary font-medium">{progress.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress.progress}%` }}
                transition={{ duration: 1, delay: 0.2 }}
                className="bg-primary h-2 rounded-full"
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{progress.completedLessons?.length || 0} of {course.totalLessons} lessons</span>
              <span>{progress.hoursSpent || 0}h spent</span>
            </div>
          </div>
        )}
        
        {/* Action Button */}
        <Button
          variant="primary"
          className="w-full"
          onClick={handleViewCourse}
        >
          {showProgress && progress?.progress > 0 ? 'Continue Course' : 'Start Course'}
        </Button>
      </div>
    </motion.div>
  );
};

export default CourseCard;