from ..types import CourseType
from ...models import Course
import graphene


class CourseQueries(graphene.ObjectType):
    courses = graphene.List(
        CourseType,
        associated_academic_career=graphene.String(),
        subject_code=graphene.String(),
        catalog_number=graphene.String(),
    )

    def resolve_courses(
        root,
        info,
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

        if associated_academic_career:
            queryset = queryset.filter(
                associated_academic_career=associated_academic_career
            )

        if subject_code:
            queryset = queryset.filter(subject_code=subject_code)

        if catalog_number:
            queryset = queryset.filter(catalog_number=catalog_number)

        return queryset
