import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Manager } from '../model/manager.interface';  // Asegúrate de importar correctamente tu interfaz Manager
import { environment } from '../environments/environments';  // Asegúrate de importar correctamente el entorno
import { tap,catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ManagerService {

  private url: string = environment.apiInventario; 

  constructor(private http: HttpClient) { }

  getAllManagers() {
    return this.http.get<Manager[]>(`${this.url}`)
    .pipe(
      tap(managers => console.log('managers listandose: ', managers)),
      catchError(error => {
        console.error('Error al listar managers: ', error);
        throw error;
      } 
    ));
  }

  getManagerById(id: string) {
    return this.http.get<Manager>(`${this.url}/${id}`);
  }

  createManager(manager: Manager) {
    return this.http.post<Manager>(this.url, manager);
  }

  updateManager(id: string, manager: Manager) {
    return this.http.put<Manager>(`${this.url}/${id}`, manager);
  }

  deleteManager(id: string) {
    return this.http.delete<Manager>(`${this.url}/deactivate/${id}`);
  }

  activateManager(id: string) {
    return this.http.put<Manager>(`${this.url}/activate/${id}`, {});
  }

  getActiveManagers() {
    return this.http.get<Manager[]>(`${this.url}/active`);
  }

  getInactiveManagers() {
    return this.http.get<Manager[]>(`${this.url}/inactive`);
  }
}
