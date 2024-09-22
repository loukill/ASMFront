import { Component, OnInit } from '@angular/core';
import { EventService } from '../services/eventService';
import { PrestataireService } from '../services/prestataireService';
import { AuthService } from '../../../authentication/services/authService';
import { PosService } from 'src/app/pages/dashboard/services/PosService';
import { EventDto } from '../models/eventDto';
import { Prestataire } from '../models/prestataireDto';
import { AssignRequestDto } from '../models/AssignRequestDto';
import { ActivatedRoute } from '@angular/router';
import { Service } from '../models/Service';
import { Router } from '@angular/router';

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
  submitted: boolean = false;

  eventDate: string = '';
  eventTime: string = '';
  isEventSelected: boolean = false;
  userRole: string = '';
  prestataires: Prestataire[] = [];
  showPrestataireModal = false;
  posId: number | null = null;
  services: Service[] = [];
  selectedServiceId: number | null = null;
  posList: any[] = [];
  selectedPosId: number | null = null;

  constructor(
    private eventService: EventService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private prestataireService: PrestataireService,
    private posService: PosService,
    private router : Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const selectedDate = params['date'];
      this.eventDate = selectedDate
        ? new Date(selectedDate).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];

      const currentTime = new Date();
      this.eventTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      this.selectedPosId = params['posId'] ? +params['posId'] : null;
    });

    this.userRole = this.authService.getUserRole() ?? '';
    this.loadPos();
  }

  onPosChange() {
    if (this.selectedPosId) {
      this.loadPrestatairesForPos(this.selectedPosId);
      this.loadServicesForPos(this.selectedPosId);
    }
  }

  loadPrestatairesForPos(posId: number) {
    this.prestataireService.getPrestatairesByPos(posId).subscribe(
      (data) => {
        this.prestataires = data ?? [];
      },
      (error) => {
        console.error('Error fetching prestataires for POS', error);
      }
    );
  }

  loadServicesForPos(posId: number) {
    this.eventService.getServicesByPos(posId).subscribe(
      (data) => {
        this.services = data ?? [];
      },
      (error) => {
        console.error('Error fetching services for POS', error);
      }
    );
  }

  loadPos() {
    this.posService.getPosList().subscribe(
      (data) => this.posList = data,
      (error) => console.error('Error fetching POS list:', error)
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
    console.log('Creating event with POS ID:', this.posId);

    if (this.selectedPosId === null) {
      alert('Please select a POS.');
      return;
    }

    if (this.selectedServiceId === null) {
      console.error('Service ID is not selected.');
      alert('Service ID must be selected.');
      return;
    }

    const combinedDateTime = this.combineDateAndTime(this.eventDate, this.eventTime);
    this.event.dateRequest = combinedDateTime;
    this.event.posId = this.selectedPosId;
    this.event.serviceId = this.selectedServiceId;

    this.eventService.createEvent(this.event).subscribe(
      (response) => {
        console.log('Event created successfully:', response);
        alert('Event created successfully!');
        this.router.navigate(['/ui-components/calendar'])
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
    this.eventService.acceptEvent(eventId).subscribe({
      next: (response) => {
        console.log('Event accepted:', response);
      },
      error: (error) => {
        console.error('Error accepting event:', error);
      }
    });
  }

  rejectEvent(eventId: number) {
    this.eventService.rejectEvent(eventId).subscribe({
      next: (response) => {
        console.log('Event rejected:', response);
      },
      error: (error) => {
        console.error('Error rejecting event:', error);
      }
    });
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
