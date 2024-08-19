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

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FullCalendarModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
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
    events: [], // Les événements seront chargés ici dynamiquement
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

  constructor(private eventService: EventService, private changeDetector: ChangeDetectorRef) {
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
              allDay: false,
              extendedProps: {
                description: event.description,
                prestataireName: event.prestataireName,
                adminName: event.adminName,
                eventStatus: event.eventStatus
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

  handleDateSelect(selectInfo: DateSelectArg) {
    console.log('handleDateSelect called with:', selectInfo);

    const description = prompt('Please enter the event description');
    const adminName = prompt('Please enter the Admin Name (Leave empty if not applicable)');
    const prestataireName = prompt('Please enter the Prestataire Name (Leave empty if not applicable)');

    if (!description) {
      alert("Description is required.");
      return;
    }

    if (!adminName && !prestataireName) {
      alert("Either Admin Name or Prestataire Name must be provided.");
      return;
    }

    const userId = this.getUserId();
    const role = this.getUserRole();
    if (!userId || !role) {
      console.error('UserId or Role is missing.');
      return;
    }

    const dateRequest = new Date(selectInfo.startStr);
    if (isNaN(dateRequest.getTime())) {
      console.error('Invalid date format.');
      return;
    }

    const clientName = role === 'Client' ? undefined : (prompt('Please enter the Client Name') || undefined);

    if (role !== 'Client' && !clientName) {
      alert("Client Name must be provided if you are not a Client.");
      return;
    }

    const newEventDto: EventDto = {
      description:  description.trim(),
      dateRequest,
      eventStatus: 'Pending',
      adminName: adminName || undefined,
      prestataireName: prestataireName || undefined,
      clientId: role === 'Client' ? userId : undefined,
      prestataireId: role === 'Prestataire' ? userId : undefined,
      clientName
    };

    // Add a check to ensure newEventDto is fully defined before making the API call
    if (newEventDto) {
      this.eventService.createEvent(newEventDto).subscribe(
        (event) => {
          console.log('Event created:', event);
          this.loadEvents();
        },
        (error) => {
          console.error('Error creating event', error);
        }
      );
    } else {
      console.error('newEventDto is undefined');
    }
  }


  handleEventClick(clickInfo: EventClickArg) {
    const event = clickInfo.event;
    alert(`Event: ${event.extendedProps['description']}\nStatus: ${event.extendedProps['eventStatus']}\nPrestataire: ${event.extendedProps['prestataireName']}\nAdmin: ${event.extendedProps['adminName']}`);

    if (confirm(`Are you sure you want to delete the event '${event.extendedProps['description']}'`)) {
      console.log('Event deletion confirmed:', event.extendedProps['description']);
      event.remove();
    } else {
      console.log('Event deletion canceled');
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents.set(events);
    this.changeDetector.detectChanges(); // workaround for pressionChangedAfterItHasBeenCheckedError
  }
}
