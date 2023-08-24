# Validator

The internals/algorithms of the Planner Validator.

## Overall Design

Because most (if not all) majors at UTD share the same core curriculum,
core validation tends to be quite stable, occuring on the same
set of requirements for each validation request. Unlike the core curriculum, most majors have their own unique twist
on their degree plans. Consequently, validation of major requirements
tends to be a minefield of edge cases.

Validation was originally written with core and major combined (only supporting Bio and CS degrees), but it was quickly disrcovered that many of the unique twists
in major requirements were unable to be modeled with the max-flow problem - and if
they were, it introduced too many complications.

As a result, validation was split into core and major; core validation still using
max-flow and major using a greedy algorithm. Because many majors include a free elective requirement (which is basically a catch-all), major validation relies on the output of core validation.

## Core

- For design details and decisions, read [the original validator design](ORIGINAL_VALIDATOR.md) written by Eric Zhang.
- Core validation uses the max-flow push-relabel algorithm provided by [Google OR-Tools](https://github.com/google/or-tools).
- For general understanding of max-flow: https://www.youtube.com/watch?v=LdOnanfc5TM
- To get a good idea of how push-relabel works: https://www.geeksforgeeks.org/introduction-to-push-relabel-algorithm

What max-flow looks for the "hour splitting" validation case: <br />
<img src="validator-maxflow.png" width="500" />

## Major

A few notable aspects of major degree plans:

- Most degrees consistent mostly of course requirements that only a single course can fulfill.
- Most degrees contain shared logical operators (e.g. OR, AND, SELECT 29 hours from this list).
- Many degrees contain one to two edge cases (e.g. dynamic hours, requirements for courses with prefix, etc.).
- Degrees are UTD are decided on by the faculty with little to no standardization.

As such, flexibility was the #1 consideration in design.

### Representing degrees as a list of requirements

All UTD degree plans are a list of requirements with a list of courses that fulfill them. Each requirement comes with unique attributes (e.g. a list of courses that fulfill the requirement, the number of hours the requirement requires, extra courses it allows, sub-requirements, etc.). For this reason, degrees are written in JSON.

A requirement might look like the following:

```JSON
{
  "matcher": "CourseRequirement",
  "courses": "HIST 1301",
}
```

Each requirement contains a `matcher` field, which maps the value of `matcher` to a class representing the requirement. If the mapping exists, the respective requirement class will be instantiated with the JSON object containing the `matcher` field. Mappings can be found in `validator/major/map.py`. All requirements implemented the [`AbstractRequirement`](https://github.com/UTDNebula/planner/blob/bb9c73c871b70c18c006064269af5a81678cedea/validator/major/requirements/base.py#L12) class, but it is up to the each requirement to implement what fields it accepts from JSON and when it is fulfilled.

Often times a requirement has sub-requirements. This occurs in the case of logical operators:

```JSON
{
  "matcher": "AndRequirement",
  "requirements": [
    {
      "requirement: "CourseRequirement",
      "course": "HIST 1301"
    },
    {
      "requirement: "Requirement",
      "course": "CS 1302"
    }
  ],
}
```

### Greedy approach design and limitations

Whereas in core validation where some courses could fulfill multiple requirements, a key assumption of major validation is that courses always map 1:1 with requirements. This removes the complexity that comes with [course splitting](ORIGINAL_VALIDATOR.md#course-splitting) and allows us to take a greedy approach, evaluating each requirement in isolation.

The simplest greedy approach would be to take each course and attempt to fulfill each requirement, moving on to the next course when either a requirement accepts the course or no requirement accepts the course. It turns out this approach is good enough for our case.

```python
for course in courses:
  for req in requirements:
    if req.attempt_fulfill(course):
      break
```

#### Free electives

UTD defines the free elective requirement as a "catch-all" that accepts any hours unused from core or major. As such, `req.attempt_fulfill` should return `false` if the requirement was already fulfilled, so the course can continue to be evaluated for the free elective requirement. Free electives don't break our original assumption that all courses map 1:1 with requirements because they are evaluated last with unused courses.
