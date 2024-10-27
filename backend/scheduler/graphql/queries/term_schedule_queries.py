from typing import Tuple, List, Dict
from ..types import TermScheduleResponseType, ClassType
from ...models import Course, Class, CoursesOverlap
import graphene
from ...utils import classes_overlap
import re
import logging

logger = logging.getLogger("planner")


class TermScheduleQueries(graphene.ObjectType):
    term_schedules = graphene.List(
        graphene.List(TermScheduleResponseType), courses=graphene.String(required=True)
    )

    def resolve_term_schedules(self, info, courses):
        course_ids: List[str] = courses.split(",")[:6]

        # Sanitizing course ids parameter
        decimal_number_regex = re.compile(r"^\d+$")
        if any(not decimal_number_regex.match(course) for course in course_ids):
            raise ValueError(
                {"error": "courses parameter should contain valid course IDs."}
            )

        course_input = Course.objects.filter(course_id__in=course_ids)
        class_combinations_by_course: Dict[str, Course] = {
            course.course_id: course for course in course_input
        }

        if len(class_combinations_by_course) != len(course_ids):
            raise ValueError(
                {"error": "courses parameter should contain valid course IDs."}
            )

        class_data_by_course: Dict[str, Dict[int, Class]] = {
            id: {
                class_data.class_section: class_data
                for class_data in Class.objects.filter(associated_course__course_id=id)
            }
            for id in course_ids
        }

        term_schedules = TermScheduleQueries.generate_valid_class_schedules(
            class_combinations_by_course, class_data_by_course
        )

        parsed_term_schedules = [
            [
                TermScheduleResponseType(course_id=key, classes=val)
                for key, val in term_schedule.items()
            ]
            for term_schedule in term_schedules
        ]

        return parsed_term_schedules

    # Generates class schedules for a given courses
    @staticmethod
    def generate_valid_class_schedules(
        class_combinations_by_course: Dict[str, Course],
        class_data_by_course: Dict[str, Dict[int, Class]],
    ) -> List[Dict[str, List[int]]]:

        course_ids = list(class_combinations_by_course.keys())

        # Uses dynamic programming to generate all possible schedules
        #
        # Base case
        # [{course_id: [section_id ...] ... } ... ]
        dp: List[Dict[str, List[int]]] = [
            {course_ids[0]: schedule}
            for schedule in class_combinations_by_course[course_ids[0]].valid_schedules
        ]

        for current_course_id in course_ids[1:]:
            dp = [
                {**existing_schedule, current_course_id: current_course_classes}
                for existing_schedule in dp  # existing_schedule: {course_id, [section_id ... ] ...}
                for current_course_classes in class_combinations_by_course[
                    current_course_id
                ].valid_schedules  # current_course_classes: [section_id ... ]
                if all(
                    not TermScheduleQueries.courses_overlap(
                        existing_schedule_entry,
                        (current_course_id, current_course_classes),
                        class_data_by_course,
                    )
                    for existing_schedule_entry in existing_schedule.items()  # existing_schedule_entry: (course_id, [section_id ... ])
                )
            ]

        return dp

    @staticmethod
    def courses_overlap(
        course1_schedule: Tuple[int, List[int]],
        course2_schedule: Tuple[int, List[int]],
        class_data_by_course: Dict[str, Dict[int, Class]],
    ) -> bool:
        course1_id, course1_classes = course1_schedule
        course2_id, course2_classes = course2_schedule

        # Ensure course IDs and class lists are ordered consistently
        if course1_id > course2_id:
            course1_id, course2_id = course2_id, course1_id
            course1_classes, course2_classes = course2_classes, course1_classes

        sorted_course1_classes = sorted(course1_classes)
        sorted_course2_classes = sorted(course2_classes)

        # Try to get the result from the database
        try:
            overlap_result = CoursesOverlap.objects.get(
                course1_id=course1_id,
                course2_id=course2_id,
                course1_classes=sorted_course1_classes,
                course2_classes=sorted_course2_classes,
            )
            return overlap_result.result
        except CoursesOverlap.DoesNotExist:
            pass

        # Compute the result if not found in the database
        result = any(
            classes_overlap(
                class_data_by_course[course1_id][section1_id],
                class_data_by_course[course2_id][section2_id],
            )
            for section1_id in course1_classes
            for section2_id in course2_classes
        )

        # Store the result in the database
        CoursesOverlap.objects.create(
            course1_id=course1_id,
            course2_id=course2_id,
            course1_classes=sorted_course1_classes,
            course2_classes=sorted_course2_classes,
            result=result,
        )

        return result
