import { useSelector } from 'react-redux';
import { StudentPlan } from '../../../src/app/data';
import { RootState } from '../../../src/app/store';
import { ServiceUser } from '../../../src/features/auth/auth-context';

export default function useUserPlanData(user: ServiceUser): UserPlanData {
  const { plans, planIds } = useSelector((state: RootState) => state.userData);

  console.log('Using user data: ', user);

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
