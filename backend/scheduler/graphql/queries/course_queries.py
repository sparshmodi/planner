from ..types import CourseType
from ...models import Course
import graphene
import re


class CourseQueries(graphene.ObjectType):
    course = graphene.Field(
        CourseType,
        subject_code=graphene.String(required=True),
        catalog_number=graphene.String(required=True),
    )
    courses = graphene.List(
        CourseType,
        course_ids=graphene.List(graphene.NonNull(graphene.String)),
        associated_academic_career=graphene.String(),
        subject_code=graphene.String(),
        catalog_number=graphene.String(),
    )

    def resolve_course(root, info, subject_code, catalog_number):
        subject_code_pattern = r"^[a-zA-Z]{2,4}$"  # 2-4 letters
        catalog_number_pattern = r"^\d{2,}[a-zA-Z0-9]{0,2}$"  # At least 2 digits, at most 2 alphanumerics at end

        if not (
            re.match(subject_code_pattern, subject_code)
            and re.match(catalog_number_pattern, catalog_number)
        ):
            raise ValueError("Invalid course")

        return Course.objects.get(
            subject_code=subject_code.upper(), catalog_number=catalog_number.upper()
        )

    def resolve_courses(
        root,
        info,
        course_ids=None,
        associated_academic_career=None,
        subject_code=None,
        catalog_number=None,
    ):
        valid_academic_careers = ["UG", "GRD"]

        if (
            associated_academic_career
            and associated_academic_career not in valid_academic_careers
        ):
            raise ValueError(
                f"Invalid academic career: {associated_academic_career}. Must be one of {valid_academic_careers}"
            )

        queryset = Course.objects.all()

        if course_ids:
            queryset = queryset.filter(course_id__in=course_ids)

        if associated_academic_career:
            queryset = queryset.filter(
                associated_academic_career=associated_academic_career
            )

        if subject_code:
            queryset = queryset.filter(subject_code=subject_code)

        if catalog_number:
            queryset = queryset.filter(catalog_number=catalog_number)

        return queryset
