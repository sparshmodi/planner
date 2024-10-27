# compute_class_schedules.py

from django.core.management.base import BaseCommand
from scheduler.models import Course
from scheduler.utils import classes_overlap
from itertools import groupby, product, combinations
from typing import List


class Command(BaseCommand):
    help = "Fetch data from database and computed its valid schedules"

    def handle(self, *args, **kwargs):
        all_courses = Course.objects.all()

        for course in all_courses:
            all_classes = course.classes.all()
            valid_schedules = self.generate_valid_class_schedules(all_classes)

            course.valid_schedules = valid_schedules
            course.save()

    # Generates class schedules for a given single course
    def generate_valid_class_schedules(self, class_list):
        class_list = sorted(class_list, key=lambda x: x.course_component)
        subgroups = {}
        for key, group in groupby(class_list, key=lambda x: x.course_component):
            subgroups[key] = list(group)

        all_combinations = product(*subgroups.values())
        filtered_combinations: List[List[int]] = []
        for combination in all_combinations:
            if all(
                not classes_overlap(class1, class2)
                for class1, class2 in combinations(combination, 2)
            ):
                filtered_combinations.append(
                    [class_data.class_section for class_data in combination]
                )
        return filtered_combinations
