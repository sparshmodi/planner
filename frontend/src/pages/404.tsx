import { goBackToHome, notFoundDescription, notFoundTitle } from "@/constants"
import { Button, Container, Typography } from "@mui/material"
import Link from "next/link"

export const PageNotFound = () => {
	return (
		<Container 
			disableGutters
			maxWidth={false}
			className="h-full absolute flex flex-col justify-center items-center p-10"
			sx={{
				backgroundImage: "url('mountain.webp')",
				backgroundSize: 'cover',
				backgroundPosition: 'center',
			}}
		>
			<Typography variant="h1">{notFoundTitle}</Typography>
			<Typography variant="h6">{notFoundDescription}</Typography>
			<Link href="/" className="mt-8">
				<Button variant="contained" className="bg-blue-500">{goBackToHome}</Button>
			</Link>
		</Container>)
}

export default PageNotFound
