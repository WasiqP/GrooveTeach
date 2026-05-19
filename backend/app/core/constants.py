from enum import StrEnum


class ClassType(StrEnum):
    SINGLE_SUBJECT = "single-subject"
    MULTI_SUBJECT = "multi-subject"


class EducationLevel(StrEnum):
    PRIMARY = "primary"
    SECONDARY = "secondary"
    COLLEGE = "college"
    UNIVERSITY = "university"
    OTHER = "other"


class TaskVisibility(StrEnum):
    PUBLIC = "public"
    CLASS_ONLY = "class-only"


class AttendanceStatus(StrEnum):
    PRESENT = "present"
    LATE = "late"
    ABSENT = "absent"


class HomeworkStatus(StrEnum):
    ASSIGNED = "assigned"
    SUBMITTED = "submitted"
    GRADED = "graded"
    OVERDUE = "overdue"
