import assignmentData from '../mockData/assignments.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class AssignmentService {
  constructor() {
    this.assignments = [...assignmentData];
    this.nextId = Math.max(...this.assignments.map(a => a.Id)) + 1;
  }

  async getAll() {
    await delay(300);
    return [...this.assignments];
  }

  async getById(Id) {
    await delay(200);
    const assignment = this.assignments.find(assignment => assignment.Id === parseInt(Id, 10));
    if (!assignment) {
      throw new Error('Assignment not found');
    }
    return { ...assignment };
  }

  async getByLessonId(lessonId) {
    await delay(250);
    return this.assignments.filter(assignment => 
      assignment.lessonId === parseInt(lessonId, 10)
    ).map(assignment => ({ ...assignment }));
  }

  async submitAssignment(Id, submission) {
    await delay(400);
    const assignmentIndex = this.assignments.findIndex(assignment => assignment.Id === parseInt(Id, 10));
    if (assignmentIndex === -1) {
      throw new Error('Assignment not found');
    }
    
    const newSubmission = {
      id: this.nextId++,
      submittedAt: new Date().toISOString(),
      content: submission.content || '',
      files: submission.files || [],
      status: 'submitted'
    };
    
    const updatedSubmissions = [...this.assignments[assignmentIndex].submissions, newSubmission];
    
    this.assignments[assignmentIndex] = {
      ...this.assignments[assignmentIndex],
      submissions: updatedSubmissions
    };
    
    return { ...this.assignments[assignmentIndex] };
  }
}

export default new AssignmentService();