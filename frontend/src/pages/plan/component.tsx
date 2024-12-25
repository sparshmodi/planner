import DeleteIcon from '@mui/icons-material/Delete'
import { Button, Container, IconButton, List, ListItem, ListItemText, Typography } from '@mui/material'
import { Box } from '@mui/material'
import { DateTime } from 'luxon'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import React from 'react'
import ScrollableHorizontalView from '@/components/calendar'
import SearchBar from '@/components/searchbar'
import { daysOfWeek, addCourseToPlan, removeCourseFromPlan, findTermSchedules, filters, comingSoon, PLAN_URL } from '@/constants'
import { createApolloClient } from '@/graphql/apolloClient'
import { GET_COURSE, GET_UNDERGRADUATE_COURSES } from '@/graphql/queries/courseQueries'
import { GET_TERM_SCHEDULES } from '@/graphql/queries/termScheduleQuery'
import { CookieCourse, Course, TermScheduleData, UwaterlooClassSchedule } from '@/types'
import { getCourseName } from '@/utils'
import { useCoursesContext } from './context'

interface PlanPageProps {
	availableCourses: Course[]
	selectedCourse?: Course
	termSchedules?: TermScheduleData
}

const CourseScheduleTime: React.FC<{scheduleData: UwaterlooClassSchedule[] | null}> = ({ scheduleData }) => {
	const formatTime = (time?: string) =>
	  time ? DateTime.fromFormat(time, 'HH:mm:ss').toFormat('h:mm a') : ''
  
	return (
	  <>
			{scheduleData?.map((schedule, idx) => {
				const { classMeetingStartTime, classMeetingEndTime } = schedule
				const startTime = formatTime(classMeetingStartTime)
				const endTime = formatTime(classMeetingEndTime)
				const timeRange = (startTime && endTime) ? startTime + ' - ' + endTime : ''
			
				return (
					<div key={idx}>
						{idx > 0 && <br />}
						<span>{timeRange}</span>
					</div>
				)
			})}
	  </>
	)
}


const CourseScheduleDate: React.FC<{scheduleData: UwaterlooClassSchedule[] | null}> = ({ scheduleData }) => {
	const formatDate = (date?: string) =>
	  date ? DateTime.fromFormat(date, 'yyyy-MM-dd').toFormat('LLL d') : ''
  
	const renderDays = (classMeetingWeekPatternCode?: string) =>
		daysOfWeek.map((day, index) => (
			<span
				key={day}
				className={classMeetingWeekPatternCode?.[index] === 'Y' ? 'font-bold' : 'text-gray-400'}
			>
				{day}
			</span>
		))
  
	return (
	  <>
			{scheduleData?.map((schedule, idx) => {
				const { scheduleStartDate, scheduleEndDate, classMeetingWeekPatternCode } = schedule
				const startDate = formatDate(scheduleStartDate)
				const endDate = formatDate(scheduleEndDate)
				const dateRange = startDate === endDate ? startDate : `${startDate} - ${endDate}`
		
				return (
					<div key={idx}>
						{idx > 0 && <br />}
						{classMeetingWeekPatternCode && renderDays(classMeetingWeekPatternCode)}
						{startDate && <span> ({dateRange})</span>}
					</div>
				)
			})}
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
				<Typography variant='h3'>{getCourseName(course)}</Typography>
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

							return (<ListItem key={index} className={listItemClassName}>
								<ListItemText primary={section} className={listItemTextClassName} />
								<ListItemText primary={<CourseScheduleTime scheduleData={courseClass.scheduleData}/>} className={listItemTextClassName} />
								<ListItemText primary={<CourseScheduleDate scheduleData={courseClass.scheduleData}/>} className={listItemTextClassName} />
							</ListItem>)
						})}
				</List>
			</Container>}
		</>
	)
}

const PlanPage: React.FC<PlanPageProps> = ({ availableCourses, selectedCourse, termSchedules }) => {
	const { addedCourses, setAddedCourses } = useCoursesContext()
	const router = useRouter()

	const handleClick = async () => {
		router.push(`${PLAN_URL}/schedule`)
	}

	return (
		<Container
			className="h-full max-w-full absolute flex flex-row justify-center items-center px-8 md:px-0"
		>
			<Box
				className='bg-white/50 rounded-lg p-8 my-8 ml-8 mr-4 shadow-md flex flex-col'
				sx={{height: '80%', width: '25%'}}
			>
				<SearchBar courses={availableCourses}/>
				<Container className='mt-8 pl-0'>
					<Typography variant="h5" >Added Courses</Typography>
					<List>
						{!addedCourses.length ? 
							<ListItem className='py-1'>
								<ListItemText 
									primary={'No courses added yet'} 
									primaryTypographyProps={{variant: 'body2', fontStyle: 'italic'}}
								/>
							</ListItem>
						 : addedCourses
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
										<ListItemText primary={getCourseName(course)} />
									</ListItem>
								))}
					</List>
				</Container>
				<Container className='mt-8 pl-0'>
					<Typography variant="h5" >{filters}</Typography>
					<Typography variant="body2" className='pl-4 pt-1 italic'>{comingSoon}</Typography>
				</Container>
				<Button 
					disabled={addedCourses.length === 0}  
					variant='contained'
					color='primary'
					className='mt-10'
					sx={{
						backgroundColor: '#0A66C2 !important',     
						opacity: 0.8,
					}}
					onClick={handleClick}
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
				{termSchedules &&
					<ScrollableHorizontalView termScheduleData={termSchedules} />
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
			const cookies = context.req.headers.cookie || ''
			const storedAddedCourses = cookies
				.split('; ')
				.find(row => row.startsWith('addedCourses='))
				?.split('=')[1]
			
			if (!storedAddedCourses) {
				return { notFound: true }
			}

			const [ termSchedulesResponse, availableCoursesResponse ] = await Promise.all([
				client.query({
					query: GET_TERM_SCHEDULES,
					variables: {
						courseIds: JSON.parse(decodeURIComponent(storedAddedCourses)).map((course: CookieCourse) => course.courseId)
					}
				}),
				availableCoursesPromise
			])

			if (!termSchedulesResponse.data.termSchedules || !termSchedulesResponse.data.courses) {
				return { notFound: true }
			}

			const sortedResults: Course[] = [...availableCoursesResponse.data.courses].sort((a, b) =>
				a.subjectCode.localeCompare(b.subjectCode) ||
				a.catalogNumber.localeCompare(b.catalogNumber)
			)
			return { props: { availableCourses: sortedResults, termSchedules: termSchedulesResponse.data } }
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
