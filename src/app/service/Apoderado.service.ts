import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IApoderado } from 'src/app/model/IApoderado';
import { Observable, map } from 'rxjs';
import { environment } from '../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ApoderadoService {
  getAll() {
    throw new Error('Method not implemented.');
  }

  constructor(private httpClient: HttpClient) { }


  apiUrl = environment.apiAttorney;

  public listar(): Observable<IApoderado[]> {
    return this.httpClient.get<IApoderado[]>(`${this.apiUrl}/actives`);
  }


  public listarByState(state: number) {
    return this.httpClient.get('http://localhost:8080/attorney/'+ state);
  }

  
  public save(body:any) {
    console.log(body)
    return this.httpClient.post(this.apiUrl + 'create', body)
  }

  public editar(id: string, bodyRq: IApoderado) {
    console.log(bodyRq);
    return this.httpClient.put(this.apiUrl + 'update/' + id, bodyRq);
}

public eliminar(id: string) {
  return this.httpClient.delete(this.apiUrl+ 'delete/' + id );
}

  public activar(id: string) {
    return this.httpClient.put(this.apiUrl + 'reactivate/' + id, null);
  }

  public buscar(rq: IApoderado) {

    const options =
      { params: new HttpParams().set('names', rq.names).set('surnames', rq.surnames).set('documentNumber', rq.documentNumber)}

    return this.httpClient.get(this.apiUrl + 'buscar', options);
  }

  public listarInactivos() {
    return this.httpClient.get(this.apiUrl + 'inactive');
  }
}
