export interface Course {
    courseId: string
    subjectCode: string
    catalogNumber: string
    title: string
    description: string | null
    classes?: UwaterlooSection[]
}

export interface LocalStorageCourse {
    courseId: string
    subjectCode: string
    catalogNumber: string
}

export interface UwaterlooClassSchedule {
    classSection: number
    scheduleStartDate: string // $date-time
    scheduleEndDate: string
    classMeetingStartTime: string
    classMeetingEndTime: string
    classMeetingDayPatternCode: string | null
    classMeetingWeekPatternCode: string | null 
}

export interface UwaterlooSection {
    courseId: string
    classSection: number
    courseComponent: string
    scheduleData: UwaterlooClassSchedule[] | null
}

export type Schedule = {[courseId: string]: UwaterlooSection[]}
