import { trpc } from '@/utils/trpc';
import { useRouter } from 'next/router';
import { DegreeValidation, Plan } from './types';

export interface usePlanProps {
  planId: string;
}

export interface usePlanReturn {
  plan?: Plan;
  validation?: DegreeValidation;
prereqData?: Map<string, boolean>;
  isLoading: boolean;
  handlePlanDelete: () => Promise<boolean>;
}

const usePlan = ({ planId }: usePlanProps): usePlanReturn => {
  const utils = trpc.useContext();
  const router = useRouter();
  const { data: planData, isLoading } = trpc.plan.getPlanById.useQuery(planId);
  const { data: validationData, isLoading: validationLoading } = trpc.validator.validatePlan.useQuery(planId);

  // useMutation primitives
  const deletePlan = trpc.plan.deletePlanById.useMutation({
    async onSuccess() {
      await utils.user.getUser.invalidate();
    },
  });

  const handlePlanDelete = async () => {
    return deletePlan
      .mutateAsync(planId)
      .then((deleted) => (deleted ? router.push('/app/home') : router.push('/app/home')))
      .catch((err) => {
        console.error(err);
        return false;
      });
  };

  return {
    plan: planData?.plan,
    validation: validationData?.validation,
prereqData: validationData?.prereqValidation,
    isLoading,
    handlePlanDelete,
  };
};

export default usePlan;
