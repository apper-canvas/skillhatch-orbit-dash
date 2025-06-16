import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import ProgressRing from '@/components/atoms/ProgressRing';

const StatsOverview = ({ stats, className = '' }) => {
  const statItems = [
    {
      label: 'Overall Progress',
      value: `${stats.overallProgress}%`,
      icon: 'TrendingUp',
      color: 'primary',
      showRing: true,
      ringProgress: stats.overallProgress
    },
    {
      label: 'Courses Completed',
      value: `${stats.coursesCompleted}/${stats.totalCourses}`,
      icon: 'BookOpen',
      color: 'success'
    },
    {
      label: 'Hours Learned',
      value: stats.totalHoursLearned,
      icon: 'Clock',
      color: 'secondary'
    },
    {
      label: 'Current Streak',
      value: `${stats.currentStreak} days`,
      icon: 'Flame',
      color: 'accent'
    }
  ];
  
  const getColorClasses = (color) => {
    const colorMap = {
      primary: { bg: 'bg-primary', text: 'text-primary', light: 'bg-primary/10' },
      success: { bg: 'bg-success', text: 'text-success', light: 'bg-success/10' },
      secondary: { bg: 'bg-secondary', text: 'text-secondary', light: 'bg-secondary/10' },
      accent: { bg: 'bg-accent', text: 'text-accent', light: 'bg-accent/10' }
    };
    return colorMap[color] || colorMap.primary;
  };
  
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {statItems.map((stat, index) => {
        const colors = getColorClasses(stat.color);
        
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-card border border-warm-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center mr-3`}>
                    <ApperIcon name={stat.icon} className="w-5 h-5 text-white" />
                  </div>
                  {stat.showRing && (
                    <ProgressRing 
                      size={40} 
                      progress={stat.ringProgress} 
                      color={stat.color}
                    />
                  )}
                </div>
                
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                
                <div className="text-sm text-gray-600">
                  {stat.label}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default StatsOverview;