import { Autocomplete, AutocompleteChangeReason, TextField } from '@mui/material'
import React, { useState } from 'react'
import { useCoursesContext } from '@/pages/plan/context'
import { Course } from '@/types'
import { getCourseName } from '@/utils'

interface AutoCompleteProps {
    availableCourses: Course[]
}

const AutoComplete: React.FC<AutoCompleteProps> = ({ availableCourses }) => {
	const [selectedValue, setSelectedValue] = useState<Course | null>(null)
	const { selectedCourses, setSelectedCourses } = useCoursesContext()

	const handleChange = (e: React.SyntheticEvent, newValue: Course | null, reason: AutocompleteChangeReason) => {
		if (newValue && reason ==='selectOption') {
			setSelectedCourses(prevSelectedCourses => {
				// Remove old selected value if it exists
				const updatedCourses = prevSelectedCourses.filter(course => course.courseId !== selectedValue?.courseId)
				// Add new selected value
				updatedCourses.push(newValue)
				return updatedCourses
			})
		} else if (reason === 'removeOption' || reason === 'clear' || (selectedValue && availableCourses.includes(selectedValue))) {
			setSelectedCourses(prevSelectedCourses => prevSelectedCourses.filter(course => course.courseId !== selectedValue?.courseId))
		}

		setSelectedValue(newValue)
	}

	return (
		<Autocomplete 
			value={selectedValue}
			onChange={handleChange}
			options={availableCourses.filter(course => !selectedCourses.some(sc => sc.courseId === course.courseId) || course.courseId === selectedValue?.courseId)}
			isOptionEqualToValue={(option, value) => option.courseId === value.courseId}
			renderInput={(params) => <TextField {...params} label="Course" />}
			getOptionLabel={(course) => getCourseName(course)}
		/>
	)
}

export default AutoComplete
