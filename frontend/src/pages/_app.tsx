import 'tailwindcss/tailwind.css'
import React, { PropsWithChildren } from "react"
import { AppProps } from "next/app"
import Head from "next/head"
import { SessionProvider, useSession } from "next-auth/react"
import { Container, CssBaseline, ThemeProvider, createTheme, Box } from "@mui/material"
import { loadingStatus } from "@/constants"
import LoadingState from "@/components/loading"
import BaseLayout from "@/components/baseLayout"
import CoursesProvider from "./plan/context"
import getDarkTheme from "./theme"
import { GoogleAnalytics } from '@next/third-parties/google' 

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
                    <CoursesProvider>
                        <Auth>
                            <BaseLayout>
                                <Box sx={{ bgcolor: 'background.default' }}>
                                    <Component {...pageProps} />
                                </Box>
                            </BaseLayout>
                        </Auth>
                    </CoursesProvider>
                </ThemeProvider>
            </SessionProvider>
        </>
    )
}

const Auth: React.FC<PropsWithChildren> = ({ children }) => {
    // status can only be "loading" or "authenticated"
    const { status } = useSession({ required: false })

    if (status === loadingStatus) {
        return (
            <Container className="flex min-h-screen w-full items-center justify-center">
                <LoadingState />
            </Container>)
    }

    return children
}