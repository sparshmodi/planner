const TERM_CODE = '1239'

export const loadingStatus = 'loading'
export const authenticatedStatus = 'authenticated'

export const UW_SCHEDULES_ENDPOINT = `https://openapi.data.uwaterloo.ca/v3/ClassSchedules/${TERM_CODE}/`
export const PLAN_ENDPOINT = '/api/plan'

export const availableCoursesMap: { [key: string]: string } = {
    'CS 240': '004377',
    'CS 241': '004378',
    'CS 251': '004382',
    'CS 341': '004392',
    'CS 346': '016287',
    'CS 350': '11416',
    'CS 370': '004400' 
}

export const availableCourses: string[] = Object.keys(availableCoursesMap)
