import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { userService, courseService } from '@/services';
import SkeletonLoader from '@/components/atoms/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import EmptyState from '@/components/molecules/EmptyState';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { format } from 'date-fns';

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    loadCertificates();
  }, []);
  
  const loadCertificates = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [userResult, coursesResult] = await Promise.all([
        userService.getCurrentUser(),
        courseService.getAll()
      ]);
      
      setCertificates(userResult.certificates || []);
      setCourses(coursesResult);
    } catch (err) {
      setError(err.message || 'Failed to load certificates');
      toast.error('Failed to load certificates');
    } finally {
      setLoading(false);
    }
  };
  
  const getCourseById = (courseId) => {
    return courses.find(course => course.Id === courseId);
  };
  
  const handleDownload = (certificate) => {
    // In a real app, this would download the actual certificate file
    toast.success(`Certificate for "${certificate.courseName}" downloaded!`);
  };
  
  const handleShare = (certificate) => {
    // In a real app, this would open share options
    if (navigator.share) {
      navigator.share({
        title: `Certificate - ${certificate.courseName}`,
        text: `I completed ${certificate.courseName} on SkillHatch!`,
        url: window.location.href
      });
    } else {
      // Fallback for browsers without native sharing
      navigator.clipboard.writeText(
        `I completed ${certificate.courseName} on SkillHatch! 🎓`
      );
      toast.success('Certificate achievement copied to clipboard!');
    }
  };
  
  if (loading) {
    return (
      <div className="space-y-8">
        <SkeletonLoader count={1} height="h-20" variant="card" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SkeletonLoader count={4} height="h-64" variant="card" />
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <ErrorState
        message="Error Loading Certificates"
        description={error}
        onRetry={loadCertificates}
      />
    );
  }
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Certificates</h1>
        <p className="text-gray-600">
          View and download your earned certificates
        </p>
      </motion.div>
      
      {/* Certificates Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-card border border-warm-200 p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {certificates.length}
            </div>
            <div className="text-sm text-gray-600">Total Certificates</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-card border border-warm-200 p-6 text-center">
            <div className="text-3xl font-bold text-secondary mb-2">
              {new Set(certificates.map(cert => {
                const course = getCourseById(cert.courseId);
                return course?.category;
              }).filter(Boolean)).size}
            </div>
            <div className="text-sm text-gray-600">Skill Categories</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-card border border-warm-200 p-6 text-center">
            <div className="text-3xl font-bold text-accent mb-2">
              {certificates.length > 0 ? 
                format(new Date(Math.max(...certificates.map(cert => new Date(cert.issuedDate)))), 'MMM yyyy') 
                : '---'
              }
            </div>
            <div className="text-sm text-gray-600">Latest Achievement</div>
          </div>
        </div>
      </motion.div>
      
      {/* Certificates Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {certificates.length === 0 ? (
          <EmptyState
            title="No certificates earned yet"
            description="Complete courses to earn certificates and showcase your achievements"
            icon="Award"
            actionLabel="Browse Courses"
            onAction={() => window.location.href = '/browse-courses'}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certificates.map((certificate, index) => {
              const course = getCourseById(certificate.courseId);
              
              return (
                <motion.div
                  key={certificate.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="bg-white rounded-xl shadow-card border border-warm-200 overflow-hidden"
                >
                  {/* Certificate Header */}
                  <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <ApperIcon name="Award" className="w-8 h-8 mb-3" />
                        <h3 className="text-lg font-semibold">Certificate of Completion</h3>
                      </div>
                      <div className="text-right">
                        <div className="text-xs opacity-80">SkillHatch</div>
                        <div className="text-sm font-medium">
                          {format(new Date(certificate.issuedDate), 'MMM d, yyyy')}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Certificate Content */}
                  <div className="p-6">
                    <div className="text-center mb-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-2">
                        {certificate.courseName}
                      </h2>
                      
                      {course && (
                        <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <ApperIcon 
                              name={course.category === 'farming' ? 'Sprout' : 
                                    course.category === 'health' ? 'Heart' : 
                                    course.category === 'finance' ? 'DollarSign' : 'BookOpen'} 
                              className="w-4 h-4 mr-1" 
                            />
                            <span className="capitalize">{course.category}</span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center">
                            <ApperIcon name="Clock" className="w-4 h-4 mr-1" />
                            <span>{course.estimatedHours}h course</span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Certificate ID */}
                    <div className="text-center mb-6">
                      <div className="text-xs text-gray-500 mb-1">Certificate ID</div>
                      <div className="text-sm font-mono bg-gray-100 px-3 py-1 rounded inline-block">
                        SH-{certificate.id.toString().padStart(6, '0')}
                      </div>
                    </div>
                    
                    {/* Skills Earned */}
                    {course?.skills && (
                      <div className="mb-6">
                        <div className="text-sm font-medium text-gray-700 mb-2">Skills Mastered:</div>
                        <div className="flex flex-wrap gap-1">
                          {course.skills.map((skill, skillIndex) => (
                            <span
                              key={skillIndex}
                              className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Actions */}
                    <div className="flex space-x-3">
                      <Button
                        variant="primary"
                        size="sm"
                        className="flex-1"
                        icon="Download"
                        onClick={() => handleDownload(certificate)}
                      >
                        Download
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        icon="Share"
                        onClick={() => handleShare(certificate)}
                      >
                        Share
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Certificates;