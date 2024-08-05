export interface PaymentDetail {
    id?: string | undefined;
    payment: string | undefined; 
    maleAttorney: string | undefined; 
    femaleAttorney: string | undefined;
    student: string | undefined;
    amount: number | undefined;
    date: Date | undefined;
    paymentType: string | undefined;
    status: string | undefined;
  }