import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const LessonCard = ({ 
  lesson, 
  courseId,
  isCompleted = false,
  isLocked = false,
  className = ''
}) => {
  const navigate = useNavigate();
  
  const handleStartLesson = () => {
    if (!isLocked) {
      navigate(`/lesson/${lesson.Id}`);
    }
  };
  
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };
  
  return (
    <motion.div
      whileHover={!isLocked ? { scale: 1.01 } : {}}
      className={`bg-white rounded-lg border-2 transition-all duration-200 ${
        isCompleted 
          ? 'border-success bg-success/5' 
          : isLocked 
            ? 'border-gray-200 bg-gray-50 opacity-60'
            : 'border-warm-200 hover:border-primary hover:shadow-elevation'
      } ${className}`}
    >
      <div className="p-4">
        <div className="flex items-start justify-between">
          {/* Lesson Info */}
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                isCompleted 
                  ? 'bg-success text-white' 
                  : isLocked 
                    ? 'bg-gray-300 text-gray-500'
                    : 'bg-primary text-white'
              }`}>
                {isCompleted ? (
                  <ApperIcon name="Check" className="w-4 h-4" />
                ) : isLocked ? (
                  <ApperIcon name="Lock" className="w-4 h-4" />
                ) : (
                  <span className="text-sm font-medium">{lesson.order}</span>
                )}
              </div>
              
              <div>
                <h3 className={`font-semibold ${
                  isLocked ? 'text-gray-500' : 'text-gray-900'
                }`}>
                  {lesson.title}
                </h3>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <ApperIcon name="Clock" className="w-4 h-4 mr-1" />
                  {formatDuration(lesson.duration)}
                  {lesson.steps && (
                    <>
                      <span className="mx-2">•</span>
                      <ApperIcon name="List" className="w-4 h-4 mr-1" />
                      {lesson.steps.length} steps
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {/* Description */}
            <p className={`text-sm mb-3 ${
              isLocked ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {lesson.description}
            </p>
            
            {/* Assignments indicator */}
            {lesson.assignments && lesson.assignments.length > 0 && (
              <div className="flex items-center text-sm text-accent mb-3">
                <ApperIcon name="FileText" className="w-4 h-4 mr-1" />
                {lesson.assignments.length} assignment{lesson.assignments.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
          
          {/* Action Area */}
          <div className="ml-4 flex flex-col items-end">
            {isCompleted && (
              <div className="flex items-center text-success text-sm mb-2">
                <ApperIcon name="CheckCircle" className="w-4 h-4 mr-1" />
                Completed
              </div>
            )}
            
            <Button
              variant={isCompleted ? "outline" : "primary"}
              size="sm"
              disabled={isLocked}
              onClick={handleStartLesson}
            >
              {isLocked ? (
                'Locked'
              ) : isCompleted ? (
                'Review'
              ) : (
                'Start Lesson'
              )}
            </Button>
          </div>
        </div>
        
        {/* Progress Steps */}
        {lesson.steps && lesson.steps.length > 0 && !isLocked && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Lesson Steps</span>
              <span>{lesson.steps.length} steps</span>
            </div>
            <div className="flex mt-2 space-x-1">
              {lesson.steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 flex-1 rounded-full ${
                    isCompleted ? 'bg-success' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default LessonCard;