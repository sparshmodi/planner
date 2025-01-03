import GitHubIcon from '@mui/icons-material/GitHub'
import { Box, IconButton } from '@mui/material'
import React from 'react'

const Footer: React.FC = () => {
	return (
		<Box 
			className="flex justify-end mt-10 pt-4 pr-12"
		>
			<IconButton
				color="inherit"
				href="https://github.com/sparshmodi/planner"
				target="_blank"
				rel="noopener noreferrer"
			>
				<GitHubIcon />
			</IconButton>
		</Box>
	)
}

export default Footer
