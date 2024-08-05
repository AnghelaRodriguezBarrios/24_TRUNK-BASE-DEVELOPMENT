import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Payment } from '../model/payment.interface';  
import { environment } from '../environments/environments';  
import { tap,catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private url: string = environment.apiPago; 

  constructor(private http: HttpClient) { }

  getAllPayments() {
    return this.http.get<Payment[]>(this.url);
  }

  getActivePayments() {
    return this.http.get<Payment[]>(`${this.url}/active`);
  }

  getInactivePayments() {
    return this.http.get<Payment[]>(`${this.url}/inactive`);
  }

  getPaymentById(id: string) {
    return this.http.get<Payment>(`${this.url}/${id}`);
  }

  createPayment(payment: Payment) {
    return this.http.post<Payment>(this.url, payment);
  }

  updatePayment(id: string, payment: Payment) {
    return this.http.put<Payment>(`${this.url}/${id}`, payment);
  }

  deletePayment(id: string) {
    return this.http.put<Payment>(`${this.url}/deactivate/${id}`, null);
  }

  activatePayment(id: string) {
    return this.http.put<void>(`${this.url}/activate/${id}`, {})
      .pipe(
        catchError((error) => {
          console.error('Error al reactivar el pago:', error);
          return throwError('Error al reactivar el pago. Por favor, inténtelo de nuevo.');
        })
      );
  }  
}
