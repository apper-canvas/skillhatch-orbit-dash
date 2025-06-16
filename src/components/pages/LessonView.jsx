import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { lessonService, assignmentService, progressService } from '@/services';
import SkeletonLoader from '@/components/atoms/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import VideoPlayer from '@/components/atoms/VideoPlayer';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const LessonView = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videoProgress, setVideoProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [submissionText, setSubmissionText] = useState('');
  const [submissionFiles, setSubmissionFiles] = useState([]);
  const [submittingAssignment, setSubmittingAssignment] = useState(false);
  
  useEffect(() => {
    if (lessonId) {
      loadLessonData();
    }
  }, [lessonId]);
  
  const loadLessonData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const lessonIdInt = parseInt(lessonId, 10);
      const [lessonResult, assignmentsResult] = await Promise.all([
        lessonService.getById(lessonIdInt),
        assignmentService.getByLessonId(lessonIdInt)
      ]);
      
      setLesson(lessonResult);
      setAssignments(assignmentsResult);
      setIsCompleted(lessonResult.completed || false);
    } catch (err) {
      setError(err.message || 'Failed to load lesson');
      toast.error('Failed to load lesson');
    } finally {
      setLoading(false);
    }
  };
  
  const handleVideoProgress = (currentTime, duration) => {
    const progress = (currentTime / duration) * 100;
    setVideoProgress(progress);
  };
  
  const handleVideoComplete = () => {
    setVideoProgress(100);
    if (!isCompleted) {
      markLessonComplete();
    }
  };
  
  const markLessonComplete = async () => {
    try {
      const lessonIdInt = parseInt(lessonId, 10);
      await lessonService.markAsComplete(lessonIdInt);
      await progressService.updateCourseProgress(1, lesson.courseId, lessonIdInt);
      setIsCompleted(true);
      toast.success('Lesson completed!');
    } catch (err) {
      toast.error('Failed to mark lesson as complete');
    }
  };
  
  const handleNextStep = () => {
    if (currentStep < lesson.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleCompleteLesson = () => {
    if (!isCompleted) {
      markLessonComplete();
    } else {
      // Navigate back to course or next lesson
      navigate(`/course/${lesson.courseId}`);
    }
  };
  
  const handleSubmitAssignment = async (assignmentId) => {
    if (!submissionText.trim()) {
      toast.error('Please provide a response');
      return;
    }
    
    setSubmittingAssignment(true);
    
    try {
      const submission = {
        content: submissionText,
        files: submissionFiles
      };
      
      await assignmentService.submitAssignment(assignmentId, submission);
      toast.success('Assignment submitted successfully!');
      setSubmissionText('');
      setSubmissionFiles([]);
      
      // Reload assignments to show submission
      const assignmentsResult = await assignmentService.getByLessonId(parseInt(lessonId, 10));
      setAssignments(assignmentsResult);
    } catch (err) {
      toast.error('Failed to submit assignment');
    } finally {
      setSubmittingAssignment(false);
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
        <SkeletonLoader count={1} height="h-20" variant="card" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <SkeletonLoader count={1} height="h-64" variant="card" />
            <SkeletonLoader count={3} height="h-32" variant="card" />
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
        message="Error Loading Lesson"
        description={error}
        onRetry={loadLessonData}
      />
    );
  }
  
  if (!lesson) {
    return (
      <ErrorState
        message="Lesson Not Found"
        description="The lesson you're looking for doesn't exist or has been removed."
      />
    );
  }
  
  const currentStepData = lesson.steps?.[currentStep];
  
  return (
    <div className="space-y-8">
      {/* Lesson Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/course/${lesson.courseId}`)}
              icon="ArrowLeft"
            >
              Back to Course
            </Button>
            {isCompleted && (
              <div className="flex items-center ml-4 text-success">
                <ApperIcon name="CheckCircle" className="w-5 h-5 mr-1" />
                <span className="text-sm font-medium">Completed</span>
              </div>
            )}
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {lesson.title}
          </h1>
          
          <div className="flex items-center text-gray-600">
            <ApperIcon name="Clock" className="w-4 h-4 mr-1" />
            <span className="text-sm mr-4">{formatDuration(lesson.duration)}</span>
            {lesson.steps && (
              <>
                <ApperIcon name="List" className="w-4 h-4 mr-1" />
                <span className="text-sm">{lesson.steps.length} steps</span>
              </>
            )}
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-sm text-gray-600 mb-1">Progress</div>
          <div className="text-2xl font-bold text-primary">
            {Math.round(videoProgress)}%
          </div>
        </div>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Video Player */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <VideoPlayer
              src={lesson.videoUrl}
              title={lesson.title}
              onProgress={handleVideoProgress}
              onComplete={handleVideoComplete}
              className="aspect-video"
            />
          </motion.div>
          
          {/* Lesson Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-card border border-warm-200 p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">About This Lesson</h2>
            <p className="text-gray-600">{lesson.description}</p>
          </motion.div>
          
          {/* Step-by-Step Guide */}
          {lesson.steps && lesson.steps.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-card border border-warm-200 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Step-by-Step Guide</h2>
                <div className="text-sm text-gray-600">
                  Step {currentStep + 1} of {lesson.steps.length}
                </div>
              </div>
              
              {/* Step Progress */}
              <div className="flex mb-6">
                {lesson.steps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 flex-1 rounded-full mr-1 last:mr-0 transition-colors ${
                      index <= currentStep ? 'bg-primary' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              
              {/* Current Step */}
              <AnimatePresence mode="wait">
                {currentStepData && (
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      {currentStepData.title}
                    </h3>
                    
                    {currentStepData.image && (
                      <div className="mb-4 bg-gray-100 rounded-lg h-48 flex items-center justify-center">
                        <ApperIcon name="Image" className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    
                    <p className="text-gray-600 mb-6">
                      {currentStepData.content}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Step Navigation */}
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={handlePreviousStep}
                  disabled={currentStep === 0}
                  icon="ChevronLeft"
                >
                  Previous
                </Button>
                
                <Button
                  variant="primary"
                  onClick={handleNextStep}
                  disabled={currentStep === lesson.steps.length - 1}
                  iconPosition="right"
                  icon="ChevronRight"
                >
                  Next
                </Button>
              </div>
            </motion.div>
          )}
          
          {/* Assignments */}
          {assignments.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-card border border-warm-200 p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Assignment</h2>
              
              {assignments.map((assignment) => (
                <div key={assignment.Id} className="mb-6 last:mb-0">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-2">
                        {assignment.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        {assignment.instructions}
                      </p>
                      
                      <div className="flex items-center text-sm text-gray-500">
                        <ApperIcon name="Award" className="w-4 h-4 mr-1" />
                        <span>{assignment.points} points</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Check if already submitted */}
                  {assignment.submissions && assignment.submissions.length > 0 ? (
                    <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                      <div className="flex items-center text-success mb-2">
                        <ApperIcon name="CheckCircle" className="w-5 h-5 mr-2" />
                        <span className="font-medium">Assignment Submitted</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Your submission has been received and is being reviewed.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Your Response
                        </label>
                        <textarea
                          value={submissionText}
                          onChange={(e) => setSubmissionText(e.target.value)}
                          placeholder="Write your response here..."
                          rows={4}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                      </div>
                      
                      <Button
                        variant="primary"
                        onClick={() => handleSubmitAssignment(assignment.Id)}
                        loading={submittingAssignment}
                        disabled={!submissionText.trim()}
                        icon="Send"
                      >
                        Submit Assignment
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </motion.div>
          )}
        </div>
        
        {/* Sidebar */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-card border border-warm-200 p-6 sticky top-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Lesson Progress</h3>
            
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">
                  {Math.round(videoProgress)}%
                </div>
                <div className="text-sm text-gray-600">Video Progress</div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${videoProgress}%` }}
                  className="bg-primary h-2 rounded-full"
                />
              </div>
              
              {lesson.steps && (
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Steps Completed</span>
                    <span>{currentStep + 1} / {lesson.steps.length}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentStep + 1) / lesson.steps.length) * 100}%` }}
                      className="bg-secondary h-2 rounded-full"
                    />
                  </div>
                </div>
              )}
              
              <div className="pt-4 border-t border-gray-100">
                <Button
                  variant={isCompleted ? "outline" : "primary"}
                  className="w-full"
                  onClick={handleCompleteLesson}
                  icon={isCompleted ? "ArrowRight" : "CheckCircle"}
                >
                  {isCompleted ? "Back to Course" : "Mark as Complete"}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LessonView;