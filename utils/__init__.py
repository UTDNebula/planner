# move this method if we add more utils
def get_hours_from_course(course: str) -> int:
    [_, code] = course.split(" ")

    if not code[1].isdigit():
        raise ValueError("Second digit of course code must be valid digit")

    return int(code[1])

def get_level_from_course(course: str) -> int:
    [_, code] = course.split(" ")

    if not code[0].isdigit():
        raise ValueError("Second digit of course code must be valid digit")

    return int(code[0]) 

def get_course_prefix(course: str) -> str:
    [prefix, _] = course.split(" ")

    # In the future, run this against a map of prefixes
    if not prefix:
        raise ValueError("Invalid prefix")

    return prefix    