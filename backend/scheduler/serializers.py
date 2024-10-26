# scheduler/serializers.py
from rest_framework import serializers
from .models import RawCourse, RawClass, RawClassSchedule


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = RawCourse
        fields = [
            "course_id",
            "subject_code",
            "catalog_number",
            "title",
            "description",
            "requirements_description",
        ]


class ClassSchedulesSerializer(serializers.Serializer):
    def to_representation(self, instance):
        class RawClassScheduleSerializer(serializers.ModelSerializer):
            class Meta:
                model = RawClassSchedule
                exclude = ["id"]

        class RawClassSerializer(serializers.ModelSerializer):
            schedule_data = RawClassScheduleSerializer(many=True)

            class Meta:
                model = RawClass
                exclude = ["id"]

        return {
            key: [
                RawClassSerializer(instance=raw_instance).data for raw_instance in value
            ]
            for key, value in instance.items()
        }
