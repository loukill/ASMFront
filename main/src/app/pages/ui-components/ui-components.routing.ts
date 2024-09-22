import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarComponent } from './calendar/components/fullcalendar-basic/calendar.component';
import { AppChipsComponent } from './chips/chips.component';
import { AppListsComponent } from './lists/lists.component';
import { PosListComponent } from './menu/pos-list.component';
import { AppTooltipsComponent } from './tooltips/tooltips.component';
import { EventFormComponent } from './calendar/event-form/event-form.component';
import { EventActionsComponent } from './calendar/event-actions/event-actions.component';
import { PosDetailsComponent } from './menu/pos-details/pos-details.component';
import { PosEditComponent } from './menu/pos-edit/pos-edit.component';
import { PosAddComponent } from './menu/pos-add/pos-add.component';
import { AddServiceComponent } from './add-service/add-service.component';
import { RoleGuard } from 'src/app/role.guard';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'calendar',
        component: CalendarComponent,
        canActivate: [RoleGuard],
      },
      {
        path: 'chips',
        component: AppChipsComponent,
      },
      {
        path: 'lists',
        component: AppListsComponent,
        canActivate: [RoleGuard],
      },
      {
        path: 'pos-list',
        component: PosListComponent,
      },
      { path: 'pos/:id', component: PosDetailsComponent, canActivate: [RoleGuard]},
      { path: 'add-pos', component: PosAddComponent, canActivate: [RoleGuard] },
      { path: 'pos/edit/:id', component: PosEditComponent, canActivate: [RoleGuard] },
      { path: '', redirectTo: '/pos-list', pathMatch: 'full' },
      {
        path: 'tooltips',
        component: AppTooltipsComponent,
      },
      {
        path: 'create-event',
        component: EventFormComponent,
        canActivate: [RoleGuard],
      },
      {
        path: 'selected-event',
        component: EventActionsComponent,
        canActivate: [RoleGuard],
      },
      { path: 'add-service', component: AddServiceComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UiComponentsRoutingModule {}
