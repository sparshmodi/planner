import axios from 'axios'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import React from 'react'
import { BACKEND_COURSE_LIST_EP, DJANGO_BACKEND_URL } from '@/constants'
import { Course } from '@/types'
import { snakeToCamel } from '@/utils'

interface CoursePageProps {
    coursesData: Course[] | null
}

const CoursePage: React.FC<CoursePageProps> = ({ coursesData }) => {
	const router = useRouter()

	if (!coursesData) {
		router.replace('/404')
		return null
	}
}

export const getServerSideProps: GetServerSideProps<CoursePageProps> = async () => {
	try {
		const courseListUrl = DJANGO_BACKEND_URL + BACKEND_COURSE_LIST_EP
		const response = await axios.get(courseListUrl)
		const result: Course[] = await snakeToCamel(response.data)
		const sortedResults: Course[] = result.sort((a, b) =>
			a.subjectCode.localeCompare(b.subjectCode) ||
            a.catalogNumber.localeCompare(b.catalogNumber)
		)
		return { props: { coursesData: sortedResults}}
	} catch (e: any) {
		return { props: { coursesData: null, error: `Failed to load data. ${e.message}` } }
	}
}

export default CoursePage