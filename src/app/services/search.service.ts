import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SearchTerm } from '../models/search.model';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private apiEndpoint = environment.APIEndpoint;

  constructor(private http: HttpClient) { }

  search(searchTerm: SearchTerm) {
    let params = new HttpParams();
    params = params.append('tienda', searchTerm.tienda);
    params = params.append('referencia', searchTerm.referencia);

    return this.http.get<any>(`${this.apiEndpoint}/prod`, { params: params });
  }

}
