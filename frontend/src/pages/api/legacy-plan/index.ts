// import { NextApiRequest, NextApiResponse } from 'next'
// import axios from 'axios'
// import { UW_SCHEDULES_ENDPOINT } from '@/constants'
// import { getServerSession } from 'next-auth'
// import { authOptions } from '../auth/[...nextauth]'
// import { FinalClass, UwaterlooClass, UwaterlooSection } from '@/types'
// import { generateCombinationsForClass, generateSchedules, modifyFetchedData } from './helpers'

// const handler = async (req: NextApiRequest, res: NextApiResponse) => {
//     const session = await getServerSession(req, res, authOptions)

//     if (session) {
//         const courses = req.query.course as string
//         const coursesArray: string[] = courses.split(',').map(str => str.trim())
    
//         let coursesData: UwaterlooClass[] = []

//         await Promise.all(coursesArray.map(async (course: string) => {
//             try {
//                 const response = await axios.get<UwaterlooClass>(UW_SCHEDULES_ENDPOINT + course, {
//                     headers: {
//                         'x-api-key': process.env.UWATERLOO_KEY
//                     }
//                 })
//                 const data = response.data as unknown as UwaterlooSection[]
//                 coursesData.push(data)
//             } catch (err) {
//                 console.error(err)
//             }
//         }))

//         const modifiedData = modifyFetchedData(coursesData)

//         let allCombinationsOfClasses: FinalClass[][] = []
//         for (const inputClass of modifiedData) {
//             const returnedData = generateCombinationsForClass(inputClass)
//             allCombinationsOfClasses.push(returnedData)
//         }

//         const data = generateSchedules(allCombinationsOfClasses)

//         res.status(200).send(data)
//     } else {
//         res.status(401).end()
//     }
// }

// export default handler
