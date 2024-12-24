import { gql } from '@apollo/client'

export const GET_TERM_SCHEDULES = gql`
  query GetTermSchedules($courseIds: [String!]!) {
    termSchedules(courseIds: $courseIds) {
      courseId
      classes
    }
    courses(courseIds: $courseIds) {
      courseId
      subjectCode
      catalogNumber
      classes {
        classSection
        courseComponent
        scheduleData {
          scheduleStartDate
          scheduleEndDate
          classMeetingStartTime
          classMeetingEndTime
          classMeetingWeekPatternCode
        }
      }
    }
  }
`
