import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { courseService, progressService } from '@/services';
import SkeletonLoader from '@/components/atoms/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import EmptyState from '@/components/molecules/EmptyState';
import CourseGrid from '@/components/organisms/CourseGrid';
import ProgressRing from '@/components/atoms/ProgressRing';
import ApperIcon from '@/components/ApperIcon';

const MySkills = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [userProgress, setUserProgress] = useState(null);
  const [activeTab, setActiveTab] = useState('in-progress');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    loadMySkills();
  }, []);
  
  const loadMySkills = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [coursesResult, progressResult] = await Promise.all([
        courseService.getAll(),
        progressService.getUserProgress(1)
      ]);
      
      // Filter courses user is enrolled in
      const enrolledCourseIds = progressResult.courses.map(c => c.courseId);
      const enrolled = coursesResult.filter(course => 
        enrolledCourseIds.includes(course.Id)
      );
      
      setEnrolledCourses(enrolled);
      setUserProgress(progressResult);
    } catch (err) {
      setError(err.message || 'Failed to load your skills');
      toast.error('Failed to load your skills');
    } finally {
      setLoading(false);
    }
  };
  
  const getProgressData = () => {
    if (!userProgress) return {};
    
    const progressMap = {};
    userProgress.courses.forEach(course => {
      progressMap[course.courseId] = course;
    });
    return progressMap;
  };
  
  const getFilteredCourses = () => {
    const progressData = getProgressData();
    
    switch (activeTab) {
      case 'in-progress':
        return enrolledCourses.filter(course => {
          const progress = progressData[course.Id];
          return progress && progress.progress > 0 && progress.progress < 100;
        });
      case 'completed':
        return enrolledCourses.filter(course => {
          const progress = progressData[course.Id];
          return progress && progress.progress === 100;
        });
      case 'not-started':
        return enrolledCourses.filter(course => {
          const progress = progressData[course.Id];
          return !progress || progress.progress === 0;
        });
      default:
        return enrolledCourses;
    }
  };
  
  const getSkillLevels = () => {
    if (!userProgress?.skillLevels) return [];
    
    return Object.entries(userProgress.skillLevels).map(([skill, data]) => ({
      name: skill,
      ...data
    }));
  };
  
  const tabs = [
    { id: 'in-progress', label: 'In Progress', icon: 'Play' },
    { id: 'completed', label: 'Completed', icon: 'CheckCircle' },
    { id: 'not-started', label: 'Not Started', icon: 'Clock' },
    { id: 'all', label: 'All Courses', icon: 'BookOpen' }
  ];
  
  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SkeletonLoader count={3} height="h-32" variant="card" />
        </div>
        <SkeletonLoader count={1} height="h-12" variant="card" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonLoader count={6} height="h-64" variant="card" />
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <ErrorState
        message="Error Loading Skills"
        description={error}
        onRetry={loadMySkills}
      />
    );
  }
  
  const filteredCourses = getFilteredCourses();
  const skillLevels = getSkillLevels();
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Skills</h1>
        <p className="text-gray-600">
          Track your progress and continue your learning journey
        </p>
      </motion.div>
      
      {/* Skill Levels Overview */}
      {skillLevels.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Skill Levels</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {skillLevels.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="bg-white rounded-xl shadow-card border border-warm-200 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 capitalize">
                    {skill.name}
                  </h3>
                  <ProgressRing size={50} progress={skill.progress} />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Level</span>
                    <span className="text-sm font-medium text-primary">
                      {skill.level}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Completed Skills</span>
                    <span className="text-sm font-medium">
                      {skill.completedSkills?.length || 0}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Skills</span>
                    <span className="text-sm font-medium">
                      {skill.totalSkills}
                    </span>
                  </div>
                </div>
                
                {skill.inProgressSkills && skill.inProgressSkills.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-600 mb-2">Currently Learning:</div>
                    <div className="flex flex-wrap gap-1">
                      {skill.inProgressSkills.map((skillName, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                        >
                          {skillName}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
      
      {/* Course Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-elevation'
                  : 'bg-white text-gray-600 hover:bg-warm-100 border border-warm-200'
              }`}
            >
              <ApperIcon name={tab.icon} className="w-4 h-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </motion.div>
      
      {/* Courses Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {filteredCourses.length === 0 ? (
          <EmptyState
            title={`No ${activeTab.replace('-', ' ')} courses`}
            description={
              activeTab === 'in-progress' 
                ? "Start a new course to begin your learning journey"
                : activeTab === 'completed'
                ? "Complete some courses to see them here"
                : "Enroll in courses to start learning"
            }
            icon="BookOpen"
            actionLabel="Browse Courses"
            onAction={() => window.location.href = '/browse-courses'}
          />
        ) : (
          <CourseGrid
            courses={filteredCourses}
            showProgress={true}
            progressData={getProgressData()}
          />
        )}
      </motion.div>
    </div>
  );
};

export default MySkills;