// src/app/services/course-competences.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CourseCompetencesModel } from '../model/courseCompetences-model';

@Injectable({
  providedIn: 'root'
})
export class CourseCompetencesService {
  private baseUrl: string = 'https://vg-ms-competency-production.up.railway.app/competency'; // URL base de tu API
  private errorMessage: string = '';

  constructor(private http: HttpClient) {}

  getErrorMessage(): string {
    return this.errorMessage;
  }

  getAllCompetences(): Observable<CourseCompetencesModel[]> {
    const url = `${this.baseUrl}/all`;
    return this.http.get<CourseCompetencesModel[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  getCompetenceById(id: string): Observable<CourseCompetencesModel> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<CourseCompetencesModel>(url).pipe(
      catchError(this.handleError)
    );
  }

  createCompetence(competence: CourseCompetencesModel): Observable<CourseCompetencesModel> {
    const url = `${this.baseUrl}/create`;
    return this.http.post<CourseCompetencesModel>(url, competence).pipe(
      catchError(this.handleError)
    );
  }

  updateCompetence(id: string, competence: CourseCompetencesModel): Observable<CourseCompetencesModel> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.put<CourseCompetencesModel>(url, competence).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Unknown error';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 404:
          errorMessage = 'Resource not found';
          break;
        case 500:
          errorMessage = 'Internal server error';
          break;
        default:
          errorMessage = `Error code: ${error.status}\nMessage: ${error.message}`;
      }
    }

    this.errorMessage = errorMessage;
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
