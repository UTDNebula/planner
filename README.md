# Degree Validator

Degree validation logic for UTD.  

`maxflow.py` contains a basically complete max flow solution, except it doesn't optimize to keep courses from being 
split up. It uses Google OR tools and is very speedy. 

`logic.py` contains a bunch of ramblings for exhaustive search with pruning, but doesn't actually do anything right 
now.  