import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { UserDto } from './userDto';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5000/api/user';

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

  fetchClients(adminId: string): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(`${this.apiUrl}/clients/${adminId}`, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(this.handleError<UserDto[]>('fetchClients', []))
      );
  }

  fetchPrestataires(adminId: string): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(`${this.apiUrl}/prestataires?adminId=${adminId}`, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(this.handleError<UserDto[]>('fetchPrestataires', []))
      );
  }

  addUser(registerDto: any): Observable<any> {
    const adminId = localStorage.getItem('userId');
    registerDto.adminId = adminId;

    console.log("Sending user data to API:", registerDto);

    return this.http.post(`${this.apiUrl}/add`, registerDto, { headers: this.getAuthHeaders() })
      .pipe(
        catchError((error) => {
          console.error("Add user error:", error); // Log any error from the API
          return throwError(error);
        })
      );
  }

  updateUser(userDto: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update`, userDto, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(this.handleError<any>('updateUser'))
      );
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(this.handleError<any>('deleteUser'))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`); // Log the error
      return throwError(error || 'Server error');  // Return a readable error
    };
  }
}
