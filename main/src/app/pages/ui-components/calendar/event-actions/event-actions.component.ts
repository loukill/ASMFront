import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../authentication/services/authService';
import { EventService } from '../services/eventService';
import { PosService } from 'src/app/pages/dashboard/services/PosService';
import { PrestataireService } from '../services/prestataireService';
import { EventDto } from '../models/eventDto';
import { AssignRequestDto } from '../models/AssignRequestDto';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Prestataire } from '../../menu/models/Prestataire';

@Component({
  selector: 'app-event-actions',
  templateUrl: './event-actions.component.html',
  styleUrls: ['./event-actions.component.css']
})
export class EventActionsComponent implements OnInit {
  selectedPosId: number | null = null;
  event: EventDto = {} as EventDto;
  selectedServiceId: number | null = null;
  eventDate: string = '';
  eventTime: string = '';
  posList: any[] = [];
  prestataires: Prestataire[] = [];
  services: any[] = [];
  isEventSelected: boolean = false;
  userRole: string = ''; // Should be set based on the logged-in user
  showPrestataireModal: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private posService: PosService,
    private prestataireService: PrestataireService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const adminId = localStorage.getItem('userId');
    this.route.queryParams.subscribe((params: Params) => {
      const eventId = params['eventId'];
      this.selectedPosId = params['posId'];
      this.userRole = params['userRole'];
      this.selectedServiceId = params['serviceId']

      console.log('EventActionsComponent initialized with:', {
        eventId: eventId,
        selectedPosId: this.selectedPosId,
        userRole: this.userRole,
        selectedServiceId: this.selectedServiceId
      });

      if (eventId) {
        this.loadEvent(eventId);
      }
      if (this.selectedPosId) {
        this.loadPOSList();
        this.loadPrestataires(this.selectedPosId);
      }
    });
  }

  navigateToCalendar(): void {
    this.router.navigate(['/ui-components/calendar']); // Replace '/calendar' with your calendar page route if needed
  }

  loadEvent(eventId: number) {
    this.eventService.getEventById(eventId).subscribe(event => {
      console.log('Event loaded:', event);
      this.event = event;
      this.isEventSelected = true;
      this.eventDate = this.formatDate(event.dateRequest);
      this.eventTime = this.formatTime(event.dateRequest);

      // Log posId and serviceId
      console.log('Event POS ID:', event.posId);
      console.log('Event Service ID:', event.serviceId);

      // Handle POS ID and Service ID if needed
      if (event.posId !== null && event.posId !== undefined) {
        // Optionally load services for the selected POS
        this.loadServices(event.posId);
      } else {
        console.warn('POS ID is missing or invalid.');
      }

      if (event.serviceId !== null && event.serviceId !== undefined) {
        // Optionally perform actions based on the selected service
        console.log('Service ID is set:', event.serviceId);
      } else {
        console.warn('Service ID is missing or invalid.');
      }

    }, error => {
      console.error('Error loading event:', error);
    });
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    return `${d.getFullYear()}-${('0' + (d.getMonth() + 1)).slice(-2)}-${('0' + d.getDate()).slice(-2)}`;
  }

  formatTime(date: Date): string {
    const d = new Date(date);
    return `${('0' + d.getHours()).slice(-2)}:${('0' + d.getMinutes()).slice(-2)}`;
  }


  loadPOSList() {
    this.posService.getPosList().subscribe(posList => this.posList = posList);
  }

  loadPrestataires(posId: number) {
    this.eventService.getPrestataireByPos(posId).subscribe(prestataires => {
      console.log('Prestataires loaded for POS ID:', posId, prestataires);
      this.prestataires = prestataires;
    }, error => {
      console.error('Error loading prestataires for POS ID:', posId, error);
    });
  }

  loadServices(posId: number) {
    this.eventService.getServicesByPos(posId).subscribe(services => {
      console.log('Services loaded:', services);
      this.services = services;

      console.log('Selected service ID:', this.selectedServiceId);
      console.log('Loaded services:', this.services);
      // Assurez-vous que le selectedServiceId correspond à l'un des services chargés
      if (this.selectedServiceId !== null && this.selectedServiceId !== undefined &&
        !this.services.some(service => Number(service.serviceId) === Number(this.selectedServiceId))) {
      console.warn('Selected service ID is not among the loaded services.');
      this.selectedServiceId = null; // Réinitialiser l'ID du service sélectionné si nécessaire
    } else {
      console.log('Selected service ID is valid and exists in the loaded services.');
    }
    }, error => {
      console.error('Error loading services:', error);
    });
  }

  onPosChange() {
    console.log('POS changed to:', this.selectedPosId);
    if (this.selectedPosId) {
      this.loadServices(this.selectedPosId);
    }
  }

  onSubmit() {
    if (this.isEventSelected) {
      console.log('Submitting event with selectedServiceId:', this.selectedServiceId);

      if (this.selectedServiceId !== null && this.selectedServiceId !== undefined &&
        !this.services.some(service => Number(service.serviceId) === Number(this.selectedServiceId))) {
      console.warn('Selected service ID is not among the loaded services.');
      this.selectedServiceId = null; // Réinitialiser l'ID du service sélectionné si nécessaire
    } else {
      console.log('Selected service ID is valid and exists in the loaded services.');
    }

      if (this.userRole === 'Client') {
        this.updateEvent();
        this.deleteEvent();
      } else if (this.userRole === 'Admin') {
        this.assignEvent();
        this.handlePrestataireAction();
      } else if (this.userRole === 'Prestataire') {
        this.handlePrestataireAction();
      }
    }
  }

  updateEvent() {
    const updatedEvent: EventDto = {
      id: this.event.id,
      posId: this.selectedPosId!,
      description: this.event.description,
      prestataireName: this.event.prestataireName,
      clientName: this.event.clientName,
      eventStatus: this.event.eventStatus,
      serviceId: this.selectedServiceId!,
      dateRequest: this.handleDateInput(this.eventDate, this.eventTime),
    };

    this.eventService.updateEvent(updatedEvent).subscribe(response => {
      console.log('Event updated:', response);
      this.navigateToCalendar();
    });
  }

  // Example function to handle date string input
  handleDateInput(dateStr: string, timeStr: string): Date {
  return new Date(dateStr + 'T' + timeStr);
  }


  deleteEvent() {
    if (this.event.id) {
      this.eventService.deleteEvent(this.event.id).subscribe(response => {
        console.log('Event deleted:', response);
        this.navigateToCalendar();
      });
    }
  }

  acceptEvent() {
    if (this.event.id) {
      this.eventService.acceptEvent(this.event.id).subscribe(response => {
        console.log('Event accepted:', response);
        this.navigateToCalendar();
      });
    }
  }

  rejectEvent() {
    if (this.event.id) {
      this.eventService.rejectEvent(this.event.id).subscribe(response => {
        console.log('Event rejected:', response);
        this.navigateToCalendar();
      });
    }
  }

  assignEvent() {
    const requestDto: AssignRequestDto = {
      eventId: this.event.id!,
      prestataireName: this.event.prestataireName || '',
    };

    this.eventService.assignRequest(requestDto).subscribe(response => {
      console.log('Event assigned:', response);
      this.navigateToCalendar();
    });
  }

  handlePrestataireAction() {
    this.acceptEvent();
    this.rejectEvent();
  }

  openPrestataireModal() {
    this.showPrestataireModal = true;
  }

  closePrestataireModal() {
    this.showPrestataireModal = false;
  }

  handlePrestataireSelection(prestataireName?: string) {
    this.event.prestataireName = prestataireName;
    this.closePrestataireModal();
  }

  resetForm() {
    this.selectedPosId = null;
    this.event = {} as EventDto;
    this.selectedServiceId = null;
    this.eventDate = '';
    this.eventTime = '';
    this.isEventSelected = false;
  }
}
