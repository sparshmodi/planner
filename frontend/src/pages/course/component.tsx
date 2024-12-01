import { Container } from '@mui/material'
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
		<Container
			disableGutters
			maxWidth={false}
			className="h-full absolute flex flex-col justify-center items-center pb-20 px-8 md:px-0"
			sx={{
				backgroundImage: "url('/mountain.webp')",
				backgroundSize: 'cover',
				backgroundPosition: 'center',
				backgroundRepeat: 'no-repeat',
			}}
		>
			<h1>{course.subjectCode} {course.catalogNumber} - {course.title}</h1>
			<p>{course.description}</p>
		</Container>
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