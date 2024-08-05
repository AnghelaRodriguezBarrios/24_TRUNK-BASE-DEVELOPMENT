import { Injectable } from '@angular/core';
  import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
  import { Inventory } from '../model/inventory';
  
  @Injectable({
    providedIn: 'root'
  })
export class InventoryService {

    private baseUrl = 'http://localhost:8080/api/inventory'; // Ajusta la URL base según tu configuración de backend
  
    constructor(private http: HttpClient) { }
  
    getAllInventories(){
      return this.http.get<Inventory[]>(`${this.baseUrl}`);
    }
  
    getInventoryById(id: string) {
      return this.http.get<Inventory>(`${this.baseUrl}/${id}`);
    }
  
    createInventory(inventory: Inventory){
      return this.http.post<Inventory>(`${this.baseUrl}`, inventory);
    }
  
    updateInventory(id: string, inventory: Inventory){
      return this.http.put<Inventory>(`${this.baseUrl}/${id}`, inventory);
    }
  
    deleteInventory(id: string) {
      return this.http.delete(`${this.baseUrl}/${id}`);
    }
  
    searchByDescription(description: string){
      const params = new HttpParams().set('description', description);
      return this.http.get<Inventory[]>(`${this.baseUrl}/search/description`, { params });
    }
  
    searchByArea(area: string){
      const params = new HttpParams().set('area', area);
      return this.http.get<Inventory[]>(`${this.baseUrl}/search/area`, { params });
    }
  
    searchByCode(code: string){
      const params = new HttpParams().set('code', code);
      return this.http.get<Inventory[]>(`${this.baseUrl}/search/code`, { params });
    }
  
    searchByStatus(status: string){
      const params = new HttpParams().set('status', status);
      return this.http.get<Inventory[]>(`${this.baseUrl}/search/status`, { params });
    }
  }
