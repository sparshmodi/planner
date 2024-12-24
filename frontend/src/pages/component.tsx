import { Container, Stack, Typography } from '@mui/material'
import { GetServerSideProps } from 'next'
import React from 'react'
import SearchBar from '@/components/searchbar'
import { createApolloClient } from '@/graphql/apolloClient'
import { GET_UNDERGRADUATE_COURSES } from '@/graphql/queries/courseQueries'
import { Course } from '@/types'
import { uw, plan, tagline } from '../constants'

interface LandingPageProps {
    coursesData: Course[] | null
    error?: string
}

const LandingPage: React.FC<LandingPageProps> = ({ coursesData, error}) => {
	return (
		<Container 
			disableGutters
			maxWidth={false}
			className="h-full absolute flex flex-row md:justify-end items-center pb-20 px-8 md:px-0"
			sx={{
				backgroundImage: "url('/mountain.webp')",
				backgroundSize: 'cover',
				backgroundPosition: 'center',
				backgroundRepeat: 'no-repeat',
			}}
		>
			<Stack 
				spacing={1}
				useFlexGap 
				className='w-full md:w-5/12 md:pr-48 justify-start'
			>
				<Typography variant="h1">
					{uw}&nbsp;{plan}
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
