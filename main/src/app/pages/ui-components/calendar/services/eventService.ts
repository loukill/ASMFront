import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Event } from '../models/event';
import { EventDto } from '../models/eventDto';
import { AssignRequestDto } from '../models/AssignRequestDto';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  getEvents(userId: string): Observable<Event[]> {
    const params = new HttpParams().set('userId', userId);
    return this.http.get<Event[]>(`${this.apiUrl}/events`, { params }).pipe(
      catchError(error => {
        console.error('Error fetching events:', error);
        return throwError(error);
      })
    );
  }

  getEventsByUserId(userId: string): Observable<EventDto[]> {
    return this.http.get<EventDto[]>(`${this.apiUrl}/events/user/${userId}`);
  }

  getServicesByPos(posId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/service/GetServicesByPOS/${posId}`);
  }

  getPrestataireByPos(posId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/GetPrestatairesByPOS/${posId}`);
  }

  createEvent(eventDto: EventDto): Observable<any> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      return throwError('No access token found.');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(`${this.apiUrl}/events/createrequest`, eventDto, { headers }).pipe(
      catchError(error => {
        console.error('Error creating event:', error);
        return throwError(error);
      })
    );
  }

  assignRequest(requestDto: AssignRequestDto): Observable<any> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      return throwError('No access token found.');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(`${this.apiUrl}/events/assignrequest`, requestDto, { headers }).pipe(
      catchError(error => {
        console.error('Error assigning event:', error);
        return throwError(error);
      })
    );
  }

  getEventById(id: number): Observable<EventDto> {
    return this.http.get<EventDto>(`${this.apiUrl}/events/${id}`).pipe(
      catchError(error => {
        console.error('Error fetching event by ID:', error);
        return throwError(error);
      })
    );
  }

  updateEvent(event: EventDto): Observable<void> {
    const url = `${this.apiUrl}/events/${event.id}`;
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.put<void>(url, event, { headers }).pipe(
      catchError(error => {
        console.error('Error updating event:', error);
        return throwError(error);
      })
    );
  }

  deleteEvent(eventId: number): Observable<void> {
    const url = `${this.apiUrl}/events/${eventId}`;
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.delete<void>(url, { headers }).pipe(
      catchError(error => {
        console.error('Error deleting event:', error);
        return throwError(error);
      })
    );
  }

  acceptEvent(eventId: number): Observable<any> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      return throwError('No access token found.');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/events/accept/${eventId}`, {}, { headers });
  }

  rejectEvent(eventId: number): Observable<any> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      return throwError('No access token found.');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/events/reject/${eventId}`, {}, { headers });
  }

  getService(): Observable<any> {
    return this.http.get<any>('http://localhost:5000/api/service')
  }
}
