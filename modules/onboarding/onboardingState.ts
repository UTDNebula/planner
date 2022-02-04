/**
 * A hook that keeps track of what aspects of the user have been onboarded.
 *
 * TODO: Implement when integrating onboarding to rest of app
 * TODO: Track what features the user has used to enable nudges later.
 */
export function useOnboardingState(): OnboardingState {
  const isOnboarded = Boolean(localStorage.getItem('onboarded')) || false;
  return {
    isOnboarded,
  };
}

/**
 * Information tracked during user onboarding.
 */
type OnboardingState = {
  isOnboarded: boolean;
};
