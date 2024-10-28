import React from "react"
import { signIn, signOut, useSession } from "next-auth/react"
import { AppBar, Toolbar, Container } from '@mui/material'
import { MenuItemButton, AuthenticationButton } from "./button"
import { plan, profile, signInText, signOutText } from "@/constants"

const Header: React.FC = () => {
	const { status } = useSession()

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
					{/* <Image src="/icon.png" alt="logo" width={30} height={30} /> */}
					<MenuItemButton href="/plan" text={plan.toLocaleUpperCase()} />
					<MenuItemButton href="/profile" text={profile.toLocaleUpperCase()} />
					{ status === 'authenticated' ? 
						<AuthenticationButton
							text={signOutText}
							onClick={() => signOut()}
						/> : 
						<AuthenticationButton
							hasIcon
							text={signInText.toLocaleUpperCase()}
							onClick={() => signIn("google")}
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
