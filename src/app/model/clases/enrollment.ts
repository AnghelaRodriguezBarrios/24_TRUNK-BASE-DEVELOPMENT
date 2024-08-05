import { Parent } from "../interfaces/parent.interface";
import { StudentModel } from "../student-model";

export class Enrollment {
    studentId?: StudentModel;
    motherId?: Parent;
    fatherId?: Parent;
}

export interface IEnrollment {
  studentId?: StudentModel;
  motherId?: Parent;
  fatherId?: Parent;
}

export class EnrollmentUpdate { 
    studentId?: string;
    motherId?: string;
    fatherId?: string;
}
