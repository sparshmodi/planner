# fetch_courses.py

import requests
import logging
from datetime import datetime, time
from django.core.management.base import BaseCommand
from django.conf import settings
from scheduler.models import (
    Course,
    Class,
    ClassSchedule,
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

        courses_ep = f"{uw_api_url}/Courses/{uw_term_code}{'/CS' if settings.DJANGO_DEBUG else ''}"
        response = requests.get(courses_ep, headers=headers)

        if response.status_code != 200:
            logger.error(
                f"Failed to fetch course list from UWaterloo Open API. Response status code: {response.status_code}"
            )
            return

        courses_json = response.json()

        # Fetch class data for each course
        for course_json in courses_json:
            course_id = course_json.get("courseId")
            class_ep = f"{uw_api_url}/ClassSchedules/{uw_term_code}/{course_id}"

            class_response = requests.get(class_ep, headers=headers)

            if class_response.status_code != 200:
                subject_code = course_json.get("subjectCode")
                catalog_number = course_json.get("catalogNumber")
                logger.warning(
                    f"Failed to fetch class data for {subject_code}{catalog_number}. Response status code: {class_response.status_code}"
                )
                continue

            classes_json = class_response.json()

            self.update_or_create_course(course_json, classes_json)

    def update_or_create_course(self, course_json, classes_json):
        course, course_created = Course.objects.get_or_create_or_update(
            unique_fields={
                "course_id": course_json.get("courseId"),
                "term_code": course_json.get("termCode"),
            },
            data={
                "associated_academic_career": course_json.get(
                    "associatedAcademicCareer"
                ),
                "subject_code": course_json.get("subjectCode"),
                "catalog_number": course_json.get("catalogNumber"),
                "title": course_json.get("title"),
                "description": course_json.get("description"),
                "requirements_description": course_json.get("requirementsDescription"),
            },
        )

        if course_created:
            logger.info(
                f"Created new course: {course.subject_code}{course.catalog_number}"
            )
        else:
            logger.info(f"Updated course: {course.subject_code}{course.catalog_number}")

        for class_json in classes_json:
            schedules_json = class_json.get("scheduleData") or []

            class_record, class_created = Class.objects.get_or_create_or_update(
                unique_fields={
                    "associated_course": course,
                    "class_section": class_json.get("classSection"),
                },
                data={
                    "course_component": class_json.get("courseComponent"),
                },
            )

            if class_created:
                logger.info(
                    f"Created new class section: {class_record.class_section} for {course.subject_code}{course.catalog_number}"
                )

            schedule_records = []
            for schedule_json in schedules_json:
                schedule_record, _ = ClassSchedule.objects.get_or_create(
                    associated_class=class_record,
                    schedule_start_date=self._convert_to_datetime(
                        schedule_json.get("scheduleStartDate")
                    ),
                    schedule_end_date=self._convert_to_datetime(
                        schedule_json.get("scheduleEndDate")
                    ),
                    class_meeting_start_time=self._convert_to_time(
                        schedule_json.get("classMeetingStartTime")
                    ),
                    class_meeting_end_time=self._convert_to_time(
                        schedule_json.get("classMeetingEndTime")
                    ),
                    class_meeting_day_pattern_code=schedule_json.get(
                        "classMeetingDayPatternCode"
                    ),
                    class_meeting_week_pattern_code=schedule_json.get(
                        "classMeetingWeekPatternCode"
                    ),
                )
                schedule_records.append(schedule_record)

            curr_schedule_records = list(class_record.schedule_data.all())

            if set(curr_schedule_records) != set(schedule_records):
                class_record.schedule_data.set(schedule_records)
