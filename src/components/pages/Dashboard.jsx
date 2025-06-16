import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { courseService, progressService } from '@/services';
import SkeletonLoader from '@/components/atoms/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import EmptyState from '@/components/molecules/EmptyState';
import SkillCategoryCard from '@/components/molecules/SkillCategoryCard';
import CourseGrid from '@/components/organisms/CourseGrid';
import StatsOverview from '@/components/organisms/StatsOverview';
import ApperIcon from '@/components/ApperIcon';

const Dashboard = () => {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [userProgress, setUserProgress] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState(['farming', 'health', 'finance']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const skillCategories = [
    { name: 'farming', coursesCount: 2, level: 'Intermediate', progress: 65 },
    { name: 'health', coursesCount: 2, level: 'Beginner', progress: 25 },
    { name: 'finance', coursesCount: 1, level: 'Advanced', progress: 85 },
    { name: 'technology', coursesCount: 0, level: 'Beginner', progress: 0 },
    { name: 'business', coursesCount: 0, level: 'Beginner', progress: 0 },
    { name: 'crafts', coursesCount: 0, level: 'Beginner', progress: 0 }
  ];
  
  useEffect(() => {
    loadDashboardData();
  }, []);
  
  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [coursesResult, progressResult] = await Promise.all([
        courseService.getFeatured(),
        progressService.getUserProgress(1) // Current user ID
      ]);
      
      setFeaturedCourses(coursesResult);
      setUserProgress(progressResult);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(cat => cat !== category);
      } else {
        return [...prev, category];
      }
    });
  };
  
  const getProgressData = () => {
    if (!userProgress) return {};
    
    const progressMap = {};
    userProgress.courses.forEach(course => {
      progressMap[course.courseId] = course;
    });
    return progressMap;
  };
  
  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SkeletonLoader count={4} height="h-32" variant="card" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <SkeletonLoader count={6} height="h-48" variant="card" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonLoader count={3} height="h-64" variant="card" />
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <ErrorState
        message="Dashboard Error"
        description={error}
        onRetry={loadDashboardData}
      />
    );
  }
  
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="bg-gradient-to-r from-primary to-secondary rounded-xl text-white p-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-bold mb-2">Welcome to SkillHatch!</h1>
            <p className="text-primary-100 text-lg">
              Continue your learning journey and develop practical skills for life and work.
            </p>
            <div className="flex items-center mt-4 text-sm">
              <ApperIcon name="Calendar" className="w-4 h-4 mr-2" />
              <span>Last active: Today</span>
              <span className="mx-3">•</span>
              <ApperIcon name="Flame" className="w-4 h-4 mr-2" />
              <span>{userProgress?.currentStreak || 0} day learning streak</span>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Stats Overview */}
      {userProgress && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatsOverview stats={userProgress} />
        </motion.div>
      )}
      
      {/* Skill Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Choose Your Skills</h2>
          <div className="text-sm text-gray-600">
            Select categories to personalize your learning
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <SkillCategoryCard
                category={category.name}
                progress={category.progress}
                level={category.level}
                coursesCount={category.coursesCount}
                isSelected={selectedCategories.includes(category.name)}
                onClick={() => handleCategoryToggle(category.name)}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
      
      {/* Featured Courses */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Featured Courses</h2>
          <button className="text-primary hover:text-primary/80 font-medium text-sm flex items-center">
            View All Courses
            <ApperIcon name="ArrowRight" className="w-4 h-4 ml-1" />
          </button>
        </div>
        
        {featuredCourses.length === 0 ? (
          <EmptyState
            title="No featured courses available"
            description="Check back later for new featured courses"
            icon="BookOpen"
          />
        ) : (
          <CourseGrid
            courses={featuredCourses}
            showProgress={true}
            progressData={getProgressData()}
          />
        )}
      </motion.div>
      
      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="bg-warm-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: 'Search', label: 'Browse Courses', description: 'Discover new skills' },
              { icon: 'TrendingUp', label: 'View Progress', description: 'Track your learning' },
              { icon: 'Award', label: 'My Certificates', description: 'Download achievements' },
              { icon: 'BookOpen', label: 'Continue Learning', description: 'Resume your courses' }
            ].map((action, index) => (
              <motion.div
                key={action.label}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-lg p-4 shadow-card border border-warm-200 cursor-pointer"
              >
                <div className="flex items-center mb-2">
                  <ApperIcon name={action.icon} className="w-5 h-5 text-primary mr-2" />
                  <span className="font-medium text-gray-900">{action.label}</span>
                </div>
                <p className="text-sm text-gray-600">{action.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;