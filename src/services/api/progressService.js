import progressData from '../mockData/progress.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ProgressService {
  constructor() {
    this.progress = [...progressData];
  }

  async getUserProgress(userId) {
    await delay(300);
    const userProgress = this.progress.find(p => p.userId === parseInt(userId, 10));
    if (!userProgress) {
      throw new Error('Progress not found');
    }
    return { ...userProgress };
  }

  async updateCourseProgress(userId, courseId, lessonId) {
    await delay(250);
    const progressIndex = this.progress.findIndex(p => p.userId === parseInt(userId, 10));
    if (progressIndex === -1) {
      throw new Error('Progress not found');
    }
    
    const progress = { ...this.progress[progressIndex] };
    const courseProgress = progress.courses.find(c => c.courseId === parseInt(courseId, 10));
    
    if (courseProgress) {
      if (!courseProgress.completedLessons.includes(parseInt(lessonId, 10))) {
        courseProgress.completedLessons.push(parseInt(lessonId, 10));
        courseProgress.progress = Math.round((courseProgress.completedLessons.length / courseProgress.totalLessons) * 100);
      }
    }
    
    // Recalculate overall progress
    const totalProgress = progress.courses.reduce((sum, course) => sum + course.progress, 0);
    progress.overallProgress = Math.round(totalProgress / progress.courses.length);
    
    this.progress[progressIndex] = progress;
    return { ...progress };
  }

  async getCourseProgress(userId, courseId) {
    await delay(200);
    const userProgress = this.progress.find(p => p.userId === parseInt(userId, 10));
    if (!userProgress) {
      throw new Error('Progress not found');
    }
    
    const courseProgress = userProgress.courses.find(c => c.courseId === parseInt(courseId, 10));
    return courseProgress ? { ...courseProgress } : null;
  }
}

export default new ProgressService();