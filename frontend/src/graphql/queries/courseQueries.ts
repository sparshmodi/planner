import { gql } from '@apollo/client'

export const GET_UNDERGRADUATE_COURSES = gql`
  query GetUndergraduateCourses {
    courses(associatedAcademicCareer: "UG") {
      courseId
      subjectCode
      catalogNumber
      title
    }
  }
`