from typing import Any

from core.matchers import *
from course import Course
from core.requirement import Requirement


class MockData:
    @staticmethod
    def input_to_api_json(
        degree: str, courses: list[Course], bypasses: list[SingleAssignment]
    ) -> dict[str, Any]:
        return {
            "degree": degree,
            "courses": [c.to_json() for c in courses],
            "bypasses": [b.to_json() for b in bypasses],
        }

    @staticmethod
    def get_unrealistic_courses_1() -> tuple[list[Course], list[SingleAssignment]]:
        course_names = [
            "RHET 1302",
            "ECS 3390",
            "MATH 2413",
            "MATH 2417",
            "PHYS 2325",
            "PHYS 2326",
            "GOVT 2305",
            "GOVT 2306",
            "MATH 2413",
            "MATH 2417",
            "MATH 2419",
            "PHYS 2125",
            "ECS 1100",
            "CS 1200",
            "CS 1136",
            "CS 1336",
            "CS 1337",
            "CS 2305",
            "CS 2336",
            "CS 2340",
            "MATH 2413",
            "MATH 2414",
            "MATH 2417",
            "MATH 2419",
            "MATH 2418",
            "PHYS 2125",
            "PHYS 2126",
            "PHYS 2325",
            "PHYS 2326",
            "CS 3162",
            "CS 3305",
            "CS 3341",
            "CS 3345",
            "CS 3354",
            "CS 3377",
            "ECS 3390",
            "CS 4141",
            "CS 4337",
            "CS 4341",
            "CS 4347",
            "CS 4348",
            "CS 4349",
            "CS 4384",
            "CS 4485",
            "CS 4314",
            "CS 4315",
            "CS 4334",
            "CS 4336",
            "CS 4352",
            "CS 4353",
            "CS 4361",
            "CS 4365",
            "CS 4375",
            "CS 4376",
            "CS 4386",
            "CS 4389",
            "CS 4390",
            "CS 4391",
            "CS 4392",
            "CS 4393",
            "CS 4394",
            "CS 4395",
            "CS 4396",
            "CS 4397",
            "CS 4398",
            "CS 4399",
            "EE 4325",
            "SE 4351",
            "SE 4352",
            "SE 4367",
            "SE 4381",
            "ECS 1100",
            "CS 2305",
            "CS 2340",
            "CS 3305",
            "CS 3341",
            "CS 3345",
            "CS 3354",
            "CS 4141",
            "CS 4337",
            "CS 4341",
            "CS 4348",
            "CS 4349",
            "CS 4384",
            "CS 4485",
            "CS 1337",
            "CS 2305",
            "CS 2336",
            "CS 3305",
            "CS 3345",
            "CS 3354",
            "CS 4390",
            "CS 1337",
            "CS 2305",
            "CS 2336",
            "CS 3305",
            "CS 3345",
            "CS 4347",
            "CS 4348",
            "CS 4389",
            "CS 4393",
            "CS 4398",
            "CS 4389",
            "CS 4393",
            "CS 4398",
        ]
        courses = [Course.from_name(c) for c in set(course_names)]
        courses.append(Course("ENGL 1301", hours=3))

        bypasses = [SingleAssignment("ENGL 1301", "Core - Communication (010)", 3)]

        return courses, bypasses

    @staticmethod
    def get_real_courses_ezhang() -> tuple[list[Course], list[SingleAssignment]]:
        course_names = [
            "CS 1200",
            "CS 2336",
            "CS 2340",
            "CS 3341",
            "ECS 1100",
            "AMS 2341",
            "UNIV 1010",
            "CS 3305",
            "CS 4384",
            "CS 3345",
            "ECS 3390",
            "CS 4337",
            "CS 3377",
            "CS 3354",
            "CS 4348",
            "CS 4349",
            "CS 4375",
            "AHST 2331",
            "CS 4390",
            "CS 4341",
            "CS 4141",
            "CS 4485",
            "CS 3162",
            "CS 4365",
            "CS 4V98",
            "CS 6378",
            "CS 6360",
        ]
        courses = [Course.from_name(c) for c in set(course_names)]

        bypasses = [SingleAssignment("CS 6360", "Major Core Courses", 3)]

        return courses, bypasses

    @staticmethod
    def get_real_courses_sguan() -> tuple[list[Course], list[SingleAssignment]]:
        course_names = [
            "CHEM 1405",
            "CS 1336",
            "CS 1337",
            "CS 2305",
            "CS 2336",
            "ECON 2301",
            "ECON 2302",
            "GOVT 2305",
            "HIST 1301",
            "HIST 1302",
            "MATH 2413",
            "MATH 2414",
            "MATH 2415",
            "MATH 2418",
            "MATH 2420",
            "MUSI 1306",
            "PHIL 1306",
            "PHYS 2125",
            "PHYS 2325",
            "RHET 1302",
            "CS 1200",
            "CS 3341",
            "CS 3345",
            "ECS 1100",
            "GOVT 2306",
            "MATH 3323",
            "MUSI 3120",
            "UNIV 1010",
            "CS 2340",
            "CS 3305",
            "CS 3377",
            "CS 4365",
            "PHYS 2126",
            "PHYS 2326",
            "CS 4347",
            "CS 4348",
            "CS 3162",
            "CS 3354",
            "CS 4141",
            "CS 4337",
            "CS 4341",
            "CS 4384",
            "ECS 3390",
            "CS 4349",
            "CS 4371",
            "CS 4375",
            "CS 4485",
            "CS 4390",
        ]
        courses = [Course.from_name(c) for c in set(course_names)]

        bypasses = [
            SingleAssignment("CS 4390", "Computer Science Preparatory Courses", 1)
        ]

        return courses, bypasses

    @staticmethod
    def get_real_courses_missing_physics() -> (
        tuple[list[Course], list[SingleAssignment]]
    ):
        course_names = [
            "UNIV 1010",
            "RHET 1302",
            "GOVT 2305",
            "GOVT 2306",
            "HIST 1301",
            "MATH 1314",
            "MATH 2412",
            "CS 1336",
            "CS 1337",
            "CS 1136",
            "ECS 1100",
            "CS 1200",
            "MATH 2413",
            "HUMA 1301",
            "MUSI 1306",
            "HIST 1302",
            "CS 2305",
            "CS 2336",
            "PSY 2301",
            "MATH 2414",
            "PHYS 2325",
            "PHYS 2125",
            "CS 2340",
            "CS 3305",
            "MATH 2418",
            "CS 3341",
            "CS 3345",
            "CS 3377",
            "ECS 3390",
            "CS 3341",
            "CS 3354",
            "CS 4141",
            "CS 4341",
            "CS 4337",
            "CS 3162",
            "CS 4349",
            "CS 4348",
            "CS 4347",
            "CS 4384",
            "CS 4485",
        ]
        courses = [Course.from_name(c) for c in set(course_names)]

        courses.append(Course("Guided Elective 1", 4, 3, "CS"))
        courses.append(Course("Guided Elective 2", 4, 3, "CS"))
        courses.append(Course("Guided Elective 3", 4, 3, "CS"))
        courses.append(Course("Free Electives Placeholder (10 hrs)", hours=10))

        return courses, []

    @staticmethod
    def get_mock_courses() -> list[str]:
        NOT_GRADUATEABLE_COURSES = [
            "ATCM 2340",
            "COMM 1311",
            "MATH 1306",
            "BIOL 1300",
            "BIOL 1318",
            "AMS 2300",
            "AHST 1303",
            "HIST 1301",
            "HIST 1302",
            "GOVT 2306",
            "GOVT 2305",
            "BA 1310",
            "ARAB 1311",
            "ECS 1100",
            "CS 1200",
            "CS 1136",
            "CS 1336",
            "CS 1337",
            "CS 2305",
            "CS 2336",
            "CS 2340",
            "MATH 2413",
            "MATH 2414",
            "MATH 2418",
            "PHYS 2125",
            "PHYS 2126",
            "PHYS 2325",
            "PHYS 2326",
            "CS 3162",
            "CS 3305",
            "CS 3341",
            "CS 3345",
            "CS 3354",
            "CS 3377",
            "ECS 3390",
            "CS 4141",
            "CS 4337",
            "CS 4341",
            "CS 4347",
            "CS 4348",
            "CS 4349",
            "CS 4384",
            "CS 4485",
            # Major Guided Electives
            "CS 4314",
            "CS 4315",
            "CS 4334",
            # Free Electives
            "ABC 9999",
            "DEF 9199",
        ]
        return NOT_GRADUATEABLE_COURSES

    @staticmethod
    def get_cs_reqs() -> list[tuple[str, list[Requirement]]]:
        print("WARNING: using outdated hard-coded constraints!")
        computer_science_preparatory_courses_matcher = OrMatcher(
            NameListMatcher(
                "CS 1136",
                "CS 1336",
                "CS 1337",
                "CS 2305",
                "CS 2340",
                "MATH 2418",
                "PHYS 2125",
                "PHYS 2126",
                "ECS 1100",
                "CS 1200",
            ),
            OrMatcher(
                NameListMatcher("CS 2336"),
                NameListMatcher("CS 2337"),
            ),
            OrMatcher(
                NameListMatcher("MATH 2413"),
                NameListMatcher("MATH 2417"),
            ),
            OrMatcher(
                NameListMatcher("MATH 2414"),
                NameListMatcher("MATH 2419"),
            ),
            OrMatcher(
                NameListMatcher("PHYS 2325"),
                NameListMatcher("PHYS 2421"),
            ),
            OrMatcher(
                NameListMatcher("PHYS 2326"),
                NameListMatcher("PHYS 2422"),
            ),
        )

        major_core_courses_matcher = NameListMatcher(
            "CS 3305",
            "CS 4337",
            "CS 4349",
            "CS 4384",
            "CS 4485",
            "CS 3341",
            "CS 3345",
            "CS 3354",
            "CS 4141",
            "CS 4348",
            "CS 4341",
            "CS 3377",
            "CS 4347",
            "CS 3162",
        )

        free_electives_matcher = NotMatcher(
            OrMatcher(
                computer_science_preparatory_courses_matcher, major_core_courses_matcher
            )
        )

        major_guided_electives_matcher = AndMatcher(
            LevelMatcher(4), DepartmentMatcher("CS"), free_electives_matcher
        )

        lone_reqs = [
            Requirement("Upper Level Hour Requirement", 51, LevelMatcher(3, 4)),
            Requirement("Minimum Cumulative Hours", 124, AnyMatcher()),
        ]

        cs_reqs = [
            Requirement(
                "Computer Science Preparatory Courses",
                39,
                computer_science_preparatory_courses_matcher,
            ),
            Requirement("Major Core Courses", 42, major_core_courses_matcher),
            Requirement("Major Guided Electives", 9, major_guided_electives_matcher),
            Requirement("Free Electives", 10, AnyMatcher()),
        ]

        cores = [
            Requirement(
                "Core - Communication (010)",
                6,
                NameListMatcher(
                    "ATCM 2340",
                    "COMM 1311",
                    "COMM 1315",
                    "ECS 3390",
                    "RHET 1302",
                    "RHET 2302",
                ),
            ),
            Requirement(
                "Core - Mathematics (020)",
                3,
                NameListMatcher(
                    "MATH 1306",
                    "MATH 1314",
                    "MATH 1316",
                    "MATH 1325",
                    "MATH 2306",
                    "MATH 2312",
                    "MATH 2413",
                    "MATH 2414",
                    "MATH 2415",
                    "MATH 2417",
                    "PHIL 2303",
                    "PSY 2317",
                    "STAT 1342",
                    "STAT 2332",
                ),
            ),
            Requirement(
                "Core - Life and Physical Sciences (030)",
                6,
                NameListMatcher(
                    "BIOL 1300",
                    "BIOL 1318",
                    "BIOL 2311",
                    "BIOL 2312",
                    "BIOL 2350",
                    "CGS 2301",
                    "CHEM 1311",
                    "CHEM 1312",
                    "CHEM 1315",
                    "CHEM 1316",
                    "ENVR 2302",
                    "GEOG 2302",
                    "GEOS 1303",
                    "GEOS 1304",
                    "GEOS 2302",
                    "GEOS 2310",
                    "GEOS 2321",
                    "GEOS 2332",
                    "GEOS 2333",
                    "GEOS 2409",
                    "ISNS 2359",
                    "ISNS 2367",
                    "ISNS 2368",
                    "NATS 1311",
                    "NATS 2330",
                    "NATS 2333",
                    "PHIL 2304",
                    "PHYS 1301",
                    "PHYS 1302",
                    "PHYS 2125",
                    "PHYS 2325",
                    "PHYS 2326",
                    "PHYS 2421",
                    "PHYS 2422",
                    "PSY 2364",
                ),
            ),
            Requirement(
                "Core - Language, Philosophy and Culture (040)",
                3,
                NameListMatcher(
                    "AMS 2300",
                    "AMS 2341",
                    "ATCM 2300",
                    "FILM 1303",
                    "HIST 2340",
                    "HIST 2341",
                    "HIST 2350",
                    "HIST 2360",
                    "HIST 2370",
                    "HUMA 1301",
                    "LIT 1301",
                    "LIT 2322",
                    "LIT 2329",
                    "LIT 2331",
                    "PHIL 1301",
                    "PHIL 1305",
                    "PHIL 1306",
                    "PHIL 2316",
                    "PHIL 2317",
                    "RELS 1325",
                ),
            ),
            Requirement(
                "Core - Creative Arts (050)",
                3,
                NameListMatcher(
                    "AHST 1303",
                    "AHST 1304",
                    "AHST 2331",
                    "ARTS 1301",
                    "DANC 1305",
                    "DANC 1310",
                    "FILM 2332",
                    "MUSI 1306",
                    "MUSI 2321",
                    "MUSI 2322",
                    "PHIL 1307",
                    "THEA 1310",
                ),
            ),
            Requirement(
                "Core - American History (060)",
                6,
                NameListMatcher(
                    "HIST 1301",
                    "HIST 1302",
                    "HIST 2301",
                    "HIST 2330",
                    "HIST 2381",
                    "HIST 2384",
                ),
            ),
            Requirement(
                "Core - Government/Political Science (070)",
                6,
                NameListMatcher("GOVT 2107", "GOVT 2305", "GOVT 2306"),
            ),
            Requirement(
                "Core - Social and Behavioral Sciences (080)",
                3,
                NameListMatcher(
                    "BA 1310",
                    "BA 1320",
                    "CLDP 2314",
                    "CRIM 1301",
                    "CRIM 1307",
                    "ECON 2301",
                    "ECON 2302",
                    "GEOG 2303",
                    "GST 2300",
                    "PA 2325",
                    "PSY 2301",
                    "PSY 2314",
                    "SOC 1301",
                    "SOC 2300",
                    "SOC 2320",
                ),
            ),
            Requirement(
                "Core - Component Area Option (090)",
                6,
                NameListMatcher(
                    "ARAB 1311",
                    "ARAB 1312",
                    "ARAB 2311",
                    "ARAB 2312",
                    "ARHM 2340",
                    "ARHM 2342",
                    "ARHM 2343",
                    "ARHM 2344",
                    "CHEM 1111",
                    "CHEM 1115",
                    "CHIN 2311",
                    "CHIN 2312",
                    "EPPS 2301",
                    "EPPS 2302",
                    "FREN 1311",
                    "FREN 1312",
                    "FREN 2311",
                    "FREN 2312",
                    "GERM 1311",
                    "GERM 1312",
                    "GERM 2311",
                    "GERM 2312",
                    "JAPN 1311",
                    "JAPN 1312",
                    "JAPN 2311",
                    "JAPN 2312",
                    "KORE 2311",
                    "KORE 2312",
                    "MATH 1326",
                    "MATH 2419",
                    "SPAN 1311",
                    "SPAN 1312",
                    "SPAN 2310",
                    "SPAN 2311",
                    "SPAN 2312",
                    "ATCM 2340",
                    "COMM 1311",
                    "COMM 1315",
                    "RHET 1302",
                    "MATH 1306",
                    "MATH 1314",
                    "MATH 1316",
                    "MATH 1325",
                    "MATH 2306",
                    "MATH 2312",
                    "MATH 2413",
                    "MATH 2414",
                    "MATH 2415",
                    "MATH 2417",
                    "PHIL 2303",
                    "PSY 2317",
                    "STAT 1342",
                    "STAT 2332",
                    "BIOL 1300",
                    "BIOL 2311",
                    "BIOL 2312",
                    "BIOL 2350",
                    "CGS 2301",
                    "CHEM 1311",
                    "CHEM 1312",
                    "CHEM 1315",
                    "CHEM 1316",
                    "ENVR 2302",
                    "GEOG 2302",
                    "GEOS 1303",
                    "GEOS 1304",
                    "GEOS 2302",
                    "GEOS 2310",
                    "GEOS 2321",
                    "GEOS 2332",
                    "GEOS 2333",
                    "GEOS 2409",
                    "ISNS 2359",
                    "ISNS 2367",
                    "ISNS 2368",
                    "NATS 1311",
                    "NATS 2330",
                    "NATS 2333",
                    "PHIL 2304",
                    "PHYS 1301",
                    "PHYS 1302",
                    "PHYS 2125",
                    "PHYS 2325",
                    "PHYS 2326",
                    "PHYS 2421",
                    "PHYS 2422",
                    "PSY 2364",
                    "ATCM 2300",
                    "FILM 1303",
                    "HIST 2340",
                    "HIST 2341",
                    "HIST 2350",
                    "HIST 2360",
                    "HIST 2370",
                    "HUMA 1301",
                    "LIT 1301",
                    "LIT 2322",
                    "LIT 2329",
                    "LIT 2331",
                    "PHIL 1301",
                    "PHIL 1305",
                    "PHIL 1306",
                    "PHIL 2316",
                    "PHIL 2317",
                    "RELS 1325",
                    "AHST 1303",
                    "AHST 1304",
                    "AHST 2331",
                    "ARTS 1301",
                    "DANC 1305",
                    "DANC 1310",
                    "FILM 2332",
                    "MUSI 1306",
                    "MUSI 2321",
                    "PHIL 1307",
                    "THEA 1310",
                    "HIST 1301",
                    "HIST 1302",
                    "HIST 2301",
                    "HIST 2330",
                    "HIST 2381",
                    "HIST 2384",
                    "BA 1310",
                    "BA 1320",
                    "CLDP 2314",
                    "ECON 2301",
                    "ECON 2302",
                    "PSY 2301",
                    "PSY 2314",
                ),
            ),
        ]

        return [(req.name, [req]) for req in lone_reqs] + [
            ("Cores + CS Reqs", cores + cs_reqs)
        ]

    @staticmethod
    def core_090_matcher() -> NameListMatcher:
        core_090 = [
            "ARAB1311",
            "ARAB1312",
            "ARAB2311",
            "ARAB2312",
            "ARHM2340",
            "ARHM2342",
            "ARHM2343",
            "ARHM2344",
            "CHEM1111",
            "CHEM1115",
            "CHIN2311",
            "CHIN2312",
            "EPPS2301",
            "EPPS2302",
            "FREN1311",
            "FREN1312",
            "FREN2311",
            "FREN2312",
            "GERM1311",
            "GERM1312",
            "GERM2311",
            "GERM2312",
            "JAPN1311",
            "JAPN1312",
            "JAPN2311",
            "JAPN2312",
            "KORE2311",
            "KORE2312",
            "MATH1326",
            "MATH2419",
            "SPAN1311",
            "SPAN1312",
            "SPAN2310",
            "SPAN2311",
            "SPAN2312",
            "ATCM2340",
            "COMM1311",
            "COMM1315",
            "RHET1302",
            "MATH1306",
            "MATH1314",
            "MATH1316",
            "MATH1325",
            "MATH2306",
            "MATH2312",
            "MATH2413",
            "MATH2414",
            "MATH2415",
            "MATH2417",
            "PHIL2303",
            "PSY2317",
            "STAT1342",
            "STAT2332",
            "BIOL1300",
            "BIOL2311",
            "BIOL2312",
            "BIOL2350",
            "CGS2301",
            "CHEM1311",
            "CHEM1312",
            "CHEM1315",
            "CHEM1316",
            "ENVR2302",
            "GEOG2302",
            "GEOS1303",
            "GEOS1304",
            "GEOS2302",
            "GEOS2310",
            "GEOS2321",
            "GEOS2332",
            "GEOS2333",
            "GEOS2409",
            "ISNS2359",
            "ISNS2367",
            "ISNS2368",
            "NATS1311",
            "NATS2330",
            "NATS2333",
            "PHIL2304",
            "PHYS1301",
            "PHYS1302",
            "PHYS2125",
            "PHYS2325",
            "PHYS2326",
            "PHYS2421",
            "PHYS2422",
            "PSY2364",
            "ATCM2300",
            "FILM1303",
            "HIST2340",
            "HIST2341",
            "HIST2350",
            "HIST2360",
            "HIST2370",
            "HUMA1301",
            "LIT1301",
            "LIT2322",
            "LIT2329",
            "LIT2331",
            "PHIL1301",
            "PHIL1305",
            "PHIL1306",
            "PHIL2316",
            "PHIL2317",
            "RELS1325",
            "AHST1303",
            "AHST1304",
            "AHST2331",
            "ARTS1301",
            "DANC1305",
            "DANC1310",
            "FILM2332",
            "MUSI1306",
            "MUSI2321",
            "PHIL1307",
            "THEA1310",
            "HIST1301",
            "HIST1302",
            "HIST2301",
            "HIST2330",
            "HIST2381",
            "HIST2384",
            "BA1310",
            "BA1320",
            "CLDP2314",
            "ECON2301",
            "ECON2302",
            "PSY2301",
            "PSY2314",
        ]
        core_090_matcher = NameListMatcher(*core_090)
        return core_090_matcher

    @staticmethod
    def core_010_matcher() -> NameListMatcher:
        core_010 = [
            "ATCM2340",
            "COMM1311",
            "COMM1315",
            "ECS3390",
            "RHET1302",
            "RHET2302",
        ]
        core_010_matcher = NameListMatcher(*core_010)
        return core_010_matcher

    @staticmethod
    def core_020_matcher() -> NameListMatcher:
        core_020 = [
            "MATH1306",
            "MATH1314",
            "MATH1316",
            "MATH1325",
            "MATH2306",
            "MATH2312",
            "MATH2413",
            "MATH2414",
            "MATH2415",
            "MATH2417",
            "PHIL2303",
            "PSY2317",
            "STAT1342",
            "STAT2332",
        ]
        core_020_matcher = NameListMatcher(*core_020)
        return core_020_matcher

    @staticmethod
    def core_030_matcher() -> NameListMatcher:
        core_030 = [
            "BIOL1300",
            "BIOL1318",
            "BIOL2311",
            "BIOL2312",
            "BIOL2350",
            "CGS2301",
            "CHEM1311",
            "CHEM1312",
            "CHEM1315",
            "CHEM1316",
            "ENVR2302",
            "GEOG2302",
            "GEOS1303",
            "GEOS1304",
            "GEOS2302",
            "GEOS2310",
            "GEOS2321",
            "GEOS2332",
            "GEOS2333",
            "GEOS2409",
            "ISNS2359",
            "ISNS2367",
            "ISNS2368",
            "NATS1311",
            "NATS2330",
            "NATS2333",
            "PHIL2304",
            "PHYS1301",
            "PHYS1302",
            "PHYS2125",
            "PHYS2325",
            "PHYS2326",
            "PHYS2421",
            "PHYS2422",
            "PSY2364",
        ]
        core_030_matcher = NameListMatcher(*core_030)
        return core_030_matcher

    @staticmethod
    def core_040_matcher() -> NameListMatcher:
        core_040 = [
            "AMS2300",
            "AMS2341",
            "ATCM2300",
            "FILM1303",
            "HIST2340",
            "HIST2341",
            "HIST2350",
            "HIST2360",
            "HIST2370",
            "HUMA1301",
            "LIT1301",
            "LIT2322",
            "LIT2329",
            "LIT2331",
            "PHIL1301",
            "PHIL1305",
            "PHIL1306",
            "PHIL2316",
            "PHIL2317",
            "RELS1325",
        ]
        core_040_matcher = NameListMatcher(*core_040)
        return core_040_matcher

    @staticmethod
    def core_050_matcher() -> NameListMatcher:
        core_050 = [
            "AHST1303",
            "AHST1304",
            "AHST2331",
            "ARTS1301",
            "DANC1305",
            "DANC1310",
            "FILM2332",
            "MUSI1306",
            "MUSI2321",
            "MUSI2322",
            "PHIL1307",
            "THEA1310",
        ]
        core_050_matcher = NameListMatcher(*core_050)
        return core_050_matcher

    @staticmethod
    def core_060_matcher() -> NameListMatcher:
        core_060 = [
            "HIST1301",
            "HIST1302",
            "HIST2301",
            "HIST2330",
            "HIST2381",
            "HIST2384",
        ]
        core_060_matcher = NameListMatcher(*core_060)
        return core_060_matcher

    @staticmethod
    def core_070_matcher() -> NameListMatcher:
        core_070 = ["GOVT2107", "GOVT2305", "GOVT2306"]
        core_070_matcher = NameListMatcher(*core_070)
        return core_070_matcher

    @staticmethod
    def core_080_matcher() -> NameListMatcher:
        core_080 = [
            "BA1310",
            "BA1320",
            "CLDP2314",
            "CRIM1301",
            "CRIM1307",
            "ECON2301",
            "ECON2302",
            "GEOG2303",
            "GST2300",
            "PA2325",
            "PSY2301",
            "PSY2314",
            "SOC1301",
            "SOC2300",
            "SOC2320",
        ]
        core_080_matcher = NameListMatcher(*core_080)
        return core_080_matcher
