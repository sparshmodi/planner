import React, { createContext, useContext, useEffect, useState } from 'react'
import { CookieCourse } from '@/types'

interface CoursesContextType {
	addedCourses: CookieCourse[]
	setAddedCourses: React.Dispatch<React.SetStateAction<CookieCourse[]>>
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
	const [addedCourses, setAddedCourses] = useState<CookieCourse[]>([])

	useEffect(() => {
		const storedAddedCourses = document.cookie
			.split('; ')
			.find(row => row.startsWith('addedCourses='))
			?.split('=')[1]

		if (storedAddedCourses) {
			setAddedCourses(JSON.parse(decodeURIComponent(storedAddedCourses)))
		}
	}, [])
	
	useEffect(() => {
		const days = 7
		const expires = `expires=${new Date(Date.now() + days * 864e5).toUTCString()}`

		document.cookie = `addedCourses=${encodeURIComponent(JSON.stringify(addedCourses))}; ${expires}; path=/`
	}, [addedCourses])

	return (
		<CoursesContext.Provider value={{ addedCourses, setAddedCourses }}>
			{children}
		</CoursesContext.Provider>
	)
}

export default CoursesProvider
