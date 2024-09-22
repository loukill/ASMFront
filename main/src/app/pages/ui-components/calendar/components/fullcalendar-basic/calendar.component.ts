import { Component, signal, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, ActivatedRoute } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { EventService } from '../../services/eventService';
import { EventDto } from '../../models/eventDto';
import { AssignRequestDto } from '../../models/AssignRequestDto';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FullCalendarModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  userRole: string | null = localStorage.getItem('userRole');
  calendarVisible = signal(true);
  calendarOptions = signal<CalendarOptions>({
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    ],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    initialView: 'dayGridMonth',
    events: [],
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this)
  });
  currentEvents = signal<EventApi[]>([]);
  public posId: string | null = null;

  constructor(
    private eventService: EventService,
    private changeDetector: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute
  ) {
    console.log('CalendarComponent initialized');
  }

  ngOnInit(): void {
    console.log('ngOnInit called');
    this.checkTokenExpiration();
    this.loadEvents();
  }

  checkTokenExpiration(): void {
    const token = localStorage.getItem('authToken');
    if (!token || this.isTokenExpired(token)) {
      console.error('Token is missing or expired. Redirecting to login.');
      this.router.navigate(['/authentication/login']);
    }
  }

  isTokenExpired(token: string): boolean {
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    const now = Math.floor(Date.now() / 1000);
    return expiry < now;
  }

  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }

  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  getPosId() {
    return localStorage.getItem('PosId');
  }

  loadEvents() {
    const role = this.getUserRole();
    const userId = this.getUserId();
    const posId = this.getPosId();

    console.log('Loading events with:', {
      role: role,
      userId: userId,
      posId: posId
    });

    if (!userId) {
      console.error('UserId is missing. Redirecting to login.');
      return;
    }

    if (role) {
      this.eventService.getEventsByUserId(userId).subscribe(
        (events) => {
          console.log('Events loaded:', events);

          let filteredEvents = events;

          if (role === 'Client') {
            filteredEvents = events.filter(event =>
              event.clientId === userId // Assuming clientId and userId are strings
            );
          } else if (role === 'Prestataire') {
            filteredEvents = events.filter(event =>
              event.prestataireId === userId // Assuming prestataireId and userId are strings
            );
          } else if (role === 'Admin') {
            // Check if adminId matches the current logged-in userId (admin)
            filteredEvents = events.filter(event => event.adminId === userId);
          }

          console.log('Filtered events:', filteredEvents);

          this.calendarOptions.update((options) => ({
            ...options,
            events: filteredEvents.map((event) => ({
              id: event.id?.toString(),
              start: event.dateRequest,
              title: event.description,
              allDay: false,
              extendedProps: {
                description: event.description,
                prestataireName: event.prestataireName,
                adminName: event.adminName,
                eventStatus: event.eventStatus,
                clientName: event.clientName,
                posId: event.posId,
                serviceId: event.serviceId
              }
            }))
          }));
        },
        (error) => {
          console.error('Error loading events', error);
        }
      );
    }
  }

  handleCalendarToggle() {
    this.calendarVisible.update((bool) => !bool);
  }

  handleWeekendsToggle() {
    this.calendarOptions.update((options) => ({
      ...options,
      weekends: !options.weekends,
    }));
  }

  handleDateSelect(dateSelectInfo: DateSelectArg) {
    const selectedDate = new Date(dateSelectInfo.startStr).toISOString();
    this.router.navigate(['/ui-components/create-event'], {
      queryParams: { date: selectedDate }
    });
  }

  assignEventToPrestataire(eventId: number, prestataireName: string) {
    if (!this.hasAssignPermission()) {
      alert('You do not have permission to assign this event.');
      return;
    }

    const requestDto: AssignRequestDto = {
      eventId: eventId,
      prestataireName: prestataireName
    };

    this.eventService.assignRequest(requestDto).subscribe(
      (response) => {
        console.log('Event assigned successfully:', response);
        alert('Event assigned successfully!');
      },
      (error) => {
        console.error('Error assigning event:', error);
        alert('Failed to assign event.');
      }
    );
  }

  hasAssignPermission(): boolean {
    return this.userRole === 'Admin' || this.userRole === 'Prestataire';
  }

  handleEventClick(eventClickInfo: EventClickArg) {
    const posId = eventClickInfo.event.extendedProps['posId'];
    const eventId = eventClickInfo.event.id;
    const userRole = this.getUserRole();
    const serviceId = eventClickInfo.event.extendedProps['serviceId'];

    console.log('Handling event click with:', {
      eventId: eventId,
      posId: posId,
      userRole: userRole,
      serviceId: serviceId
    });

    this.router.navigate(['/ui-components/selected-event'], {
      queryParams: {
        eventId: eventId,
        posId: posId,
        userRole: userRole,
        serviceId: serviceId

      }
    });
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents.set(events);
    this.changeDetector.detectChanges(); // workaround for pressionChangedAfterItHasBeenCheckedError
  }
}
