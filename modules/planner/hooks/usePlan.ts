import { StudentPlan } from '../../common/data';

/**
 * A utility hook that exposes callbacks to handle StudentPlan imports and exports.
 *
 * The exportPlan function downloads a plan to a user's local machine and is the
 * primary means of downloading a file from the planner.
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

  return {
    exportPlan,
  };
}
