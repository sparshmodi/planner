import 'tailwindcss/tailwind.css'
import { ApolloClient, ApolloProvider } from '@apollo/client'
import { Container, CssBaseline, ThemeProvider, createTheme, Box } from '@mui/material'
import { GoogleAnalytics } from '@next/third-parties/google' 
import { AppProps } from 'next/app'
import Head from 'next/head'
import { SessionProvider, useSession } from 'next-auth/react'
import React, { PropsWithChildren, ReactNode, useEffect, useState } from 'react'
import BaseLayout from '@/components/baseLayout'
import LoadingState from '@/components/loading'
import { AuthenticationStatus, uwPlan } from '@/constants'
import { createClientSideApolloClient } from '@/graphql/apolloClient'
import CoursesProvider from './plan/context'
import getDarkTheme from './theme'

const darkTheme = createTheme(getDarkTheme())

const ApolloProviderWrapper: React.FC<{children: ReactNode}> = ({ children }) => {
	const [client, setClient] = useState<ApolloClient<any> | null>(null)

	useEffect(() => {
		const init = async () => {
			const client = await createClientSideApolloClient()
			setClient(client)
		}
		init()
	}, [])

	if (!client) {
		return <>{children}</>
	}

	return (
		<ApolloProvider client={client}>
			{children}
		</ApolloProvider>
	)
}

export default function App({
	Component,
	pageProps: { session, ...pageProps },
}: AppProps): React.ReactNode {
	return (
		<>
			<Head>
				<title>{uwPlan}</title>
				<link rel="icon" href="/icon.png"  />
			</Head>
			<GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''}/>
			<SessionProvider session={session}>
				<ThemeProvider theme={darkTheme}>
					<CssBaseline />
					<CoursesProvider>
						<ApolloProviderWrapper >
							<Auth>
								<BaseLayout>
									<Box sx={{ bgcolor: 'background.default' }}>
										<Component {...pageProps} />
									</Box>
								</BaseLayout>
							</Auth>
						</ApolloProviderWrapper>
					</CoursesProvider>
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