
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { TeacherI } from '../model/interfaces/teacher-i';
import { Teacher } from '../model/clases/teacher';
import { environment } from '../environments/environments';


@Injectable({
  providedIn: 'root'
})
export class TeacherService {

  private url = environment.apiTeachers + '/v1';

  constructor(private http: HttpClient) { 
  }

  getTeachers(): Observable<TeacherI[]> {
    return this.http.get<TeacherI[]>(`${this.url}/teachers/active`)
  }

  getTeachersInactives(): Observable<TeacherI[]> {
    return this.http.get<TeacherI[]>(`${this.url}/teachers/inactive`)
  }
  
  addTeacher(teacher: Teacher): Observable<Teacher> { 
    return this.http.post<Teacher>(`${this.url}/teacher`, teacher)
  }

  updateTeacher(id: string, teacher: Teacher): Observable<Teacher> { 
    return this.http.put<Teacher>(`${this.url}/teacher/${id}`, teacher)
  }

  getTeacherById(id:string):Observable<Teacher>{
    return this.http.get<Teacher>(`${this.url}/teacher/${id}`);
  }

  deleteTeacher(id:string):Observable<Object>{
    return this.http.delete(`${this.url}/teacher/removed/${id}`);
  }

  activeTeacher(id:string):Observable<Object>{
    return this.http.put(`${this.url}/teacher/restore/${id}`, id);
  }

  restoreTeacher(id:string): Observable<Object> { 
    return this.http.delete(`${this.url}/teacher/restore/${id}`);
  }

  
}
