import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Event } from '../models/event';
import { EventDto } from '../models/eventDto';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private apiUrl = 'http://localhost:5000/api/events';

  constructor(private http: HttpClient) {}

  getEvents(userId: string): Observable<Event[]> {
    const params = new HttpParams().set('userId', userId);
    return this.http.get<Event[]>(this.apiUrl, { params });
  }

  createEvent(eventDto: EventDto): Observable<any> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('No access token found.');
      return throwError('No access token found.');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(`${this.apiUrl}/createrequest`, eventDto, { headers }).pipe(
      catchError(error => {
        if (error.error && error.error.errors) {
          console.error('Validation errors:', error.error.errors);
        } else {
          console.error('Error creating event:', error);
        }
        return throwError(error);
      })
    );
  }
}
