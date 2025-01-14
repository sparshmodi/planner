import { CookieCourse, Course } from './types'

export const snakeToCamel = (obj: any): any => {
	if (obj === null || typeof obj !== 'object') {
		return obj
	}

	if (Array.isArray(obj)) {
		return obj.map(item => snakeToCamel(item))
	}

	return Object.keys(obj).reduce((acc, key) => {
		const camelKey = key.replace(/_([a-z])/g, (_, char) => char.toUpperCase())
		acc[camelKey] = snakeToCamel(obj[key])
		return acc
	}, {} as any)
}

export const getCourseName = (course: Course | CookieCourse): string => `${course.subjectCode} ${course.catalogNumber}`

export const capitalizeFirstLetter = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
