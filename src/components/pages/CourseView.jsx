import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { courseService, lessonService, progressService } from '@/services';
import SkeletonLoader from '@/components/atoms/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import LessonCard from '@/components/molecules/LessonCard';
import ProgressRing from '@/components/atoms/ProgressRing';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const CourseView = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (courseId) {
      loadCourseData();
    }
  }, [courseId]);
  
  const loadCourseData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const courseIdInt = parseInt(courseId, 10);
      const [courseResult, lessonsResult, progressResult] = await Promise.all([
        courseService.getById(courseIdInt),
        lessonService.getByCourseId(courseIdInt),
        progressService.getCourseProgress(1, courseIdInt) // Current user ID
      ]);
      
      setCourse(courseResult);
      setLessons(lessonsResult.sort((a, b) => a.order - b.order));
      setProgress(progressResult);
    } catch (err) {
      setError(err.message || 'Failed to load course');
      toast.error('Failed to load course');
    } finally {
      setLoading(false);
    }
  };
  
  const handleStartCourse = () => {
    if (lessons.length > 0) {
      const firstLesson = lessons[0];
      navigate(`/lesson/${firstLesson.Id}`);
    }
  };
  
  const handleContinueCourse = () => {
    if (!progress || !lessons.length) return;
    
    // Find the next incomplete lesson
    const nextLesson = lessons.find(lesson => 
      !progress.completedLessons.includes(lesson.Id)
    );
    
    if (nextLesson) {
      navigate(`/lesson/${nextLesson.Id}`);
    } else {
      // All lessons completed, go to first lesson for review
      navigate(`/lesson/${lessons[0].Id}`);
    }
  };
  
  const isLessonLocked = (lesson) => {
    if (!lesson.order || lesson.order === 1) return false;
    if (!progress) return true;
    
    // Check if previous lesson is completed
    const previousLesson = lessons.find(l => l.order === lesson.order - 1);
    return previousLesson && !progress.completedLessons.includes(previousLesson.Id);
  };
  
  const isLessonCompleted = (lesson) => {
    return progress?.completedLessons.includes(lesson.Id) || false;
  };
  
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner': return 'text-success bg-success/10';
      case 'intermediate': return 'text-warning bg-warning/10';
      case 'advanced': return 'text-error bg-error/10';
      default: return 'text-gray-600 bg-gray-100';
    }
  };
  
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };
  
  if (loading) {
    return (
      <div className="space-y-8">
        <SkeletonLoader count={1} height="h-64" variant="card" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <SkeletonLoader count={4} height="h-32" variant="card" />
          </div>
          <div>
            <SkeletonLoader count={1} height="h-48" variant="card" />
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <ErrorState
        message="Error Loading Course"
        description={error}
        onRetry={loadCourseData}
      />
    );
  }
  
  if (!course) {
    return (
      <ErrorState
        message="Course Not Found"
        description="The course you're looking for doesn't exist or has been removed."
      />
    );
  }
  
  return (
    <div className="space-y-8">
      {/* Course Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-card border border-warm-200 overflow-hidden"
      >
        {/* Course Banner */}
        <div className="relative h-64 bg-gradient-to-r from-primary/10 to-secondary/10 flex items-center justify-center">
          <ApperIcon 
            name={course.category === 'farming' ? 'Sprout' : 
                  course.category === 'health' ? 'Heart' : 
                  course.category === 'finance' ? 'DollarSign' : 'BookOpen'} 
            className="w-24 h-24 text-primary/40" 
          />
          
          {progress && (
            <div className="absolute top-6 right-6">
              <ProgressRing size={80} progress={progress.progress} />
            </div>
          )}
        </div>
        
        {/* Course Info */}
        <div className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center mb-3">
                <span className="text-sm font-medium text-primary capitalize mr-4">
                  {course.category}
                </span>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${getDifficultyColor(course.difficulty)}`}>
                  {course.difficulty}
                </span>
                {course.featured && (
                  <span className="bg-accent text-white text-xs font-medium px-2 py-1 rounded-full ml-2">
                    Featured
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {course.title}
              </h1>
              
              <p className="text-gray-600 text-lg mb-6">
                {course.description}
              </p>
              
              {/* Course Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {course.totalLessons}
                  </div>
                  <div className="text-sm text-gray-600">Lessons</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary mb-1">
                    {formatDuration(course.duration)}
                  </div>
                  <div className="text-sm text-gray-600">Duration</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent mb-1">
                    {course.estimatedHours}h
                  </div>
                  <div className="text-sm text-gray-600">Estimated</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-700 mb-1">
                    {progress?.completedLessons.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Instructor */}
          {course.instructor && (
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                <ApperIcon name="User" className="w-6 h-6 text-gray-500" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Instructor</div>
                <div className="font-medium text-gray-900">{course.instructor}</div>
              </div>
            </div>
          )}
          
          {/* Skills */}
          {course.skills && course.skills.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Skills You'll Learn</h3>
              <div className="flex flex-wrap gap-2">
                {course.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Action Button */}
          <div className="flex space-x-4">
            {progress && progress.progress > 0 ? (
              <Button
                variant="primary"
                size="lg"
                onClick={handleContinueCourse}
                icon="Play"
              >
                Continue Course
              </Button>
            ) : (
              <Button
                variant="primary"
                size="lg"
                onClick={handleStartCourse}
                icon="PlayCircle"
              >
                Start Course
              </Button>
            )}
            
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/my-skills')}
              icon="ArrowLeft"
            >
              Back to My Skills
            </Button>
          </div>
        </div>
      </motion.div>
      
      {/* Course Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lessons List */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Lessons</h2>
            
            <div className="space-y-4">
              {lessons.map((lesson, index) => (
                <motion.div
                  key={lesson.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <LessonCard
                    lesson={lesson}
                    courseId={course.Id}
                    isCompleted={isLessonCompleted(lesson)}
                    isLocked={isLessonLocked(lesson)}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
        
        {/* Progress Sidebar */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-card border border-warm-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Progress</h3>
            
            {progress ? (
              <div className="space-y-4">
                <div className="text-center">
                  <ProgressRing size={100} progress={progress.progress} />
                  <div className="mt-3">
                    <div className="text-2xl font-bold text-gray-900">
                      {progress.progress}%
                    </div>
                    <div className="text-sm text-gray-600">Complete</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Lessons Completed</span>
                    <span className="text-sm font-medium">
                      {progress.completedLessons.length} / {course.totalLessons}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Time Spent</span>
                    <span className="text-sm font-medium">
                      {progress.hoursSpent}h
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Status</span>
                    <span className={`text-sm font-medium capitalize ${
                      progress.status === 'completed' ? 'text-success' : 'text-primary'
                    }`}>
                      {progress.status.replace('-', ' ')}
                    </span>
                  </div>
                </div>
                
                {progress.status === 'completed' && (
                  <div className="mt-4 p-3 bg-success/10 rounded-lg">
                    <div className="flex items-center text-success">
                      <ApperIcon name="Award" className="w-5 h-5 mr-2" />
                      <span className="text-sm font-medium">Course Completed!</span>
                    </div>
                    <div className="text-xs text-success/80 mt-1">
                      Certificate available in your achievements
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500">
                <ApperIcon name="BookOpen" className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">Start the course to track your progress</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CourseView;