import React from 'react';
import { Semester, StudentPlan } from '../../common/data';
import DUMMY_PLAN from '../../../data/add_courses.json';

/**
 * A utility hook that exposes callbacks to handle StudentPlan imports and exports.
 *
 * The exportPlan function downloads a plan to a user's local machine and is the
 * primary means of downloading a file from the planner.
 *
 * The handleSelectedPlanChange function is used to import and parse a plan to
 * pass it to a callback that the planner can use to load a plan into memory.
 */
export function usePlan() {
  const [planId, setPlanId] = React.useState('empty-plan');

  // Initial value for plan until data is properly loaded
  const initialPlan: StudentPlan = {
    id: planId,
    title: 'Just a Degree Plan',
    major: 'Computer Science',
    semesters: DUMMY_PLAN,
  };

  // Manage plan state inside hook
  const [plan, setPlan] = React.useState(initialPlan);

  // Loads plan & returns new plan
  const loadPlan = (userPlanId: string) => {
    const userPlan = fetchPlan(userPlanId) ?? initialPlan;
    console.log('what', userPlan);
    setPlan(userPlan);
    setPlanId(userPlanId);
    return userPlan;
  };

  // // Loads in plan once planId is correct
  // React.useEffect(() => {
  //   if (planId !== "loading") {
  //     let userPlan = fetchPlan(planId);
  //     // alert("THIS RAN");
  //     console.log(userPlan);
  //     setPlan(userPlan);
  //   }
  // },[planId]);

  /**
   * Downloads a plan to the user's local machine.
   *
   * @param plan The plan to write to file
   */
  const exportPlan = (plan: StudentPlan) => {
    const planFileContents = JSON.stringify(plan, null, 2);
    const blob = new Blob([planFileContents], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    console.log('Plan file contents', planFileContents);
    if (link.download === undefined) {
      // TODO(planner): Figure out how to gracefully handle lack of API support
      return;
    }
    // Due to how the browser works, we must create an anchor element that
    // downloads a blob containing the file.
    const url = URL.createObjectURL(blob);
    const planFileName =
      plan.title !== ''
        ? `${plan.title} Degree Plan.json`
        : `Nebula Degree Plan ${new Date().toISOString()}.json`;

    link.style.visibility = 'hidden';
    link.setAttribute('download', planFileName);
    link.setAttribute('href', url);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log('Plan downloaded');
  };

  /**
   * Imports a plan from JSON and converts it to a JavaScript object.
   *
   * This only handles inputs that accept one file. Files after the first index
   * (index 0) will be ignored.
   *
   * @param event A form event created on input selection.
   * @param callback A callback function triggered when the input changes.
   */
  const handleSelectedPlanChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    callback: (plan: StudentPlan) => void,
  ) => {
    const file = event.target.files[0];
    console.log('Uploading plan');

    const reader = new FileReader();
    reader.onload = (event) => {
      const plan = event.target.result as string;
      console.log('Uploaded plan:', plan);

      callback(JSON.parse(plan));
      // Update plan
      setPlan(JSON.parse(plan));
    };

    reader.readAsText(file);
  };

  // TODO: Fetch from redux
  function fetchPlan(planId: string): StudentPlan {
    if (typeof window !== 'undefined') {
      const plan = window.localStorage.getItem(planId); // We're just going to assume the plan ID exists
      return JSON.parse(plan);
    }
  }

  // TODO: Save to redux
  function savePlan(planId: string, planState: StudentPlan) {
    console.log('Save', planState, 'ID', planId);
    if (typeof window !== 'undefined') {
      const planJson = JSON.stringify(planState);
      window.localStorage.setItem(planId, planJson);
    }
  }

  // Function that updates plan when state changes in useDraggableItemContainer hook
  const persistChanges = (data: {
    semesters: Record<string, Semester>;
    // allItems: Array<Course>,
  }) => {
    const semesterList = Object.values(data.semesters);
    const savedPlan = JSON.parse(JSON.stringify(plan));
    savedPlan.semesters = semesterList;
    // Save plan to redux & in state
    savePlan(planId, savedPlan);
    setPlan(savedPlan);
  };

  // TESTING
  React.useEffect(() => console.log('SAVE TEST', plan), [plan]);

  return {
    plan,
    loadPlan,
    exportPlan,
    handleSelectedPlanChange,
    usePlan,
    fetchPlan,
    persistChanges,
  };
}
