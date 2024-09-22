import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { POSWithDetails } from '../models/PosWithDetails';

@Injectable({
  providedIn: 'root'
})
export class PosService {
  private apiUrl = 'http://localhost:5000/api/POS';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    if (token) {
      return new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });
    } else {
      return new HttpHeaders({
        'Content-Type': 'application/json'
      });
    }
  }

  getPosList(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  getPOSByAdminId(adminId: string): Observable<POSWithDetails[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<POSWithDetails[]>(`${this.apiUrl}/admin/${adminId}`, {headers});
  }

  getPOSById(posId: number): Observable<POSWithDetails> {
    return this.http.get<POSWithDetails>(`${this.apiUrl}/${posId}`);
  }

  createPOS(pos: POSWithDetails): Observable<POSWithDetails>{
    const headers = this.getAuthHeaders();
    return this.http.post<POSWithDetails>(this.apiUrl, pos, {headers})
  }

  updatePOS(id: number, updatedPOS: POSWithDetails): Observable<POSWithDetails> {
    const headers = this.getAuthHeaders();
    return this.http.put<POSWithDetails>(`${this.apiUrl}/${id}`, updatedPOS, {headers});
  }

  // Méthode pour supprimer un POS
  deletePOS(id: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {headers});
  }
}
