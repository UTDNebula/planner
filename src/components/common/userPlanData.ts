import { useSelector } from 'react-redux';
import { StudentPlan } from '../../app/data';
import { RootState } from '../../app/store';
import { ServiceUser } from '../../features/auth/auth-context';

export default function useUserPlanData(user: ServiceUser): UserPlanData {
  const { plans, planIds } = useSelector((state: RootState) => state.userData);

  return {
    planIds,
    plans,
  };
}

type UserPlanData = {
  /**
   * IDs for all of a user's StudentPlans.
   */
  planIds: string[];
  /**
   * A mapping of plan IDs to StudentPlans.
   */
  plans: {
    [key: string]: StudentPlan;
  };
};
