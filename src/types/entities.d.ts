interface Semester {
  id: import('bson').ObjectIDj;
  code: import('@prisma/client').SemesterCode;
  courses: Course[];
}

interface Course {
  id: ObjectID;
  code: string;
  validation?: { isValid: boolean; override: boolean };
  status?: 'complete' | 'incomplete'; // TODO: Clean this up later once prereq is done
  taken?: boolean;
  transfer?: boolean;
  sync?: { isSynced: boolean; correctSemester: SemesterCode | undefined };
}
