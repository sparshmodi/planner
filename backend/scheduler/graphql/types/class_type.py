from ...models import Class, ClassSchedule
from graphene_django.types import DjangoObjectType


class ClassScheduleType(DjangoObjectType):
    class Meta:
        model = ClassSchedule
        fields = [
            "schedule_start_date",
            "schedule_end_date",
            "class_meeting_start_time",
            "class_meeting_end_time",
            "class_meeting_day_pattern_code",
            "class_meeting_week_pattern_code",
        ]


class ClassType(DjangoObjectType):
    class Meta:
        model = Class
        fields = ["class_section", "course_component", "schedule_data"]
