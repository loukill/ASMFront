import { Component, OnInit } from '@angular/core';
import { EventService } from '../services/eventService';
import { PrestataireService } from '../services/prestataireService';
import { AuthService } from '../../../authentication/services/authService';
import { EventDto } from '../models/eventDto';
import { Prestataire } from '../models/prestataireDto';
import { AssignRequestDto } from '../models/AssignRequestDto';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent implements OnInit {
  event: EventDto = {
    description: '',
    adminName: '',
    prestataireName: '',
    clientName: '',
    dateRequest: new Date(),
    eventStatus: 'Pending'
  };

  eventDate: string = '';
  eventTime: string = '';
  isEventSelected: boolean = false;
  userRole: string = '';
  prestataires: Prestataire[] = [];
  showPrestataireModal = false;

  constructor(
    private eventService: EventService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private prestataireService: PrestataireService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const eventId = params['eventId'];
      if (eventId) {
        this.onEventClick(eventId);
      }
    });
    this.userRole = this.authService.getUserRole() ?? '';
    console.log('User role:', this.userRole);
    this.loadPrestataires();
  }

  loadPrestataires() {
    this.prestataireService.getPrestataires().subscribe(
      (data) => {
        console.log('Prestataires fetched:', data);
        this.prestataires = data ?? [];
      },
      (error) => {
        console.error('Error fetching prestataires', error);
      }
    );
  }

  togglePrestataireDropdown() {
    this.showPrestataireModal = !this.showPrestataireModal;
  }

  onSubmit() {
    if (this.isEventSelected) {
      this.updateEvent();
    } else {
      this.createEvent();
    }
  }

  createEvent() {
    const combinedDateTime = this.combineDateAndTime(this.eventDate, this.eventTime);
    this.event.dateRequest = combinedDateTime;

    this.eventService.createEvent(this.event).subscribe(
      (response) => {
        console.log('Event created successfully:', response);
        alert('Event created successfully!');
        //this.resetForm();
      },
      (error) => {
        console.error('Error creating event:', error);
        alert('Failed to create event.');
      }
    );
  }


  combineDateAndTime(date: string, time: string): Date {
    const combinedDateTime = new Date(date);
    const [hours, minutes] = time.split(':');
    combinedDateTime.setHours(+hours);
    combinedDateTime.setMinutes(+minutes);
    return combinedDateTime;
  }


  assignEvent(prestataireName: string) {
    if (this.event.id && prestataireName) {
      const assignRequestDto: AssignRequestDto = {
        eventId: this.event.id,
        prestataireName: prestataireName
      };

      this.eventService.assignRequest(assignRequestDto).subscribe(
        (response) => {
          console.log('Event assigned successfully:', response);
          alert('Event assigned successfully!');
          this.closePrestataireModal();
        },
        (error) => {
          console.error('Error assigning event:', error);
          alert('Failed to assign event.');
        }
      );
    } else {
      alert('Event ID and Prestataire Name are required.');
    }
  }

  updateEvent() {
    if (!this.event.id) {
      alert('Select an event to update');
      return;
    }

    const combinedDateTime = this.combineDateAndTime(this.eventDate, this.eventTime);
    this.event.dateRequest = combinedDateTime;

    this.eventService.updateEvent(this.event).subscribe(
      (response) => {
        console.log('Event updated successfully:', response);
        alert('Event updated successfully!');
        //this.resetForm();
        this.isEventSelected = false;
      },
      (error) => {
        console.error('Error updating event:', error);
        alert('Failed to update event.');
      }
    );
  }

  deleteEvent() {
    if (!this.event.id) {
      alert('Select an event to delete');
      return;
    }

    if (confirm('Are you sure you want to delete this event?')) {
      this.eventService.deleteEvent(this.event.id).subscribe(
        (response) => {
          console.log('Event deleted successfully:', response);
          alert('Event deleted successfully!');
          //this.resetForm();
          this.isEventSelected = false;
        },
        (error) => {
          console.error('Error deleting event:', error);
          alert('Failed to delete event.');
        }
      );
    }
  }

  onEventClick(eventId: number) {
    this.eventService.getEventById(eventId).subscribe(
      (eventData: EventDto) => {
        console.log('Event data:', eventData);
        this.event = eventData;
        this.eventDate = new Date(eventData.dateRequest).toISOString().split('T')[0];
        this.eventTime = new Date(eventData.dateRequest).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        this.isEventSelected = true;
      },
      (error) => {
        console.error('Error fetching event details:', error);
        alert('Failed to fetch event details.');
      }
    );
  }

  openPrestataireModal() {
    this.showPrestataireModal = true;
  }

  closePrestataireModal() {
    this.showPrestataireModal = false;
  }

  handlePrestataireSelection(prestataireName: string) {
    this.assignEvent(prestataireName);
  }

  acceptEvent(eventId: number) {
    const token = localStorage.getItem('authToken');
    if (token) {
      this.eventService.acceptEvent(eventId, token).subscribe({
        next: (response) => {
          console.log('Event accepted:', response);
        },
        error: (error) => {
          console.error('Error accepting event:', error);
        }
      });
    }
  }

  rejectEvent(eventId: number) {
    const token = localStorage.getItem('authToken');
    if (token) {
      this.eventService.rejectEvent(eventId, token).subscribe({
        next: (response) => {
          console.log('Event rejected:', response);
        },
        error: (error) => {
          console.error('Error rejecting event:', error);
        }
      });
    }
  }

  // resetForm() {
  //   this.event = {
  //     description: '',
  //     adminName: '',
  //     prestataireName: '',
  //     clientName: '',
  //     dateRequest: new Date(),
  //     eventStatus: 'Pending'
  //   };
  //   this.eventDate = '';
  //   this.eventTime = '';
  //   this.isEventSelected = false;
  // }
}
