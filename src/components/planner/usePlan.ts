import { trpc } from '@/utils/trpc';
import { useRouter } from 'next/router';
import { DegreeValidation, Plan } from './types';

export interface usePlanProps {
  planId: string;
}

export interface usePlanReturn {
  plan?: Plan;
  validation?: DegreeValidation;
  degreeRequirements?: { id: string; major: string };
  prereqData?: Map<string, boolean>;
  bypasses?: string[];
  isPlanLoading: boolean;

  handlePlanDelete: () => Promise<boolean>;
}

const usePlan = ({ planId }: usePlanProps): usePlanReturn => {
  const utils = trpc.useContext();
  const router = useRouter();
  const { data: degreeValidationData, isLoading: validationLoading } =
    trpc.validator.degreeValidator.useQuery(planId);

  const degreeRequirementsQuery = trpc.plan.getDegreeRequirements.useQuery({ planId });

  const planQuery = trpc.plan.getPlanById.useQuery(planId);

  const deletePlan = trpc.plan.deletePlanById.useMutation({
    async onSuccess() {
      await utils.user.getUser.invalidate();
    },
  });

  // Redirect user back to login screen if not signed in
  // Workaround since it's not known how to handle user redirects in tRPC middleware
  // See https://stackoverflow.com/questions/75169481/create-t3-app-redirect-inside-a-trpc-middleware-if-user-is-not-signed
  if (planQuery.error && planQuery.error.data?.code === 'FORBIDDEN') {
    alert('Unauthorized user');
    router.push('/');
  }

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
    plan: planQuery.data?.plan,
    validation: degreeValidationData?.validation,
    degreeRequirements: degreeRequirementsQuery?.data,
    bypasses: degreeValidationData?.bypasses,
    isPlanLoading: planQuery.isLoading || validationLoading || degreeRequirementsQuery.isLoading,

    handlePlanDelete,
  };
};

export default usePlan;
