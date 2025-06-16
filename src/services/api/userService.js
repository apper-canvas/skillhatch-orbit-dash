import userData from '../mockData/users.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class UserService {
  constructor() {
    this.users = [...userData];
  }

  async getAll() {
    await delay(300);
    return [...this.users];
  }

  async getById(Id) {
    await delay(200);
    const user = this.users.find(user => user.Id === parseInt(Id, 10));
    if (!user) {
      throw new Error('User not found');
    }
    return { ...user };
  }

  async getCurrentUser() {
    await delay(250);
    // Return first user as current user for demo
    return { ...this.users[0] };
  }

  async updateSkillCategories(userId, categories) {
    await delay(300);
    const userIndex = this.users.findIndex(user => user.Id === parseInt(userId, 10));
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    this.users[userIndex] = {
      ...this.users[userIndex],
      skillCategories: [...categories]
    };
    
    return { ...this.users[userIndex] };
  }

  async updateProgress(userId, lessonId) {
    await delay(250);
    const userIndex = this.users.findIndex(user => user.Id === parseInt(userId, 10));
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    const completedLessons = [...this.users[userIndex].completedLessons];
    if (!completedLessons.includes(lessonId)) {
      completedLessons.push(lessonId);
    }
    
    this.users[userIndex] = {
      ...this.users[userIndex],
      completedLessons
    };
    
    return { ...this.users[userIndex] };
  }
}

export default new UserService();