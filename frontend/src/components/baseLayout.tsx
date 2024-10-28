import React, { ReactNode } from "react"
import Header from "./header"
import Footer from "./footer"
import { Container } from "@mui/material"
import { useRouter } from "next/router"

const BaseLayout: React.FC<{children: ReactNode }> = ({children}) => {
	const router = useRouter()
    
	return (
		<Container
			disableGutters
			maxWidth={false}
			className="flex flex-col min-h-screen w-full mx-0"
		>
			{router.pathname !== '/404' && <Header />}
			<Container 
				disableGutters
				maxWidth={false} 
				className="flex-grow"
			>
				{children}
			</Container>
			<Footer />
		</Container>
	)
}

export default BaseLayout
