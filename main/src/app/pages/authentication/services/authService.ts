import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject  } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LoginDto } from '../login/loginDto';
import { RegisterDto } from '../register/registerDto';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/account';

  constructor(private http: HttpClient, private router: Router) {}

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

  checkValidationStatus(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/check-validation-status/${userId}`);
}

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  isTokenExpired(token: string): boolean {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiry = payload.exp;
    const now = Math.floor(Date.now() / 1000);

    return now >= expiry;
  }

  getUserRole(): string | null {
    const userRole = localStorage.getItem('userRole');
    return userRole || null;
  }

  getCurrentUserId(): string | null {
    try {
      const userId = localStorage.getItem('userId');
      return userId;  // Retourne directement la chaîne de caractères
    } catch (error) {
      console.error('Error retrieving userId from localStorage:', error);
      return null;
    }
  }

  forgotPassword(data: any): Observable<string> {
    return this.http.post('http://localhost:5000/api/account/forgot-password', data, { responseType: 'text' });
}

  resetPassword(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, data);
  }

  logout() {
    const userId = localStorage.getItem('userId');

    if (userId) {
      this.http.post(`${this.apiUrl}/logout`, { userId }).subscribe(
        () => {
          // On successful logout, clear the session
          this.clearSession();
        },
        (error) => {
          console.error('Logout failed', error);
        }
      );
    } else {
      console.error('User ID not found');
    }
  }

  private clearSession() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');

    // Redirect to login page
    this.router.navigate(['/authentication/login']);
  }
}
