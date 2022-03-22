/**
 * A collection of courses separated into groups used to track degree plan requirements.
 */
export interface CoursePlan {
  id: string;
  title: string;
  source: string;
  groups: {
    [groupId: string]: PlanGroup;
  };
  category: {
    [groupId: string]: PlanGroup;
  };
}

export type PlanGroup = {
  id: string;
  title: string;
  category: string;
};

export type PlanCategory = {
  id: string;
  title: string;
};

/**
 * Retrieves a CoursePlan with the given ID.
 *
 * @param id The unique identifier for the plan to fetch
 * @param year The catalog year from which to fetch the plan
 */
export async function loadCoursePlan(
  id: string,
  year = 2020
): Promise<CoursePlan> {
  const coursePlans: CoursePlan[] = await import(
    `../../data/${year}-course-plans.json`
  );
  const result = coursePlans.find((plan) => plan.id === id);
  if (result) {
    return result;
  } else {
    throw new Error("Invalid course plan ID");
  }
}
