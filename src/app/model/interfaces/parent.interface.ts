import { StudentModel } from "../student-model";

export interface Parent {
    id: string;
    names: string;
    surnames: string;
    sex: string;
    birth_date: string;
    baptism: string;
    first_Communion: string;
    confirmation: string;
    marriage: string;
    relationship: string;
    email: string;
    cellphone: string;
    address: string;
    documentType: string;
    documentNumber: string;
}

export interface StudentRecord {
    id: string;
    student: StudentModel;
    mother: Parent;
    father: Parent;
    creationDate: string;
    writeDate: string;
    status: string;
}