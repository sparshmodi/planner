import { Box, Container, Typography } from '@mui/material'
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
			className="h-full absolute flex flex-row justify-center items-center px-8 md:px-0"
			sx={{
				backgroundImage: "url('/mountain.webp')",
				backgroundSize: 'cover',
				backgroundPosition: 'center',
				backgroundRepeat: 'no-repeat',
			}}
		>
			<Box
				className='bg-white/50 rounded-lg p-8 my-8 ml-8 mr-4 shadow-md'
				sx={{height: '80%', width: '25%'}}
			>
			
			</Box>
			<Box 
				className='bg-white/50 rounded-lg p-8 my-8 ml-4 mr-8 shadow-md'
				sx={{ height: '80%', width: '75%'}}
			>
				<Typography variant='h3'>{course.subjectCode} {course.catalogNumber}</Typography>
				<Typography variant='h5' className='pb-6'>{course.title}</Typography>
				<Typography variant='body1'>{course.description}</Typography>
			</Box>
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