from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import RawCourse
from ..serializers import CourseSerializer


class CourseListView(APIView):
    def get(self, request):
        if request.query_params:
            return Response(
                {"error": "No query parameters expected"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = CourseSerializer(
            RawCourse.objects.filter(associated_academic_career="UG"), many=True
        )
        return Response(serializer.data, status=status.HTTP_200_OK)
