import { useSelector } from 'react-redux';
import { ServiceUser } from '../../modules/auth/auth-context';
import { StudentPlan } from '../../modules/common/data';
import { RootState } from '../../modules/common/store';

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
