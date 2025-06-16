import Dashboard from '@/components/pages/Dashboard';
import MySkills from '@/components/pages/MySkills';
import BrowseCourses from '@/components/pages/BrowseCourses';
import Progress from '@/components/pages/Progress';
import Certificates from '@/components/pages/Certificates';
import CourseView from '@/components/pages/CourseView';
import LessonView from '@/components/pages/LessonView';

export const routes = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'Home',
    component: Dashboard,
    showInNav: true
  },
  mySkills: {
    id: 'mySkills',
    label: 'My Skills',
    path: '/my-skills',
    icon: 'BookOpen',
    component: MySkills,
    showInNav: true
  },
  browseCourses: {
    id: 'browseCourses',
    label: 'Browse Courses',
    path: '/browse-courses',
    icon: 'Search',
    component: BrowseCourses,
    showInNav: true
  },
  progress: {
    id: 'progress',
    label: 'Progress',
    path: '/progress',
    icon: 'TrendingUp',
    component: Progress,
    showInNav: true
  },
  certificates: {
    id: 'certificates',
    label: 'Certificates',
    path: '/certificates',
    icon: 'Award',
    component: Certificates,
    showInNav: true
  },
  courseView: {
    id: 'courseView',
    label: 'Course',
    path: '/course/:courseId',
    icon: 'Play',
    component: CourseView,
    showInNav: false
  },
  lessonView: {
    id: 'lessonView',
    label: 'Lesson',
    path: '/lesson/:lessonId',
    icon: 'PlayCircle',
    component: LessonView,
    showInNav: false
  }
};

export const routeArray = Object.values(routes);
export const navRoutes = routeArray.filter(route => route.showInNav);
export default routes;