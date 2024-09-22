import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Prestataire } from '../models/prestataireDto';

@Injectable({
  providedIn: 'root'
})
export class PrestataireService {

  private apiUrl = 'http://localhost:5000/api/user';

  constructor(private http: HttpClient) { }

  getPrestataires(adminId: string): Observable<Prestataire[]> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('No access token found.');
      return throwError('No access token found.');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<Prestataire[]>(`${this.apiUrl}/prestataires`, {
      headers,
      params: new HttpParams().set('adminId', adminId)
    }).pipe(
      catchError(error => {
        console.error('Error fetching prestataires:', error);
        return throwError(error);
      })
    );
  }

  getPrestatairesByPos(posId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/GetPrestatairesByPOS/${posId}`);
  }
}
