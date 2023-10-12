// Generic error thrown from any validator (external) errors.
export class DegreeValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DegreeValidationError';
  }
}

// Error thrown when validator (external) indicates that degree is not found.
export class DegreeNotFound extends DegreeValidationError {
  constructor(message: string) {
    super(message);
  }
}
