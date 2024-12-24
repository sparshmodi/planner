
// import { DateTime } from 'luxon'
// import { FinalClass, PlanClass, UwaterlooClass, UwaterlooSection } from "@/types"

// type Class = PlanClass

// export const modifyFetchedData = (classes: UwaterlooClass[]): PlanClass[] => {
//     const modifiedData: PlanClass[] = []

//     for (const uwClass of classes) {
//         const newClass: PlanClass = {}
//         for (const section of uwClass) {
//             if (newClass[section.courseComponent]) {
//                 newClass[section.courseComponent].push(section)
//             } else {
//                 newClass[section.courseComponent] = [section]
//             }
//         }
//         modifiedData.push(newClass)
//     }

//     return modifiedData
// }

// const sectionsOverlap = (section1: UwaterlooSection, section2: UwaterlooSection): boolean => {
//     if (section1.scheduleData === null || section2.scheduleData === null) return false
//     for (const scheduleData1 of section1.scheduleData) {
//         for (const scheduleData2 of section2.scheduleData) {
//             if (
//                 scheduleData1.classMeetingDayPatternCode.includes(scheduleData2.classMeetingDayPatternCode) &&
//                 DateTime.fromISO(scheduleData1.classMeetingStartTime) <= DateTime.fromISO(scheduleData2.classMeetingEndTime) &&
//                 DateTime.fromISO(scheduleData1.classMeetingEndTime) >= DateTime.fromISO(scheduleData2.classMeetingStartTime)
//             ) {
//                 return true
//             }
//         }
//     }
//     return false
// }

// export const generateCombinationsForClass = (inputClass: Class): FinalClass[] => {
//     const keys = Object.keys(inputClass)

//     const generateAllCombinations = (index: number, currentCombination: FinalClass): FinalClass[] => {
//         if (index === keys.length) {
//             return [currentCombination]
//         }
    
//         const key = keys[index]
//         const finalClassValues = inputClass[key]
//         const combinations: FinalClass[] = []
    
//         for (const finalClass of finalClassValues) {
//             const newCombination = { ...currentCombination, [key]: finalClass }
//             combinations.push(...generateAllCombinations(index + 1, newCombination))
//         }
    
//         return combinations
//     }

//     const allCombinations = generateAllCombinations(0, {})

//     const doesNotOverlap = (classToCheck: FinalClass) => {
//         const sectionsArray = Object.values(classToCheck)
//         for (let i = 0; i < sectionsArray.length; i++) {
//             for (let j = i + 1; j < sectionsArray.length; j++) {
//                 if (sectionsOverlap(sectionsArray[i], sectionsArray[j])) return false
//             }
//         }
//         return true
//     }
    
//     return allCombinations.filter(classToFilter => doesNotOverlap(classToFilter))
// }

// export const generateSchedules = (arrays: FinalClass[][]): FinalClass[][] => {

//     const generateAllScheduleCombinations = (arrays: FinalClass[][]): FinalClass[][] => {
//         if (arrays.length === 0) {
//             return [[]]
//         }
        
//         const currentArray = arrays[0]
//         const remainingArrays = arrays.slice(1)
//         const combinations: FinalClass[][] = []
        
//         const lowerCombinations = generateSchedules(remainingArrays)
        
//         for (const y of currentArray) {
//             for (const lowerCombination of lowerCombinations) {
//             combinations.push([y, ...lowerCombination])
//             }
//         }
        
//         return combinations
//     }

//     const classesOverlap = (class1: FinalClass, class2: FinalClass): boolean => {
//         const courseComponents1 = Object.keys(class1) 
//         const courseComponents2 = Object.keys(class2) 

//         for (const courseComponent1 of courseComponents1) {
//             for (const courseComponent2 of courseComponents2) {
//                 if (sectionsOverlap(class1[courseComponent1], class2[courseComponent2])) return true
//             }
//         }
//         return false
//     }

//     const allCombinations = generateAllScheduleCombinations(arrays)

//     const doesNotOverlap = (scheduleToCheck: FinalClass[]) => {
//         for (let i = 0; i < scheduleToCheck.length; i++) {
//             for (let j = i + 1; j < scheduleToCheck.length; j++) {
//                 if (classesOverlap(scheduleToCheck[i], scheduleToCheck[j])) return false
//             }
//         }
//         return true
//     }
    
//     return allCombinations.filter(scheduleToFilter => doesNotOverlap(scheduleToFilter))
// }


// export type UwaterlooClass = UwaterlooSection[]

// export type PlanClass = {[courseComponent: string]: UwaterlooSection[]}

// export type FinalClass = {[courseComponent: string]: UwaterlooSection}