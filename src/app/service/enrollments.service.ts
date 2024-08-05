import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StudentRecord } from '../model/interfaces/parent.interface';
import { Enrollment } from '../model/clases/enrollment';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentsService {

  apiUrl = "https://8400-personal290-msenrollmen-ywt7znxpqq0.ws-us115.gitpod.io/api"

  constructor(private http: HttpClient) { }

  getEnrollmentsActives(): Observable<StudentRecord[]> { 
    return this.http.get<StudentRecord[]>(`${this.apiUrl}/enrollments/active`)
  }

  getEnrollmentsInactives(): Observable<StudentRecord[]> { 
    return this.http.get<StudentRecord[]>(`${this.apiUrl}/enrollments/inactive`)
  }

  getEnrollmentsPending(): Observable<StudentRecord[]> { 
    return this.http.get<StudentRecord[]>(`${this.apiUrl}/enrollments/pendings`)
  }

  postEnrollment(enrollment: Enrollment): Observable<Enrollment> { 
    return this.http.post<Enrollment>(`${this.apiUrl}/enrollment/`, enrollment)
  } 


  deleteEnrollment(id:string):Observable<Object>{
    return this.http.delete(`${this.apiUrl}/enrollment/${id}`);
  }

  updateStatus(id: string, status: string): Observable<void> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.patch<void>(`${this.apiUrl}/enrollment/${id}`, status, { headers })
  }

  updateEnrollment(id: string, enrollment: Enrollment): Observable<Enrollment>{ 
    return this.http.put<Enrollment>(`${this.apiUrl}/enrollment/${id}`, enrollment)
  }

  getEnrollmentById(id: string): Observable<Enrollment> { 
    return this.http.get<Enrollment>(`${this.apiUrl}/enrollment/${id}`)
  }
}
