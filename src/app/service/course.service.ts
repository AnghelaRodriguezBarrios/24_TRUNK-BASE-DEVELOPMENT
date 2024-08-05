// src/app/services/course.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CourseModel } from '../model/course-model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private baseUrl: string = 'https://vg-ms-course-production.up.railway.app/course'; // URL base de tu API
  private errorMessage: string = '';

  constructor(private http: HttpClient) {}

  getErrorMessage(): string {
    return this.errorMessage;
  }

  getAllCourses(): Observable<CourseModel[]> {
    const url = `${this.baseUrl}/all`;
    return this.http.get<CourseModel[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  getCourseById(id: string): Observable<CourseModel> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<CourseModel>(url).pipe(
      catchError(this.handleError)
    );
  }

  createCourse(course: CourseModel): Observable<CourseModel> {
    const url = `${this.baseUrl}/create`;
    return this.http.post<CourseModel>(url, course).pipe(
      catchError(this.handleError)
    );
  }

  updateCourse(id: string, course: CourseModel): Observable<CourseModel> {
    const url = `${this.baseUrl}/update/${id}`;
    return this.http.put<CourseModel>(url, course).pipe(
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
