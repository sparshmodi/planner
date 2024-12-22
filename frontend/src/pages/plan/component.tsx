import { Button, Container, Typography } from '@mui/material'
import { Box } from '@mui/material'
import axios from 'axios'
import { GetServerSideProps } from 'next'
import React, { useState } from 'react'
import AutoComplete from '@/components/autocomplete'
import ScrollableHorizontalView from '@/components/calendar'
import SearchBar from '@/components/searchbar'
import { find, selectCourses, noResults, numberOfCourses, DJANGO_BACKEND_URL, FRONTEND_SCHEDULE_EP, BACKEND_COURSE_LIST_EP } from '@/constants'
import { createApolloClient } from '@/graphql/apolloClient'
import { GET_COURSE, GET_UNDERGRADUATE_COURSES } from '@/graphql/queries/courseQueries'
import { Course, Schedule } from '@/types'
import { snakeToCamel } from '@/utils'
import { useCoursesContext } from './context'

interface PlanPageProps {
	selectedCourse?: Course
	availableCourses: Course[]
}

const CourseContainer: React.FC<{course: Course}> = ({course}) => {
	return (
		<>
			<Typography variant='h3'>{course.subjectCode} {course.catalogNumber}</Typography>
			<Typography variant='h5' className='pb-6'>{course.title}</Typography>
			<Typography variant='body1'>{course.description}</Typography>
		</>
	)
}

const PlanPage: React.FC<PlanPageProps> = ({selectedCourse, availableCourses }) => {
	console.log('selectedCourse', selectedCourse)
	const { selectedCourses } = useCoursesContext()
	const [schedules, setSchedules] = useState<Schedule[]>([])
	const [ errorMessage, setErrorMessage] = useState('')

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		const courseQuery = selectedCourses.map(course => course.courseId).join(',')
		try {
			const response = await axios.get(FRONTEND_SCHEDULE_EP, {
				withCredentials: true,
		        params: {
					courses: courseQuery
				}
			})
			const result = await response.data
            
			if (result.length === 0) {
				handleError(noResults)
				return
			}

			setSchedules(result)
		} catch (e: any) {
			console.error(e)
			handleError(e.message)
		}
	}

	const handleError = (error: string) => {
		setErrorMessage(error)
		setTimeout(() => {
			setErrorMessage('')
		}, 5000)
	}

	// return (
	// 	<Container className="flex items-center justify-center w-full mt-32 gap-4">
	// 		<Container className="flex w-1/3 flex-col items-center gap-4">
	// 			<Typography variant="h5" className="mb-4 text-center" >{selectCourses}</Typography>
	// 			<form onSubmit={handleSubmit} className="flex flex-col space-y-4 items-center">
	// 				{Array
	// 					.from({ length: numberOfCourses })
	// 					.map((_, index) => (
	// 						<AutoComplete key={index} availableCourses={coursesData} />
	// 					))
	// 				}
	// 				<Button 
	// 					disabled={selectedCourses.length === 0} 
	// 					type='submit' 
	// 					variant="outlined"
	// 				>
	// 					{find}
	// 				</Button>
	// 			</form>
	// 			{errorMessage &&
	//                 <Typography 
	//                 	variant="h6" 
	//                 	className="text-red-500 text-center"
	//                 >
	//                 	{errorMessage}
	//                 </Typography>
	// 			}
	// 		</Container>
	// 		{schedules.length > 0 && 
	//             <Container >
	//             	<ScrollableHorizontalView 
	//             		schedules={schedules} 
	//             		availableCourses={coursesData}/>
	//             </Container>
	// 		}
	// 	</Container>
	// )

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
				{/* <Typography variant="h5" className="mb-4 text-center" >{selectCourses}</Typography> */}
				<SearchBar courses={availableCourses}/>
				{/* <form onSubmit={handleSubmit} className="flex flex-col space-y-4 items-center">
					{Array
						.from({ length: numberOfCourses })
						.map((_, index) => (
							<AutoComplete key={index} availableCourses={availableCourses} />
						))
					}
					<Button 
						disabled={selectedCourses.length === 0} 
						type='submit' 
						variant="outlined"
					>
						{find}
					</Button>
				</form> */}
				{errorMessage &&
                    <Typography 
                    	variant="h6" 
                    	className="text-red-500 text-center"
                    >
                    	{errorMessage}
                    </Typography>
				}
			</Box>
			<Box 
				className='bg-white/50 rounded-lg p-8 my-8 ml-4 mr-8 shadow-md'
				sx={{ height: '80%', width: '75%'}}
			>
				{selectedCourse && <CourseContainer course={selectedCourse} />}
			</Box>
		</Container>
	)
}

export const getServerSideProps: GetServerSideProps<PlanPageProps> = async (context) => {
	const { slug } = context.query as { slug: string }
	const client = createApolloClient()

	const availableCoursesPromise = client.query({
		query: GET_UNDERGRADUATE_COURSES
	})

	try {
		if (slug === 'schedule') {
			const { data } = await availableCoursesPromise

			const sortedResults: Course[] = [...data.courses].sort((a, b) =>
				a.subjectCode.localeCompare(b.subjectCode) ||
				a.catalogNumber.localeCompare(b.catalogNumber)
			)
			return { props: { availableCourses: sortedResults }}
		}
		const course = slug.match(/(.*?)(\d.*)/)?.slice(1) 

		if (!course) {
			return { notFound: true }
		}

		const [ courseResponse, availableCoursesResponse ] = await Promise.all([
			client.query({
				query: GET_COURSE,
				variables: { 
					subjectCode: course[0],
					catalogNumber: course[1]
				}
			}),
			availableCoursesPromise
		])

		if (!courseResponse.data.course) {
			return { notFound: true }
		}

		const sortedResults: Course[] = [...availableCoursesResponse.data.courses].sort((a, b) =>
			a.subjectCode.localeCompare(b.subjectCode) ||
            a.catalogNumber.localeCompare(b.catalogNumber)
		)

		return { props: { selectedCourse: courseResponse.data.course, availableCourses: sortedResults}}
	} catch (e) {
		return { notFound: true }
	}
}

export default PlanPage
