import GitHubIcon from '@mui/icons-material/GitHub'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import { Box, IconButton } from '@mui/material'
import React from 'react'

const Footer: React.FC = () => {
	return (
		<Box 
			className="flex justify-end mt-10 pt-4 pr-12 border-t"
			sx={{
				color: 'text.secondary',
				borderColor: 'divider',
			}}
		>
			<IconButton
				color="inherit"
				href="https://github.com/sparshmodi"
			>
				<GitHubIcon />
			</IconButton>
			<IconButton
				color="inherit"
				href="https://www.linkedin.com/in/sparshmodi/"
			>
				<LinkedInIcon />
			</IconButton>
		</Box>
	)
}

export default Footer
