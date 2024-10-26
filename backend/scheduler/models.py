from django.db import models
from django.contrib.postgres.fields import ArrayField


# Create your models here.
class RawCourse(models.Model):
    course_id = models.CharField(max_length=31, null=True)
    term_code = models.CharField(max_length=7, null=True)
    associated_academic_career = models.CharField(max_length=7, null=True)
    subject_code = models.CharField(max_length=31, null=True)
    catalog_number = models.CharField(max_length=31, null=True)
    title = models.CharField(max_length=255, null=True)
    description = models.TextField(null=True)
    requirements_description = models.TextField(null=True)

    @classmethod
    def delete_data(cls):
        cls.objects.all().delete()


class RawClassSchedule(models.Model):
    schedule_start_date = models.DateField()
    schedule_end_date = models.DateField()
    class_section = models.IntegerField()
    class_meeting_start_time = models.TimeField()
    class_meeting_end_time = models.TimeField()
    class_meeting_day_pattern_code = models.CharField(
        max_length=31
    )  # Can adjust length as needed
    class_meeting_week_pattern_code = models.CharField(
        max_length=31
    )  # Can djust length as needed

    @classmethod
    def delete_data(cls):
        cls.objects.all().delete()


class RawClass(models.Model):
    course_id = models.CharField(max_length=31)  # Can adjust length as needed
    class_section = models.IntegerField()
    course_component = models.CharField(max_length=31)  # Can adjust length as needed
    schedule_data = models.ManyToManyField(RawClassSchedule)

    @classmethod
    def delete_data(cls):
        cls.objects.all().delete()


class CourseClassSchedules(models.Model):
    course_id = models.CharField(
        max_length=31, primary_key=True
    )  # Can adjust length as needed
    valid_schedules = ArrayField(ArrayField(models.IntegerField()))

    @classmethod
    def delete_data(cls):
        cls.objects.all().delete()


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
