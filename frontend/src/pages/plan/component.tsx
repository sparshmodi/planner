import DeleteIcon from '@mui/icons-material/Delete'
import { Button, Container, IconButton, List, ListItem, ListItemText, Typography } from '@mui/material'
import { Box } from '@mui/material'
import axios from 'axios'
import { DateTime } from 'luxon'
import { GetServerSideProps } from 'next'
import React, { useState } from 'react'
import ScrollableHorizontalView from '@/components/calendar'
import SearchBar from '@/components/searchbar'
import { noResults, FRONTEND_SCHEDULE_EP, daysOfWeek, addCourseToPlan, removeCourseFromPlan, findTermSchedules } from '@/constants'
import { createApolloClient } from '@/graphql/apolloClient'
import { GET_COURSE, GET_UNDERGRADUATE_COURSES } from '@/graphql/queries/courseQueries'
import { GET_TERM_SCHEDULES } from '@/graphql/queries/termScheduleQuery'
import { Course, Schedule } from '@/types'
import { useCoursesContext } from './context'

interface PlanPageProps {
	selectedCourse?: Course
	availableCourses: Course[]
}

interface CourseScheduleDateProps {
	scheduleStartDate?: string
	scheduleEndDate?: string
	weekPattern?: string
}

const CourseScheduleDate: React.FC<CourseScheduleDateProps> = ({scheduleStartDate, scheduleEndDate, weekPattern}) => {
	const startDate = scheduleStartDate && DateTime.fromFormat(scheduleStartDate, 'yyyy-MM-dd').toFormat('LLL d')
	const endDate = scheduleEndDate && DateTime.fromFormat(scheduleEndDate, 'yyyy-MM-dd').toFormat('LLL d')
	const date = (startDate === endDate) ? startDate : startDate + ' - ' + endDate

	return (
		<>
			{weekPattern && daysOfWeek.map((day, index) => (
				<span key={index} className={weekPattern[index] === 'Y' ? 'font-bold' : 'text-gray-400'}>{day}</span>
			))}
			<span>{startDate ? ' (' + date + ')': ''}</span>
		</>
	) 
}

const CourseContainer: React.FC<{course: Course}> = ({course}) => {
	const listItemClassName = 'flex bg-white/80 rounded-sm border border-gray-400'
	const listItemTextClassName = 'flex-1'
	const listItemPrimaryTypographyProps = {fontWeight: 'bold'}

	const classes = course.classes

	const { addedCourses, setAddedCourses } = useCoursesContext()
	const hasSelectedCourse = addedCourses.some(c => c.courseId === course.courseId)
	const isButtonDisabled = !hasSelectedCourse && addedCourses.length >= 6

	return (
		<>
			<Box className='flex justify-between'> 
				<Typography variant='h3'>{course.subjectCode} {course.catalogNumber}</Typography>
				<Button 
					variant='contained'
					color={hasSelectedCourse ? 'error' : 'primary'}
					sx={{ // fix this later
						...(!isButtonDisabled && {
							backgroundColor: `${hasSelectedCourse ? '#D32F2F' : '#0A66C2'} !important`,
						})
					}}
					disabled={isButtonDisabled}
					onClick={() => {
						if (hasSelectedCourse) {
							setAddedCourses(addedCourses.filter(c => c.courseId !== course.courseId))
						} else {
							setAddedCourses([...addedCourses, {
								courseId: course.courseId,
								subjectCode: course.subjectCode,
								catalogNumber: course.catalogNumber
							}])
						}
					}}
				>
					<Typography>
						{hasSelectedCourse ? removeCourseFromPlan : addCourseToPlan}
					</Typography>
				</Button>
			</Box>
			
			<Typography variant='h5' className='pt-2 pb-6'>{course.title}</Typography>
			<Typography variant='body1'>{course.description}</Typography>
			{classes && 
			<Container>
				<Typography variant='h5' className='pt-8 pb-2'>Course Schedule</Typography>
				<List>
					<ListItem className={listItemClassName}>
						<ListItemText primary="Section" className={listItemTextClassName} primaryTypographyProps={listItemPrimaryTypographyProps}/>
						<ListItemText primary="Time" className={listItemTextClassName} primaryTypographyProps={listItemPrimaryTypographyProps}/>
						<ListItemText primary="Date" className={listItemTextClassName} primaryTypographyProps={listItemPrimaryTypographyProps}/>
					</ListItem>
					{classes
						.sort((a, b) => a.classSection - b.classSection)
						.map((courseClass, index) => {
							const section = courseClass.courseComponent + ' ' + courseClass.classSection

							const startTime = courseClass.scheduleData?.at(0)?.classMeetingStartTime
							const parsedStartTime = startTime && DateTime.fromFormat(startTime, 'HH:mm:ss').toFormat('h:mm a')

							const endTime = courseClass.scheduleData?.at(0)?.classMeetingEndTime
							const parsedEndTime = endTime && DateTime.fromFormat(endTime, 'HH:mm:ss').toFormat('h:mm a')

							const startDate = courseClass.scheduleData?.at(0)?.scheduleStartDate
							const endDate = courseClass.scheduleData?.at(0)?.scheduleEndDate
							const weekPattern = courseClass.scheduleData?.at(0)?.classMeetingWeekPatternCode

							return (<ListItem key={index} className={listItemClassName}>
								<ListItemText primary={section} className={listItemTextClassName} />
								<ListItemText primary={parsedStartTime && parsedEndTime ? parsedStartTime + ' - ' + parsedEndTime : ''} className={listItemTextClassName} />
								<ListItemText primary={<CourseScheduleDate scheduleStartDate={startDate} scheduleEndDate={endDate} weekPattern={weekPattern!}/>} className={listItemTextClassName} />
							</ListItem>)
						})}
				</List>
			</Container>}
		</>
	)
}

