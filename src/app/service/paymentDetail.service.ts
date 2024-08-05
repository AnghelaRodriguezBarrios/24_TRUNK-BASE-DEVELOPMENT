import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PaymentDetail } from './../model/paymentDetail.interface';
import { environment } from '../environments/environments';  
import { tap,catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentDetailService {

  private url: string = environment.apiPagoDetalle; 

  constructor(private http: HttpClient) { }

  getAllPaymentDetails() {
    return this.http.get<PaymentDetail[]>(`${this.url}`);
  }

  getPaymentDetailById(id: string) {
    return this.http.get<PaymentDetail>(`${this.url}/${id}`);
  }

  createPaymentDetail(paymentDetail: PaymentDetail) {
    return this.http.post<PaymentDetail>(`${this.url}`, paymentDetail);
  }

  updatePaymentDetail(id: string, paymentDetail: PaymentDetail) {
    return this.http.put<PaymentDetail>(`${this.url}/${id}`, paymentDetail);
  }

  activatePaymentDetail(id: string) {
    return this.http.put<PaymentDetail>(`${this.url}/activate/${id}`, null);
  }

  deletePaymentDetail(id: string) {
    return this.http.put<PaymentDetail>(`${this.url}/deactivate/${id}`, null);
  }
}
