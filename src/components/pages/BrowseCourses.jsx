import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { courseService } from '@/services';
import SkeletonLoader from '@/components/atoms/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import EmptyState from '@/components/molecules/EmptyState';
import CourseGrid from '@/components/organisms/CourseGrid';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const BrowseCourses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const categories = [
    { id: 'all', label: 'All Categories', icon: 'Grid3X3' },
    { id: 'farming', label: 'Farming', icon: 'Sprout' },
    { id: 'health', label: 'Health', icon: 'Heart' },
    { id: 'finance', label: 'Finance', icon: 'DollarSign' }
  ];
  
  const difficulties = [
    { id: 'all', label: 'All Levels' },
    { id: 'Beginner', label: 'Beginner' },
    { id: 'Intermediate', label: 'Intermediate' },
    { id: 'Advanced', label: 'Advanced' }
  ];
  
  useEffect(() => {
    loadCourses();
  }, []);
  
  useEffect(() => {
    filterCourses();
  }, [courses, selectedCategory, selectedDifficulty, searchQuery]);
  
  const loadCourses = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await courseService.getAll();
      setCourses(result);
    } catch (err) {
      setError(err.message || 'Failed to load courses');
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };
  
  const filterCourses = () => {
    let filtered = [...courses];
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(course => 
        course.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    
    // Filter by difficulty
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(course => 
        course.difficulty === selectedDifficulty
      );
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query) ||
        course.category.toLowerCase().includes(query) ||
        course.instructor?.toLowerCase().includes(query)
      );
    }
    
    setFilteredCourses(filtered);
  };
  
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedDifficulty('all');
    setSearchQuery('');
  };
  
  if (loading) {
    return (
      <div className="space-y-8">
        <SkeletonLoader count={1} height="h-20" variant="card" />
        <div className="flex gap-4">
          <SkeletonLoader count={4} height="h-10" width="w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonLoader count={6} height="h-64" variant="card" />
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <ErrorState
        message="Error Loading Courses"
        description={error}
        onRetry={loadCourses}
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Courses</h1>
        <p className="text-gray-600">
          Discover practical skills and start your learning journey
        </p>
      </motion.div>
      
      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative"
      >
        <div className="relative">
          <ApperIcon 
            name="Search" 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" 
          />
          <input
            type="text"
            placeholder="Search courses, topics, or instructors..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-12 pr-4 py-3 border border-warm-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
          />
        </div>
      </motion.div>
      
      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        {/* Category Filters */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-primary text-white shadow-elevation'
                    : 'bg-white text-gray-600 hover:bg-warm-100 border border-warm-200'
                }`}
              >
                <ApperIcon name={category.icon} className="w-4 h-4" />
                <span className="text-sm font-medium">{category.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Difficulty Filters */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Difficulty Level</h3>
          <div className="flex flex-wrap gap-2">
            {difficulties.map((difficulty) => (
              <button
                key={difficulty.id}
                onClick={() => setSelectedDifficulty(difficulty.id)}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  selectedDifficulty === difficulty.id
                    ? 'bg-secondary text-white shadow-elevation'
                    : 'bg-white text-gray-600 hover:bg-warm-100 border border-warm-200'
                }`}
              >
                <span className="text-sm font-medium">{difficulty.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Active Filters & Clear */}
        {(selectedCategory !== 'all' || selectedDifficulty !== 'all' || searchQuery) && (
          <div className="flex items-center justify-between bg-warm-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <ApperIcon name="Filter" className="w-4 h-4" />
              <span>
                Showing {filteredCourses.length} of {courses.length} courses
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              icon="X"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </motion.div>
      
      {/* Courses Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {filteredCourses.length === 0 ? (
          <EmptyState
            title="No courses found"
            description={
              searchQuery 
                ? `No courses match "${searchQuery}". Try adjusting your search or filters.`
                : "No courses match your current filters. Try adjusting your selection."
            }
            icon="Search"
            actionLabel="Clear Filters"
            onAction={clearFilters}
          />
        ) : (
          <CourseGrid courses={filteredCourses} />
        )}
      </motion.div>
    </div>
  );
};

export default BrowseCourses;