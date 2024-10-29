import { GetServerSideProps } from 'next'
import React from 'react'
import { createApolloClient } from '@/graphql/apolloClient'
import { GET_COURSE } from '@/graphql/queries/courseQueries'
import { Course } from '@/types'

interface CoursePageProps {
    course: Course
}

const CoursePage: React.FC<CoursePageProps> = ({ course }) => {
	return (
		<div>
			<h1>Course Page</h1>
			<p>{course.title}</p>
			<p>{course.description}</p>
		</div>
	)
}

export const getServerSideProps: GetServerSideProps<CoursePageProps> = async (context) => {
	const { slug } = context.query as { slug: string }
	const client = createApolloClient()

	try {
		const courseQuery = slug.match(/(.*?)(\d.*)/)?.slice(1) 

		if (!courseQuery) {
			return { notFound: true }
		}

		const { data } = await client.query({
			query: GET_COURSE,
			variables: { 
				subjectCode: courseQuery[0],
				catalogNumber: courseQuery[1]
			}
		}) 

		if (!data.course) {
			return { notFound: true }
		}
		return { props: { course: data.course}}
	} catch (e: any) {
		return { notFound: true }
	}
}

export default CoursePage