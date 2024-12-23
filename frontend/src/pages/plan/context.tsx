import React, { createContext, useContext, useEffect, useState } from 'react'
import { Course, LocalStorageCourse } from '@/types'

interface CoursesContextType {
    selectedCourses: Course[]
    setSelectedCourses: React.Dispatch<React.SetStateAction<Course[]>>

	addedCourses: LocalStorageCourse[]
	setAddedCourses: React.Dispatch<React.SetStateAction<LocalStorageCourse[]>>
}

interface CoursesProviderProps {
    children: React.ReactNode
}

const CoursesContext = createContext<CoursesContextType | undefined>(undefined)

export const useCoursesContext = () => {
	const context = useContext(CoursesContext)
	if (!context) {
		throw new Error('useCoursesContext must be used within a MyProvider')
	}
	return context
}

const CoursesProvider: React.FC<CoursesProviderProps> = ({ children }) => {
	const [selectedCourses, setSelectedCourses] = useState<Course[]>([])
	const [addedCourses, setAddedCourses] = useState<LocalStorageCourse[]>([])

	useEffect(() => {
		const storedAddedCourses = localStorage.getItem('addedCourses')
		if (storedAddedCourses) {
			setAddedCourses(JSON.parse(storedAddedCourses))
		}
	}, [])
	
	useEffect(() => {
		localStorage.setItem('addedCourses', JSON.stringify(addedCourses))
	}, [addedCourses])

	return (
		<CoursesContext.Provider value={{ selectedCourses, setSelectedCourses, addedCourses, setAddedCourses }}>
			{children}
		</CoursesContext.Provider>
	)
}

export default CoursesProvider
