import { Container } from '@mui/material'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { ReactNode } from 'react'
import { notFoundTitle, profile, uwPlan } from '@/constants'
import { capitalize } from '@/utils'
import Footer from './footer'
import Header from './header'

const getTitle = (pathname: string, slug?: string | string[]) => {
	if (pathname === '/') {
		return uwPlan
	} else if (pathname.startsWith('/plan')) {
		return slug && typeof slug === 'string' ? `${capitalize(slug)} - ${uwPlan}` : uwPlan
	} else if (pathname === '/profile') {
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
			>
				{pathname !== '/404' && <Header />}
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
