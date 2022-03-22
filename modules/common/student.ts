/**
 * The registrar-determined year classification based on credit hours.
 */
export type YearClassification = "fr" | "so" | "ju" | "se" | "gr";

/**
 * All the valid year classifications.
 *
 * @readonly
 * @enum {string}
 */
export const CLASSIFICATIONS: { [key in YearClassification]: string } = {
  fr: "Freshman",
  so: "Sophomore",
  ju: "Junior",
  se: "Senior",
  gr: "Graduate",
};

/**
 * TODO: Store in dynamic fashion
 */
export const MAJORS = {};