const PlanPage: React.FC<PlanPageProps> = ({selectedCourse, availableCourses }) => {
	const { addedCourses, setAddedCourses } = useCoursesContext()
	const [schedules, setSchedules] = useState<Schedule[]>([])
	const [ errorMessage, setErrorMessage] = useState('')

	const handleSubmit = async () => {
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
				className='bg-white/50 rounded-lg p-8 my-8 ml-8 mr-4 shadow-md flex flex-col'
				sx={{height: '80%', width: '25%'}}
			>
				<SearchBar courses={availableCourses}/>
				<Container className='mt-8 pl-0'>
					<Typography variant="h5" >Added Courses</Typography>
					<List>
						{addedCourses
							.sort((a, b) => a.subjectCode.localeCompare(b.subjectCode) || a.catalogNumber.localeCompare(b.catalogNumber))
							.map(course => (
								<ListItem 
									key={course.courseId}
									className='py-1'
									secondaryAction={
										<IconButton 
											edge='end' 
											size='small'
											onClick={() => {
												setAddedCourses(addedCourses.filter(c => c.courseId !== course.courseId))
											}}
										>
											<DeleteIcon />
										</IconButton>
									}
								>
									<ListItemText primary={`${course.subjectCode} ${course.catalogNumber}`} />
								</ListItem>
							))}
					</List>
				</Container>
				<Container className='mt-8 pl-0'>
					<Typography variant="h5" >Filters</Typography>
					<Typography variant="body2" className='pl-4 pt-1'>Coming soon...</Typography>
				</Container>
				{errorMessage &&
                    <Typography 
                    	variant="h6" 
                    	className="text-red-500 text-center"
                    >
                    	{errorMessage}
                    </Typography>
				}
				<Button 
					disabled={addedCourses.length === 0}  
					variant='contained'
					color='primary'
					className='mt-10'
					sx={{
						backgroundColor: '#0A66C2 !important',     
						opacity: 0.8,
					}}
					onClick={handleSubmit}
				>
					{findTermSchedules}
				</Button>
			</Box>
			<Box 
				className='bg-white/50 rounded-lg p-8 my-8 ml-4 mr-8 shadow-md overflow-y-scroll'
				sx={{ height: '80%', width: '75%'}}
			>
				{selectedCourse && 
					<CourseContainer course={selectedCourse} />
				}
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
