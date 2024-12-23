from django.db import models
from django.contrib.postgres.fields import ArrayField
import logging

logger = logging.getLogger("planner")


class BaseModelManager(models.Manager):
    def get_or_create_or_update(self, unique_fields: dict, data: dict):
        """
        Fetch, update if necessary, or create a record based on unique fields.

        Parameters:
        - unique_fields: A dictionary of fields that uniquely identify the record.
        - data: A dictionary of data to set on the record.

        Returns:
        - The record instance and a boolean indicating whether it was created.
        """

        record, created = self.get_or_create(**unique_fields, defaults=data)

        if not created and any(
            getattr(record, field) != value for field, value in data.items()
        ):
            for field, value in data.items():
                setattr(record, field, value)
            record.save()

        return record, created


# Create your models here.
class Course(models.Model):
    course_id = models.CharField(max_length=31, null=True)
    term_code = models.CharField(max_length=7, null=True)
    associated_academic_career = models.CharField(max_length=7, null=True)
    subject_code = models.CharField(max_length=31, null=True)
    catalog_number = models.CharField(max_length=31, null=True)
    title = models.CharField(max_length=255, null=True)
    description = models.TextField(null=True)
    requirements_description = models.TextField(null=True)

    valid_schedules = ArrayField(ArrayField(models.IntegerField()), null=True)

    objects = BaseModelManager()

    @classmethod
    def delete_data(cls):
        cls.objects.all().delete()


class Class(models.Model):
    associated_course = models.ForeignKey(
        Course, on_delete=models.CASCADE, related_name="classes"
    )

    class_section = models.IntegerField()
    course_component = models.CharField(max_length=31)

    objects = BaseModelManager()


class ClassSchedule(models.Model):
    associated_class = models.ForeignKey(
        Class, on_delete=models.CASCADE, related_name="schedule_data"
    )

    schedule_start_date = models.DateField()
    schedule_end_date = models.DateField()
    class_meeting_start_time = models.TimeField()
    class_meeting_end_time = models.TimeField()
    class_meeting_day_pattern_code = models.CharField(max_length=31)
    class_meeting_week_pattern_code = models.CharField(max_length=31)

    objects = BaseModelManager()


class CoursesOverlap(models.Model):
    course1_id = models.IntegerField()
    course2_id = models.IntegerField()
    course1_classes = ArrayField(models.IntegerField())
    course2_classes = ArrayField(models.IntegerField())
    result = models.BooleanField()

    class Meta:
        unique_together = (
            "course1_id",
            "course2_id",
            "course1_classes",
            "course2_classes",
        )
        indexes = [
            models.Index(
                fields=[
                    "course1_id",
                    "course2_id",
                    "course1_classes",
                    "course2_classes",
                ]
            ),
        ]

    @classmethod
    def delete_data(cls):
        cls.objects.all().delete()
