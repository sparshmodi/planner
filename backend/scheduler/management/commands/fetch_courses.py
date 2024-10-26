# fetch_courses.py

import requests
import logging
from datetime import datetime, time
from django.core.management.base import BaseCommand
from django.conf import settings
from scheduler.models import (
    RawCourse,
    RawClass,
    RawClassSchedule,
    CourseClassSchedules,
    CoursesOverlap,
)

logger = logging.getLogger("planner")


class Command(BaseCommand):
    help = "Fetch data from UW API and save it to the database"

    def _convert_to_time(self, date: str) -> time:
        return datetime.strptime(date, "%Y-%m-%dT%H:%M:%S").time()

    def _convert_to_datetime(self, date: str) -> datetime:
        return datetime.strptime(date, "%Y-%m-%dT%H:%M:%S")

    def handle(self, *args, **kwargs):
        uw_api_url = settings.UWATERLOO_API_ENDPOINT
        uw_term_code = settings.UWATERLOO_TERM_CODE
        headers = {"x-api-key": settings.UWATERLOO_API_KEY}

        courses_ep = f"{uw_api_url}/Courses/{uw_term_code}/CS"
        response = requests.get(courses_ep, headers=headers)

        if response.status_code != 200:
            logger.error(
                f"Failed to fetch course list from UWaterloo Open API. Response status code: {response.status_code}"
            )
            return

        courses_data = response.json()

        # Delete the previous data and store the new data
        try:
            RawCourse.delete_data()
            RawClass.delete_data()
            RawClassSchedule.delete_data()
            CourseClassSchedules.delete_data()
            CoursesOverlap.delete_data()
        except:
            print("ERROR: Could not delete previous relational tables")

        # Fetch class data for each course
        for course in courses_data:
            course_id = course.get("courseId")
            class_ep = f"{uw_api_url}/ClassSchedules/{uw_term_code}/{course_id}"

            class_response = requests.get(class_ep, headers=headers)

            if class_response.status_code != 200:
                subject_code = course.get("subjectCode")
                catalog_number = course.get("catalogNumber")
                logger.warning(
                    f"Failed to fetch class data for {subject_code}{catalog_number}. Response status code: {class_response.status_code}"
                )
                continue

            self.save_course(course)
            classes_data = class_response.json()
            for class_data in classes_data:
                self.save_class(class_data)

    def save_course(self, course_data):
        course = RawCourse(
            course_id=course_data.get("courseId"),
            term_code=course_data.get("termCode"),
            associated_academic_career=course_data.get("associatedAcademicCareer"),
            subject_code=course_data.get("subjectCode"),
            catalog_number=course_data.get("catalogNumber"),
            title=course_data.get("title"),
            description=course_data.get("description"),
            requirements_description=course_data.get("requirementsDescription"),
        )
        course.save()

    def save_class(self, class_data):
        schedule_data = class_data.pop("scheduleData", [])

        section, _ = RawClass.objects.get_or_create(
            course_id=class_data["courseId"],
            class_section=class_data["classSection"],
            course_component=class_data["courseComponent"],
        )

        if schedule_data:
            for schedule in schedule_data:
                schedule_instance, _ = RawClassSchedule.objects.get_or_create(
                    schedule_start_date=self._convert_to_datetime(
                        schedule["scheduleStartDate"]
                    ),
                    schedule_end_date=self._convert_to_datetime(
                        schedule["scheduleEndDate"]
                    ),
                    class_section=schedule["classSection"],
                    class_meeting_start_time=self._convert_to_time(
                        schedule["classMeetingStartTime"]
                    ),
                    class_meeting_end_time=self._convert_to_time(
                        schedule["classMeetingEndTime"]
                    ),
                    class_meeting_day_pattern_code=schedule[
                        "classMeetingDayPatternCode"
                    ],
                    class_meeting_week_pattern_code=schedule[
                        "classMeetingWeekPatternCode"
                    ],
                )
                section.schedule_data.add(schedule_instance)

        section.save()
