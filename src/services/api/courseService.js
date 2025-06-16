import courseData from '../mockData/courses.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class CourseService {
  constructor() {
    this.courses = [...courseData];
  }

  async getAll() {
    await delay(300);
    return [...this.courses];
  }

  async getById(Id) {
    await delay(200);
    const course = this.courses.find(course => course.Id === parseInt(Id, 10));
    if (!course) {
      throw new Error('Course not found');
    }
    return { ...course };
  }

  async getByCategory(category) {
    await delay(250);
    return this.courses.filter(course => 
      course.category.toLowerCase() === category.toLowerCase()
    ).map(course => ({ ...course }));
  }

  async getFeatured() {
    await delay(200);
    return this.courses.filter(course => course.featured)
      .map(course => ({ ...course }));
  }

  async search(query) {
    await delay(300);
    const searchTerm = query.toLowerCase();
    return this.courses.filter(course =>
      course.title.toLowerCase().includes(searchTerm) ||
      course.description.toLowerCase().includes(searchTerm) ||
      course.category.toLowerCase().includes(searchTerm)
    ).map(course => ({ ...course }));
  }
}

export default new CourseService();