import { EventInput } from '@fullcalendar/core/index.js'
import dayGridPlugin from '@fullcalendar/daygrid'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import { Button, Container, Typography } from '@mui/material'
import { DateTime } from 'luxon'
import React, { useState } from 'react'
import { nextSchedule, previousSchedule, schedule } from '@/constants'
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

				let currentMoment = DateTime.fromFormat(scheduleStartDate, 'yyyy-MM-dd')
				const endMoment = DateTime.fromFormat(scheduleEndDate, 'yyyy-MM-dd')

				while ((currentMoment < endMoment || currentMoment.equals(endMoment)) && classMeetingWeekPatternCode !== null) {
					if (classMeetingWeekPatternCode[currentMoment.weekday - 1] === 'Y') {
						recurringEvents.push({
							title: classTitle,
							start: currentMoment.set({hour: startTimeHour, minute: startTimeMinute}).toJSDate(),
							end: currentMoment.set({hour: endTimeHour, minute: endTimeMinute}).toJSDate(),
						})
					}
					currentMoment = currentMoment.plus({days: 1})
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
				<Button variant="outlined" disabled={currentIndex === 0} onClick={handlePrev}>{previousSchedule}</Button>
				<Typography variant="h5">{`${schedule} ${currentIndex + 1}`}</Typography>
				<Button variant="outlined" disabled={currentIndex === termSchedules.length - 1} onClick={handleNext}>{nextSchedule}</Button>
			</Container>
			<SingleCalendar schedule={termSchedules[currentIndex]} courses={courses} />
		</Container>
	)
}

export default CalendarComponent
