import { Google } from '@mui/icons-material'
import { Button, Typography } from '@mui/material'
import Link from 'next/link'
import React from 'react'

interface MenuItemButtonProps {
  href: string
  text: string
}

interface AuthenticationButtonProps {
  hasIcon?: boolean
  text: string
  onClick: React.MouseEventHandler<HTMLAnchorElement> | undefined
}

export const MenuItemButton: React.FC<MenuItemButtonProps> = ({ href, text }) => {
	return (
		<Link href={href} className="px-1" passHref>
			<Button
				variant='outlined'
				component='a'
			>
				<Typography>
					{text}
				</Typography>
			</Button>
		</Link>
	)
}

export const AuthenticationButton: React.FC<AuthenticationButtonProps> = ({ hasIcon = false, text, onClick}) => {
	return (
		<Button 
			variant='outlined'
			component='a'
			onClick={onClick}
			startIcon={ hasIcon && <Google />} // does not follow google's guidelines, fix later
		>
			<Typography>
				{text}
			</Typography>
		</Button>
	)
}
