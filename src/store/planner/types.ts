
export interface PlannerAction {
  operation: PlannerActionType;
  data: {
    course: any;
    semesterStart: string;
    semesterEnd: string;
  };
}

/**
 * 
 */
export enum PlannerActionType {
  ADD,
  MOVE,
  DELETE,
}