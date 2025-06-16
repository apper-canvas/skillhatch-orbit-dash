import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import ProgressRing from '@/components/atoms/ProgressRing';

const SkillCategoryCard = ({ 
  category,
  progress = 0,
  level = 'Beginner',
  coursesCount = 0,
  isSelected = false,
  onClick,
  className = ''
}) => {
  const getCategoryIcon = (categoryName) => {
    switch (categoryName?.toLowerCase()) {
      case 'farming': return 'Sprout';
      case 'health': return 'Heart';
      case 'finance': return 'DollarSign';
      case 'technology': return 'Smartphone';
      case 'business': return 'Briefcase';
      case 'crafts': return 'Palette';
      default: return 'BookOpen';
    }
  };
  
  const getCategoryColor = (categoryName) => {
    switch (categoryName?.toLowerCase()) {
      case 'farming': return { bg: 'bg-primary', text: 'text-primary', light: 'bg-primary/10' };
      case 'health': return { bg: 'bg-error', text: 'text-error', light: 'bg-error/10' };
      case 'finance': return { bg: 'bg-warning', text: 'text-warning', light: 'bg-warning/10' };
      case 'technology': return { bg: 'bg-info', text: 'text-info', light: 'bg-info/10' };
      case 'business': return { bg: 'bg-secondary', text: 'text-secondary', light: 'bg-secondary/10' };
      case 'crafts': return { bg: 'bg-accent', text: 'text-accent', light: 'bg-accent/10' };
      default: return { bg: 'bg-gray-600', text: 'text-gray-600', light: 'bg-gray-100' };
    }
  };
  
  const colors = getCategoryColor(category);
  
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        relative bg-white rounded-xl shadow-card border-2 transition-all duration-200 cursor-pointer overflow-hidden
        ${isSelected 
          ? `border-primary shadow-float ${colors.light}` 
          : 'border-warm-200 hover:border-primary hover:shadow-elevation'
        }
        ${className}
      `}
    >
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-3 right-3 z-10">
          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
            <ApperIcon name="Check" className="w-4 h-4 text-white" />
          </div>
        </div>
      )}
      
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className={`w-full h-full ${colors.light}`} />
      </div>
      
      <div className="relative p-6">
        {/* Icon and Progress */}
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center`}>
            <ApperIcon name={getCategoryIcon(category)} className="w-6 h-6 text-white" />
          </div>
          
          {progress > 0 && (
            <ProgressRing 
              size={40} 
              progress={progress} 
              color={category?.toLowerCase() === 'farming' ? 'primary' : 'secondary'} 
            />
          )}
        </div>
        
        {/* Category Name */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 capitalize">
          {category}
        </h3>
        
        {/* Level and Courses */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Current Level</span>
            <span className={`text-sm font-medium ${colors.text}`}>
              {level}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Available Courses</span>
            <span className="text-sm font-medium text-gray-900">
              {coursesCount}
            </span>
          </div>
        </div>
        
        {/* Progress Bar */}
        {progress > 0 && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, delay: 0.3 }}
                className={`h-2 rounded-full ${colors.bg}`}
              />
            </div>
          </div>
        )}
        
        {/* Call to Action */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {progress > 0 ? 'Continue Learning' : 'Start Learning'}
            </span>
            <ApperIcon 
              name="ArrowRight" 
              className={`w-4 h-4 ${colors.text} transition-transform group-hover:translate-x-1`} 
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SkillCategoryCard;