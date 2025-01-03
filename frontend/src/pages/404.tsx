import { Button, Container, Typography } from '@mui/material'
import Link from 'next/link'
import { goBackToHome, notFoundDescription, notFoundTitle } from '@/constants'

export const PageNotFound = () => {
	return (
		<Container 
			className="h-full max-w-full absolute flex flex-col justify-center items-center p-10"
		>
			<Typography variant="h1">{notFoundTitle}</Typography>
			<Typography variant="h6">{notFoundDescription}</Typography>
			<Link href="/" className="mt-8">
				<Button variant="contained" className="bg-blue-500">{goBackToHome}</Button>
			</Link>
		</Container>)
}

export default PageNotFound
