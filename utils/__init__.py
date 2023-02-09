# move this method if we add more utils
def get_hours_from_course(course: str) -> int:
    [_, code] = course.split(" ")

    if not code[1].isdigit():
        raise ValueError("Second digit of course code must be valid digit")

    return int(code[1])
