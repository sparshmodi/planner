from ...models import Course
from graphene_django.types import DjangoObjectType


class CourseType(DjangoObjectType):
    class Meta:
        model = Course
        fields = [
            "course_id",
            "subject_code",
            "catalog_number",
            "title",
            "description",
            "requirements_description",
            "classes",
        ]
