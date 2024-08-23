import { Component, signal, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { EventService } from '../../services/eventService';
import { EventDto } from '../../models/eventDto';
import { AssignRequestDto } from '../../models/AssignRequestDto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
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

  constructor(private eventService: EventService, private changeDetector: ChangeDetectorRef, private router : Router) {
    console.log('CalendarComponent initialized');
  }

  ngOnInit(): void {
    console.log('ngOnInit called');
    this.loadEvents();
  }

  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }

  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  loadEvents() {
    const role = this.getUserRole();
    const userId = this.getUserId();

    if (!userId) {
      console.error('UserId is missing. Redirecting to login.');
      return;
    }

    if (role && userId) {
      this.eventService.getEvents(userId).subscribe(
        (events) => {
          console.log('Events loaded:', events);

          let filteredEvents = events;

          if (role === 'Client' || role === 'Prestataire') {
            filteredEvents = events.filter(event =>
              (role === 'Client' && event.clientId === userId) ||
              (role === 'Prestataire' && event.prestataireId === userId)
            );
          }

          this.calendarOptions.update((options) => ({
            ...options,
            events: filteredEvents.map((event) => ({
              id: event.id.toString(),
              start: event.dateRequest,
              title: event.description,
              allDay: false,
              extendedProps: {
                description: event.description,
                prestataireName: event.prestataireName,
                adminName: event.adminName,
                eventStatus: event.eventStatus,
                clientName: event.clientName
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
    this.router.navigate(['/ui-components/create-event'], {
      queryParams: { date: dateSelectInfo.startStr }
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
    this.router.navigate(['/ui-components/create-event'], {
      queryParams: { eventId: eventClickInfo.event.id }
    });
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents.set(events);
    this.changeDetector.detectChanges(); // workaround for pressionChangedAfterItHasBeenCheckedError
  }
}
