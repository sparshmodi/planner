import { Container, Stack, Typography } from '@mui/material'
import React from 'react'
import SearchBar from '@/components/searchbar'
import { tagline, uwPlan } from '../constants'

const LandingPage: React.FC = () => {
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
				<SearchBar/>
			</Stack>
		</Container>
	)
}

export default LandingPage
