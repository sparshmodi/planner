import { Container } from '@mui/material'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { ReactNode } from 'react'
import { HOME_URL, NOT_FOUND_URL, notFoundTitle, PLAN_URL, profile, PROFILE_URL, uwPlan } from '@/constants'
import { capitalizeFirstLetter } from '@/utils'
import Footer from './footer'
import Header from './header'

const getTitle = (pathname: string, slug?: string | string[]) => {
	if (pathname === HOME_URL) {
		return uwPlan
	} else if (pathname.startsWith(PLAN_URL)) {
		return slug && typeof slug === 'string' 
			? `${/\d$/.test(slug) ? slug.toUpperCase() : capitalizeFirstLetter(slug)} - ${uwPlan}`
			: uwPlan
	} else if (pathname === PROFILE_URL) {
		return `${profile} - ${uwPlan}`
	}
	return `${notFoundTitle} - ${uwPlan}`
}

const BaseLayout: React.FC<{children: ReactNode }> = ({children}) => {
	const { pathname, query: {slug} } = useRouter()
    
	return (
		<>
			<Head>
				<title>{getTitle(pathname, slug)}</title>
			</Head>
			<Container
				disableGutters
				maxWidth={false}
				className="flex flex-col min-h-screen w-full mx-0"
				sx={{
					backgroundImage: "url('/mountain.webp')",
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					backgroundRepeat: 'no-repeat',
				}}
			>
				{pathname !== NOT_FOUND_URL && <Header />}
				<Container 
					disableGutters
					maxWidth={false} 
					className="flex-grow"
				>
					{children}
				</Container>
				<Footer />
			</Container>
		</>
	)
}

export default BaseLayout
