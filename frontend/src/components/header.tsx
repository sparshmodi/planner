import { AppBar, Toolbar, Container } from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { signIn, signOut, useSession } from 'next-auth/react'
import React from 'react'
import { AuthenticationStatus, profile, signInText, signOutText } from '@/constants'
import { MenuItemButton, AuthenticationButton } from './button'

const Header: React.FC = () => {
	const { status } = useSession()
	const { pathname } = useRouter()

	return (
		<AppBar
			className="shadow-none bg-transparent bg-none mt-3"
		>
			<Container maxWidth={false}>
				<Toolbar
					variant="regular"
					className="
                        shadow-none
                        max-h-10
                        justify-end
                        gap-5
                    "
				>
					{ status === AuthenticationStatus.Authenticated && 
						(pathname !== '/profile' ? 
							<MenuItemButton href="/profile" text={profile} /> :
							<Link href={'/'}>
								<Image src="/icon.png" alt="logo" width={30} height={30} />
							</Link>
						)}
					{ status === AuthenticationStatus.Authenticated ? 
						<AuthenticationButton
							text={signOutText}
							onClick={() => signOut()}
						/> : 
						<AuthenticationButton
							hasIcon
							text={signInText.toLocaleUpperCase()}
							onClick={() => signIn('google')}
						/>}
					{/* <AuthenticationButton
                        href="/material-ui/getting-started/templates/sign-up/"
                        text={signUp}
                    /> */}
				</Toolbar>
			</Container>
		</AppBar>
	)
}

export default Header
