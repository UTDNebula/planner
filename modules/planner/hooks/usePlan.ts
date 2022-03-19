import { useRouter } from 'next/router';
import React from 'react';
import { useDispatch, useStore } from 'react-redux';

import { Semester, StudentPlan } from '../../common/data';
import { updatePlan } from '../../redux/userDataSlice';
import { initialPlan } from '../plannerUtils';

/**
 * A utility hook that exposes callbacks to handle manipulating the StudentPlan.
 * This includes StudentPlan imports and exports, as well as modifying its content
 * and persisting changes between sessions.
 */
export function usePlan() {
  // Manages planId
  const [planId, setPlanId] = React.useState('empty-plan');

  const store = useStore();

  const dispatch = useDispatch();

  const router = useRouter();

  // Manages plan state
  const [plan, setPlan] = React.useState<StudentPlan>(initialPlan);

  /**
   * The loadPlan function returns the user plan from an external storage given
   * a planId and updates the plan & planId state inside the usePlan hook.
   * If no plan with a givenId exists, a temporary plan is subsequently returned.
   *
   * @param userPlanId unique identifier for each plan
   * @returns A StudentPlan
   */
  const loadPlan = (userPlanId: string) => {
    const userPlan = fetchPlan(userPlanId);
    setPlan(userPlan);
    setPlanId(userPlanId);
    return userPlan;
  };

  /**
   * The exportPlan function downloads a plan to a user's local machine and is the
   * primary means of downloading a file from the planner.
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
   * The handleSelectedPlanChange function is used to import and parse a plan to
   * pass it to a callback that the planner can use to load a plan into memory.
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

  /**
   * The fetchPlan function returns a StudentPlan from an external storage
   * given a planId.
   *
   * If no such plan exists, redirect the user back to the plans page
   *
   * @param planId unique identifier for each plan
   * @returns a StudentPlan
   */
  function fetchPlan(planId: string): StudentPlan {
    // Make copy of student plan from redux or get default plan if doesn't exist
    const plan: StudentPlan = store.getState().userData.plans[planId] ?? initialPlan;
    if (plan.id !== 'empty-plan') {
      return JSON.parse(JSON.stringify(plan));
    } else {
      // Redirect back to '/app/plans'
      router.push('/app/plans');
      return plan;
    }
  }

  /**
   * The savePlan function saves the StudentPlan to an external storage
   * @param planId unique identifier for each plan
   * @param planState the user's plan
   */
  function savePlan(planId: string, planState: StudentPlan) {
    console.log('Save', planState, 'ID', planId);
    dispatch(updatePlan(planState));
  }

  /**
   * The persistChanges function updates plan when state changes
   * inside the useDraggableItemContainer hook
   * @param data
   */
  const persistChanges = (data: {
    semesters: Record<string, Semester>;
    // allItems: Array<Course>,
  }) => {
    const semesterList = Object.values(data.semesters);

    console.log('Plan', plan);
    const savedPlan = JSON.parse(JSON.stringify(plan));
    savedPlan.semesters = semesterList;
    console.log('SavedPlan', savedPlan);
    // Save plan to redux & in state
    savePlan(planId, savedPlan);
    setPlan(savedPlan);
  };

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
