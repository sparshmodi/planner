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

export const GET_COURSE = gql`
  query GetCourse($subjectCode: String!, $catalogNumber: String!) {
    course(subjectCode: $subjectCode, catalogNumber: $catalogNumber) {
      courseId
      subjectCode
      catalogNumber
      title
      description
    }
  }
`
