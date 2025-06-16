import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { progressService, courseService } from '@/services';
import SkeletonLoader from '@/components/atoms/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import EmptyState from '@/components/molecules/EmptyState';
import StatsOverview from '@/components/organisms/StatsOverview';
import ProgressRing from '@/components/atoms/ProgressRing';
import ApperIcon from '@/components/ApperIcon';
import { format } from 'date-fns';

const Progress = () => {
  const [userProgress, setUserProgress] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('all');
  
  useEffect(() => {
    loadProgressData();
  }, []);
  
  const loadProgressData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [progressResult, coursesResult] = await Promise.all([
        progressService.getUserProgress(1),
        courseService.getAll()
      ]);
      
      setUserProgress(progressResult);
      setCourses(coursesResult);
    } catch (err) {
      setError(err.message || 'Failed to load progress data');
      toast.error('Failed to load progress data');
    } finally {
      setLoading(false);
    }
  };
  
  const getCourseById = (courseId) => {
    return courses.find(course => course.Id === courseId);
  };
  
  const getProgressCourses = () => {
    if (!userProgress?.courses) return [];
    
    return userProgress.courses.map(progressCourse => {
      const course = getCourseById(progressCourse.courseId);
      return {
        ...progressCourse,
        courseDetails: course
      };
    }).filter(item => item.courseDetails);
  };
  
  const getAchievements = () => {
    const achievements = [];
    
    if (userProgress?.coursesCompleted > 0) {
      achievements.push({
        id: 'first-completion',
        title: 'Course Completed',
        description: `Completed ${userProgress.coursesCompleted} course${userProgress.coursesCompleted > 1 ? 's' : ''}`,
        icon: 'Award',
        color: 'success',
        date: '2024-02-20'
      });
    }
    
    if (userProgress?.currentStreak >= 7) {
      achievements.push({
        id: 'streak-week',
        title: 'Weekly Streak',
        description: `${userProgress.currentStreak} day learning streak`,
        icon: 'Flame',
        color: 'accent',
        date: new Date().toISOString().split('T')[0]
      });
    }
    
    if (userProgress?.totalHoursLearned >= 40) {
      achievements.push({
        id: 'hours-milestone',
        title: 'Learning Milestone',
        description: `${userProgress.totalHoursLearned} hours of learning`,
        icon: 'Clock',
        color: 'primary',
        date: '2024-01-25'
      });
    }
    
    return achievements;
  };
  
  const timeRanges = [
    { id: 'all', label: 'All Time' },
    { id: 'month', label: 'This Month' },
    { id: 'week', label: 'This Week' }
  ];
  
  if (loading) {
    return (
      <div className="space-y-8">
        <SkeletonLoader count={1} height="h-20" variant="card" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SkeletonLoader count={4} height="h-32" variant="card" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SkeletonLoader count={2} height="h-64" variant="card" />
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <ErrorState
        message="Error Loading Progress"
        description={error}
        onRetry={loadProgressData}
      />
    );
  }
  
  if (!userProgress) {
    return (
      <EmptyState
        title="No progress data found"
        description="Start taking courses to track your progress"
        icon="TrendingUp"
        actionLabel="Browse Courses"
        onAction={() => window.location.href = '/browse-courses'}
      />
    );
  }
  
  const progressCourses = getProgressCourses();
  const achievements = getAchievements();
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Progress</h1>
            <p className="text-gray-600">
              Track your learning journey and celebrate achievements
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            {timeRanges.map((range) => (
              <button
                key={range.id}
                onClick={() => setSelectedTimeRange(range.id)}
                className={`px-3 py-1 rounded-lg text-sm transition-all duration-200 ${
                  selectedTimeRange === range.id
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-600 hover:bg-warm-100 border border-warm-200'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
      
      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <StatsOverview stats={userProgress} />
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Course Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-white rounded-xl shadow-card border border-warm-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Course Progress</h2>
            
            {progressCourses.length === 0 ? (
              <EmptyState
                title="No courses started"
                description="Enroll in courses to track your progress"
                icon="BookOpen"
              />
            ) : (
              <div className="space-y-4">
                {progressCourses.map((progressCourse, index) => (
                  <motion.div
                    key={progressCourse.courseId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-warm-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">
                        {progressCourse.courseDetails.title}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <span className="capitalize mr-3">
                          {progressCourse.courseDetails.category}
                        </span>
                        <span className="text-primary">
                          {progressCourse.completedLessons.length} of {progressCourse.totalLessons} lessons
                        </span>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progressCourse.progress}%` }}
                          transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                          className="bg-primary h-2 rounded-full"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{progressCourse.hoursSpent}h spent</span>
                        <span>
                          {progressCourse.lastAccessed && 
                            `Last: ${format(new Date(progressCourse.lastAccessed), 'MMM d')}`
                          }
                        </span>
                      </div>
                    </div>
                    
                    <div className="ml-4">
                      <ProgressRing 
                        size={50} 
                        progress={progressCourse.progress}
                        showText={true}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
        
        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-white rounded-xl shadow-card border border-warm-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Achievements</h2>
            
            {achievements.length === 0 ? (
              <EmptyState
                title="No achievements yet"
                description="Complete courses and maintain streaks to earn achievements"
                icon="Trophy"
              />
            ) : (
              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-center p-4 bg-warm-50 rounded-lg"
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${
                      achievement.color === 'success' ? 'bg-success' :
                      achievement.color === 'accent' ? 'bg-accent' :
                      achievement.color === 'primary' ? 'bg-primary' : 'bg-gray-500'
                    }`}>
                      <ApperIcon name={achievement.icon} className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">
                        {achievement.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-1">
                        {achievement.description}
                      </p>
                      <span className="text-xs text-gray-500">
                        {format(new Date(achievement.date), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
      
      {/* Learning Streaks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="bg-white rounded-xl shadow-card border border-warm-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Learning Activity</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {userProgress.currentStreak}
              </div>
              <div className="text-sm text-gray-600 mb-1">Current Streak</div>
              <div className="flex items-center justify-center text-xs text-gray-500">
                <ApperIcon name="Flame" className="w-4 h-4 mr-1" />
                Days in a row
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary mb-2">
                {userProgress.longestStreak}
              </div>
              <div className="text-sm text-gray-600 mb-1">Longest Streak</div>
              <div className="flex items-center justify-center text-xs text-gray-500">
                <ApperIcon name="Trophy" className="w-4 h-4 mr-1" />
                Personal best
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Progress;