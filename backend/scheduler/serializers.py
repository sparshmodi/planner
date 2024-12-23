# scheduler/serializers.py
from rest_framework import serializers
from .models import Course, Class, ClassSchedule


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
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
        class ClassScheduleSerializer(serializers.ModelSerializer):
            class Meta:
                model = ClassSchedule
                exclude = ["id"]

        class ClassSerializer(serializers.ModelSerializer):
            schedule_data = ClassScheduleSerializer(many=True)

            class Meta:
                model = Class
                exclude = ["id"]

        return {
            key: [ClassSerializer(instance=raw_instance).data for raw_instance in value]
            for key, value in instance.items()
        }
