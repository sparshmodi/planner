from .models import Class


def classes_overlap(first_class: Class, second_class: Class) -> bool:
    for schedule_data1 in first_class.schedule_data.all():
        for schedule_data2 in second_class.schedule_data.all():
            try:
                days_match = bool(
                    set(schedule_data1.class_meeting_day_pattern_code)
                    & set(schedule_data2.class_meeting_day_pattern_code)
                )
            except AttributeError:
                days_match = False
            if (
                days_match
                and schedule_data1.class_meeting_start_time
                <= schedule_data2.class_meeting_end_time
                and schedule_data2.class_meeting_start_time
                <= schedule_data1.class_meeting_end_time
            ):
                return True
    return False
