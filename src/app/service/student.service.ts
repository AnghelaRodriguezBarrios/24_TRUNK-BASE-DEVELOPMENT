import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { StudentModel } from '../model/student-model'; // Ajusta la ruta segÃºn sea necesario


@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private baseUrl: string;
  private errorMessage: string = '';

  constructor(private http: HttpClient) {
    this.baseUrl = 'https://vs-ms-student-production.up.railway.app/student'; // URL base de tu API
  }

  getErrorMessage(): string {
    return this.errorMessage;
  }

  fetchActiveStudents(): Observable<StudentModel[]> {
    const url = `${this.baseUrl}/actives`;
    return this.http.get<StudentModel[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  fetchInactiveStudents(): Observable<StudentModel[]> {
    const url = `${this.baseUrl}/inactive`;
    return this.http.get<StudentModel[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  createStudent(student: StudentModel): Observable<StudentModel> {
    const url = `${this.baseUrl}/create`;
    return this.http.post<StudentModel>(url, student).pipe(
      catchError(this.handleError)
    );
  }

  updateStudent(id: string, student: StudentModel): Observable<StudentModel> {
    const url = `${this.baseUrl}/update/${id}`;
    return this.http.put<StudentModel>(url, student).pipe(
      catchError(this.handleError)
    );
  }

  deleteStudent(id: string): Observable<void> {
    const url = `${this.baseUrl}/delete/${id}`;
    return this.http.delete<void>(url).pipe(
      catchError(this.handleError)
    );
  }

  reactivateStudent(id: string): Observable<StudentModel> {
    const url = `${this.baseUrl}/reactivate/${id}`;
    return this.http.put<StudentModel>(url, {}).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error desconocido';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else if (error.status === 404) {
      errorMessage = 'Recurso no encontrado';
    } else {
      errorMessage = 'Error en el servidor';
    }

    this.errorMessage = errorMessage;
    console.error(errorMessage);

    return throwError(errorMessage);
  }
}