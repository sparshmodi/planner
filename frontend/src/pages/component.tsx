import React from 'react'
import Link from 'next/link'
import { Box, Button, Container, Stack, Typography } from '@mui/material'
import { uw, plan, tagline, planYourTerm, DJANGO_BACKEND_URL, BACKEND_COURSE_LIST_EP } from '../constants'
import { GetServerSideProps } from 'next'
import axios from 'axios'
import { Course } from '@/types'
import { snakeToCamel } from '@/utils'
import SearchBar from '@/components/searchbar'

interface LandingPageProps {
    coursesData: Course[] | null
    error?: string
}

const LandingPage: React.FC<LandingPageProps> = ({ coursesData, error}) => {
    return (
        <Container 
            disableGutters
            maxWidth={false}
            className="h-full absolute flex flex-row md:justify-end items-center pb-20 px-8 md:px-0"
            sx={{
                backgroundImage: "url('mountain.webp')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            <Stack 
                spacing={1}
                useFlexGap 
                className='w-full md:w-5/12 md:pr-48 justify-start'
            >
                <Typography variant="h1">
                    {uw}&nbsp;{plan}
                </Typography>
                <Typography
                    variant='h6'
                    sx={{ color: 'text.secondary' }}
                >
                    {tagline}
                </Typography>
                {/* <Link href="/plan" className="px-1">
                    <Button variant="text" color="primary" className="w-full">
                        {planYourTerm}
                    </Button>
                </Link> */}
                <SearchBar courses={coursesData!}/>
            </Stack>
        </Container>
  )
}

export const getServerSideProps: GetServerSideProps<LandingPageProps> = async () => {
    try {
        const courseListUrl = DJANGO_BACKEND_URL + BACKEND_COURSE_LIST_EP
        const response = await axios.get(courseListUrl)
        const result: Course[] = await snakeToCamel(response.data)
        const sortedResults: Course[] = result.sort((a, b) =>
            a.subjectCode.localeCompare(b.subjectCode) ||
            a.catalogNumber.localeCompare(b.catalogNumber)
        )
        return { props: { coursesData: sortedResults}}
    } catch (e: any) {
        return { props: { coursesData: null, error: `Failed to load data. ${e.message}` } }
    }
}

export default LandingPage
