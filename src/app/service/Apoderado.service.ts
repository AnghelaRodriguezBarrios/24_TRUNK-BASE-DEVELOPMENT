import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IApoderado } from 'src/app/model/IApoderado';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApoderadoService {
  getAll() {
    throw new Error('Method not implemented.');
  }

  constructor(private httpClient: HttpClient) { }


  RUTA_API = "http://localhost:8080/attorney/";

  public listar() {
    return this.httpClient.get('http://localhost:8080/attorney/actives');
  }


  public listarByState(state: number) {
    return this.httpClient.get('http://localhost:8080/attorney/'+ state);
  }

  
  public save(body:any) {
    console.log(body)
    return this.httpClient.post(this.RUTA_API + 'create', body)
  }

  public editar(id: string, bodyRq: IApoderado) {
    console.log(bodyRq);
    return this.httpClient.put(this.RUTA_API + 'update/' + id, bodyRq);
}

public eliminar(id: string) {
  return this.httpClient.delete(this.RUTA_API+ 'delete/' + id );
}

  public activar(id: string) {
    return this.httpClient.put(this.RUTA_API + 'reactivate/' + id, null);
  }

  public buscar(rq: IApoderado) {

    const options =
      { params: new HttpParams().set('names', rq.names).set('surnames', rq.surnames).set('documentNumber', rq.documentNumber)}

    return this.httpClient.get(this.RUTA_API + 'buscar', options);
  }

  public listarInactivos() {
    return this.httpClient.get(this.RUTA_API + 'inactive');
  }
}
