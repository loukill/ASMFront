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

  fetchClients(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(`${this.apiUrl}/clients`);
  }

  fetchPrestataires(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(`${this.apiUrl}/prestataires`);
  }

  addUser(registerDto: any): Observable<any> {
    const url = `${this.apiUrl}/add`;
    return this.http.post(url, registerDto).pipe(
      catchError(this.handleError<any>('addUser'))
    );
  }

  updateUser(userDto: any): Observable<any> {
    const url = `${this.apiUrl}/update`;
    return this.http.put(url, userDto).pipe(
      catchError(this.handleError<any>('updateUser'))
    );
  }

  deleteUser(id: string): Observable<any> {
    const url = `${this.apiUrl}/delete/${id}`;
    return this.http.delete(url).pipe(
      catchError(this.handleError<any>('deleteUser'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      return throwError(error || 'Server error');  // Utiliser throwError
    };
  }

}
