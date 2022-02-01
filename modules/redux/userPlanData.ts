import { useSelector } from 'react-redux';
import { ServiceUser } from '../auth/auth-context';
import { StudentPlan } from '../common/data';
import { RootState } from './store';

export default function useUserPlanData(user: ServiceUser): UserPlanData {
  const { plans } = useSelector((state: RootState) => state.userData);
  const planIds = Object.keys(plans);

  console.log('Using user data: ', user);

  return {
    plans,
    planIds,
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
