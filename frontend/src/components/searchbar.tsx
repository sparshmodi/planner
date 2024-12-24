import SearchIcon from '@mui/icons-material/Search'
import { Autocomplete, FormControl, InputAdornment, InputLabel, ListItemText, TextField } from '@mui/material'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { noOptions, PLAN_URL, searchForCourses } from '@/constants'
import { Course } from '@/types'

interface SearchBarProps {
    courses: Course[]
}

const getCourseOptionLabel = (course: Course) => {
	return `${course.subjectCode} ${course.catalogNumber} ${course.title}`
}

const SearchBar: React.FC<SearchBarProps> = ({courses}) => {
	const [selectedValue, setSelectedValue] = useState<Course | null>(null)
	const [inputValue, setInputValue] = useState<string>('')
	const [filteredOptions, setFilteredOptions] = useState<Course[]>([])
	const [open, setOpen] = useState(false)

	useEffect(() => {
		setOpen(inputValue !== null && filteredOptions.length > 0)
	}, [inputValue, filteredOptions])
  
	const handleInputChange = (event: React.SyntheticEvent, newInputValue: string) => {
		setInputValue(newInputValue)
      
		if (newInputValue) {
			const filtered = courses.filter(course => 
				getCourseOptionLabel(course).toLowerCase().includes(newInputValue.toLowerCase())
			)
			setFilteredOptions(filtered.slice(0, 5)) // Limit to 5 options
		} else {
			setFilteredOptions([])
		}
	}

	const handleChange = (_: React.SyntheticEvent, newSelectedValue: Course | null) => {
		setSelectedValue(newSelectedValue)
	}
  
	return (<FormControl variant="outlined" className='bg-white rounded-md min-w-full'>
		<InputLabel
			className={`ml-6 ${inputValue ? 'hidden' : 'flex'}`}
		>
			{searchForCourses}
		</InputLabel>
		<Autocomplete
			options={filteredOptions}
			getOptionLabel={(course) => getCourseOptionLabel(course)}
			value={selectedValue}
			onChange={handleChange}
			inputValue={inputValue}
			onInputChange={handleInputChange}
			renderOption={(props, course) => (
				<li 
					{...props} 
					className="flex items-center p-2 hover:bg-gray-200 cursor-pointer" 
					onClick={() => {
						setOpen(false)
					}}
				>
					<Link href={`${PLAN_URL}/${course.subjectCode}${course.catalogNumber}`} >
						<ListItemText
							primary={
								<>
									<span className="font-bold">{course.subjectCode} {course.catalogNumber}</span>
									<span className='mx-1 border-b'>—</span>
									<span className="text-gray-500">{course.title}</span>
								</>
							}
						/>
					</Link>
				</li>
			)}
			renderInput={(params) => (
				<TextField 
					{...params}
					variant="outlined"
					InputProps={{
						...params.InputProps,
						startAdornment: 
              <InputAdornment position='start' className='mr-0'>
              	<SearchIcon />
              </InputAdornment>
					}}
				/>
			)}
			open={open}
			noOptionsText={noOptions}
		/>
	</FormControl>
	)
}
  
export default SearchBar
