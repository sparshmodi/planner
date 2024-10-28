import React, { useState } from 'react'
import { Button, Container, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { Course, Schedule } from '@/types'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import { EventInput } from '@fullcalendar/core/index.js'
import { getCourseName } from '@/utils'

interface CalendarComponentProps {
    schedules: Schedule[]
    availableCourses: Course[]
}

interface SingleCalendarProps {
    schedule: Schedule
    availableCourses: Course[]
}

const generateRecurringEvents = (schedule: Schedule, availableCourses: Course[]) => {
	const recurringEvents: EventInput[] = []

	for (const [courseId, courseClasses] of Object.entries(schedule)) {
		const course = availableCourses.find((course) => course.courseId === courseId)
		if (course === undefined) {
			continue
		}

		const courseName = getCourseName(course)
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

const SingleCalendar: React.FC<SingleCalendarProps> = ({ schedule, availableCourses }) => {
	const recurringEvents = generateRecurringEvents(schedule, availableCourses)
  
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

const CalendarComponent: React.FC<CalendarComponentProps> = ({ schedules, availableCourses }) => {
	const [currentIndex, setCurrentIndex] = useState<number>(0)

	const handleNext = () => setCurrentIndex(prev => (prev < schedules.length - 1 ? prev + 1 : prev))
	const handlePrev = () => setCurrentIndex(prev => (prev > 0 ? prev - 1 : prev))

	return (
		<Container className="flex flex-col gap-2" >
			<Container className="flex items-center justify-between py-4">
				<Button variant="outlined" disabled={currentIndex === 0} onClick={handlePrev}>Previous Schedule</Button>
				<Typography variant="h5">Schedule {currentIndex + 1}</Typography>
				<Button variant="outlined" disabled={currentIndex === schedules.length - 1} onClick={handleNext}>Next Schedule</Button>
			</Container>
			<SingleCalendar schedule={schedules[currentIndex]} availableCourses={availableCourses} />
		</Container>
	)
}

export default CalendarComponent
