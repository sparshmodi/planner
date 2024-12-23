import { Container, Stack, Typography } from '@mui/material'
import { GetServerSideProps } from 'next'
import React from 'react'
import SearchBar from '@/components/searchbar'
import { createApolloClient } from '@/graphql/apolloClient'
import { GET_UNDERGRADUATE_COURSES } from '@/graphql/queries/courseQueries'
import { Course } from '@/types'
import { tagline, uwPlan } from '../constants'

interface LandingPageProps {
    coursesData: Course[] | null
    error?: string
}

const LandingPage: React.FC<LandingPageProps> = ({ coursesData, error}) => {
	return (
		<Container 
			className="h-full max-w-full absolute flex flex-row md:justify-end items-center pb-20 px-8 md:px-0"
		>
			<Stack 
				spacing={1}
				useFlexGap 
				className='w-full md:w-5/12 md:pr-48 justify-start'
			>
				<Typography variant="h1">
					{uwPlan}
				</Typography>
				<Typography
					variant='h6'
					sx={{ color: 'text.secondary' }}
				>
					{tagline}
				</Typography>
				<SearchBar courses={coursesData!}/>
			</Stack>
		</Container>
	)
}

export const getServerSideProps: GetServerSideProps<LandingPageProps> = async () => {
	const client = createApolloClient()

	try {
		const { data } = await client.query({
			query: GET_UNDERGRADUATE_COURSES
		}) 
        
		const sortedResults: Course[] = [...data.courses].sort((a, b) =>
			a.subjectCode.localeCompare(b.subjectCode) ||
            a.catalogNumber.localeCompare(b.catalogNumber)
		)
		return { props: { coursesData: sortedResults}}
	} catch (e: any) {
		return { props: { coursesData: null, error: `Failed to load data. ${e.message}` } }
	}
}

export default LandingPage
