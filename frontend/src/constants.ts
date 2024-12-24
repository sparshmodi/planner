// next-auth
export enum AuthenticationStatus {
    Loading = 'loading',
    Authenticated = 'authenticated',
}

// URLs and EPs
// (FrontEnd)
export const HOME_URL = '/'
export const PROFILE_URL = '/profile'
export const PLAN_URL = '/plan'
export const NOT_FOUND_URL = '/404'

// (BackEnd)
export const DJANGO_BACKEND_URL = 'http://backend:8000'
export const GRAPHQL_EP = '/graphql'

// Strings
export const profile = 'Profile'
export const tagline = 'Plan your term'
export const signInText = 'Sign in To Save'
export const signOutText = 'Sign out'
export const noResults = 'Sorry! Could not find any schedules for given courses. Try searching for different courses.' // not used
export const findTermSchedules = 'Find term schedules'
export const notFoundTitle = '404 - Page Not Found'
export const notFoundDescription = "Oops! The page you're looking for doesn't exist."
export const goBackToHome = 'Go back to Home'
export const daysOfWeek = ['M', 'T', 'W', 'Th', 'F', 'S', 'Su']
export const addCourseToPlan = 'Add course to plan'
export const removeCourseFromPlan = 'Remove course from plan'
export const uwPlan = 'UW Plan'
export const previousSchedule = 'Previous Schedule'
export const nextSchedule = 'Next Schedule'
export const schedule = 'Schedule'
export const searchForCourses = 'Search for courses'
export const noOptions = 'No options'
export const filters = 'Filters'
export const comingSoon = 'Coming soon...'
export const name = 'Name'
export const email = 'Email'