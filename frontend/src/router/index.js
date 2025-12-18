import { createRouter, createWebHistory } from 'vue-router'
import LoginScreen from '../views/LoginScreen.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginScreen
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/HomeScreen.vue')
  },
  {
    path: '/timesheet',
    name: 'Timesheet',
    component: () => import('../views/TimesheetScreen.vue')
  },
  {
    path: '/effort',
    name: 'Effort',
    component: () => import('../views/EffortScreen.vue')
  },
  {
    path: '/report',
    name: 'Report',
    component: () => import('../views/ReportScreen.vue')
  },
  {
    path: '/monthly-summary',
    name: 'MonthlySummary',
    component: () => import('../views/MonthlySummaryScreen.vue')
  }
  // {
  //   path: '/attendance',
  //   name: 'AttendanceSheet',
  //   component: () => import('../views/AttendanceSheet.vue')
  // }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router


