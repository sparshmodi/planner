import 'tailwindcss/tailwind.css'
import { ApolloProvider } from '@apollo/client'
import { Container, CssBaseline, ThemeProvider, createTheme, Box } from '@mui/material'
import { GoogleAnalytics } from '@next/third-parties/google' 
import { AppProps } from 'next/app'
import Head from 'next/head'
import { SessionProvider, useSession } from 'next-auth/react'
import React, { PropsWithChildren } from 'react'
import BaseLayout from '@/components/baseLayout'
import LoadingState from '@/components/loading'
import { AuthenticationStatus } from '@/constants'
import client from '@/graphql/apolloClient'
import CoursesProvider from './plan/context'
import getDarkTheme from './theme'

const darkTheme = createTheme(getDarkTheme())

export default function App({
	Component,
	pageProps: { session, ...pageProps },
}: AppProps): React.ReactNode {
	return (
		<>
			<Head>
				<title>UW Plan</title>
				<link rel="icon" href="/icon.png"  />
			</Head>
			<GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''}/>
			<SessionProvider session={session}>
				<ThemeProvider theme={darkTheme}>
					<CssBaseline />
					<ApolloProvider client={client}>
						<CoursesProvider>
							<Auth>
								<BaseLayout>
									<Box sx={{ bgcolor: 'background.default' }}>
										<Component {...pageProps} />
									</Box>
								</BaseLayout>
							</Auth>
						</CoursesProvider>
					</ApolloProvider>
				</ThemeProvider>
			</SessionProvider>
		</>
	)
}

const Auth: React.FC<PropsWithChildren> = ({ children }) => {
	const { status } = useSession({ required: false })

	if (status === AuthenticationStatus.Loading) {
		return (
			<Container className="flex min-h-screen w-full items-center justify-center">
				<LoadingState />
			</Container>)
	}

	return children
}