import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prestataire } from '../models/prestataireDto';

@Injectable({
  providedIn: 'root'
})
export class PrestataireService {

  private apiUrl = 'http://localhost:5000/api/user';

  constructor(private http: HttpClient) { }

  getPrestataires(): Observable<Prestataire[]> {
    return this.http.get<Prestataire[]>(`${this.apiUrl}/prestataires`);
  }
}
