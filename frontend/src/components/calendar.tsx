import { EventInput } from '@fullcalendar/core/index.js'
import dayGridPlugin from '@fullcalendar/daygrid'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import { Button, Container, Typography } from '@mui/material'
import dayjs from 'dayjs'
import React, { useState } from 'react'
import { Course, Schedule, TermScheduleData } from '@/types'
import { getCourseName } from '@/utils'

interface CalendarComponentProps {
    termScheduleData: TermScheduleData
}

interface SingleCalendarProps {
    schedule: Schedule
    courses: Course[]
}

const generateRecurringEvents = (termSchedule: Schedule, courses: Course[]) => {
	const recurringEvents: EventInput[] = []

	for (const {courseId, classes} of termSchedule) {
		const course = courses.find((c) => c.courseId === courseId)
		if (course === undefined || course.classes === undefined) {
			continue
		}

		const courseName = getCourseName(course)
		const courseClasses = course.classes?.filter((c) => classes.includes(c.classSection))
		for (const courseClass of courseClasses) {
			const classTitle = `${courseName}: ${courseClass.courseComponent}`
			courseClass.scheduleData?.forEach(scheduleData =>  {
				const { 
					scheduleStartDate, 
					scheduleEndDate, 
					classMeetingWeekPatternCode, 
					classMeetingStartTime, 
					classMeetingEndTime 
				} = scheduleData

				const [startTimeHour, startTimeMinute] = classMeetingStartTime.split(':').map(Number)
				const [endTimeHour, endTimeMinute] = classMeetingEndTime.split(':').map(Number)

				let currentMoment = dayjs(scheduleStartDate)
				const endMoment = dayjs(scheduleEndDate)

				while ((currentMoment.isBefore(endMoment) || currentMoment.isSame(endMoment)) && classMeetingWeekPatternCode !== null) {
					if (classMeetingWeekPatternCode[currentMoment.day() === 0 ? 6 : currentMoment.day() - 1] === 'Y') {
						recurringEvents.push({
							title: classTitle,
							start: currentMoment.hour(startTimeHour).minute(startTimeMinute).toDate(),
							end: currentMoment.hour(endTimeHour).minute(endTimeMinute).toDate(),
						})
					}
					currentMoment = currentMoment.add(1, 'day')
				}
			})
		}
	}
	return recurringEvents
}

const SingleCalendar: React.FC<SingleCalendarProps> = ({ schedule, courses }) => {
	const recurringEvents = generateRecurringEvents(schedule, courses)
  
	return (
		<Container className="w-full">
			<FullCalendar
				plugins={[dayGridPlugin, timeGridPlugin]}
				initialView='dayGridMonth'
				weekends={false}
				events={recurringEvents}
				headerToolbar={{
					left: 'prev,next',
					center: 'title',
					right: 'timeGridWeek,dayGridMonth'
				}}
			/>
		</Container>
	)
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({ termScheduleData }) => {
	const { termSchedules, courses } = termScheduleData
	const [currentIndex, setCurrentIndex] = useState<number>(0)

	const handleNext = () => setCurrentIndex(prev => (prev < termSchedules.length - 1 ? prev + 1 : prev))
	const handlePrev = () => setCurrentIndex(prev => (prev > 0 ? prev - 1 : prev))

	return (
		<Container className="flex flex-col gap-2" >
			<Container className="flex items-center justify-between py-1">
				<Button variant="outlined" disabled={currentIndex === 0} onClick={handlePrev}>Previous Schedule</Button>
				<Typography variant="h5">Schedule {currentIndex + 1}</Typography>
				<Button variant="outlined" disabled={currentIndex === termSchedules.length - 1} onClick={handleNext}>Next Schedule</Button>
			</Container>
			<SingleCalendar schedule={termSchedules[currentIndex]} courses={courses} />
		</Container>
	)
}

export default CalendarComponent
