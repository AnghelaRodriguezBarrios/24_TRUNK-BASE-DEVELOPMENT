
import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

import { TeacherI } from '../models/interfaces/teacher-i';
import { Teacher } from '../models/clases/teacher';
import { environment } from '../environments/environments';


@Injectable({
  providedIn: 'root'
})
export class TeacherService {

  private url = environment.apiInventario + '/v1';
  private teachersSubject = new BehaviorSubject<Teacher[]>([]);
  teachers$: Observable<Teacher[]> = this.teachersSubject.asObservable();

  constructor(private http: HttpClient) { 
    this.loadInitialData();
  }

  $modal = new EventEmitter<any>();
  $modal2 = new EventEmitter<any>();

  private loadInitialData() {
    this.http.get<TeacherI[]>(`${this.url}/teachers/active`).subscribe(data => {
      this.teachersSubject.next(data);
    });
  }

  getTeachers(): Observable<TeacherI[]> {
    return this.http.get<TeacherI[]>(`${this.url}/teachers/active`)
  }

  getTeachersInactives(): Observable<TeacherI[]> {
    return this.http.get<TeacherI[]>(`${this.url}/teachers/inactive`)
  }
  
  addTeacher(teacher: Teacher): Observable<Teacher> { 
    return this.http.post<Teacher>(`${this.url}/teacher`, teacher).pipe(
      tap((newTeacher) => { 
        const currentTeachers = this.teachersSubject.value;
        this.teachersSubject.next([...currentTeachers, newTeacher]);
      })
    )
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
