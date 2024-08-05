export interface IApoderado {
    id: number;
    names:string;
    surnames:string;
    sex:string;
    birth_date: string;
    baptism:string;
    first_Communion:string;
    confirmation:string;
    marriage: string;
    relationship:string;
    email:string;
    cellphone:string;
    address: string;
    documentType:string;
    documentNumber: string;
    status:string | undefined;
}