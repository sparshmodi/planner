import { Container, Typography } from '@mui/material'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import React from 'react'

const Profile: React.FC = () => {
	const { data } = useSession() 

	if (!data || !data.user) {
		return null
	}

	const { name, email, image } = data.user

	return (
		<Container
			disableGutters
			maxWidth={false}
			className="h-full absolute flex flex-row justify-center items-center px-8 md:px-0"
			sx={{
				backgroundImage: "url('/mountain.webp')",
				backgroundSize: 'cover',
				backgroundPosition: 'center',
				backgroundRepeat: 'no-repeat',
			}}
		>
			<Container
				maxWidth="xs"
				className="bg-white/70 rounded-lg shadow-lg p-8 h-3/5 flex flex-col items-center"
			>
				<Typography variant="h3" className="text-center">
					Profile
				</Typography>

				{image && 
				<Image src={image} alt="profile" width={120} height={120} className="rounded-full mx-auto my-8" unoptimized />}

				{name && <>
					<Typography variant="body1" className="font-semibold">
					Name
					</Typography>

					<Typography variant="body1" className="mb-4">
						{name}
					</Typography>
				</>
				}

				{email && <>
					<Typography variant="body1" className="font-semibold">
					Email
					</Typography>

					<Typography variant="body1" className="mb-4">
						{email}
					</Typography>
				</>}
			</Container>
		</Container>
	)
}

export default Profile
