import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators'; // Importation de 'tap' pour manipuler la réponse
import { LoginDto } from '../login/loginDto';
import { RegisterDto } from '../register/registerDto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/account';

  constructor(private http: HttpClient) {}

  login(loginDto: LoginDto): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, loginDto).pipe(
      tap(response => {
        localStorage.setItem('authToken', response.token);
      })
    );
  }

  register(registerDto: RegisterDto): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, registerDto).pipe(
      tap(response => {
        console.log('Registration response:', response);
      }),
      catchError(error => {
        console.error('Registration error:', error);
        let errorMessage = 'An unknown error occurred. Please try again later.';

        // Check for specific error types (e.g., validation errors)
        if (error.status === 400) {
          errorMessage = 'Invalid registration details. Please check your inputs.';
        } else if (error.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        }

        return throwError(errorMessage);
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    const tokenPayload = JSON.parse(atob(token.split('.')[1]));
    return tokenPayload.role;
  }

  logout(): void {
    localStorage.removeItem('authToken');
  }
}
