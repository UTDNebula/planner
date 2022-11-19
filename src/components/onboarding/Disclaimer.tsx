/**
 * Data gathered when submitting the disclaimer and consent form.
 */
export type ConsentInfo = {
  /**
   * True if the user understands that this is not an official university service.
   */
  disclaimer: boolean;

  /**
   * True if the user consents to user personalization.
   */
  personalization: boolean;

  /**
   * True if the user consents to basic analytics collection.
   */
  analytics: boolean;

  /**
   * True if the user consents to collecting performance data;
   */
  performance: boolean;
};
