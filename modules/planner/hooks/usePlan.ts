import { StudentPlan } from '../../common/data';

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
    };
    reader.readAsText(file);
  };

  return {
    exportPlan,
    handleSelectedPlanChange,
  };
}
