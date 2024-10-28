import React, { createContext, useContext, useState } from 'react'
import { Course } from '@/types'

interface CoursesContextType {
    selectedCourses: Course[]
    setSelectedCourses: React.Dispatch<React.SetStateAction<Course[]>>
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

	return (
		<CoursesContext.Provider value={{ selectedCourses, setSelectedCourses}}>
			{children}
		</CoursesContext.Provider>
	)
}

export default CoursesProvider
