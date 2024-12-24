import { Container, Typography } from '@mui/material'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import React from 'react'
import { profile, name as nameTitle, email as emailTitle } from '@/constants'

const Profile: React.FC = () => {
	const { data } = useSession() 

	if (!data || !data.user) {
		return null
	}

	const { name, email, image } = data.user

	return (
		<Container
			className="h-full max-w-full absolute flex flex-row justify-center items-center px-8 md:px-0"
		>
			<Container
				maxWidth="xs"
				className="bg-white/70 rounded-lg shadow-lg p-8 h-3/5 flex flex-col items-center"
			>
				<Typography variant="h3" className="text-center">
					{profile}
				</Typography>

				{image && 
				<Image src={image} alt="profile" width={120} height={120} className="rounded-full mx-auto my-8" unoptimized />}

				{name && <>
					<Typography variant="body1" className="font-semibold">
						{nameTitle}
					</Typography>

					<Typography variant="body1" className="mb-4">
						{name}
					</Typography>
				</>
				}

				{email && <>
					<Typography variant="body1" className="font-semibold">
						{emailTitle}
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
