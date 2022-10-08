# Degree Validator

Degree validation logic for UTD.  

## File Index

`maxflow.py` contains a basically complete max flow solution, except it doesn't optimize to keep courses from being 
split up. It uses Google OR tools and is very speedy. 

`logic.py` contains a bunch of ramblings for exhaustive search with pruning, but doesn't actually do anything right 
now.  

## Constraint design and limitations

### Representing constraints
Based on Orion, each constraint has an hour requirement and a total # of courses requirement. However, as far as I 
can tell the "number of courses" requirement is useless. So, each constraint can be thought of as a set of rules 
that determine what courses can satisfy that constraint, and the total number of hours that must be used to do so. 

Constraints contain trees of `Matcher` nodes.  

Some leaf nodes:
  - NameList: match course name to a list of possible courses
  - Regex: match course name to regex pattern
  - Level: match course level (usually first digit)
  - Any: returns true

Some non-leaf nodes:
  - And, Or: self-explanatory

Stacking these together makes it pretty robust in determining whether a course is capable of filling a constraint. 

#### Representing electives as constraints
Any constraint can be represented by a comprehensive name list, but this is not very scalable. Instead, electives are 
represented with the "Not" matcher. For example, CS guided electives are "Not" CS preparatory courses "Or" CS core 
courses, while also being ("And") "Level" 3 or 4 CS "Department" classes. 

As seen above, matchers can be re-used as components of other matchers, because everything is a tree :)

One potential optimization is to cache the results of each matcher with each course, so that the same sub-tree does 
not need to be traversed multiple times across different checks. This optimization is left un-implemented because 
the matching algorithm is already quite fast. 

### Constraint groups
We also know that some courses cannot be repeated between constraint groups. For example, a 010 cannot be 
double-dipped as a 090 core, while MATH 2417 _can_ be double-dipped in both the core curriculum and CS curriculum. 
To handle this, break constraints up into "constraint groups", where courses cannot be used to fill more than one 
constraint per constraint group. I'm pretty sure this is how Orion does it, because it separates out all the 
double-dip courses into their own separate constraints from the "CS Preparatory" constraint.

Some examples to illustrate:
  - The set of core classes, major-required courses, guided electives, and free electives
  - The Upper Level Hour Requirement states you must take, in total, 51 upper-level courses. This by itself is a 
    constraint group, because 

## Max flow design and limitations
We want to allocate courses toward constraint groups in such a way that minimizes the number of unused courses. This 
optimization problem can be done with max flow. 

here is a pretty good writeup of how to re-think course allocation as maximum flow in a bipartite graph: 
https://www.zirayhao.com/posts/course-match

### Course Splitting

However, Dartmouth works on a trimester system and all of their courses are 1 hour. So, they don't need to worry 
about splitting course hours between constraints. 

> Note: Splitting is different from double-dipping. What I'm saying here is you can apply 1 hour from CS 2417 to 
> one constraint, and 3 hours to a different one. 

There's no hard rule on how much we can split courses, so the easy solution is to split each course into mutiple 
1-hour courses with the same properties. Then, simplify the network by joining equivalent nodes. This gives you the 
same graph, but with source links having capacity equivalent to the number of credit hours in each course. 

> Todo: draw a diagram of what this looks like

However, optimal solutions to this max flow problem have no concept of wanting to keep courses together. Imagine a 
situation where courses A and B are both 2 hours, while constraints X and Y can each be filled by either. You can 
assign A to X and B to Y, A to Y and B to X, or _half of each course to each constraint_! Obviously this last one is 
kind of weird, even though it is technically optimal.  

We can introduce a second optimization: Find the minimal subgraph of the maximum flow graph which still acheives the 
same flow. In other words, maximiuze the course-constraint edges with 0 flow. In other words, add a constant fixed cost 
to each course-constraint edge used in the solution, and minimize the flow cost.  

Unfortunately, solving the Minimum-Edge Cost Flow (MECF) problem is NP-hard, even for bipartite matching with 0/1 
costs. More work needs to be done to optimize this second problem in an efficient manner.  

