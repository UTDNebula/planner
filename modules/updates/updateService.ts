/**
 * Metadata for an app update.
 */
type AppUpdate = {
  /**
   * An app version that uses Semantic Versioning.
   *
   * @example v0.1.0
   * @see http://semver.org/
   */
  version: string;

  /**
   * A user-readable name for this release.
   *
   * @example Open Beta!
   */
  title: string;

  /**
   * A description of the new features and bugfixes for this version.
   */
  changelog: string;
};

/**
 * A hook to check for updates and trigger them.
 */
export function useUpdateService(): UpdateServiceUsable {
  // TODO: Check update form some source
  const updateAvailable = false;
  const newestUpdate = {
    version: 'v0.1.0', // TODO: Find programmatically
    title: 'Comet Planning Open Beta',
    changelog: `The first public release of Comet Planning`,
  };

  const performUpdate = () => {
    // TODO: Invalidate SW cache and refresh page or something
    if (!updateAvailable) {
      return;
    }
  };

  return {
    updateAvailable,
    newestUpdate: newestUpdate,
    performUpdate,
  };
}

type UpdateServiceUsable = {
  /**
   * True if there is an update to apply.
   */
  updateAvailable: boolean;
  /**
   * Information about the newest update.
   */
  newestUpdate: AppUpdate;
  /**
   * Trigger a refresh of the browser to apply updates.
   *
   * If updateAvailable is false, this is a no-op.
   */
  performUpdate: () => void;
};
