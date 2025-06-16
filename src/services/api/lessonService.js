import lessonData from '../mockData/lessons.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class LessonService {
  constructor() {
    this.lessons = [...lessonData];
  }

  async getAll() {
    await delay(300);
    return [...this.lessons];
  }

  async getById(Id) {
    await delay(200);
    const lesson = this.lessons.find(lesson => lesson.Id === parseInt(Id, 10));
    if (!lesson) {
      throw new Error('Lesson not found');
    }
    return { ...lesson };
  }

  async getByCourseId(courseId) {
    await delay(250);
    return this.lessons.filter(lesson => 
      lesson.courseId === parseInt(courseId, 10)
    ).map(lesson => ({ ...lesson }));
  }

  async markAsComplete(Id) {
    await delay(200);
    const lessonIndex = this.lessons.findIndex(lesson => lesson.Id === parseInt(Id, 10));
    if (lessonIndex === -1) {
      throw new Error('Lesson not found');
    }
    
    this.lessons[lessonIndex] = {
      ...this.lessons[lessonIndex],
      completed: true,
      completedAt: new Date().toISOString()
    };
    
    return { ...this.lessons[lessonIndex] };
  }
}

export default new LessonService();