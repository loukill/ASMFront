import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { UserDto } from '../models/userDto';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  getUserById(Id: string): Observable<UserDto> {
    console.log('Fetching user details for ID:', Id);
    return this.http.get<UserDto>(`${this.apiUrl}/user/${Id}`).pipe(
      catchError(error => {
        console.error('Error fetching user details:', error);
        throw error;
      })
    );
  }

  updateUser(user: UserDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/user/update`, user).pipe(
      catchError(error => {
        console.error('Error updating user:', error);
        throw error; // Rethrow the error to be handled by the component
      })
    );
  }
}
